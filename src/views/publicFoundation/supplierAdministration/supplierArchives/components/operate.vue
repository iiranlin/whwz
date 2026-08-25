<template>
  <ep-dialog :title="title" v-model="visible" width="900px" top="8vh" append-to-body v-loading="loading">
    <el-form ref="elFormRef" :model="form" :rules="rules" label-width="130px">
      <el-divider content-position="left">基本信息</el-divider>
      <el-row>
        <el-col :span="12">
          <el-form-item label="供应商编号：" prop="suCode">
            <el-input v-model="form.suCode" :disabled="type === 'create'" placeholder="创建时自动生成" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="供应商名称：" prop="suName">
            <el-input v-model="form.suName" placeholder="请输入供应商名称" maxlength="150" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="供应商简称：" prop="suSimpleName">
            <el-input v-model="form.suSimpleName" placeholder="请输入供应商简称" maxlength="50" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="统一社会信用代码：" prop="suUnicode">
            <el-input v-model="form.suUnicode" placeholder="请输入统一社会信用代码" maxlength="50" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="法定代表人：" prop="owner">
            <el-input v-model="form.owner" placeholder="请输入法定代表人" maxlength="50" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="供应商类型：" prop="suType">
            <el-select v-model="form.suType" placeholder="请选择供应商类型" clearable style="width: 100%">
              <el-option v-for="item in suTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="营业执照编号：" prop="suBizCode">
            <el-input v-model="form.suBizCode" placeholder="请输入营业执照编号" maxlength="50" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="营业执照有效期：" prop="suBizCodeExpire">
            <el-date-picker v-model="form.suBizCodeExpire" type="date" value-format="YYYY-MM-DD"
              placeholder="请选择营业执照有效期" style="width: 100%" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="税务登记证编号：" prop="suTaxCode">
            <el-input v-model="form.suTaxCode" placeholder="请输入税务登记证编号" maxlength="50" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所属行业：" prop="suBizType">
            <el-select v-model="form.suBizType" placeholder="请选择所属行业" clearable filterable style="width: 100%">
              <el-option v-for="item in industryOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="信用等级：" prop="creditLevel">
            <el-select v-model="form.creditLevel" placeholder="请选择信用等级" clearable style="width: 100%">
              <el-option label="低" value="0" />
              <el-option label="中" value="1" />
              <el-option label="高" value="2" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="成立日期：" prop="suFoundingDate">
            <el-date-picker v-model="form.suFoundingDate" type="date" value-format="YYYY-MM-DD"
              placeholder="请选择成立日期" style="width: 100%" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="注册资金：" prop="suRegisterAccount">
            <el-input v-model="form.suRegisterAccount" placeholder="请输入注册资金" maxlength="50" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="注册地址：" prop="suRegisterAddress">
            <el-input v-model="form.suRegisterAddress" placeholder="请输入注册地址" maxlength="200" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="主营：" prop="suBizContent">
            <el-input v-model="form.suBizContent" type="textarea" :rows="2" placeholder="请输入主营内容" maxlength="500" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-divider content-position="left">联系信息</el-divider>
      <el-row>
        <el-col :span="12">
          <el-form-item label="联系人：" prop="contactName">
            <el-input v-model="form.contactName" placeholder="请输入联系人姓名" maxlength="50" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="手机号：" prop="contactPhone">
            <el-input v-model="form.contactPhone" placeholder="请输入手机号" maxlength="11" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="办公电话：" prop="contactPubMobile">
            <el-input v-model="form.contactPubMobile" placeholder="请输入办公电话" maxlength="20" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="电子邮箱：" prop="contactEmail">
            <el-input v-model="form.contactEmail" placeholder="请输入电子邮箱" maxlength="50" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-divider content-position="left">账户信息</el-divider>
      <el-row>
        <el-col :span="12">
          <el-form-item label="账户名称：" prop="accountName">
            <el-input v-model="form.accountName" placeholder="请输入账户名称" maxlength="100" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="银行账号：" prop="account">
            <el-input v-model="form.account" placeholder="请输入银行账号" maxlength="50" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="开户银行：" prop="accountBank">
            <el-input v-model="form.accountBank" placeholder="请输入开户银行" maxlength="100" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="授信额度：" prop="accountCredit">
            <el-input-number v-model="form.accountCredit" :min="0" :controls="false" placeholder="请输入授信额度"
              style="width: 100%" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-divider content-position="left">合作信息</el-divider>
      <el-row>
        <el-col :span="12">
          <el-form-item label="合作现状：" prop="bizNow">
            <el-input v-model="form.bizNow" placeholder="请输入合作现状" maxlength="200" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="合作前景：" prop="bizFuture">
            <el-input v-model="form.bizFuture" placeholder="请输入合作前景" maxlength="200" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="跟进策略：" prop="bizStrategy">
            <el-input v-model="form.bizStrategy" placeholder="请输入跟进策略" maxlength="200" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="纳税人识别号：" prop="taxCode">
            <el-input v-model="form.taxCode" placeholder="请输入纳税人识别号" maxlength="50" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注：" prop="notes">
            <el-input v-model="form.notes" type="textarea" :rows="2" placeholder="请输入备注" maxlength="500" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="submit">确 定</el-button>
        <el-button @click="visible = false">取 消</el-button>
      </div>
    </template>
  </ep-dialog>
</template>

<script setup>
import { supplierCreate, supplierModify, supplierDetail } from '@/api/base/supplier'
import { getListByParentCode } from '@/api/base/dict'

const { proxy } = getCurrentInstance()

const emit = defineEmits(['createSuccess'])

const visible = ref(false)
const loading = ref(false)
const title = ref('新增供应商')
const type = ref('create')
const id = ref('')
const suTypeOptions = ref([])
const industryOptions = ref([])

const data = reactive({
  form: {
    suId: null,
    suCode: '',
    suName: '',
    suSimpleName: '',
    suUnicode: '',
    owner: '',
    suType: '',
    suBizCode: '',
    suBizCodeExpire: '',
    suTaxCode: '',
    suBizType: '',
    creditLevel: '',
    suFoundingDate: '',
    suRegisterAccount: '',
    suRegisterAddress: '',
    suBizContent: '',
    contactName: '',
    contactPhone: '',
    contactPubMobile: '',
    contactEmail: '',
    accountName: '',
    account: '',
    accountBank: '',
    accountCredit: undefined,
    taxCode: '',
    bizNow: '',
    bizFuture: '',
    bizStrategy: '',
    notes: ''
  },
  rules: {
    suName: [{ required: true, message: '请输入供应商名称', trigger: 'blur' }],
    suSimpleName: [{ required: true, message: '请输入供应商简称', trigger: 'blur' }],
    suUnicode: [{ required: true, message: '请输入统一社会信用代码', trigger: 'blur' }],
    owner: [{ required: true, message: '请输入法定代表人', trigger: 'blur' }],
    suBizCode: [{ required: true, message: '请输入营业执照编号', trigger: 'blur' }],
    suBizCodeExpire: [{ required: true, message: '请选择营业执照有效期', trigger: 'change' }],
    suTaxCode: [{ required: true, message: '请输入税务登记证编号', trigger: 'blur' }],
    contactPhone: [{ pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }],
    contactEmail: [{ type: 'email', message: '邮箱格式不正确', trigger: 'blur' }]
  }
})

const { form, rules } = toRefs(data)

/** 日期回显（截取 yyyy-MM-dd） */
function pickDate(val) {
  if (!val) return ''
  if (typeof val === 'number') {
    const d = new Date(val)
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${d.getFullYear()}-${m}-${day}`
  }
  return String(val).substring(0, 10)
}

/** 加载字典（供应商类型 / 所属行业） */
function loadDict() {
  if (suTypeOptions.value.length && industryOptions.value.length) return
  getListByParentCode('supplierType').then(({ data }) => {
    suTypeOptions.value = (data || []).map(item => ({ label: item.label || item.name, value: item.value || item.code }))
  })
  getListByParentCode('INDUSTRY').then(({ data }) => {
    industryOptions.value = (data || []).map(item => ({ label: item.label || item.name, value: item.value || item.code }))
  })
}

/** 打开弹窗 */
function init(dialogType, rowId) {
  type.value = dialogType
  id.value = rowId || ''
  visible.value = true
  form.value = {
    suId: null,
    suCode: '',
    suName: '',
    suSimpleName: '',
    suUnicode: '',
    owner: '',
    suType: '',
    suBizCode: '',
    suBizCodeExpire: '',
    suTaxCode: '',
    suBizType: '',
    creditLevel: '',
    suFoundingDate: '',
    suRegisterAccount: '',
    suRegisterAddress: '',
    suBizContent: '',
    contactName: '',
    contactPhone: '',
    contactPubMobile: '',
    contactEmail: '',
    accountName: '',
    account: '',
    accountBank: '',
    accountCredit: undefined,
    taxCode: '',
    bizNow: '',
    bizFuture: '',
    bizStrategy: '',
    notes: ''
  }
  loadDict()
  if (dialogType === 'update') {
    title.value = '修改供应商'
    loading.value = true
    supplierDetail(rowId).then(({ data }) => {
      form.value = {
        suId: data.suId,
        suCode: data.suCode || '',
        suName: data.suName || '',
        suSimpleName: data.suSimpleName || '',
        suUnicode: data.suUnicode || '',
        owner: data.owner || '',
        suType: data.suType || '',
        suBizCode: data.suBizCode || '',
        suBizCodeExpire: pickDate(data.suBizCodeExpire),
        suTaxCode: data.suTaxCode || '',
        suBizType: data.suBizType || '',
        creditLevel: data.creditLevel || '',
        suFoundingDate: pickDate(data.suFoundingDate),
        suRegisterAccount: data.suRegisterAccount || '',
        suRegisterAddress: data.suRegisterAddress || '',
        suBizContent: data.suBizContent || '',
        contactName: data.contactName || '',
        contactPhone: data.contactPhone || '',
        contactPubMobile: data.contactPubMobile || '',
        contactEmail: data.contactEmail || '',
        accountName: data.accountName || '',
        account: data.account || '',
        accountBank: data.accountBank || '',
        accountCredit: data.accountCredit ?? undefined,
        taxCode: data.taxCode || '',
        bizNow: data.bizNow || '',
        bizFuture: data.bizFuture || '',
        bizStrategy: data.bizStrategy || '',
        notes: data.notes || ''
      }
    }).finally(() => {
      loading.value = false
    })
  } else {
    title.value = '新增供应商'
  }
}

/** 提交 */
function submit() {
  proxy.$refs.elFormRef.validate(valid => {
    if (!valid) return
    loading.value = true
    const payload = { ...form.value }
    if (!payload.accountCredit) delete payload.accountCredit
    const api = type.value === 'update' ? supplierModify : supplierCreate
    api(payload).then(({ message }) => {
      proxy.$modal.msgSuccess(message || '操作成功')
      visible.value = false
      emit('createSuccess')
    }).finally(() => {
      loading.value = false
    })
  })
}

defineExpose({ init })
</script>
