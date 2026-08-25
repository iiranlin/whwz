<template>
  <div class="app-container app-container-splitpanes">
    <el-tabs v-model="activeName">
      <el-tab-pane v-for="item in activeList" :label="item.label" :name="item.name" :key="item.name">
        <purchase-order :menuId="item.menuId" :name="item.name" :columns="item.name === 'purchaseOrder'?columnsData:smOrderColumnsData"
          :toolbarConfig="item.name === 'purchaseOrder'?toolbarConfig:smOrderToolbarConfig" :idName="item.name === 'purchaseOrder'?'pdbId':'dtId'" :urlApi="urlApi"></purchase-order>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup name="delivery-confirmation">
import { columnsFun, toolbarConfig, smOrderToolbarConfig } from "./tableJson"
import purchaseOrder from "./components/purchaseOrder"
import { purchaseOrderList, purchaseOrderConfirm, purchaseOrderRevoke, purchaseOrderCheckSupplier } from '@/api/warehouse/purchaseOrder'
import { gtOrderList, gtOrderConfirm, gtOrderExport, gtOrderCheckSupplier } from '@/api/warehouse/gtOrder'

const { proxy } = getCurrentInstance()

const activeName = ref('purchaseOrder')

const activeList = ref([
  {label: '采购订单', name: 'purchaseOrder', menuId: proxy.$route.meta?.menuId+'purchaseOrder'},
  {label: '国铁商城妥投订单', name: 'gtOrder', menuId: proxy.$route.meta?.menuId+'gtOrder'},
])

const urlApi = ref({
  purchaseOrderList,
  purchaseOrderConfirm,
  purchaseOrderRevoke,
  gtOrderList,
  gtOrderConfirm,
  gtOrderExport,
  purchaseOrderCheckSupplier,
  gtOrderCheckSupplier
})

const columnsData = ref([])
const smOrderColumnsData = ref([])

async function init () {
  const {columns, smOrderColumns} = await columnsFun()
  columnsData.value = columns
  smOrderColumnsData.value = smOrderColumns
}
init()

</script>
<style lang="scss" scoped>
.ep-tabs{
  display: flex;
  height: 100%;
  :deep(.ep-tabs__content){
    flex: 1;
    .ep-tab-pane{
      height: 100%;
    }
  }
}
</style>