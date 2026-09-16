<template>
  <ep-dialog class="ep-dialog-list" title="选择物资" iconTitle="form" v-model="visible" width="1300px" top="5vh" append-to-body>
     <div class="sso-front-table-container" v-if="visible">
      <el-pro-table ref="proTableRef" v-loading="loading" action-width="160" :page-size="30" :data="tableData" :default-search-form="defaultSearchForm"
        :total="total" :columns="rmstorMatlTableJson" show-checkbox click-row-to-toggle-selection :options="false"
        :table-alert-render="false" :show-action="false" :show-refresh="false" :show-setting="false" :grid-options="{ rowId: idName }" :selectable="handleSelectable"
        @search="onSearch" @selection-change="onSelectionChange" >
        <template #matlTypeSlot="{ row }">
          <span>{{`${row.matlType}${row.matlRaw?'/'+row.matlRaw:''}${row.matlpCode?'/'+row.matlpCode:''}`}}</span>
        </template>
      </el-pro-table>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" class="determine-btn" @click="saveBtn"><svg-icon icon-class="determine" />&nbsp;保存</el-button>
        <el-button @click="visible = false" class="cancel-btn"><svg-icon icon-class="cancel" />&nbsp;关闭</el-button>
      </div>
    </template>
  </ep-dialog>
</template>

<script setup>
import { rmstorMatlTableJsonFun } from "@/views/transfer-management/internal-transfer-maintain/tableJson"
import { rmstorMatlSelectPageList } from '@/api/warehouse/rmstorInternal'
import { getWarehousePartition } from '@/api/warehouse/partition'
import { generateUUID } from '@/utils'
const { proxy } = getCurrentInstance()

// 接收参数并指定类型（可选）
const props = defineProps({
  rmstorMatlTableJsonProps: {
    type: [Array, Function],
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
const ids = ref([])
const selectionData = ref([])
const selectableData = ref([])
const total = ref(0)
const rmstorMatlTableJson = ref([])

const data = reactive({
  defaultSearchForm: {
    effectFlag: '1',
    partitionCode: '',
    depotCode: ''
  },
  queryParams: {
    pageNum: 1,
    pageSize: 30,
    effectFlag: '1',
    partitionCode: '',
    depotCode: ''
  },
})

const { defaultSearchForm, queryParams } = toRefs(data)

// 声明触发的事件（可选，增强类型校验）
const emit = defineEmits(['selectChange']);

// 显示弹框
const show = async ({depotCode, partitionCode, depotId}, list = []) => {
  visible.value = true
  queryParams.value.partitionCode = partitionCode
  queryParams.value.depotCode = depotCode
  defaultSearchForm.value.partitionCode = partitionCode
  defaultSearchForm.value.depotCode = depotCode
  selectableData.value = list
  const res = await getWarehousePartition({whId: depotId})
  const partitionData = res.data.map(item => {
    return {...item, label: item.partitionName, value: item.partitionCode}
  })
  if(typeof props.rmstorMatlTableJsonProps === 'function'){
    rmstorMatlTableJson.value = props.rmstorMatlTableJsonProps(partitionData)
  }else{
    rmstorMatlTableJson.value = rmstorMatlTableJsonFun(partitionData)
  }
  proxy.$nextTick(() => {
    proxy.$refs.proTableRef && proxy.$refs.proTableRef.reset()
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
function onSearch(form, pageInfo) {
  queryParams.value = { ...form, ...pageInfo }
  getList()
}

/** 多选框选中数据 */
function onSelectionChange(selection) {
  selectionData.value = selection
  ids.value = selection.map(item => item[idName.value])
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