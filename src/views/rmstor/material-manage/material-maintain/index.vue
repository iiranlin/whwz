<!-- 退料单维护 -->
<template>
  <div class="app-container app-container-splitpanes">
    <el-pro-table
      :columns="columns"
      :page-size="queryParams.pageSize"
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
          row.returnCode
        }}</el-link>
      </template>
    </el-pro-table>

    <add-dialog ref="addDialog" @createSuccess="getList()" />
    <print-dialog ref="printDialog" />
    <delete-dialog ref="deleteDialog" @deleteSuccess="getList" />
    <DetailDialog v-model="playBatchVisible" :rowData="rowData" />
  </div>
</template>

<script setup name="system-parameter-configuration">
import { formJson } from "./formJson";
import { tableJson, tableButtonJson } from "./tableJson";
import { getLocalStorage, getSessionStorage } from "@/utils/auth";
import {
  getMaintainList,
  maintainCancelNote,
  maintainNote,
  maintainExport,
  plantDictList,
  warehouseDict,
  warehouseplantDictList,
} from "@/api/materialMaintain/materialGroup";
import { onMounted } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import { getCookie } from "@/utils/auth";
import AddDialog from "./components/AddDialog";
import PrintDialog from "./components/PrintDialog";
import DeleteDialog from "./components/deleteDialog";
import DetailDialog from "./components/DetailDialog";

const { proxy } = getCurrentInstance();
const columns = tableJson;

const tableData = ref([]);
const loading = ref(false);
const showSearch = ref(true);
const ids = ref([]);
const selectionData = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const rowData = ref([]);
const idName = ref("returnId");
const plantSelectList = ref([]); // 地区
const depotSelectList = ref([]); //  仓库
const isStopnoteFlag = ref("0");
const byCodeObj = ref(JSON.parse(getSessionStorage("byCodeObj") || "{}")); //权限判断是否显示登卡按钮（1：隐藏）

const height = 460;
const data = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 30,
    orderDateBegin: "",
    orderDateEnd: "",
    yeyearMonth: "",
  },
  formSelectData: {
    plantCode: [],
    depotCode: [],
    // rtmtSource: 0,
  },
});

const { queryParams, formSelectData } = toRefs(data);

//按钮配置项
const toolbarConfig = {
  buttons: [
    {
      code: "create",
      name: "新增",
      type: "primary",
      showInTop: true,
      tooltip: "新增",
    },
    {
      code: "edit",
      name: "编辑",
      type: "primary",
      showInTop: false,
      showInRow: true,
      tooltip: "编辑",
    },
    {
      code: "delete",
      name: "删除",
      type: "primary",
      showInTop: true,
      tooltip: "删除",
    },
    {
      code: "print",
      name: "打印",
      type: "primary",
      showInTop: true,
      tooltip: "打印",
    },
    {
      code: "export",
      name: "导出",
      type: "primary",
      showInTop: true,
      tooltip: "导出",
    },
    {
      code: "denka",
      name: "登卡",
      type: "primary",
      showInTop: true,
      tooltip: "登卡",
    },
    {
      code: "revokeDenka",
      name: "撤销登卡",
      type: "primary",
      showInTop: true,
      tooltip: "撤销登卡",
    },
  ],
};

/** 查询角色列表 */
const getList = async () => {
  loading.value = true;

  getMaintainList(queryParams.value)
    .then(({ data }) => {
      tableData.value = data.list || [];
      total.value = data.total;
    })
    .finally(() => {
      loading.value = false;
    });
};

// /** 搜索按钮操作 */
// const handleQuery = (data) => {
//   const [start, end] = data.orderDate || [];
//   let res = { ...data };
//   delete res.orderDate;
//   res.orderDateBegin = start;
//   res.orderDateEnd = end;

//   queryParams.value.pageNum = 1;
//   queryParams.value = Object.assign({}, queryParams.value, res);
//   getList();
// };

// /** 重置按钮操作 */
// const resetQuery = (data) => {
//   setDefaultMonthDate();
//   handleQuery(data);
//   // proxy.$refs.formdataRef.formData.rtmtSource = 0;
// };

const isIdsFun = () => {
  if (!ids.value.length) {
    proxy.$modal.msgWarning("请选择数据");
    return false;
  }
  return true;
};

// 批量删除
const handleDel = async () => {
  if (isIdsFun()) {
    proxy.$refs.deleteDialog.show(ids.value);
  }
};
// 打印
const handlePrint = () => {
  if (isIdsFun()) {
    proxy.$refs.printDialog.show(ids.value);
  }
};
// 登卡
const handleDenka = () => {
  if (isIdsFun()) {
    proxy.$modal
      .confirm("您确定要登卡所选订单吗？")
      .then(() => {
        loading.value = true;
        return maintainNote(ids.value);
      })
      .then(({ message }) => {
        proxy.$modal.msgSuccess(message);
      })
      .finally(() => {
        loading.value = false;
        getList();
      });
  }
};
// 撤销登卡
const handleRevokeDenka = () => {
  if (isIdsFun()) {
    proxy.$modal
      .confirm("您确定要撤销登卡所选订单吗？")
      .then(() => {
        loading.value = true;
        return maintainCancelNote(ids.value);
      })
      .then(({ message }) => {
        proxy.$modal.msgSuccess(message);
      })
      .finally(() => {
        loading.value = false;
        getList();
      });
  }
};

const playBatchVisible = ref(false);
const onAction = (payload) => {
  const { code, row, files } = payload;
  const eventObj = {
    // 新增
    create: () => {
      proxy.$refs.addDialog.show("create");
    },
    // 修改
    edit: () => {
      proxy.$refs.addDialog.show("modify", row.returnId);
    },
    // 删除
    delete: () => {
      handleDel();
    },
    // 打印
    print: () => {
      handlePrint();
    },
    // 导出
    export: () => {
      const params = proxy.addDateRange(
        queryParams.value,
        queryParams.value.orderDate,
        "orderDate"
      );
      delete params.orderDate;
      proxy.$download.name(maintainExport, params);
    },
    // 登卡
    denka: () => {
      handleDenka();
    },
    // 撤销登卡
    revokeDenka: () => {
      handleRevokeDenka();
    },
  };
  eventObj[code] && eventObj[code]();
};

const handleClickLink = (row) => {
  playBatchVisible.value = true;
  rowData.value = row;
};

// 获取地区列表
const getPlantList = async () => {
  let { data } = await plantDictList();
  plantSelectList.value = data;
  columns[12].searchProps.ptions = data.map((item) => {
    return {
      label: `${item.plantName}`,
      value: item.id,
      ...item,
    };
  });
};

// // 获取仓库列表
// const warehouseList = async (value) => {
//   queryParams.value.depotCode = "";
//   let { data } = await warehouseDict(value);
//   depotSelectList.value = data;
//   formSelectData.value.depotCode = data.map((item) => {
//     return {
//       label: `${item.whName}`,
//       value: item.whCode,
//       ...item,
//     };
//   });
// };

// // 获取仓库分区
// const getwarehouseplantDictList = async (value) => {
//   queryParams.value.partitionCode = "";
//   const { data } = await warehouseplantDictList({
//     whId: value,
//   });
//   formSelectData.value.partitionCode = data.map((item) => {
//     return {
//       label: `${item.partitionName}`,
//       value: item.partitionCode,
//       ...item,
//     };
//   });
// };

// const handleSelectChange = (val, value) => {
//   let id = "";
//   if (val === "plantCode") {
//     plantSelectList.value.map((item) => {
//       if (item.plantCode === value) {
//         id = item.id;
//       }
//     });

//     warehouseList(id);
//     queryParams.value.depotCode = "";
//   } else if (val === "depotCode") {
//     depotSelectList.value.map((item) => {
//       if (item.whCode === value) {
//         id = item.id;
//       }
//     });
//     getwarehouseplantDictList(id);
//   }
// };

// 初始化制单日期
const setDefaultMonthDate = () => {
  const dateStr = getCookie("warehouseYearMonth");
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = date.getMonth();
  // 当月第一天
  const firstDay = new Date(year, month, 1);
  // 当月最后一天
  const lastDay = new Date(year, month + 1, 0);
  // yyyy-MM-dd
  const formatDate = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  // proxy.$refs.formdataRef.formData.orderDate = [
  //   formatDate(firstDay),
  //   formatDate(lastDay),
  // ];
  queryParams.value.orderDateBegin = formatDate(firstDay);
  queryParams.value.orderDateEnd = formatDate(lastDay);
};

onMounted(() => {
  setDefaultMonthDate();
  getList();
  getPlantList();
  // proxy.$refs.formdataRef.formData.rtmtSource = 0;
});
</script>
<style lang="scss"></style>
