<template>
  <div class="app-container app-container-splitpanes">
    <el-row :gutter="20" class="app-container-row integrated-manage-pane-form integrated-manage-pane-form-a">
      <el-col class="app-container-col">
        <el-pro-table ref="proTableRef" v-loading="loading" action-width="240" :page-size="30"
          :data="tableData" :total="total" :columns="columns" show-checkbox
          :toolbar-config="toolbarConfig" :grid-options="{ rowId: 'id' }" :table-id="menuId"
          @search="onSearch" @action="onAction" @selection-change="onSelectionChange">
        </el-pro-table>
      </el-col>
    </el-row>

    <!-- 弹窗 -->
    <add-dialog ref="addDialogRef" @success="getList"></add-dialog>
    <el-dialog :title="designerData.title || '流程设计器'" v-model:visible="designerOpen" append-to-body>
      <process-designer :key="designerOpen" style="border: 1px solid rgba(0, 0, 0, 0.1)"
        v-loading="designerData.loading" :bpmnXml="designerData.bpmnXml"
        :designer-form="designerData.form" @save="handleSaveDesigner" />
    </el-dialog>
    <el-dialog title="流程详情" v-model:visible="openModeDetail" append-to-body width="1200px"
      :close-on-click-modal="false">
      <iframe :src="iframeUrl" frameborder="0" height="800px" width="100%"></iframe>
    </el-dialog>
    <version-record v-model:openVersionRecord="openVersionRecord" :processKey="currentRow.processKey" />
  </div>
</template>

<script setup name="processDesign">
import { useRoute, useRouter } from 'vue-router'
import { ElMessageBox, ElMessage } from 'element-plus'
import { columns, toolbarConfig } from './components/table-config.js'
import { listCategory, delCategory, changeStatus } from '@/api/workflow/category'
import addDialog from './components/addDialog'
import versionRecord from './components/versionRecord.vue'
import ProcessDesigner from '@/components/ProcessDesigner'
import packageJson from '../../../../../package'
import {  listCategoryData } from './components/mockData'


const route = useRoute()
const router = useRouter()
const { proxy } = getCurrentInstance()

// refs
const addDialogRef = ref(null)

// 页面状态
const menuId = ref(route.meta?.menuId)
const loading = ref(false)
const tableData = ref([])
const total = ref(0)
const selectedRows = ref([])
const ids = ref([])

// 查询参数
const data = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 30
  }
})
const { queryParams } = toRefs(data)
// 弹窗状态
const designerOpen = ref(false)
const designerData = reactive({
  title: '',
  loading: false,
  bpmnXml: '',
  modelId: null,
  form: {
    processName: null,
    processKey: null,
  },
})
const openModeDetail = ref(false)
const iframeUrl = ref('')
const currentRow = ref({})
const openVersionRecord = ref(false)

// --- 查询列表 ---
function getList() {
  loading.value = true
  listCategory(queryParams.value)
    .then(({ data }) => {
      tableData.value = data.list || []
      total.value = data.total
    })
    .finally(() => { 
        let data = listCategoryData
        tableData.value = data.list || []
        total.value = data.total
        loading.value = false })
}

// pro-table 搜索回调
function onSearch(form, pageInfo) {
  queryParams.value = { ...form, ...pageInfo }
  getList()
}

// pro-table 选中行回调
function onSelectionChange(rows) {
  selectedRows.value = rows
  ids.value = rows.map(r => r.id)
}

// --- 工具栏/操作按钮分发 ---
const onAction = ({ code, row }) => {
  const eventObj = {
    create: () => addDialogRef.value?.init(),
    update: () => handleUpdate(row),
    design: () => handleDesign(row),
    version: () => handleVersion(row),
    delete: () => handlerDeletes(),
    start: () => handleChangeStatus('0'),
    stop: () => handleChangeStatus('1'),
    link: () => clickLink(row, 'processName'),
  }
  eventObj[code] && eventObj[code]()
}

function handleUpdate(row) {
  if (!row.billType) return
  addDialogRef.value?.init(row, 'update')
}

function handleDesign(row) {
  // proxy.$router.push({ path: '/material-accept/self-supply-order/maintain/edit', query: { type: 'create' } })
  proxy.$router.push({ 
    // path: '/WorkDesign', 
    name: 'WorkDesign',
    query: { 
      code: row.modelId,
      modelName: row.processName,
      modelKey: row.processKey,
      billType: row.billType,
      isUpdate: row.version,
      id: row.id
     } 
  })

  // router.push({
  //   name: 'WorkDesign',
  //   query: {
  //     code: row.modelId,
  //     modelName: row.processName,
  //     modelKey: row.processKey,
  //     billType: row.billType,
  //     isUpdate: row.version,
  //     id: row.id
  //   }
  // })
}

function handleVersion(row) {
  currentRow.value = row
  openVersionRecord.value = true
}

// --- 业务操作 ---
function handlerDeletes() {
  if (!ids.value.length) {
    proxy.$modal.msgWarning('请选择数据')
    return
  }
  ElMessageBox.confirm('确定要删除吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      await delCategory({ ids: ids.value })
      getList()
    })
}

function handleChangeStatus(status = '') {
  if (!ids.value.length) {
    proxy.$modal.msgWarning('请选择数据')
    return
  }
  const title = status === '0'
    ? '确定启用所选流程吗?'
    : '停用后，相关单据将不触发审核，确定停用该审核流程？'
  ElMessageBox.confirm(title, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      await changeStatus({ ids: ids.value, status })
      getList()
    })
}

function clickLink(r) {
  if (!r?.version) {
    return ElMessage.error('当前流程无流程模型')
  }
  console.log(packageJson.name, '11111111111')
  openModeDetail.value = true
  iframeUrl.value = `/${packageJson.name}/bpmn/processViewr?mid=${r.modelId}`
}

// --- ProcessDesigner 空壳（原逻辑已废弃） ---
async function handleSaveDesigner(_bpmnXml) {
  // TODO: 未实现
}

// --- 生命周期 ---
onMounted(() => {
  getList()
})
</script>
