<template>
  <el-dialog title="候选用户" class="ep-dialog-list"  v-model="userOpen" width="1200px" append-to-body>
    <template #title>
      <div class="dialog-title dialog-search">
        <span class="title">候选用户</span>
        <div class="button-top">
          <el-button class="button-item search" round icon="Search" type="primary" @click="handleQuery"> 搜索</el-button>
          <el-button class="button-item reset" icon="RefreshLeft" round @click="resetQuery"><span class="button-text">重置</span>
          </el-button>
        </div>
      </div>
    </template>
    <el-form ref="userFormDataRef" label-suffix=":" :inline="true" :model="userFormData" class="demo-form-inline search-form">
      <el-form-item label="员工工号" prop="username">
        <el-input v-model="userFormData.username" placeholder="员工工号" @keyup.enter="handleQuery"></el-input>
      </el-form-item>
      <el-form-item label="员工姓名" prop="nickName">
        <el-input v-model="userFormData.nickName" placeholder="员工姓名" @keyup.enter="handleQuery"></el-input>
      </el-form-item>
    </el-form>
    <!--部门数据-->
    <!-- <el-col :span="7">
      <el-card shadow="never" style="height: 600px; margin-top: 0">
        <div slot="header">
          <span>部门列表</span>
        </div>
        <div class="head-container">
          <el-tree
          node-key="id"
          :data="deptTreeData"
          :props="deptProps"
          :expand-on-click-node="false"
          ref="tree"
          accordion
          highlight-current
          @node-click="handleNodeClick"
          :default-expanded-keys="defExpandedKeys" />
        </div>
      </el-card>
    </el-col> -->
    <!-- <el-col :span="16"> -->
    <el-table ref="multipleTableRef" height="500" :data="userTableList" border @select="handleSelectChange" v-loading="loading"
              @select-all="handleSelectAllChange" @row-click="handleRowClick">
      <el-table-column type="selection" width="50" align="center"/>
      <el-table-column label="员工姓名" align="center" prop="nickName"/>
      <el-table-column label="员工工号" align="center" prop="username"/>
      <el-table-column label="单位名称" align="center" prop="unitName"/>
      <el-table-column label="部门名称" align="center" prop="deptName"/>
    </el-table>
    <pagination :total="userTotal" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getUserList"/>
    <!-- </el-col> -->
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="handleTaskUserComplete">确 定</el-button>
        <el-button @click="userOpen = false">取 消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup name="selectUserTree">
import { ref, reactive, getCurrentInstance, nextTick } from 'vue'
// import { deptGetTreeByDeptId } from "@/api/system/dept";
import { getUserListAllByDept } from '@/api/common/index'
import { getExpertList } from '@/api/design'

const { proxy } = getCurrentInstance()

defineProps({})

const emit = defineEmits(['handleTaskUserComplete'])

const userOpen = ref(false)
const deptOptions = ref([])
const deptTreeData = ref([])
const deptProps = reactive({
  children: 'children',
  label: 'label'
})
const queryParams = reactive({
  deptId: undefined,
  pageNum: 1,
  pageSize: 30
})
const userTotal = ref(0)
const userTableList = ref([])
const selectedUserData = ref([])
const userFormData = reactive({
  nickName: '',
  username: ''
})
const treeDeptId = ref('00600023')
const defExpandedKeys = ref([])
const loading = ref(true)
const type = ref('')

const multipleTableRef = ref(null)
const userFormDataRef = ref(null)

function handleRowClick(row) {
  multipleTableRef.value.toggleRowSelection(row)
  let user = {
    id: row.id,
    name: row.nickName,
    type: 'user',
    sex: false,
    selected: false
  }
  if (!selectedUserData.value.some(item => item.id === user.id)) {
    selectedUserData.value.push(user)
  } else {
    selectedUserData.value = selectedUserData.value.filter(item => item.id !== user.id)
  }
}
function init(t, selected) {
  userOpen.value = true
  type.value = t
  selectedUserData.value = [...selected]
  // this.getDeptTreeData();
  userFormData.nickName = ''
  userFormData.username = ''
  getUserList()
}
// 节点单击事件
// function handleNodeClick(data) {
//   queryParams.pageNum = 1;
//   queryParams.deptId = data.treeId;
//   getUserList(queryParams);
// },
/**
 * 查询部门下拉树结构（含部门前缀）
 */
// async function getDeptTreeData() {
//   function refactorTree(data) {
//     return data.map((node) => {
//       let treeData = {
//         ...node,
//         id: `DEPT${node.id}`,
//         treeId: node.id,
//         label: node.deptName,
//         // parentId: node.parentId,
//         // weight: node.weight
//       };
//       if (node.children && node.children.length > 0) {
//         treeData.children = refactorTree(node.children);
//       }
//       return treeData;
//     });
//   }
//   let params = {
//     deptId: treeDeptId.value,
//     containsHeader: true,
//     levelNumber: 7,
//   };
//   const res = await deptGetTreeByDeptId(params)
//     if (res?.success) {
//       const deptOptions = res.data || [];

//       deptTreeData.value = refactorTree(deptOptions) || [];
//       nextTick(() => {
//         let pid = res.data[0].id;
//         defExpandedKeys.value.push(pid);

//       });
//     } else {
//       proxy.$modal.msgError(res.message);
//     }
// },
/** 查询用户列表 */
async function getUserList(p = {}) {
  loading.value = true
  const params = {
    orderByColumn: 'updateTime',
    isAsc: 'desc',
    ...queryParams,
    ...p
  }
  const api = type.value === 'EXPERT' ? getExpertList : getUserListAllByDept
  api(params).then((res) => {
    if (res.code === 0) {
      userTableList.value = res.data.list.map(item => ({ ...item, nickName: item.nickName, username: item.username }))
      userTotal.value = res.data.total

      nextTick(() => {
        // 回显当前页面勾选用户
        userTableList.value.forEach((item) => {
          selectedUserData.value.forEach((i) => {
            if (item.id === i.id) {
              multipleTableRef.value.toggleRowSelection(item, true)
            }
          })
        })
      })
    } else {
      proxy.$modal.msgError(res.message)
    }
  }).finally(() => {
    loading.value = false
  })
}

// 用户选择弹出框确认按钮
function handleTaskUserComplete() {
  if (!selectedUserData.value || selectedUserData.value.length <= 0) {
    proxy.$modal.msgError('请选择用户')
    return
  }
  let result = [...selectedUserData.value]
  emit('handleTaskUserComplete', result)
  userOpen.value = false
}
function handleSelectAllChange(selection) {
  // 全选直接取当前页数据进行处理
  userTableList.value.forEach(item => {
    handleSelectChange(selection, item)
  })
}
// 多选框选中数据
function handleSelectChange(selection, row) {
  let user = {
    id: row.id,
    name: row.nickName,
    type: 'user',
    sex: false,
    selected: false
  }
  // 选中则添加,取消则删除
  if (selection.some(i => i.id === user.id)) {
    if (!selectedUserData.value.some(item => item.id === user.id)) {
      selectedUserData.value.push(user)
    }
  } else {
    selectedUserData.value = selectedUserData.value.filter(item => item.id !== user.id)
  }
}
function handleQuery() {
  queryParams.pageNum = 1
  getUserList(userFormData)
}
function resetQuery() {
  userFormDataRef.value.resetFields()
  handleQuery()
}

defineExpose({ init, getUserList })
</script>

<style scoped lang="scss">
.dialog-search {
  margin-right: 50px;
  display: flex;
  justify-content: space-between;
}

:deep() {
  .el-dialog__body {
    padding-top: 0px;
  }
}

.head-container {
  height: 500px;
  overflow: auto;
}
</style>
