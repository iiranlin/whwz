<!-- 自采供货单 新增/修改 页面（由弹窗改为独立页面，路由 query 传 type=create|modify、pdmId） -->
<template>
  <div class="app-container">
    <div v-loading="loading" class="sso-front-table-container">
      <el-form ref="formRef" :model="formData" :rules="rules" label-width="110px">
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="采购订单号：" prop="spdCode">
              <el-input v-model="formData.spdCode" placeholder="自动生成采购订单号" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="供应商：" prop="suCode">
              <el-select v-model="formData.suCode" placeholder="请选择供应商" clearable filterable remote
                :remote-method="remoteMethod" :loading="remoteLoading" style="width: 100%">
                <el-option v-for="item in supplierOptions" :key="item.suCode" :label="item.suName" :value="item.suCode" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="采购方式：" prop="purcTypeCode">
              <el-select v-model="formData.purcTypeCode" placeholder="请选择采购方式" clearable style="width: 100%">
                <el-option v-for="item in purcTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="用料地区：" prop="plantCode">
              <el-select v-model="formData.plantCode" placeholder="请选择用料地区" clearable filterable style="width: 100%">
                <el-option v-for="item in plantOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="8">
            <el-form-item label="计划周期" prop="rptAccptdtCode">
              <el-select v-model="formData.rptAccptdtCode" placeholder="请选择计划周期" clearable style="width: 100%">
                <el-option v-for="item in planCycleOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col> -->
          <el-col :span="8">
            <el-form-item label="是否含税：" prop="taxFlag">
              <el-radio-group v-model="formData.taxFlag">
                <el-radio v-for="item in taxFlagOptions" :key="item.value" :value="item.value">{{ item.label }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="税率：" prop="taxRate">
              <el-select v-model="formData.taxRate" placeholder="请选择税率" clearable style="width: 100%">
                <el-option v-for="item in taxRateOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="备注：" prop="comments">
              <el-input v-model="formData.comments" type="textarea" :rows="1" maxlength="100" placeholder="请输入备注" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-divider style="margin: 4px 0 10px;" />
      <!-- 明细工具栏 -->
      <div class="detail-toolbar">
        <el-button type="primary" @click="handleSave">保存</el-button>
        <el-button @click="goBack">返回</el-button>
        <span class="flex1"></span>
        <el-button type="primary" @click="addDetail">添加明细</el-button>
        <el-button  @click="downloadTemplate">模板下载</el-button>
        <el-upload :action="uploadUrl" :headers="uploadHeaders" :show-file-list="false" :before-upload="beforeUpload"
          :on-success="handleUploadSuccess" style="display: inline-block">
          <el-button >模板导入</el-button>
        </el-upload>
      </div>
      <!-- 明细表格 -->
      <div class="detail-table">
        <el-table :data="formData.details" border fit stripe height="100%" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column type="index" label="序号" width="55" align="center" />
          <template v-for="col in detailConfig" :key="col.field">
            <el-table-column :label="col.title" :min-width="col.minWidth" :align="col.align"
              header-align="center" show-overflow-tooltip>
              <template #default="scope">
                <span v-if="col.type === 'smatlType'">{{ scope.row.smatlType + (scope.row.smatlRaw ? '/' + scope.row.smatlRaw : '') + (scope.row.smatlPcode ? '/' + scope.row.smatlPcode : '') }}</span>
                <el-input v-else-if="col.type === 'input'" v-model="scope.row[col.field]" maxlength="100"
                  placeholder="请输入" clearable />
                <el-input-number v-else-if="col.type === 'inputNumber'"
                  v-model="scope.row[col.field]" :min="0" :max="9999999999"
                  :precision="col.field === 'purNum' ? 4 : 2" controls-position="right" style="width: 100%" />
                <span v-else-if="col.type === 'purAmount'">{{ formatAmount(scope.row) }}</span>
                <span v-else>{{ scope.row[col.field] }}</span>
              </template>
            </el-table-column>
          </template>
          <el-table-column label="操作" fixed="right" align="center" width="80">
            <template #default="scope">
              <el-button type="primary" link @click="deleteDetail(scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <select-matl ref="selectMatlRef" @saveSelect="saveSelectMatl" />
  </div>
</template>

<script setup name="self-supply-order-maintain-edit">
import { useRoute } from 'vue-router'
import { detailConfig } from './components/table-config'
import { purcTypeOptions as fetchPurcTypeOptions, taxFlagOptions, planCycleOptions } from './tableJson'
import { uploadHaders } from '@/utils/auth'
import { supplierList } from '@/api/base/supplier'
import { plantDictListAll } from '@/api/warehouse/plantDict'
import {
  createPurchaseOrderMt,
  modifyPurchaseOrderMt,
  getOrderMtDetail,
  downloadOrderTemplate,
  uploadOrderDetail,
} from '@/api/warehouse/selfSupplyOrder'
import SelectMatl from './components/selectMatl.vue'
const { proxy } = getCurrentInstance()
const route = useRoute()

// 列表页路径：返回/保存成功后关闭当前页签并跳回（本项目 tagsView.delView 无 lastPath，closePage 会跳工作台，故用 closeOpenPage）
const LIST_PATH = '/material-accept/self-supply-order/maintain/index'

const loading = ref(false)
const remoteLoading = ref(false)
const dialogType = ref('create')
const formRef = ref(null)
const selectionData = ref([])

const uploadUrl = uploadOrderDetail
const uploadHeaders = uploadHaders()

// TODO: 税率字典待与后端确认字典编码，此处静态占位，可改为 getListByParentCode('tax_rate')
const taxRateOptions = [
  { label: '0%', value: '0' },
  { label: '3%', value: '3' },
  { label: '6%', value: '6' },
  { label: '9%', value: '9' },
  { label: '13%', value: '13' },
]

const emptyForm = () => ({
  pdmId: null,
  plantCode: '',
  plantName: '',
  purcTypeCode: '',
  purcTypeName: '',
  spdCode: '',
  suCode: '',
  suName: '',
  rptAccptdtName: '',
  rptAccptdtCode: '',
  taxFlag: '0',
  taxRate: '',
  comments: '',
  details: [],
})
const formData = ref(emptyForm())

const rules = {
  // suCode: [{ required: true, message: '请选择供应商！', trigger: 'change' }],
  // purcTypeCode: [{ required: true, message: '请选择采购方式', trigger: 'change' }],
  // plantCode: [{ required: true, message: '请选择用料地区', trigger: 'change' }],
  // taxRate: [{ required: true, message: '请选择税率', trigger: 'change' }],
  // rptAccptdtCode: [{ required: true, message: '请选择计划周期', trigger: 'change' }],
}

const supplierOptions = ref([])
const plantOptions = ref([])
const purcTypeOptions = ref([])

/** 按路由 query 初始化页面：type=create 新增；type=modify&pdmId=xxx 修改回显 */
function initPage() {
  dialogType.value = route.query.type === 'modify' ? 'modify' : 'create'
  formData.value = emptyForm()
  if (dialogType.value === 'modify' && route.query.pdmId) {
    getDetail(route.query.pdmId)
  } else {
    proxy.$nextTick(() => formRef.value && formRef.value.clearValidate())
  }
}

/** 查询列表（修改回显） */
function getDetail(pdmId) {
  loading.value = true
  getOrderMtDetail(pdmId).then(({ data }) => {
    formData.value = { ...data, details: data.details || [] }
    // 根据供应商编码回填供应商名称（远程下拉）
    if (data.suName) remoteMethod(data.suName, true)
  }).finally(() => {
    loading.value = false
  })
}

/** 供应商远程搜索 */
function remoteMethod(query, force = false) {
  if (!query && !force) return
  remoteLoading.value = true
  supplierList({ suName: query, pageNum: 1, pageSize: 50 }).then(({ data }) => {
    supplierOptions.value = (data && data.list) || []
  }).finally(() => {
    remoteLoading.value = false
  })
}

/** 获取下拉数据 */
function getFormSelectList() {
  plantDictListAll().then(({ data }) => {
    plantOptions.value = (data || []).map(item => ({ label: item.plantName, value: item.plantCode }))
  })
  // 采购方式字典（异步获取）
  fetchPurcTypeOptions().then(list => {
    purcTypeOptions.value = list || []
  })
  // 供应商下拉预加载前 50 条，便于直接点选；输入关键词时仍走远程搜索
  remoteMethod('', true)
}

function handleSelectionChange(rows) {
  selectionData.value = rows
}

/** 选择物资 */
function addDetail() {
  proxy.$refs.selectMatlRef.show(formData.value.details)
}

/** 物资回填 */
function saveSelectMatl(list) {
  list.forEach(item => {
    item.smatlCode = item.matlCode
    item.smatlName = item.matlName
    item.smatlPcode = item.matlPcode
    item.smatlRaw = item.matlRaw
    item.smatlType = item.matlType
    item.smatlUnit = item.matlUnit
    item.purAmount = item.purNum && item.contPrice ? (parseFloat(item.purNum) * parseFloat(item.contPrice)).toFixed(2) : 0
  })
  formData.value.details = formData.value.details.concat(list)
}

function deleteDetail(index) {
  formData.value.details.splice(index, 1)
}

/** 模板下载 */
function downloadTemplate() {
  proxy.$download.name(downloadOrderTemplate, {})
}

function beforeUpload() {
  return true
}

/** 模板导入 */
function handleUploadSuccess(res) {
  if (res.code === 0) {
    const list = res?.data || []
    const existCodeList = formData.value.details.map(item => item.smatlCode)
    const duplicateCodeList = list.map(item => item.smatlCode).filter(code => existCodeList.includes(code))
    if (duplicateCodeList.length) {
      proxy.$modal.msgWarning('以下编码重复: ' + duplicateCodeList)
      return
    }
    formData.value.details = formData.value.details.concat(list)
    proxy.$modal.msgSuccess(res.message)
  } else {
    proxy.$modal.msgError(res.message)
  }
}

function formatAmount(row) {
  if (row.purNum && row.contPrice) {
    return (parseFloat(row.purNum) * parseFloat(row.contPrice)).toFixed(2)
  }
  return 0
}

/** 保存：成功后关闭当前页签返回列表（列表 onActivated 自动刷新） */
function handleSave() {
  formRef.value.validate(valid => {
    if (!valid) return
    if (formData.value.details.length === 0) {
      proxy.$modal.msgWarning('明细不能为空')
      return
    }
    const detailNum = formData.value.details.some(item => !item.purNum || !item.contPrice)
    if (detailNum) {
      proxy.$modal.msgWarning('数量或者金额不能为空')
      return
    }
    // 名称回填
    const su = supplierOptions.value.find(item => item.suCode === formData.value.suCode)
    if (su) formData.value.suName = su.suName
    formData.value.plantName = plantOptions.value.find(item => item.value === formData.value.plantCode)?.label || ''
    formData.value.purcTypeName = purcTypeOptions.value.find(item => item.value === formData.value.purcTypeCode)?.label || ''
    formData.value.rptAccptdtName = planCycleOptions.find(item => item.value === formData.value.rptAccptdtCode)?.label || ''
    formData.value.details.forEach(item => {
      item.purAmount = formatAmount(item)
    })
    loading.value = true
    const api = dialogType.value === 'modify' ? modifyPurchaseOrderMt : createPurchaseOrderMt
    api(formData.value).then(({ message }) => {
      proxy.$modal.msgSuccess(message)
      proxy.$tab.closeOpenPage({ path: LIST_PATH })
    }).finally(() => {
      loading.value = false
    })
  })
}

/** 返回：关闭当前页签回到列表 */
function goBack() {
  proxy.$tab.closeOpenPage({ path: LIST_PATH })
}

// 页签未关闭时从列表再次进入（query 变化、组件复用），重新初始化表单
watch(() => route.query, () => {
  initPage()
})

onMounted(() => {
  getFormSelectList()
  initPage()
})
</script>
<style lang="scss" scoped>
.flex1 {
  flex: 1;
}
.detail-toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 0 10px;
}
.detail-table {
  height: calc(100vh - 350px);
}
</style>
