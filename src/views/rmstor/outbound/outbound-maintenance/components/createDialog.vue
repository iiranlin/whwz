<template>
  <ep-dialog class="ep-dialog-list" :title="title" iconTitle="form" v-model="visible" width="85vw" top="5vh"
    append-to-body>
    <div class="sso-front-table-container app-container">
      <div class="font_s">出库单信息</div>
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
              <el-form-item prop="pleaseDeptCode" label="请领部门：">
                <el-tree-select
                  v-if="isFormShow"
                  v-model="formData.pleaseDeptCode"
                  :data="deptOptions"
                  :props="{ label: 'deptName', children: 'children' }"
                  node-key="deptCode"
                  check-strictly
                  clearable
                  placeholder="选择请领部门"
                  style="width: 100%"
                />
                <span v-else>{{ formData.pleaseDeptName }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="plantCode" label="用料地区：">
                <el-select v-if="isFormShow" v-model="formData.plantCode" clearable placeholder="请选择">
                  <el-option v-for="item in plantOptions" :key="item.value" :value="item.value" :label="item.label"></el-option>
                </el-select>
                <span v-else>{{ formData.plantName }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="depotCode" label="仓库：">
                <el-select v-if="isFormShow" v-model="formData.depotCode" clearable placeholder="请选择">
                  <el-option v-for="item in whOptions" :key="item.value" :value="item.value" :label="item.label"></el-option>
                </el-select>
                <span v-else>{{ formData.depotName }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="partitionCode" label="仓库分区：">
                <el-select v-if="isFormShow" v-model="formData.partitionCode" clearable placeholder="请选择" @change="whPartitionChange">
                  <el-option v-for="item in partitionOptions" :key="item.value" :value="item.value" :label="item.label"></el-option>
                </el-select>
                <span v-else>{{ formData.partitionName }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="taxFlagName" label="应税用途：">
                <el-input v-if="isFormShow" v-model="formData.taxFlagName" placeholder="请输入" disabled />
                <span v-else>{{ formData.taxFlagName }}</span>
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
              <el-form-item prop="receiveName" label="收料人：">
                <el-input v-if="isFormShow" v-model="formData.receiveName" placeholder="请输入">
                  <template #append>
                    <el-button class="ep-input-button-icon" icon="Search" @click="approverClick"></el-button>
                  </template>
                </el-input>
                <span v-else>{{ formData.receiveName }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="comments" label="备注：">
                <el-input v-if="isFormShow" v-model.trim="formData.comments" placeholder="请输入" :disabled="false" />
                <span v-else>{{ formData.comments }}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
      <div class="font_s" style="margin-bottom: 17px;">出库单明细信息</div>
      <!-- 表格数据 -->
      <div class="detail-toolbar">
        <el-button type="primary" :disabled="!formData.plantCode || !formData.depotCode || !formData.partitionCode" @click="addDetail">添加明细</el-button>
      </div>
      <table-index class="table-index" :selectionShow="dialogType === 'report' ? true : false"
        :tableJson="dialogType === 'report' ? rmstorRedReversalTableJson : matlTableJson" :tableData="tableData"
        :idName="idName" @handleButtonClick="handleButtonClick" @handleSelectionChange="handleSelectionChange">
        <template #redNum="{ scope }">
          <span>{{ - scope.row.outNum }}</span>
        </template>
        <template #redAmount="{ scope }">
          <span>{{ - scope.row.outAmount }}</span>
        </template>
        <template #credCode="{ scope }">
          <el-input v-if="dialogType != 'details'" v-model="scope.row.credCode" placeholder="请输入" clearable />
          <span v-else>{{ scope.row.credCode }}</span>
        </template>
        <template #outNum="{ scope }">
          <el-input-number v-if="dialogType != 'details'" v-model="scope.row.outNum" :min="0" :max="9999999999" :precision="4" controls-position="right" style="width: 100%" />
          <span v-else>{{ scope.row.outNum }}</span>
        </template>
        <template #outAmount="{ scope }">
          <span>{{ calcOutAmount(scope.row) }}</span>
        </template>
        <template #cardPrice="{ scope }">
          <span>{{ scope.row.cardPrice != null ? Number(scope.row.cardPrice).toFixed(2) : '' }}</span>
        </template>
      </table-index>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="visible = false" class="cancel-btn"><svg-icon icon-class="cancel" />&nbsp;关闭</el-button>
        <el-button v-if="dialogType === 'create' || dialogType === 'modify'" type="primary" class="determine-btn"
          @click="saveBtn"><svg-icon icon-class="determine" />&nbsp;保存</el-button>
        <el-button v-if="dialogType === 'report'" type="primary" class="determine-btn" @click="redStamp"><svg-icon
            icon-class="determine" />&nbsp;红冲</el-button>
      </div>
    </template>
    <user-dialog ref="userDialog" @selectChange="userSelectChange" />
    <requisitionForm v-model="pubmedVisible" @selectData="selectData"></requisitionForm>
    <select-matl ref="selectMatlRef" @saveSelect="saveSelectMatl" />
  </ep-dialog>
</template>

<script setup>
import {
  rmstorInternalListdetail,
  rmstorInternalcreate, rmstorInternalmodify,generateCode,
  rmstorwriteBack, equipPartListAll, equipPartList,
  plantDictList, warehouseDict, warehouseplantDictList, getEquipOutTotalAmount
} from '@/api/rmstor/outbound-maintenance'
import { matlTableJson, rmstorRedReversalTableJson } from "../tableJson"
import { getCookie } from '@/utils/auth'
import { deptTree } from '@/api/base/dept'
const warehouseGetYear = getCookie('warehouseGetYear') && JSON.parse(getCookie('warehouseGetYear'))
import UserDialog from "@/views/components/userDialog"
import requisitionForm from './requisitionForm.vue'
import SelectMatl from './selectMatl.vue'
const { proxy } = getCurrentInstance()
import { Search } from '@element-plus/icons-vue'

const idName = ref('obdtId')
const ids = ref([])
const selectionData = ref([])
const single = ref(true)
const multiple = ref(true)
// 单台单台设备年度下的定额
const quota = ref(0)
// 本年度出库单金额
const currentYearAmount = ref(0)
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
    idsCode: [{ required: true, message: '请选择单台设备', trigger: ['blur', 'change'] }],
    receiveName: [{ required: true, message: '请选择收料人', trigger: ['blur', 'change'] }],
  },
})
const { rules, } = toRefs(data)
const emit = defineEmits(['createSuccess']);
//详情
const getRmstorInternalGetMatls = (id) => {
  proxy.$modal.loading()
  rmstorInternalListdetail(id).then(async ({ data }) => {
    formData.value = data
    tableData.value = data.rmstorOutBoundDtDTOList || []
    // 编辑模式：先加载仓库选项，再触发 watcher 自动级联
    if (dialogType.value === 'modify') {
      if (data.plantCode) {
        await getWhOptions()
      }
      if (data.depotCode) {
        await getPartitionOptions()
      }
    }
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
  isInitializing.value = true
  proxy.$nextTick(async () => {
    proxy.$refs.elForm && proxy.$refs.elForm.resetFields()
    if (type === 'create') {
      title.value = '新增出库单信息'
      isFormShow.value = true
      trackNumber()
      warehouseList()
      getPlantOptions()
      getDeptTree()
      isInitializing.value = false
    } else if (type === 'modify') {
      title.value = '修改出库单信息'
      isFormShow.value = true
      getPlantOptions()
      getDeptTree()
      await getRmstorInternalGetMatls(row.obmtId)
      getYearAmount(row.idsCode)
      warehouseList()
      isInitializing.value = false
    } else if (type === 'report') {
      title.value = '红冲出库单详情'
      isFormShow.value = false
      await getRmstorInternalGetMatls(row.obmtId)
      isInitializing.value = false
    } else if (type === 'details') {
      title.value = '出库单详情'
      isFormShow.value = false
      await getRmstorInternalGetMatls(row.obmtId)
      isInitializing.value = false
    }
  })
}
/** 动态计算出库金额 outAmount = outNum * cardPrice */
const calcOutAmount = (row, returnRaw = false) => {
  const num = Number(row.outNum) || 0
  const price = Number(row.cardPrice) || 0
  const result = Number((num * price).toFixed(2))
  return returnRaw ? result : (result ? result.toFixed(2) : '')
}

const handleButtonClick = (code, data) => {
  const eventObj = {
    // 选择物资
    choiceMatl: () => {
      let preWhHint = ''
      if (!formData.value.plantCode) {
        preWhHint = '请选择地区！'
      } else if (!formData.value.depotCode) {
        preWhHint = '请选择仓库！'
      } else if (!formData.value.approver) {
        preWhHint = '请选择审批人！'
      }
      if (preWhHint) {
        proxy.$modal.msgWarning(preWhHint)
        return
      }
      proxy.$refs.rmstorMatlDialog.show({ plantCode: formData.value.plantCode, depotCode: formData.value.depotCode }, tableData.value)
    },
  }
  eventObj[code] && eventObj[code]()
}
// 添加明细的按钮操作
function addDetail() {
  const maltParams = {
    plantCode: formData.value.plantCode || '',
    depotCode: formData.value.depotCode || '',
    partitionCode: formData.value.partitionCode || '',
  }
  proxy.$refs.selectMatlRef.show(tableData.value, maltParams)
}

/** 物资回填 */
function saveSelectMatl(list) {
  tableData.value = tableData.value.concat(list)
}

const saveBtn = () => {
  proxy.$refs.elForm.validate(valid => {
    if (valid) {
      if (!tableData.value.length) {
        proxy.$modal.msgWarning(`请先输入调拨单明细内容！`)
        return
      }
      let isTsNum = false
      for (let i = 0; i < tableData.value.length; i++) {
        if (!tableData.value[i].outNum || tableData.value[i].outNum == '0') {
          isTsNum = true
          proxy.$modal.msgWarning(`请先输入第${i + 1}行明细的"出库数量"！`)
          break
        }
      }
      if (isTsNum) {
        return
      }
      // 同步每行的 outAmount = outNum * cardPrice，确保提交给后端的值正确
      tableData.value.forEach(row => {
        row.outAmount = calcOutAmount(row, true)
      })
      // 判断该单台设备年度下的定额与本年度的出库单金额进行比对，不强制卡控。
      if (currentYearAmount.value > quota.value) {
        proxy.$modal.confirm(`${formData.value.idsName}设备出库金额已超出本年度定额，是否继续？`).then(() => {
          //校验
          proxy.$modal.loading()
          if (dialogType.value === 'create') {
            handleAdd()
          } else {
            handleEdit()
          }
        })
      } else {
        //校验
        proxy.$modal.loading()
        if (dialogType.value === 'create') {
          handleAdd()
        } else {
          handleEdit()
        }
      }
    }
  })
}
const handleAdd = () => {
  let params = {
    ...formData.value,
    recvMatlApplyListDTOList: tableData.value,
    rmstorOutBoundDtDTOList: tableData.value,
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
    outBoundDtModifyParamList: tableData.value,
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
  ids.value = selection.map(item => item[idName.value])
  single.value = selection.length != 1
  multiple.value = !selection.length
}
// 设备部件
const getYearAmount = async (val) => {
  let params = {
    equipCode:val === undefined ? 'xx' : val,
    yearCode: new Date().getFullYear(),
  }
  let res = await getEquipOutTotalAmount(params)
  if(res?.data){
    currentYearAmount.value = res.data.totalAmount || 0
  }
}
const warehouseLists = ref([])
// 单台设备
const warehouseList = async () => {
  const { data } = await equipPartListAll()
  warehouseLists.value = data
  // 如果是编辑页面，则初始化进来的时候就获取设备定额
  if (dialogType.value === 'modify') {
    quota.value = warehouseLists.value.find(a => a.equipCode === val)?.quota || 0
  }
}

const plantOptions = ref([])
const whOptions = ref([])
const partitionOptions = ref([])
const deptOptions = ref([])
// 初始化标记，show()中程序设置值时跳过tableData清空
const isInitializing = ref(false)
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
const selectData = (row) => {
  formData.value = row
  tableData.value = row.rmstorOutBoundDtDTOList
}
const handleidsChange = (val) => {
  formData.value.idsCode = val
  formData.value.idsName = warehouseLists.value.find(a => a.equipCode === val)?.equipName
  formData.value.iddCode = ''
  quota.value = warehouseLists.value.find(a => a.equipCode === val)?.quota || 0
  getYearAmount(val)
}
//单号
const trackNumber = async() =>{
  const { data } = await generateCode({
    name:'出库单',
    receiptDate:warehouseGetYear?.yearMonth,
  })
  formData.value.obCode = data
}

// 用料地区选项
const getPlantOptions = async () => {
  try {
    const { data } = await plantDictList()
    plantOptions.value = data ? data.length ? data.map(item => ({...item, label: item.plantName, value: item.plantCode})) : [] : []
  } catch (error) {
  }
}

// 仓库选项
const getWhOptions = async () => {
  try {
    const plantItem = plantOptions.value.find(i => i.value === formData.value.plantCode)
    const { data } = await warehouseDict({ plantId: plantItem?.id })
    whOptions.value = data ? data.length ? data.map(item => ({...item, label: item.whName, value: item.whCode})) : [] : []
  } catch (error) {
  }
}

// 仓库分区选项
const getPartitionOptions = async () => {
  try {
    const whItem = whOptions.value.find(i => i.value === formData.value.depotCode)
    const { data } = await warehouseplantDictList({ whId: whItem?.id })
    partitionOptions.value = data ? data.length ? data.map(item => ({...item, label: item.partitionName, value: item.partitionCode})) : [] : []
  } catch (error) {
  }
}

// 部门树
function getDeptTree() {
  return deptTree().then(({ data }) => {
    let treeData = []
    if (data && data[0] && data[0].deptCode === '10000001') {
      treeData = data[0].children || []
    } else {
      treeData = data || []
    }
    deptOptions.value = treeData
    // 如果已有 pleaseDeptCode（编辑回填场景），重新匹配 name
    if (formData.value.pleaseDeptCode) {
      const node = findDeptNode(treeData, formData.value.pleaseDeptCode)
      formData.value.pleaseDeptName = node?.deptName || ''
    }
  })
}

// 递归在部门树里按 deptCode 找节点
function findDeptNode(nodes, code) {
  for (const node of nodes) {
    if (node.deptCode === code) return node
    if (node.children?.length) {
      const found = findDeptNode(node.children, code)
      if (found) return found
    }
  }
  return null
}

// watch 请领部门 code → 自动回填 name
watch(() => formData.value?.pleaseDeptCode, (nval) => {
  if (!nval) {
    formData.value.pleaseDeptName = ''
    return
  }
  const node = findDeptNode(deptOptions.value, nval)
  formData.value.pleaseDeptName = node?.deptName || ''
})

// 仓库分区change事件
const whPartitionChange = (val) => {
  const partitionItem = partitionOptions.value.find(i => i.value === val)
  if (partitionItem) {
    formData.value.partitionName = partitionItem.partitionName
    formData.value.taxFlagCode = partitionItem.taxFlagCode || ''
    formData.value.taxFlagName = partitionItem.taxFlagName || ''
  } else {
    formData.value.partitionName = ''
    formData.value.taxFlagCode = ''
    formData.value.taxFlagName = ''
  }
}

// 级联watch：用料地区变化 -> 清空仓库和分区，重新加载仓库选项
watch(() => formData.value?.plantCode, (nval) => {
  if (!isInitializing.value) {
    tableData.value = []
  }
  const plantItem = plantOptions.value.find(i => i.value === nval)
  formData.value.plantName = plantItem?.plantName || ''
  whOptions.value = []
  partitionOptions.value = []
  formData.value.depotCode = ''
  formData.value.depotName = ''
  formData.value.partitionCode = ''
  formData.value.partitionName = ''
  formData.value.taxFlagCode = ''
  formData.value.taxFlagName = ''
  if (!!nval) {
    getWhOptions()
  }
})

// watch：分区变化 -> 清空明细列表。depotCode watcher 会把 partitionCode 置空并已清空 tableData，
// 这里用 skipClearTable 标记跳过联动触发的二次清空，只处理用户主动切分区的场景
const skipClearTable = ref(false)

// 级联watch：仓库变化 -> 清空分区，重新加载分区选项
watch(() => formData.value?.depotCode, (nval) => {
  if (!isInitializing.value) {
    tableData.value = []
    skipClearTable.value = true
  }
  const whItem = whOptions.value.find(i => i.value === nval)
  formData.value.depotName = whItem?.whName || ''
  partitionOptions.value = []
  formData.value.partitionCode = ''
  formData.value.partitionName = ''
  formData.value.taxFlagCode = ''
  formData.value.taxFlagName = ''
  skipClearTable.value = false
  if (!!nval) {
    getPartitionOptions()
  }
})

// watch：分区变化 -> 清空明细列表
watch(() => formData.value?.partitionCode, (nval, oval) => {
  if (isInitializing.value) return
  if (nval === oval) return
  if (skipClearTable.value) return
  tableData.value = []
})

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
.detail-toolbar {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 8px;
  padding: 10px 0 10px;
  border-top: 1px solid #E4E7ED;
}
</style>