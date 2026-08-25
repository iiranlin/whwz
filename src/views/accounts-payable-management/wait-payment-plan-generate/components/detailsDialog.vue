<template>
  <ep-dialog class="ep-dialog-list" title="待付款计划单详情" iconTitle="form" v-model="visible" width="1300px" top="5vh" append-to-body>
    <div class="app-container">
      <el-form class="form-wrapper" ref="elForm" label-width="140px"> 
        <div class="form-left flex1">
          <el-row>
            <el-col :span="6">
              <el-form-item prop="prePayPlanCode" label="付款计划单号：">
                <span>{{ rowData.prePayPlanCode }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="合同号：">
                <span>{{ rowData.scontCode }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="采购组织形式：">
                <span>{{ rowData.spurcTypeName }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="质保期：">
                <span>{{ rowData.warrantyPeriod }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="18">
              <el-form-item label="付款周期：">
                <span>{{ rowData.paymentCycle }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="计划付款总金额(元)：">
                <span>{{ rowData.sumAmount }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="供应商名称：">
                <span>{{ rowData.supplierName }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="采供单位名称：">
                <span>{{ getCookie('unitName') }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6" v-if="idName == 'planMtId'">
              <el-form-item label="付款比例(%)：">
                <span>{{ rowData.payedPercent }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6" v-if="idName == 'planMtId'">
              <el-form-item label="本期付款金额：">
                <span>{{ rowData.payedAmount }}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
      <el-divider style="margin-top: 0;"/>
      <!-- 表格数据 -->
      <table-index class="table-index" :selectionShow="false" :tableJson="matlTableJson" :tableData="tableData"
        @clickLink="handleClickLink">
      </table-index>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="visible = false" class="cancel-btn"><svg-icon icon-class="cancel" />&nbsp;关闭</el-button>
      </div>
    </template>
    <PreviewAttachment ref="previewAttachment"></PreviewAttachment>
  </ep-dialog>
</template>

<script setup>
import { prePayPlanGetPddIds } from '@/api/warehouse/prePayPlan'
import { matlTableJson } from "../tableJson"
import PreviewAttachment from '@/components/PreviewAttachment'
import { resPoolMinioDownload } from "@/api/system/minio"
import { selectInvoiceListByPddId } from '@/api/warehouse/prePay'
import { uploadTypeArr } from '@/utils/dictionary'
import { getCookie } from '@/utils/auth'
const { proxy } = getCurrentInstance()

const props = defineProps({
  idName: {
    type: String,
    default: 'id'
  }
})

const visible = ref(false)
const tableData = ref([])
const pddIds = ref([])

const data = reactive({
  rowData: {}
})

const { rowData} = toRefs(data)

const getPrePayPlanGetPddIds = async () => {
  try {
    const res = await prePayPlanGetPddIds(rowData.value[props.idName])
    pddIds.value = res.data || []
    getSelectInvoiceListByPddId(pddIds.value)
  } catch (error) {
    console.error(error)
  }
}

const getSelectInvoiceListByPddId = (pddIds) => {
  proxy.$modal.loading()
  selectInvoiceListByPddId({pddIds}).then( ({data}) => {
    tableData.value = data || []
  }).finally( () => {
    proxy.$modal.closeLoading()
  })
}



// 显示弹框
function show(row = {}) {
  visible.value = true
  tableData.value = []
  rowData.value = row
  getPrePayPlanGetPddIds()
}

const handleClickLink = (code, data) => {
  const eventObj = {
    originFileName: async () => {
      const type = data.fileName.substring(data.fileName.lastIndexOf('.') + 1)
      if(uploadTypeArr.includes(type)){
        const url = await proxy.$download.preview(resPoolMinioDownload, {fileName: data.fileName})
        proxy.$refs.previewAttachment.show(url, type)
      }else{
        proxy.$download.name(resPoolMinioDownload, {fileName: data.fileName})
      }
    }
  }
  eventObj[code] && eventObj[code]()
}

defineExpose({
  show,
})
</script>
<style lang="scss" scoped>  
</style>