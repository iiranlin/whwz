<template>
  <ep-dialog :title="title" v-model="visible" width="720px" top="8vh" append-to-body v-loading="loading">
    <el-form ref="elFormRef" :model="form" :rules="rules" label-width="110px">
      <el-form-item label="上级菜单：" prop="parentId">
        <el-tree-select
          v-model="form.parentId"
          :data="menuOptions"
          :props="{ label: 'menuName', children: 'children' }"
          node-key="id"
          check-strictly
          clearable
          placeholder="选择上级菜单"
          style="width: 100%"
          @change="onParentChange"
        />
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item label="菜单名称：" prop="menuName">
            <el-input v-model="form.menuName" placeholder="请输入菜单名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="菜单编码：" prop="menuCode">
            <el-input v-model="form.menuCode" placeholder="请输入菜单编码" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="菜单URL：" prop="menuUrl">
            <el-input v-model="form.menuUrl" placeholder="如 /system/user（对应 views/system/user/index.vue）" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="组件地址：">
            <el-input v-model="form.component" placeholder="如 system/user/index（不填默认 ParentView）" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="图标：">
            <el-input v-model="form.menuIcon" placeholder="svg图标名" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="排序：">
            <el-input-number v-model="form.seq" controls-position="right" :min="1" :max="999" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="菜单类型：">
            <el-select v-model="form.menuType" style="width: 100%">
              <el-option label="内部" value="1" />
              <el-option label="外部" value="2" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="子系统服务：">
            <el-select v-model="form.serviceId" style="width: 100%" clearable placeholder="请选择子系统服务">
              <el-option v-for="item in serviceList" :key="item.id" :label="item.serviceName" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="启用：">
            <el-switch v-model="form.status" :active-value="0" :inactive-value="1" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="隐藏：">
            <el-switch v-model="form.isHide" :active-value="1" :inactive-value="0" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="页面缓存：">
            <el-switch v-model="form.isCache" :active-value="1" :inactive-value="0" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="字段权限：">
            <el-switch v-model="form.isAcl" :active-value="1" :inactive-value="0" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="默认分页条数：">
        <el-input-number v-model="form.defaultPageSize" controls-position="right" :min="30" :max="500" />
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
import { menuCreate, menuModify, menuDetail, menuTree, getMaxSeqByParentId } from '@/api/base/menu'
import { serviceDict } from '@/api/base/frontend'

const { proxy } = getCurrentInstance()

const visible = ref(false)
const loading = ref(false)
const title = ref('新增菜单')
const type = ref('create')
const id = ref('')
const menuOptions = ref([])
const serviceList = ref([])

// 表单默认值（修改/复制时 detail 数据在此基础上合并，fields/buttons 配置一并保留提交，后端空配置会清库）
function defaultForm() {
  return {
    parentId: undefined,
    menuName: '',
    menuCode: '',
    menuUrl: '',
    menuIcon: '',
    component: '',
    seq: 1,
    menuType: '1',
    serviceId: '',
    status: 0,
    isCache: 1,
    isAcl: 0,
    isHide: 0,
    defaultPageSize: 30
  }
}

const data = reactive({
  form: defaultForm(),
  rules: {
    menuName: [{ required: true, message: '菜单名称不能为空', trigger: 'blur' }],
    menuCode: [{ required: true, message: '菜单编码不能为空', trigger: 'blur' }],
    menuUrl: [{ required: true, message: '菜单URL不能为空', trigger: 'blur' }]
  }
})

const { form, rules } = toRefs(data)

const emit = defineEmits(['createSuccess'])

// 菜单树（上级选择）
function getMenuTree() {
  menuTree().then(({ data }) => {
    menuOptions.value = data || []
  })
}

// 子系统服务下拉
function getServiceDict() {
  serviceDict().then(({ data }) => {
    serviceList.value = data || []
  })
}

// 选择上级菜单后自动取该层级最大排序号（与原页面一致，仅新增时）
function onParentChange(val) {
  if (type.value === 'create' && val) {
    getMaxSeqByParentId({ parentId: val }).then(({ data }) => {
      form.value.seq = data
    })
  }
}

// 打开弹窗
function init(dialogType, rowId, parentRow) {
  visible.value = true
  type.value = dialogType
  id.value = rowId || ''
  getMenuTree()
  getServiceDict()
  if (dialogType === 'update' || dialogType === 'copy') {
    title.value = dialogType === 'update' ? '修改菜单' : '复制菜单'
    loading.value = true
    menuDetail(rowId).then(({ data }) => {
      const { id: _id, createTime: _ct, updateTime: _ut, children: _ch, ...rest } = data
      form.value = { ...defaultForm(), ...rest }
      form.value.parentId = data.parentId || undefined
      if (dialogType === 'copy') {
        proxy.$modal.msgWarning('复制菜单：请修改菜单URL后保存（菜单URL不可重复）')
      }
    }).finally(() => {
      loading.value = false
    })
  } else {
    title.value = '新增菜单'
    form.value = defaultForm()
    if (parentRow) {
      form.value.parentId = parentRow.id
      onParentChange(parentRow.id)
    }
  }
}

// 提交（copy 复用新增接口，后端会重置字段/按钮配置的主键）
function submit() {
  proxy.$refs.elFormRef.validate(valid => {
    if (!valid) return
    loading.value = true
    const request = (type.value === 'create' || type.value === 'copy')
      ? menuCreate(form.value)
      : menuModify({ ...form.value, id: id.value })
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
