<template>
  <div class="app-container app-container-splitpanes">
    <el-row :gutter="20" class="app-container-row integrated-manage-pane-form integrated-manage-pane-form-a">
      <el-col class="app-container-col">
        <el-pro-table ref="proTableRef" v-loading="loading" action-width="250" :page-size="30" :data="tableData"
          :editable="editableConfig" @cell-change="handleCellChange"
          :total="total" :columns="columns" show-checkbox click-row-to-toggle-selection :table-alert-render="false"
          :toolbar-config="toolbarConfig" :grid-options="{ rowId: idName }" :table-id="menuId" @search="onSearch"
          @action="onAction" @selection-change="onSelectionChange">
          <template #matlPcodeImg="{ row }">
            <span>{{ row.matlPcodeImg }}</span>
          </template>
          <template #matlTypeSlot="{ row }">
            <span>{{`${row.matlType}${row.matlRaw?'/'+row.matlRaw:''}${row.matlpCode?'/'+row.matlpCode:''}`}}</span>
          </template>
          <template #acceptanceFlag="{ row, column }">
            <el-select v-model="row.acceptanceFlag" clearable placeholder="" @change="acceptanceFlagChange(row)">
              <el-option v-for="item in column.dict" :key="item.value" :label="item.label"
                :value="item.value" />
            </el-select>
          </template>
          <template #acceptanceNumber="{ row }">
            <el-input v-model="row.acceptanceNumber" v-number-input.float="4" v-limit-text-len="50" clearable :disabled="row.acceptanceFlag != '1'" />
          </template>
          <template #comments="{ row }">
            <el-input v-model="row.comments" v-limit-text-len="50" />
          </template>
          <template #jointReceiver="{ row, index }">
            <el-input v-model="row.jointReceiver" readonly @mouseenter="handleMouseenter({row, index})" @mouseleave="handleMouseleave({row, index})">
              <template #suffix>
                <el-icon v-show="row.suffixClose" class="ep-icon-circle-close" @click="planCloseClick({row, index})"><CircleClose/></el-icon>
              </template>
              <template #append>
                <el-button class="ep-input-button-icon" icon="Search" @click="jointReceiverClick({row, index})"></el-button>
              </template>
            </el-input>
          </template>
          <template #brandFlag="{ row, column, index }">
            <el-select v-model="row.brandFlag" clearable @change="brandFlagChange({row, index})" placeholder="">
              <el-option v-for="item in column.dict" :key="item.value" :label="item.label"
                :value="item.value" />
            </el-select>
          </template>
          <template #brandAccount="{ row }">
            <el-input v-model="row.brandAccount" clearable :disabled="row.brandFlag != '1'" v-limit-text-len="50" />
          </template>
          <template #credCode="{ row }">
            <el-input v-model="row.credCode" clearable v-limit-text-len="50" />
          </template>
          <template #productionDate="{ row, index }">
            <el-date-picker v-model="row.productionDate" @change="expirationDateChange({row, index})" type="date"
              format="YYYY-MM-DD" value-format="YYYY-MM-DD" clearable style="width: 122px;" :disabled="row.validityFlag != '1'"/>
          </template>
          <template #validityPeriod="{ row, index }">
            <el-input v-model="row.validityPeriod" @change="expirationDateChange({row, index})" clearable v-number-input v-limit-text-len="50"
              :disabled="row.validityFlag != '1'" />
          </template>
          <template #validityPeriodUnit="{ row, column, index }">
            <el-select v-model="row.validityPeriodUnit" clearable @change="expirationDateChange({row, index})" placeholder=""
              :disabled="row.validityFlag != '1'">
              <el-option v-for="item in column.dict" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </template>
          <template #expirationDate="{ row }">
            <el-date-picker v-model="row.expirationDate" type="date" format="YYYY-MM-DD" value-format="YYYY-MM-DD" clearable style="width: 122px;"
              :disabled="row.validityFlag != '1'" />
          </template>
          <template #conversionBasis="{ row }">
            <el-input v-model="row.conversionBasis" :disabled="row.conversionFlag != '1'" v-limit-text-len="50" />
          </template>
          <template #facadeFlag="{ row, column }">
            <el-select v-model="row.facadeFlag" clearable placeholder="">
              <el-option v-for="item in column.dict" :key="item.value" :label="item.label"
                :value="item.value" />
            </el-select>
          </template>
          <template #acceptanceLevel="{ row }">
            <span>{{ row.acceptanceLevel == '1'?'一级验收':'多级验收' }}</span>
          </template>
        </el-pro-table>

      </el-col>
    </el-row>

    <upload-acceptance-attachment ref="uploadAcceptanceAttachment" />
    <adjust-dialog ref="adjustDialog" @createSuccess="getList" />
    <history-dialog ref="historyDialog" />
    <user-dialog ref="userDialog" :singleMode="false" @selectChange="userSelectChange" />
    <scont-dialog ref="scontDialog" />
    
  </div>
</template>

<script setup name="acceptance-record-maintain">
import { columns, toolbarConfig } from "./tableJson"
import UploadAcceptanceAttachment from "./components/uploadAcceptanceAttachment"
import AdjustDialog from "./components/adjustDialog"
import ScontDialog from "./components/scontDialog"
import HistoryDialog from "@/views/material-accept/components/historyDialog"
import { getOffsetDate } from '@/utils'
import { acceptanceRecordsList, acceptanceRecordsCheckSupplier, acceptanceRecordsSave, checkSupplierChange, checkPriceRange } from '@/api/warehouse/acceptanceRecords'
import UserDialog from "@/views/components/userDialog"

const { proxy } = getCurrentInstance()

const menuId = ref(proxy.$route.meta?.menuId)
const tableData = ref([])
const loading = ref(false)
const idName = ref('pdbId')
const ids = ref([])
const selectionData = ref([])
const total = ref(0)
const rowIndex = ref(0)

const data = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 30
  },
})

const { queryParams } = toRefs(data)

const editableConfig = computed(() => ({
  enabled: true,
  mode: 'multiple',
  defaultEditAll: true,
}))

function handleCellChange({ rowId, editedData, row }) {
}

const planCloseClick = (scope) => {
  tableData.value[scope.index].jointReceiverArr = []
  tableData.value[scope.index].jointReceiver = ''
}

const handleMouseenter = (scope) => {
  if(scope.row.jointReceiver){
    proxy.$refs.proTableRef.updateRowData(scope.index, {suffixClose: true}, true)
  }
}

const handleMouseleave = (scope) => {
  proxy.$refs.proTableRef.updateRowData(scope.index, {suffixClose: false}, true)
}

/** 查询角色列表 */
function getList() {
  loading.value = true
  const params = proxy.addDateRange(queryParams.value, queryParams.value.createTime, 'createTime')
  const paramsA = proxy.addDateRange(params, params.arrivalDate, 'arrivalDate')
  acceptanceRecordsList(paramsA).then(({ data }) => {
    tableData.value = (data.list || []).map(a => {
      return {...a, jointReceiverArr: [], suffixClose: false}
    })
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

// 选择联合验收人员
const jointReceiverClick = (scope) => {
  rowIndex.value = scope.index
  const currentData = proxy.$refs.proTableRef.getCurrentData()
  proxy.$refs.userDialog.show(currentData[rowIndex.value].jointReceiverArr)
}

const userSelectChange = (data) => {
  const currentData = proxy.$refs.proTableRef.getCurrentData()
  currentData[rowIndex.value].jointReceiverArr.push(...data)
  const userNameStr = data.map( a => a.userName).join(',')
  if(currentData[rowIndex.value].jointReceiver){
    currentData[rowIndex.value].jointReceiver += `,${userNameStr}`
  }else{
    currentData[rowIndex.value].jointReceiver = userNameStr
  }
  proxy.$refs.proTableRef.updateRowData(rowIndex.value, currentData[rowIndex.value], true)
}

const checkPriceRangeApi = () => {
  checkPriceRange(selectionData.value).then((res) => {
    if(!res.data){
      acceptanceRecordsSaveApi()
      return
    }
    proxy.$modal.confirm(res.message).then(() => {
      acceptanceRecordsSaveApi()
    })
  })
}

const checkSupplierChangeApi = () => {
  checkSupplierChange(selectionData.value).then((res) => {
    if(!res.data){
      checkPriceRangeApi()
      return
    }
    proxy.$modal.confirm(res.message).then(() => {
      checkPriceRangeApi()
    })
  })
}

// 保存
const handleSave = (pdmIds = []) => {
  if(!pdmIds.length){
    proxy.$modal.msgWarning('请选择数据')
    return
  }
  const conversionFlag1 = selectionData.value.some(a => a.conversionFlag == '1' && !a.conversionBasis)
  if(conversionFlag1){
    proxy.$modal.msgWarning('请填写换算依据')
    return
  }
  const jointReceiver = selectionData.value.some(a => !a.jointReceiver)
  if(jointReceiver){
    proxy.$modal.msgWarning('请填写联合验收人员')
    return
  }
  const acceptanceFlag = selectionData.value.some(a => !a.acceptanceFlag)
  if(acceptanceFlag){
    proxy.$modal.msgWarning('请选择是否通过验收')
    return
  }
  const comments0 = selectionData.value.some(a => a.acceptanceFlag == '0' && !a.comments)
  if(comments0){
    proxy.$modal.msgWarning('选择“验收不通过”时必须填写验收说明')
    return
  }
  const acceptanceNumber1 = selectionData.value.some(a => a.acceptanceFlag == '1' && (!a.acceptanceNumber || Number(a.acceptanceNumber) == 0))
  if(acceptanceNumber1){
    proxy.$modal.msgWarning('选择“验收通过”时必须填写通过数量(验收通过数量必须大于0)')
    return
  }
  const validityFlag1 = selectionData.value.some(a => a.validityFlag == '1' && (!a.productionDate || !a.validityPeriod || !a.validityPeriodUnit || !a.expirationDate))
  if(validityFlag1){
    proxy.$modal.msgWarning('请填写生产日期、有效期、有效期单位、到期日期')
    return
  }
  const brandFlag1 = selectionData.value.some(a => a.brandFlag == '1' && !a.brandAccount)
  if(brandFlag1){
    proxy.$modal.msgWarning('选择“品牌不相符”时必须填写品牌不符说明')
    return
  }
  proxy.$modal.confirm("您确定要保存所选订单吗？").then(async () => {
    try {
      const res = await acceptanceRecordsCheckSupplier({pdmIds})
      if(!res.data){
        // acceptanceRecordsSaveApi()
        checkSupplierChangeApi()
        return
      }
      proxy.$modal.confirm(res.message).then(() => {
        checkSupplierChangeApi()
        // acceptanceRecordsSaveApi()
      })
    } catch (error) {
      console.error(error)  
    }
  })
}

const acceptanceRecordsSaveApi = () => {
  acceptanceRecordsSave(selectionData.value).then( ({data}) => {
    getList()
  })
}

/** 多选框选中数据 */
function onSelectionChange(rows) {
  selectionData.value = rows
  ids.value = rows.map(item => item['pdmId'])
}

const onAction = (payload) => {
  const { name, code, row, selectedRows, files } = payload
  const eventObj = {
    save: () => {
      handleSave(ids.value)
    },
    // 上传验收附件
    upload: () => {
      proxy.$refs.uploadAcceptanceAttachment.show(row)
    },
    // 商城订单调整
    adjust: () => {
      proxy.$refs.adjustDialog.show(row)
    },
    // 验收历史
    history: () => {
      proxy.$refs.historyDialog.show(row.pdbId)
    },
    link: () => {
      handleClickLink(name, row)
    }
  }
  eventObj[code] && eventObj[code]()
}

const handleClickLink = (code, data) => {
  const eventObj = {
    // 详情
    scontCode: () => {
      data[code] && proxy.$refs.scontDialog.show(data.ncmpId)
    }
  }
  eventObj[code] && eventObj[code]()
}

const acceptanceFlagChange = (row) => {
  if(row.acceptanceFlag != '1'){
    row.acceptanceNumber = ''
  }
}

const brandFlagChange = (scope) => {
  if(scope.row.brandFlag != '1'){
    scope.row.brandAccount = ''
  }
}

const expirationDateChange = (scope) => {
  const {row: {productionDate, validityPeriod, validityPeriodUnit}} = scope
  if(productionDate && validityPeriod && validityPeriodUnit){
    scope.row.expirationDate = getOffsetDate(productionDate, Number(validityPeriod), validityPeriodUnit)
  }
}

getList()
</script>
<style lang="scss" scoped>
.ep-icon-circle-close{
  cursor: pointer;
}
</style>