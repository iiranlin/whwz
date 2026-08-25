<!-- 柴油入库单维护  -->
<template>
  <div class="app-container app-container-splitpanes">
    <el-pro-table
      :columns="columns"
      :page-size="pageSize"
      :height="height"
      :toolbar-config="toolbarConfig"
      :search-collapse-threshold="3"
      @action="onAction"
      :data="tableData"
      :total="total"
      @search="getList"
      @reset="getList"
      :show-checkbox="true"
      :selection-mode="'multiple'"
      :keep-selection="true"
    >
      <template #code-cell="{ row }">
        <el-link type="primary" @click="handleClickLink(row)">{{
          row.ibBillCode
        }}</el-link>
      </template>
    </el-pro-table>

    <create-dialog ref="createDialog" @createSuccess="getList" />
    <delete-dialog ref="deleteDialog" @deleteSuccess="getList" />
    <print-dialog ref="printDialog" />

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
  </div>
</template>

<script setup name="steel-inbound">
import { formJson } from "./formJson";
import { tableJson, tableButtonJson } from "./tableJson";
import { getLocalStorage, getCookie, getSessionStorage } from "@/utils/auth";
import {
  getInboundList,
  inboundCreateCard,
  inboundDeleteCard,
  rmsverifyButtonStatus,
  plantDictList,
  warehouseDict,
  warehouseplantDictList,
  rmstorInternalExport,
  inboundMessage,
} from "@/api/diesel-inbound/dieselEntryGroup.js";
import CreateDialog from "./components/createDialog";
import PrintDialog from "./components/PrintDialog";
import DeleteDialog from "./components/deleteDialog";
import supplierDialog from "../components/supplierDialog.vue";
import searchForm from "../components/searchForm.vue";
import { supplierDialogFormJson } from "../components/formJson";
import { supplierDialogTableJson } from "../components/tableJson";
import { parseTime, getMonthStartEnd } from "@/utils/generalMethod.js";
import { onMounted } from "vue";

const { proxy } = getCurrentInstance();
const columns = tableJson;
const toolbarConfig = tableButtonJson;
const height = 460;

const tableJsonArr = ref(
  JSON.parse(getLocalStorage(proxy.$route.meta?.menuId) || "null") || tableJson
);
const yearMonth = getCookie("warehouseGetYear")
  ? JSON.parse(getCookie("warehouseGetYear")).yearMonth
    ? JSON.parse(getCookie("warehouseGetYear")).yearMonth
    : parseTime(new Date(), "{y}{m}")
  : parseTime(new Date(), "{y}{m}");
const tableData = ref([]);
const loading = ref(false);
const showSearch = ref(true);
const supplierVisible = ref(false);
const formRef = ref(null);
const idName = ref("ibmtId");
const ids = ref([]);
const selectionData = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const byCodeObj = ref(JSON.parse(getSessionStorage("byCodeObj") || "{}")); //权限判断是否显示登卡按钮（1：隐藏）

const data = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 30,
    ibSource: "3",
  },
  formSelectData: {
    plantCode: [],
    depotCode: [],
    partitionCode: [],
  },
  tableDataDict: {},
  plantList: [],
});
const { queryParams, formSelectData, tableDataDict } = toRefs(data);
const tabConfigSuccess = (data) => {
  tableJsonArr.value = data;
};

// 获取地区列表
const getPlantList = async () => {
  const { data } = await plantDictList({ inSource: "3" });
  formSelectData.value.plantCode = data?.map((item) => {
    return {
      label: item.plantName,
      value: item.plantCode,
      ...item,
    };
  });
};
// 获取仓库列表
const warehouseList = async (value) => {
  const plantArr = formSelectData.value.plantCode.filter((item) => {
    return item.plantCode === value;
  });
  const { data } = await warehouseDict({
    plantId: plantArr.length > 0 ? plantArr[0].id : "xx",
    inSource: "3",
  });
  formSelectData.value.depotCode = data?.map((item) => {
    return {
      label: item.whName,
      value: item.whCode,
      ...item,
    };
  });
};
//仓库分区
const getwarehouseplantDictList = async (value) => {
  const plantArr = formSelectData.value.depotCode.filter((item) => {
    return item.whCode === value;
  });
  const { data } = await warehouseplantDictList({
    whId: plantArr.length > 0 ? plantArr[0].id : "xx",
    inSource: "3",
  });
  formSelectData.value.partitionCode = data?.map((item) => {
    return {
      label: item.partitionName,
      value: item.partitionCode,
      ...item,
    };
  });
};
/** 查询列表 */
function getList() {
  loading.value = true;
  const params = proxy.addDateRange({
    ...formRef.value?.formData,
    ...queryParams.value,
    orderDateBegin: formRef.value?.formData.orderDate?.length
      ? formRef.value?.formData.orderDate[0]
      : "",
    orderDateEnd: formRef.value?.formData.orderDate?.length
      ? formRef.value?.formData.orderDate[1]
      : "",
  });
  getInboundList(params)
    .then(({ data }) => {
      tableData.value = data.list || [];
      total.value = data.total;
    })
    .finally(() => {
      loading.value = false;
    });
}

// /** 搜索按钮操作 */
// function handleQuery(data) {
//   queryParams.value.pageNum = 1;
//   let res = {
//     ...data,
//     orderDateBegin: data.orderDate?.[0] || "",
//     orderDateEnd: data.orderDate?.[1] || "",
//   };
//   delete res.orderDate;

//   queryParams.value = Object.assign({}, queryParams.value, res);
//   getList();
// }

// /** 重置按钮操作 */
// function resetQuery(data) {
//   const startEnd = getMonthStartEnd(yearMonth);
//   if (startEnd.firstDay && startEnd.lastDay && formRef.value) {
//     formRef.value.formData.orderDate = [
//       parseTime(startEnd.firstDay, "{y}-{m}-{d}"),
//       parseTime(startEnd.lastDay, "{y}-{m}-{d}"),
//     ];
//   }
//   formSelectData.value = Object.assign({});
//   handleQuery(data);
// }

/** 多选框选中数据 */
function handleSelectionChange(selection) {
  selectionData.value = selection;
  ids.value = selection.map((item) => item[idName.value]);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

const toFindDialog = (prop) => {
  if (prop === "supplier") {
    supplierVisible.value = true;
  }
};

const clearFindDialogInput = () => {
  if (formRef.value) {
    formRef.value.formData.supUnitCode = "";
    formRef.value.formData.supUnitName = "";
  }
};

const supplierDialogClose = () => {
  supplierVisible.value = false;
};

const getSupUnitData = (data = {}) => {
  if (Object.keys(data).length) {
    formRef.value.formData.supUnitName = data.unitName;
    formRef.value.formData.supUnitCode = data.unitCode;
  } else {
    formRef.value.formData.supUnitCode = null;
    formRef.value.formData.supUnitName = "";
  }
};

const isFlagFun = () => {
  if (!ids.value.length) {
    proxy.$modal.msgWarning("请选择数据");
    return false;
  }
  return true;
};
const handlePrint = () => {
  if (isFlagFun()) {
    proxy.$refs.printDialog.show(ids.value);
  }
};
const onAction = (payload) => {
  const { code, row, files } = payload;
  const eventObj = {
    // 新增
    create: () => {
      proxy.$refs.createDialog.show();
    },
    //审批详情
    detail: () => {},
    // 修改
    modify: () => {
      proxy.$refs.createDialog.show("modify", row);
    },
    // 删除
    delete: () => {
      handleDelete();
    },
    //红冲
    report: () => {
      proxy.$refs.createDialog.show("report", row);
    },
    // 登卡
    publish: () => {
      publishClick();
    },
    //撤销登卡
    cancelPublish: () => {
      cancelPublishClick();
    },
    // 打印
    print: () => {
      handlePrint();
    },
    // 导出
    export: () => {
      const params = proxy.addDateRange(queryParams.value);
      proxy.$download.name(rmstorInternalExport, params);
    },
  };
  eventObj[code] && eventObj[code]();
};

const handleClickLink = (row) => {
  proxy.$refs.createDialog.show("details", row);
};

const publishClick = async () => {
  if (ids.value.length === 0) {
    proxy.$modal.msgWarning("请选择至少一条数据");
    return;
  }
  inboundCreateCard({ ibmtIds: ids.value }).then(({ message }) => {
    proxy.$modal.msgSuccess(message);
    inboundMessage({ ibmtIds: ids.value });
    getList();
  });
};
const cancelPublishClick = () => {
  if (ids.value.length === 0) {
    proxy.$modal.msgWarning("请选择至少一条数据");
    return;
  }
  inboundDeleteCard({ ibmtIds: ids.value }).then(({ message }) => {
    proxy.$modal.msgSuccess(message);
    getList();
  });
};
const handleDelete = () => {
  if (ids.value.length === 0) {
    proxy.$modal.msgWarning("请选择至少一条数据");
    return;
  }
  const isFlag = selectionData.value.some((a) => a.flag !== "1");
  if (isFlag) {
    proxy.$modal.msgWarning("请选择未登卡的数据");
    return;
  }
  proxy.$refs.deleteDialog.show(ids.value);
};

/**
 * closeFlag 0 未封账本  1 已封账
 * stopnoteFlag 0 未禁止  1 已禁止
 *
 */
const isCloseFlag = ref("0");
const isStopnoteFlag = ref("0");
//按钮权限
const getbtnShow = async () => {
  const { data } = await rmsverifyButtonStatus({
    unitCode: getCookie("unitCode"),
  });
  isCloseFlag.value = data.closeFlag;
  isStopnoteFlag.value = data.stopnoteFlag;
};
const handleSelectChange = (val, value) => {
  if (val === "plantCode") {
    warehouseList(value);
    proxy.$refs.formDataRef.formData.depotCode = "";
    proxy.$refs.formDataRef.formData.partitionCode = "";
    formSelectData.value.partitionCode = [];
  }
  if (val === "depotCode") {
    getwarehouseplantDictList(value);
    proxy.$refs.formDataRef.formData.partitionCode = "";
  }
};
onMounted(() => {
  const startEnd = getMonthStartEnd(yearMonth);
  if (startEnd.firstDay && startEnd.lastDay && formRef.value) {
    formRef.value.formData.orderDate = [
      parseTime(startEnd.firstDay, "{y}-{m}-{d}"),
      parseTime(startEnd.lastDay, "{y}-{m}-{d}"),
    ];
  }
  getbtnShow();
  getPlantList();
  getList();
});
</script>
<style lang="scss"></style>
