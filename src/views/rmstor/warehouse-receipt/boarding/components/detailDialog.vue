<template>
  <div class="entry-edit-dialog-box">
    <el-dialog class="dialog godown-entry-dialog" :model-value="visible" :width="width" top="5vh" draggable @close="dialogClose" @open="dialogOpen" destroy-on-close>
      <template #header>
        <span><svg-icon :icon-class="iconTitle" v-if="iconTitle" /> {{ title }}</span>
      </template>
      <el-form v-loading="loading" ref="detailRef" :model="detailData" style="width: 100%;" :inline="true">
        <div class="entry-form-row-div ">
          <div class="entry-form-row-title">入库单来源</div>
          <el-form-item prop="ibSource" class="entry-form-item-source">
            <span>{{ whReceiptSourceObj[detailData.ibSource] || '--' }}</span>
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
          <el-form-item v-if="detailData.ibSource === '0'" label="供应商：" prop="supUnitName" class="entry-form-item-dialog">
            <span>{{ detailData.supUnitName || '--' }}</span>
          </el-form-item>
          <el-form-item v-if="detailData.ibSource !== '0' && detailData.ibSource !== '1' && detailData.ibSource !== '4' && detailData.ibSource !== '9'" label="供货单位：" prop="supUnitName" class="entry-form-item-dialog">
            <span>{{ detailData.supUnitName || '--' }}</span>
          </el-form-item>
          <el-form-item v-if="detailData.ibSource === '0' || detailData.ibSource === '2'" :label="detailData.ibSource === '0' ? '采购订单：' : '引用单据：'" prop="refBillCode" class="entry-form-item-dialog">
            <span>{{ detailData.refBillCode || '--' }}</span>
          </el-form-item>
          <el-form-item v-if="detailData.ibSource === '0'" label="采购方式（发起）：" prop="buyTypeName">
            <span>{{ detailData.buyTypeName || '--' }}</span>
          </el-form-item>
          <!-- <el-form-item label="一收一支：" prop="inOutFlag">
            <el-checkbox v-model="detailData.inOutFlag" true-value="1" false-value="0" disabled></el-checkbox>
          </el-form-item> -->
          <el-form-item label="一收一移库：" prop="allotFlag">
            <el-checkbox v-model="detailData.allotFlag" true-value="1" false-value="0" disabled></el-checkbox>
          </el-form-item>
          <el-form-item v-if="detailData.allotFlag === '1'" label="移库地区：" prop="ptPlantName">
            <span>{{ detailData.ptPlantName || '--' }}</span>
          </el-form-item>
          <el-form-item v-if="detailData.allotFlag === '1'" label="移入仓库：" prop="ptDepotName">
            <span>{{ detailData.ptDepotName || '--' }}</span>
          </el-form-item>
          <el-form-item v-if="detailData.allotFlag === '1'" label="移入库区：" prop="ptPartitionName">
            <span>{{ detailData.ptPartitionName || '--' }}</span>
          </el-form-item>
          <el-form-item label="发票号：" prop="invoiceCode">
            <span>{{ detailData.invoiceCode || '--' }}</span>
          </el-form-item>
          <el-form-item label="运费：" prop="freightAmount">
            <span>{{ detailData.freightAmount || 0 }}</span>
          </el-form-item>
          <el-form-item label="杂费：" prop="extrasAmount">
            <span>{{ detailData.extrasAmount || 0 }}</span>
          </el-form-item>
          <el-form-item label="其他费：" prop="otherAmount">
            <span>{{ detailData.otherAmount || 0 }}</span>
          </el-form-item>
          <el-form-item label="税额：" prop="incotaxAmount">
            <span>{{ detailData.incotaxAmount || 0 }}</span>
          </el-form-item>
          <el-form-item label="料款：" prop="matlAmount">
            <span>{{ detailData.matlAmount || 0 }}</span>
          </el-form-item>
          <el-form-item label="税额+料款：" prop="taxMatlAmount">
            <span>{{ detailData.taxMatlAmount || 0 }}</span>
          </el-form-item>
          <el-form-item label="总金额：" prop="totalAmount">
            <span>{{ detailData.totalAmount || 0 }}</span>
          </el-form-item>
          <el-form-item v-if="detailData.ibSource === '8'" label="来源类别：" prop="otherTypeName">
            <span>{{ detailData.otherTypeName || '--' }}</span>
          </el-form-item>
          <div class="entry-comments-form-row">
            <el-form-item label="备注：" prop="comments">
              <span>{{ detailData.comments || '--' }}</span>
            </el-form-item>
          </div>
        </div>
      </el-form>
      <div class="entry-table-row">
        <div class="entry-table-row-title">入库单明细信息</div>
        <div class="entry-table-content-row">
          <table-index
            class="table-index"
            idName="ibdtId"
            :tableJson="tableJsonArr"
            :tableData="tableData"
            :selectionShow="false"
            @clickLink="clickLink"
          >
            <template #matlType="{name, scope}">
              {{ [scope.row.matlType, scope.row.matlpCode, scope.row.matlRaw].filter(item => !!item).join("/") }}
            </template>
            <template #productionDate="{name, scope}">
              {{ parseTime(scope.row.productionDate, "{y}-{m}-{d}") }}
            </template>
            <template #expirationDate="{name, scope}">
              {{ parseTime(scope.row.expirationDate, "{y}-{m}-{d}") }}
            </template>
          </table-index>
        </div>
      </div>
      <template #footer>
        <el-button @click="goBack">返回</el-button>
      </template>
    </el-dialog>
    <picture-list-dialog title="验收图片查看" :visible="pictureListVisible" width="80%" @dialog-close="pictureListDialogClose" :pdb-id="currentRowData.acId" />
    <picture-carousel-dialog title="合同照片查看" :visible="pictureCarouselVisible" width="80%" @dialog-close="pictureCarouselClose" :pdb-id="currentRowData.acId" />
  </div>
</template>

<script setup>
import { detailDialogTableJson, npdetailDialogTableJson } from '../tableJson';
import { inboundDetail } from '@/api/rmstor/inbound';
import { whReceiptSourceObj } from "@/utils/dictionary.js";
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
const tableJsonArr = ref(npdetailDialogTableJson);
const detailData = ref({});

const tableData = ref([]);
const currentRowData = ref({});
const pictureListVisible = ref(false);
const pictureCarouselVisible = ref(false);

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

const dialogOpen = async () => {
  await getDetail();

  if (detailData.value.ibSource == "0") {
    tableJsonArr.value = detailDialogTableJson;
  } else {
    tableJsonArr.value = npdetailDialogTableJson;
  }

  const batchItem = tableJsonArr.value.find(item => item.key === "batchNo");
  if (batchItem) batchItem.isShow = true;
  if (detailData.value.flag !== "2") {
    if(!!batchItem) batchItem.isShow = false;
  }
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