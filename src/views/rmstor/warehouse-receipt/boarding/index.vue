<template>
  <div class="app-container app-container-splitpanes warehouse-receipt-board">
    <el-row :gutter="20" class="app-container-row integrated-manage-pane-form integrated-manage-pane-form-a">
      <el-col :key="tableKey" class="app-container-col board-search-table">
        <el-pro-table
          :columns="[...columns]"
          :data="tableData"
          :pagination="pagination"
          :pager-config="pagerConfig"
          action-width="80"
          :total="total"
          :toolbar-config="toolBarConfig"
          :search-collapse-threshold="12"
          :show-checkbox="true"
          :keep-selection="true"
          :gridOptions="{rowId: 'ibBillCode'}"
          :defaultSearchForm="defaultSearchForm"
          ref="tableRef"
          v-loading="loading"
          @action="handleAction"
          @search="tableSearch"
          @reset="tableReset"
          @selectionChange="handleSelectionChange"
          @sortChange="sortChange"
        >
        </el-pro-table>
      </el-col>
    </el-row>
    <detail-dialog @dialogClose="detailDialogClose" title="入库单详情" :visible="detailVisible" :currentData="currentData" width="90%" />
    <print-dialog ref="printRef" />
  </div>
</template>

<script setup>
import detailDialog from "./components/detailDialog.vue";
import { selectPlantDict } from "@/api/warehouse/plantDict.js";
import { getwarehouseByUserAndPlant } from "@/api/warehouse/warehouseDict.js"; // {plantCode: xx}
import { getWarehousePartition } from "@/api/warehouse/partition.js"; // {depotCode: xx}
import { dictCateList } from "@/api/system/common.js";
import { getInboundList, inboundCreateCard, inboundDeleteCard} from "@/api/rmstor/inbound";
import { ElMessage } from "element-plus";
import printDialog from "../maintain/components/printDialog.vue";
import { getCookie } from "@/utils/auth";
import { getMonthCloseList } from "@/api/settlementFile/monthCloseGroup";
import { parseTime, getMonthStartEnd } from "@/utils/generalMethod.js";
import { whReceiptSourceArr, whReceiptStatusArr } from "@/utils/dictionary";
import { mainReceiverUnit } from '@/api/warehouse/externalTransfer';

const { proxy } = getCurrentInstance();
const yearMonth = getCookie('warehouseGetYear') ? JSON.parse(getCookie('warehouseGetYear')).yearMonth ? JSON.parse(getCookie('warehouseGetYear')).yearMonth : parseTime(new Date(), '{y}{m}') : parseTime(new Date(), '{y}{m}');
const loginDate = getCookie('warehouseYearMonth') ? parseTime(getCookie('warehouseYearMonth'), '{y}{m}') : parseTime(new Date(), '{y}{m}');
const loginDate2 = getCookie('warehouseYearMonth') ? getCookie('warehouseYearMonth') : parseTime(new Date(), '{y}-{m}-{d}');
const printRef = ref(null);
const showSearch = ref(true);
const formRef = ref(null);
const formSelectData = ref({
  plantCode: [],
  depotCode: [],
  partitionCode: [],
  taxFlagCode: [],
});
const loading = ref(false);
const queryParams = ref({
  pageNum: 1,
  pageSize: 30,
  isAsc: "",
  orderByColumn: ""
});
const tableData = ref([]);
const total = ref(0);
const tableSelectedData = ref([]);
const currentData = ref({});

const detailVisible = ref(false);
const monthlySettlement = ref({});

const tableRef = ref(null);
const tableKey = ref(0);

const supplierData = ref([]);
const supplierDataTotal = ref(0);

const orderDateDefault = ref([]);

const startEnd = getMonthStartEnd(yearMonth);
if (startEnd.firstDay && startEnd.lastDay) {
  orderDateDefault.value = [parseTime(startEnd.firstDay, "{y}-{m}-{d}"), parseTime(startEnd.lastDay, "{y}-{m}-{d}")];
}

const defaultSearchForm = {
  orderDate: orderDateDefault.value,
}

const getTaxFlags = async () => {
  try {
    const res = await dictCateList({
      code: "tax_flag"
    });
    formSelectData.value.taxFlagCode = res.data ? res.data.length ? res.data.map(item => ({label: item.name, value: item.code})) : [] : [];
    return [...formSelectData.value.taxFlagCode];
  } catch (error) {
    
  }
}

const getPlantData = async () => {

  try {
    const res = await selectPlantDict();
    formSelectData.value.plantCode = res.data ? res.data.length ? res.data.map(item => ({ label: `${item.plantName}`, value: { code: item.plantCode, id: item.id} })) : [] : [];
    return [...formSelectData.value.plantCode];
  } catch (error) {
    console.log(error);
  }  

}

const getWareHouesData = async ({form, changedField, setFieldValue, setFieldProps}) => {
  try {
    
    if (!!!form.plantCode) {
      setFieldValue('depotCode', undefined);
      setFieldProps('depotCode', { options: [] });
    } else {
      const res = await getwarehouseByUserAndPlant({
        plantId: form.plantCode.id,
      });
      formSelectData.value.depotCode = res.data ? res.data.length ? res.data.map(item => ({ label: `${item.whName}`, value: { code: item.whCode, id: item.id} })) : [] : [];
      setFieldValue('depotCode', undefined);
      setFieldProps('depotCode', { options: formSelectData.value.depotCode });
    }
  } catch (error) {
    
  }
}

const getPartitionWHData = async ({form, changedField, setFieldValue, setFieldProps}) => {
  try {
    if (!!!form.depotCode) {
      setFieldValue('partitionCode', undefined);
      setFieldProps('partitionCode', { options: [] });
    } else {
      const res = await getWarehousePartition({
        whId: form.depotCode.id,
      });
      formSelectData.value.partitionCode = res.data ? res.data.length ? res.data.map(item => ({ label: `${item.partitionName}`, value: { code: item.partitionCode, id: item.id} })) : [] : [];
      setFieldValue('partitionCode', undefined);
      setFieldProps('partitionCode', { options: formSelectData.value.partitionCode });
    }
  } catch (error) {
    
  }
}

const getSupplyData = async () => {
  try {
    const res = await mainReceiverUnit({
      pageNum: 1,
      pageSize: 30,
    });
    supplierData.value = res.data?.list || [];
    supplierDataTotal.value = res.data?.total || 0;
    tableKey.value++;
  } catch (error) {
    console.log(error);
  }
}


const columns = computed(() => [
  { field: "ibBillCode", title: "入库单号", minWidth: 200, align: "center", type: "link", sortable: true, searchable: true, searchType: "input", },
  { field: "invoiceCode", title: "发票号", minWidth: 200, align: "center", searchable: false, },
  { field: "ibSource", title: "来源", hideInTable: true, searchable: true, searchType: "select", searchProps: {
    options: whReceiptSourceArr,
  }},
  { field: "supUnitName", title: "供货单位", minWidth: 240, align: "center", searchable: true,  searchType: "tableSelect", searchProps: {
    placeholder: "请选择 供货单位",
    columns: [
      { prop: "unitCode", label: "往来单位编码", minWidth: 200, align: "center",},
      { prop: "unitName", label: "往来单位名称", minWidth: 200, align: "center",},
      { prop: "type", label: "往来单位类型", minWidth: 140, align: "center",},
    ],
    valueKey: "unitCode",
    labelKey: "unitName",
    data: supplierData.value,
  },},
  { field: "taxFlagCode", title: "应税用途", minWidth: 140, align: "center", searchable: true, searchType: "select", searchProps: {}, requestOptions: getTaxFlags, render: (row) => row.taxFlagName},
  { field: "bmName", title: "业务员", minWidth: 140, align: "center", searchable: false, },
  { field: "plantCode", title: "用料地区", minWidth: 200, align: "center", searchable: true, searchType: "select", requestOptions: getPlantData, searchProps: {
    valueKey: "id",
  }, render: (row) => row.plantName, },
  { field: "depotCode", title: "仓库", minWidth: 200, align: "center", searchable: true, searchType: "select", searchProps: {
    options: [],
    valueKey: "id",
  }, dependsOn: ["plantCode"], onDependencyChange: getWareHouesData, render: (row) => row.depotName},
  { field: "partitionCode", title: "仓库分区", minWidth: 200, align: "center", searchable: true, searchType: "select", searchProps: {
    options: [],
    valueKey: "id",
  }, dependsOn: ["depotCode"], onDependencyChange: getPartitionWHData, render: (row) => row.partitionName},
  { field: "flag", title: "单据状态", minWidth: 140, align: "center", searchable: true, searchType: "select", searchProps: {
    options: whReceiptStatusArr,
  }, render: (row) => row.flag === "2" ? "已登卡" : "未登卡"},
  { field: "matlCode", title: "物资编码", searchable: true, searchType: "input", hideInTable: true },
  { field: "matlName", title: "物资名称", searchable: true, searchType: "inpt", hideInTable: true },
  { field: "matlType", title: "规格类型", searchable: true, searchType: "input", hideInTable: true },
  { field: "orderDate", title: "下单日期", minWidth: 140, align: "center", type: "date", searchable: true, searchType: "dateRange",},
  { field: "noteDate", title: "登卡日期", minWidth: 140, align: "center", type: "date", searchable: false, },
  { field: "matlAmount", title: "料款（元）", minWidth: 160, align: "center", searchable: false, type: "number" },
]);

const pagination = {current: queryParams.value.pageNum, pageSize: queryParams.value.pageSize, total: total.value, pageSizes: [10, 20, 30, 50]};

const pagerConfig = { pageSizes: [10, 20, 30, 50], pageSize: queryParams.value.pageSize };

const toolBarConfig = {
  buttons: [
    { code: 'add', name: "登卡", type: "primary", showInRow: false, showInTop: true },
    { code: 'revoke', name: "撤销登卡", type: "primary", showInRow: false, showInTop: true },
    { code: 'print', name: "打印", type: "primary", showInRow: true, showInTop: false },
  ]
}

const getList = async (params = {}) => {
  loading.value = true;

  try {
    const res = await getInboundList({
      ...queryParams.value,
      ...params,
      supUnitName: params.supUnitName?.label || "",
      supUnitCode: params.supUnitName?.unitCode || "",
      plantCode: params.plantCode?.code || "",
      depotCode: params.depotCode?.code || "",
      partitionCode: params.partitionCode?.code || "",
      orderDateBegin: params.orderDate?.length ? params.orderDate[0] : "",
      orderDateEnd: params.orderDate?.length ? params.orderDate[1] ? params.orderDate[1] : "" : "",
      orderDate: "",
      orderBy: "",
      yearMonth: "",
    });
    tableData.value = res.data?.list || [];
    total.value = res.data?.total || 0;
  } catch (error) {
    console.log(error);
  }

  loading.value = false;
}

const handleBoard = async () => {
  
  try {
    
    let accFlag = true;
    let accFlag2 = true;
    const arr = [];
    for (const item of tableSelectedData.value) {

      if (parseTime(item.orderDate, '{y}{m}') !== loginDate) {
        arr.push(item.ibBillCode);
        accFlag = false;
      }

      if (item.flag === "2") {
        accFlag2 = false;
      }
    }
    if (arr.length) {
      ElMessage.error(`入库单${arr.join("、")}不是当前月份单据，不允许登卡！`);
    }
    if (!accFlag2) {
      ElMessage.error("选中行必须全为未登卡状态的入库单！");
    }
    if (!accFlag || !accFlag2) return;
    
    loading.value = true;
    const res = await inboundCreateCard({
      ibmtIds: tableSelectedData.value.map(item => item.ibmtId),
      yearMonth,
      loginDate: loginDate2,
    });
    ElMessage.success("登卡成功！");
    await getList({...tableRef.value.getSearchForm()});
    tableRef.value.clearSelection();
  } catch (error) {
    
  }
  loading.value = false;
}

const handleRevokeBoard = async () => {
  
  try {
    let accFlag = true;
    let accFlag2 = true;
    const arr = [];

    for (const item of tableSelectedData.value) {

      if (parseTime(item.orderDate, '{y}{m}') !== loginDate) {
        arr.push(item.ibBillCode);
        accFlag = false;
      }

      if (item.flag === "0" || item.flag === "1" ) {
        accFlag2 = false;
      }
    }

    if (arr.length) {
      ElMessage.error(`入库单${arr.join("、")}不是当前月份单据，不允许撤销登卡！`)
    }
    if (!accFlag2) {
      ElMessage.error("选中行必须全为已登卡状态的入库单！");
    }
    if(!accFlag || !accFlag2) return;

    loading.value = true;

    const res = await inboundDeleteCard({
      ibmtIds: tableSelectedData.value.map(item => item.ibmtId),
      yearMonth,
      loginDate: loginDate2,
    });
    ElMessage.success("撤销登卡成功！");
    await getList({...tableRef.value.getSearchForm()});
    tableRef.value.clearSelection();
  } catch (error) {
    
  }

  loading.value = false;
}

// table项选择变化
const handleSelectionChange = (data) => {
  tableSelectedData.value = [...data];
}

const detailDialogClose = () => {
  currentData.value = {};
  detailVisible.value = false;
}

const getMonthlySettlement = async () => {
  try {
    const res = await getMonthCloseList({
      yearMonth,
    });
    monthlySettlement.value = res.data?.list ? res.data.list.length ? res.data.list[0] : {} : {}
  } catch (error) {
    
  }
}

const handleRowStyle = (row, index) => {
  
  if (row.backFlag === "1") {
    return { color: "red" };
  }

  return {};
}

const handleAction = ({code, name, row}) => {
  if (code === "add") {
    if (!!!tableSelectedData.value.length) {
      ElMessage.error("请选择数据！");
      return;
    }
    handleBoard();
  }

  if (code === "revoke") {
    if (!!!tableSelectedData.value.length) {
      ElMessage.error("请选择数据！");
      return;
    }
    handleRevokeBoard();
  }

  if (code === "print") {
    currentData.value = {...row};
     printRef.value.show([scope.row.ibmtId]);
  }

  if (code === "link" && name === "ibBillCode") {
    currentData.value = {...row};
    detailVisible.value = true;
  }
}

const tableSearch = (form, pageInfo) => {
  queryParams.value.pageNum = pageInfo.page;
  queryParams.value.pageSize = pageInfo.pageSize;

  getList(form);
}

const tableReset = () => {
  queryParams.value.pageNum = 1;
  queryParams.value.isAsc = "";
  queryParams.value.orderByColumn = "";
  tableRef.value.getTableInstance().clearSort();
  // tableRef.value.clearSelection();

  tableRef.value.reload();
}

const sortChange = ({field, order}) => {
  if (field === "ibBillCode") {
    queryParams.value.orderByColumn = "ibBillCode";
    if (order === "ascending") {
      queryParams.value.isAsc = "asc";
    }
    if (order === "descending") {
      queryParams.value.isAsc = "desc";
    }
    getList({...tableRef.value.getSearchForm()});
  }
}

onBeforeMount(async () => {
  try {
    await getSupplyData();
    getMonthlySettlement();
    getPlantData();
    getTaxFlags();
  } catch (error) {
  }
})

onMounted(async () => {
  tableRef.value.reload();
})
</script>

<style lang="scss" scoped>
.warehouse-receipt-board {
  overflow: auto;
  .board-search-table {
    padding-top: 10px;
    :deep(.ep-pro-table) {
      height: 100%;
      .ep-pro-table__wrapper {
        height: 100%;
        .ep-pro-table__body {
          height: calc(100% - 398px);
        }
      }
    }
  }
}
</style>