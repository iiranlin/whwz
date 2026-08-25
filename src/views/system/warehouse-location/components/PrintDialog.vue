<template>
  <ep-dialog title="打印" v-model="visible" width="800px" top="5vh" append-to-body>
		<el-scrollbar>
      <div class="dialog-printMe" id="printMe">
        <div v-for="item in dataList" :key="item.id" class="inventory-tag-container article__heading__table">
          <table cellpadding="10" cellspacing="0" width="100%">
            <tbody>
              <tr>
                <td :colspan="2" style="width: 20%;">{{ item.partitionName }}</td>
                <td style="width: 5%;">{{ item.frameName }}</td>
                <td style="width: 10%;">{{ item.frame }}</td>
                <td style="width: 5%;">层</td>
                <td style="width: 10%;">{{ item.layer }}</td>
                <td style="width: 5%;">位</td>
                <td style="width: 10%;">{{ item.position }}</td>
              </tr>
              <tr>
                <td style="width: 10%;">编号</td>
                <td :colspan="5">{{ item.matlCode }}</td>
                <td :colspan="3" :rowspan="5">
                  <qr-code-component :text="item.id || ''" :size="170" />
                </td>
              </tr>
              <tr>
                <td>名称</td>
                <td :colspan="5">{{ item.matlName }}</td>
              </tr>
              <tr>
                <td>规格</td>
                <td :colspan="5">{{ item.matlType }}</td>
              </tr>
              <tr>
                <td>单位</td>
                <td :colspan="2">{{ item.matlUnit }}</td>
                <td>材质</td>
                <td :colspan="2">{{ item.matlRaw }}</td>
              </tr>
              <tr>
                <td>最高</td>
                <td :colspan="2"></td>
                <td>最低</td>
                <td :colspan="2"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
		</el-scrollbar>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="visible = false" class="cancel-btn"><svg-icon icon-class="cancel" />&nbsp;关闭</el-button>
        <el-button type="primary" class="determine-btn" v-print="printSetting"><svg-icon icon-class="determine" />打印</el-button>
      </div>
    </template>
  </ep-dialog>
</template>

<script setup>
import QrCodeComponent from '@/components/QrCodeComponent'
import { warehouseLocationMatlListWithLocation } from '@/api/warehouse/warehouseLocation'

const { proxy } = getCurrentInstance()

const visible = ref(false)
const dataList = ref([])
const printSetting = ref({
  id: 'printMe',
  beforeOpenCallback (vue) {
    vue.pringLoading = true
  },
  openCallback (vue) {

  },
  closeCallback (vue) {
    vue.pringLoading = false
  }
})

const getWarehouseLocationMatlListWithLocation = (params) => {
  proxy.$modal.loading()
  warehouseLocationMatlListWithLocation(params).then(({ data }) => {
    dataList.value = data || []
  }).finally(() => {
    proxy.$modal.closeLoading()
  })
}

// 显示弹框
function show(locationIds) {
  visible.value = true
  getWarehouseLocationMatlListWithLocation({locationIds})
}

defineExpose({
  show,
})
</script>
<style lang="scss" scoped>
.dialog-printMe{
  width: 100%;
  height: 500px;
  .inventory-tag-container{
    width: 80%;
    max-width: 800px;
    margin: 0 auto;
    padding-top: 20px;
  }
  .article__heading__table {
    table {
      border-top: 1px solid #000;
      border-left: 1px solid #000;

      .td {
        width: 14%;
      }

      th,
      td {
        border-right: 1px solid #000;
        border-bottom: 1px solid #000;
        color: #000;
        text-align: center;
      }
    }
  }
}
</style>