<template>
    <ep-dialog class="ep-dialog-list" :title="title" iconTitle="form" v-model="historyVisible" width="70vw" top="5vh"
        append-to-body :close-on-press-escape="false" :close-on-click-model="false">
        <div class="sso-front-table-container app-container">
            <el-pro-table ref="proTableRef" :columns="historyColumns" :show-pagination="false" action-width="120"
                :toolbar-config="toolbarConfig" :search-collapse-threshold="5" @action="onAction" :data="tableData"
                :total="total" @search="getList" table-id="inspection-record" :show-checkbox="false"
                :grid-options="{ rowId: 'acId' }" />
        </div>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="historyVisible = false" class="cancel-btn"><svg-icon
                        icon-class="cancel" />&nbsp;关闭</el-button>
            </div>
        </template>
    </ep-dialog>
    <file-detail v-model="fileVisible" :row-data="rowData" />
</template>
<script setup>
import { getAcceptanceHistory } from '@/api/materialAccept/inspectionRecord'
import FileDetail from './FileDetail.vue'
import { historyColumns } from '../tableJson'
const props = defineProps({
    rowData: {
        type: Object,
        default: () => { }
    }
})
const historyVisible = defineModel({ default: false })
const title = ref('验收历史')
const emit = defineEmits(['createSuccess']);
watch(historyVisible, (newVal) => {
    if (newVal) {
        getList()
    }
})
const tableData = ref([])
const loading = ref(false)
const total = ref(0)
//按钮配置项
const toolbarConfig = {
    buttons: [
        {
            code: 'detail',
            name: '查看',
            type: 'primary',
            showInTop: false,
            showInRow: true,
        },
    ]
}
const getList = async () => {
    loading.value = true
    getAcceptanceHistory(props.rowData.pdbId).then(({ data }) => {
        tableData.value = data || []
        total.value = data.total
    }).finally(() => {
        loading.value = false
    })
}
const fileVisible = ref(false)
const rowData = ref({})
const onAction = ({ code, row, selectedRows }) => {
    const eventObj = {
        detail: () => {
            fileVisible.value = true
            rowData.value = row
        },
    }
    eventObj[code] && eventObj[code]()
}
</script>
<style lang="scss" scoped>
:deep(.ep-pro-table__toolbar) {
    display: none;
}
</style>