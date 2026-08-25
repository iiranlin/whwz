<template>
  <div class="app-container app-container-splitpanes warehouse-receipt-maintain" v-loading="_loading">
    <el-row :gutter="20" class="app-container-row integrated-manage-pane-form integrated-manage-pane-form-a">
      <el-col class="app-container-col">
         <search-form
          :showSearch="showSearch"
          :formJson="singleSupFormJson"
          @handleQuery="handleQuery"
          @resetQuery="resetQuery"
          @handleSelectChange="handleSelectChange"
          :formSelectData="formSelectData"
          ref="formRef"
          @toFindDialog="toFindDialog"
          @clearFindDialogInput="clearFindDialogInput"
        >
        </search-form>
        <button-top :buttonJson="topTableButtonJson" :buttonShow="handleTopButtonShow" @handleButton="handleTopButtonClick" :buttonDisable="handleTopButtonDisable">
          <right-toolbar v-model:showSearch="showSearch" :tableJson="tableJsonArr" @queryTable="getList" @tabConfigSuccess="tabConfigSuccess"></right-toolbar>
        </button-top>
        <receipt-table
          class="table-index"
          :loading="loading"
          idName="ibmtId"
          ref="receiptTableRef"
          :queryParams="queryParams"
          :tableJson="tableJsonArr"
          :tableButtonJson="tableButtonJson"
          :selectionShow="true"
          :tableData="tableData"
          @handleSelectionChange="handleSelectionChange"
          operationWidth="150"
          @handleButtonClick="handleButtonClick"
          @clickLink="clickLink"
          :buttonDisable="buttonDisable"
          :reserveSelection="true"
          @handle-query="tableSortSearch"
          :row-style="handleRowStyle"
        >
          <template #flag="{name, scope}">
            {{  scope.row.flag === "2" ? "已登卡" : "未登卡" }}
          </template>
          <template #orderDate="{name, scope}">
            {{ parseTime(scope.row.orderDate, "{y}-{m}-{d}") }}
          </template>
          <template #noteDate="{name, scope}">
            {{ parseTime(scope.row.noteDate, "{y}-{m}-{d}") }}
          </template>
        </receipt-table>
        <div style="display: flex; align-items: center;">
          <div style="font-weight: 700;">红色：回退</div>
          <pagination 
            v-show="total > 0"
            :total="total"
            v-model:page="queryParams.pageNum"
            v-model:limit="queryParams.pageSize"
            @pagination="getList"
            style="flex: 1;"
          />
        </div>
      </el-col>
    </el-row>
    <supplier-dialog 
      @dialogClose="supplierDialogClose"
      title="供货单位选择"
      :visible="supplierVisible"
      width="90%"
      @returnUnitData="getSupUnitData"
      :commonDialogFormJson="supplierDialogFormJson"
      :commonDialogTableJson="supplierDialogTableJson"
      :tableRowDbClickFalg="true"
    />
    <create-dialog :key="createKey" ib-source="7" @dialogClose="createDialogClose" title="委外修/返厂修入库单新增" :visible="createDialogVisible" width="90%"  />
    <detail-dialog @dialogClose="detailDialogClose" title="委外修/返厂修入库单详情" :visible="detailVisible" :currentData="currentData" width="90%" />
    <edit-dialog :key="editKey" @dialogClose="editDialogClose" title="委外修/返厂修入库单修改" :visible="editVisible" :currentData="currentData" width="90%" />
    <red-reversal-dialog :key="redReversalKey" @dialogClose="redReversalClose" title="委外修/返厂修入库单红冲" :visible="redReversalVisible" :currentData="currentData" width="90%" />
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

<script setup>
import { singleSupFormJson } from "../formJson";
import { singleSupTableJson, tableButtonJson, topTableButtonJson } from "../tableJson";
import createDialog from "../components/newCreateDialog.vue";
import supplierDialog from "../../components/supplierDialog.vue";
import detailDialog from "../components/newDetail.vue";
import editDialog from "../components/newEdit.vue";
import searchForm from "../../components/searchForm.vue";
import redReversalDialog from "../components/newRedReversalDialog.vue";
import printDialog from "../components/printDialog";
import { selectPlantDict } from "@/api/warehouse/plantDict.js";
import { getwarehouseByUserAndPlant } from "@/api/warehouse/warehouseDict.js"; // {plantCode: xx}
import { getWarehousePartition } from "@/api/warehouse/partition.js"; // {depotCode: xx}
import { dictCateList } from "@/api/system/common.js";
import { getInboundList, inboundDelete, inboundCreateCard, inboundDeleteCard, exportInbound, writeBack, batchGetInbound } from "@/api/rmstor/inbound";
import receiptTable from "../../components/receiptTable.vue";
import { ElMessage } from "element-plus";
import { paramConfigList } from "@/api/system/paramConfig.js";
import { getSessionStorage, getCookie } from '@/utils/auth'
import { getMonthCloseList } from "@/api/settlementFile/monthCloseGroup";
import { supplierDialogFormJson } from '../../components/formJson.';
import { supplierDialogTableJson } from '../../components/tableJson';
import { parseTime, getMonthStartEnd } from "@/utils/generalMethod.js";

const { proxy } = getCurrentInstance();
const tableJsonArr = ref(singleSupTableJson);

const byCodeObj = ref(JSON.parse(getSessionStorage('byCodeObj') || '{}')); //权限判断是否显示登卡按钮（1：隐藏）
const yearMonth = getCookie('warehouseGetYear') ? JSON.parse(getCookie('warehouseGetYear')).yearMonth ? JSON.parse(getCookie('warehouseGetYear')).yearMonth : parseTime(new Date(), '{y}{m}') : parseTime(new Date(), '{y}{m}');
const loginDate = getCookie('warehouseYearMonth') ? parseTime(getCookie('warehouseYearMonth'), '{y}{m}') : parseTime(new Date(), '{y}{m}');
const loginDate2 = getCookie('warehouseYearMonth') ? getCookie('warehouseYearMonth') : parseTime(new Date(), '{y}-{m}-{d}');
const boardFlag = ref("1");
const receiptTableRef = ref(null);
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

const supplierVisible = ref(false);
const createDialogVisible = ref(false);
const detailVisible = ref(false);
const editVisible = ref(false);
const redReversalVisible = ref(false);
const printRef = ref(null);
const redReversalKey = ref(1);
const createKey = ref(1);
const detailKey = ref(1);
const editKey = ref(1);
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

const getList = async () => {
  loading.value = true;

  try {
    const res = await getInboundList({
      ...formRef.value?.formData,
      ...queryParams.value,
      plantCode: formRef.value?.formData.plantCode?.code || "",
      depotCode: formRef.value?.formData.depotCode?.code || "",
      partitionCode: formRef.value?.formData.partitionCode?.code || "",
      // supUnitCode: !!formRef.value?.formData.supUnitName ? formRef.value?.formData.supUnitCode : "",
      orderDateBegin: formRef.value?.formData.orderDate?.length ? formRef.value?.formData.orderDate[0] : "",
      orderDateEnd: formRef.value?.formData.orderDate?.length ? formRef.value?.formData.orderDate[1] : "",
      orderDate: "",
      orderBy: "",
      yearMonth: "",
      ibSource: "7",
    });
    tableData.value = res.data?.list || [];
    total.value = res.data?.total || 0;
  } catch (error) {
    console.log(error);
  }

  loading.value = false;
}

const toFindDialog = (prop) => {
  if (prop === "supplier") {
    supplierVisible.value = true;
  }
}

const clearFindDialogInput = () => {
  if (formRef.value) {
    formRef.value.formData.supUnitCode = "";
    formRef.value.formData.supUnitName = "";
  }
}

const supplierDialogClose = () => {
  supplierVisible.value = false;
}

const handleQuery = () => {
  queryParams.value.pageNum = 1;
  getList();
}

const resetQuery = () => {
  // receiptTableRef.value.clearTableSelection();
  receiptTableRef.value.clearSort();
  const startEnd = getMonthStartEnd(yearMonth);
  if (startEnd.firstDay && startEnd.lastDay && formRef.value) {
    formRef.value.formData.orderDate = [parseTime(startEnd.firstDay, "{y}-{m}-{d}"), parseTime(startEnd.lastDay, "{y}-{m}-{d}")];
  }
  formRef.value.formData.supUnitCode = "";
  queryParams.value.pageNum = 1;
  queryParams.value.isAsc = "";
  queryParams.value.orderByColumn = "";
  getList();
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
        await getList();
        receiptTableRef.value.clearTableSelection();
      } catch (error) {
        
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
    await getList();
    receiptTableRef.value.clearTableSelection();
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
    await getList();
    receiptTableRef.value.clearTableSelection();
  } catch (error) {
    
  }
  loading.value = false;
}

const handlePrint = () => {
  printRef.value.show(tableSelectedData.value.map(item => item.ibmtId));
}

const handleExport = async () => {
  if (tableData.value.length === 0) {
    ElMessage.warning("数据为空，无法导出！");
    return;
  }

  try {
    const res = await exportInbound({
      ...formRef.value.formData,
      yearMonth: "",
      ibSource: "7",
      orderDateBegin: formRef.value?.formData.orderDate?.length ? formRef.value?.formData.orderDate[0] : "",
      orderDateEnd: formRef.value?.formData.orderDate?.length ? formRef.value?.formData.orderDate[1] : "",
      orderDate: "",
    });

    const url = URL.createObjectURL(new Blob([res.data], { type: res.headers['content-type'] }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `委外修/返厂修入库单信息.xlsx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.log(object);
  }
}

const tabConfigSuccess = (data) => {
  tableJsonArr.value = data;
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
  getList();
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
    getList();
  }
}

const redReversalClose = (flag) => {
  currentData.value = {};
  redReversalVisible.value = false;
  redReversalKey.value++;
  if (flag === "confirm") {
    getList();
  }
}

const getPlantData = async () => {
  _loading.value = true;

  try {
    const res = await selectPlantDict({
      inSource: "7",
    });
    formSelectData.value.plantCode = res.data ? res.data.length ? res.data.map(item => ({ label: `${item.plantName}`, value: { code: item.plantCode, id: item.id} })) : [] : [];

  } catch (error) {
    console.log(error);
  }  

  _loading.value = false;
}

const getWareHouesData = async () => {
  try {
    const res = await getwarehouseByUserAndPlant({
      // plantCode: formRef.value.formData.plantCode,
      plantId: formRef.value.formData.plantCode.id,
      inSource: "7",
    });
    formSelectData.value.depotCode = res.data ? res.data.length ? res.data.map(item => ({ label: `${item.whName}`, value: { code: item.whCode, id: item.id} })) : [] : [];
  } catch (error) {
    
  }
}

const getPartitionWHData = async () => {
  try {
    const res = await getWarehousePartition({
      // depotCode: formRef.value.formData.depotCode,
      whId: formRef.value.formData.depotCode.id,
      inSource: "7",
    });
    formSelectData.value.partitionCode = res.data ? res.data.length ? res.data.map(item => ({ label: `${item.partitionName}`, value: { code: item.partitionCode, id: item.id} })) : [] : [];
  } catch (error) {
    
  }
}

watch(() => formRef.value?.formData.plantCode, (nval) => {
  formSelectData.value.depotCode = [];
  formSelectData.value.partitionCode = [];
  formRef.value.formData.depotCode = "";
  formRef.value.formData.partitionCode = "";
  if (!!nval) {
    getWareHouesData();
  }
});

watch(() => formRef.value?.formData.depotCode, (nval) => {
  formSelectData.value.partitionCode = [];
  formRef.value.formData.partitionCode = "";
  if (!!nval) {
    getPartitionWHData();
  }
});


const getTaxFlags = async () => {
  try {
    const res = await dictCateList({
      code: "tax_flag"
    });
    formSelectData.value.taxFlagCode = res.data ? res.data.length ? res.data.map(item => ({label: item.name, value: item.code})) : [] : []
  } catch (error) {
    
  }
}


const getSupUnitData = (data = {}) => {
  if (Object.keys(data).length) {
    formRef.value.formData.supUnitName = data.unitName;
    formRef.value.formData.supUnitCode = data.unitCode;
  } else {
    formRef.value.formData.supUnitCode = null;
    formRef.value.formData.supUnitName = "";
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

const tableSortSearch = (searchData) => {
  queryParams.value.orderByColumn = searchData.orderBy;
  queryParams.value.isAsc = searchData.isAsc;
  getList();
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
    handleExport();
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

onMounted(async () => {
  const startEnd = getMonthStartEnd(yearMonth);
  if (startEnd.firstDay && startEnd.lastDay && formRef.value) {
    formRef.value.formData.orderDate = [parseTime(startEnd.firstDay, "{y}-{m}-{d}"), parseTime(startEnd.lastDay, "{y}-{m}-{d}")];
  }
  getMonthlySettlement();
  getList();
  getPlantData();
  getTaxFlags();
})
</script>

<style lang="scss" scoped>
.warehouse-receipt-maintain {
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
  :deep(.warehouse-receipt-search-form) {
    .input-dialog-form-item {
        .ep-input__suffix {
          cursor: pointer;
          .ep-icon {
            font-weight: 800;
            color: var(--ep-color-primary);
            font-size: 16px;
          }
        }
    }
  }
}
</style>