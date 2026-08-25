<template>
  <ep-dialog class="ep-dialog-list" title="选择供货单位" iconTitle="form" v-model="visible" width="1300px" top="5vh" append-to-body>
     <div class="sso-front-table-container app-container">
      <el-row :gutter="20" class="app-container-row integrated-manage-pane-form integrated-manage-pane-form-a">
        <el-col class="app-container-col">
          <form-data ref="formDataRef" :queryParams="queryParams" :showSearch="showSearch" :isShowMore="false" :formJson="rluFormJson" @handleQuery="handleQuery"
            @resetQuery="resetQuery" labelWidth="70"></form-data>
          <!-- 表格数据 -->
          <table-index class="table-index" :loading="loading" :idName="idName" singleMode :queryParams="queryParams" :tableJson="rluTableJson" :tableData="tableData"
            @handleSelectionChange="handleSelectionChange" :selectable="handleSelectable">
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
import { rluFormJson } from "../formJson"
import { rluTableJson } from "../tableJson"
import { mainReceiverUnit } from '@/api/warehouse/externalTransfer'
const { proxy } = getCurrentInstance()

const visible = ref(false)
const loading = ref(false)
const tableData = ref([])
const idName = ref('unitCode')
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
  },
})

const { queryParams } = toRefs(data)

// 声明触发的事件（可选，增强类型校验）
const emit = defineEmits(['selectChange']);

// 显示弹框
const show = async (list = []) => {
  visible.value = true
  selectableData.value = list
  getList()
}

/** 查询列表 */
function getList() {
  loading.value = true
  mainReceiverUnit(queryParams.value).then(({ data }) => {
    tableData.value = data.list || []
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
  const idArr = selectableData.value.map(a => a[idName.value])
  return !idArr.includes(row[idName.value])
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