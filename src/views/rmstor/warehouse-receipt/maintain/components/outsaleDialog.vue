<template>
  <div class="receipt-outsale-dialog-box">
    <el-dialog class="dialog godown-entry-dialog" :model-value="visible" :width="width" top="5vh" draggable @close="dialogClose" @opened="dialogOpened" destroy-on-close>
      <template #header>
        <span><svg-icon :icon-class="iconTitle" v-if="iconTitle" /> {{ title }}</span>
      </template>
      <div class="app-container app-container-splitpanes">
        <el-row :gutter="20" class="app-container-row integrated-manage-pane-form integrated-manage-pane-form-a">
          <el-col class="app-container-col">
            <form-data
              :showSearch="true"
              :formJson="outsaleDialogFormJson"
              @handle-query="handleQuery"
              @reset-query="resetQuery"
              ref="formRef"
              :isShowMore="false"
            />
            <el-row :gutter="10" class="mb8 integrated-manage-pane-form-button">
              <el-col style="display: flex; align-items: center;">
                <el-form :model="outsaleForm" :rules="outsaleFormRules">
                  <el-form-item label="请选择调拨单：" class="receipt-outsale-form-item" prop="currentOutsaleOrder">
                    <el-select v-model="outsaleForm.currentOutsaleOrder" placeholder="请选择" @change="orderChange" value-key="mtId">
                      <el-option v-for="item in outsaleOrderList" :key="item.outsaleCode" :value="item" :label="item.unitName + '-' + item.depotName + '-' + item.partitionName + '-' + item.outsaleCode"></el-option>
                    </el-select>
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>
            <receipt-table
              class="table-index"
              :loading="loading"
              idName="dtId"
              :queryParams="queryParams"
              :tableJson="tableJsonArr"
              :selectionShow="true"
              :tableData="tableData"
              @handleSelectionChange="handleSelectionChange"
              :reserveSelection="true"
              ref="tableRef"
            >
               <template #matlType="{name, scope}">
                {{ [scope.row.matlType, scope.row.matlPcode, scope.row.matlRaw].filter(item => !!item).join("/") }}
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
import { outsaleDialogFormJson } from '../formJson';
import { outsaleDialogTableJson } from '../tableJson';
import { mainList } from "@/api/warehouse/externalTransfer.js";
import { getOutsaleList, getOutsaleDetailList } from '@/api/rmstor/inbound';
import { ElMessage } from 'element-plus';
import { getCookie } from "@/utils/auth";
import { parseTime } from "@/utils/generalMethod.js";
import receiptTable from '../../components/receiptTable.vue';

const yearMonth = getCookie('warehouseGetYear') ? JSON.parse(getCookie('warehouseGetYear')).yearMonth ? JSON.parse(getCookie('warehouseGetYear')).yearMonth : parseTime(new Date(), '{y}{m}') : parseTime(new Date(), '{y}{m}');
const { proxy } = getCurrentInstance();
const tableJsonArr = ref(outsaleDialogTableJson);
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
  alreadyTableData: {
    type: Array,
    default: () => [],
  },
  refBillCode: {
    type: String,
    default: "",
  },
  unitCode: {
    type: String,
    default: "",
  },
  unitName: {
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
// 采购订单下拉选项
const outsaleOrderList = ref([]);
const _outsaleOrderList = ref([]);
const outsaleForm = ref({
  currentOutsaleOrder: {},
})
const outsaleFormRules = ref({
  currentOutsaleOrder: [
    { required: true, message: "请选择调拨单", trigger: ["blur", "change"] }
  ],
})
// 引用单据列表数据
const tableData = ref([]);
const total = ref(0);
const selectedData = ref([]);

const _getOutsaleList = async () => {
  try {
    const res = await getOutsaleList({
      ...formRef.value?.formData,
      yearMonth,
      // unitCode: props.unitCode,
      unitName: "",
    });
    outsaleOrderList.value = res.data || [];
    _outsaleOrderList.value = [...outsaleOrderList.value];
  } catch (error) {
    console.log(error);
  }
}

const getList = async () => {
  loading.value = true;
  try {
    const res = await getOutsaleDetailList({
      ...queryParams.value,
      // ...formRef.value?.formData,
      outsaleCode: outsaleForm.value.currentOutsaleOrder.outsaleCode
    });
    tableData.value = res.data?.list || [];
    total.value = res.data?.total || 0;
  } catch (error) {
    
  }
  loading.value = false;
}

const handleQuery = async () => {
  
  await _getOutsaleList();
  outsaleForm.value.currentOutsaleOrder = {};
  queryParams.value.pageNum = 1;
  tableData.value = [];
  total.value = 0;
  if (!!formRef.value?.formData.outsaleCode) {
    try {
      if (!!outsaleOrderList.value.length) {
        outsaleForm.value.currentOutsaleOrder = outsaleOrderList.value[0];
        getList();
      } else {
        ElMessage.warning("未查询到调拨单！");
      }
    } catch (error) {
      console.log(error);
    }
  } else {
    if (!!outsaleOrderList.value.length) {
    } else {
      ElMessage.warning("未查询到调拨单！");
    }
  }
}

const resetQuery = async () => {
  formRef.value.formData.unitName = props.unitName;
  formRef.value.formData.unitCode = props.unitCode;
  await _getOutsaleList();
  queryParams.value.pageNum = 1;
  outsaleForm.value.currentOutsaleOrder = {};
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
  if (!!!outsaleForm.value.currentOutsaleOrder.outsaleCode) {
    ElMessage.error("请先选择调拨单！");
    return;

  };
  if (!!!selectedData.value.length) {
    ElMessage.error("请选择数据！");
    return;
  };
  emit('returnData', [selectedData.value.map(item => ({
    ...item,
    refBillCode: item.outsaleCode,
    refBillDid: item.dtId,
    refBillSeq: item.dtSeq,
    paNum: item.outsaleNum - item.outQuantity,
    matlpCode: item.matlPcode,
  })), outsaleForm.value.currentOutsaleOrder]);
  dialogClose();
}

const dialogOpened = () => {
  if (formRef.value) {
    formRef.value.formData.outsaleCode = props.refBillCode;
    formRef.value.formData.unitName = props.unitName;
    formRef.value.formData.unitCode = props.unitCode;
  }
  //  _getOutsaleList();
  handleQuery();
}

watch(() => outsaleForm.value.currentOutsaleOrder, () => {
  tableRef.value.clearTableSelection();
  if (outsaleForm.value.currentOutsaleOrder.outsaleCode === props.refBillCode && !!props.alreadyTableData.length) {
    for (const item of props.alreadyTableData) {
      tableRef.value.toggleRowSelection(item, true);
    }
  }
})

const dialogClose = () => {
  queryParams.value.pageNum = 1;
  queryParams.value.pageSize = 30;
  emit('dialogClose');
}

const emit = defineEmits(['dialogClose', 'returnData']);
</script>
<style lang="scss" scoped>
.receipt-outsale-dialog-box {
  :deep(.ep-dialog) {
    .ep-dialog__body {
      padding: 0 !important;
    }
    .receipt-outsale-form-item {
      margin-bottom: 0;
      .ep-select {
        width: 480px;
      }
    }
    .pagination-container {
      margin-top: 0;
      margin-bottom: 10px;
    }
  }
}
</style>