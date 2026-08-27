<template>
  <ep-dialog class="ep-dialog-list" :title="dialogType == 'create'?'调拨(销售)单新增':dialogType == 'modify'?'调拨(销售)单修改':'调拨(销售)单详情'" iconTitle="form" v-model="visible" width="1300px" top="5vh" append-to-body>
    <div class="sso-front-table-container app-container">
      <el-form class="form-wrapper" :model="formData" :rules="rules" ref="elForm" label-width="110px"> 
        <div class="form-left flex1">
          <el-row>
            <el-col :span="6">
              <el-form-item prop="outsaleCode" label="调拨(销售)单号：">
                <el-input v-if="dialogType != 'details'" v-model="formData.outsaleCode" placeholder="自动生成" disabled />
                <span v-else>{{ formData.outsaleCode }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="rluName" label="收料单位：" :required="isRequired()">
                <el-input v-if="dialogType != 'details'" v-model="formData.rluName" readonly clearable placeholder="请选择收料单位">
                  <template #append>
                    <el-button class="ep-input-button-icon" icon="Search" @click="rluClick"></el-button>
                  </template>
                </el-input>
                <span v-else>{{ formData.rluName }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="adjTypeCode" label="调拨类型：" :required="isRequired()">
                <el-select v-if="dialogType != 'details'" v-model="formData.adjTypeCode" placeholder="请选择调拨类型" clearable>
                  <el-option v-for="item in adjTypeCodeArr" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
                <span v-else>{{ adjTypeCodeObj[formData.adjTypeCode] }}</span>
              </el-form-item>
            </el-col>
            <!-- <el-col :span="6">
              <el-form-item prop="handleAdviseType" label="处置方式：">
                <el-select v-if="dialogType != 'details'" v-model="formData.handleAdviseType" placeholder="请选择处置方式" clearable>
                  <el-option v-for="item in handleAdviseTypeArr" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
                <span v-else>{{ handleAdviseTypeObj[formData.handleAdviseType] }}</span>
              </el-form-item>
            </el-col> -->
            <el-col :span="6">
              <el-form-item prop="plantCode" label="调出地区：" :required="isRequired()">
                <el-select v-if="dialogType != 'details'" v-model="formData.plantCode" placeholder="请选择调出地区" clearable @change="plantChange">
                  <el-option v-for="item in plantDictData" :key="item.plantCode" :label="item.plantName" :value="item.plantCode">
                  </el-option>
                </el-select>
                <span v-else>{{ formData.plantName }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item prop="depotCode" label="调出仓库：" :required="isRequired()">
                <el-select v-if="dialogType != 'details'" v-model="formData.depotCode" placeholder="请选择调出仓库" clearable @change="depotChange">
                  <el-option v-for="item in warehouseDictListplantCode" :key="item.whCode" :label="item.whName" :value="item.whCode">
                  </el-option>
                </el-select>
                <span v-else>{{ formData.depotName }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="partitionCode" label="调出仓库分区：" :required="isRequired()">
                <el-select v-if="dialogType != 'details'" v-model="formData.partitionCode" placeholder="请选择调出仓库" clearable @change="partitionChange">
                  <el-option v-for="item in partitionList" :key="item.partitionCode" :label="item.partitionName" :value="item.partitionCode">
                  </el-option>
                </el-select>
                <span v-else>{{ formData.partitionName }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="fee" label="运杂费：" :required="isRequired()">
                <el-input v-if="dialogType != 'details'" v-model="formData.fee" v-number-input.float="4" clearable placeholder="请输入运杂费" />
                <span v-else>{{ formData.fee }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="taxablePurpose" label="应税用途：">
                <el-select v-if="dialogType != 'details'" v-model="formData.taxablePurpose" placeholder="请选择应税用途" clearable disabled>
                  <el-option v-for="item in taxablePurposeArr" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
                <span v-else>{{ formData.taxFlagName }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="planCode" label="调剂申请单：">
                <el-input v-if="dialogType != 'details'" v-model="formData.planCode" readonly placeholder="请选择调剂申请单">
                  <template #suffix v-if="formData.planCode">
                    <el-icon class="ep-icon-circle-close" @click="planCloseClick"><CircleClose/></el-icon>
                  </template>
                  <template #append>
                    <el-button class="ep-input-button-icon" icon="Search" @click="planClick"></el-button>
                  </template>
                </el-input>
                <span v-else>{{ formData.planCode }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="approver" label="审批人：" :required="isRequired()">
                <el-input v-if="dialogType != 'details'" v-model="formData.approver" readonly clearable placeholder="请选择审批人">
                  <template #append>
                    <el-button class="ep-input-button-icon" icon="Search" @click="approverClick"></el-button>
                  </template>
                </el-input>
                <span v-else>{{ formData.approver }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="comments" label="备注：">
                <el-input v-if="dialogType != 'details'" v-model.trim="formData.comments" clearable placeholder="请输入备注"/>
                <span v-else>{{ formData.comments }}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
      <button-top :buttonJson="matlTableButtonJson" @handleButton="handleButtonClick" v-if="dialogType != 'details'">
      </button-top>
      <!-- 表格数据 -->
      <table-index class="table-index" :selectionShow="false" :required="isRequired()" :tableJson="matlTableJson" :tableButtonJson="dialogType != 'details'?matlTableButtonJson:[]" :tableData="tableData"
        @handleButtonClick="handleButtonClick">
        <template #matlType="{ scope }">
          <span>{{`${scope.row.matlType}${scope.row.matlRaw?'/'+scope.row.matlRaw:''}${scope.row.matlpCode?'/'+scope.row.matlpCode:''}`}}</span>
        </template>
        <template #outsaleNum="{ scope }">
          <el-input v-if="dialogType != 'details'" v-model="scope.row.outsaleNum" v-number-input.float="4" clearable @input="outsaleNumChange(scope)" />
          <span v-else>{{ scope.row.outsaleNum }}</span>
        </template>
        <template #outsalePrice="{ scope }">
          <el-input v-if="dialogType != 'details'" v-model="scope.row.outsalePrice" v-number-input.float="4" clearable @change="outsaleNumChange(scope)" />
          <span v-else>{{ scope.row.outsalePrice }}</span>
        </template>
      </table-index>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="visible = false" class="cancel-btn"><svg-icon icon-class="cancel" />&nbsp;关闭</el-button>
        <el-button v-if="dialogType != 'details'" type="primary" class="determine-btn" @click="saveBtn(false)"><svg-icon icon-class="determine" />&nbsp;保存</el-button>
        <el-button v-if="dialogType != 'details'" type="primary" class="determine-btn" @click="saveBtn(true)"><svg-icon icon-class="determine" />&nbsp;提交</el-button>
        <el-button v-if="formData.permFlag == '1' && dialogType == 'details'" type="primary" class="determine-btn" @click="handleApprove('1')"><svg-icon icon-class="determine" />&nbsp;审批</el-button>
        <el-button v-if="formData.permFlag == '1' && dialogType == 'details'" type="primary" class="determine-btn" @click="handleApprove('2')"><svg-icon icon-class="determine" />&nbsp;驳回</el-button>
      </div>
    </template>
    <rmstor-matl-dialog ref="rmstorMatlDialog" :rmstorMatlFormJsonProps="rmstorMatlFormJson" :rmstorMatlTableJsonProps="rmstorMatlTableJson" @selectChange="handleSelectChange"/>
    <adjust-dialog ref="adjustDialog" />
    <user-dialog ref="userDialog" @selectChange="userSelectChange" />
    <rlu-dialog ref="rluDialog" @selectChange="rluSelectChange" />
  </ep-dialog>
</template>

<script setup>
import { mainCreateModify, mainDetail, mainReview } from '@/api/warehouse/externalTransfer'
import { selectPlantDict } from '@/api/warehouse/plantDict'
import { getwarehouseByUserAndPlant } from '@/api/warehouse/warehouseDict'
import { getWarehousePartition } from '@/api/warehouse/partition'
import { ruleGenerate } from '@/api/warehouse/receiptRule'
import { useDict } from "@/utils/Dict"
import { rmstorMatlFormJson } from "../formJson"
import { matlTableJson, matlTableButtonJson, rmstorMatlTableJson } from "../tableJson"
import { adjTypeCodeArr, adjTypeCodeObj, handleAdviseTypeArr, handleAdviseTypeObj } from '@/utils/dictionary'
import RmstorMatlDialog from "@/views/components/rmstorMatlDialog"
import UserDialog from "@/views/components/userDialog"
import AdjustDialog from "@/views/transfer-management/components/adjustDialog"
import RluDialog from "@/views/transfer-management/components/rluDialog"
import { getCookie } from "@/utils/auth";

const { proxy } = getCurrentInstance()

const visible = ref(false)
const dialogType = ref('create')
const tableData = ref([])

const data = reactive({
  formData: {
    outsaleCode: '',
    rluCode: '',
    rluName: '',
    adjTypeCode: '',
    plantCode: '',
    plantName: '',
    depotCode: '',
    depotName: '',
    partitionCode: '',
    partitionName: '',
    fee: '',
    taxablePurpose: '',
    planCode: '',
    comments: '',
    approver: '',
    // handleAdviseType: ''
  },
  rules: {
    rluName: [{ required: true, message: '请选择收料单位', trigger: ['blur', 'change'] }],
    adjTypeCode: [{ required: true, message: '请选择调拨类型', trigger: ['blur', 'change'] }],
    // handleAdviseType: [{ required: true, message: '请选择处置方式', trigger: ['blur', 'change'] }],
    plantCode: [{ required: true, message: '请选择调出地区', trigger: ['blur', 'change'] }],
    depotCode: [{ required: true, message: '请选择调出仓库', trigger: ['blur', 'change'] }],
    partitionCode: [{ required: true, message: '请选择调出仓库分区', trigger: ['blur', 'change'] }],
    fee: [{ required: true, message: '请输入运杂费', trigger: 'blur' }],
    approver: [{ required: true, message: '请选择或填写审批人', trigger: ['blur', 'change'] }],
  },
  plantDictData: [],
  warehouseDictListplantCode: [],
  taxablePurposeArr: [],
  partitionList: []
})

const { formData, rules, plantDictData, warehouseDictListplantCode, taxablePurposeArr, partitionList } = toRefs(data)

// 声明触发的事件（可选，增强类型校验）
const emit = defineEmits(['createSuccess']);

const warehouseGetYear = getCookie("warehouseGetYear") && JSON.parse(getCookie("warehouseGetYear"));

const { dictList: taxablePurposeDict } = useDict('tax_flag')
taxablePurposeArr.value = taxablePurposeDict

const isRequired = () => {
  return dialogType.value != 'details'
}

const getselectPlantDict = () => {
  selectPlantDict().then( ({data}) => {
    plantDictData.value = data || []
  })
}

const getwarehouseByUserAndPlantAll = (plantId) => {
  return new Promise((resolve) => {
    getwarehouseByUserAndPlant({plantId}).then( ({data}) => {
      warehouseDictListplantCode.value = data
      resolve()
    })
  })
}

const getWarehousePartitionAll = (whId) => {
  getWarehousePartition({whId}).then( ({data}) => {
    partitionList.value = data || []
  })
}

const getMainDetail = (mtId) => {
  proxy.$modal.loading()
  mainDetail(mtId).then(async ({data}) => {
    tableData.value = data.outsaleDetailList || []
    delete data.outsaleDetailList
    formData.value = data
    if(formData.value.plantCode){
      const plantObj = plantDictData.value.find(item => item.plantCode === formData.value.plantCode)
      await getwarehouseByUserAndPlantAll(plantObj.id)
    }
    if(formData.value.depotCode){
      const whObj = warehouseDictListplantCode.value.find(item => item.whCode === formData.value.depotCode)
      await getWarehousePartitionAll(whObj.id)
    }
  }).finally( () => {
    proxy.$modal.closeLoading()
  })
}

// 显示弹框
function show (type = 'create', row = {}) {
  visible.value = true
  dialogType.value = type
  tableData.value = []
  warehouseDictListplantCode.value = []
  partitionList.value = []
	proxy.$nextTick(async () => {
    try {
      proxy.$refs.elForm && proxy.$refs.elForm.resetFields()
      await getselectPlantDict()
      if(type != 'create'){
        getMainDetail(row.mtId)
      }else{
        const res = await ruleGenerate({name: '对外调拨单', receiptDate: warehouseGetYear?.yearMonth})
        formData.value.outsaleCode = res.data
      }
    } catch (error) {
      console.error(error)
    }
  })

}

const planCloseClick = () => {
  formData.value.planCode = ''
}

const plantChange = () => {
  const plantObj = plantDictData.value.find(item => item.plantCode === formData.value.plantCode)
  formData.value.plantName = plantObj?.plantName
  formData.value.depotCode = ''
  formData.value.partitionCode = ''
  warehouseDictListplantCode.value = []
  partitionList.value = []
  if(formData.value.plantCode){
    getwarehouseByUserAndPlantAll(plantObj?.id)
  }
}

const depotChange = () => {
  const ptWhObj = warehouseDictListplantCode.value.find(item => item.whCode === formData.value.depotCode)
  formData.value.depotName = ptWhObj?.whName
  formData.value.partitionCode = ''
  partitionList.value = []
  if(formData.value.depotCode){
    getWarehousePartitionAll(ptWhObj?.id)
  }
}

const partitionChange = () => {
  const partitionObj = partitionList.value.find(item => item.partitionCode === formData.value.partitionCode)
  formData.value.partitionName = partitionObj?.partitionName
  formData.value.taxablePurpose = partitionObj?.taxFlagCode
}

// 收料单位点击
const rluClick = () => {
  proxy.$refs.rluDialog.show()
}

// 调剂申请单点击
const planClick = () => {
  const {rluName, rluCode, plantCode, depotCode, partitionCode, fee} = formData.value
  let preWhHint = ''
  if(!rluName){
    preWhHint = '请选择收料单位！'
  }else if(!plantCode){
    preWhHint = '请选择调出地区！'
  }else if(!depotCode){
    preWhHint = '请选择调出仓库！'
  }else if(!partitionCode){
    preWhHint = '请选择调出仓库分区！'
  }else if(!fee){
    preWhHint = '请填写运杂费！'
  }
  if(preWhHint){
    proxy.$modal.msgWarning(preWhHint)
    return
  }
  proxy.$refs.adjustDialog.show({rluName, rluCode, plantCode, depotCode, partitionCode, fee})
}

// 审批人点击
const approverClick = () => {
  proxy.$refs.userDialog.show()
}

const handleButtonClick = (code, data) => {
  const {plantCode, depotCode, partitionCode, rluCode, fee, approver} = formData.value
  const eventObj = {
    // 选择物资
    choiceMatl: () => {
      let preWhHint = ''
      if(!plantCode){
        preWhHint = '请选择调出地区！'
      }else if(!depotCode){
        preWhHint = '请选择调出仓库！'
      }else if(!partitionCode){
        preWhHint = '请选择调出仓库分区！'
      }else if(!rluCode){
        preWhHint = '请选择收料单位！'
      }else if(!fee){
        preWhHint = '请填写运杂费！'
      }else if(!approver){
        preWhHint = '请选择或填写审批人！'
      }
      if(preWhHint){
        proxy.$modal.msgWarning(preWhHint)
        return
      }
      proxy.$refs.rmstorMatlDialog.show({partitionCode, depotCode}, tableData.value)
    },
    // 删除
    delete: () => {
      tableData.value.splice(data.$index,1)
    },
  }
  eventObj[code] && eventObj[code]()
}

const rluSelectChange = (data) => {
  formData.value.rluCode = data[0].unitCode
  formData.value.rluName = data[0].unitName
}

const handleSelectChange = (data) => {
  tableData.value.push(...data.map(a => {
    return {...a, cardNum: a.nowNum}
  }))
}

const userSelectChange = (data) => {
  formData.value.approver = data[0].userName
}

const outsaleNumChange = (scope) => {
  if(scope.row.outsaleNum > scope.row.cardNum){
    const num  = scope.row.outsaleNum - scope.row.cardNum
    proxy.$modal.msgWarning(`第${scope.$index+1}行，调拨数量大于库存数量${num}！`)
    scope.row.outsaleNum = ''
  }
  if(scope.row.outsaleNum && scope.row.outsalePrice){
    scope.row.outsaleAmount = (scope.row.outsaleNum * scope.row.outsalePrice).toFixed(2)
  }
}

const saveMainCreateModify = (formData) => {
  proxy.$modal.loading()
  mainCreateModify(formData, dialogType.value).then( ({message}) => {
      proxy.$modal.msgSuccess(message)
      visible.value = false
      emit('createSuccess')
  }).finally( () => {
    proxy.$modal.closeLoading()
  })
}

const saveBtn = (isSign) => {
  proxy.$refs.elForm.validate(valid => {
    if (valid) {
      if(!tableData.value.length){
        proxy.$modal.msgWarning(`请选择调拨(销售)单明细！`)
        return
      }
      let isOutsaleNum = false
      for(let i = 0;i<tableData.value.length;i++){
        if(!tableData.value[i].outsaleNum || tableData.value[i].outsaleNum == '0'){
          isOutsaleNum = true
          proxy.$modal.msgWarning(`第${i+1}行，调拨数量不能为空或0！`)
          break
        }
        if(!tableData.value[i].outsalePrice || tableData.value[i].outsalePrice == '0'){
          isOutsaleNum = true
          proxy.$modal.msgWarning(`第${i+1}行，调拨单价不能为空或0！`)
          break
        }
      }
      if(isOutsaleNum){
        return
      }
      formData.value = {...formData.value, isSign,details: tableData.value}
      if(isSign){
        // 无工作流：直接保存并报批，不走"选审批人"弹窗（$reviewerDialog），不再传 auditUserId
        // proxy.$reviewerDialog({
        //   billType: 'DWDBD',
        //   billIdList: [],
        //   multiple: true,
        //   success: ({auditUserId}) => {
        //     saveMainCreateModify({...formData.value, auditUserId})
        //   }
        // })
        saveMainCreateModify(formData.value)
        return
      }
      saveMainCreateModify(formData.value)
    }
  })
}

const setMainReview = (isApproved, comment) => {
  mainReview([{billType: 'DWDBD', comment, mtId: formData.value.mtId, state: isApproved}]).then(({message}) => {
    proxy.$modal.msgSuccess(message)
    visible.value = false
    emit('createSuccess')
  })
}

const handleApprove = (isApproved) => {
  if(isApproved === '1'){
    // 无工作流：直接审批通过，不走"选审批人"弹窗（$reviewerDialog），不再传 auditUserId
    // proxy.$reviewerDialog({
    //   billId: formData.value.mtId,
    //   multiple: true,
    //   urlType: false,
    //   success: ({auditUserId, comment}) => {
    //     setMainReview(isApproved, auditUserId, comment)
    //   }
    // })
    setMainReview(isApproved, '')
  }else{
    proxy.$modal.prompt('驳回原因', {
      inputValidator: (val) => {
        if(!val.trim()) return '驳回原因不能为空'
        return true
      },
      inputErrorMessage: '请输入驳回原因'
    }).then( (data) => {
      setMainReview(isApproved, data.value)
    })
  }
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
.ep-icon-circle-close{
  cursor: pointer;
}
</style>