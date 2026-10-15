<template>
  <div class="app-container">
    <el-pro-table
      :columns="tableJsonList"
      :request="getList"
      :sort-remote="false"
      :editable="false"
      :default-search-form="defaultSearchForm"
      :show-action="false"
      :toolbar-config="toolbarConfig"
      :merge-config="mergeConfig"
      @action="onAction"
      :before-search-submit="beforeSearchFormat"
      tableId="transfer-query"
      border
      :grid-options="{ spanMethod, rowId: 'csdId' }"
    />
  </div>
</template>

<script setup>
import {
  rmstorInternalQueryExport,
  rmstorInternalQueryList,
} from "@/api/warehouse/rmstorInternal";

import { columns, toolbarConfig } from "./tableJson";

const { proxy } = getCurrentInstance();
const columnsData = ref([]);
const tableJsonList = ref([]);
const lastSearchQuery = ref(null);

async function init() {
  try {
    columnsData.value = await columns();
    tableJsonList.value = columnsData.value.map(a => ({ ...a }));
  } catch (e) {
    console.warn('加载 columns 配置失败:', e);
    tableJsonList.value = [];
  }
}
init();
const mergeConfig = {
  fields: ['flag','billCode', 'ptPlantName', 'ptWhName', 'ptPartitionName', 'prePlantName', 'preWhName', 'prePartitionName', 'makeDate', 'comments'],
  fieldsMode: 'and'
}
const defaultSearchForm = ref({});
const beforeSearchFormat = (params) => {
  const nextParams = proxy.addDateRange(params, params.makeDate, "makeDate");
  delete nextParams.makeDate;
  return nextParams;
};
const getList = async (params) => {
  lastSearchQuery.value = { ...params };
  const {
    data: { list, total },
  } = await rmstorInternalQueryList(params);
  return { data: list, total: total, success: true };
};

const spanMethod = ({ row, column, rowIndex, columnIndex }) => {
  // if (["flag"].includes(prop)) {
  //   return 
  // }
  return { rowspan: 1, colspan: 1 };
};
const onAction = (payload) => {
  const { code } = payload;
  const eventObj = {
    export: () => {
      if (!lastSearchQuery.value) return;
      proxy.$download.name(rmstorInternalQueryExport, { ...lastSearchQuery.value });
    },
    link: () => {
      // handleClickLink(name, row)
    },
  };
  eventObj[code] && eventObj[code]();
};
</script>
