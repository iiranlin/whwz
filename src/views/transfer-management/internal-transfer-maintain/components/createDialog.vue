<template>
  <ep-dialog class="ep-dialog-list" :title="dialogType == 'create'?'移库单新增':dialogType == 'modify'?'移库单修改':'移库单详情'" iconTitle="form" v-model="visible" width="1300px" top="5vh" append-to-body>
    <div class="sso-front-table-container app-container">
      <el-form class="form-wrapper" :model="formData" :rules="rules" ref="elForm" label-width="110px"> 
        <div class="form-left flex1">
          <el-row>
            <el-col :span="6">
              <el-form-item prop="billCode" label="移库单号：">
                <el-input v-if="dialogType != 'details'" v-model="formData.billCode" placeholder="自动生成" disabled />
                <span v-else>{{ formData.billCode }}</span>
              </el-form-item>
            </el-col>
            <!-- <el-col :span="6">
              <el-form-item prop="makeDate" label="制单日期：">
                <el-date-picker v-if="dialogType != 'details'" v-model="formData.makeDate" type="date" value-format="x" placeholder="请选择制单日期" disabled />
                <span v-else>{{ parseTime(formData.makeDate, "{y}-{m}-{d}") }}</span>
              </el-form-item>
            </el-col> -->
            <el-col :span="6">
              <el-form-item prop="prePlantCode" label="移出地区：" :required="isRequired()">
                <el-select v-if="dialogType != 'details'" v-model="formData.prePlantCode" placeholder="请选择移出地区" clearable @change="plantChange('pre')">
                  <el-option v-for="item in plantDictData" :key="item.plantCode" :label="item.plantName" :value="item.plantCode">
                  </el-option>
                </el-select>
                <span v-else>{{ formData.prePlantName }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="preWhCode" label="移出仓库：" :required="isRequired()">
                <el-select v-if="dialogType != 'details'" v-model="formData.preWhCode" placeholder="请选择移出仓库" clearable @change="whCodeChange('pre')">
                  <el-option v-for="item in warehouseDictListprePlantCode" :key="item.whCode" :label="item.whName" :value="item.whCode">
                  </el-option>
                </el-select>
                <span v-else>{{ formData.preWhName }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="prePartitionCode" label="移出仓库分区：" :required="isRequired()">
                <el-select v-if="dialogType != 'details'" v-model="formData.prePartitionCode" placeholder="请选择移出仓库分区" clearable @change="partitionChange('prePartitionCode')">
                  <el-option v-for="item in warehouseDictListprePartitionCode" :key="item.partitionCode" :label="item.partitionName" :value="item.partitionCode">
                  </el-option>
                </el-select>
                <span v-else>{{ formData.prePartitionName }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item prop="ptPlantCode" label="移入地区：" :required="isRequired()">
                <el-select v-if="dialogType != 'details'" v-model="formData.ptPlantCode" placeholder="请选择移入地区" clearable @change="plantChange('pt')">
                  <el-option v-for="item in prePlantArr" :key="item.plantCode" :label="item.plantName" :value="item.plantCode">
                  </el-option>
                </el-select>
                <span v-else>{{ formData.ptPlantName }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="ptWhCode" label="移入仓库：" :required="isRequired()">
                <el-select v-if="dialogType != 'details'" v-model="formData.ptWhCode" placeholder="请选择移入仓库" clearable @change="whCodeChange('pt')">
                  <el-option v-for="item in warehouseDictListptPlantCode" :key="item.whCode" :label="item.whName" :value="item.whCode">
                  </el-option>
                </el-select>
                <span v-else>{{ formData.ptWhName }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="ptPartitionCode" label="移入仓库分区：" :required="isRequired()">
                <el-select v-if="dialogType != 'details'" v-model="formData.ptPartitionCode" placeholder="请选择移入仓库分区" clearable @change="partitionChange('ptPartitionCode')">
                  <el-option v-for="item in warehouseDictListptPartitionCode" :key="item.partitionCode" :label="item.partitionName" :value="item.partitionCode">
                  </el-option>
                </el-select>
                <span v-else>{{ formData.ptPartitionName }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="taxFlagCode" label="应税用途：">
                <el-select v-if="dialogType != 'details'" v-model="formData.taxFlagCode" placeholder="请选择应税用途" clearable disabled>
                  <el-option v-for="item in taxablePurposeArr" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
                <span v-else>{{ formData.taxFlagName }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item prop="comments" label="备注：">
                <el-input v-if="dialogType != 'details'" v-model.trim="formData.comments" placeholder="请输入备注" :disabled="false" style="width: 100%;" />
                <span v-else>{{ formData.comments }}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
      <button-top :buttonJson="matlTableButtonJson" @handleButton="handleButtonClick" v-if="dialogType != 'details'">
      </button-top>
      <!-- 表格数据 -->
      <table-index class="table-index" :selectionShow="false" :required="isRequired()" :tableJson="tableJson || matlTableJson" :tableButtonJson="dialogType != 'details'?matlTableButtonJson:[]" :tableData="tableData"
        @handleButtonClick="handleButtonClick">
        <template #matlType="{ scope }">
          <span>{{`${scope.row.matlType}${scope.row.matlRaw?'/'+scope.row.matlRaw:''}${scope.row.matlpCode?'/'+scope.row.matlpCode:''}`}}</span>
        </template>
        <template #tsNum="{ scope }">
          <el-input v-if="dialogType != 'details'" v-model="scope.row.tsNum" v-number-input.float="4" clearable @input="tsNumChange(scope)" />
          <span v-else>{{ scope.row.tsNum }}</span>
        </template>
      </table-index>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="visible = false" class="cancel-btn"><svg-icon icon-class="cancel" />&nbsp;关闭</el-button>
        <el-button v-if="dialogType != 'details'" type="primary" class="determine-btn" @click="saveBtn('0')"><svg-icon icon-class="determine" />&nbsp;保存</el-button>
        <el-button v-if="dialogType != 'details'" type="primary" class="determine-btn" @click="saveBtn('1')"><svg-icon icon-class="determine" />&nbsp;提交</el-button>
      </div>
    </template>
    <rmstor-matl-dialog ref="rmstorMatlDialog" :apiUrl="rmstorMatlSelectCardsWithYKNoOutNum" @selectChange="handleSelectChange"/>
  </ep-dialog>
</template>

<script setup>
import { rmstorInternalCreateModify, rmstorInternalGetMatls, rmstorMatlSelectCardsWithYKNoOutNum } from '@/api/warehouse/rmstorInternal'
import { plantDictListAll } from '@/api/warehouse/plantDict'
import { getwarehouseByUserAndPlant, warehouseDictListAll } from '@/api/warehouse/warehouseDict'
import { getWarehousePartition, partitionListAll } from '@/api/warehouse/partition'
import { useDict } from "@/utils/Dict"
import { matlTableJson, matlTableButtonJson } from "../tableJson"
import RmstorMatlDialog from "@/views/components/rmstorMatlDialog"
import { getCookie } from '@/utils/auth'
import { ruleGenerate } from '@/api/warehouse/receiptRule'

const warehouseGetYear = getCookie("warehouseGetYear") && JSON.parse(getCookie("warehouseGetYear"))

const { proxy } = getCurrentInstance()

// 接收参数并指定类型（可选）
const props = defineProps({
  tableJson: {
    type: Array,
    default: null
  },
  plantDictData: {
    type: Array,
    default: []
  }
})


const visible = ref(false)
const dialogType = ref('create')
const tableData = ref([])

const data = reactive({
  formData: {
    billCode: '',
    makeDate: '',
    prePlantCode: '',
    prePlantName: '',
    preWhCode: '',
    preWhId: '',
    preWhName: '',
    prePartitionCode: '',
    prePartitionName: '',
    ptPlantCode: '',
    ptPlantName: '',
    ptWhCode: '',
    ptWhId: '',
    ptWhName: '',
    ptPartitionCode: '',
    ptPartitionName: '',
    taxFlagCode: '',
    taxFlagName: ''
  },
  rules: {
    makeDate: [{ required: true, message: '请选择制单日期', trigger: ['blur', 'change'] }],
    prePlantCode: [{ required: true, message: '请选择移出地区', trigger: ['blur', 'change'] }],
    preWhCode: [{ required: true, message: '请选择移出仓库', trigger: ['blur', 'change'] }],
    prePartitionCode: [{ required: true, message: '请选择移出仓库分区', trigger: ['blur', 'change'] }],
    ptPlantCode: [{ required: true, message: '请选择移入地区', trigger: ['blur', 'change'] }],
    ptWhCode: [{ required: true, message: '请选择移入仓库', trigger: ['blur', 'change'] }],
    ptPartitionCode: [{ required: true, message: '请选择移入仓库分区', trigger: ['blur', 'change'] }],
  },
  plantList: [],
  warehouseDictListprePlantCode: [],
  warehouseDictListptPlantCode: [],
  taxablePurposeArr: [],
  warehouseDictListprePartitionCode: [],
  warehouseDictListptPartitionCode: [],
  prePlantArr: [],
  prePartitionObj: {}
})

const { formData, rules, warehouseDictListprePlantCode, warehouseDictListptPlantCode, taxablePurposeArr, prePlantArr, warehouseDictListprePartitionCode, warehouseDictListptPartitionCode, prePartitionObj } = toRefs(data)

// 声明触发的事件（可选，增强类型校验）
const emit = defineEmits(['createSuccess']);

const { dictList: taxablePurposeDict } = useDict('tax_flag')
taxablePurposeArr.value = taxablePurposeDict


const getPlantDictListAll = (allocationStockAttr, allocationTaxFlagCode) => {
  return new Promise((resolve) => {
    plantDictListAll({allocationStockAttr, allocationTaxFlagCode}).then( ({data}) => {
      prePlantArr.value = data
      resolve()
    })
  })
}

const getwarehouseByUserAndPlantAll = (plantId, code = '', allocationStockAttr, allocationTaxFlagCode) => {
  return new Promise((resolve) => {
    const url = code == 'prePlantCode'?getwarehouseByUserAndPlant:warehouseDictListAll
    url({plantId, allocationStockAttr, allocationTaxFlagCode}).then( ({data}) => {
      if(code == 'prePlantCode'){
        warehouseDictListprePlantCode.value = data
      }else{
        warehouseDictListptPlantCode.value = data
      }
      resolve()
    })
  })
}

const getWarehousePartitionAll = (whId, code = '', allocationStockAttr, allocationTaxFlagCode) => {
  return new Promise((resolve) => {
    const url = code == 'prePartitionCode'?getWarehousePartition:partitionListAll
    url({whId, allocationStockAttr, allocationTaxFlagCode}).then( ({data}) => {
      if(code == 'prePartitionCode'){
        warehouseDictListprePartitionCode.value = data
      }else{
        warehouseDictListptPartitionCode.value = data
      }
      resolve()
    })
  })
}

const getRmstorInternalGetMatls = (id) => {
  proxy.$modal.loading()
  rmstorInternalGetMatls(id).then(({data}) => {
    tableData.value = data || []
  }).finally( () => {
    proxy.$modal.closeLoading()
  })
}

// 显示弹框
function show(type = 'create', row = {}) {
  visible.value = true
  dialogType.value = type
  tableData.value = []
	proxy.$nextTick(async () => {
    proxy.$refs.elForm && proxy.$refs.elForm.resetFields()
    try {
      if(type === 'create'){
        formData.value.makeDate = getCookie('warehouseYearMonth')
        const res = await ruleGenerate({name: '移库单', receiptDate: warehouseGetYear?.yearMonth})
        formData.value.billCode = res.data
      }else{
        formData.value = Object.assign({}, formData.value, row)
        // 明细详情
        getRmstorInternalGetMatls(row.id)
        if(type === 'modify'){
          // 移出仓库
          const plantObj = props.plantDictData.find(item => item.plantCode === formData.value.prePlantCode)
          await getwarehouseByUserAndPlantAll(plantObj?.id, 'prePlantCode')
          // 移出仓库分区
          const preWhObj = warehouseDictListprePlantCode.value.find(item => item.whCode === formData.value.preWhCode)
          formData.value.preWhId = preWhObj?.id
          await getWarehousePartitionAll(preWhObj?.id, 'prePartitionCode')

          // 移入仓库
          prePartitionObj.value = warehouseDictListprePartitionCode.value.find(item => item.partitionCode === formData.value.prePartitionCode)
          await getPlantDictListAll(prePartitionObj.value.stockattr, prePartitionObj.value.taxFlagCode)
          // 移入仓库
          const ptPlantObj = props.plantDictData.find(item => item.plantCode === formData.value.ptPlantCode)
          await getwarehouseByUserAndPlantAll(ptPlantObj?.id, 'ptPlantCode', prePartitionObj.value.stockattr, prePartitionObj.value.taxFlagCode)
          // 移入仓库分区
          const ptWhObj = warehouseDictListptPlantCode.value.find(item => item.whCode === formData.value.ptWhCode)
          formData.value.ptWhId = ptWhObj?.id
          await getWarehousePartitionAll(ptWhObj?.id, 'ptPartitionCode', prePartitionObj.value.stockattr, prePartitionObj.value.taxFlagCode)
        }
      }
    } catch (error) {
      console.error(error)
    }
  })

}

const isRequired = () => {
  return dialogType.value != 'details'
}

const clearPt = () => {
  formData.value.ptPlantCode = ''
  formData.value.ptWhCode = ''
  formData.value.ptPartitionCode = ''
  formData.value.taxFlagCode = ''
  formData.value.taxFlagName = ''
  prePlantArr.value = []
  warehouseDictListptPlantCode.value = []
  warehouseDictListptPartitionCode.value = []
  prePartitionObj.value = {}
}

const plantChange = (code) => {
  const plantObj = props.plantDictData.find(item => item.plantCode === formData.value[`${code}PlantCode`])
  formData.value[`${code}PlantName`] = plantObj?.plantName
  formData.value[`${code}WhCode`] = ''
  formData.value[`${code}PartitionCode`] = ''
  if(code === 'pre'){
    warehouseDictListprePlantCode.value = []
    warehouseDictListprePartitionCode.value = []
    clearPt()
  }else{
    warehouseDictListptPlantCode.value = []
    warehouseDictListptPartitionCode.value = []
  }
  if(formData.value[`${code}PlantCode`]){
    getwarehouseByUserAndPlantAll(plantObj?.id, `${code}PlantCode`, prePartitionObj.value?.stockattr, prePartitionObj.value?.taxFlagCode)
  }
}

const whCodeChange = (code) => {
  const warehouseDictListPlantCode = code == 'pt'?warehouseDictListptPlantCode.value:warehouseDictListprePlantCode.value
  const whObj = warehouseDictListPlantCode.find(item => item.whCode === formData.value[`${code}WhCode`])
  formData.value[`${code}WhName`] = whObj?.whName
  formData.value[`${code}WhId`] = whObj?.id
  formData.value[`${code}PartitionCode`] = ''
  formData.value[`${code}PartitionName`] = ''
  if(code === 'pre'){
    warehouseDictListprePartitionCode.value = []
    clearPt()
  }else{
    warehouseDictListptPartitionCode.value = []
  }
  if(formData.value[`${code}WhCode`]){
    getWarehousePartitionAll(whObj?.id, `${code}PartitionCode`, prePartitionObj.value?.stockattr, prePartitionObj.value?.taxFlagCode)
  }
}

const partitionChange = (code) => {
  if(code === 'ptPartitionCode' && formData.value.ptPartitionCode){
    const ptWhObj = warehouseDictListptPartitionCode.value.find(item => item.partitionCode === formData.value.ptPartitionCode)
    formData.value.ptPartitionName = ptWhObj.partitionName
    return
  }
  clearPt()
  if(formData.value.prePartitionCode){
    prePartitionObj.value = warehouseDictListprePartitionCode.value.find(item => item.partitionCode === formData.value.prePartitionCode)
    formData.value.prePartitionName = prePartitionObj.value.partitionName
    formData.value.taxFlagCode = prePartitionObj.value.taxFlagCode
    formData.value.taxFlagName = prePartitionObj.value.taxFlagName
    getPlantDictListAll(prePartitionObj.value.stockattr, prePartitionObj.value.taxFlagCode)
  }
}

const handleButtonClick = (code, data) => {
  const {prePlantCode, preWhCode, preWhId, ptPlantCode, ptWhCode, prePartitionCode, ptPartitionCode} = formData.value
  const eventObj = {
    // 选择物资
    choiceMatl: () => {
      let preWhHint = ''
      if(!prePlantCode){
        // 请选择移出地区！”或“请选择移出仓库！”或“请选择移入地区！”或“请选择移入仓库！
        preWhHint = '请选择移出地区！'
      }else if(!preWhCode){
        preWhHint = '请选择移出仓库！'
      }else if(!prePartitionCode){
        preWhHint = '请选择移出仓库分区！'
      }else if(!ptPlantCode){
        preWhHint = '请选择移入地区！'
      }else if(!ptWhCode){
        preWhHint = '请选择移入仓库！'
      }else if(!ptPartitionCode){
        preWhHint = '请选择移入仓库分区！'
      }
      if(preWhHint){
        proxy.$modal.msgWarning(preWhHint)
        return
      }
      proxy.$refs.rmstorMatlDialog.show({depotCode: preWhCode, depotId: preWhId, partitionCode: prePartitionCode}, tableData.value)
    },
    // 删除
    delete: () => {
      tableData.value.splice(data.$index,1)
    },
  }
  eventObj[code] && eventObj[code]()
}

const handleSelectChange = (data) => {
  tableData.value.push(...data.map(a => {
    return {...a, stockNum: a.nowNum}
  }))
}

const tsNumChange = (scope) => {
  if(scope.row.tsNum > scope.row.stockNum){
    const num  = scope.row.tsNum - scope.row.stockNum
    proxy.$modal.msgWarning(`第${scope.$index+1}行，移出数量大于库存数量${num}！`)
    scope.row.tsNum = ''
  }
  scope.row.tsAmount = (scope.row.tsNum * scope.row.cardPrice).toFixed(2)
}

const saveBtn = (flag) => {
  proxy.$refs.elForm.validate(valid => {
    if (valid) {
      if(!tableData.value.length){
        proxy.$modal.msgWarning(`请选择移库单明细！`)
        return
      }
      let isTsNum = false
      for(let i = 0;i<tableData.value.length;i++){
        if(!tableData.value[i].tsNum || tableData.value[i].tsNum == '0'){
          isTsNum = true
          proxy.$modal.msgWarning(`第${i+1}行，移出数量不能为空或0！`)
          break
        }
      }
      if(isTsNum){
        return
      }
      formData.value = {...formData.value, flag, dtList: tableData.value}
      proxy.$modal.loading()
      rmstorInternalCreateModify(formData.value, dialogType.value).then( ({message}) => {
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
}
</style>