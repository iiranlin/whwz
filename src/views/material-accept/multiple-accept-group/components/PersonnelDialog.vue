<template>
  <ep-dialog :title="dialogType" iconTitle="form" v-model="visible" width="65%" top="5vh" append-to-body>
    <div class="sso-front-table-container2">
      <div style="display: flex;">
        <div class="left-pannel">
          <el-scrollbar height="66vh">
            <el-tree ref="treeRef" :data="treeData" :props="treeProps" highlight-current @node-click="handleNodeClick"
              node-key="id" :default-expand-all="false" :current-node-key="selectedCategoryId" />
          </el-scrollbar>
        </div>
        <div class="right-pannel">
          <h2>{{ selectedCategory }}</h2>
          <el-checkbox-group v-model="checkedItems">
            <el-checkbox v-for="item in currentItems" :key="item.id" :label="item.userName" :value="item.userCode" />
          </el-checkbox-group>
        </div>
      </div>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="visible = false" class="cancel-btn"><svg-icon icon-class="cancel" />&nbsp;关闭</el-button>
        <el-button type="primary" class="determine-btn" @click="saveBtn"><svg-icon icon-class="determine" />&nbsp;{{
          dialogType === 'create' ? '保存' : '确定' }}</el-button>
      </div>
    </template>
  </ep-dialog>
</template>

<script setup>
import { deptTree, deptTreePerson, saveGroupUsers, getGroupUsers } from '@/api/materialAccept/acceptGroup'
const { proxy } = getCurrentInstance()
const selectedCategoryId = ref('')
const visible = ref(false)
const dialogType = ref('分配人员')
const treeRef = ref(null)
watch(visible, (newVal) => {
  if (!newVal) {
    currentItems.value = []
    selectedCategory.value = ''
    treeRef.value?.setCurrentKey(undefined)
  }
})

const treeData = ref([])
const treeProps = {
  children: 'children',
  label: 'deptName'
}
const selectedCategory = ref('')

const getDeptTree = async () => {
  let { data } = await deptTree()
  treeData.value = data || []
  selectedCategory.value = data[0].deptName
  treeRef.value?.setCurrentKey(data[0].id)
  queryPerson('')
}


const currentItems = ref([])
const handleNodeClick = async (data) => {
  selectedCategory.value = data.deptName
  queryPerson(data.id)
}
const queryPerson = async (pdeptId) => {
  let res = await deptTreePerson({ deptId: pdeptId })
  currentItems.value = res.data.list || []
}


const checkedItems = ref([])

//回显
const getGroupUsersList = async () => {
  let { data } = await getGroupUsers(formData.value.id)
  checkedItems.value = data.map(item => item.userCode) || []
}

// 声明触发的事件（可选，增强类型校验）
const emit = defineEmits(['createSuccess']);

const formData = ref({})
// 显示弹框
const show = async (row = {}) => {
  visible.value = true
  formData.value = row
  getDeptTree()
  getGroupUsersList()
  proxy.$nextTick(() => {

  })
}

const saveBtn = () => {
  proxy.$modal.loading()
  saveGroupUsers({
    groupName: formData.value.groupName,
    id: formData.value.id,
    userCodes: checkedItems.value
  }).then(({ message }) => {
    proxy.$modal.msgSuccess(message)
    visible.value = false
    checkedItems.value = []
    emit('createSuccess')
  }).finally(() => {
    proxy.$modal.closeLoading()
  })
}

defineExpose({
  show,
})
</script>
<style lang="scss" scoped>
.sso-front-table-container2 {
  height: 70vh;
  border: none;
  margin: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.container {
  display: flex;
  width: 100%;
}

.left-pannel {
  width: 30%;
  height: 100vh;
  border-right: 1px solid #e0e0e0;
  padding: 20px 20px 0px 20px;
}

.right-pannel {
  flex: 1;
  padding: 0 20px 20px 20px;

}

// :deep(.ep-tree-node:focus > .ep-tree-node__content) {
//   background-color: #64a1ff !important;
// }

// :deep(.ep-tree--highlight-current .ep-tree-node.is-current > .ep-tree-node__content) {
//   background-color: #64a1ff !important;
// }

//  #64a1ff</style>