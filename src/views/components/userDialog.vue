<template>
  <ep-dialog class="ep-dialog-list" title="选择用户" iconTitle="form" v-model="visible" width="1300px" top="5vh"
    append-to-body>
    <div class="sso-front-table-container app-container">
      <el-pro-table ref="proTableRef" :columns="userTableJson" :page-size="queryParams.pageSize"
        :search-collapse-threshold="5" :data="tableData" :total="total" @search="onSearch" :show-checkbox="true"
        selection-mode="single" :grid-options="{ rowId: 'id' }" :show-action="false"
        @selection-change="handleSelect" @row-click="handleSelectionChange" />
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="visible = false" class="cancel-btn"><svg-icon icon-class="cancel" />&nbsp;关闭</el-button>
        <el-button type="primary" class="determine-btn" @click="saveBtn"><svg-icon
            icon-class="determine" />&nbsp;保存</el-button>
      </div>
    </template>
  </ep-dialog>
</template>
<script setup>
import { userTableJson } from './tableJson'
import { deptTreePerson } from '@/api/materialAccept/acceptGroup'
const { proxy } = getCurrentInstance()

// 接收参数并指定类型（可选）
const props = defineProps({
  singleMode: {
    type: Boolean,
    default: true
  }
})
const visible = ref(false)
const loading = ref(false)
const tableData = ref([])
const selectionData = ref([])
const proTableRef = shallowRef(null)
// 待回显的用户名（打开弹窗时按调用方已选值勾选）
const echoNames = ref([])

const total = ref(0)
const queryParams = ref({
  pageNum: 1,
  pageSize: 30
})
// 声明触发的事件（可选，增强类型校验）
const emit = defineEmits(['selectChange']);
// 显示弹框（list：调用方已选的用户行，按 userName 回显选中；不传则无回显）
const show = async (list = []) => {
  visible.value = true
  selectionData.value = []
  echoNames.value = (list || []).map(r => r?.userName).filter(Boolean)
  tableData.value = [] // 打开即清空，避免残留上次旧数据/旧选中
  getList()
}
/** 查询列表 */
function getList() {
  loading.value = true
  deptTreePerson(queryParams.value).then(({ data }) => {
    tableData.value = data.list || []
    total.value = data.total
    // 回显调用方已选用户（按 userName 匹配，同步 selectionData 保证不改选择直接保存也能取到原值）
    nextTick(() => {
      proTableRef.value?.clearSelection?.()
      const ti = proTableRef.value?.getTableInstance?.()
      // 用库内部 localData 行匹配（key 与渲染行一致）
      const cur = proTableRef.value?.getCurrentData?.() || []
      const hit = echoNames.value.length ? cur.find(r => echoNames.value.includes(r.userName)) : null
      if (hit) {
        proTableRef.value?.setSelectedRows?.([hit])
        selectionData.value = [hit]
        // 单选列视觉由库内部 singleSelectedKey 驱动且无暴露 API，借 setCurrentRow 触发 current-change 同步
        ti?.setCurrentRow?.(hit)
      } else {
        // 无回显时清掉残留的单选视觉（singleSelectedKey 不被 clearSelection 清理）
        ti?.setCurrentRow?.(null)
      }
    })
  }).finally(() => {
    loading.value = false
  })
}
const onSearch = (params, pageConfig) => {
  queryParams.value = { ...params, ...pageConfig }
  getList()
}

// radio 勾选选中（库组件 selection-change，单选为 [row]，取消选择为空数组）
const handleSelect = (selection) => {
  const arr = Array.isArray(selection) ? selection : [selection]
  selectionData.value = arr.filter(Boolean)
}
// 行点击选中（后选覆盖先选）
const handleSelectionChange = (selection) => {
  selectionData.value = [selection]
}
const saveBtn = () => {
  if (!selectionData.value.length) {
    proxy.$modal.msgWarning('请选择数据')
    return
  }
  emit('selectChange', selectionData.value)
  visible.value = false
}
defineExpose({
  show,
})
</script>
<style lang="scss" scoped></style>