<template>
  <div class="app-container app-container-acl">
    <el-row :gutter="20" class="app-container-row">
      <splitpanes class="app-container-splitpanes default-theme" @resize="resizeSplit">
        <pane size="16" class="integrated-manage-pane-tree">
        <el-col>
          <div class="integrated-manage-tree-divs">
            <h1 class="supplier-region-dict-h1">角色</h1>
            <div class="head-container-input">
              <el-input v-model="filterText" placeholder="输入关键字进行过滤" clearable suffix-icon="Search" />
            </div>
            <el-scrollbar class="head-container-tree">
          <el-tree ref="treeRef" class="drawer-tree" v-loading="roleLoading || saving" :data="roleOptions"
            :props="{ label: 'roleName', children: 'children' }" node-key="id" highlight-current
            :expand-on-click-node="false" :filter-node-method="filterNode" @node-click="handleNodeClick">
            <template #default="{ data }">
              <span class="custom-tree-node">
                <el-icon><User /></el-icon>
                <el-tooltip :content="`${data.roleName}【${data.roleCode}】`" :show-after="300" placement="top" effect="dark">
                  <span class="over-ellipsis">{{ data.roleName }}【{{ data.roleCode }}】</span>
                </el-tooltip>
              </span>
            </template>
          </el-tree>
       </el-scrollbar>
        </div>
      </el-col>
      </pane>
      <!-- 右侧权限矩阵 -->
     <pane size="84" class="integrated-manage-pane-form">
        <el-col class="app-container-col">
        <el-card shadow="never" class="table-card">
          <template #header>
            <div class="table-card-header">
              <span>菜单权限</span>
              <el-button type="primary" icon="Finished" :loading="saving"
                :disabled="loading || !loadedRoleId || loadedRoleId !== currentRoleId" @click="handleSave">保存</el-button>
            </div>
          </template>
          <el-table v-loading="loading" class="container_table" height="100%" :data="arrAclList" border
            row-key="id" default-expand-all>
            <!-- index 列使用自定义内容，使树形缩进仍落在后面的菜单名称列。 -->
            <el-table-column type="index" width="55" align="center">
              <template #header>
                <el-checkbox :model-value="allSelected" :indeterminate="someSelected && !allSelected"
                  :disabled="loading || saving || !arrAclList.length" aria-label="选择所有菜单"
                  @change="selectAllFun" />
              </template>
              <template #default="{ row }">
                <el-checkbox :model-value="row.isSelect && !row.indeterminate" :indeterminate="row.indeterminate"
                  :disabled="loading || saving" :aria-label="`选择${row.menuName}`"
                  @change="selected => selectFun(row, selected)" />
              </template>
            </el-table-column>
            <el-table-column prop="menuName" label="菜单名称" min-width="500">
              <template #default="{ row }">
                <span>{{ row.menuName }}</span>
                <acl-checkbox v-if="(row.buttonList && row.buttonList.length) || (row.fieldList && row.fieldList.length)"
                  :item="row" :id="row.id" :selected-ids="arrChangeAllObj[row.id] || []"
                  :disabled="loading || saving" @change-all="changeAll" />
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </pane>
    </splitpanes>
    </el-row>
  </div>
</template>

<script setup name="system-acl">
import { Splitpanes, Pane } from "splitpanes"
import "splitpanes/dist/splitpanes.css"
import { rolePage } from '@/api/base/role'
import { aclList, aclAssign } from '@/api/base/acl'
import AclCheckbox from './components/aclCheckbox'

const { proxy } = getCurrentInstance()

const treeRef = ref(null)
const loading = ref(false)
const roleLoading = ref(false)
const saving = ref(false)
const loadedRoleId = ref('')
let aclRequestId = 0
const filterText = ref('')
// 角色树数据
const roleOptions = ref([])
// 当前选中角色 id
const currentRoleId = ref('')
// 权限矩阵树数据
const arrAclList = ref([])
// 各菜单行已勾选的按钮/字段权限 { [menuId]: aclId[] }
const arrChangeAllObj = ref({})
const allSelected = computed(() => arrAclList.value.length > 0 &&
  arrAclList.value.every(item => item.isSelect && !item.indeterminate))
const someSelected = computed(() => arrAclList.value.some(item => item.isSelect))
const resizeSplitData = ref(0)
watch(filterText, val => treeRef.value?.filter(val))

onMounted(() => {
  getRolePage()
})

/** 树过滤：名称/编码文本匹配 */
function filterNode(value, data) {
  if (!value) return true
  return (data.roleName || '').includes(value) || (data.roleCode || '').indexOf(value) !== -1
}

/** 角色列表 */
function getRolePage() {
  roleLoading.value = true
  rolePage().then(({ data }) => {
    roleOptions.value = data.list || []
    roleLoading.value = false
    if (roleOptions.value.length) {
      currentRoleId.value = roleOptions.value[0].id
      nextTick(() => treeRef.value?.setCurrentKey(currentRoleId.value))
      getAclList()
    }
  }).catch(() => { roleLoading.value = false })
}

/** 角色节点点击 */
function handleNodeClick(data) {
  if (saving.value) return
  currentRoleId.value = data.id
  getAclList()
}

/** 权限回显只读取绑定值，不通过表格选择 API 触发子级授权。 */
async function getAclList() {
  const requestId = ++aclRequestId
  const roleId = currentRoleId.value
  loadedRoleId.value = ''
  arrAclList.value = []
  arrChangeAllObj.value = {}
  loading.value = true
  try {
    if (!roleId) return
    const { data } = await aclList({}, roleId)
    if (requestId !== aclRequestId || roleId !== currentRoleId.value) return
    arrAclList.value = data || []
    walkMenus(arrAclList.value, item => {
      const aclIds = [...(item.buttonList || []), ...(item.fieldList || [])]
        .filter(acl => acl.isBind == 1).map(acl => acl.id)
      arrChangeAllObj.value[item.id] = aclIds
      item.isSelect = item.isBind == 1 || aclIds.length > 0
      item.indeterminate = false
    })
    refreshParents(arrAclList.value, true)
    loadedRoleId.value = roleId
  } catch {
    // 请求层统一提示错误；加载失败时保持禁止保存。
  } finally {
    if (requestId === aclRequestId) loading.value = false
  }
}

function walkMenus(list, callback) {
  list.forEach(item => {
    callback(item)
    if (item.children?.length) walkMenus(item.children, callback)
  })
}

/** 自底向上计算祖先状态；回显时保留接口单独绑定的父菜单。 */
function refreshParents(list, preserveBound = false) {
  list.forEach(item => {
    if (!item.children?.length) return
    refreshParents(item.children, preserveBound)
    item.isSelect = (preserveBound && item.isBind == 1) || item.children.some(child => child.isSelect)
    item.indeterminate = item.isSelect &&
      !item.children.every(child => child.isSelect && !child.indeterminate)
  })
}

/** 用户勾选菜单时批量操作该子树，回显和按钮单选不走此逻辑。 */
function setSubtreeSelected(row, selected) {
  walkMenus([row], item => {
    item.isSelect = selected
    item.indeterminate = false
    arrChangeAllObj.value[item.id] = selected
      ? [...(item.buttonList || []), ...(item.fieldList || [])].map(acl => acl.id)
      : []
  })
}

function selectFun(row, selected) {
  setSubtreeSelected(row, selected)
  updateAncestors(row)
}

/** 只更新操作节点的祖先，避免改变其他分支单独绑定的父菜单。 */
function updateAncestors(row) {
  const parents = new Map()
  walkMenus(arrAclList.value, item => {
    item.children?.forEach(child => parents.set(child.id, item))
  })
  let parent = parents.get(row.id)
  while (parent) {
    parent.isSelect = parent.children.some(child => child.isSelect) ||
      (arrChangeAllObj.value[parent.id]?.length || 0) > 0
    parent.indeterminate = parent.isSelect &&
      !parent.children.every(child => child.isSelect && !child.indeterminate)
    parent = parents.get(parent.id)
  }
}

/** 按钮/字段权限独立于菜单访问权，清空按钮不取消菜单。 */
function changeAll(data, id, item) {
  if (loading.value || saving.value) return
  arrChangeAllObj.value[id] = data
  if (data.length > 0) {
    item.isSelect = true
    if (item.children?.length) {
      item.indeterminate = !item.children.every(child => child.isSelect && !child.indeterminate)
    }
    updateAncestors(item)
  }
}

function selectAllFun(selected) {
  arrAclList.value.forEach(item => setSubtreeSelected(item, selected))
}

/** 保存与展示使用同一份状态，祖先菜单随选中的子菜单一并提交。 */
async function handleSave() {
  if (loading.value || saving.value || !loadedRoleId.value || loadedRoleId.value !== currentRoleId.value) return
  const payload = { roleId: loadedRoleId.value, menuIds: [], aclIds: [] }
  walkMenus(arrAclList.value, item => {
    if (item.isSelect) {
      payload.menuIds.push(item.id)
      payload.aclIds.push(...(arrChangeAllObj.value[item.id] || []))
    }
  })
  payload.aclIds = [...new Set(payload.aclIds)]
  saving.value = true
  try {
    const { message } = await aclAssign(payload)
    proxy.$modal.msgSuccess(message)
  } catch {
    // 请求层统一提示错误，保留当前编辑状态以便重试。
  } finally {
    saving.value = false
  }
}

onBeforeUnmount(() => { aclRequestId++ })

const resizeSplit = (val) => {
  resizeSplitData.value = val.event.x
}
</script>

<style lang="scss" scoped>
.splitpanes__pane:nth-child(1) {
  width: 16%;
  min-width: 286px;
}
.app-container-acl {
  .container-row {
    height: 100%;
  }

  .container-col {
    height: 100%;
    display: flex;
    flex-direction: column;

    :deep(.el-card) {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;

      .el-card__body {
        flex: 1;
        overflow: auto;
      }
    }
  }

  .table-card {
    .table-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    :deep(.el-card__body) {
      display: flex;
      flex-direction: column;
      padding: 10px;
    }

    .container_table {
      flex: 1;

      :deep(td) {
        padding: 6px 0;
      }
    }
  }

  .custom-tree-node {
    display: flex;
    align-items: center;
    font-size: 14px;

    .el-icon {
      margin-right: 6px;
    }

    .over-ellipsis {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

}
</style>
