<template>
  <div class="entry-edit-dialog-box">
    <el-dialog class="dialog godown-entry-dialog" :model-value="visible" :width="width" top="5vh" draggable @close="dialogClose" @open="dialogOpen" destroy-on-close>
      <template #header>
        <span><svg-icon :icon-class="iconTitle" v-if="iconTitle" /> {{ title }}</span>
      </template>
      <el-form v-loading="loading" ref="detailRef" :model="detailData" style="width: 100%;" :inline="true" :rules="editFormRules">
        <div class="entry-form-row-div" v-if="detailData.ibSource === '8'">
          <div class="entry-form-row-title">来源类别</div>
          <el-form-item prop="otherTypeName" class="entry-form-item-source">
            <span>{{ detailData.otherTypeName || '--' }}</span>
          </el-form-item>
        </div>
        <div class="entry-form-row-div entry-form-row-div-basic">
          <div class="entry-form-row-title">入库单基本信息</div>
          <el-form-item label="入库单号：" prop="ibBillCode">
            <span>{{ detailData.ibBillCode || '--' }}</span>
          </el-form-item>
          <el-form-item label="用料地区：" prop="plantName">
            <span>{{ detailData.plantName || '--' }}</span>
          </el-form-item>
          <el-form-item label="仓库：" prop="depotName">
            <span>{{ detailData.depotName || '--' }}</span>
          </el-form-item>
          <el-form-item label="仓库分区：" prop="partitionName">
            <span>{{ detailData.partitionName || '--' }}</span>
          </el-form-item>
          <el-form-item label="应税用途：" prop="taxFlagName">
            <span>{{ detailData.taxFlagName || '--' }}</span>
          </el-form-item>
          <el-form-item label="供货单位：" prop="supUnitName" class="entry-form-item-dialog">
            <span>{{ detailData.supUnitName || '--' }}</span>
          </el-form-item>
          <el-form-item label="采购订单：" prop="refBillCode" class="entry-form-item-dialog">
            <span>{{ detailData.refBillCode || '--' }}</span>
          </el-form-item>
          <el-form-item v-if="detailData.ibSource === '0'" label="采购方式：" prop="buyTypeName">
            <span>{{ detailData.buyTypeName || '--' }}</span>
          </el-form-item>
          <el-form-item label="发票号：" prop="invoiceCode">
            <el-input v-model="detailData.invoiceCode" placeholder="请输入发票号" clearable></el-input>
          </el-form-item>
          <el-form-item label="运费：" prop="freightAmount">
            <span>{{ detailData.freightAmount != null ? Number(detailData.freightAmount).toFixed(2) : '0.00' }}</span>
          </el-form-item>
          <el-form-item label="杂费：" prop="extrasAmount">
            <span>{{ detailData.extrasAmount != null ? Number(detailData.extrasAmount).toFixed(2) : '0.00' }}</span>
          </el-form-item>
          <el-form-item label="其他费：" prop="otherAmount">
            <span>{{ detailData.otherAmount != null ? Number(detailData.otherAmount).toFixed(2) : '0.00' }}</span>
          </el-form-item>
          <el-form-item label="税额：" prop="incotaxAmount">
            <span>{{ detailData.incotaxAmount != null ? Number(detailData.incotaxAmount).toFixed(2) : '0.00' }}</span>
          </el-form-item>
          <el-form-item label="料款：" prop="matlAmount">
            <span>{{ detailData.matlAmount != null ? Number(detailData.matlAmount).toFixed(2) : '0.00' }}</span>
          </el-form-item>
          <el-form-item label="税额+料款：" prop="taxMatlAmount">
            <span>{{ detailData.taxMatlAmount != null ? Number(detailData.taxMatlAmount).toFixed(2) : '0.00' }}</span>
          </el-form-item>
          <el-form-item label="总金额：" prop="totalAmount">
            <span>{{ detailData.totalAmount != null ? Number(detailData.totalAmount).toFixed(2) : '0.00' }}</span>
          </el-form-item>
          <div class="entry-comments-form-row">
            <el-form-item label="备注：" prop="comments" class="entry-comments-form-item">
              <span>{{ detailData.comments || '--' }}</span>
            </el-form-item>
          </div>
        </div>
      </el-form>
      <div class="entry-table-row">
        <div class="entry-table-row-title">入库单明细信息</div>
        <div class="entry-table-content-row">
          <el-pro-table
            :data="tableData"
            :columns="columns"
            :show-pagination="false"
            :show-refresh="false"
            :show-setting="false"
            action-width="120"
            :toolbar-config="toolbarConfig"
            :gridOptions="{rowId: 'ibdtId'}"
            :edit-config="{enabled: false}"
            @edit-save="editSave"
            @edit-cancel="editCancel"
          >
            <template #contractPic="{row}">
              <el-link type="primary" @click="clickLink('contractPic', row)">合同照片</el-link>
            </template>
            <template #accPic="{row}">
              <el-link type="primary" @click="clickLink('accPic', row)">验收照片</el-link>
            </template>
          </el-pro-table>

          <div style="margin-top: 16px;">采购金额合计：{{ (tableData.map(item => item.stkAmount ? Number(item.stkAmount) : 0).reduce((acc, curr) => acc + curr, 0) || 0).toFixed(2) }}</div>
        </div>
      </div>
      <template #footer>
        <el-button @click="goBack">返回</el-button>
        <el-button @click="toSave" type="primary">保存</el-button>
      </template>
    </el-dialog>
    <picture-list-dialog title="验收图片查看" :visible="pictureListVisible" width="80%" @dialog-close="pictureListDialogClose" :pdb-id="currentRowData.acId" />
    <picture-carousel-dialog title="合同照片查看" :visible="pictureCarouselVisible" width="80%" @dialog-close="pictureCarouselClose" :pdb-id="currentRowData.acId" />
  </div>
</template>

<script setup>
import { inboundDetail, inboundUpdate } from '@/api/rmstor/inbound';
import { ElMessage } from 'element-plus';
import pictureListDialog from '../../components/pictureListDialog.vue';
import pictureCarouselDialog from '../../components/pictureCarouselDialog.vue';

const { proxy } = getCurrentInstance();
// 接收参数并指定类型（可选）
const props = defineProps({
  iconTitle: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: '新增'
  },
  width: {
    type: String,
    default: '800px'
  },
  visible: {
    type: Boolean,
    default: false
  },
  currentData: {
    type: Object,
    default: () => {},
  }
});

const loading = ref(false);
const detailRef = ref(null);
const detailData = ref({});
const tableData = ref([]);
const currentRowData = ref({});
const pictureListVisible = ref(false);
const pictureCarouselVisible = ref(false);

const editFormRules = ref({
  invoiceCode: [
    { required: true, message: "请输入发票号", trigger: ["blur"] },
  ],
});

const toolbarConfig = {
  buttons: [
  ]
}

const columns = computed(() => [
  { field: "matlCode", title: "物资编号", minWidth: 180, align: "center", required: true, headerClassName: "required-col-header" },
  { field: "matlName", title: "物资名称", minWidth: 200, align: "center" },
  { field: "matlType", title: "规格类型/图号/材质", minWidth: 200, align: "center", render: (row) => [row.matlType, row.matlpCode, row.matlRaw].filter(item => !!item).join("/") },
  { field: "matlUnit", title: "计量单位", minWidth: 140, align: "center" },
  { field: "paNum", title: "入库数量", minWidth: 120, align: "center", required: true, headerClassName: "required-col-header", render: (row) => row.paNum != null && row.paNum !== '' ? Number(row.paNum).toFixed(4) : '' },
  { field: "stkPrice", title: "采购单价", minWidth: 140, align: "center", required: true, headerClassName: "required-col-header", render: (row) => row.stkPrice != null && row.stkPrice !== '' ? Number(row.stkPrice).toFixed(2) : '' },
  { field: "orderPrice", title: "订单单价", minWidth: 140, align: "center", render: (row) => row.orderPrice != null && row.orderPrice !== '' ? Number(row.orderPrice).toFixed(2) : '' },
  { field: "stkAmount", title: "采购金额", minWidth: 140, align: "center", required: true, headerClassName: "required-col-header", render: (row) => row.stkAmount != null && row.stkAmount !== '' ? Number(row.stkAmount).toFixed(2) : '' },
  { field: "cardPrice", title: "库存单价", minWidth: 140, align: "center", required: true, headerClassName: "required-col-header", render: (row) => row.cardPrice != null && row.cardPrice !== '' ? Number(row.cardPrice).toFixed(2) : '' },
  { field: "standardAmount", title: "入库金额", minWidth: 140, align: "center", render: (row) => row.standardAmount != null && row.standardAmount !== '' ? Number(row.standardAmount).toFixed(2) : '' },
  { field: "credCode", title: "技证号", minWidth: 180, align: "center", editRender: { name: "el-input" } },
  { field: "productionDate", title: "生产日期", minWidth: 180, align: "center", type: "date" },
  { field: "validityPeriod", title: "有效期", minWidth: 120, align: "center" },
  { field: "validityPeriodUnit", title: "有效期单位", minWidth: 120, align: "center" },
  { field: "expirationDate", title: "到期日期", minWidth: 180, align: "center", type: "date" },
]);

watch(() => [detailData.value.incotaxAmount, detailData.value.matlAmount], (nval) => {
  let total = 0;
  for (const item of nval) {
    if (typeof Number(item) !== 'number' || isNaN(Number(item))) {
      // total += Math.round(item * 100);
    } else {
      total += Math.round(item * 100);
    }
  }
  detailData.value.taxMatlAmount = total / 100;
});

watch(() => [detailData.value.incotaxAmount, detailData.value.freightAmount, detailData.value.extrasAmount, detailData.value.otherAmount, detailData.value.matlAmount], (nval) => {
  let total = 0;
  for (const item of nval) {
    if (typeof Number(item) !== 'number' || isNaN(Number(item))) {
      // total += Math.round(item * 100);
    } else {
      total += Math.round(item * 100);
    }
  }
  detailData.value.totalAmount = total / 100;
});

const emit = defineEmits(['dialogClose']);

const dialogClose = () => {
  emit('dialogClose');
}

const goBack = () => {
  dialogClose();
}

const toSave = async () => {
  detailRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true;
      try {
        const res = await inboundUpdate({
          invoiceCode: detailData.value.invoiceCode,
          ibmtId: detailData.value.ibmtId,
          comments: detailData.value.comments,
          extrasAmount: detailData.value.extrasAmount,
          freightAmount: detailData.value.freightAmount,
          inBoundDts: [
            ...tableData.value,
          ],
          matlAmount: detailData.value.matlAmount,
          otherAmount: detailData.value.otherAmount,
          incotaxAmount: detailData.value.incotaxAmount,
          taxMatlAmount: detailData.value.taxMatlAmount,
        });

        ElMessage.success("补充发票号成功！");
         emit('dialogClose', "confirm");
      } catch (error) {
        
      }
      loading.value = false;
    }
  })
}

const getDetail = async () => {
  loading.value = true;
  try {
    const res = await inboundDetail({ibmtId: props.currentData.ibmtId});
    detailData.value = res.data || {};
    tableData.value = detailData.value.inBoundDts || [];
    if (detailData.value.ibSource === "0") {
      for (const item of tableData.value) {
        item.accPic = "查看";
        item.contractPic = "查看"
      }
    }
  } catch (error) {
    
  }
  loading.value = false;
}

const clickLink = async (prop, row) => {
  if (prop === "accPic") {
    currentRowData.value = {...row}
    pictureListVisible.value = true;
  }

  if (prop === "contractPic") {
    currentRowData.value = {...row}
    pictureCarouselVisible.value = true;
  }
}

const pictureCarouselClose = () => {
  currentRowData.value = {};
  pictureCarouselVisible.value = false;
}

const pictureListDialogClose = () => {
  currentRowData.value = {};
  pictureListVisible.value = false;
}

const editSave = ({editedData, row, rowId}) => {
  const res = tableData.value.find(item => item.ibdtId === rowId);
  res.credCode = editedData.credCode;
}

const editCancel = ({row, rowId}) => {
  const res = tableData.value.find(item => item.ibdtId === rowId);
  row.credCode = res.credCode;
}

const dialogOpen = async () => {
  await getDetail();
}

</script>
<style lang="scss" scoped>
.entry-edit-dialog-box {
  :deep(.godown-entry-dialog) {
    height: 80vh;
    // overflow-y: auto;
    .ep-dialog__body {
      padding: 12px;
      overflow-y: auto;
      overflow-x: hidden;
      height: calc(100% - 93px);
      .ep-form {
        .entry-form-row-title {
          margin-bottom: 24px;
        }
        .entry-form-item-source {
          padding-left: 63px;
        }
        .entry-form-row-div-basic {
          .ep-form-item__label {
            width: 126px;
            font-weight: normal;
          }
          .ep-form-item__content {
            width: 177px;
          }
          .entry-form-item-dialog {
            .ep-input__suffix {
              cursor: pointer;
              .ep-icon {
                font-weight: 800;
                color: var(--ep-color-primary);
                font-size: 16px;
              }
            }
          }
        }
        .entry-comments-form-row {
          .entry-comments-form-item {
            width: 100%;
          }
        }
      }
      .entry-form-row-title,.entry-table-row-title {
        font-weight: 600;
        font-size: 16px;
        margin-bottom: 12px;
      }
      .ep-table {
        .ep-table__empty-block {
          height: 0px !important;
        }
      }
      .entry-table-row {
        .entry-table-btn-row {
          margin: 24px 0 12px 0;
        }
      }
    }
  }

}
</style>
<style lang="scss">
/* 入库单明细表头必填列红色 * 标识（仅表头 th，排除表体 td） */
th.required-col-header .cell::after {
  content: ' *';
  color: #f56c6c;
}
</style>