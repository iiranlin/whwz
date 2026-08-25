<template>
  <div class="receipt-matl-dialog-box">
    <ep-dialog
      class="dialog godown-entry-dialog"
      :model-value="visible"
      width="80%"
      top="5vh"
      draggable
      @close="dialogClose"
      @open="dialogOpen"
      destroy-on-close
    >
      <div class="app-container app-container-splitpanes">
        <el-row
          :gutter="20"
          class="app-container-row integrated-manage-pane-form integrated-manage-pane-form-a"
        >
          <el-col class="app-container-col">
            <el-form
              class="form-wrapper"
              :model="formData"
              ref="elForm"
              :inline="true"
              label-width="120px"
              style="margin-top: 10px"
            >
              <el-row class="form-left flex1">
                <el-col :span="6">
                  <el-form-item label="物资编码：" prop="matlCode">
                    <el-input
                      v-model.trim="formData.matlCode"
                      placeholder="请选择物资编码"
                    >
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="物资名称：" prop="matlName">
                    <el-input
                      v-model.trim="formData.matlName"
                      placeholder="请输入物资名称"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="规格型号：" prop="matlType">
                    <el-input
                      v-model.trim="formData.matlName"
                      placeholder="请输入规格型号"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-button type="primary" @click="getList" class="search-btn"
                    ><svg-icon icon-class="search" />&nbsp;查询</el-button
                  >
                  <el-button type="default" @click="resetQuery" class="reset-btn"
                    ><svg-icon icon-class="Line-Refresh" />&nbsp;重置</el-button
                  >
                </el-col>
              </el-row>
            </el-form>
            <!-- 表格数据 -->
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
        <div class="dialog-footer">
          <el-button @click="handleCancel" class="cancel-btn"
            ><svg-icon icon-class="cancel" />&nbsp;关闭</el-button
          >
          <el-button type="primary" class="determine-btn" @click="handleConfirm"
            ><svg-icon icon-class="determine" />&nbsp;{{ "确定" }}</el-button
          >
        </div>
      </template>
    </ep-dialog>
  </div>
</template>

<script setup>
import { getCheckList } from "@/api/diesel-inbound/dieselEntryGroup.js";
import { tableJsonCheckMaterial } from "../tableJson";
import { getLocalStorage } from "@/utils/auth";
import receiptTable from "@/views/rmstor/warehouse-receipt/components/receiptTable.vue";
const { proxy } = getCurrentInstance();
const tableJsonArr = ref(tableJsonCheckMaterial);

const props = defineProps({
  title: {
    type: String,
    default: "物资分类编号",
  },
  visible: {
    type: Boolean,
    default: false,
  },
  alreadyTableData: {
    type: Array,
    default: () => [],
  },
});

const tableData = ref([]);
const loading = ref(false);
const formRef = ref(null);
const tableRef = ref(null);
const total = ref(0);
const idName = ref("matlCode");
const selectedData = ref([]);
const queryParams = ref({
  pageNum: 1,
  pageSize: 30,
});
const formData = ref({});

const getList = async () => {
  loading.value = true;
  //查询物资目录列表
  getCheckList({
    ...formData.value,
    ...queryParams.value,
    type: "01",
  }).then((data) => {
    tableData.value = data.data?.list || [];
    total.value = data.data?.total || 0;
    loading.value = false;
  });
};

/** 重置按钮操作 */
function resetQuery() {
  queryParams.value.pageNum = 1;
  formData.value.matlCode = "";
  formData.value.matlName = "";
  getList();
}

const handleSelectionChange = (selection) => {
  selectedData.value = [...selection];
};

const emit = defineEmits(["dialogClose", "returnMatlData"]);

const handleCancel = () => {
  dialogClose();
};

const handleConfirm = () => {
  emit(
    "returnMatlData",
    selectedData.value.map((item) => {
      return {
        ...item,
      };
    })
  );
  dialogClose();
};

const dialogOpen = async () => {
  await getList();
  if (!!props.alreadyTableData.length) {
    for (const element of props.alreadyTableData) {
      tableRef.value.toggleRowSelection(element, true);
    }
  }
};

const dialogClose = () => {
  emit("dialogClose");
};
</script>
<style lang="scss" scoped>
.app-container {
  height: 70vh;
}
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
