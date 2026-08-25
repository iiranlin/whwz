<template>
  <ep-dialog class="ep-dialog-list" :title="title" iconTitle="form" v-model="groupVisible" width="70vw" top="5vh"
    append-to-body height="60vh" :close-on-press-escape="false" :close-on-click-model="false">
    <div class="sso-front-table-container app-container">
      <el-pro-table ref="proTableRef" :columns="tableJsonGroup" :page-size="queryParams.pageSize"
        :search-collapse-threshold="5" :data="tableData" :total="total" @search="onSearch" :show-checkbox="true"
        selection-mode="single" :grid-options="{ rowId: 'seq' }" :show-action="false"
        @row-click="handleSelectionChange" />
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="groupVisible = false" class="cancel-btn"><svg-icon icon-class="cancel" />&nbsp;关闭</el-button>
        <el-button type="primary" class="determine-btn" @click="saveBtn"><svg-icon icon-class="determine" />&nbsp;{{
          dialogType === 'create' ? '保存' : '确定' }}</el-button>
      </div>
    </template>
  </ep-dialog>
</template>

<script setup>
import { paramConfignoAuthorizeList, paramConfignoAuthorizeTree } from '@/api/materialAccept/acceptMaterial'
import { tableJsonGroup } from "../tableJson"
const props = defineProps({

})
const proTableRef = shallowRef(null)
const groupVisible = defineModel({ default: false })
watch(groupVisible, (newVal) => {
  if (newVal) {
    getList()
  } else {
    proTableRef.value?.reset?.()
  }
})
const tableData = ref([])
const loading = ref(false)
const total = ref(0)


const title = ref('物资分类编号')
const queryParams = ref({
  pageNum: 1,
  pageSize: 30
})

const emit = defineEmits(['selectData']);
const dialogType = ref('')

const getList = async () => {
  loading.value = true
  //查询物资目录列表
  paramConfignoAuthorizeList(queryParams.value).then(({ data }) => {
    tableData.value = data.list || []
    total.value = data.total
  }).finally(() => {
    loading.value = false
  })
}
const onSearch = (params, pageConfig) => {
  queryParams.value = { ...params, ...pageConfig }
  getList()
}
const selectionData = ref({})
const handleSelectionChange = (selection) => {
  selectionData.value = selection
}
const saveBtn = () => {
  emit('selectData', selectionData.value)
  groupVisible.value = false
}
</script>
<style lang="scss" scoped></style>