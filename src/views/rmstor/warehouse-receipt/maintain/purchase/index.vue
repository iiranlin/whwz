<template>
  <div class="app-container app-container-splitpanes warehouse-receipt-maintain" v-loading="_loading">
    <el-row :gutter="20" class="app-container-row integrated-manage-pane-form integrated-manage-pane-form-a">
      <el-col :key="tableKey" class="app-container-col r-maintain-search-table">
        <el-pro-table
          :columns="columns"
          :data="tableData"
          :pagination="pagination"
          :pagerConfig="pagerConfig"
          :show-action="false"
          action-width="160"
          :total="total"
          :toolbar-config="toolBarConfig"
          :max-visible-buttons="99"
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
          <template #action="{ row }">
            <el-button type="primary" link :disabled="row.flag === '2'" @click="handleAction({code: 'edit', row})">修改</el-button>
            <el-button type="primary" link @click="handleAction({code: 'redReversal', row})">红冲</el-button>
            <el-button v-if="row.flag === '2' && !row.invoiceCode" type="primary" link @click="handleAction({code: 'addInvoiceCode', row})">补充发票号</el-button>
          </template>
        </el-pro-table>
      </el-col>
    </el-row>
    <create-dialog :key="createKey" ibSource="0" @dialogClose="createDialogClose" title="外购入库单新增" :visible="createDialogVisible" width="90%"  />
    <detail-dialog @dialogClose="detailDialogClose" title="外购入库单详情" :visible="detailVisible" :currentData="currentData" width="90%" />
    <edit-dialog :key="editKey" @dialogClose="editDialogClose" title="外购入库单修改" :visible="editVisible" :currentData="currentData" width="90%" />
    <add-invoice-code-dialog :key="addInvoiceCodeKey" @dialogClose="addInvoiceCodeClose" title="外购入库单补充发票号" :visible="addInvoiceCodeVisible" :currentData="currentData" width="90%" />
    <red-reversal-dialog :key="redReversalKey" @dialogClose="redReversalClose" title="外购入库单红冲" :visible="redReversalVisible" :currentData="currentData" width="90%" />
    <print-dialog ref="printRef"/>
    <ep-dialog title="删除" class="receipt-del-dialog" v-model="delVisible" destory-on-close width="45%" @close="delDialogClose">
      <template #default>
        <div style="padding: 12px;" v-loading="delLoading">
          <el-form :model="delForm" :rules="delFormRules" label-position="top" ref="delFormRef">
            <el-form-item label="删除原因：" prop="delReason">
              <el-input v-model="delForm.delReason" type="textarea" placeholder="请输入" :rows="5" :maxlength="200" show-word-limit />
            </el-form-item>
          </el-form>
        </div>
      </template>
      <template #footer>
        <el-button type="primary" @click="delConfirm">删除</el-button>
      </template>
    </ep-dialog>
  </div>
</template>

<script setup name="purchase">
import { pFormJson } from "../formJson";
import { pTableJson, tableButtonJson, topTableButtonJson } from "../tableJson";
import createDialog from "../components/newCreateDialog.vue";
import detailDialog from "../components/newDetail.vue";
import editDialog from "../components/newEdit.vue";
import addInvoiceCodeDialog from "../components/addInvoiceCodeDialog.vue";
import redReversalDialog from "../components/newRedReversalDialog.vue";
import printDialog from "../components/printDialog";
import { selectPlantDict } from "@/api/warehouse/plantDict.js";
import { getwarehouseByUserAndPlant } from "@/api/warehouse/warehouseDict.js"; // {plantCode: xx}
import { getWarehousePartition } from "@/api/warehouse/partition.js"; // {depotCode: xx}
import { dictCateList } from "@/api/system/common.js";
import { getInboundList, inboundDelete, inboundCreateCard, inboundDeleteCard, exportInbound, writeBack, batchGetInbound } from "@/api/rmstor/inbound";
import { ElMessage } from "element-plus";
import { paramConfigList } from "@/api/system/paramConfig.js";
import { getSessionStorage, getCookie } from '@/utils/auth'
import { getMonthCloseList } from "@/api/settlementFile/monthCloseGroup";
import { parseTime, getMonthStartEnd } from "@/utils/generalMethod.js";
import { whReceiptStatusArr } from "@/utils/dictionary";
import { mainReceiverUnit } from '@/api/warehouse/externalTransfer';

const { proxy } = getCurrentInstance();

const byCodeObj = ref(JSON.parse(getSessionStorage('byCodeObj') || '{}')); //权限判断是否显示登卡按钮（1：隐藏）
const yearMonth = getCookie('warehouseGetYear') ? JSON.parse(getCookie('warehouseGetYear')).yearMonth ? JSON.parse(getCookie('warehouseGetYear')).yearMonth : parseTime(new Date(), '{y}{m}') : parseTime(new Date(), '{y}{m}');
const loginDate = getCookie('warehouseYearMonth') ? parseTime(getCookie('warehouseYearMonth'), '{y}{m}') : parseTime(new Date(), '{y}{m}');
const loginDate2 = getCookie('warehouseYearMonth') ? getCookie('warehouseYearMonth') : parseTime(new Date(), '{y}-{m}-{d}');
const boardFlag = ref("1");
const showSearch = ref(true);
const formRef = ref(null);
const formSelectData = ref({
  plantCode: [],
  depotCode: [],
  partitionCode: [],
  taxFlagCode: [],
});
const _loading = ref(false);
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

const createDialogVisible = ref(false);
const detailVisible = ref(false);
const editVisible = ref(false);
const redReversalVisible = ref(false);
const addInvoiceCodeVisible = ref(false);
const printRef = ref(null);
const redReversalKey = ref(1);
const createKey = ref(1);
const editKey = ref(1);
const addInvoiceCodeKey = ref(1);
const delVisible = ref(false);
const delForm = ref({
  delReason: "",
});
const delFormRules = {
  delReason: [
    { required: true, message: "删除理由不能为空！", trigger: "blur" }
  ]
};
const delFormRef = ref(null);
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
};

const pagination = {current: queryParams.value.pageNum, pageSize: queryParams.value.pageSize, total: total.value, pageSizes: [10, 20, 30, 50]};

const pagerConfig = { pageSizes: [10, 20, 30, 50], pageSize: queryParams.value.pageSize };

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
  { field: "flag", title: "单据状态", minWidth: 140, align: "center", searchable: true, hideInTable: true, searchType: "select", searchProps: 
    { options: whReceiptStatusArr,}, render: (row) => row.flag === "2" ? "已登卡" : "未登卡"},
  { field: "ibBillCode", title: "入库单号", minWidth: 200, align: "center", type: "link", sortable: true, searchable: true, searchType: "input", },
  { field: "invoiceCode", title: "发票号", minWidth: 200, align: "center", searchable: false, },
  { field: "supUnitName", title: "供应商", searchable: true, searchType: "input", hideInTable: true },
  { field: "supUnitName", title: "供应商", minWidth: 240, align: "center", searchable: false,  searchType: "tableSelect", searchProps: {
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
  { field: "taxFlagCode", title: "应税用途", minWidth: 140, align: "center", searchable: false, searchType: "select", searchProps: {}, requestOptions: getTaxFlags, render: (row) => row.taxFlagName},
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
  { field: "flag", title: "状态", minWidth: 140, align: "center", searchable: false, searchType: "select", searchProps: {
    options: whReceiptStatusArr,
  }, render: (row) => row.flag === "2" ? "已登卡" : "未登卡"},
  { field: "matlCode", title: "物资编码", searchable: true, searchType: "input", hideInTable: true },
  { field: "matlName", title: "物资名称", searchable: true, searchType: "inpt", hideInTable: true },
  { field: "invoiceCode", title: "发票号", minWidth: 200, align: "center", searchable: true, hideInTable: true },
  { field: "matlType", title: "规格类型", searchable: false, searchType: "input", hideInTable: true },
  { field: "orderDate", title: "下单日期", minWidth: 140, align: "center", type: "date", searchable: true, searchType: "dateRange",},
  { field: "noteDate", title: "登卡日期", minWidth: 140, align: "center", type: "date", searchable: false, },
  { field: "matlAmount", title: "料款（元）", minWidth: 160, align: "center", searchable: false, type: "number" },
  { field: "incotaxAmount", title: "税额（元）", minWidth: 160, align: "center", searchable: false, type: "number" },
  { field: "taxMatlAmount", title: "含税料款（元）", minWidth: 160, align: "center", searchable: false, type: "number" },
  { field: "action", title: "操作", slotName: "action", width: 180, align: "center", fixed: "right" },
]);

const toolBarConfig = {
  buttons: [
    { code: 'add', name: "新增", type: "primary", showInRow: false, showInTop: true },
    { code: 'del', name: "删除", type: "primary", showInRow: false, showInTop: true, },
    { code: 'board', name: "登卡", type: "primary", showInRow: false, showInTop: !(byCodeObj.value["32"] === "1")},
    { code: 'revoke', name: "撤销登卡", type: "primary", showInRow: false, showInTop: !(byCodeObj.value["32"] === "1")},
    { code: 'redReversalTop', name: "红冲", type: "primary", showInRow: false, showInTop: true },
    { code: 'redReversal', name: "红冲", type: "primary", showInRow: true, showInTop: false },
    { code: 'edit', name: "修改", type: "primary", showInRow: true, showInTop: false, disabled: ([row, ...rows]) => row.flag === "2" },
    { code: 'print1', name: "打印", type: "primary", showInRow: false, showInTop: true, },
    // { code: 'print2', name: "打印", type: "primary", showInRow: true, showInTop: false },
    { code: 'export', name: "导出", type: "primary", showInRow: false, showInTop: true },
    { code: 'addInvoiceCode', name: "补充发票号", type: "primary", showInTop: false, showInRow: ([row]) => row.flag === "2" && !row.invoiceCode },
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
      ibSource: "0",
    });
    tableData.value = res.data?.list || [];
    total.value = res.data?.total || 0;
  } catch (error) {
    console.log(error);
  }

  loading.value = false;
}

const handleAdd = () => {
  createDialogVisible.value = true;
}

const handleDel = () => {
  
  let accFlag = ref(true);
  let accFlag2 = ref(true);
  const arr = [];
  const arr2 = [];

  for (const item of tableSelectedData.value) {
    if (parseTime(item.orderDate, '{y}{m}') !== loginDate) {
      arr.push(item.ibBillCode);
      accFlag = false;
    }

    if (item.flag === "2") {
      arr2.push(item.ibBillCode);
      accFlag2 = false;
    }
  }
  if (arr.length) {
    ElMessage.error(`入库单${arr.join("、")}不是当前月份单据，不允许删除！`)
  }

  if (arr2.length) {
    ElMessage.error(`入库单${arr2.join("、")}已登卡，不允许删除！`)
  }

  if (!accFlag || !accFlag2) return;

  delVisible.value = true;
}

const delDialogClose = () => {
  delVisible.value = false;
  delFormRef.value.resetFields();
}

const delLoading = ref(false);
const delConfirm = () => {
  delFormRef.value.validate(async(valid) => {
    if (valid) {
      delLoading.value = true;
      try {
        const res = await inboundDelete({
          delReason: delForm.value.delReason,
          ibmtIds: tableSelectedData.value.map(item => item.ibmtId),
          yearMonth,
          loginDate: loginDate2,
        });
        delDialogClose();
        ElMessage.success("删除成功！");
        // handleQuery();
        await getList({...tableRef.value.getSearchForm()});
        tableRef.value.clearSelection();
      } catch (error) {
        console.log(error);
      }
      delLoading.value = false;
    }
  })
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
      ElMessage.error(`入库单${arr.join("、")}不是当前月份单据，不允许登卡！`)
    }
    if (!accFlag2) {
      ElMessage.error(`选中行必须全为未登卡状态的入库单！`)
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
    let accFlag = ref(true);
    let accFlag2 = ref(true);
    const arr = [];

    for (const item of tableSelectedData.value) {
      if (parseTime(item.orderDate, '{y}{m}') !== loginDate)  {
        arr.push(item.ibBillCode);
        accFlag = false;
      }

      if (item.flag === "0" || item.falg === "1") {
        accFlag2 = false;
      }
    }

    if (arr.length) {
      ElMessage.error(`入库单${arr.join("、")}不是当前月份单据，不允许撤销登卡！`)
    }

    if (!accFlag2) {
      ElMessage.error(`选中行必须全为已登卡状态的入库单！`);
    }

    if (!accFlag || !accFlag2) return;

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

const handlePrint = () => {
  printRef.value.show(tableSelectedData.value.map(item => item.ibmtId));
}

const handleExport = async (params = {}) => {
  if (tableData.value.length === 0) {
    ElMessage.warning("数据为空，无法导出！");
    return;
  }

  try {
    const res = await exportInbound({
      ...params,
      orderByColumn: queryParams.value.orderByColumn,
      isAsc: queryParams.value.isAsc,
      supUnitName: params.supUnitName?.label || "",
      supUnitCode: params.supUnitName?.unitCode || "",
      plantCode: params.plantCode?.code || "",
      depotCode: params.depotCode?.code || "",
      partitionCode: params.partitionCode?.code || "",
      orderDateBegin: params.orderDate?.length ? params.orderDate[0] : "",
      orderDateEnd: params.orderDate?.length ? params.orderDate[1] ? params.orderDate[1] : "" : "",
      yearMonth: "",
      orderDate: "",
      ibSource: "0",
    });

    const url = URL.createObjectURL(new Blob([res.data], { type: res.headers['content-type'] }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `外购入库单信息.xlsx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.log(object);
  }
}

// 表单下拉框值变化
const handleSelectChange = (prop, value) => {
  
}
// table项选择变化
const handleSelectionChange = (data) => {
  tableSelectedData.value = [...data];
}

// 点击表格操作列按钮
const handleButtonClick = (prop, scope) => {
  currentData.value = {...scope.row};
  if (prop === "edit") {
    editVisible.value = true;
  }
  if (prop === "redReversal") {
    redReversalVisible.value = true;
  }
  if (prop === "print") {
    printRef.value.show([scope.row.ibmtId])
  }
}

// 点击表格链接列
const clickLink = (prop, row) => {

  if (prop === "ibBillCode") {
    currentData.value = {...row};
    detailVisible.value = true;
  }
}

const buttonDisable = (code, row) => {
  if (code === "redReversal") {
    if (row.writeBackFlag === "1" || !!row.wbRmBillCode || row.flag !== "2" || monthlySettlement.value.closeFlag === "1") {
      return false;
    } else {
      return true;
    }
  }

  if (code === "edit") {
    // editVisible.value = true;
    return row.flag === "2" || monthlySettlement.value.closeFlag === "1" ? false : true;
  }

  if (code === "print") {
    return true;
  }
}


const createDialogClose = () => {
  createDialogVisible.value = false;
  createKey.value++;
  getList({...tableRef.value.getSearchForm()});
}

const detailDialogClose = () => {
  currentData.value = {};
  detailVisible.value = false;
}

const editDialogClose = (flag) => {
  currentData.value = {};
  editVisible.value = false;
  editKey.value++;
  if (flag === "confirm") {
    getList({...tableRef.value.getSearchForm()});
  }
}

const redReversalClose = (flag) => {
  currentData.value = {};
  redReversalVisible.value = false;
  redReversalKey.value++;
  if (flag === "confirm") {
    getList({...tableRef.value.getSearchForm()});
  }
}

const addInvoiceCodeClose = (flag) => {
  currentData.value = {};
  addInvoiceCodeVisible.value = false;
  addInvoiceCodeKey.value++;
  if (flag === "confirm") {
    getList({...tableRef.value.getSearchForm()});
  }
}

const getBoardFlag = async () => {
  _loading.value = true;

  try {
    const res = await paramConfigList({ paramCode: "32" });
    const arr = res.data?.list || [];

    boardFlag.value = arr.length ? arr[0].paramValue : "1"
  } catch (error) {
    
  }

  _loading.value = false;
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

const handleTopButtonShow = (prop) => {
  if (["board", "revokeBoard"].includes(prop) && byCodeObj.value["32"] === "1") {
    return false;
  }
  return true;
}

const handleTopButtonClick = (prop, data) => {
  if (prop === "add") {
    handleAdd();
  }

  if (prop === "del") {
    handleDel();
  }

  if (prop === "board") {
    handleBoard();
  }

  if (prop === "revokeBoard") {
    handleRevokeBoard();
  }

  if (prop === "print") {
    handlePrint();
  }

  if (prop === "export") {
    handleExport(tableRef.value?.getTableInstance().getSearchForm());
  }
}

const handleTopButtonDisable = (prop) => {
  if (prop === "print" && !!!tableSelectedData.value.length) {
    return false;
  }

  if (prop === "add" && monthlySettlement.value.closeFlag === "1") {
    return false;
  }

  if (prop === "del" && (!!!tableSelectedData.value.length || monthlySettlement.value.closeFlag === "1")) {
    return false;
  }

  if (["board", "revokeBoard"].includes(prop) && (!!!tableSelectedData.value.length || monthlySettlement.value.closeFlag === "1" || monthlySettlement.value.stopnoteFlag === "1")) {
    return false;
  }

  return true;
}

const handleRowStyle = (row, index) => {
  
  if (row.backFlag === "1") {
    return { color: "red" };
  }

  return {};
}

const handleAction = ({code, name, row}) => {
  if (code === "add") {
    handleAdd();
  }

  if (code === "del") {
    if (!!!tableSelectedData.value.length) {
      ElMessage.error("请选择数据！");
      return;
    }
    handleDel();
  }

  if (code === "board") {
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

  if (code === "print1") {
    if (!!!tableSelectedData.value.length) {
      ElMessage.error("请选择数据！");
      return;
    }
    handlePrint();
  }

  if (code === "export") {
    handleExport()
  }

  if (code === "redReversalTop") {
    if (!!!tableSelectedData.value.length || tableSelectedData.value.length > 1) {
      ElMessage.error("请选择一条数据！");
      return;
    }
    currentData.value = {...tableSelectedData.value[0]};
    redReversalVisible.value = true;
  }

  if (code === "redReversal") {
    if (row.writeBackFlag === "1" || !!row.wbRmBillCode || row.flag !== "2") {
      ElMessage.error("当前数据不满足红冲条件！");
      return;
    }
    currentData.value = {...row};
    redReversalVisible.value = true;
  }

  if (code === "edit") {
    currentData.value = {...row};
    editVisible.value = true;
  }

  if (code === "addInvoiceCode") {
    currentData.value = {...row};
    addInvoiceCodeVisible.value = true;
  }

  if (code === "print2") {
    printRef.value.show([row.ibmtId]);
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
  await getSupplyData();
  getMonthlySettlement();
})

onMounted(async () => {
  tableRef.value?.reload();
})
</script>

<style lang="scss" scoped>
.warehouse-receipt-maintain {
  overflow: auto;
  .r-maintain-search-table {
    padding-top: 10px;
    :deep(.ep-pro-table) {
      height: 100%;
      .ep-pro-table__wrapper {
        height: 100%;
        .ep-pro-table__body {
          height: calc(100% - 354px);
        }
      }
    }
  }
  :deep(.receipt-supplier-dialog-box) {
    .ep-dialog {
      height: 80vh !important;
      .ep-dialog__body {
        overflow-y: auto;
        overflow-x: hidden;
        height: calc(100% - 93px);
      }
    }
  }
  
}
</style>