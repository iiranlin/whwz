<template>
  <ep-dialog :title="title" v-model="visible" width="560px" top="10vh" append-to-body v-loading="loading">
    <el-form ref="elFormRef" :model="form" :rules="rules" label-width="90px">
      <el-form-item label="上级分类：" prop="parentId">
        <el-tree-select
          v-model="form.parentId"
          :data="treeOptions"
          :props="{ label: 'matlClassifyName', children: 'children' }"
          node-key="matlClassifyId"
          check-strictly
          clearable
          placeholder="请选择上级分类"
          style="width: 100%"
        />
      </el-form-item>
      <el-form-item label="分类编码：" prop="matlClassifyCode">
        <el-input v-model="form.matlClassifyCode" placeholder="自动生成" disabled />
      </el-form-item>
      <el-form-item label="分类名称：" prop="matlClassifyName">
        <el-input v-model="form.matlClassifyName" placeholder="请输入分类名称" maxlength="150" />
      </el-form-item>
      <el-form-item label="排序：" prop="sort">
        <el-input-number v-model="form.sort" controls-position="right" :min="1" :max="99" />
      </el-form-item>
      <el-form-item label="状态：">
        <el-radio-group v-model="form.bizStatus">
          <el-radio :value="0">启用</el-radio>
          <el-radio :value="1">停用</el-radio>
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
import { classifyCreate, classifyModify, classifyDetail } from '@/api/base/materialClassify'

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
const title = ref('新增物料分类')
const type = ref('create')
const id = ref('')

const data = reactive({
  form: {
    matlClassifyId: null,
    matlClassifyCode: '',
    matlClassifyName: '',
    parentId: undefined,
    parentCode: undefined,
    parentName: '',
    sort: 1,
    bizStatus: 0,
    notes: ''
  },
  rules: {
    matlClassifyName: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
  }
})

const { form, rules } = toRefs(data)

/** 打开弹窗 */
function init(dialogType, rowId, parentRow) {
  type.value = dialogType
  id.value = rowId || ''
  visible.value = true
  form.value = {
    matlClassifyId: null,
    matlClassifyCode: '',
    matlClassifyName: '',
    parentId: undefined,
    parentCode: undefined,
    parentName: '',
    sort: 1,
    bizStatus: 0,
    notes: ''
  }
  if (dialogType === 'update') {
    title.value = '修改物料分类'
    classifyDetail(rowId).then(({ data }) => {
      form.value = { ...form.value, ...data }
      form.value.parentId = data.parentId || undefined
      form.value.bizStatus = Number(data.bizStatus)
    })
  } else {
    title.value = '新增物料分类'
    if (parentRow) {
      // 新增下级：预填上级
      form.value.parentId = parentRow.matlClassifyId
      form.value.parentCode = parentRow.matlClassifyCode
      form.value.parentName = parentRow.matlClassifyName
    }
  }
}

/** 提交 */
function submit() {
  proxy.$refs.elFormRef.validate(valid => {
    if (!valid) return
    loading.value = true
    const api = type.value === 'update' ? classifyModify : classifyCreate
    api({ ...form.value, bizStatus: String(form.value.bizStatus) }).then(({ message }) => {
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
