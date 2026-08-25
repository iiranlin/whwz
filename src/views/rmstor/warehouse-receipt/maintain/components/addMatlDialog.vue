<template>
  <div class="receipt-matl-dialog-box">
    <el-dialog class="dialog godown-entry-dialog" :model-value="visible" :width="width" top="5vh" draggable @close="dialogClose" @open="dialogOpen" destroy-on-close>
      <template #header>
        <span><svg-icon :icon-class="iconTitle" v-if="iconTitle" /> {{ title }}</span>
      </template>
      <div class="app-container app-container-splitpanes">
        <el-row :gutter="20" class="app-container-row integrated-manage-pane-form integrated-manage-pane-form-a">
          <el-col class="app-container-col">
            <form-data
              :showSearch="true"
              :formJson="addMatlDialogFormJson"
              @handle-query="handleQuery"
              @reset-query="resetQuery"
              ref="formRef"
              :isShowMore="false"
            />
            <receipt-table
              class="table-index"
              :loading="loading"
              idName="matlCode"
              :queryParams="queryParams"
              :tableJson="tableJsonArr"
              :selectionShow="true"
              :tableData="tableData"
              @handleSelectionChange="handleSelectionChange"
              :reserveSelection="true"
              ref="tableRef"
            >
              <template #matlType="{name, scope}">
                {{ [scope.row.matlType, scope.row.matlPicCode, scope.row.matlRaw].filter(item => !!item).join("/") }}
              </template>
              <template #manageRule="{name, scope}">
                {{ manageRuleObj[scope.row.manageRule] || "" }}
              </template>
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
import { addMatlDialogFormJson } from '../formJson';
import { addMatlDialogTableJson, manageRuleObj } from '../tableJson';
import { noAuthorizeList } from "@/api/system/common.js";
import receiptTable from '../../components/receiptTable.vue';

const { proxy } = getCurrentInstance();
const tableJsonArr = ref(addMatlDialogTableJson);
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
  partitionCode: {
    type: String,
    default: "",
  },
  alreadyTableData: {
    type: Array,
    default: () => [],
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
// 引用单据列表数据
const tableData = ref([]);
const total = ref(0);
const selectedData = ref([]);

const getList = async () => {
  loading.value = true;

  try {
    const res = await noAuthorizeList({
      ...formRef.value?.formData,
      ...queryParams.value,
    });
    tableData.value = res.data?.list || [];
    total.value = res.data?.total || 0;
  } catch (error) {
    
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

const handleSelectionChange = (data) => {
  selectedData.value = [...data];
}

const emit = defineEmits(['dialogClose', 'returnMatlData']);

const handleCancel = () => {
  dialogClose();
}

const handleConfirm = () => {
  emit('returnMatlData', selectedData.value.map(item => {
    return {
      ...item,
      matlpCode: item.matlPcode
    }
  }));
  dialogClose();
}

const dialogOpen = async () => {
  await getList();
  if (!!props.alreadyTableData.length && !!tableRef.value) {
    for (const element of props.alreadyTableData) {
      tableRef.value.toggleRowSelection(element, true);
    }
  }
}


const dialogClose = () => {
  emit('dialogClose');
}

</script>
<style lang="scss" scoped>
.receipt-matl-dialog-box {
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