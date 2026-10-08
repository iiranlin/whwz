<!-- 结转前单据检查 -->
<template>
  <div class="app-container app-container-splitpanes">
    <el-row :gutter="20" class="app-container-row integrated-manage-pane-form integrated-manage-pane-form-a">
      <el-col class="app-container-col">
    <el-pro-table
      ref="proTableRef" 
      :columns="columns"
      :page-size="queryParams.pageSize"
      :toolbar-config="toolbarConfig"
      :search-collapse-threshold="3"
      :default-search-form="defaultSearchForm"
      @action="onAction"
      :data="tableData"
      :total="total"
      @search="handleQuery"
      :show-checkbox="true"
      :selection-mode="'multiple'"
      :keep-selection="true"
      :grid-options="{ rowId: 'billId' }"
    >
      <template #billCode-cell="{ row }">
        <el-link type="primary" @click="handleClickLink(row)">{{ row.billCode }}</el-link>
      </template>
    </el-pro-table>
    </el-col>
    </el-row>
    <!-- 出库单 -->
    <outbound-detail ref="outboundDetail" @createSuccess="getList" />
    <!-- 入库单 -->
    <warehouse-detail
      @dialogClose="detailDialogClose"
      title="入库单详情"
      :visible="detailVisible"
      :currentData="currentData"
      width="90%"
    />
    <!-- 数量管理入库单 -->
    <quantity-warehouse-detail ref="quantityWarehouseDetail" @createSuccess="getList" />
    <!-- 数量管理出库单 -->
    <quantity-outbound-detail ref="quantityOutboundDetail" @createSuccess="getList" />
    <!-- 内部调拨单 -->
    <internal-detail ref="internalDetail" @createSuccess="getList" />
    <!-- 对外调拨单 -->
    <external-detail ref="externalDetail" @createSuccess="getList" />
    <!-- 退料单 -->
    <material-detail v-model="playBatchVisible" :rowData="rowData" />
    <!-- 调整单 -->
    <adjust-detail ref="adjustDetail" @createSuccess="getList" />
    <!-- 调价单 -->
    <price-detail ref="priceDetail" @createSuccess="getList" />
  </div>
</template>

<script setup name="preCarryBillAudit">
import { formJson } from "./formJson";
import { tableJson, toolbarConfig } from "./tableJson";
import { getLocalStorage } from "@/utils/auth";
import { getPreCarryBillAuditList } from "@/api/settlementFile/preCarryBillAudit";
import { onMounted } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import { getCookie } from "@/utils/auth";
import { useDict } from "@/utils/Dict";
import OutboundDetail from "./components/outboundDetail.vue";
import WarehouseDetail from "./components/warehouseDetail.vue";
import QuantityWarehouseDetail from "./components/quantityWarehouseDetail.vue";
import QuantityOutboundDetail from "./components/quantityOutboundDetail.vue";
import InternalDetail from "./components/internalDetail.vue";
import ExternalDetail from "./components/externalDetail.vue";
import MaterialDetail from "./components/materialDetail.vue";
import AdjustDetail from "./components/adjustDetail.vue";
import PriceDetail from "./components/priceDetail.vue";

const { proxy } = getCurrentInstance();
const columns = tableJson;
const height = 460;

const tableJsonArr = ref(
  JSON.parse(getLocalStorage(proxy.$route.meta?.menuId)) || tableJson
);
const tableData = ref([]);
const loading = ref(false);
const showSearch = ref(true);
const ids = ref([]);
const selectionData = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const idName = ref("billCode");
const detailVisible = ref(false);
const currentData = ref({});
const rowData = ref([]);

// 财务年月统一转 yyyyMM（兼容登录月份 yyyy-MM/yyyyMM 与月份选择器值），供后端按 YEAR_MONTH 过滤
const formatYearMonth = (val) => {
  const s = String(val ?? "").trim();
  if (!s) return "";
  let m = s.match(/^(\d{4})-(\d{1,2})/);
  if (m) return m[1] + (m[2].length < 2 ? "0" + m[2] : m[2]);
  m = s.match(/^(\d{4})(\d{2})/);
  if (m) return m[1] + m[2];
  return s;
};

const defaultYm = formatYearMonth(getCookie("warehouseYearMonth"));

const data = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 30,
    yearMonth: defaultYm,
  },
  formSelectData: {
    isNoStorageAllotFlag: [{ value: "0", label: "未登卡" }],
  },
});

const { queryParams, formSelectData } = toRefs(data);
const selectList = ref([]);
const { dictList, dictMap } = useDict("pre_carry_type");
selectList.value = dictList;

const defaultSearchForm = {
  // 展示给月份选择器的值为 YYYY-MM（查询时 handleQuery 再统一转 yyyyMM）
  yearMonth: defaultYm ? `${defaultYm.slice(0, 4)}-${defaultYm.slice(4)}` : "",
};

/** 查询列表 */
const getList = async () => {
  loading.value = true;
  let params = {
    ...queryParams.value,
  };
  getPreCarryBillAuditList(params)
    .then(({ data }) => {
      tableData.value = data.list || [];
      total.value = data.total;
    })
    .finally(() => {
      loading.value = false;
    });
};

// /** 重置按钮操作 */
// const resetQuery = (data) => {
//   handleQuery(data);
//   proxy.$refs.formdataRef.formData = {
//     yearMonth: getCookie("warehouseYearMonth"),
//     isNoStorageAllotFlag: "0",
//   };
//   formSelectData.value.isNoStorageAllotFlag = [{ value: "0", label: "未登卡" }];
// };

// const handleSelectChange = (prop, value) => {
//   if (prop === "billType") {
//     const isDiaoBo = value === "调拨(销售)单";
//     const flagOptions = [{ value: "0", label: "未登卡" }];
//     if (isDiaoBo) {
//       flagOptions.push({ value: "1", label: "当月末入库调拨单" });
//     }
//     formSelectData.value.isNoStorageAllotFlag = flagOptions;
//     if (!isDiaoBo && formData.isNoStorageAllotFlag === "1") {
//       formData.isNoStorageAllotFlag = "";
//     }
//   }
// };

/** 查询/重置/翻页统一入口：接收 pro-table 的检索条件与分页参数，合并进 queryParams 后请求 */
const handleQuery = (params = {}, pager = {}) => {
  const query = { ...queryParams.value };
  Object.keys(params).forEach((k) => {
    const v = params[k];
    if (v === "" || v === null || v === undefined) {
      delete query[k];
    } else {
      query[k] = k === "yearMonth" ? formatYearMonth(v) : v;
    }
  });
  query.pageNum = pager.pageNum || query.pageNum || 1;
  query.pageSize = pager.pageSize || query.pageSize || 30;
  queryParams.value = query;
  getList();
};

function handleSelectionChange(selection) {
  selectionData.value = selection;
  ids.value = selection.map((item) => item[idName.value]);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

const playBatchVisible = ref(false);
const handleButtonClick = (code, data) => {
  const eventObj = {};
  eventObj[code] && eventObj[code]();
};

const handleClickLink = (row) => {
  switch (row.billType) {
    case "出库单":
      proxy.$refs.outboundDetail.show("details", row);
      break;
    case "入库单":
      currentData.value = { ...row };
      detailVisible.value = true;
      break;
    case "数量管理入库单":
      proxy.$refs.quantityWarehouseDetail.show("details", row);
      break;
    case "数量管理出库单":
      proxy.$refs.quantityOutboundDetail.show("details", row);
      break;
    case "移库单":
      proxy.$refs.internalDetail.show("details", row);
      break;
    case "调拨(销售)单":
      proxy.$refs.externalDetail.show("details", row);
      break;
    case "退料单":
      playBatchVisible.value = true;
      rowData.value = row;
      break;
    case "调整单":
      proxy.$refs.adjustDetail.show("details", row);
      break;
    case "调价单":
      proxy.$refs.priceDetail.show("details", row);
      break;
  }
};

const detailDialogClose = () => {
  currentData.value = {};
  detailVisible.value = false;
};

onMounted(() => {
  getList();
  // proxy.$refs.formdataRef.formData = {
  //   yearMonth: getCookie("warehouseYearMonth"),
  //   isNoStorageAllotFlag: "0",
  // };
});
</script>
<style lang="scss" scoped>
.form-data {
  height: 100px;
  margin-top: 10px;
}

.search-btn {
  width: 74px;
  height: 28px;
  padding: 0;
  border-radius: 3px;
  text-align: center;
  background-color: #64a1ff;
  border-color: #64a1ff;
}

.reset-btn {
  width: 74px;
  height: 28px;
  padding: 0;
  border-radius: 3px;
  text-align: center;
  background-color: #e6e6e6;
  border-color: #64a1ff;

  &:hover {
    color: #64a1ff;
  }
}
</style>
