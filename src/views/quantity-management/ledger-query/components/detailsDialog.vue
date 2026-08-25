<template>
  <ep-dialog class="ep-dialog-list" title="数量管理物资台账详情" iconTitle="form" v-model="visible" width="1300px" top="5vh" append-to-body>
    <div class="sso-front-table-container app-container">
      <el-form class="form-wrapper" :model="formData" ref="elForm" label-width="134px"> 
        <div class="form-left flex1">
          <el-row>
            <el-col :span="6">
              <el-form-item prop="plantName" label="用料地区：">
                <span>{{ formData.plantName }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="depotName" label="仓库：">
                <span>{{ formData.depotName }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="partitionName" label="仓库分区：">
                <span>{{ formData.partitionName }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="matlCode" label="物资编码：">
                <span>{{ formData.matlCode }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item prop="matlName" label="物资名称：">
                <span>{{ formData.matlName }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="matlType" label="规格型号/材质/图号：">
                <span>{{`${formData.matlType}${formData.matlRaw?'/'+formData.matlRaw:''}${formData.matlpCode?'/'+formData.matlpCode:''}`}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="matlUnit" label="计量单位：">
                <span>{{ formData.matlUnit }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="cardPrice" label="单价：">
                <span>{{ formData.cardPrice }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="nowNum" label="结存数量：">
                <span>{{ formData.nowNum }}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
      <button-top :buttonJson="matlTableButtonJson" @handleButton="handleButtonClick">
      </button-top>
      <!-- 表格数据 -->
      <table-index class="table-index" :selectionShow="false" :tableJson="matlTableJson" :tableData="tableData"
        @handleButtonClick="handleButtonClick">
        <template #matlType="{ scope }">
          <span>{{`${scope.row.matlType}${scope.row.matlRaw?'/'+scope.row.matlRaw:''}${scope.row.matlpCode?'/'+scope.row.matlpCode:''}`}}</span>
        </template>
      </table-index>
      <p style="margin: 0;">合计：入库数量，{{tableData[0]?.totalInNum || 0}}；出库数量，{{tableData[0]?.totalOutNum || 0}}</p>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="visible = false" class="cancel-btn"><svg-icon icon-class="cancel" />&nbsp;返回</el-button>
      </div>
    </template>
  </ep-dialog>
</template>

<script setup>
import { matlcardDetailList, matlcardDetailListExport } from '@/api/warehouse/matlcard'
import { matlTableJson, matlTableButtonJson } from "../tableJson"

const { proxy } = getCurrentInstance()

const visible = ref(false)
const tableData = ref([])

const data = reactive({
  formData: {}
})

const { formData } = toRefs(data)

// 声明触发的事件（可选，增强类型校验）
const emit = defineEmits(['createSuccess']);

const getMatlcardDetailList = (params) => {
  proxy.$modal.loading()
  matlcardDetailList({...params, pageNum: -1, pageSize: -1}).then(({data}) => {
    tableData.value = data.list || []
  }).finally( () => {
    proxy.$modal.closeLoading()
  })
}

// 显示弹框
function show(row = {}) {
  visible.value = true
  tableData.value = []
	proxy.$nextTick(async () => {
    formData.value = Object.assign({}, formData.value, row)
    // 明细详情
    getMatlcardDetailList(formData.value)
  })
}

const handleButtonClick = (code, data) => {
  const eventObj = {
    // 导出
    export: () => {
      const params =  formData.value
      proxy.$download.name(matlcardDetailListExport, params)
    }
  }
  eventObj[code] && eventObj[code]()
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
}
</style>