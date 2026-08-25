<template>
  <ep-dialog class="ep-dialog-list" title="商城订单修改" iconTitle="form" v-model="visible" width="1300px" top="5vh" append-to-body>
    <div class="sso-front-table-container app-container">
      <div class="dialog-row-title">商城订单基本信息</div>
      <el-form class="form-wrapper" :model="formData" :rules="rules" ref="elForm" label-width="100px"> 
        <div class="form-left flex1">
          <el-row>
            <el-col :span="6">
              <el-form-item prop="orderNo" label="商城订单号：">
                <span>{{ formData.orderNo }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="areaCode" label="用料地区：">
                <el-select v-model="formData.areaCode" placeholder="请选择用料地区" clearable @change="areaChange">
                  <el-option v-for="item in plantList" :key="item.plantCode" :label="item.plantName" :value="item.plantCode">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="taxablePurpose" label="应税用途：">
                <el-select v-model="formData.taxablePurpose" placeholder="请选择应税用途" clearable>
                  <el-option v-for="item in taxablePurposeArr" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="fundSource" label="款源：">
                <el-select v-model="formData.fundSource" placeholder="请选择款源" clearable>
                  <el-option v-for="item in fundSourceArr" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
      <el-divider/>
      <div class="dialog-row-title">商城订单明细信息</div>
      <!-- 表格数据 -->
      <table-index class="table-index" :selectionShow="false" :tableJson="checkDetailsTableJson" :tableData="tableData">
        <template #taxRate="{ scope }">
          <el-select v-model="scope.row.taxRate">
            <el-option v-for="item in taxRateArr" :key="item" :label="item" :value="item">
            </el-option>
          </el-select>
        </template>
      </table-index>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="visible = false" class="cancel-btn"><svg-icon icon-class="cancel" />&nbsp;取消</el-button>
        <el-button type="primary" class="determine-btn" @click="saveBtn"><svg-icon icon-class="determine" />&nbsp;确定</el-button>
      </div>
    </template>
  </ep-dialog>
</template>

<script setup>
import { checkDetailsTableJson } from "../tableJson"
import { mtUpdate } from '@/api/warehouse/orderMt'
import { selectPlantDict } from '@/api/warehouse/plantDict'
import { dtList } from '@/api/warehouse/orderMt'
import { useDict } from "@/utils/Dict"
import { taxRateArr } from "@/utils/dictionary"
const { proxy } = getCurrentInstance()

const visible = ref(false)
const tableData = ref([])

const data = reactive({
  formData: {
    orderNo: '',
    area: '',
    areaCode: '',
    taxablePurpose: '',
    fundSource: ''
  },
  rules: {
    areaCode: [{ required: true, message: '请选择用料地区', trigger: ['blur', 'change'] }],
    taxablePurpose: [{ required: true, message: '请选择应税用途', trigger: ['blur', 'change'] }],
    fundSource: [{ required: true, message: '请选择款源', trigger: ['blur', 'change'] }],
  },
  plantList: [],
  fundSourceArr: [],
  taxablePurposeArr: []
})

const { formData, rules, plantList, fundSourceArr, taxablePurposeArr } = toRefs(data)

// 声明触发的事件（可选，增强类型校验）
const emit = defineEmits(['updateSuccess']);

const { dictList } = useDict('matl_use')
fundSourceArr.value = dictList
const { dictList: taxablePurposeDict } = useDict('tax_flag')
taxablePurposeArr.value = taxablePurposeDict

const getDtList = (mtId) => {
  proxy.$modal.loading()
  dtList({mtId, pageSize: -1}).then( ({data}) => {
    tableData.value = data.list
  }).finally( () => {
    proxy.$modal.closeLoading()
  })
}

// 显示弹框
function show(row = {}) {
  visible.value = true
  getselectPlantDict()
  getDtList(row.id)
	proxy.$nextTick(() => {
    proxy.$refs.elForm && proxy.$refs.elForm.resetFields()
    formData.value = Object.assign({}, formData.value, row)
  })

}

const getselectPlantDict = () => {
  selectPlantDict().then( ({data}) => {
    plantList.value = data
  })
}

const areaChange = () => {
  const plantObj = plantList.value.find(item => item.plantCode === formData.value.areaCode)
  formData.value.area = plantObj.plantName
}

const saveBtn = () => {
  proxy.$refs.elForm.validate(valid => {
    if (valid) {
      proxy.$modal.loading()
      mtUpdate({...formData.value, dtList: tableData.value}).then( ({message}) => {
          proxy.$modal.msgSuccess(message)
          visible.value = false
          emit('updateSuccess')
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
    .dialog-row-title {
      font-weight: 600;
      font-size: 16px;
      margin-bottom: 12px;
    }
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