<template>
    <ep-dialog class="ep-dialog-list" :title="title" iconTitle="form" v-model="fileVisible" width="70vw" top="5vh"
        append-to-body :close-on-press-escape="false" :close-on-click-model="false">
        <div class="sso-front-table-container app-container">
            <el-pro-table ref="proTableRef" :columns="fileDetailColumns" :show-pagination="false" action-width="120"
                :toolbar-config="toolbarConfig" :search-collapse-threshold="5" @action="onAction" :data="tableData"
                :total="total" @search="getList" table-id="inspection-record" :show-checkbox="false"
                :grid-options="{ rowId: 'acId' }" />
        </div>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="fileVisible = false" class="cancel-btn"><svg-icon
                        icon-class="cancel" />&nbsp;关闭</el-button>
            </div>
        </template>
    </ep-dialog>
    <PreviewAttachment ref="previewAttachment"></PreviewAttachment>
</template>
<script setup>
import { getAcceptanceFiles, downloadFile } from '@/api/materialAccept/inspectionRecord'
import { fileDetailColumns, } from "../tableJson"
import PreviewAttachment from '@/components/PreviewAttachment'
const { proxy } = getCurrentInstance()
const props = defineProps({
    rowData: {
        type: Object,
        default: () => { }
    }
})
const fileVisible = defineModel({ default: false })
const title = ref('附件详情')
const emit = defineEmits(['createSuccess']);
watch(fileVisible, (newVal) => {
    if (newVal) {
        getList()
    }
})
const tableData = ref([])
const loading = ref(false)
const total = ref(0)
const toolbarConfig = {
    buttons: [
        {
            code: 'modify',
            name: '下载',
            type: 'primary',
            showInTop: false,
            showInRow: true,
        },
    ]
}
const getList = async () => {
    loading.value = true
    getAcceptanceFiles(props.rowData.pdbId).then(({ data }) => {
        tableData.value = data || []
    }).finally(() => {
        loading.value = false
    })
}
const onAction = ({ code, row, selectedRows }) => {
    const eventObj = {
        modify: () => {
            const params = proxy.addDateRange(Object.assign({}, { fileName: row.fileFormerName }))
            proxy.$download.name(downloadFile, params)
        },
        link: async () => {
            const url = await proxy.$download.preview(downloadFile, { fileName: row.fileFormerName })
            const type = row.fileName.substring(row.fileName.lastIndexOf('.') + 1)
            proxy.$refs.previewAttachment.show(url, type)
        }
    }
    eventObj[code] && eventObj[code]()
}

</script>
<style lang="scss" scoped>
:deep(.ep-pro-table__toolbar) {
    display: none;
}
</style>