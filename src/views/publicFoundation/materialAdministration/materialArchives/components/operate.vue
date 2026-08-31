<template>
  <ep-dialog :title="title" v-model="visible" width="560px" top="10vh" append-to-body v-loading="loading">
    <el-form ref="elFormRef" :model="form" :rules="rules" label-width="110px">
      <el-form-item label="物资编码：" prop="matlCode">
        <el-input v-model="form.matlCode" :disabled="type === 'update'" placeholder="请输入物资编码" maxlength="30" />
      </el-form-item>
      <el-form-item label="物资名称：" prop="matlName">
        <el-input v-model="form.matlName" placeholder="请输入物资名称" maxlength="150" />
      </el-form-item>
      <el-form-item label="物资分类：" prop="supMatlCode">
        <el-tree-select
          v-model="form.supMatlCode"
          :data="treeOptions"
          :props="{ label: 'matlCateName', children: 'children' }"
          node-key="matlCateCode"
          check-strictly
          clearable
          placeholder="请选择物资分类"
          style="width: 100%"
        />
      </el-form-item>
      <el-form-item label="规格型号：" prop="matlType">
        <el-input v-model="form.matlType" placeholder="请输入规格型号" maxlength="100" />
      </el-form-item>
      <el-form-item label="计量单位：" prop="matlUnit">
        <el-input v-model="form.matlUnit" placeholder="请输入计量单位" maxlength="50" />
      </el-form-item>
      <el-form-item label="状态：" prop="enableState">
        <el-radio-group v-model="form.enableState">
          <el-radio :value="'1'">启用</el-radio>
          <el-radio :value="'0'">停用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="备注：">
        <el-input v-model="form.comments" type="textarea" :rows="2" placeholder="请输入备注" />
      </el-form-item>
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
import { rmstatCatalogCreate, rmstatCatalogModify, rmstatCatalogDetail } from '@/api/warehouse/rmstatCatalog'

const { proxy } = getCurrentInstance()

const props = defineProps({
  treeOptions: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['createSuccess'])

const visible = ref(false)
const loading = ref(false)
const title = ref('新增物资')
const type = ref('create')

const data = reactive({
  form: {
    matlCode: '',
    matlName: '',
    supMatlCode: undefined,
    matlType: '',
    matlUnit: '',
    enableState: '1',
    comments: ''
  },
  rules: {
    matlCode: [{ required: true, message: '请输入物资编码', trigger: 'blur' }],
    matlName: [{ required: true, message: '请输入物资名称', trigger: 'blur' }],
    matlUnit: [{ required: true, message: '请输入计量单位', trigger: 'blur' }]
  }
})

const { form, rules } = toRefs(data)

/** 打开弹窗 */
function init(dialogType, rowId, defaultClassifyCode) {
  type.value = dialogType
  visible.value = true
  form.value = {
    matlCode: '',
    matlName: '',
    supMatlCode: undefined,
    matlType: '',
    matlUnit: '',
    enableState: '1',
    comments: ''
  }
  if (dialogType === 'update') {
    title.value = '修改物资'
    rmstatCatalogDetail(rowId).then(({ data }) => {
      form.value = {
        matlCode: data.matlCode || '',
        matlName: data.matlName || '',
        supMatlCode: data.supMatlCode || undefined,
        matlType: data.matlType || '',
        matlUnit: data.matlUnit || '',
        enableState: data.enableState != null ? String(data.enableState) : '1',
        comments: data.comments || ''
      }
    })
  } else {
    title.value = '新增物资'
    if (defaultClassifyCode) {
      form.value.supMatlCode = defaultClassifyCode
    }
  }
}

/** 提交 */
function submit() {
  proxy.$refs.elFormRef.validate(valid => {
    if (!valid) return
    loading.value = true
    const payload = { ...form.value }
    const api = type.value === 'update' ? rmstatCatalogModify : rmstatCatalogCreate
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
