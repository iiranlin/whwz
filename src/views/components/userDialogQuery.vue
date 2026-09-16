<template>
  <ep-dialog class="ep-dialog-list" title="选择用户" iconTitle="form" v-model="visible" width="1300px" top="5vh"
    append-to-body>
    <div class="sso-front-table-container">
      <el-pro-table ref="proTableRef" v-loading="loading" :columns="userTableJson" :page-size="queryParams.pageSize" :options="false" click-row-to-toggle-selection
       :data="tableData" :total="total" @search="onSearch" :show-checkbox="true" :table-alert-render="false" 
        :selection-mode="singleMode?'single' : 'multiple'" :grid-options="{ rowId: 'seq' }" :show-action="false" :show-refresh="false" :show-setting="false"
        @selection-change="handleSelectionChange"  :selectable="handleSelectable" />
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
import { userTableJson } from './tableJson'
import { deptTreePersonQuery } from '@/api/materialAccept/acceptGroup'
const { proxy } = getCurrentInstance()

// 接收参数并指定类型（可选）
const props = defineProps({
  singleMode: {
    type: Boolean,
    default: true
  }
})
const visible = ref(false)
const loading = ref(false)
const tableData = ref([])
const selectionData = ref([])
const selectableData = ref([])
const proTableRef = shallowRef(null)
const total = ref(0)
const queryParams = ref({
  pageNum: 1,
  pageSize: 30
})
// 声明触发的事件（可选，增强类型校验）
const emit = defineEmits(['selectChange']);
// 显示弹框
const show = async (list = []) => {
  visible.value = true
  selectionData.value = []
  selectableData.value = list
  proxy.$nextTick(() => {
    proxy.$refs.proTableRef && proxy.$refs.proTableRef.reset()
	})
}
/** 查询列表 */
function getList() {
  loading.value = true
  deptTreePersonQuery(queryParams.value).then(({ data }) => {
    tableData.value = data.list || []
    total.value = data.total
  }).finally(() => {
    loading.value = false
  })
}
const onSearch = (params, pageConfig) => {
  queryParams.value = { ...params, ...pageConfig }
  getList()
}

const handleSelectable = (row) => {
  const idArr = selectableData.value.map(a => a.userCode)
  return !idArr.includes(row.userCode)
}

const handleSelectionChange = (selection) => {
  selectionData.value = selection
}
const saveBtn = () => {
  if (!selectionData.value.length) {
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
<style lang="scss" scoped></style>