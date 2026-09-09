<!-- 出库单维护  -->
<template>
    <div class="app-container app-container-splitpanes">
        <el-row :gutter="20" class="app-container-row integrated-manage-pane-form integrated-manage-pane-form-a">
            <el-col class="app-container-col">
        <el-pro-table ref="proTableRef" :columns="columnsData" :page-size="queryParams.pageSize" :max-visible-buttons="99"
            :toolbar-config="toolbarConfig" :search-collapse-threshold="5" @action="onAction" :data="tableData"
            :total="total" @search="onSearch" table-id="outbound-maintenance" :show-checkbox="true" action-width="120"
            :grid-options="{ rowId: 'obmtId' }" :default-search-form="defaultSearchForm" />
            </el-col>
        </el-row>
        <create-dialog ref="createDialog" @createSuccess="getList" />
        <delete-dialog ref="deleteDialog" @deleteSuccess="getList" />
        <print-dialog ref="printDialog" />
    </div>
</template>

<script setup name="outbound-maintenance">
import { getLocalStorage, getCookie, getSessionStorage } from '@/utils/auth'
import {
    rmstorInternalList, rmsverifyButtonStatus, plantDictList, warehouseDict, warehouseplantDictList,
    rmstorInternaltoCard, rmstorInternalwithDrawCard, rmstorInternalExport,
} from '@/api/rmstor/outbound-maintenance'
import CreateDialog from "./components/createDialog"
import PrintDialog from "./components/PrintDialog"
import DeleteDialog from "./components/deleteDialog"

const byCodeObj = ref(JSON.parse(getSessionStorage('byCodeObj') || '{}')) //权限判断是否显示登卡按钮（1：隐藏）

const { proxy } = getCurrentInstance()

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
    orderDate: initDate()
};

const queryParams = ref({
    pageNum: 1,
    pageSize: 30,
    orderDate: defaultSearchForm.orderDate
})
// const handleButtonShow = (code) => {
//     if (['publish', 'cancelPublish'].includes(code) && byCodeObj.value['45'] === '1') {
//         return false
//     }
//     return true
// }
// const handleButtonDisable = (code, row) => {
//     if (code === 'report' && ['0'].includes(row.flag)) {
//         return false
//     }
//     if (isCloseFlag.value === '1') {
//         if (['print'].includes(code) || ['export'].includes(code)) {
//             return true
//         }
//         return false
//     }
//     if (isStopnoteFlag.value === '1') {
//         if (['publish'].includes(code)) {
//             return false
//         }
//     }
//     return true
// }

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
        {
            code: 'modify',
            name: '修改',
            type: 'primary',
            showInTop: false,
            showInRow: true,
            disabled: (row) => {
                if (row[0].flag === '2') {
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
            name: '红冲',
            type: 'primary',
            showInTop: false,
            showInRow: true,
            disabled: (row) => {
                if (row[0].flag === '0' || isCloseFlag.value === '1') {
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
                if (isCloseFlag.value === '1' ||
                    isStopnoteFlag.value === '1' ||
                    byCodeObj.value['45'] === '1'
                ) {
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
                if (isCloseFlag.value === '1' || byCodeObj.value['45'] === '1') {
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
        {
            code: 'export',
            name: '导出',
            type: 'primary',
            showInTop: true,
        },
    ]
}
const onAction = ({ code, row, selectedRows }) => {
    const eventObj = {
        // 新增
        create: () => {
            proxy.$refs.createDialog.show()
        },
        //审批详情
        detail: () => {

        },
        // 修改
        modify: () => {
            proxy.$refs.createDialog.show('modify', row)
        },
        // 删除
        delete: () => {
            handleDelete(row, selectedRows)
        },
        //红冲
        report: () => {
            proxy.$refs.createDialog.show('report', row)
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
        // 导出
        export: (row, selectedRows) => {
            const form = proTableRef.value?.getSearchForm?.()
            const params = proxy.addDateRange(Object.assign({}, form, { obmtId: selectedRows.map(item => item.obmtId)?.join(',') }))
            proxy.$download.name(rmstorInternalExport, params)
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
    proxy.$refs.printDialog.show(selectedRows?.map(item => item.obmtId))
}
const publishClick = async (row, selectedRows) => {
    if (selectedRows.length === 0) {
        proxy.$modal.msgWarning('请选择至少一条数据')
        return
    }
    rmstorInternaltoCard({ obmtIds: selectedRows?.map(item => item.obmtId) }).then(({ message }) => {
        proxy.$modal.msgSuccess(message)
        getList()
    })
}
const cancelPublishClick = (row, selectedRows) => {
    if (selectedRows.length === 0) {
        proxy.$modal.msgWarning('请选择至少一条数据')
        return
    }
    rmstorInternalwithDrawCard({ obmtIds: selectedRows?.map(item => item.obmtId) }).then(({ message }) => {
        proxy.$modal.msgSuccess(message)
        getList()
    })
}
const handleDelete = (row, selectedRows) => {
    if (selectedRows.length === 0) {
        proxy.$modal.msgWarning('请选择至少一条数据')
        return
    }
    proxy.$refs.deleteDialog.show(selectedRows?.map(item => item.obmtId))
}

/**
 * closeFlag 0 未封账本  1 已封账
 * stopnoteFlag 0 未禁止  1 已禁止
 * 
 */
const isCloseFlag = ref('0')
const isStopnoteFlag = ref('0')
//按钮权限
const getbtnShow = async () => {
    const { data } = await rmsverifyButtonStatus({
        unitCode: getCookie('unitCode'),
    })
    isCloseFlag.value = data.closeFlag
    isStopnoteFlag.value = data.stopnoteFlag
}
const init = async () => {
    columnsData.value = await columns()
}
onMounted(() => {
    init()
    getbtnShow()
    getList()
})

</script>
<style lang="scss"></style>