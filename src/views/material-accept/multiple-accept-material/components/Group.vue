<template>
  <ep-dialog class="ep-dialog-list" :title="title" iconTitle="form" v-model="groupVisible" width="70vw" top="5vh"
    append-to-body>
    <div class="sso-front-table-container app-container">
      <el-pro-table ref="proTableRef" :columns="groupColumns" :page-size="queryParams.pageSize"
       :search-collapse-threshold="5" :data="tableData" :total="total"
        @search="onSearch" table-id="multiple-accept-material" :show-checkbox="true" selection-mode="single"
        :grid-options="{ rowId: 'matlCateCode' }" :default-search-form="defaultSearchForm"
        @row-click="handleSelectionChange" :show-action="false" />
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
import { groupColumns, } from "../tableJson"
const props = defineProps({

})
const groupVisible = defineModel({ default: false })
const tableData = ref([])
const loading = ref(false)
const total = ref(0)
const proTableRef = shallowRef(null)

const title = ref('物资分类编号')
const defaultSearchForm = {
  matlType: '1',
};
const queryParams = ref({
  pageNum: 1,
  pageSize: 30,
  matlType: defaultSearchForm.matlType
})
const emit = defineEmits(['createSuccess', 'selectData']);
const dialogType = ref('')

watch(groupVisible, (newVal) => {
  if (newVal) {
    getList()
  } else {
    proTableRef.value?.reset?.()
  }
})
const getList = async () => {
  loading.value = true
  if (queryParams.value.matlType === '1') {
    //查询物资大类列表
    paramConfignoAuthorizeTree({
      matlCateName: queryParams.value.matlName,
      matlCateCode: queryParams.value.matlCode,
      matlType: queryParams.value.matlType,
      pageNum: queryParams.value.pageNum,
      pageSize: queryParams.value.pageSize
    }).then(({ data }) => {
      tableData.value = data.list?.map(item => {
        return {
          matlName: item.matlCateName,
          matlCode: item.matlCateCode,
          ...item
        }
      }) || []
      total.value = data.total
    }).finally(() => {
      loading.value = false
    })
  } else {
    //查询物资目录列表
    paramConfignoAuthorizeList({
      ...queryParams.value
    }).then(({ data }) => {
      tableData.value = data.list || []
      total.value = data.total
    }).finally(() => {
      loading.value = false
    })
  }
}
const onSearch = (params, pageConfig) => {
  queryParams.value = { ...params, ...pageConfig }
  getList()
}
const selectData = ref({})
const handleSelectionChange = (selection) => {
  selectData.value = selection
}
const saveBtn = () => {
  groupVisible.value = false
  emit('selectData', selectData.value)
}
</script>
<style lang="scss" scoped></style>