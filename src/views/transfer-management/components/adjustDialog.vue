<template>
  <ep-dialog class="ep-dialog-list" title="选择调剂申请单" iconTitle="form" v-model="visible" width="1300px" top="5vh" append-to-body>
     <div class="sso-front-table-container app-container app-container-splitpanes">
      <el-row :gutter="20" class="app-container-row integrated-manage-pane-form integrated-manage-pane-form-a">
        <el-col class="app-container-col">
          <form-data ref="formDataRef" :queryParams="queryParams" :showSearch="showSearch" :isShowMore="false" :formJson="adjustFormJson" @handleQuery="handleQuery" :formSelectData="formSelectData"
            @resetQuery="resetQuery" labelWidth="70"></form-data>
          <el-row :gutter="10" class="mb8 integrated-manage-pane-form-button">
            <el-col :span="12" style="padding-top: 3px">
              <el-form :model="adjustFormData">
                <el-form-item label="调剂单：" prop="code">
                  <el-select v-model="adjustFormData.code" placeholder="请选择" value-key="pdmId">
                    <!-- <el-option v-for="item in purchaseOrderList" :key="item.pdmId" :value="item" :label="item.spdCode + '-' + item.suName"></el-option> -->
                  </el-select>
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
          <!-- 表格数据 -->
          <table-index class="table-index" :loading="loading" :idName="idName" :queryParams="queryParams" :tableJson="adjustTableJson" :tableData="tableData"
            @handleSelectionChange="handleSelectionChange" :selectable="handleSelectable">
            <template #acceptanceNumber="{ scope }">
              <el-input v-model="scope.row.acceptanceNumber" v-number-input.float="4" clearable />
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
import { adjustFormJson } from "../external-transfer/formJson"
import { adjustTableJson } from "../external-transfer/tableJson"
import { v1GetAdjDtList, v1GetAdjList } from '@/api/warehouse/bussinessDoc'
import { generateUUID } from '@/utils'
import { getCookie } from '@/utils/auth'
const { proxy } = getCurrentInstance()

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
  },
  formSelectData: {
    billCode: []
  },
  adjustFormData: {
    code: ''
  }
})

const { queryParams, formSelectData, adjustFormData } = toRefs(data)

// 声明触发的事件（可选，增强类型校验）
const emit = defineEmits(['selectChange']);

// 显示弹框
const show = async (list = []) => {
  visible.value = true
  // selectableData.value = list
  // const {data} = await v1GetAdjList({adjTypeCode: '1', userCode: getCookie('userCode'), railwayCode: getCookie('railwayCode'), oldUnitCode: getCookie('unitCode')})
  // formSelectData.value.billCode = data.map(item => {
  //   return {...item, label: item.whName, value: item.whCode}
  // })
  // getList()
}

/** 查询列表 */
function getList() {
  loading.value = true
  v1GetAdjDtList(queryParams.value).then(({ data }) => {
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
  const idArr = selectableData.value.map(a => a.matlCode + a.matlUnit + a.cardPrice)
  return !idArr.includes(row.matlCode + row.matlUnit + row.cardPrice)
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