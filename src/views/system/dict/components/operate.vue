<template>
  <ep-dialog :title="title" v-model="visible" width="600px" top="5vh" append-to-body v-loading="loading">
    <el-form ref="elFormRef" :model="form" :rules="rules" label-width="85px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="上级字典：" prop="parentId">
            <el-tree-select
              v-model="form.parentId"
              :data="treeOptions"
              :props="{ label: 'name', children: 'children' }"
              node-key="id"
              check-strictly
              clearable
              placeholder="选择上级字典"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="排序：" prop="seq">
            <el-input-number v-model="form.seq" controls-position="right" :min="1" :max="99" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="字典编号：" prop="code">
            <el-input v-model="form.code" placeholder="请输入字典编号" :disabled="type === 'update'" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="字典名称：" prop="name">
            <el-input v-model="form.name" placeholder="请输入字典名称" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="备注：" prop="remark">
            <el-input v-model="form.remark" placeholder="请输入备注" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态：" prop="status">
            <el-radio-group v-model="form.status">
              <el-radio :value="0">启用</el-radio>
              <el-radio :value="1">停用</el-radio>
            </el-radio-group>
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
import { dictCreate, dictModify, dictDetail, getMaxSeqByParentId } from '@/api/base/dict'

const { proxy } = getCurrentInstance()

const props = defineProps({
  deptOptions: {
    type: Array,
    default: () => []
  }
})

const visible = ref(false)
const loading = ref(false)
const title = ref('新增字典')
const type = ref('create')
const id = ref('')

const treeOptions = computed(() => props.deptOptions)

const data = reactive({
  form: {
    name: '',
    code: '',
    seq: 0,
    parentId: undefined,
    remark: '',
    status: 0
  },
  rules: {
    code: [{ required: true, message: '字典编号不能为空', trigger: 'blur' }],
    name: [{ required: true, message: '字典名称不能为空', trigger: 'blur' }]
  }
})

const { form, rules } = toRefs(data)

const emit = defineEmits(['createSuccess'])

// 打开弹窗
function init(dialogType, rowId, parentId) {
  visible.value = true
  type.value = dialogType
  id.value = rowId || ''
  if (dialogType === 'update') {
    title.value = '修改字典'
    dictDetail(rowId).then(({ data }) => {
      form.value = data
      form.value.parentId = data.parentId || undefined
    })
  } else {
    title.value = '新增字典'
    form.value.parentId = parentId || undefined
    getMaxSeqByParentId({ parentId }).then(({ data }) => {
      form.value.seq = data
    })
  }
}

// 提交
function submit() {
  proxy.$refs.elFormRef.validate(valid => {
    if (!valid) return
    loading.value = true
    const request = type.value === 'create'
      ? dictCreate(form.value)
      : dictModify({ ...form.value, id: id.value })
    request.then(({ message }) => {
      proxy.$modal.msgSuccess(message)
      visible.value = false
      emit('createSuccess')
    }).finally(() => {
      loading.value = false
    })
  })
}

defineExpose({
  init
})
</script>
