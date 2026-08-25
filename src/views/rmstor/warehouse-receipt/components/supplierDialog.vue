<template>
  <div class="receipt-supplier-dialog-box">
    <el-dialog class="dialog godown-entry-dialog" :model-value="visible" :width="width" top="5vh" draggable @close="dialogClose" @open="dialogOpen" :destroy-on-close="true">
      <template #header>
        <span><svg-icon :icon-class="iconTitle" v-if="iconTitle" /> {{ title }}</span>
      </template>
      <div class="app-container app-container-splitpanes">
        <el-row :gutter="20" class="app-container-row integrated-manage-pane-form integrated-manage-pane-form-a">
          <el-col class="app-container-col">
            <form-data
              :showSearch="true"
              :formJson="props.commonDialogFormJson"
              @handle-query="handleQuery"
              @reset-query="resetQuery"
              ref="formRef"
              :isShowMore="false"
            />
            <!-- <el-row :gutter="10" class="mb8 integrated-manage-pane-form-button"></el-row> -->
            <receipt-table
              class="table-index"
              :loading="loading"
              idName="unitCode"
              :queryParams="queryParams"
              :tableJson="tableJsonArr"
              :tableData="tableData"
              singleMode
              @handleSelectionChange="handleSelectionChange"
              ref="tableRef"
              @handle-db-click="handleDbClick"
              :tableRowDbClickFalg="props.tableRowDbClickFalg"
              :reserveSelection="true"
            >
            </receipt-table>
            <pagination 
              v-show="total > 0"
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
import { mainReceiverUnit } from '@/api/warehouse/externalTransfer';
import { ElMessage } from 'element-plus';
import receiptTable from './receiptTable.vue';

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
  tableRowDbClickFalg: {
    type: Boolean,
    default: false,
  },
  commonDialogFormJson: {
    type: Array,
    default: () => []
  },
  commonDialogTableJson: {
    type: Array,
    default: () => [],
  },
  supUnitData: {
    type: Object,
    default: () => ({}),
  },
});

const tableJsonArr = ref(props.commonDialogTableJson);

const loading = ref(false);
const formRef = ref(null);
const queryParams = ref({
  pageNum: 1,
  pageSize: 30,
});

// 引用单据列表数据
const tableRef = ref(null);
const tableData = ref([]);
const total = ref(0);
const currentSelectedData = ref({});
const selectedData = ref([]);

const getList = async () => {

  loading.value = true;
  try {
    const res = await mainReceiverUnit({
      ...formRef.value?.formData,
      ...queryParams.value,
    });
    tableData.value = res.data?.list || [];
    total.value = res.data?.total || 0;
  } catch (error) {
    console.log(error);
  }

  loading.value = false;

}

const handleQuery = () => {
  queryParams.value.pageNum = 1;
  getList();
}

const resetQuery = () => {
  queryParams.value.pageNum = 1;
  getList();
}

const handleSelectionChange = (val) => {
  selectedData.value = [...val];
  currentSelectedData.value = val[0];
}

const handleCancel = () => {
  dialogClose();
}

const handleConfirm = () => {
  if (!!!selectedData.value.length) {
    ElMessage.error("请选择数据！");
    return;
  }
  emit('returnUnitData', currentSelectedData.value);
  dialogClose();
}

const handleDbClick = (data) => {
  // console.log(data);
  handleConfirm();
}

onMounted(() => {
  // getList();
});

const dialogOpen = async () => {
  await getList();
  if (!!props.supUnitData.unitCode && !!tableRef.value) {
    tableRef.value.toggleRowSelection({ ...props.supUnitData }, true);
  }
}


const emit = defineEmits(['dialogClose', 'returnUnitData']);

const dialogClose = () => {
  selectedData.value = [];
  queryParams.value.pageNum = 1;
  queryParams.value.pageSize = 30;
  currentSelectedData.value = {};
  emit('dialogClose');
}
</script>
<style lang="scss" scoped>
.receipt-supplier-dialog-box {
  :deep(.ep-dialog) {
    .ep-dialog__body {
      padding: 0 !important;
      .ep-form {
        margin-bottom: 8px;
      }
    }
    .pagination-container {
      margin-top: 0;
      margin-bottom: 10px;
    }
  }
}
</style>