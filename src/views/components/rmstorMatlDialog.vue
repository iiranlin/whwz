<template>
  <ep-dialog class="ep-dialog-list" title="选择物资" iconTitle="form" v-model="visible" width="1300px" top="5vh" append-to-body>
     <div class="sso-front-table-container app-container" v-if="visible">
      <el-row :gutter="20" class="app-container-row integrated-manage-pane-form integrated-manage-pane-form-a">
        <el-col class="app-container-col">
          <form-data ref="formDataRef" :queryParams="queryParams" :showSearch="showSearch" :isShowMore="false" :formJson="rmstorMatlFormJsonProps || rmstorMatlFormJson" @handleQuery="handleQuery" :formSelectData="formSelectData"
            @resetQuery="resetQuery" labelWidth="100"></form-data>
          <!-- 表格数据 -->
          <table-index class="table-index" :loading="loading" :idName="idName" :queryParams="queryParams" :tableJson="rmstorMatlTableJsonProps || rmstorMatlTableJson" :tableData="tableData"
            @handleSelectionChange="handleSelectionChange" :selectable="handleSelectable">
            <template #matlType="{ scope }">
              <span>{{`${scope.row.matlType}${scope.row.matlRaw?'/'+scope.row.matlRaw:''}${scope.row.matlpCode?'/'+scope.row.matlpCode:''}`}}</span>
            </template>
          </table-index>

          <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
            v-model:limit="queryParams.pageSize" @pagination="getList" />

        </el-col>
      </el-row>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="visible = false" class="cancel-btn"><svg-icon icon-class="cancel" />&nbsp;关闭</el-button>
        <el-button type="primary" class="determine-btn" @click="saveBtn"><svg-icon icon-class="determine" />&nbsp;保存</el-button>
      </div>
    </template>
  </ep-dialog>
</template>

<script setup>
import { rmstorMatlFormJson } from "@/views/transfer-management/internal-transfer-maintain/formJson"
import { rmstorMatlTableJson } from "@/views/transfer-management/internal-transfer-maintain/tableJson"
import { rmstorMatlSelectPageList } from '@/api/warehouse/rmstorInternal'
// import { warehouseDictListAll } from '@/api/warehouse/warehouseDict'
import { getWarehousePartition } from '@/api/warehouse/partition'
import { generateUUID } from '@/utils'
const { proxy } = getCurrentInstance()

// 接收参数并指定类型（可选）
const props = defineProps({
  rmstorMatlFormJsonProps: {
    type: Array,
    default: null
  },
  rmstorMatlTableJsonProps: {
    type: Array,
    default: null
  },
  apiUrl: {
    type: Function,
    default: null
  },
  idNameProps: {
    type: String,
    default: ''
  },
})

const visible = ref(false)
const loading = ref(false)
const tableData = ref([])
const idName = ref('uid')
const showSearch = ref(true)
const ids = ref([])
const selectionData = ref([])
const selectableData = ref([])
const single = ref(true)
const multiple = ref(true)
const total = ref(0)

const data = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 30,
    enableState: '1',
    partitionCode: '',
    depotCode: ''
  },
  formSelectData: {
    depotCode: []
  },
})

const { queryParams, formSelectData } = toRefs(data)

// 声明触发的事件（可选，增强类型校验）
const emit = defineEmits(['selectChange']);

// 显示弹框
const show = async ({depotCode, partitionCode, depotId}, list = []) => {
  visible.value = true
  queryParams.value.partitionCode = partitionCode
  queryParams.value.depotCode = depotCode
  selectableData.value = list
  // const {data} = await warehouseDictListAll()
  // formSelectData.value.depotCode = data.map(item => {
  //   return {...item, label: item.whName, value: item.whCode}
  // })
  const res = await getWarehousePartition({whId: depotId})
  formSelectData.value.partitionCode = res.data.map(item => {
    return {...item, label: item.partitionName, value: item.partitionCode}
  })
  proxy.$nextTick(() => {
    proxy.$refs.formDataRef && proxy.$refs.formDataRef.resetQuery()
	})
}

/** 查询列表 */
function getList() {
  loading.value = true
  const url = props.apiUrl || rmstorMatlSelectPageList
  url(queryParams.value).then(({ data }) => {
    tableData.value = (data.list || []).map(a => { return {...a, uid: generateUUID()} })
    total.value = data.total
  }).finally(() => {
    loading.value = false
  })
}

/** 搜索按钮操作 */
function handleQuery(data) {
  queryParams.value.pageNum = 1
  queryParams.value = Object.assign({}, queryParams.value, data)
  getList()
}

/** 重置按钮操作 */
function resetQuery(data) {
  handleQuery(data)
}

/** 多选框选中数据 */
function handleSelectionChange(selection) {
  selectionData.value = selection
  ids.value = selection.map(item => item[idName.value])
  single.value = selection.length != 1
  multiple.value = !selection.length
}

const handleSelectable = (row) => {
  const idArr = selectableData.value.map(a => props.idNameProps?a[props.idNameProps]:a.matlCode + a.matlUnit + a.cardPrice)
  return !idArr.includes(props.idNameProps?row[props.idNameProps]:row.matlCode + row.matlUnit + row.cardPrice)
}

const saveBtn = () => {
  if(!selectionData.value.length){
    proxy.$modal.msgWarning('请选择数据')
    return
  }
  emit('selectChange', selectionData.value)
  visible.value = false
}

defineExpose({
  show,
})
</script>
<style lang="scss" scoped>
</style>