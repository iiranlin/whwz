<template>
  <ep-dialog :title="title" v-model="visible" width="700px" top="8vh" append-to-body v-loading="loading">
    <el-form ref="elFormRef" :model="form" :rules="rules" label-width="90px">
      <el-form-item label="所属部门：" prop="deptId">
        <el-tree-select
          v-model="form.deptId"
          :data="deptOptions"
          :props="{ label: 'deptName', children: 'children' }"
          node-key="id"
          check-strictly
          clearable
          placeholder="选择所属部门"
          style="width: 100%"
        />
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item label="用户账号：" prop="username">
            <el-input v-model="form.username" placeholder="请输入用户账号" maxlength="20" :disabled="type === 'update'" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="用户名称：" prop="nickName">
            <el-input v-model="form.nickName" placeholder="请输入用户名称" maxlength="20" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="联系方式：" prop="phone">
            <el-input v-model="form.phone" placeholder="请输入联系方式" maxlength="11" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="电子邮箱：" prop="email">
            <el-input v-model="form.email" placeholder="请输入电子邮箱" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="排序：" prop="sort">
            <el-input-number v-model="form.sort" controls-position="right" :min="1" :max="9999" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态：">
            <el-radio-group v-model="form.status">
              <el-radio :value="0">启用</el-radio>
              <el-radio :value="1">停用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="数据权限：" prop="rank">
        <el-select v-model="form.rank" filterable placeholder="请选择数据权限级别" style="width: 100%">
          <el-option v-for="item in rankList" :key="item.code" :label="item.name" :value="item.code" />
        </el-select>
      </el-form-item>
      <el-form-item v-if="form.rank === 4" label="权限范围：" prop="deptIds">
        <el-tree
          ref="deptTreeRef"
          :data="deptOptions"
          show-checkbox
          node-key="id"
          :props="{ label: 'deptName', children: 'children' }"
          default-expand-all
        />
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
import { userCreate, userDetail, userModify } from '@/api/base/user'
import { deptTree } from '@/api/base/dept'

const { proxy } = getCurrentInstance()

const visible = ref(false)
const loading = ref(false)
const title = ref('新增用户')
const type = ref('create')
const id = ref('')
const deptOptions = ref([])

const rankList = [
  { code: '1', name: '仅本人' },
  { code: '2', name: '本部门' },
  { code: '3', name: '本部门及子部门' },
  { code: '4', name: '自定义' },
  { code: '5', name: '全部' }
]

const data = reactive({
  form: {
    username: '',
    nickName: '',
    deptId: undefined,
    status: 0,
    rank: '5',
    deptIds: [],
    sort: 1,
    phone: '',
    email: ''
  },
  rules: {
    deptId: [{ required: true, message: '请选择所属部门', trigger: 'change' }],
    username: [
      { required: true, message: '用户账号不能为空', trigger: 'blur' },
      {
        pattern: /^[\da-z]+$/i,
        message: '用户账号只能是字母或数字',
        trigger: 'blur'
      }
    ],
    nickName: [{ required: true, message: '用户名称不能为空', trigger: 'blur' }]
  }
})

const { form, rules } = toRefs(data)

const emit = defineEmits(['createSuccess'])

// 部门树
function getDeptTree() {
  deptTree().then(({ data }) => {
    if (data && data[0] && data[0].deptCode === '10000001') {
      deptOptions.value = data[0].children || []
    } else {
      deptOptions.value = data || []
    }
  })
}

// 打开弹窗
function init(dialogType, rowId) {
  visible.value = true
  type.value = dialogType
  id.value = rowId || ''
  getDeptTree()
  if (dialogType === 'update') {
    title.value = '修改用户'
    userDetail(rowId).then(({ data }) => {
      form.value = data
      form.value.deptId = data.deptId || undefined
    })
  } else {
    title.value = '新增用户'
  }
}

// 提交
function submit() {
  proxy.$refs.elFormRef.validate(valid => {
    if (!valid) return
    // 自定义权限范围时收集勾选的部门
    if (form.value.rank === 4 && proxy.$refs.deptTreeRef) {
      form.value.deptIds = proxy.$refs.deptTreeRef.getCheckedKeys()
    }
    loading.value = true
    const request = type.value === 'create'
      ? userCreate(form.value)
      : userModify({ ...form.value, id: id.value })
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
