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
          <el-tree ref="treeRef" class="drawer-tree" v-loading="roleLoading" :data="roleOptions"
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
              <el-button type="primary" icon="Finished" @click="handleSave">保存</el-button>
            </div>
          </template>
          <el-table ref="productRef" v-loading="loading" class="container_table" height="100%" :data="arrAclList" border
            row-key="id" default-expand-all :row-class-name="rowClassNameFun" :header-row-class-name="headerRowClassName"
            @select="selectFun" @select-all="selectAllFun">
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column prop="menuName" label="菜单名称" min-width="500">
              <template #default="{ row }">
                <span>{{ row.menuName }}</span>
                <acl-checkbox v-if="(row.buttonList && row.buttonList.length) || (row.fieldList && row.fieldList.length)"
                  :ref="el => setCheckboxRef(el, row.id)" :item="row" :id="row.id" @change-all="changeAll" />
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
const productRef = ref(null)
const loading = ref(false)
const roleLoading = ref(false)
const filterText = ref('')
// 角色树数据
const roleOptions = ref([])
// 当前选中角色 id
const currentRoleId = ref('')
// 权限矩阵树数据
const arrAclList = ref([])
// 各菜单行已勾选的按钮/字段权限 { [menuId]: aclId[] }
const arrChangeAllObj = ref({})
// 复选框组件 ref 集合 { [menuId]: componentInstance }
const checkboxRefs = {}
const resizeSplitData = ref(0)
watch(filterText, val => treeRef.value?.filter(val))

onMounted(() => {
  getRolePage()
})

/** 收集 aclCheckbox 组件 ref */
function setCheckboxRef(el, id) {
  if (el) checkboxRefs[id] = el
  else delete checkboxRefs[id]
}

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
  currentRoleId.value = data.id
  arrChangeAllObj.value = {}
  arrAclList.value = []
  if (data.id) getAclList()
}

/** 权限矩阵数据 */
function getAclList() {
  loading.value = true
  arrChangeAllObj.value = {}
  aclList({}, currentRoleId.value).then(({ data }) => {
    arrAclList.value = data || []
    initData(arrAclList.value)
    nextTick(() => {
      // 递归勾选已绑定菜单（isBind == 1）
      (function selectAllFor(list) {
        list.forEach(item => {
          if (item.isBind == 1) {
            item.isSelect = true
            toggleSelection([item], true)
          }
          if (item.children && item.children.length) selectAllFor(item.children)
        })
      })(arrAclList.value)
      loading.value = false
    })
  }).catch(() => { loading.value = false })
}

/** 初始化：默认全部不选中 */
function initData(data) {
  data.forEach(item => {
    item.isSelect = false
    if (item.children && item.children.length) initData(item.children)
  })
}

/** 保存：收集勾选菜单与按钮/字段权限 */
function handleSave() {
  if (!currentRoleId.value) {
    proxy.$modal.msgError('请先选择角色')
    return
  }
  const arrChangeAll = [];
  (function selectAllFor(list) {
    list.forEach(item => {
      // isSelect 为 true 或 ""（半选）均视为勾选
      if (item.isSelect || item.isSelect === '') {
        arrChangeAll.push({ menuId: item.id, aclIds: arrChangeAllObj.value[item.id] || [] })
      }
      if (item.children && item.children.length) selectAllFor(item.children)
    })
  })(arrAclList.value)
  const objChangeAll = { roleId: currentRoleId.value, menuIds: [], aclIds: [] }
  arrChangeAll.forEach(item => {
    objChangeAll.menuIds.push(item.menuId)
    objChangeAll.aclIds.push(...item.aclIds)
  })
  aclAssign(objChangeAll).then(({ message }) => {
    proxy.$modal.msgSuccess(message)
  })
}

/** aclCheckbox 勾选变化：联动菜单行勾选状态 */
function changeAll(data, id, item) {
  arrChangeAllObj.value[id] = data
  if (item) {
    const len = arrChangeAllObj.value[id].length
    const lens1 = item.buttonList ? item.buttonList.length : 0
    const lens2 = item.fieldList ? item.fieldList.length : 0
    const lens = lens1 + lens2
    if (item.isSelect === false) {
      productRef.value?.toggleRowSelection(item, true)
    } else {
      productRef.value?.toggleRowSelection(item, item.isSelect)
    }
    if (len > 0 && len < lens) {
      item.isSelect = ''
      productRef.value?.toggleRowSelection(item, false)
      setRowIsSelect(item, true)
    }
    if (len === 0) {
      item.isSelect = false
      productRef.value?.toggleRowSelection(item, false)
      setRowIsSelect(item, true)
    }
    if (len === lens) {
      item.isSelect = true
      productRef.value?.toggleRowSelection(item, true)
      setRowIsSelect(item, true)
    }
  }
}

/** 行勾选/取消 */
function selectFun(selection, row) {
  setRowIsSelect(row)
}

/**
 * 树形表格父子级联勾选（保留源项目递归语义）
 * @param row 操作行 @param type true 时仅按既有状态同步子级（不翻转）
 */
function setRowIsSelect(row, type) {
  // 点击父级复选框时，当前状态可能为半选（""），置为 false 并选中，实现子级全选效果
  if (!type) {
    if (row.isSelect === '') {
      row.isSelect = false
      productRef.value?.toggleRowSelection(row, true)
    }
    row.isSelect = !row.isSelect
  }

  // 子级随父级同步
  function selectAllChildrens(data) {
    data.forEach(item => {
      item.isSelect = row.isSelect
      productRef.value?.toggleRowSelection(item, row.isSelect)
      if (item.children && item.children.length) selectAllChildrens(item.children)
      if (checkboxRefs[item.id] && !type) checkboxRefs[item.id].isWatch()
    })
  }

  // 收集子孙选中状态
  function getSelectStatus(arr, data) {
    data.forEach(child => {
      arr.push(child.isSelect)
      if (child.children && child.children.length) getSelectStatus(arr, child.children)
    })
    return arr
  }

  // 节点级别：1 仅父级 / 2 既是子级又是父级 / 3 仅子级 / 4 顶层无子级 / 5 带按钮/字段的子级
  function getLevelStatus(row) {
    if (!row.parentId) {
      return row.children && row.children.length ? 1 : 4
    }
    if ((row.buttonList && row.buttonList.length) || (row.fieldList && row.fieldList.length)) {
      return 5
    } else if (!row.children || !row.children.length) {
      return 3
    }
    return 2
  }

  // 按 parentId 查找父节点对象
  let result = {}
  function getExplicitNode(data, parentId) {
    data.forEach(item => {
      if (item.id == parentId) result = item
      if (item.children && item.children.length) getExplicitNode(item.children, parentId)
    })
    return result
  }

  // 操作子节点后向上回溯：全选→父选true；全不选→false；部分→半选""
  function operateLastLeve(row, type) {
    let statusArr = []
    const item = getExplicitNode(arrAclList.value, row.parentId)
    if (!item.children) return
    statusArr = getSelectStatus(statusArr, item.children)
    if (statusArr.every(v => v === true)) {
      item.isSelect = true
      productRef.value?.toggleRowSelection(item, true)
    } else if (statusArr.every(v => v === false)) {
      if (!type) {
        item.isSelect = false
        productRef.value?.toggleRowSelection(item, false)
      } else {
        item.isSelect = false
      }
    } else {
      item.isSelect = ''
    }
    // 继续向上回溯
    if (item.parentId != null && item.parentId !== '') operateLastLeve(item, type)
  }

  const levelStatus = getLevelStatus(row)
  if (levelStatus == 1) {
    selectAllChildrens(row.children)
  } else if (levelStatus == 2) {
    selectAllChildrens(row.children)
    operateLastLeve(row)
  } else if (levelStatus == 3) {
    operateLastLeve(row)
  } else if (levelStatus == 5) {
    selectAllChildrens([row])
    operateLastLeve(row, type)
  }
  if (checkboxRefs[row.id] && !type) checkboxRefs[row.id].isWatch()
}

/** 顶层是否全部勾选 */
function checkIsAllSelect() {
  const statusArr = arrAclList.value.map(item => item.isSelect)
  return statusArr.every(v => v === true)
}

/** 表头全选/取消全选 */
function selectAllFun() {
  const isAllSelect = checkIsAllSelect()
  arrAclList.value.forEach(item => {
    item.isSelect = isAllSelect
    productRef.value?.toggleRowSelection(item, !isAllSelect)
    setRowIsSelect(item)
  })
}

/** 半选行样式 */
function rowClassNameFun({ row }) {
  if (row.isSelect === '') return 'indeterminate'
}

/** 表头半选样式 */
function headerRowClassName() {
  const statusArr = arrAclList.value.map(item => item.isSelect)
  return statusArr.includes('') ? 'indeterminate' : ''
}

/** 批量设置行勾选 */
function toggleSelection(rows, flag) {
  if (rows) {
    rows.forEach(row => productRef.value?.toggleRowSelection(row, flag))
  } else {
    productRef.value?.clearSelection()
  }
}
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

  // 半选状态样式（selection 复选框显示为横线）
  :deep(.indeterminate) {
    .el-table-column--selection {
      .el-checkbox__input {
        .el-checkbox__inner {
          background-color: var(--el-color-primary) !important;
          border-color: var(--el-color-primary) !important;

          &::after {
            content: "";
            position: absolute;
            display: block;
            width: auto !important;
            height: 2px;
            left: 3px;
            right: 3px;
            top: 5px;
            transform: scale(0.5);
            border-color: #fff !important;
            background-color: #fff;
          }
        }
      }
    }
  }
}
</style>
