<!-- 调整单维护  -->
<template>
    <div class="app-container app-container-splitpanes">
        <el-pro-table ref="proTableRef" :columns="columnsData" :page-size="queryParams.pageSize"
            :toolbar-config="toolbarConfig" :search-collapse-threshold="5" @action="onAction" :data="tableData"
            :total="total" @search="onSearch" table-id="adjustment-order" :show-checkbox="true"
            :grid-options="{ rowId: 'id' }" :default-search-form="defaultSearchForm" />
        <create-dialog ref="createDialog" @createSuccess="getList" />
        <print-dialog ref="printDialog" />
        <ApprovalDetail v-model="approvalVisible" :rowData="rowData" />
        <delete-dialog ref="deleteDialog" @deleteSuccess="getList" />
    </div>
</template>
<script setup name="adjustment-order">
import {
    rmstorInternalList, rmstorInternalSubmit, rmsverifyButtonStatus, plantDictList, warehouseDict, warehouseplantDictList,
    rmstorInternaltoCard, rmstorInternalwithDrawCard,
} from '@/api/rmstor/adjustment-order'
import CreateDialog from "./components/createDialog"
import PrintDialog from "./components/PrintDialog"
import ApprovalDetail from './components/approvalDetail.vue'
import DeleteDialog from "./components/deleteDialog"

const { proxy } = getCurrentInstance()
import { getCookie } from '@/utils/auth'
const warehouseGetYear = getCookie('warehouseGetYear') && JSON.parse(getCookie('warehouseGetYear'))

import { columns } from './tableJson'
const columnsData = ref([])

const proTableRef = shallowRef(null)
const tableData = ref([])
const loading = ref(false)
const total = ref(0)

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
    flag: '0',
    orderDate: initDate()
};

const queryParams = ref({
    pageNum: 1,
    pageSize: 30,
    flag: defaultSearchForm.flag,
    orderDate: defaultSearchForm.orderDate
})
/** 查询列表 */
function getList() {
    loading.value = true
    const paramsObj = proxy.addDateRange(queryParams.value, queryParams.value.orderDate, 'orderDate')
    delete queryParams.value.orderDate
    rmstorInternalList(paramsObj).then(({ data }) => {
        tableData.value = data.list || []
        total.value = data.total
    }).finally(() => {
        loading.value = false
    })
}
const onSearch = (params, pageConfig) => {
    const form = proTableRef.value?.getSearchForm?.()
    const paramsObj = proxy.addDateRange({ ...params, ...pageConfig }, form.orderDate, 'orderDate')
    queryParams.value = paramsObj
    getList()
}
const toolbarConfig = {
    buttons: [
        {
            code: 'create',
            name: '新增',
            type: 'primary',
            showInTop: true,
            disabled: (row) => {
                if (isCloseFlag.value === '1') {
                    return true
                } else {
                    return false
                }
            }
        },
        // 无工作流：隐藏"审批详情"入口（$flow 流程轨迹），将来接入工作流放开
        // {
        //     code: 'detail',
        //     name: '审批详情',
        //     type: 'primary',
        //     showInTop: false,
        //     showInRow: true,
        // },
        {
            code: 'modify',
            name: '修改',
            type: 'primary',
            showInTop: false,
            showInRow: true,
            disabled: (row) => {
                if (isCloseFlag.value === '0' && row[0].flag !== '0') {
                    return true
                } else {
                    return false
                }
            }
        },
        {
            code: 'delete',
            name: '删除',
            type: 'primary',
            showInTop: true,
            disabled: (row) => {
                if (isCloseFlag.value === '1') {
                    return true
                } else {
                    return false
                }
            }
        },
        {
            code: 'report',
            name: '报批',
            type: 'primary',
            showInTop: true,
            disabled: (row) => {
                if (isCloseFlag.value === '1') {
                    return true
                } else {
                    return false
                }
            }
        },
        {
            code: 'publish',
            name: '登卡',
            type: 'primary',
            showInTop: true,
            disabled: (row) => {
                if (isCloseFlag.value === '1' || isStopnoteFlag.value === '1') {
                    return true
                } else {
                    return false
                }
            }
        },
        {
            code: 'cancelPublish',
            name: '撤销登卡',
            type: 'primary',
            showInTop: true,
            disabled: (row) => {
                if (isCloseFlag.value === '1') {
                    return true
                } else {
                    return false
                }
            }
        },
        {
            code: 'print',
            name: '打印',
            type: 'primary',
            showInTop: true,
        },

    ]
}
const onAction = ({ code, row, selectedRows }) => {
    const eventObj = {
        create: () => {
            proxy.$refs.createDialog.show()
        },
        //审批详情（无工作流：隐藏，$flow 流程轨迹，将来接入工作流放开）
        // detail: () => {
        //     proxy.$flow({ bid: row.id })
        // },
        // 修改
        modify: () => {
            proxy.$refs.createDialog.show('modify', row)
        },
        // 删除
        delete: () => {
            handleDelete(row, selectedRows)
        },
        //报批
        report: () => {
            reportClick(row, selectedRows)
        },
        // 登卡
        publish: () => {
            publishClick(row, selectedRows)
        },
        //撤销登卡
        cancelPublish: () => {
            cancelPublishClick(row, selectedRows)
        },
        // 打印
        print: () => {
            handlePrint(row, selectedRows)
        },
        //详情
        link: () => {
            proxy.$refs.createDialog.show('details', row)
        }
    }
    eventObj[code] && eventObj[code]()
}


const handlePrint = (row, selectedRows) => {
    if (!selectedRows.length) {
        proxy.$modal.msgWarning('请选择数据')
        return false
    }
    proxy.$refs.printDialog.show(selectedRows?.map(item => item.id))
}
const rowData = ref({})
const approvalVisible = ref(false)

const reportClick = (row, selectedRows) => {
    if (selectedRows.length === 0) {
        proxy.$modal.msgWarning('请选择至少一条数据')
        return
    }
    const releaseId = selectionData.value.filter(item => item.flag === '0').map(items => items.id)
    if (releaseId.length === 0) {
        proxy.$modal.msgWarning('请选择未提交的数据进行操作！')
        return
    }
    proxy.$modal.confirm('您确定要报批所选订单吗？').then(() => {
        // 无工作流：直接报批，不走"选审批人"弹窗（$reviewerDialog），不再传 auditUserId
        // proxy.$reviewerDialog({
        //     billType: 'TZD',
        //     billIdList: selectedRows?.map(item => item.id),
        //     multiple: true,
        //     success: ({ auditUserId }) => {
        rmstorInternalSubmit({ idList: releaseId }).then(({ message }) => {
            proxy.$modal.msgSuccess(message)
            getList()
        })
        //     }
        // })
    })
}
const publishClick = async (row, selectedRows) => {
    if (selectedRows.length === 0) {
        proxy.$modal.msgWarning('请选择至少一条数据')
        return
    }
    rmstorInternaltoCard({ ids: selectedRows?.map(item => item.id) }).then(({ message }) => {
        proxy.$modal.msgSuccess(message)
        getList()
    })
}
const cancelPublishClick = (row, selectedRows) => {
    if (selectedRows.length === 0) {
        proxy.$modal.msgWarning('请选择至少一条数据')
        return
    }
    rmstorInternalwithDrawCard(selectedRows?.map(item => item.id)).then(({ message }) => {
        proxy.$modal.msgSuccess(message)
        getList()
    })
}
const handleDelete = (row, selectedRows) => {
    if (selectedRows.length === 0) {
        proxy.$modal.msgWarning('请选择至少一条数据')
        return
    }
    const isFlag = selectedRows.some(a => a.flag !== '0')
    if (isFlag) {
        proxy.$modal.msgWarning('请选择未提交的数据')
        return
    }
    proxy.$refs.deleteDialog.show(selectedRows?.map(item => item.id))
}
const isCloseFlag = ref('0')
const isStopnoteFlag = ref('0')
//按钮权限
const getbtnShow = async () => {
    const { data } = await rmsverifyButtonStatus({
        unitCode: getCookie('unitCode'),
        yearMonth: warehouseGetYear?.yearMonth
    })
    isCloseFlag.value = data.closeFlag
    isStopnoteFlag.value = data.stopnoteFlag
}

const init = async () => {
    columnsData.value = await columns()
}
onMounted(async () => {
    init()
    getbtnShow()
    getList()
})

</script>
<style lang="scss"></style>