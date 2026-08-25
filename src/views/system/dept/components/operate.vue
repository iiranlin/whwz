<template>
  <ep-dialog :title="title" v-model="visible" width="620px" top="10vh" append-to-body v-loading="loading">
    <!-- 批量修改 -->
    <div v-if="type === 'batch'" class="batch-modify">
      <el-form ref="batchFormRef" :model="batchForm" label-width="90px">
        <el-form-item label="部门名称：">
          <el-input v-model="batchForm.deptName" placeholder="不填则不修改" clearable />
        </el-form-item>
        <el-form-item label="排序：">
          <el-input-number v-model="batchForm.sort" controls-position="right" :min="1" :max="9999" />
        </el-form-item>
        <el-form-item label="状态：">
          <el-radio-group v-model="batchForm.status">
            <el-radio :value="0">启用</el-radio>
            <el-radio :value="1">停用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </div>
    <!-- 新增/修改 -->
    <el-form v-else ref="elFormRef" :model="form" :rules="rules" label-width="90px">
      <el-form-item label="上级部门：" prop="parentId">
        <el-tree-select
          v-model="form.parentId"
          :data="deptOptions"
          :props="{ label: 'deptName', children: 'children' }"
          node-key="id"
          check-strictly
          clearable
          placeholder="选择上级部门"
          style="width: 100%"
        />
      </el-form-item>
      <el-form-item label="部门名称：" prop="deptName">
        <el-input v-model="form.deptName" placeholder="请输入部门名称" />
      </el-form-item>
      <el-form-item label="部门编码：" prop="deptCode">
        <el-input v-model="form.deptCode" placeholder="请输入部门编码" :disabled="type === 'update'" />
      </el-form-item>
      <el-form-item label="排序：" prop="sort">
        <el-input-number v-model="form.sort" controls-position="right" :min="1" :max="9999" />
      </el-form-item>
      <el-form-item label="状态：">
        <el-radio-group v-model="form.status">
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
import { deptCreate, deptModify, deptDetail, deptTreeAll, deptModifyBatch } from '@/api/base/dept'

const { proxy } = getCurrentInstance()

const visible = ref(false)
const loading = ref(false)
const title = ref('新增部门')
const type = ref('create')
const id = ref('')
const ids = ref([])
const deptOptions = ref([])

const data = reactive({
  form: {
    parentId: undefined,
    deptName: '',
    deptCode: '',
    sort: 1,
    status: 0
  },
  batchForm: {
    deptName: '',
    sort: 1,
    status: 0
  },
  rules: {
    deptName: [{ required: true, message: '部门名称不能为空', trigger: 'blur' }],
    deptCode: [{ required: true, message: '部门编码不能为空', trigger: 'blur' }]
  }
})

const { form, batchForm, rules } = toRefs(data)

const emit = defineEmits(['createSuccess'])

// 部门树（作为上级选择）
function getDeptTree() {
  deptTreeAll().then(({ data }) => {
    deptOptions.value = data || []
  })
}

// 打开弹窗
function init(dialogType, rowId, parentRow, batchIds) {
  visible.value = true
  type.value = dialogType
  id.value = rowId || ''
  ids.value = batchIds || []
  getDeptTree()
  if (dialogType === 'update') {
    title.value = '修改部门'
    deptDetail(rowId).then(({ data }) => {
      form.value = data
      form.value.parentId = data.parentId || undefined
    })
  } else if (dialogType === 'batch') {
    title.value = '批量修改部门'
  } else {
    title.value = '新增部门'
    form.value.parentId = parentRow ? parentRow.id : undefined
    form.value.deptName = ''
    form.value.deptCode = ''
    form.value.sort = 1
    form.value.status = 0
  }
}

// 提交
function submit() {
  if (type.value === 'batch') {
    loading.value = true
    deptModifyBatch({ ids: ids.value, ...batchForm.value }).then(({ message }) => {
      proxy.$modal.msgSuccess(message)
      visible.value = false
      emit('createSuccess')
    }).finally(() => {
      loading.value = false
    })
    return
  }
  proxy.$refs.elFormRef.validate(valid => {
    if (!valid) return
    loading.value = true
    const request = type.value === 'create'
      ? deptCreate(form.value)
      : deptModify({ ...form.value, id: id.value })
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

<style lang="scss" scoped>
.batch-modify {
  min-height: 160px;
}
</style>
