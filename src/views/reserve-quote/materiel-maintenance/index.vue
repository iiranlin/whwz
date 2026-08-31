<!-- 物资高低储维护  -->
<template>
    <div class="app-container app-container-splitpanes">
    <el-row :gutter="20" class="app-container-row integrated-manage-pane-form integrated-manage-pane-form-a">
      <el-col class="app-container-col">
        <el-pro-table ref="proTableRef" :columns="columnsData" :page-size="queryParams.pageSize" 
            :toolbar-config="toolbarConfig" :search-collapse-threshold="5" @action="onAction" :data="tableData"
            :total="total" @search="onSearch"  table-id="materiel-maintenance" :show-checkbox="true"
            :grid-options="{ rowId: 'hrId' }" />
            </el-col>
        </el-row>
        <add-dialog v-model="visible" :rowData="rowData" @createSuccess="createSuccess" />
    </div>
</template>

<script setup name="materiel-maintenance">
import AddDialog from "./components/AddDialog"
import {
    normListPage, normListDeleteBatch,
    normListExport, normListDownloadTemplate, plantDictList, warehouseDict, normListImport
} from '@/api/reserve-quote/materiel-maintenance'

import { columns } from './tableJson'
const columnsData = ref([])
const { proxy } = getCurrentInstance()
const tableData = ref([])
const loading = ref(false)
const total = ref(0)


const queryParams = ref({
    pageNum: 1,
    pageSize: 30
})

const proTableRef = shallowRef(null)

const toolbarConfig = {
    buttons: [
        {
            code: 'add',
            name: '新增',
            type: 'primary',
            showInTop: true,

        },
        {
            code: 'delete',
            name: '删除',
            type: 'primary',
            showInTop: true,
            showInRow: false,
        },
        {
            code: 'publish',
            name: '下载模板',
            type: 'primary',
            showInTop: true,

        },
        {
            code: 'cancelPublish',
            name: '模板导入',
            type: 'primary',
            upload: { multiple: false },
            showInTop: true,
            showInRow: false,
        },
        {
            code: 'export',
            name: '导出',
            type: 'primary',
            showInTop: true,

        },
        {
            code: 'edit',
            name: '编辑',
            type: 'primary',
            showInTop: false,
            showInRow: true,
        },
    ]
}
const visible = ref(false)
const rowData = ref({})

const onAction = ({ code, row, selectedRows }) => {
    const eventObj = {
        add: () => {
            visible.value = true
            rowData.value = Object.assign({})
        },
        delete: () => {
            if (selectedRows.length === 0) {
                proxy.$modal.msgWarning('请选择至少一条数据')
                return
            }
            proxy.$modal.confirm('是否要删除数据？').then(() => {
                normListDeleteBatch({ ids: selectedRows?.map(item => item.hrId) }).then(({ message }) => {
                    proxy.$modal.msgSuccess(message)
                    getList()
                })
            })
        },
        publish: () => {
            proxy.$download.name(normListDownloadTemplate)
        },
        cancelPublish: async () => {
            const formData = new FormData()
            formData.append('file', options.file)
            const { code, message } = await normListImport(formData)
            if (code === 0) {
                proxy.$modal.msgSuccess(message)
            }
            getList()
        },
        edit: () => {
            visible.value = true
            rowData.value = row
        },
        export: () => {
            const form = proTableRef.value?.getSearchForm?.()
            const params = proxy.addDateRange(Object.assign({}, form, { mtId: selectedRows.map(item => item.hrId)?.join(',') }))
            proxy.$download.name(normListExport, params)
        },
    }
    eventObj[code] && eventObj[code]()
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
const createSuccess = () => {
    getList()
}
const init = async () => {
    columnsData.value = await columns()
}
onMounted(() => {
    init()
    getList()
})

</script>
<style lang="scss" scoped></style>