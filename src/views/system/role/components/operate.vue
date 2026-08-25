<template>
  <ep-dialog :title="title" v-model="visible" width="560px" top="8vh" append-to-body v-loading="loading">
    <el-form ref="elFormRef" :model="form" :rules="rules" label-width="85px">
      <el-form-item label="所属单位：" prop="unitId">
        <el-tree-select
          v-model="form.unitId"
          :data="unitTreeData"
          :props="{ label: 'deptName', children: 'children' }"
          node-key="id"
          check-strictly
          clearable
          placeholder="请选择单位"
          style="width: 100%"
        />
      </el-form-item>
      <el-form-item label="角色编号：" prop="roleCode">
        <el-input v-model="form.roleCode" maxlength="20" placeholder="请输入角色编号" :disabled="type === 'update'" />
      </el-form-item>
      <el-form-item label="角色名称：" prop="roleName">
        <el-input v-model="form.roleName" maxlength="50" placeholder="请输入角色名称" />
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
import { roleCreate, roleDetail, roleModify } from '@/api/base/role'
import { getUnitTree } from '@/api/base/dept'

const { proxy } = getCurrentInstance()

const visible = ref(false)
const loading = ref(false)
const title = ref('新增角色')
const type = ref('create')
const id = ref('')
const unitTreeData = ref([])

const data = reactive({
  form: {
    unitId: undefined,
    roleCode: '',
    roleName: '',
    status: 0
  },
  rules: {
    unitId: [{ required: true, message: '请选择单位', trigger: 'change' }],
    roleCode: [
      { required: true, message: '角色编号不能为空', trigger: 'blur' },
      {
        pattern: /^[\da-z_]+$/i,
        message: '角色编号只能是字母或数字或下划线',
        trigger: 'blur'
      }
    ],
    roleName: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }]
  }
})

const { form, rules } = toRefs(data)

const emit = defineEmits(['createSuccess'])

// 单位树
function getUnitTreeData() {
  getUnitTree().then(({ data }) => {
    unitTreeData.value = data || []
  })
}

// 打开弹窗
function init(dialogType, rowId) {
  visible.value = true
  type.value = dialogType
  id.value = rowId || ''
  getUnitTreeData()
  if (dialogType === 'update') {
    title.value = '修改角色'
    roleDetail(rowId).then(({ data }) => {
      form.value = data
      form.value.unitId = data.unitId || undefined
    })
  } else {
    title.value = '新增角色'
    form.value.unitId = undefined
    form.value.roleCode = ''
    form.value.roleName = ''
    form.value.status = 0
  }
}

// 提交
function submit() {
  proxy.$refs.elFormRef.validate(valid => {
    if (!valid) return
    loading.value = true
    const request = type.value === 'create'
      ? roleCreate(form.value)
      : roleModify({ ...form.value, id: id.value })
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
