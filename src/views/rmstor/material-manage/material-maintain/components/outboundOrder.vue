<template>
  <ep-dialog
    :title="title"
    iconTitle="form"
    v-model="groupVisible"
    width="70vw"
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
            <form-data
              ref="formDataRef"
              :showSearch="showSearch"
              :formJson="formOrderJson"
              @handleQuery="handleQuery"
              :formSelectData="formSelectData"
              @resetQuery="resetQuery"
            ></form-data>
            <el-row :gutter="24" class="mb8 integrated-manage-pane-form-button">
              <el-col :span="18">
                <el-form-item label="请选择出库单：" prop="matlName">
                  <el-select
                    v-model="searchValue"
                    :loading="searchLoading"
                    clearable
                    @change="spdChange"
                  >
                    <el-option
                      v-for="item in searchOptions"
                      :key="item.spdCode"
                      :label="`${item.obCode}`"
                      :value="item.obCode"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <!-- 表格数据 -->
            <table-index
              ref="tableRef"
              class="table-index"
              :loading="loading"
              :idName="idName"
              :queryParams="queryParams"
              :tableJson="tableJsonArr"
              :selectionShow="true"
              :tableData="tableData"
              @handleSelectionChange="handleSelectionChange"
              operationWidth="150"
            >
            </table-index>

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
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="groupVisible = false" class="cancel-btn"
          ><svg-icon icon-class="cancel" />&nbsp;关闭</el-button
        >
        <el-button type="primary" class="determine-btn" @click="saveBtn"
          ><svg-icon icon-class="determine" />&nbsp;{{
            dialogType === "create" ? "保存" : "确定"
          }}</el-button
        >
      </div>
    </template>
  </ep-dialog>
</template>

<script setup>
import {
  maintainListByObCode,
  maintainListMtObCode,
} from "@/api/materialMaintain/materialGroup";
import { tableJsonOrder } from "../tableJson";
import { getLocalStorage } from "@/utils/auth";
import { formOrderJson } from "../formJson";
import { useDict } from "@/utils/Dict";
const { proxy } = getCurrentInstance();
const tableJsonArr = ref(
  JSON.parse(getLocalStorage(proxy.$route.meta?.menuId)) || tableJsonOrder
);

const props = defineProps({});
const groupVisible = defineModel({ default: false });
const showSearch = ref(true);

// 出库单主表下拉菜单
const searchOptions = ref([]);
const searchValue = ref("");
const searchLoading = ref(false);

watch(groupVisible, (newVal) => {
  if (newVal) {
    getList();
    proxy.$nextTick(() => {
      proxy.$refs.formDataRef && proxy.$refs.formDataRef.resetQuery();
    });
  } else {
    resetQuery();
  }
});

const tableData = ref([]);
const loading = ref(false);
const total = ref(0);
const tableRef = ref();
const idName = ref("obdtId");
const selectData = ref({});

const title = ref("出库单号");

const data = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 30,
  },
  formSelectData: {},
});

const { queryParams, formSelectData } = toRefs(data);

const emit = defineEmits(["createSuccess", "selectData"]);
const dialogType = ref("");

// 出库单明细
const spdListPage = async (val) => {
  await maintainListByObCode(val).then(({ data }) => {
    tableData.value = data || [];
  });
};
const obSearchList = ref();
const spdChange = (val) => {
  if (!val) {
    tableData.value = [];
    return getList();
  }

  obSearchList.value = searchOptions.value.find((item) => val === item.obCode);

  let res = searchOptions.value.find((item) => val === item.obCode);
  spdListPage({ obmtId: res.obmtId });
};

const getList = async (val) => {
  loading.value = true;
  await maintainListMtObCode(queryParams.value)
    .then(({ data }) => {
      searchOptions.value = data || [];
      total.value = data.length;
      if (val.obCode) {
        searchValue.value = data[0].obCode;
        spdListPage({ obmtId: data[0].obmtId });
      }
    })
    .finally(() => {
      loading.value = false;
      if (searchOptions.value.length < 1) {
        searchValue.value = "";
        tableData.value = [];
      }
    });
};

/** 查询按钮操作 */
const handleQuery = (data) => {
  queryParams.value.pageNum = 1;

  queryParams.value = Object.assign({}, queryParams.value, data);
  getList(data);
};
/** 重置按钮操作 */
function resetQuery(data = {}) {
  handleQuery(data);
  searchValue.value = "";
  tableData.value = [];
  formSelectData.value = {};
}

const handleSelectionChange = (selection, row) => {
  if (selection) {
    selectData.value = {
      searchOptions: obSearchList.value,
      selection,
    };
  }
};
const saveBtn = () => {
  groupVisible.value = false;
  emit("selectData", selectData.value);
};
</script>
<style lang="scss" scoped>
.sso-front-table-container2 {
  height: 70vh;
  border: none;
  margin: 0;
  display: flex;
  flex-direction: column;
}
</style>
