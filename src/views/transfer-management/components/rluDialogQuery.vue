<template>
  <ep-dialog class="ep-dialog-list" :title="title" iconTitle="form" v-model="visible" width="1300px" top="5vh" append-to-body>
     <div class="sso-front-table-container">
      <el-pro-table ref="proTableRef" v-loading="loading" action-width="160" :page-size="30" :data="tableData" :options="false"
        :total="total" :columns="tableJson || rluTableJson" show-checkbox click-row-to-toggle-selection selection-mode="single"
        :table-alert-render="false" :show-action="false" :show-refresh="false" :show-setting="false" :grid-options="{ rowId: idName }" :selectable="handleSelectable"
        @search="onSearch" @selection-change="onSelectionChange" >
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
import { rluTableJson } from "../external-transfer/tableJson"
import { mainReceiverUnit } from '@/api/warehouse/externalTransfer'
const { proxy } = getCurrentInstance()

// 接收参数并指定类型（可选）
const props = defineProps({
  title: {
    type: String,
    default: '选择收料单位'
  },
  tableJson: {
    type: Array,
    default: null
  },
  apiUrl: {
    type: Function,
    default: null
  },
  idName: {
    type: String,
    default: 'unitCode'
  },
})

const visible = ref(false)
const loading = ref(false)
const tableData = ref([])
const ids = ref([])
const selectionData = ref([])
const selectableData = ref([])
const total = ref(0)

const data = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 30,
  },
})

const { queryParams } = toRefs(data)

// 声明触发的事件（可选，增强类型校验）
const emit = defineEmits(['selectChange']);

// 显示弹框
const show = async (list = []) => {
  visible.value = true
  selectableData.value = list
  proxy.$nextTick(() => {
    proxy.$refs.proTableRef && proxy.$refs.proTableRef.reset()
	})
}

/** 查询列表 */
function getList() {
  loading.value = true
  const url = props.apiUrl || mainReceiverUnit
  url(queryParams.value).then(({ data }) => {
    tableData.value = data.list || []
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
  ids.value = selection.map(item => item[props.idName.value])
}

const handleSelectable = (row) => {
  const idArr = selectableData.value.map(a => a[props.idName.value])
  return !idArr.includes(row[props.idName.value])
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