<template>
  <div class="app-container">
    <el-pro-table
      ref="tableRef"
      v-model:view-mode="currentView"
      :view-tabs="viewTabs"
      :columns="tableJsonList"
      :request="getList"
      :sort-remote="false"
      :editable="false"
      :default-search-form="defaultSearchForm"
      :show-action="currentView === VIEW_TYPE.DE"
      :toolbar-config="currentTableConfig.toolbarConfig"
      @action="onAction"
      :before-search-submit="beforeSearchFormat"
      tableId="stock-query"
      :summary-data="summaryData"
      @view-mode-change="onViewModeChange"
      view-keep-alive
      border
      :grid-options="{ rowId: 'uid' }"
    />
  </div>
</template>

<script setup>

import {
  comprehensiveSearch,
  comprehensiveSearchStat,
  exportComprehensiveSearch,
} from "@/api/reserve-quote/stock-entry";
import { generateUUID, getMOnthOffset } from "@/utils";

import bigKind_tableJson from "./bigKind_tableJson";
import detail_tableJson from "./detail_tableJson";
import group_tableJson from "./group_tableJson";
import groupDetail_tableJson from "./groupDetail_tableJson";
import matlCode_tableJson from "./matlCode_tableJson";
import month_tableJson from "./month_tableJson";
import partition_table from "./partition_table";
import partitionDetail_tableJson from "./partitionDetail_tableJson";
import stockAttr_tableJson from "./stockAttr_tableJson";
import stockCheck_tableJson from "./stockCheck_tableJson";



import { computed } from "vue";

const { proxy } = getCurrentInstance();

const VIEW_TYPE = {
  DE: "detail",
  GR: "group",
  PA: "partition",
  GD: "groupDetail",
  PD: "partitionDetail",
  MC: "matlCode",
  MT: "month",
  SC: "stockCheck",
  SA: "stockAttr",
  BK: "bigKind",
};
const TABLE_JSON = {
  [VIEW_TYPE.DE]: detail_tableJson,
  [VIEW_TYPE.GR]: group_tableJson,
  [VIEW_TYPE.PA]: partition_table,
  [VIEW_TYPE.GD]: groupDetail_tableJson,
  [VIEW_TYPE.PD]: partitionDetail_tableJson,
  [VIEW_TYPE.MC]: matlCode_tableJson,
  [VIEW_TYPE.MT]: month_tableJson,
  [VIEW_TYPE.SC]: stockCheck_tableJson,
  [VIEW_TYPE.SA]: stockAttr_tableJson,
  [VIEW_TYPE.BK]: bigKind_tableJson,
};

const viewTabs = [
  { label: "明细", value: VIEW_TYPE.DE },
  { label: "仓库汇总", value: VIEW_TYPE.GR },
  { label: "仓库分区汇总", value: VIEW_TYPE.PA },
  { label: "仓库汇总(含单据)", value: VIEW_TYPE.GD },
  { label: "仓库分区汇总(含单据)", value: VIEW_TYPE.PD },
  { label: "物资编号", value: VIEW_TYPE.MC },
  { label: "每月结存", value: VIEW_TYPE.MT },
  { label: "库存核对", value: VIEW_TYPE.SC },
  { label: "库存属性", value: VIEW_TYPE.SA },
  { label: "大类", value: VIEW_TYPE.BK },
];
const currentView = ref(VIEW_TYPE.DE);
const summaryData = ref([]);
const tableRef = ref();
const columnsData = ref([]);
const tableJsonList = ref([]);

const defaultSearchForm = ref({
  cutCount: 2,
  dateRange: [getMOnthOffset(0), getMOnthOffset(1)],
});

const currentTableConfig = computed(() => {
  const { toolbarConfig, summaryField } =
    TABLE_JSON[currentView.value];
  summaryData.value = summaryField || [];

  return { toolbarConfig };
});

// await async columns 函数后再赋值，避免 ProTable 收到函数引用而非数组
watch(currentView, async (val) => {
  const tableJson = TABLE_JSON[val];
  try {
    columnsData.value = await tableJson.columns();
    tableJsonList.value = columnsData.value.map(a => ({ ...a }));
  } catch (e) {
    console.warn('加载 columns 配置失败:', e);
    tableJsonList.value = [];
  }
}, { immediate: true });

const beforeSearchFormat = (params) => {
  if (!!params.dateRange && !!params.dateRange.length) {
    params.yearMonthBegin = params.dateRange[0].replace("-", "");
    params.yearMonthEnd = params.dateRange[1].replace("-", "");
  }
  delete params.dateRange;
  return params;
};
const onViewModeChange = (val) => {
  tableRef.value.reload();
};
const getList = async (params) => {
  const query = { ...params, queryType: currentView.value };
  const {
    data: { list, total },
  } = await comprehensiveSearch(query);
  const { data } = await comprehensiveSearchStat(query);
  summaryData.value = summaryData.value.map(({ field, ...other }) => ({
    ...other,
    field,
    value: `${data[field] || 0}元`,
  }));
  const result = {
    data: list.map((item) => ({ ...item, uid: generateUUID() })),
    total: total,
    success: true,
  };
  return result;
};

const onAction = (payload) => {
  const { name, code, row, files, searchForm } = payload;
  const query = { ...searchForm, queryType: currentView.value };
  const eventObj = {
    export: () => {
      proxy.$download.name(exportComprehensiveSearch, query);
    },
    docs: () => {
      proxy.$modal.alert(
        `<div>
        <p><strong>1.金额合计：</strong>当月期初金额 + 当月收入金额 - 当月支出金额 + 当月调整金额 = 当月期末金额</p>
        <p><strong>2.数量合计：</strong>当月期初金额 + 当月收入金额 - 当月支出金额 + 当月调整金额 = 当月期末金额</p>
       <p><strong>3.当月收支存与单据间对应关系：</strong></p>
       <ul>
        <li>①收入 --> 入库单 + 退料单</li>
        <li>②支出 --> 出库单 + 调拨单</li>
        <li>③调整 --> 移库单移入 - 移库单移出 + 调整单</li>
        </ul>
         <p><strong>4.库存金额核对：</strong>期初金额合计 = 调价料差 + 期初金额</p>
        </div>`,
        "计算公式",
        { dangerouslyUseHTMLString: true }
      );
    },
  };
  eventObj[code] && eventObj[code]();
};
</script>
