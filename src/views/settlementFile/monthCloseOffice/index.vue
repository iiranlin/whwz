<template>
  <div class="app-container app-container-splitpanes">
    <el-row :gutter="20" class="app-container-row integrated-manage-pane-form integrated-manage-pane-form-a">
      <el-col class="app-container-col">
        <el-pro-table ref="proTableRef" v-loading="loading" action-width="80" :page-size="30" :data="tableData"
          :total="total" :columns="columns" :table-alert-render="false" :default-search-form="defaultSearchForm"
          :toolbar-config="toolbarConfig" :grid-options="{ rowId: idName }" :table-id="menuId" @search="onSearch"
          @action="onAction" @selection-change="onSelectionChange">
          <template #closeFlag="{ row, column }">
            <el-checkbox
              v-model="row.closeFlag"
              true-value="0"
              false-value="1"
              :disabled="row.isSubmitting"
              @change="closeFlagChange(row)"
            >
              <span :class="{'span-red': row.closeFlag == '1'}">{{ column.dict[row.closeFlag] }}</span>
            </el-checkbox>
          </template>
        </el-pro-table>
      </el-col>
    </el-row>
  </div>
</template>

<script setup name="monthCloseOffice">
import { columns, toolbarConfig } from "./tableJson"
import { getMonthCloseList, ccrecordCgsBill, ccrecordCgsCarryOver } from "@/api/settlementFile/monthCloseGroup";

const { proxy } = getCurrentInstance()

const menuId = ref(proxy.$route.meta?.menuId)
const tableData = ref([])
const loading = ref(false)
const idName = ref('recoredId')
const ids = ref([])
const selectionData = ref([])
const total = ref(0)

const data = reactive({
  defaultSearchForm: {
    yearMonth: ''
  },
  queryParams: {
    pageNum: 1,
    pageSize: 30,
    yearMonth: ''
  },
})

const { queryParams, defaultSearchForm } = toRefs(data)

/** 查询列表 */
function getList() {
  loading.value = true
  getMonthCloseList(queryParams.value).then(({ data }) => {
    tableData.value = data.list || []
    total.value = data.total
  }).finally(() => {
    loading.value = false
  })
}

/** 搜索按钮操作 */
function onSearch(form, pageInfo) {
  queryParams.value = { ...form, ...pageInfo }
  getList()
}

/** 多选框选中数据 */
function onSelectionChange(selection) {
  selectionData.value = selection
  ids.value = selection.map(item => item[idName.value])
}

const onAction = (payload) => {
  const { code, row, files } = payload
  const eventObj = {
    carryOver: () => {
      proxy.$modal.confirm('确定要本月结转吗？').then(()=>{
        return ccrecordCgsCarryOver()
      }).then( ({message}) => {
        proxy.$modal.msgSuccess(message)
        getList()
      })
    }
  }
  eventObj[code] && eventObj[code]()
}

// 封账操作
const closeFlagChange = async (row) => {
  try {
    await ccrecordCgsBill(row.yearMonth, row.closeFlag)
    getList()
  } catch (error) {
    console.error(error)
  }
}

getList()
</script>