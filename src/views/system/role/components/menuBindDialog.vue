<template>
  <ep-dialog title="菜单权限" v-model="visible" width="520px" top="8vh" append-to-body v-loading="loading">
    <div class="menu-bind__title">角色：{{ roleName }}</div>
    <el-tree
      ref="menuTreeRef"
      :data="menuTreeData"
      :props="{ label: 'menuName', children: 'children' }"
      node-key="id"
      show-checkbox
      default-expand-all
      :default-checked-keys="checkedKeys"
    />
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="submit">确 定</el-button>
        <el-button @click="visible = false">取 消</el-button>
      </div>
    </template>
  </ep-dialog>
</template>

<script setup>
import { menuTree } from '@/api/base/menu'
import { roleMenuTree, roleBindMenu } from '@/api/base/role'

const { proxy } = getCurrentInstance()

const visible = ref(false)
const loading = ref(false)
const roleId = ref('')
const roleName = ref('')
const menuTreeData = ref([])
const checkedKeys = ref([])

const emit = defineEmits(['createSuccess'])

/** 收集树中叶子节点 id（角色已绑定菜单的回显勾选用，父级由 el-tree 自动半选/全选） */
function collectLeafIds(list) {
  const ids = []
  ;(list || []).forEach(item => {
    if (item.children && item.children.length) {
      ids.push(...collectLeafIds(item.children))
    } else {
      ids.push(item.id)
    }
  })
  return ids
}

/** 打开弹窗 */
function init(row) {
  visible.value = true
  roleId.value = row.id
  roleName.value = row.roleName || row.roleCode
  checkedKeys.value = []
  loading.value = true
  // 只加载生效(status=0)菜单，接口 /menu/tree 支持 status 过滤
  menuTree({ status: 0 }).then(({ data }) => {
    menuTreeData.value = data || []
  }).finally(() => {
    loading.value = false
  })
  // 回显：只取该角色已绑定的菜单（role/menuTree），避免全量接口导致默认全勾
  roleMenuTree(row.id).then(({ data }) => {
    checkedKeys.value = collectLeafIds(data || [])
  })
}

/** 提交 */
function submit() {
  const checkedIds = proxy.$refs.menuTreeRef.getCheckedKeys().concat(proxy.$refs.menuTreeRef.getHalfCheckedKeys())
  loading.value = true
  roleBindMenu({ menuIds: checkedIds }, roleId.value).then(({ message }) => {
    proxy.$modal.msgSuccess(message)
    visible.value = false
    emit('createSuccess')
  }).finally(() => {
    loading.value = false
  })
}

defineExpose({
  init
})
</script>

<style lang="scss" scoped>
.menu-bind {
  &__title {
    font-weight: 600;
    margin-bottom: 10px;
  }
}
</style>
