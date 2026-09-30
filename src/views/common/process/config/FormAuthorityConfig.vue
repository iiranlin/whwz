<template>
  <div>
    <el-table :header-cell-style="{background:'#E5E6EB',color:'#1D2129'}" :data="formPerms" border style="width: 100%">
      <el-table-column prop="title" show-overflow-tooltip label="表单字段">
        <template #default="scope">
           <span v-if="scope.row.required" style="color: #c75450"> * </span>
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="readOnly" label="只读" width="80">
        <template #header="scope">
          <el-radio label="R" v-model="permSelect" @change="allSelect('R')">只读</el-radio>
        </template>
        <template #default="scope">
          <el-radio v-model="scope.row.perm" label="R" :name="scope.row.id"></el-radio>
        </template>
      </el-table-column>
      <el-table-column prop="editable" label="可编辑" width="90" v-if="nowNode.type !== 'CC'">
        <template #header="scope">
          <el-radio label="E" v-model="permSelect" @change="allSelect('E')">可编辑</el-radio>
        </template>
        <template #default="scope">
          <el-radio v-model="scope.row.perm" label="E" :name="scope.row.id"></el-radio>
        </template>
      </el-table-column>
      <el-table-column prop="hide" label="隐藏" width="80">
        <template #header="scope">
          <el-radio label="H" v-model="permSelect" @change="allSelect('H')">隐藏</el-radio>
        </template>
        <template #default="scope">
          <el-radio v-model="scope.row.perm" label="H" :name="scope.row.id"></el-radio>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup name="FormAuthorityConfig">
import { ref, computed, watch, onMounted, getCurrentInstance } from 'vue'
import { useProcessStore } from '@/store/modules/process'

const { proxy } = getCurrentInstance()

const processStore = useProcessStore()

const tableData = ref([])
const isIndeterminate = ref(false)
const permSelect = ref('')
const checkStatus = ref({
  readOnly: true,
  editable: false,
  hide: false
})

const nowNode = computed(() => processStore.selectedNode)
const formData = computed(() => processStore.design.formItems)
const formPerms = computed(() => processStore.selectedNode.props.formPerms)

function allSelect(type) {
  permSelect.value = type
  formPerms.value.forEach(f => f.perm = type)
}

function formPermsLoad(oldPermMap, forms) {
  forms.forEach(form => {
    if (form.name === 'SpanLayout') {
      formPermsLoad(oldPermMap, form.props.items)
    } else {
      let old = oldPermMap.get(form.id)
      if (old) {
        old.title = form.title
        old.required = form.props.required
        formPerms.value.push(old)
      } else {
        formPerms.value.push({
          id: form.id,
          title: form.title,
          required: form.props.required,
          perm: processStore.selectedNode.type === 'ROOT' ? 'E' : 'R'
        })
      }
    }
  })
}

function handleCheckAllChange() {
}

// created 钩子逻辑
// 备份
const oldPermMap = formPerms.value.toMap('id')
// 重新清空，按顺序加载权限
formPerms.value.length = 0
formPermsLoad(oldPermMap, formData.value)

watch(formPerms, () => {
  const set = new Set(formPerms.value.map(f => f.perm))
  permSelect.value = set.size === 1 ? set.values().next().value : ''
}, { deep: true })
</script>

<style lang="scss" scoped>

:deep(.el-table__row) {
  & > td:first-child {
    .cell {
      text-align: left;
    }
  }

  .cell {
    text-align: center;
  }

  .el-radio__label {
    display: none;
  }
}
</style>
