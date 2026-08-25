<template>
  <ep-dialog
    :title="title"
    iconTitle="form"
    v-model="pubmedVisible"
    width="80%"
    top="5vh"
    append-to-body
    height="60vh"
    :close-on-press-escape="false"
    :close-on-click-model="false"
  >
    <div class="sso-front-table-container2">
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
              label-width="100px"
              style="margin-top: 10px"
            >
              <el-row class="form-left flex1">
                <el-col :span="5">
                  <el-form-item label="调拨单号：" prop="outsaleCode">
                    <el-input v-model.trim="formData.outsaleCode" placeholder="请输入">
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item label="物资编码：" prop="matlCode">
                    <el-input v-model.trim="formData.matlCode" placeholder="请输入" />
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item label="物资名称：" prop="matlName">
                    <el-input v-model.trim="formData.matlName" placeholder="请输入" />
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item label="规格型号：" prop="matlType">
                    <el-input v-model.trim="formData.matlType" placeholder="请输入" />
                  </el-form-item>
                </el-col>
                <el-col :span="4" style="display: flex; justify-content: flex-end">
                  <el-button class="cancel-btn" type="primary" @click="getList"
                    >查询</el-button
                  >
                  <el-button class="cancel-btn" @click="resetQuery">重置</el-button>
                </el-col>

                <el-divider style="margin-bottom: 5px; margin-top: -2px"></el-divider>
                <el-col :span="12">
                  <el-form-item label="请选择调拨单：" label-width="125px">
                    <el-select
                      v-model="formData.invoiceRequist"
                      placeholder="请选择"
                      style="width: 400px"
                      @change="handleinvoiceRequist"
                    >
                      <el-option
                        v-for="(item, index) in invoiceRequistList"
                        :key="index"
                        :label="
                          item.unitName +
                          '-' +
                          item.depotName +
                          '-' +
                          item.partitionName +
                          '-' +
                          item.outsaleCode
                        "
                        :value="item.outsaleCode"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
            <!-- 表格数据 -->
            <table-index
              class="table-index"
              :loading="loading"
              :idName="idName"
              :tableJson="tableJsonArr"
              :tableData="tableData"
              @handleSelectionChange="handleSelectionChange"
              operationWidth="150"
            >
            </table-index>
          </el-col>
        </el-row>
      </div>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="pubmedVisible = false" class="cancel-btn"
          ><svg-icon icon-class="cancel" />&nbsp;关闭</el-button
        >
        <el-button type="primary" class="determine-btn" @click="saveBtn"
          ><svg-icon icon-class="determine" />&nbsp;保存</el-button
        >
      </div>
    </template>
  </ep-dialog>
</template>

<script setup>
import { getOutsaleList, getOutsaleDetailList } from "@/api/rmstor/steel-inbound";
import { rmstorMatlTableJson } from "../tableJson";
import { getLocalStorage } from "@/utils/auth";
const { proxy } = getCurrentInstance();
const tableJsonArr = ref(
  JSON.parse(getLocalStorage(proxy.$route.meta?.menuId) || "null") || rmstorMatlTableJson
);
const props = defineProps({
  inBoundFormData: {
    type: Object,
    default: () => {},
  },
});

const pubmedVisible = defineModel({ default: false });
const idName = ref("matlCode");
const single = ref(true);
const multiple = ref(true);
const ids = ref([]);
const selectionData = ref([]);

watch(pubmedVisible, (newVal) => {
  if (newVal) {
    getList();
  } else {
    formData.value = Object.assign({});
    props.inBoundFormData.unitCode = "";
    tableData.value = [];
  }
});
const tableData = ref([]);
const loading = ref(false);
const title = ref("调拨（销售）单信息");

const formData = ref({});
const emit = defineEmits(["createSuccess", "selectData"]);

const invoiceRequistList = ref([]);
const getList = async () => {
  const { data } = await getOutsaleList({
    ...formData.value,
    unitCode: props.inBoundFormData.unitCode,
  });
  invoiceRequistList.value = data;
};
/** 重置按钮操作 */
function resetQuery() {
  formData.value = Object.assign({});
  getList();
}
const handleinvoiceRequist = async (val) => {
  formData.value.invoiceRequist = val;
  const { data } = await getOutsaleDetailList({
    outsaleCode: val,
  });
  tableData.value = data.list;
};
const handleSelectionChange = (selection) => {
  selectionData.value = selection;
  ids.value = selection.map((item) => item["dtId"]);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
};
const saveBtn = async () => {
  pubmedVisible.value = false;
  emit("selectData", invoiceRequistList.value, selectionData.value);
};
</script>
<style lang="scss" scoped>
.sso-front-table-container2 {
  height: 77vh;
  border: none;
  margin: 0;
  display: flex;
  flex-direction: column;
}

:deep(.ep-select, .ep-input) {
  min-width: 180px;

  .ep-input__inner {
    border-color: #d2d2d2;

    &:focus {
      border-color: #1890ff;
    }

    &:hover {
      border-color: #1890ff;
    }
  }
}

:deep(.ep-input) {
  min-width: 180px;
}
</style>
