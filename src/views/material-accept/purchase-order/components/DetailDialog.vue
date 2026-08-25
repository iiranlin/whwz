<template>
    <ep-dialog class="ep-dialog-list" :title="title" iconTitle="form" v-model="playBatchVisible" width="70vw" top="5vh"
        append-to-body :close-on-press-escape="false" :close-on-click-model="false">
        <div class="sso-front-table-container app-container">
            <el-pro-table ref="proTableRef" :columns="acceptanceColumns"  :toolbar-config="toolbarConfig"
                :search-collapse-threshold="5" @action="onAction" :data="tableData" :total="total" @search="getList"
                table-id="purchase-order" :show-checkbox="false" :grid-options="{ rowId: 'pddId' }" />
        </div>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="playBatchVisible = false" class="cancel-btn"><svg-icon
                        icon-class="cancel" />&nbsp;关闭</el-button>
            </div>
        </template>
    </ep-dialog>
    <HistoryDialog v-model="historyVisible" :rowData="rowData" />
</template>

<script setup>
import { getAcceptanceHistory } from '@/api/materialAccept/purchaseOrder'
import { acceptanceColumns } from "../tableJson"
import HistoryDialog from '../../inspection-record/components/DetailDialog.vue'
const { proxy } = getCurrentInstance()
const props = defineProps({
    rowData: {
        type: Object,
        default: () => { }
    }
})
const playBatchVisible = defineModel({ default: false })
const title = ref('发货批次详情')
const emit = defineEmits(['createSuccess']);
watch(playBatchVisible, (newVal) => {
    if (newVal) {
        getList()
    }
})
const tableData = ref([])
const loading = ref(false)
const total = ref(0)
const getList = async () => {
    loading.value = true
    getAcceptanceHistory(props.rowData.pddId).then(({ data }) => {
        tableData.value = data || []
        total.value = data.total
    }).finally(() => {
        loading.value = false
    })
}
//按钮配置项
const toolbarConfig = {
    buttons: [
        {
            code: 'detail',
            name: '验收历史',
            type: 'primary',
            showInTop: false,
            showInRow: true,
        },
    ]
}
const historyVisible = ref(false)
const rowData = ref({})
const onAction = ({ code, row, selectedRows }) => {
    const eventObj = {
        detail: () => {
            historyVisible.value = true
            rowData.value = row
        },
    }
    eventObj[code] && eventObj[code]()
}

</script>
<style lang="scss" scoped></style>