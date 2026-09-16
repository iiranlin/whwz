<template>
  <ep-dialog class="ep-dialog-list" title="选择调剂申请单" iconTitle="form" v-model="visible" width="1300px" top="5vh" append-to-body>
    <div class="sso-front-table-container">
      <el-pro-table ref="proTableRef" v-loading="loading" action-width="160" :page-size="queryParams.pageSize" :data="tableData" :options="false"
        :total="total" :columns="adjustTableJson" :toolbar-config="adjustTableButtonJson" show-checkbox click-row-to-toggle-selection selection-mode="single"
        :table-alert-render="false" :show-action="false" :show-refresh="false" :show-setting="false" :grid-options="{ rowId: idName }" :selectable="handleSelectable"
        @search="onSearch" @selection-change="onSelectionChange" >
        <template #matlTypeSlot="{ row }">
          <span>{{ `${row.matlType}${row.matlRaw ? '/' + row.matlRaw : ''}${row.matlpCode ? '/' + row.matlpCode : ''}` }}</span>
        </template>
        <template #searchValue>
          <el-form :model="adjustFormData" class="ep-form-searchValue">
            <el-form-item label="调剂单：" prop="code">
              <el-select v-model="adjustFormData.code" placeholder="请选择" value-key="pdmId" style="width: 500px;">
                <!-- <el-option v-for="item in purchaseOrderList" :key="item.pdmId" :value="item" :label="item.spdCode + '-' + item.suName"></el-option> -->
              </el-select>
            </el-form-item>
          </el-form>
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
import { adjustTableJson, adjustTableButtonJson } from "../external-transfer/tableJson"
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
.ep-form-searchValue{
  .ep-form-item--default{
    margin-bottom: 0px;
  }
}
</style>