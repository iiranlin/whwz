<template>
  <ep-dialog class="dialog" title="分配物资" :close-on-click-modal="false" :append-to-body="true" v-model="visible" width="900px">
    <div class="sso-front-table-container app-container">
      <el-pro-table ref="proTableRef" action-width="80" :data="tableData" :columns="allocateMatlTableJson"
        :show-pagination="false" :search="false" :show-refresh="false" :show-setting="false"
        :table-alert-render="false" :toolbar-config="allocateMatlTableButtonJson" @action="onAction">
      </el-pro-table>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="visible = false" class="cancel-btn"><svg-icon icon-class="cancel" />&nbsp;关闭</el-button>
      </div>
    </template>
    <select-matl-dialog ref="selectMatlDialog" :dialogRow="dialogRow" @createSuccess="getWarehouseLocationMatlListAll"></select-matl-dialog>
  </ep-dialog>
</template>
<script setup>
import { allocateMatlTableJson, allocateMatlTableButtonJson } from "../tableJson"
import { warehouseLocationMatlListAll, warehouseLocationMatlDeleteBatch } from '@/api/warehouse/warehouseLocation'
import SelectMatlDialog from "./selectMatlDialog"

const { proxy } = getCurrentInstance()

const visible = ref(false)

const data = reactive({
  tableData: [],
  dialogRow: {}
})

const { tableData, dialogRow } = toRefs(data)

const emit = defineEmits(['allocateSuccess'])

const getWarehouseLocationMatlListAll = () => {
  proxy.$modal.loading()
  warehouseLocationMatlListAll({locationId: dialogRow.value.id}).then(({ data }) => {
    tableData.value = data
    emit('allocateSuccess')
  }).finally(() => {
    proxy.$modal.closeLoading()
  })
}

// 显示弹框
function show(row = {}) {
  visible.value = true
  dialogRow.value = row
  proxy.$nextTick(() => {
    getWarehouseLocationMatlListAll()
	})
}

const handleSelectMatl = () => {
  proxy.$refs.selectMatlDialog.show(dialogRow.value)
}

const onAction = (payload) => {
  const { code, row, selectedRows, files } = payload
  const eventObj = {
    selectMatl: () => {
      handleSelectMatl()
    },
    delete: () => {
      proxy.$modal.loading()
      warehouseLocationMatlDeleteBatch({ids: [row.id]}).then( ({message}) => {
        proxy.$modal.msgSuccess(message)
        getWarehouseLocationMatlListAll()
      }).finally( () => {
        proxy.$modal.closeLoading()
      })
    }
  }
  eventObj[code] && eventObj[code]()
}

defineExpose({
  show,
})
</script>
<style lang="scss" scoped>
.app-container{
  padding-top: 0;
}
.form-right{
  height: 50px;
}
</style>