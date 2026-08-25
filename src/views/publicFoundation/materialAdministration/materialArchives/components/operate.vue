<template>
  <ep-dialog :title="title" v-model="visible" width="560px" top="10vh" append-to-body v-loading="loading">
    <el-form ref="elFormRef" :model="form" :rules="rules" label-width="110px">
      <el-form-item label="物料编码：" prop="matlCode">
        <el-input v-model="form.matlCode" :disabled="type === 'create'" placeholder="创建时自动生成" />
      </el-form-item>
      <el-form-item label="物料名称：" prop="matlName">
        <el-input v-model="form.matlName" placeholder="请输入物料名称" maxlength="150" />
      </el-form-item>
      <el-form-item label="物料分类：" prop="matlClassifyId">
        <el-tree-select
          v-model="form.matlClassifyId"
          :data="treeOptions"
          :props="{ label: 'matlClassifyName', children: 'children' }"
          node-key="matlClassifyId"
          check-strictly
          clearable
          placeholder="请选择物料分类"
          style="width: 100%"
          @change="handleClassifyChange"
        />
      </el-form-item>
      <el-form-item label="物料性质：" prop="matlAttribute">
        <el-input v-model="form.matlAttribute" placeholder="请输入物料性质" maxlength="50" />
      </el-form-item>
      <el-form-item label="计量单位：" prop="matlUnit">
        <el-input v-model="form.matlUnit" placeholder="请输入计量单位" maxlength="50" />
      </el-form-item>
      <el-form-item label="是否统一计量：" prop="unifyUnit">
        <el-radio-group v-model="form.unifyUnit">
          <el-radio :value="'0'">是</el-radio>
          <el-radio :value="'1'">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="状态：" prop="bizStatus">
        <el-radio-group v-model="form.bizStatus">
          <el-radio :value="'0'">启用</el-radio>
          <el-radio :value="'1'">停用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="备注：">
        <el-input v-model="form.notes" type="textarea" :rows="2" placeholder="请输入备注" />
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
import { materialCreate, materialModify, materialDetail } from '@/api/base/materialMatl'

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
const title = ref('新增物料')
const type = ref('create')
const id = ref('')

const data = reactive({
  form: {
    matlId: null,
    matlCode: '',
    matlName: '',
    matlClassifyId: undefined,
    matlClassifyName: '',
    matlAttribute: '',
    matlUnit: '',
    unifyUnit: '0',
    bizStatus: '0',
    notes: ''
  },
  rules: {
    matlName: [{ required: true, message: '请输入物料名称', trigger: 'blur' }],
    matlClassifyId: [{ required: true, message: '请选择物料分类', trigger: 'change' }],
    matlAttribute: [{ required: true, message: '请输入物料性质', trigger: 'blur' }],
    matlUnit: [{ required: true, message: '请输入计量单位', trigger: 'blur' }]
  }
})

const { form, rules } = toRefs(data)

/** 分类选择：同步名称 */
function handleClassifyChange(id) {
  const find = (nodes) => {
    for (const n of nodes) {
      if (n.matlClassifyId === id) return n
      if (n.children) {
        const hit = find(n.children)
        if (hit) return hit
      }
    }
    return null
  }
  const node = find(props.treeOptions)
  form.value.matlClassifyName = node ? node.matlClassifyName : ''
}

/** 打开弹窗 */
function init(dialogType, rowId, defaultClassifyId) {
  type.value = dialogType
  id.value = rowId || ''
  visible.value = true
  form.value = {
    matlId: null,
    matlCode: '',
    matlName: '',
    matlClassifyId: undefined,
    matlClassifyName: '',
    matlAttribute: '',
    matlUnit: '',
    unifyUnit: '0',
    bizStatus: '0',
    notes: ''
  }
  if (dialogType === 'update') {
    title.value = '修改物料'
    materialDetail(rowId).then(({ data }) => {
      form.value = {
        matlId: data.matlId,
        matlCode: data.matlCode,
        matlName: data.matlName,
        matlClassifyId: data.matlClassifyId || undefined,
        matlClassifyName: data.matlClassifyName || '',
        matlAttribute: data.matlAttribute || '',
        matlUnit: data.matlUnit || '',
        unifyUnit: data.unifyUnit != null ? String(data.unifyUnit) : '0',
        bizStatus: data.bizStatus != null ? String(data.bizStatus) : '0',
        notes: data.notes || ''
      }
    })
  } else {
    title.value = '新增物料'
    if (defaultClassifyId) {
      form.value.matlClassifyId = defaultClassifyId
      handleClassifyChange(defaultClassifyId)
    }
  }
}

/** 提交 */
function submit() {
  proxy.$refs.elFormRef.validate(valid => {
    if (!valid) return
    loading.value = true
    const payload = { ...form.value, bizParam: {} }
    const api = type.value === 'update' ? materialModify : materialCreate
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
