<template>
  <div class="app-container">
    <el-row :gutter="20" class="app-container-row">
      <splitpanes class="app-container-splitpanes  default-theme" @resize="resizeSplit">
        <!--部门数据-->
        <pane size="16" class="integrated-manage-pane-tree" v-loading="treeLoading">
          <el-col>
            <el-trees :data="withUserList" :propsObj="deptAssigndeptProp" differentDisplays title="部门人员信息" :code="'userCode'" filterShow isSolt
                :defaultExpandAll="defaultExpandAll" @handleNodeClick="handleNodeClick" placeholder="员工名称或编号">
                <template #default="{data}">
                  <span>
                    <svg-icon v-if="!data.children || (data.children && !data.children.length)" icon-class="Icon-Department"/>
                    [{{ data['deptCode'] }}]{{ data['deptName'] }}
                    <span v-if="data.children && data.children.length > 0" class="el-aside-h-span-icon"></span>
                  </span>
                </template>
            </el-trees>
          </el-col>
        </pane>
        <pane size="84" class="integrated-manage-pane-form">
          <el-col class="app-container-col">
            <el-pro-table ref="proTableRef" v-loading="loading" action-width="80" :page-size="30" :data="tableData"
              :total="total" :columns="columnsData" show-checkbox click-row-to-toggle-selection :table-alert-render="false"
              :toolbar-config="toolbarConfig" :grid-options="{ rowId: idName }" :table-id="menuId" @search="onSearch"
              @action="onAction" @selection-change="onSelectionChange">
            </el-pro-table>
          </el-col>
        </pane>
      </splitpanes>
    </el-row>

    <add-dialog ref="addDialog" :userData="userData" @createSuccess="getList()" />

  </div>
</template>

<script setup name="employee-supplies-scope">
import { Splitpanes, Pane } from "splitpanes"
import "splitpanes/dist/splitpanes.css"
import { columns, toolbarConfig } from "./tableJson"
import AddDialog from "./components/AddDialog"
import ElTrees from "@/components/elTrees"
import { userMatlList, userMatlDeleteBatch } from '@/api/warehouse/userMatl'
import { treeWithUser } from '@/api/system/common'

const { proxy } = getCurrentInstance()

const menuId = ref(proxy.$route.meta?.menuId)
const tableData = ref([])
const loading = ref(false)
const treeLoading = ref(false)
const idName = ref('id')
const ids = ref([])
const total = ref(0)
const withUserList = ref(undefined)
const resizeSplitData = ref(0)
const defaultExpandAll = ref(false)
const columnsData = ref([])

const data = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 30
  },
  deptAssigndeptProp: {
    children: 'children',
    label: 'userName',
    value: 'id',
    isLeaf: true
  },
  userData: {
    userName: '',
    userCode: '',
    userId: ''
  }
})

const { queryParams, deptAssigndeptProp, userData } = toRefs(data)

async function init () {
  columnsData.value = await columns
}
init()

const resizeSplit = (val) => {
  resizeSplitData.value = val.event.x
}

/** 节点单击事件 */
function handleNodeClick(data) {
  queryParams.value.userCode = ''
  queryParams.value.deptId = ''
  userData.value = {}
  if (data) {
    if(data.userCode){
      queryParams.value.userCode = data.userCode
      userData.value = {
        userName: data.userName,
        userCode: data.userCode,
        userId: data.id
      }
    }else{
      queryParams.value.deptId = data.id
    }
  }
  getList()
}

/** 查询角色列表 */
function getList() {
  loading.value = true
  userMatlList(queryParams.value).then(({ data }) => {
    tableData.value = data.list || []
    total.value = data.total
  }).finally(() => {
    loading.value = false
  })
}


const getTreeWithUser = () => {
  treeLoading.value = true
  treeWithUser().then( ({data}) => {
    withUserList.value = data
  }).finally(() => {
    treeLoading.value = false
  })
}

/** 搜索按钮操作 */
function onSearch(form, pageInfo) {
  queryParams.value = { ...form, ...pageInfo, deptId: queryParams.value.deptId, userCode: queryParams.value.userCode }
  getList()
}

/** 多选框选中数据 */
function onSelectionChange(rows) {
  ids.value = rows.map(item => item[idName.value])
}

const handleCreate = () => {
  if(!queryParams.value.userCode){
    proxy.$modal.msgWarning('请先选择人员信息')
    return
  }
  proxy.$refs["addDialog"].show('create')
}

const handleDelete = () => {
  if(!ids.value.length){
    proxy.$modal.msgWarning('请选择数据')
    return
  }
  proxy.$modal.confirm('确定要删除吗？').then(()=>{
    userMatlDeleteBatch({ids: ids.value}).then( ({message}) => {
      proxy.$modal.msgSuccess(message)
      getList()
    })
  })
}

const onAction = (payload) => {
  const { code, row, files } = payload
  const eventObj = {
    // 新增
    create: () => {
      handleCreate()
    },
    // 修改
    modify: () => {
      proxy.$refs.addDialog.show('modify', row)
    },
    // 删除
    delete: () => {
      handleDelete()
    }
  }
  eventObj[code] && eventObj[code]()
}

getTreeWithUser()
getList()
</script>
<style lang="scss" scoped>
.splitpanes__pane:nth-child(1){
  width: 16%;
  min-width: 286px;
}
</style>