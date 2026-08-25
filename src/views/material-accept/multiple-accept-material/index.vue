<!-- 多次验收物资维护 -->
<template>
    <div class="app-container app-container-splitpanes">
        <el-pro-table :columns="columns" :page-size="queryParams.pageSize" :toolbar-config="toolbarConfig"
            :search-collapse-threshold="3" @action="onAction" :data="tableData" :total="total" @search="onSearch"
            table-id="multiple-accept-material" />
        <add-dialog ref="addDialog" @createSuccess="getList()" />
    </div>
</template>
<script setup name="multiple-accept-material">
import AddDialog from "./components/AddDialog"
import { paramConfigList, paramConfigDelete } from '@/api/materialAccept/acceptMaterial'
import { columns } from './tableJson'

const { proxy } = getCurrentInstance()

const tableData = ref([])
const loading = ref(false)
const total = ref(0)


const queryParams = ref({
    pageNum: 1,
    pageSize: 30
})
//按钮配置项
const toolbarConfig = {
    buttons: [
        {
            code: 'add',
            name: '新增',
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
        {
            code: 'delete',
            name: '删除',
            type: 'primary',
            showInTop: false,
            showInRow: true,
        },
    ]
}

/** 查询角色列表 */
const getList = async () => {
    loading.value = true
    paramConfigList(queryParams.value).then(({ data }) => {
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
// status 是否有效（1有效，0无效）
const onAction = ({ code, row }) => {
    const eventObj = {
        add: () => {
            proxy.$refs["addDialog"].show('create')
        },
        edit: () => {
            proxy.$refs["addDialog"].show('modify', row)
        },
        delete: () => {
            proxy.$modal.confirm('是否要删除数据？').then(() => {
                paramConfigDelete({ id: row.id }).then(({ message }) => {
                    proxy.$modal.msgSuccess(message)
                    getList()
                })
            })
        }
    }
    eventObj[code] && eventObj[code]()
}
onMounted(() => {
    getList()
})

</script>
<style lang="scss"></style>