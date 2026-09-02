<template>
  <ep-dialog :title="title" v-model="visible" width="560px" top="10vh" append-to-body v-loading="loading">
    <el-form ref="elFormRef" :model="form" :rules="rules" label-width="90px">
      <el-form-item label="上级分类：" prop="supCateCode">
        <el-tree-select
          v-model="form.supCateCode"
          :data="treeOptions"
          :props="treeProps"
          node-key="matlCateCode"
          check-strictly
          clearable
          placeholder="请选择上级分类"
          style="width: 100%"
        />
      </el-form-item>
      <el-form-item label="分类编码：" prop="matlCateCode">
        <el-input v-model="form.matlCateCode" :disabled="type === 'update'" placeholder="请输入分类编码" maxlength="20" />
      </el-form-item>
      <el-form-item label="分类名称：" prop="matlCateName">
        <el-input v-model="form.matlCateName" placeholder="请输入分类名称" maxlength="150" />
      </el-form-item>
      <el-form-item label="状态：">
        <el-radio-group v-model="form.effectFlag">
          <el-radio :value="'0'">启用</el-radio>
          <el-radio :value="'1'">停用</el-radio>
        </el-radio-group>
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
import { rmstatMatlcateCreate, rmstatMatlcateModify, rmstatMatlcateDetail } from '@/api/warehouse/rmstatMatlcate'

const { proxy } = getCurrentInstance()

const props = defineProps({
  treeOptions: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['createSuccess'])

/** 分类树节点显示：编码 + 名称（与左侧树一致） */
const treeProps = {
  label: data => (data.matlCateCode ? `${data.matlCateCode} ${data.matlCateName}` : data.matlCateName),
  children: 'children'
}

const visible = ref(false)
const loading = ref(false)
const title = ref('新增物资分类')
const type = ref('create')

const data = reactive({
  form: {
    supCateCode: undefined,
    matlCateCode: '',
    matlCateName: '',
    effectFlag: '0'
  },
  rules: {
    matlCateCode: [{ required: true, message: '请输入分类编码', trigger: 'blur' }],
    matlCateName: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
  }
})

const { form, rules } = toRefs(data)
/** 表单初始值从 data.form 浅拷贝 */
const initialForm = { ...data.form }
/** 重置表单数据和校验 */
function resetForm() {
  Object.assign(form.value, initialForm)
  proxy.$nextTick(() => {
    proxy.$refs.elFormRef && proxy.$refs.elFormRef.resetFields()
  })
}

/** 监听弹窗关闭，自动清空表单 */
watch(visible, (val) => {
  if (!val) {
    resetForm()
  }
})
/** 打开弹窗 */
function init(dialogType, rowId, parentRow) {
  type.value = dialogType
  visible.value = true
  form.value = {
    supCateCode: undefined,
    matlCateCode: '',
    matlCateName: '',
    effectFlag: '0'
  }
  if (dialogType === 'update') {
    title.value = '修改物资分类'
    rmstatMatlcateDetail(rowId).then(({ data }) => {
      form.value = {
        supCateCode: data.supCateCode || undefined,
        matlCateCode: data.matlCateCode || '',
        matlCateName: data.matlCateName || '',
        effectFlag: data.effectFlag != null ? String(data.effectFlag) : '0'
      }
    })
  } else {
    title.value = '新增物资分类'
    if (parentRow) {
      // 新增下级：预填上级
      form.value.supCateCode = parentRow.matlCateCode
    }
  }
}

/** 提交 */
function submit() {
  proxy.$refs.elFormRef.validate(valid => {
    if (!valid) return
    loading.value = true
    const api = type.value === 'update' ? rmstatMatlcateModify : rmstatMatlcateCreate
    api({ ...form.value }).then(({ message }) => {
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
