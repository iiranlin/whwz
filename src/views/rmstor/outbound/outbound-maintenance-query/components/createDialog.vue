<template>
  <ep-dialog class="ep-dialog-list" :title="title" iconTitle="form" v-model="visible" width="85vw" top="5vh"
    append-to-body>
    <div class="sso-front-table-container app-container">
      <div class="font_s">出库单信息</div>
      <div style="height: 260px;">
        <el-form class="form-wrapper" :model="formData" :rules="rules" ref="elForm" label-width="110px">
          <div class="form-left flex1">
            <el-row>
              <el-col :span="6">
                <el-form-item prop="obCode" label="出库单号：">
                  <el-input v-if="isFormShow" v-model="formData.obCode" placeholder="自动生成" disabled />
                  <span v-else>{{ formData.obCode }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item prop="planCode" label="电子请领单：">
                  <el-input v-if="isFormShow" v-model.trim="formData.planCode" placeholder="请选择" readonly>
                    <template #append>
                      <el-button :icon="Search" style="height: 28px;" @click="handleRequisitionFrom"
                        :disabled="dialogType !== 'create'"></el-button>
                    </template>
                  </el-input>
                  <span v-else>{{ formData.planCode }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item prop="deptName" label="请领车间：">
                  <el-input v-if="isFormShow" v-model="formData.deptName" placeholder="请输入" disabled />
                  <span v-else>{{ formData.deptName }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item prop="teamName" label="请领班组：">
                  <el-input v-if="isFormShow" v-model="formData.teamName" placeholder="请输入" disabled />
                  <span v-else>{{ formData.teamName }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item prop="plantName" label="用料地区：">
                  <el-input v-if="isFormShow" v-model="formData.plantName" placeholder="请输入" disabled />
                  <span v-else>{{ `${formData.plantName}` }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item prop="depotName" label="仓库：">
                  <el-input v-if="isFormShow" v-model="formData.depotName" placeholder="请输入" disabled />
                  <span v-else>{{ `${formData.depotName}` }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item prop="partitionName" label="仓库分区：">
                  <el-input v-if="isFormShow" v-model="formData.partitionName" placeholder="请输入" disabled />
                  <span v-else>{{ `${formData.partitionName}` }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item prop="taxFlagName" label="应税用途：">
                  <el-input v-if="isFormShow" v-model="formData.taxFlagName" placeholder="请输入" disabled />
                  <span v-else>{{ formData.taxFlagName }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item prop="natureValueName" label="成本预算项目：">
                  <el-input v-if="isFormShow" v-model="formData.natureValueName" placeholder="请输入" disabled />
                  <span v-else>{{ formData.natureValueName }}</span>
                </el-form-item>
              </el-col>

              <el-col :span="6">
                <el-form-item prop="pickmatlName" label="请领人：">
                  <el-input v-if="isFormShow" v-model="formData.pickmatlName" placeholder="请选择" disabled>
                  </el-input>
                  <span v-else>{{ formData.pickmatlName }}</span>
                </el-form-item>
              </el-col>

              <el-col :span="6">
                <el-form-item prop="receiveName" label="收料人：">
                  <el-input v-if="isFormShow" v-model="formData.receiveName" placeholder="请输入">
                    <template #append>
                      <el-button class="ep-input-button-icon" icon="Search" @click="approverClick"></el-button>
                    </template>
                  </el-input>
                  <span v-else>{{ formData.receiveName }}</span>
                </el-form-item>
              </el-col>

              <el-col :span="6">
                <el-form-item prop="carType" label="车型：">
                  <el-input v-if="isFormShow" v-model="formData.carType" placeholder="请输入" />
                  <span v-else>{{ formData.carType }}</span>
                </el-form-item>
              </el-col>

              <el-col :span="6">
                <el-form-item prop="trainsetName" label="车组号：">
                  <el-input v-if="isFormShow" v-model="formData.trainsetName" placeholder="请输入" />
                  <span v-else>{{ formData.trainsetName }}</span>
                </el-form-item>
              </el-col>

              <el-col :span="6">
                <el-form-item prop="trainNo" label="车号：">
                  <el-input v-if="isFormShow" v-model="formData.trainNo" placeholder="请输入" />
                  <span v-else>{{ formData.trainNo }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item prop="idsCode" label="单台设备：">
                  <el-select v-if="isFormShow" v-model="formData.idsCode" placeholder="请选择" clearable :disabled="isShow"
                    @change="handleidsChange">
                    <el-option v-for="dict in warehouseLists" :key="dict.id" :label="dict.equipName"
                      :value="dict.equipCode" />
                  </el-select>
                  <span v-else>{{ formData.idsName }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item prop="iddCode" label="设备部件：">
                  <el-select v-if="isFormShow" v-model="formData.iddCode" placeholder="请选择" clearable :disabled="isShow"
                    @change="handleiddChange">
                    <el-option v-for="dict in plantLists" :key="dict.id" :label="dict.epPartName"
                      :value="dict.epPartCode" />
                  </el-select>
                  <span v-else>{{ formData.iddName }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item prop="transType" label="供应方式：">
                  <el-select v-if="isFormShow" v-model="formData.transType" placeholder="请选择" clearable
                    :disabled="isShow">
                    <el-option v-for="(dict, index) in transTypeLists" :key="index" :label="dict.label"
                      :value="dict.value" />
                  </el-select>
                  <span v-else>{{ formData.transType }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="18">
                <el-form-item prop="comments" label="备注：">
                  <el-input v-if="isFormShow" v-model.trim="formData.comments" placeholder="请输入" :disabled="false" />
                  <span v-else>{{ formData.comments }}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-form>
      </div>
      <div class="font_s">出库单明细信息</div>
      <div style="height:calc(100% - 280px)">
        <el-pro-table ref="proTableRef" :columns="dialogType === 'report' ? rmstorRedReversalTableJson : matlTableJson"
          :show-pagination="false"  :data="tableData"  click-row-to-toggle-selection
          :show-checkbox="dialogType === 'report' ? true : false" @selection-change="handleSelectionChange"
          :grid-options="{ rowId: 'obdtId' }" :show-action="false" :show-refresh="false" :show-setting="false">
          <template #redNum="{ row, column, index }">
            <span>{{ - row.outNum }}</span>
          </template>
          <template #redAmount="{ row, column, index }">
            <span>{{ - row.outAmount }}</span>
          </template>
          <template #credCode="{ row, column, index }">
            <el-input v-if="dialogType != 'details'" v-model="row.credCode" placeholder="请输入" clearable />
            <span v-else>{{ row.credCode }}</span>
          </template>
        </el-pro-table>
      </div>
    </div>
    <template #footer>
      <div class="dialog-footer">

        <el-button v-if="dialogType === 'create' || dialogType === 'modify'" type="primary" class="determine-btn"
          @click="saveBtn"><svg-icon icon-class="determine" />&nbsp;保存</el-button>
        <el-button v-if="dialogType === 'report'" type="primary" class="determine-btn" @click="redStamp"><svg-icon
            icon-class="determine" />&nbsp;红冲</el-button>
        <el-button @click="visible = false" class="cancel-btn"><svg-icon icon-class="cancel" />&nbsp;关闭</el-button>
      </div>
    </template>
    <user-dialog ref="userDialog" @selectChange="userSelectChange" />
    <requisitionForm v-model="pubmedVisible" @selectData="selectData" :obCode="formData.obCode"></requisitionForm>
  </ep-dialog>
</template>

<script setup>
import {
  rmstorInternalListdetail,
  rmstorInternalcreate, rmstorInternalmodify, generateCode,
  rmstorwriteBack, equipPartListAll, equipPartList
} from '@/api/rmstor/outbound-maintenance'
import { matlTableJson, rmstorRedReversalTableJson } from "../tableJson"
import { getCookie } from '@/utils/auth'
const warehouseGetYear = getCookie('warehouseGetYear') && JSON.parse(getCookie('warehouseGetYear'))
import UserDialog from "@/views/components/userDialogQuery"
import requisitionForm from './requisitionForm.vue'
const { proxy } = getCurrentInstance()
import { Search } from '@element-plus/icons-vue'

const idName = ref('obdtId')
const ids = ref([])
const selectionData = ref([])
const single = ref(true)
const multiple = ref(true)
const proTableRef = ref(null)
// 接收参数并指定类型（可选）
const props = defineProps({

})
const title = ref('')
const isShow = ref(false)
const visible = ref(false)
const dialogType = ref('create')
const tableData = ref([])
const formData = ref({})
const data = reactive({
  rules: {
    planCode: [{ required: true, message: '请选择电子请领单', trigger: ['blur', 'change'] }],
    receiveName: [{ required: true, message: '请选择收料人', trigger: ['blur', 'change'] }],
  },
})
const transTypeLists = [
  { label: '配送', value: '配送' },
  { label: '自提', value: '自提' },
  { label: '快件', value: '快件' },
  { label: '其它', value: '其它' },
]
const { rules, } = toRefs(data)
const emit = defineEmits(['createSuccess']);
//详情
const getRmstorInternalGetMatls = (id) => {
  proxy.$modal.loading()
  rmstorInternalListdetail(id).then(({ data }) => {
    formData.value = data
    tableData.value = data.rmstorOutBoundDtDTOList || []
  }).finally(() => {
    proxy.$modal.closeLoading()
  })
}
//表单显示
const isFormShow = ref(false)

// 显示弹框
function show(type = 'create', row = {}) {
  visible.value = true
  dialogType.value = type
  tableData.value = []
  isShow.value = false
  proxy.$nextTick(async () => {
    proxy.$refs.elForm && proxy.$refs.elForm.resetFields()
    if (type === 'create') {
      title.value = '新增出库单信息'
      isFormShow.value = true
      // plantList()
      trackNumber()
      warehouseList()
    } else if (type === 'modify') {
      title.value = '修改出库单信息'
      isFormShow.value = true
      getRmstorInternalGetMatls(row.obmtId)
      plantList(row.idsCode)
      warehouseList()
    } else if (type === 'report') {
      title.value = '红冲出库单详情'
      isFormShow.value = false
      getRmstorInternalGetMatls(row.obmtId)
    } else if (type === 'details') {
      title.value = '出库单详情'
      isFormShow.value = false
      getRmstorInternalGetMatls(row.obmtId)
    }
  })
}

const saveBtn = () => {
  proxy.$refs.elForm.validate(valid => {
    if (valid) {
      const newTableData = proTableRef.value?.getCurrentData()
      if (!newTableData.length) {
        proxy.$modal.msgWarning(`请先输入调拨单明细内容！`)
        return
      }
      // let isTsNum = false
      // for (let i = 0; i < newTableData.length; i++) {
      //   if (!newTableData[i].outNum || newTableData[i].outNum == '0') {
      //     isTsNum = true
      //     proxy.$modal.msgWarning(`请先输入第${i + 1}行明细的"出库数量"！`)
      //     break
      //   }
      // }
      // if (isTsNum) {
      //   return
      // }
      //校验
      proxy.$modal.loading()
      if (dialogType.value === 'create') {
        handleAdd()
      } else {
        handleEdit()
      }
    }
  })
}
const handleAdd = () => {
  let params = {
    ...formData.value,
    recvMatlApplyListDTOList: proTableRef.value?.getCurrentData(),
    yearMonth: warehouseGetYear?.yearMonth,
  }
  rmstorInternalcreate(params).then(({ message }) => {
    proxy.$modal.msgSuccess(message)
    visible.value = false
    emit('createSuccess')
  }).finally(() => {
    proxy.$modal.closeLoading()
  })
}
const handleEdit = () => {
  let params = {
    ...formData.value,
    outBoundDtModifyParamList: proTableRef.value?.getCurrentData(),
    yearMonth: warehouseGetYear?.yearMonth,
  }
  rmstorInternalmodify(params).then(({ message }) => {
    proxy.$modal.msgSuccess(message)
    visible.value = false
    emit('createSuccess')
  }).finally(() => {
    proxy.$modal.closeLoading()
  })
}
const redStamp = async () => {
  if (selectionData.value.length <= 0) {
    proxy.$modal.msgWarning('请选择物资明细')
    return
  }
  let params = {
    obdtIds: selectionData.value?.map(item => item.obdtId),
  }
  const { message } = await rmstorwriteBack(params)
  proxy.$modal.msgSuccess(message)
  visible.value = false
  emit('createSuccess')
}
/** 多选框选中数据 */
function handleSelectionChange(selection) {
  selectionData.value = selection
  // ids.value = selection.map(item => item[idName.value])
  // single.value = selection.length != 1
  // multiple.value = !selection.length
}
const plantLists = ref([])
// 设备部件
const plantList = async (val) => {
  const { data } = await equipPartList({ equipCode: val === undefined ? 'xx' : val })
  plantLists.value = data.list
}
const warehouseLists = ref([])
// 单台设备
const warehouseList = async () => {
  const { data } = await equipPartListAll()
  warehouseLists.value = data
}
const approverClick = () => {
  proxy.$refs.userDialog.show()
}
const userSelectChange = (data) => {
  formData.value.receiveName = data[0].userName
}
const pubmedVisible = ref(false)
const handleRequisitionFrom = () => {
  pubmedVisible.value = true
}
const selectData = (row, obCode) => {
  formData.value = row
  formData.value.obCode = obCode
   proxy.$refs.proTableRef.addEditableRow(row.rmstorOutBoundDtDTOList.map(a => { return {defaultValue: a} }))
  // tableData.value = row.rmstorOutBoundDtDTOList
}
const handleidsChange = (val) => {
  formData.value.idsCode = val
  formData.value.idsName = warehouseLists.value.find(a => a.equipCode === val)?.equipName
  formData.value.iddCode = ''
  plantList(val)
}
const handleiddChange = (val) => {
  formData.value.iddCode = val
  formData.value.iddName = plantLists.value.find(a => a.epPartCode === val)?.epPartName
}
//单号
const trackNumber = async () => {
  const { data } = await generateCode({
    name: '出库单',
    receiptDate: warehouseGetYear?.yearMonth,
  })
  formData.value.obCode = data
}

defineExpose({
  show,
})
</script>
<style lang="scss" scoped>
.ep-dialog-list {
  .sso-front-table-container {
    .form-wrapper {
      .form-left {

        .ep-select,
        :deep(.ep-input) {
          width: 90% !important;
        }
      }
    }
  }
}

.font_s {
  font-size: 16px;
  color: #333333;
  font-weight: 700;
  font-style: normal;
}
</style>