<!-- 库存管理录入 -->
<template>
    <div class="app-container app-container-splitpanes">
        <el-pro-table ref="proTableRef" :columns="columns" :page-size="queryParams.pageSize" 
            :toolbar-config="toolbarConfig" :search-collapse-threshold="5" @action="onAction" :data="tableData"
            :total="total" @search="onSearch"  table-id="stock-entry" :show-checkbox="true"
            :grid-options="{ rowId: 'id' }" />
        <add-dialog v-model="visible" :rowType="rowType" :rowData="rowData" @createSuccess="getList" />
    </div>
</template>
<script setup name="stock-entry">
import AddDialog from "./components/AddDialog"
import { normListPage, normListPublish, } from '@/api/reserve-quote/stock-entry'

import { columns } from './tableJson'

const { proxy } = getCurrentInstance()
const tableData = ref([])
const loading = ref(false)
const total = ref(0)

const queryParams = ref({
    pageNum: 1,
    pageSize: 30
})


const toolbarConfig = {
    buttons: [
        {
            code: 'add',
            name: '新增',
            type: 'primary',
            showInTop: true,
        },
        {
            code: 'publish',
            name: '发布',
            type: 'primary',
            showInTop: true,
        },
        {
            code: 'edit',
            name: '编辑',
            type: 'primary',
            showInRow: true,
            showInTop: false,
            disabled: (row) => {
                if (row[0].flag === '0') {
                    return false
                } else {
                    return true
                }
            }
        },
        {
            code: 'change',
            name: '变更',
            type: 'primary',
            showInRow: true,
            showInTop: false,
            disabled: (row) => {
                if (row[0].flag === '0') {
                    return true
                } else {
                    return false
                }
            }
        },
        {
            code: 'detail',
            name: '详情',
            type: 'primary',
            showInRow: true,
            showInTop: false,
        },
    ]
}

/** 查询角色列表 */
const getList = async () => {
    loading.value = true
    normListPage(queryParams.value).then(({ data }) => {
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
const visible = ref(false)
const rowData = ref({})
const rowType = ref('')

const dialog_config = {
    add: { type: 'add', data: {} },
    edit: { type: 'edit' },
    detail: { type: 'detail' },
    change: { type: 'change' },
}
const handleFunction = (type, row) => {
    const cfg = dialog_config[type]
    if (!cfg) return
    rowType.value = cfg.type
    console.log(rowType.value)
    rowData.value = cfg.data ?? row
    visible.value = true
}

const onAction = ({ code, row, selectedRows }) => {
    const eventObj = {
        add: () => {
            handleFunction('add', {})
        },
        publish: () => {
            if (selectedRows.length === 0) {
                proxy.$modal.msgWarning('请选择至少一条数据')
                return
            }
            const releaseId = selectedRows.filter(item => item.flag === '0').map(items => items.id)
            if (releaseId.length === 0) {
                proxy.$modal.msgWarning('请选择未发布的数据进行操作！')
                return
            }
            normListPublish({ id: releaseId.join(',') }).then(({ message }) => {
                proxy.$modal.msgSuccess(message)
                getList()
            })
        },
        edit: () => {
            handleFunction('edit', row)
        },
        change: () => {
            handleFunction('change', row)
        },
        detail: () => {
            handleFunction('detail', row)
        },
    }
    eventObj[code] && eventObj[code]()
}
onMounted(() => {
    getList()
})

</script>
<style lang="scss" scoped></style>