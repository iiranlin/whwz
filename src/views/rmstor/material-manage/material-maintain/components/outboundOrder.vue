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
              :defaultExpand="true"
              :gridColCount="3"
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
                    filterable
                    :filter-method="filterMethod"
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
            <!-- 91-明细分页：:key 切换出库单时整体重建表格，清空上一单勾选；reserve-selection 支持跨页勾选记忆 -->
            <table-index
              ref="tableRef"
              :key="reloadKey"
              class="table-index"
              :loading="loading"
              :idName="idName"
              :queryParams="queryParams"
              :tableJson="tableJsonArr"
              :selectionShow="true"
              :reserve-selection="true"
              :tableData="tableData"
              @handleSelectionChange="handleSelectionChange"
              operationWidth="150"
            >
            </table-index>
            <!-- 91-明细分页：本地分页条，翻页仅前端切片，不重新请求 -->
            <pagination
              v-show="detailTotal > 0"
              :total="detailTotal"
              v-model:page="queryParams.pageNum"
              v-model:limit="queryParams.pageSize"
              :auto-scroll="false"
              @pagination="handlePageChange"
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
const allSearchOptions = ref([]);
const searchValue = ref("");
const searchLoading = ref(false);

const filterMethod = (query) => {
  if (query) {
    searchOptions.value = allSearchOptions.value.filter(item =>
      item.obCode && item.obCode.toLowerCase().includes(query.toLowerCase())
    );
  } else {
    searchOptions.value = allSearchOptions.value;
  }
};

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
// 91-明细分页：当前出库单全量可退料明细（tableData 为其按页切片）
const allRows = ref([]);
// 91-明细分页：明细表格 key，切换出库单时自增以重建表格清空勾选
const reloadKey = ref(0);
const detailTotal = computed(() => allRows.value.length);
const loading = ref(false);
const tableRef = ref();
const idName = ref("obdtId");
const selectData = ref({});
// 91-跨页勾选：累计已选明细集合（按 obdtId 记忆），翻页不丢
const selectedMap = new Map();

const title = ref("出库单");

const data = reactive({
  queryParams: {
    // 91-明细分页：默认每页 30 条，翻页本地切片
    pageNum: 1,
    pageSize: 30,
  },
  formSelectData: {},
});

const { queryParams, formSelectData } = toRefs(data);

const emit = defineEmits(["createSuccess", "selectData"]);
const dialogType = ref("");

// 出库单明细（91-明细分页：全量加载后按页切片展示）
const spdListPage = async (val) => {
  await maintainListByObCode(val).then(({ data }) => {
    allRows.value = data || [];
    queryParams.value.pageNum = 1;
    refreshDetailPage();
  });
};
// 91-明细分页：按当前页码/页大小切分明细
const refreshDetailPage = () => {
  const pageNum = queryParams.value.pageNum || 1;
  const pageSize = queryParams.value.pageSize || 30;
  const start = (pageNum - 1) * pageSize;
  tableData.value = allRows.value.slice(start, start + pageSize);
};
// 91-明细分页：分页条翻页/改每页条数（本地切片，不重新请求）
const handlePageChange = ({ page, limit }) => {
  queryParams.value.pageNum = page;
  queryParams.value.pageSize = limit;
  refreshDetailPage();
};
const obSearchList = ref();
const spdChange = (val) => {
  if (!val) {
    allRows.value = [];
    tableData.value = [];
    selectData.value = {};
    selectedMap.clear();
    reloadKey.value++;
    return getList();
  }

  let res = searchOptions.value.find((item) => val === item.obCode);
  obSearchList.value = res;
  selectData.value = {};
  selectedMap.clear();
  allRows.value = [];
  tableData.value = [];
  reloadKey.value++;
  spdListPage({ obmtId: res.obmtId });
};

const getList = async (val = {}) => {
  loading.value = true;
  await maintainListMtObCode(queryParams.value)
    .then(({ data }) => {
      searchOptions.value = data || [];
      allSearchOptions.value = data || [];
      if (val.obCode && searchOptions.value.length) {
        searchValue.value = data[0].obCode;
        selectData.value = {};
        selectedMap.clear();
        reloadKey.value++;
        spdListPage({ obmtId: data[0].obmtId });
      }
    })
    .finally(() => {
      loading.value = false;
      if (searchOptions.value.length < 1) {
        searchValue.value = "";
        allRows.value = [];
        tableData.value = [];
        selectData.value = {};
        selectedMap.clear();
        reloadKey.value++;
      }
    });
};

/** 查询按钮操作 */
const handleQuery = (data) => {
  queryParams.value = Object.assign({}, queryParams.value, data);
  getList(data);
};
/** 重置按钮操作 */
function resetQuery(data = {}) {
  handleQuery(data);
  searchValue.value = "";
  allRows.value = [];
  tableData.value = [];
  selectData.value = {};
  selectedMap.clear();
  reloadKey.value++;
  queryParams.value.pageNum = 1;
  formSelectData.value = {};
}

const handleSelectionChange = (selection) => {
  // 91-跨页勾选：以当前页明细做差集，把被取消勾选的行从累计集合移除，同时把其它页已选行保留
  const rows = selection || [];
  const pageKeys = new Set(tableData.value.map((item) => item[idName.value]));
  const selKeys = new Set(rows.map((item) => item[idName.value]));
  pageKeys.forEach((key) => {
    if (!selKeys.has(key)) {
      selectedMap.delete(key);
    }
  });
  rows.forEach((item) => selectedMap.set(item[idName.value], item));
  selectData.value = {
    searchOptions: obSearchList.value,
    selection: Array.from(selectedMap.values()),
  };
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
