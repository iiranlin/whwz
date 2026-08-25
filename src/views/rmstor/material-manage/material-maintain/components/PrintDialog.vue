<template>
  <ep-dialog
    class="ep-dialog-list"
    title="打印"
    v-model="visible"
    width="80vw"
    top="5vh"
    append-to-body
  >
    <div class="dialog-printMe" id="printMe">
      <div v-for="item in tableData" :key="item.id" class="content-weapper">
        <h1 class="printMe-h1">退料单</h1>
        <div class="content-weapper-qc">
          <qr-code-component :text="item.returnCode" :size="80" />
        </div>
        <table cellpadding="10" cellspacing="0" width="100%">
          <tbody>
            <tr>
              <td class="td" colspan="2">单位：{{ item.unitName }}</td>
              <td class="td" colspan="2">领料部门：{{ item.unitName }}</td>
            </tr>
            <tr>
              <td class="td" colspan="2">退料单号：{{ item.returnCode }}</td>
              <td class="td" colspan="2">用料地区：{{ item.plantName }}</td>
              <td class="td" colspan="2">出库单号：{{ item.obCode }}</td>
            </tr>
            <tr>
              <td class="td" colspan="2">
                退料日期：{{ parseTime(item.orderDate, "{y}-{m}-{d}") }}
              </td>
              <td class="td" colspan="2">仓库：{{ item.depotName }}</td>
              <td class="td" colspan="2">备注：{{ item.comments }}</td>
            </tr>
          </tbody>
        </table>
        <div class="article__heading__table">
          <table cellpadding="10" cellspacing="0" width="100%">
            <thead>
              <tr>
                <th class="th" v-for="j in printMatlTableJson" :key="j.key">
                  {{ j.label }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="d in item.details" :key="d.id">
                <td
                  class="td"
                  v-for="val in printMatlTableJson"
                  :key="val.key"
                  style="text-align: center"
                >
                  {{
                    val.prop === "matlName"
                      ? `${d.matlName}${d.matlType ? "/" + d.matlType : ""}`
                      : d[val.prop]
                  }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <table cellpadding="10" cellspacing="0" width="100%">
          <tbody>
            <tr>
              <td class="td">退料人：{{ item.materialReturner }}</td>
              <td class="td">制单人：{{ item.makerName }}</td>
              <td class="td">收料人：{{ item.noteName }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="visible = false" class="cancel-btn"
          ><svg-icon icon-class="cancel" />&nbsp;关闭</el-button
        >
        <el-button type="primary" class="determine-btn" v-print="printSetting"
          ><svg-icon icon-class="determine" />&nbsp;打印</el-button
        >
      </div>
    </template>
  </ep-dialog>
</template>

<script setup>
import QrCodeComponent from "@/components/QrCodeComponent";
import { printMatlTableJson } from "../tableJson";
import { maintainPrint } from "@/api/materialMaintain/materialGroup";

const { proxy } = getCurrentInstance();

const visible = ref(false);
const tableData = ref([]);
const printSetting = ref({
  id: "printMe",
  beforeOpenCallback(vue) {
    vue.pringLoading = true;
  },
  openCallback(vue) {},
  closeCallback(vue) {
    vue.pringLoading = false;
  },
});

const getMainPrint = (ids) => {
  proxy.$modal.loading();
  maintainPrint(ids)
    .then(({ data }) => {
      tableData.value = data || [];

      tableData.value[0].details.map((item) => {
        if (item.rmNum) {
          item.outsaleAmount = (item.rmNum * item.price).toFixed(2);
        }
      });
    })
    .finally(() => {
      proxy.$modal.closeLoading();
    });
};

// 显示弹框
function show(ids) {
  visible.value = true;
  getMainPrint(ids);
}

defineExpose({
  show,
});
</script>
<style lang="scss" scoped>
@media print {
  @page {
    margin: 0cm;
  }

  .content-weapper {
    page-break-before: always;
  }
}

.dialog-printMe {
  width: 100%;
  padding: 0 10px;
  overflow: auto;
}

.printMe-h1 {
  text-align: center;
  padding-bottom: 20px;
}

.content-weapper {
  position: relative;
}

:deep(.content-weapper-qc) {
  position: absolute;
  right: 50px;
  top: 0;
}

.article__heading__table {
  width: 100%;

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
    }
  }
}
</style>
