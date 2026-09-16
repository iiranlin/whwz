<template>
  <ep-dialog class="ep-dialog-list" :title="title" iconTitle="form" v-model="groupVisible" width="80%" top="5vh"
    append-to-body>
    <div class="sso-front-table-container app-container">
      <form-data ref="formDataRef" :showSearch="showSearch" :formJson="formOrderJsonQuery" @handleQuery="handleQuery"
        :formSelectData="formSelectData" @resetQuery="resetQuery"></form-data>
      <el-row style="margin-top: 10px;margin-left: 10px;">
        <el-col :span="12">
          <el-form-item label="请选择出库单：" prop="matlName">
            <el-select v-model="searchValue" :loading="searchLoading" clearable @change="spdChange">
              <el-option v-for="item in searchOptions" :key="item.spdCode" :label="`${item.obCode}`"
                :value="item.obCode" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 表格数据 -->
      <el-pro-table ref="proTableRef" :columns="tableJsonOrderQuery" :show-pagination="false" :data="tableData" :table-alert-render="false"
        :show-checkbox="true" :grid-options="{ rowId: 'obdtId' }" :show-action="false" :show-refresh="false"
        :show-setting="false" @selection-change="onSelectionChange">
      </el-pro-table>
    </div>
    <template #footer>
      <div class="dialog-footer">

        <el-button type="primary" class="determine-btn" @click="saveBtn"><svg-icon icon-class="determine" />&nbsp;{{
          dialogType === "create" ? "保存" : "确定"
        }}</el-button>
               <el-button @click="groupVisible = false" class="cancel-btn"><svg-icon icon-class="cancel" />&nbsp;关闭</el-button> 
      </div>
    </template>
  </ep-dialog>
</template>

<script setup>
import {
  maintainListByObCode,
  maintainListMtObCode,
} from "@/api/materialMaintain/materialGroup";
import { tableJsonOrderQuery } from "../tableJson";
import { getLocalStorage } from "@/utils/auth";
import { formOrderJsonQuery } from "../formJson";
import { useDictQuery } from "@/utils/Dict";

const { proxy } = getCurrentInstance();


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
    return getList(val);
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
      if (val?.obCode) {
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
function onSelectionChange(selection) {
  if (selection) {
    selectData.value = {
      searchOptions: obSearchList.value,
      selection,
    };
  }
}
// const handleSelectionChange = (selection, row) => {
//   if (selection) {
//     selectData.value = {
//       searchOptions: obSearchList.value,
//       selection,
//     };
//   }
// };
const saveBtn = () => {
  groupVisible.value = false;
  emit("selectData", selectData.value);
};
</script>
<style lang="scss" scoped></style>
