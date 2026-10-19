<template>
  <div class="receipt-purchased-dialog-box">
    <el-dialog class="dialog godown-entry-dialog" :model-value="visible" :width="width" top="5vh" draggable @close="dialogClose" destroy-on-close @opened="dialogOpened" @open="dialogOpen">
      <template #header>
        <span><svg-icon :icon-class="iconTitle" v-if="iconTitle" /> {{ title }}</span>
      </template>
      <div class="app-container app-container-splitpanes">
        <el-row :gutter="20" class="app-container-row integrated-manage-pane-form integrated-manage-pane-form-a">
          <el-col class="app-container-col">
            <form-data
              :showSearch="true"
              :inputWidth="160"
              :formJson="purchaseFormJson"
              @handle-query="handleQuery"
              @reset-query="resetQuery"
              ref="formRef"
              :isShowMore="false"
            />
            <el-row :gutter="10" class="mb8 integrated-manage-pane-form-button">
              <el-col style="display: flex; align-items: center; justify-content: space-between;">
                <el-form :model="purchaseForm" :rules="purchaseFormRules">
                  <el-form-item label="请选择采购订单：" class="purchase-order-form-item" prop="currentPurchaseOrder">
                    <el-select v-model="purchaseForm.currentPurchaseOrder" placeholder="请选择" @change="orderChange" value-key="spdCode">
                      <el-option v-for="item in purchaseOrderList" :key="item.pdmId" :value="item" :label="getPurchaseName(item)"></el-option>
                    </el-select>
                  </el-form-item>
                </el-form>
                <div class="singn-btn-group">
                  <el-button type="primary" @click="handleSignDone" :disabled="!!!selectedData.length">标记完成</el-button>
                  <el-button type="primary" @click="handleRevokeSignDone" :disabled="!!!selectedData.length">撤销标记完成</el-button>
                </div>
              </el-col>
            </el-row>
            <receipt-table
              class="table-index"
              :loading="loading"
              idName="acId"
              :queryParams="queryParams"
              :tableJson="tableJsonArr"
              :selectionShow="true"
              :tableData="tableData"
              @handleSelectionChange="handleSelectionChange"
              :reserveSelection="true"
              ref="tableRef"
            >
              <template #sfiniFlag="{name, scope}">
                {{ scope.row.sfiniFlag === "0" ? "否" : "是" }}
              </template>
              <template #matlType="{name, scope}">
                {{ [scope.row.matlType, scope.row.maltpCode, scope.row.matlRaw].filter(item => !!item).join("/") }}
              </template>
              <template #zycType="{name, scope}"> 
                {{ scope.row.zycType === "" ? "否" : "是" }}
              </template>
              <template #productionDate="{name, scope}">
                {{ parseTime(scope.row.productionDate, "{y}-{m}-{d}") }}
              </template>
              <template #expirationDate="{name, scope}">
                {{ parseTime(scope.row.expirationDate, "{y}-{m}-{d}") }}
              </template>
              <template #taxFlag="{name, scope}">
                {{ scope.row.taxFlag === "1" ? "含税" : scope.row.taxFlag === "0" ? "不含税" : "" }}
              </template>
            </receipt-table>
            <pagination 
              :total="total"
              v-model:page="queryParams.pageNum"
              v-model:limit="queryParams.pageSize"
              @pagination="getList"
            />
          </el-col>
        </el-row>
      </div>
      <template #footer>
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleConfirm">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { purchasedDialogFormJson } from '../formJson';
import { purchasedDialogTableJson } from '../tableJson';
import { getPurchaseList, getDetailList } from '@/api/rmstor/inbound';
import { ElMessage } from "element-plus";
import receiptTable from '../../components/receiptTable.vue';
import { markComplete, revokeMarkComplete, purchaseOrderList as getPurchaseOrderList } from '@/api/warehouse/purchaseOrder';

const { proxy } = getCurrentInstance();
const tableJsonArr = ref(purchasedDialogTableJson.map(column =>
  column.prop === 'stkPrice' ? { ...column, key: 'contPrice', prop: 'contPrice' } : column
));
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
  suCode: {
    type: String,
    default: ""
  },
  suName: {
    type: String,
    default: ""
  },
  refBillCode: {
    type: String,
    default: ""
  },
  alreadyTableData: {
    type: Array,
    default: () => [],
  },
  taxFlagCode: {
    type: String,
    default: "",
  },
  plantCode: {
    type: String,
    default: "",
  }
});

const loading = ref(false);
const formRef = ref(null);
const tableRef = ref(null);
const queryParams = ref({
  pageNum: 1,
  pageSize: 30,
});
const purchaseFormJson = ref(purchasedDialogFormJson);
// 采购订单下拉选项
const purchaseOrderList = ref([]);
const _purchaseOrderList = ref([]);
const purchaseForm = ref ({
  currentPurchaseOrder: {
  }
});
const purchaseFormRules = ref({
  currentPurchaseOrder: [
    { required: true, message: "请选择采购订单", trigger: ["blur", "change"] }
  ]
});
// 引用单据列表数据
const tableData = ref([]);
const total = ref(0);
const selectedData = ref([]);

const _getPurchaseList = async () => {
  try {
    const res = await getPurchaseList({
      suCode: formRef.value?.formData.unitCode,
      suName: formRef.value?.formData.unitName,
      spdCode: formRef.value?.formData.spdCode,
      bmName: formRef.value?.formData.bmName,
      matlName: formRef.value?.formData.matlName,
      matlCode: formRef.value?.formData.matlCode,
      matlType: formRef.value?.formData.matlType,
      taxFlagCode: props.taxFlagCode,
      plantCode: props.plantCode,
    });
    purchaseOrderList.value = res?.data || [];
    _purchaseOrderList.value = [...purchaseOrderList.value];
  } catch (error) {
    
  }
}

const getList = async () => {
  loading.value = true;

  try {
    const res = await getDetailList({
      ...queryParams.value,
      spdCode: purchaseForm.value.currentPurchaseOrder.spdCode,
      pdmId: purchaseForm.value.currentPurchaseOrder.pdmId,
      taxFlagCode: props.taxFlagCode,
    });
    tableData.value = (res.data?.list || []).map(item => ({
      ...item,
      contPrice: item.contPrice ?? item.stkPrice,
    }));
    total.value = res.data?.total || 0;
  } catch (error) {
    
  }

  loading.value = false;
}

const handleQuery = async () => {

  await _getPurchaseList();
  purchaseForm.value.currentPurchaseOrder = {};
  queryParams.value.pageNum = 1;
  tableData.value = [];
  total.value = 0;
  if (!!formRef.value.formData.spdCode) {
    if (!!purchaseOrderList.value.length) {
      purchaseForm.value.currentPurchaseOrder = purchaseOrderList.value[0];
      getList();
    } else {
      ElMessage.warning("未查询到采购订单！")
    }
  } else {
    
    if (!!purchaseOrderList.value.length) {
    } else {
      ElMessage.warning("未查询到采购订单！")
    }
  }
}

const resetQuery = async () => {
  if (props.suCode) {
    formRef.value.formData.unitCode = props.suCode;
  }
  if (props.suName) {
    formRef.value.formData.unitName = props.suName;
  }
  await _getPurchaseList();
  queryParams.value.pageNum = 1;
  purchaseForm.value.currentPurchaseOrder = {};
  tableData.value = [];
  total.value = 0;
}

const orderChange = () => {
  queryParams.value.pageNum = 1;
  getList();
}

const handleSelectionChange = (data = []) => {
  selectedData.value = [...data]
}

const handleCancel = () => {
  dialogClose();
}

const handleConfirm = () => {
  if (!!!purchaseForm.value.currentPurchaseOrder.pdmId) {
    ElMessage.error("请选择采购订单！");
    return;
  };
  if (!!!selectedData.value.length) {
    ElMessage.error("请选择数据！");
    return;
  };

  if (selectedData.value.some(item => item.sfiniFlag !== "0")) {
    ElMessage.error("存在已完成数据，请检查！");
    return;
  }
  emit('returnData', [selectedData.value.map(item => ({
    ...item,
    refBillCode: item.spdCode,
    contPrice: item.contPrice ?? item.stkPrice ?? 0,
    cardPrice: item.cardPrice ?? 0,
    orderPrice: item.contPrice ?? item.stkPrice ?? 0,
    paNum: item.arrivalNum || 0,
    refBillSeq: item.spdSeq,
    refBillDid: item.pddId,
    matlpCode: item.maltpCode,
    accPic: "查看",
    contractPic: "查看"
  })), purchaseForm.value.currentPurchaseOrder]);
  dialogClose();
}

const emit = defineEmits(['dialogClose', 'returnData']);

const dialogClose = () => {
  emit('dialogClose');
}

const getPurchaseName = (data) => {
  const res = `${data.spdCode}-${data.suName}`;
  // const res = `${data.spdCode}-${data.suName}-${data.directFlag === "1" ? "直发" : "非直发"}${data.settleFlag === "1" ? "直达" : "非直达"}`;
  return res;
}

const dialogOpened = () => {
  if (formRef.value) {
    // formRef.value.formData.unitCode = props.suCode;
    formRef.value.formData.unitName = props.suName;
    formRef.value.formData.unitCode = props.suCode;
    formRef.value.formData.spdCode = props.refBillCode;
  }
  handleQuery();
}

const dialogOpen = () => {
  const _item1 = purchaseFormJson.value.find(item => item.prop === "unitName");
  const _item2 = purchaseFormJson.value.find(item => item.prop === "unitCode");

  if (_item1) _item1.disabled = false;
  if (_item2) _item2.disabled = false;

  if (props.suCode || props.suName) {
    if (_item1) _item1.disabled = true;
    if (_item2) _item2.disabled = true;
  }
}

watch(() => purchaseForm.value.currentPurchaseOrder, () => {
  tableRef.value.clearTableSelection();
  if (purchaseForm.value.currentPurchaseOrder.spdCode === props.refBillCode && !!props.alreadyTableData.length) {
    for (const item of props.alreadyTableData) {
      tableRef.value.toggleRowSelection(item, true);
    }
  }
})

const handleSignDone = async () => {
  loading.value = true;
  try {
    const res = await markComplete({
      pddIds: selectedData.value.map(item => item.pddId),
    });
    ElMessage.success("标记完成成功！");
    getList();
  } catch (error) {
    
  }
  loading.value = false;
}

const handleRevokeSignDone = async () => {
  loading.value = true;
  try {
    const res = await revokeMarkComplete({
      pddIds: selectedData.value.map(item => item.pddId),
    });
    ElMessage.success("撤销标记完成成功！");
    getList();
  } catch (error) {
    
  }
  loading.value = false;
}
</script>
<style lang="scss" scoped>
.receipt-purchased-dialog-box {
  :deep(.ep-dialog) {
    .ep-dialog__body {
      padding: 0 !important;
    }
    .purchase-order-form-item {
      margin-bottom: 0;
      .ep-select {
        width: 524px;
      }
    }
    .pagination-container {
      margin-top: 0;
      margin-bottom: 10px;
    }
  }
}
</style>
