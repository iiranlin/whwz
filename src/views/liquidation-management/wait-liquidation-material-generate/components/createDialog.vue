<template>
  <ep-dialog class="ep-dialog-list" :title="dialogType == 'create'?'待清算物资生成新增':dialogType == 'modify'?'待清算物资生成修改':'待清算物资生成详情'" iconTitle="form" v-model="visible" width="1300px" top="5vh" append-to-body>
    <div class="sso-front-table-container app-container">
      <el-form class="form-wrapper" :model="formData" :rules="rules" ref="elForm" label-width="140px"> 
        <div class="form-left flex1">
          <el-row>
            <el-col :span="6">
              <el-form-item prop="prePayNo" label="待清算物料明细单号：">
                <el-input v-if="dialogType != 'details'" v-model="formData.prePayNo" placeholder="自动生成" disabled />
                <span v-else>{{ formData.prePayNo }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="noteDate" label="清算周期：" :required="isRequired()" label-width="90px">
                <el-date-picker v-if="dialogType != 'details'" v-model="formData.noteDate" value-format="YYYY-MM-DD" type="daterange" range-separator="-"
                  start-placeholder="开始日期" end-placeholder="结束日期" clearable @change="noteDateChange"></el-date-picker>
                <span v-else>{{ parseTime(formData.noteDateBegin, "{y}-{m}-{d}") }} - {{ parseTime(formData.noteDateEnd, "{y}-{m}-{d}") }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="用料单位：" prop="useUnitCode" :required="isRequired()" label-width="100px">
                <el-select v-if="dialogType != 'details'" v-model="formData.useUnitCode" placeholder="请选择供应单位" filterable clearable @change="useUnitChange">
                  <el-option v-for="item in deptAssignList" :key="item.unitCode" :label="item.unitName" :value="item.unitCode">
                  </el-option>
                </el-select>
                <div v-else>
                  <span>{{ formData.useUnitName }}</span>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="供应商名称：" prop="supplierName" :required="isRequired()" label-width="100px">
                <el-input v-if="dialogType != 'details'" v-model.trim="formData.supplierName" placeholder="请选择供应商" readonly
                  @mouseenter="handleMouseenter" @mouseleave="handleMouseleave">
                  <template #suffix>
                    <el-icon v-show="suffixClose" class="ep-icon-circle-close" @click="closeSearchClick"><CircleClose/></el-icon>
                  </template>
                  <template #append>
                    <el-button class="ep-input-button-icon" icon="Search" @click="handleSupUnit"></el-button>
                  </template>
                </el-input>
                <div v-else>
                  <span>{{ formData.supplierName }}</span>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item prop="comments" label="备注：">
                <el-input v-if="dialogType != 'details'" v-model.trim="formData.comments" placeholder="请输入备注" :disabled="false" style="width: 100%;" />
                <span v-else>{{ formData.comments }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-divider/>
          <el-row style="margin-top: 15px;" v-show="dialogType != 'details'">
            <el-col :span="18">
              <el-form-item prop="ibmtIds" label="请选择入库单：" :required="isRequired()">
                <el-select v-model="formData.ibmtIds" placeholder="采购订单号 + 入库单号（可多选复选框）" multiple collapse-tags collapse-tags-tooltip
                  clearable style="width: 500px !important;" @change="ibmtIdsChange">
                  <el-option v-for="item in inBoundMtsData" :key="item.ibmtId" :label="`【${item.refBillCode}】${item.ibBillCode}`" :value="item.ibmtId">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
      <!-- 表格数据 -->
      <table-index class="table-index" :selectionShow="false" :loading="loading" :required="isRequired()" :tableJson="matlTableJson" :tableData="tableDataPage"
        :queryParams="queryParams" @handleButtonClick="handleButtonClick">
        <template #matlType="{ scope }">
          <span>{{`${scope.row.matlType}${scope.row.matlRaw?'/'+scope.row.matlRaw:''}${scope.row.matlpCode?'/'+scope.row.matlpCode:''}`}}</span>
        </template>
        <template #onlyTaxAmount="{ scope }">
          <span>{{ (scope.row.taxAmount - scope.row.noTaxAmount).toFixed(2) }}</span>
        </template>
      </table-index>
      <div class="page-bottom">
        <el-descriptions class="page-bottom-descriptions">
          <el-descriptions-item label="订单总金额(含税)：">{{ formData.sumAmount || 0 }}</el-descriptions-item>
        </el-descriptions>
        <pagination class="page-bottom-pagination" v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
          v-model:limit="queryParams.pageSize" @pagination="getList" />
      </div>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="visible = false" class="cancel-btn"><svg-icon icon-class="cancel" />&nbsp;关闭</el-button>
        <el-button v-if="dialogType != 'details'" type="primary" class="determine-btn" @click="saveBtn(0)"><svg-icon icon-class="determine" />&nbsp;保存</el-button>
        <el-button v-if="dialogType != 'details'" type="primary" class="determine-btn" @click="saveBtn(1)"><svg-icon icon-class="determine" />&nbsp;保存并提交</el-button>
      </div>
    </template>
    
    <rlu-dialog ref="rluDialog" title="选择供应商" idName="orgCode" :apiUrl="supplierBaseinfoList" labelWidth="128"
      :formJson="supplierFormJson" :tableJson="supplierTableJson" @selectChange="unitSelectChange" />

  </ep-dialog>
</template>

<script setup>
import { prePayCreateModify, prePayDetail, prePayGetInBoundMts, prePayGetPrePayDtByInBoundMtId } from '@/api/warehouse/prePay'
import { supplierFormJson } from "../formJson"
import { matlTableJson, supplierTableJson } from "../tableJson"
import { unitGetUnitList } from "@/api/system/unit"
import { supplierBaseinfoList } from "@/api/system/common"
import { getCookie } from '@/utils/auth'
import RluDialog from "@/views/transfer-management/components/rluDialog"
import { ruleGenerate } from '@/api/warehouse/receiptRule'

const warehouseGetYear = getCookie("warehouseGetYear") && JSON.parse(getCookie("warehouseGetYear"))

const { proxy } = getCurrentInstance()

const visible = ref(false)
const loading = ref(false)
const dialogType = ref('create')
const tableData = ref([])
const tableDataPage = ref([])
const total = ref(0)
const deptAssignList = ref([])
const inBoundMtsData = ref([])
const suffixClose = ref(false)

const data = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 30
  },
  formData: {
    prePayNo: '',
    noteDate: [],
    noteDateBegin: '',
    noteDateEnd: '',
    useUnitCode: '',
    useUnitName: '',
    supplierCode: '',
    supplierName: '',
    comments: '',
    ibmtIds: [],
    sumAmount: ''
  },
  rules: {
    noteDate: [{ required: true, message: '请选择清算周期', trigger: ['blur', 'change'] }],
    useUnitCode: [{ required: true, message: '请选择用料单位', trigger: ['blur', 'change'] }],
    supplierName: [{ required: true, message: '请选择供应商名称', trigger: ['blur', 'change'] }],
    ibmtIds: [{ required: true, message: '请选择入库单', trigger: ['blur', 'change'] }],
  }
})

const { queryParams, formData, rules} = toRefs(data)

// 声明触发的事件（可选，增强类型校验）
const emit = defineEmits(['createSuccess']);

const isRequired = () => {
  return dialogType.value != 'details'
}

const closeSearchClick = () => {
  formData.value.supplierCode = ''
  formData.value.supplierName = ''
  initPrePayGetInBoundMts()
}

const handleMouseenter = () => {
  if(formData.value.supplierName){
    suffixClose.value = true
  }
}

const handleMouseleave = () => {
  suffixClose.value = false
}

const getUnitGetUnitList = () => {
  unitGetUnitList({parentUnitCode: getCookie('railwayCode'), unitLevel: '3', enableStatus: '1', unitStatus: '1'}).then(({ data }) => {
    deptAssignList.value = data || []
  })
}

const initPrePayGetInBoundMts = () => {
  formData.value.ibmtIds = []
  inBoundMtsData.value = []
  tableData.value = []
  tableDataPage.value = []
  const {noteDateBegin, noteDateEnd, useUnitCode, supplierCode} = formData.value
  getPrePayGetInBoundMts({noteDateBegin, noteDateEnd, useUnitCode, supplierCode})
}

const pageInit = () => {
  const { pageNum, pageSize }= queryParams.value
  tableDataPage.value = tableData.value.filter((_, index) => index < pageSize * pageNum && index >= pageSize * (pageNum - 1))
}
const getPrePayDetail = (id) => {
  proxy.$modal.loading()
  prePayDetail(id).then(({data}) => {
    tableData.value = data.dts || []
    total.value = tableData.value.length || 0
    formData.value = data
    formData.value.noteDate = [data.noteDateBegin, data.noteDateEnd]
    pageInit()
    const {noteDateBegin, noteDateEnd, useUnitCode, supplierCode} = formData.value
    getPrePayGetInBoundMts({noteDateBegin, noteDateEnd, useUnitCode, supplierCode})
  }).finally( () => {
    proxy.$modal.closeLoading()
  })
}

const getPrePayGetInBoundMts = (params) => {
  prePayGetInBoundMts(params).then(({data}) => {
    inBoundMtsData.value = data
  })
}

const getPrePayGetPrePayDtByInBoundMtId = (ibmtIds) => {
  loading.value = true
  prePayGetPrePayDtByInBoundMtId({ibmtIds}).then(({data}) => {
    const list = (data || [])
    tableData.value = list
    total.value = list.length
    formData.value.sumAmount = list.reduce((taxAmount, item) => taxAmount + item.taxAmount, 0)
    pageInit()
  }).finally( () => {
    loading.value = false
  })
}

const getList = () => {
  pageInit()
}

// 显示弹框
function show(type = 'create', row = {}) {
  visible.value = true
  dialogType.value = type
  tableData.value = []
  tableDataPage.value = []
  formData.value.useUnitName = ''
  formData.value.supplierCode = ''
  getUnitGetUnitList()
	proxy.$nextTick(async () => {
    proxy.$refs.elForm && proxy.$refs.elForm.resetFields()
    try {
      if(type != 'create'){
        // 明细详情
        getPrePayDetail(row.id)
      }else{
        getPrePayGetInBoundMts({})
        const res = await ruleGenerate({name: '待清算物料明细号', receiptDate: warehouseGetYear?.yearMonth})
        formData.value.prePayNo = res.data
      }
    } catch (error) {
      console.error(error)
    }
  })

}

const noteDateChange = () => {
  const noteDate =  formData.value.noteDate
  if(noteDate && noteDate.length){
    formData.value.noteDateBegin = `${noteDate[0]} 00:00:00`
    formData.value.noteDateEnd =  `${noteDate[1]} 23:59:59`
  }else{
    formData.value.noteDateBegin = ''
    formData.value.noteDateEnd =  ''
  }
  initPrePayGetInBoundMts()
}

const useUnitChange = () => {
  if(formData.value.useUnitCode){
    const unitObj = deptAssignList.value.find(item => item.unitCode === formData.value.useUnitCode)
    formData.value.useUnitName = unitObj.unitName
  }else{
    formData.value.useUnitName = ''
  }
  initPrePayGetInBoundMts()
}

const handleSupUnit = () => {
  proxy.$refs.rluDialog.show()
}

const unitSelectChange = (data) => {
  formData.value.supplierCode = data[0].socialCode
  formData.value.supplierName = data[0].caName
  initPrePayGetInBoundMts()
}

const ibmtIdsChange = () => {
  if(!formData.value.ibmtIds.length){
    tableData.value = []
    tableDataPage.value = []
    total.value = 0
    return
  }
  getPrePayGetPrePayDtByInBoundMtId(formData.value.ibmtIds)
}

const handleButtonClick = (code) => {
  const eventObj = {
  }
  eventObj[code] && eventObj[code]()
}

const saveBtn = (status) => {
  proxy.$refs.elForm.validate(valid => {
    if (valid) {
      if(!tableData.value.length){
        proxy.$modal.msgWarning(`请选择入库单！`)
        return
      }
      let type = 'create'
      if(dialogType.value == 'modify'){
        type = 'modify'
      }
      formData.value = {...formData.value, status, dts: tableData.value}
      proxy.$modal.loading()
      prePayCreateModify(formData.value, type).then( ({message}) => {
          proxy.$modal.msgSuccess(message)
          visible.value = false
          emit('createSuccess')
      }).finally( () => {
        proxy.$modal.closeLoading()
      })
    }
  })
}

defineExpose({
  show,
})
</script>
<style lang="scss" scoped>
.ep-dialog-list{
  .sso-front-table-container{
    .form-wrapper{
      .form-left{
        .ep-select, :deep(.ep-input){
          width: 100% !important;
        }
      }
    }
  }
  .ep-divider--horizontal{
    margin: 5px 0;
  }
  .page-bottom{
    display: flex;
    flex-direction: row-reverse;
    .page-bottom-pagination{
      flex: 1;
    }
    .page-bottom-descriptions{
      margin-top: 10px;
      :deep(.ep-descriptions__body){
        margin-top: 6px;
      }
    }
  }
  .ep-icon-circle-close{
    cursor: pointer;
  }
}
</style>