<template>
  <ep-dialog title="商城订单调整" iconTitle="form" v-model="visible" width="750px" top="5vh" append-to-body>
    <div class="sso-front-table-container">
      <el-form class="form-wrapper" :model="formData" :rules="rules" ref="elForm" :inline="true" label-width="140px"> 
        <div class="form-left flex1">
          <el-row>
            <el-col :span="12">
              <el-form-item prop="spdCode" label="采购订单号：">
                <span>{{ formData.spdCode }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="matlCode" label="物资编码：">
                <span>{{ formData.matlCode }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="matlName" label="物资名称：">
                <span>{{ formData.matlName }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="商城调整计量单位：" prop="matlUnit">
                <el-select v-model="formData.matlUnit" placeholder="请选择" clearable>
                  <el-option v-for="item in matlUnitList" :key="item.label" :label="item.label" :value="item.label">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="contPrice" label="商城调整单价：">
                <span>{{ formData.contPrice }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="purNum" label="商城调整数量：">
                <el-input v-model="formData.purNum" v-number-input.float="4" placeholder="请输入商城调整数量" @change="purNumChange" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="gtAmount" label="商城明细金额(元)：">
                <span>{{ formData.gtAmount }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item prop="otherInfo" label="商城商品信息：">
                <span>{{ formData.otherInfo }}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
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
import { getGtOrderDetail, updateGtOrderDetail } from '@/api/warehouse/acceptanceRecords'
import { useDict } from "@/utils/Dict"
const { proxy } = getCurrentInstance()

const visible = ref(false)

const purNumValidator = (rule, value, callback) =>{
  if(value == '0'){
    callback('商城调整数量必须大于0')
  }else if(!value){
    callback('请输入商城调整数量')
  }else{
    callback()
  }
}

const data = reactive({
  formData: {
    spdCode: '',
    matlCode: '',
    matlName: '',
    matlUnit: '',
    contPrice: '',
    purNum: '',
    gtAmount: '',
    otherInfo: ''
  },
  rules: {
    matlUnit: [{ required: true, message: '请选择计量单位', trigger: ['blur', 'change']}],
    purNum: [{ required: true, validator: purNumValidator, trigger: 'blur' }],
  },
  matlUnitList: [],
  rowPdbId: ''
})

const { formData, rules, matlUnitList, rowPdbId } = toRefs(data)

// 声明触发的事件（可选，增强类型校验）
const emit = defineEmits(['createSuccess']);

const { dictList } = useDict('measure_unit', {enableStatus: '1'})
matlUnitList.value = dictList

const getGtOrderDetailApi = (pddId) => {
  proxy.$modal.loading()
  getGtOrderDetail({pddId}).then( ({data}) => {
    formData.value = data
  }).finally( () => {
    proxy.$modal.closeLoading()
  })
}

// 显示弹框
function show(row = {}) {
  visible.value = true
  rowPdbId.value = row.pdbId
	proxy.$nextTick(() => {
    proxy.$refs.elForm && proxy.$refs.elForm.resetFields()
    getGtOrderDetailApi(row.pddId)
  })

}

const purNumChange = () => {
  const { purNum, gtAmount } = formData.value
  if(purNum && purNum != 0){
    formData.value.contPrice = (gtAmount/purNum).toFixed(2)
  }
}

const saveBtn = () => {
  proxy.$refs.elForm.validate(valid => {
    if (valid) {
      proxy.$modal.loading()
      updateGtOrderDetail({pdbId: rowPdbId.value, ...formData.value}).then( ({message}) => {
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
</style>