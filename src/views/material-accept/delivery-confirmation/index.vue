<template>
  <div class="app-container app-container-splitpanes">
    <purchase-order
      :menuId="menuId"
      name="purchaseOrder"
      :columns="columnsData"
      :toolbarConfig="toolbarConfig"
      idName="pdbId"
      :urlApi="urlApi"
    />
  </div>
</template>

<script setup name="delivery-confirmation">
import { columnsFun, toolbarConfig } from "./tableJson"
import purchaseOrder from "./components/purchaseOrder"
import { purchaseOrderList, purchaseOrderConfirm, purchaseOrderRevoke, purchaseOrderCheckSupplier } from '@/api/warehouse/purchaseOrder'

const { proxy } = getCurrentInstance()

const menuId = proxy.$route.meta?.menuId + 'purchaseOrder'

const urlApi = ref({
  purchaseOrderList,
  purchaseOrderConfirm,
  purchaseOrderRevoke,
  purchaseOrderCheckSupplier
})

const columnsData = ref([])

async function init () {
  const { columns } = await columnsFun()
  columnsData.value = columns
}
init()

</script>
<style lang="scss" scoped>
</style>