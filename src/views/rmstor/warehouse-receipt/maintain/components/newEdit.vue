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
            <el-input v-model="detailData.freightAmount" @blur="(val) => basicPriceBlur(val, 'freightAmount')" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="杂费：" prop="extrasAmount">
            <el-input v-model="detailData.extrasAmount" @blur="(val) => basicPriceBlur(val, 'extrasAmount')" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="其他费：" prop="otherAmount">
            <el-input v-model="detailData.otherAmount" @blur="(val) => basicPriceBlur(val, 'otherAmount')" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="税额：" prop="incotaxAmount">
            <el-input v-model="detailData.incotaxAmount" @blur="(val) => basicPriceBlur(val, 'incotaxAmount')" placeholder="请输入"></el-input>
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
          <div class="entry-comments-form-row">
            <el-form-item label="备注：" prop="comments" class="entry-comments-form-item">
              <el-input v-model="detailData.comments" type="textarea" :rows="2" placeholder="请输入" maxlength="500" show-word-limit></el-input>
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
            :edit-config="{enabled: true}"
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

          <div style="margin-top: 16px;">采购金额合计：{{ tableData.map(item => item.stkAmount ? Number(item.stkAmount) : 0).reduce((acc, curr) => acc + curr, 0) || 0 }}</div>
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

// 查询数字小数位数
const checkDecimalPlaces = (num) => {
  // 处理科学计数
  let str = num.toString();
  if (str.includes("e")) {
    // 转为普通小数形式(尽量保留精度)
    str = Number(num).toFixed(2);
  }
  const parts = str.split(".");
  if (parts.length === 1) return 0;
  return parts[1].replace(/0+$/, '').length;
}

const _formatDecimal = (value, decimals) => {
  const value2 = Number(value);
  if (typeof value2 !== "number" || isNaN(value2) || !isFinite(value2)) {
    return value?.toString() ?? "";
  }
   const factor = Math.pow(10, decimals);

  // const fixedDecimals = Math.max(0, Math.floor(decimals));
  // return String(value).trim() === "" ? "" : Number(value).toFixed(fixedDecimals);
  return String(value).trim() === "" ? "" : Math.round((Number(value) + Number.EPSILON) * factor) / factor;
}

const amountRegex = /^(?:[1-9]\d*|0)(?:\.\d+)?$/;

const editFormRules = ref({
  freightAmount: [
    { pattern: amountRegex, message: "请输入非负数字", trigger: ["blur",] },
    { required: true, message: "请填写", trigger: ["blur"] },
  ],
  extrasAmount: [
    { pattern: amountRegex, message: "请输入非负数字", trigger: ["blur",] },
    { required: true, message: "请填写", trigger: ["blur"] },
  ],
  otherAmount: [
    { pattern: amountRegex, message: "请输入非负数字", trigger: ["blur",] },
    { required: true, message: "请填写", trigger: ["blur"] },
  ],
  incotaxAmount: [
    { pattern: amountRegex, message: "请输入非负数字", trigger: ["blur",] },
    { required: true, message: "请填写", trigger: ["blur"] },
  ],
});

const toolbarConfig = {
  buttons: [
  ]
}

const columns = computed(() => [
  { field: "matlCode", title: "物资编码", minWidth: 180, align: "center" },
  { field: "matlName", title: "物资名称", minWidth: 200, align: "center" },
  { field: "matlType", title: "规格类型/图号/材质", minWidth: 200, align: "center", render: (row) => [row.matlType, row.matlpCode, row.matlRaw].filter(item => !!item).join("/") },
  { field: "matlUnit", title: "计量单位", minWidth: 140, align: "center" },
  { field: "paNum", title: "入库数量", minWidth: 120, align: "center" },
  { field: "stkPrice", title: "采购单价（元）", minWidth: 140, align: "center" },
  { field: "orderPrice", title: "订单单价（元）", minWidth: 140, align: "center" },
  { field: "stkAmount", title: "采购金额（元）", minWidth: 140, align: "center" },
  { field: "cardPrice", title: "库存单价（元）", minWidth: 140, align: "center" },
  { field: "standardAmount", title: "入库金额（元）", minWidth: 140, align: "center" },
  { field: "credCode", title: "技证号", minWidth: 180, align: "center", editRender: { name: "el-input" } },
  { field: "productionDate", title: "生产日期", minWidth: 180, align: "center", type: "date" },
  { field: "validityPeriod", title: "有效期", minWidth: 120, align: "center" },
  { field: "validityPeriodUnit", title: "有效期单位", minWidth: 120, align: "center" },
  { field: "expirationDate", title: "到期日期", minWidth: 180, align: "center", type: "date" },
  { field: "batchNo", title: "批次号", minWidth: 180, align: "center", visible: detailData.value.flag === "2", },
  { field: "accPic", title: "验收照片",minWidth: 160, align: "center", slotName: "accPic", hideInTable: detailData.value.ibSource !== "0"},
  { field: "contractPic", title: "合同照片",minWidth: 160, align: "center", slotName: "contractPic", hideInTable: detailData.value.ibSource !== "0" }
]);

const basicPriceBlur = (val, prop) => {
  if (checkDecimalPlaces(detailData.value[prop]) > 2) {
    detailData.value[prop] = _formatDecimal(detailData.value[prop], "2")
  } else {
    detailData.value[prop] = _formatDecimal(detailData.value[prop], checkDecimalPlaces(detailData.value[prop]));
  }
}

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

        ElMessage.success("修改成功！");
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