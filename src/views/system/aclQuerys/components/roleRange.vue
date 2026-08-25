<template>
  <ep-dialog title="已分配角色权限明细" v-model="drawer" width="1200px" top="5vh" append-to-body>
    <div class="role-range">
      <div class="role-range__info">
        <p><span>用户名称：</span><span>{{ selectRadioData?.nickName || '-' }}</span></p>
        <el-divider style="margin: 12px 0" />
      </div>
      <div class="role-range__list">
        <el-radio-group v-model="radioVal" @change="radioValInput">
          <el-radio-button v-for="item in roleObj" :key="item.code" :value="item.code">{{ item.name }}</el-radio-button>
        </el-radio-group>
      </div>
      <el-divider style="margin: 12px 0" />
      <div class="role-range__table" v-loading="loading">
        <el-table ref="productRef" :data="arrAclList" border row-key="id" default-expand-all height="100%"
          header-cell-class-name="DisableSelection">
          <el-table-column type="selection" width="55" align="center" :selectable="checkSelectable" />
          <el-table-column prop="menuName" label="菜单名称" min-width="500">
            <template #default="{ row }">
              <span>{{ row.menuName }}</span>
              <acl-checkbox :disabled="true"
                v-if="(row.buttonList && row.buttonList.length) || (row.fieldList && row.fieldList.length)"
                :item="row" :id="row.id" />
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <template #footer>
      <el-button @click="drawer = false">关 闭</el-button>
    </template>
  </ep-dialog>
</template>

<script setup name="AclRoleRange">
import { aclList } from '@/api/base/acl'
import AclCheckbox from '@/views/system/acl/components/aclCheckbox'

const drawer = ref(false)
const loading = ref(false)
// 当前用户行数据
const selectRadioData = ref(null)
// 权限矩阵树数据
const arrAclList = ref([])
// 拆分后的角色集合 [{code: roleId, name: roleName}]
const roleObj = ref([])
const radioVal = ref(null)

/**
 * 打开弹窗
 * @param row 用户行（含 roleName/roleId 逗号分隔多角色）
 */
function init(row) {
  drawer.value = true
  roleObj.value = []
  arrAclList.value = []
  selectRadioData.value = row
  if (row?.roleName) {
    const roleNameArr = row.roleName.split(',')
    const roleIdArr = row.roleId.split(',')
    roleNameArr.forEach((val, i) => {
      roleObj.value.push({ code: roleIdArr[i], name: val })
    })
    radioVal.value = roleIdArr[0]
    getAclList(roleIdArr[0])
  }
}

/** 切换角色查看对应权限 */
function radioValInput(val) {
  getAclList(val)
}

/** 权限矩阵数据（只读回显） */
function getAclList(roleId) {
  arrAclList.value = []
  loading.value = true
  aclList({}, roleId).then(({ data }) => {
    arrAclList.value = data || []
    // 初始化：默认不选中
    (function initData(list) {
      list.forEach(item => {
        item.isSelect = item.isBind == 1
        if (item.children && item.children.length) initData(item.children)
      })
    })(arrAclList.value)
  }).finally(() => { loading.value = false })
}

/** 复选框列禁止勾选（只读） */
function checkSelectable() {
  return false
}

defineExpose({ init })
</script>

<style lang="scss" scoped>
.role-range {
  display: flex;
  flex-direction: column;
  height: 62vh;

  &__info p span {
    font-size: 14px;

    &:first-child {
      font-weight: 700;
    }
  }

  &__list {
    .el-radio-group {
      display: flex;
      width: 100%;
      max-height: 110px;
      flex-direction: row;
      justify-content: flex-start;
      flex-wrap: wrap;
      gap: 0 10px;
      overflow: auto;

      .el-radio-button {
        margin-bottom: 10px;
      }
    }
  }

  &__table {
    flex: 1;
    overflow: hidden;
  }
}

// 隐藏表头/行复选框（只读明细）
:deep(.DisableSelection) {
  .cell .el-checkbox .el-checkbox__inner {
    display: none;
  }
}
</style>
