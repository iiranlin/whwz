<!-- 退料单综合查询 -->
<template>
    <div class="app-container app-container-splitpanes">
        <el-pro-table ref="proTableRef" v-loading="loading" :columns="columnsData" :data="tableData"
            :params="queryParams" :toolbar-config="toolbarConfig" :page-size="queryParams.pageSize" :total="totalRow"
            :footer-config="footerConfig" :sort-remote="false" :show-checkbox="true"
            :default-search-form="defaultSearchForm" :editable="false" :show-action="false" row-key="transfer-order"
            :table-alert-render="false" border @search="onSearch" @action="onAction"
            :grid-options="{ rowId: 'mtId', rowStyle: handleRowStyle }">
        </el-pro-table>
        <add-dialog ref="addDialog" @createSuccess="getList" />
    </div>
</template>
<script setup>
import { comprehensiveList, comprehensiveExport, comprehensivestatList } from '@/api/query/integrated-query'
import AddDialog from "@/views/rmstor/material-manage/material-maintain/components/AddDialogQuery"
import { getCookie } from '@/utils/auth'
import { columns, toolbarConfig } from "./tableJson"
const { proxy } = getCurrentInstance()
const proTableRef = shallowRef(null)
const tableData = ref([])
const queryParams = ref({
    pageNum: 1,
    pageSize: 30,

})
const loading = ref(false)
const columnsData = ref([])
const totalRow = ref(0)
const summaryData = ref()

/** footerConfig：开启原生 footer，method 返回占位空数组 */
const footerConfig = computed(() => ({
    enabled: true,
    method: () => Array(columnsData.value.length || 1).fill('')
}))

/** 将 footer 行所有 td 合并成一个 colspan=可见列数 的 td，展示 summaryData */
function applySummaryFooter() {
    nextTick(() => {
        const proTableEl = proTableRef.value?.$el
        if (!proTableEl || !summaryData.value?.length) return
        const footerRow = proTableEl.querySelector('.ep-table__footer tr, .el-table__footer tr')
        if (!footerRow) return
        const visibleCols = columnsData.value.filter(c => !c.hideInTable).length
        const colSpan = visibleCols || footerRow.children.length
        footerRow.innerHTML = ''
        const td = document.createElement('td')
        td.colSpan = colSpan
        td.className = 'summary-footer-cell'
        td.innerHTML = summaryData.value
            .map(s => `<span class="sf-item"><span class="sf-label">${s.label}</span><span class="sf-value">${s.value}</span></span>`)
            .join('')
        footerRow.appendChild(td)
    })
}
const initDate = () => {
    const date = new Date(getCookie("warehouseYearMonth"));
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const formatDate = (date) => {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, "0");
        const d = String(date.getDate()).padStart(2, "0");
        return `${y}-${m}-${d}`;
    }
    return [formatDate(firstDay), formatDate(lastDay)]
}
const defaultSearchForm = {
    orderDate: initDate()
};
const onAction = ({ code, row, selectedRows }) => {
    const eventObj = {
        //详情
        link: () => {
            proxy.$refs.addDialog.show('details', row)
        },
        export: (row, selectedRows) => {
            const form = proTableRef.value?.getSearchForm?.()
            const paramsObj = proxy.addDateRange(queryParams.value, form.orderDate, 'orderDate')
            delete queryParams.value.orderDate
            proxy.$download.name(comprehensiveExport, paramsObj)
        },
    }
    eventObj[code] && eventObj[code]()
}

const getList = async () => {
    loading.value = true
    try {
        const form = proTableRef.value?.getSearchForm?.()
        const paramsObj = proxy.addDateRange(queryParams.value, form.orderDate, 'orderDate')
        delete queryParams.value.orderDate
        const { data, total } = await comprehensiveList(paramsObj)
        loading.value = false
        tableData.value = data.list
        totalRow.value = total
        comprehensivestatList(paramsObj).then(({ data }) => {
            summaryData.value = [
                { label: '数量：', value: data?.totalAmount || 0 },
                { label: '金额：', value: data?.totalNum || 0 },
            ]
        })
    } catch (error) {
        loading.value = false
    }
}
const onSearch = (params, pageConfig) => {
    const form = proTableRef.value?.getSearchForm?.()
    const paramsObj = proxy.addDateRange({ ...params, ...pageConfig }, form?.orderDate, 'orderDate')
    queryParams.value = paramsObj
    getList()
}
const handleRowStyle = ({ row }) => {
    // if (row.backFlag == "1") {
    //     return { color: "red" }
    // }
    // return {}
}

onMounted(async () => {
    columnsData.value = await columns()
    await nextTick()   // 等 ProTable 的 watch flush 完 initSearchItems，searchForm 才会被赋 defaultSearchForm 默认值
    getList()
})

// summaryData 变化时重新合并 footer 行
watch(summaryData, () => { applySummaryFooter() }, { deep: true })
</script>
<style lang="scss" scoped>
/* footer 合并行样式 */
:deep(.ep-table__footer td.summary-footer-cell) {
  background: #f5f7fa !important;
  padding: 12px 16px !important;
  border-radius: 4px;
}
:deep(.ep-table__footer .sf-item){
  display: inline-flex;
  align-items: baseline;
  gap: 8px;
  padding-right: 24px;
  margin-right: 24px;
  border-right: 1px solid #e2e2e2;

}
:deep(.ep-table__footer .sf-item:last-child) {
  border-right: none;
}
:deep(.ep-table__footer .sf-label) {
  color: #909399;
  font-size: 13px;
}
:deep(.ep-table__footer .sf-value){
  color: #1A191A;
  font-weight: 600;
  font-size: 16px;
}
</style>
