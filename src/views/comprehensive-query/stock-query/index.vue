<template>
  <div class="app-container">
    <el-tabs v-model="currentView" class="stock-query-tabs" @tab-change="onViewModeChange">
      <el-tab-pane
        v-for="tab in viewTabs"
        :key="tab.value"
        :label="tab.label"
        :name="tab.value"
      />
    </el-tabs>
    <el-pro-table
      ref="proTableRef"
      :columns="tableJsonList"
      :request="getList"
      :sort-remote="false"
      :editable="false"
      :default-search-form="defaultSearchForm"
      :show-action="currentView === VIEW_TYPE.DE"
      :toolbar-config="currentTableConfig.toolbarConfig"
      @action="onAction"
      :before-search-submit="beforeSearchFormat"
      :footer-config="footerConfig"
      tableId="stock-query"
      border
      :grid-options="{ rowId: 'uid' }"
    />
  </div>
</template>

<script setup name="stock-query">
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
import { useTableSummaryFooter } from '@/composables/useTableSummaryFooter'

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
const proTableRef = ref();
const columnsData = ref([]);
const tableJsonList = ref([]);

const { footerConfig } = useTableSummaryFooter({
  summaryData,
  columns: tableJsonList,
  proTableRef,
})

const defaultSearchForm = ref({
  cutCount: 2,
  dateRange: [getMOnthOffset(0), getMOnthOffset(0)],
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
  proTableRef.value.reload();
};
const getList = async (params) => {
  if (!params.yearMonthBegin || !params.yearMonthEnd) {
    params.yearMonthBegin = defaultSearchForm.value.dateRange[0].replace("-", "");
    params.yearMonthEnd = defaultSearchForm.value.dateRange[1].replace("-", "");
  }
  const query = { ...params, queryType: currentView.value };

  // 接口 1：列表数据（空值保护 + 异常隔离）
  let list = [];
  let total = 0;
  try {
    const res = await comprehensiveSearch(query);
    const data = res?.data ?? {};
    list = Array.isArray(data.list) ? data.list : [];
    total = data.total ?? 0;
  } catch (e) {
    console.warn('comprehensiveSearch 调用失败:', e);
  }

  // 接口 2：统计汇总（空值保护 + 异常隔离，不影响列表）
  let statData = {};
  try {
    const res = await comprehensiveSearchStat(query);
    statData = res?.data ?? {};
  } catch (e) {
    console.warn('comprehensiveSearchStat 调用失败:', e);
  }
  summaryData.value = summaryData.value.map(({ field, ...other }) => ({
    ...other,
    field,
    value: `${statData[field] ?? 0}元`,
  }));
  // 无条件返回，ProTable 会覆盖旧数据（空数组也会清空）
  return {
    data: list.map((item) => ({ ...item, uid: generateUUID() })),
    total,
    success: true,
  };
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
        <p><strong>1.金额合计：</strong>当月期初 + 当月收入 - 当月支出 + 当月调整 = 当月期末</p>
        <p><strong>2.数量合计：</strong>当月期初 + 当月收入 - 当月支出 + 当月调整 = 当月期末</p>
       <p><strong>3.当月收支存与单据间对应关系：</strong></p>
       <ul>
        <li>①收入 --> 入库单 + 退料单</li>
        <li>②支出 --> 出库单</li>
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

<style lang="scss" scoped>
.stock-query-tabs {
  margin-bottom: 0px;
  background-color: #f2f3f5;
  :deep(.ep-tabs__header) {
    padding: 0px 10px !important
  }
}
:deep(.ep-pro-table) {
  height: calc(100% - 54px) !important;
}
:deep(.ep-pro-table .ep-pro-table__search-area) {
  border-top: transparent !important;
}
</style>
