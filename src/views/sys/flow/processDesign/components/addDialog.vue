<template>
  <ep-dialog :title="title" v-model="visible" width="800px" top="10vh" append-to-body v-loading="loading"
             :close-on-click-modal="false">
    <el-form ref="elFormRef" :model="formData" :rules="rules" label-width="90px">
      <el-form-item label="流程名称：" prop="processName">
        <el-input v-model="formData.processName" maxlength="50" placeholder="请输入流程名称" clearable  style="width: 400px;"/>
      </el-form-item>
      <el-form-item label="关联业务：" prop="billType">
        <el-select v-model="formData.billType" filterable :disabled="type === 'update'" placeholder="请选择关联业务"
                   style="width: 400px">
          <el-option v-for="item in businessTypeList" :key="item.dictCode || item.value" :label="item.dictName || item.label"
                     :value="item.dictCode || item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="状态：" prop="status">
        <el-switch v-model="formData.status" active-value="0" inactive-value="1" active-text="启用" inactive-text="禁用" />
      </el-form-item>
      <el-form-item label="适用单位：" prop="useOrgIds">
        <el-tree-select
          v-model="formData.useOrgIds"
          :data="deptOptions"
          :props="{ label: 'label', children: 'children', disabled: 'isDisabled' }"
          node-key="id"
          multiple
          collapse-tags
          collapse-tags-tooltip
          clearable
          :check-strictly="false"
          placeholder="请选择适用单位"
          style="width: 400px"
        />
      </el-form-item>
      <el-form-item label="流程描述：" prop="remark">
        <el-input v-model="formData.remark" type="textarea" placeholder="请输入流程描述" maxlength="500" show-word-limit style="width: 400px;"/>
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

<script setup name="addDialog">
import { ElMessage } from 'element-plus'
import { addCategory, deptTreeAll, detailCategory, getDictByCode, updateCategory } from '@/api/workflow/category'
import { getDictByCodeData, deptTreeAllData, detailCategoryData } from './mockData'

const { proxy } = getCurrentInstance()

const emit = defineEmits(['success'])

// --- 状态 ---
const visible = ref(false)
const loading = ref(false)
const title = ref('新增流程')
const type = ref('create') // 'create' | 'update'
const id = ref(null)
const businessTypeList = ref([])
const deptOptions = ref([])

// --- 表单数据 + 校验（与 operate.vue 同风格：reactive + toRefs） ---
const data = reactive({
  formData: {
    processName: '',
    billType: '',
    useOrgIds: [],
    useOrgNames: [],
    status: '0',
    remark: ''
  },
  rules: {
    processName: [
      { required: true, message: '请输入流程名称', trigger: 'blur' },
      {
        trigger: 'blur',
        validator: (rule, value, callback) => {
          if (!value || !/\S/.test(value)) {
            callback(new Error('流程名称不能为空'))
          } else {
            callback()
          }
        }
      }
    ],
    billType: [
      { required: true, message: '请选择关联业务', trigger: 'change' }
    ],
    useOrgIds: [
      { required: true, message: '请选择适用单位', trigger: 'change', type: 'array' }
    ],
    status: [
      { required: true, message: '请选择状态', trigger: 'change' }
    ]
  }
})
const { formData, rules } = toRefs(data)

// 表单初始值（用于 reset）
const initialForm = {
  processName: '',
  billType: '',
  useOrgIds: [],
  useOrgNames: [],
  status: '0',
  remark: ''
}

function resetForm() {
  Object.assign(formData.value, initialForm)
  nextTick(() => {
    proxy.$refs.elFormRef && proxy.$refs.elFormRef.resetFields()
  })
}

// --- 业务工具函数 ---
function normalizer(node) {
  if (node.children && !node.children.length) {
    delete node.children
  }
  return {
    id: node.unitCode,
    label: node.unitName,
    children: node.children,
    isDisabled: node.disabled
  }
}

function findLabelById(options, targetId) {
  if (!options || !options.length) return ''
  for (const opt of options) {
    if (opt.id === targetId) return opt.label
    if (opt.children && opt.children.length) {
      const found = findLabelById(opt.children, targetId)
      if (found) return found
    }
  }
  return ''
}

// --- 打开弹窗 ---
function init(row, buttonCode) {
  visible.value = true
  type.value = buttonCode
  id.value = row?.id || null
  title.value = buttonCode === 'update' ? '编辑流程' : '新增流程'

  // 加载字典（失败回退 mock）
  getDictByCode('billType').then(({ data }) => {
    businessTypeList.value = data || []
  }).catch(() => {
    businessTypeList.value = getDictByCodeData
  })

  if (buttonCode === 'update') {
    detailCategory(row.id).then(({ data }) => {
      applyDetail(data)
    }).catch(() => {
      applyDetail(detailCategoryData)
    })
  }
}

function applyDetail(data) {
  data.useOrgNames = data.useOrgName.split(',')
  const item = { ...data }
  delete item.useOrgId
  delete item.useOrgName
  Object.assign(formData.value, {
    processName: item.processName,
    billType: item.billType,
    useOrgIds: item.useOrgIds,
    useOrgNames: item.useOrgNames.map((n, i) => ({ unitCode: item.useOrgIds[i], unitName: n })),
    status: item.status,
    remark: item.remark
  })
}

// --- 提交 ---
function submit() {
  proxy.$refs.elFormRef.validate(valid => {
    if (!valid) return
    loading.value = true

    // 构建 useOrgList：从 deptOptions 中查找每个选中 id 的 label
    const useOrgList = formData.value.useOrgIds.map(useOrgId => ({
      useOrgId,
      useOrgName: findLabelById(deptOptions.value, useOrgId)
    }))

    const params = {
      ...formData.value,
      useOrgList
    }
    delete params.useOrgNames
    delete params.useOrgIds

    const request = type.value === 'update' ? updateCategory : addCategory
    request(params).then(res => {
      if (res.code === 0) {
        ElMessage.success(res.message || '操作成功')
        visible.value = false
        emit('success')
      } else {
        ElMessage.error(res.message)
      }
    }).finally(() => {
      loading.value = false
    })
  })
}

// --- watch ---
watch(() => data.formData.billType, (val) => {
  if (val) {
    deptTreeAll({ billType: val, id: id.value }).then(({ data }) => {
      deptOptions.value = (data || []).map(normalizer)
    }).catch(() => {
      deptOptions.value = deptTreeAllData.map(normalizer)
    })
  }
}, { immediate: true })

// 关闭弹窗重置表单
watch(visible, val => {
  if (!val) {
    resetForm()
  }
})

defineExpose({ init })
</script>
