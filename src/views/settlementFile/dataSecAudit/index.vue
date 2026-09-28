<!-- 数据安全检查 -->
<template>
  <div class="app-container app-container-splitpanes">
    <el-row :gutter="20" class="app-container-row integrated-manage-pane-form integrated-manage-pane-form-a">
      <el-col class="app-container-col">
    <el-pro-table
      ref="proTableRef" 
      :columns="activeColumns"
      :page-size="queryParams.pageSize"
      :toolbar-config="toolbarConfig"
      :search-collapse-threshold="3"
      :default-search-form="defaultSearchForm"
      @action="onAction"
      @update:searchForm="onSearchFormChange"
      @search="handleQuery"
      :data="tableData"
      :total="total"
      :showResetButton="false"
      :showSearchButton="false"
      :show-checkbox="true"
      :selection-mode="'multiple'"
      :keep-selection="true"
      :show-action="false" 
    >
    </el-pro-table>
    </el-col>
    </el-row>

    <detail-dialog ref="detailDialog" @deleteSuccess="getList" />
  </div>
</template>

<script setup name="dataSecAudit">
import { formJson } from "./formJson";
import { tableJson, toolbarConfig, tablePriceJson } from "./tableJson";
import { getLocalStorage } from "@/utils/auth";
import {
  getDataSecAuditList,
  plantDictList,
  warehouseDict,
  getChecked,
  updateCardChange,
  partation,
} from "@/api/settlementFile/dataSecAuditGroup";
import { onMounted, computed } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import { getCookie } from "@/utils/auth";
import DetailDialog from "./components/detail";

const { proxy } = getCurrentInstance();
const height = 460;

const tableJsonArr = ref(
  JSON.parse(getLocalStorage(proxy.$route.meta?.menuId)) || tableJson
);
const tablePriceJsonArr = ref(
  JSON.parse(getLocalStorage(proxy.$route.meta?.menuId)) || tablePriceJson
);
const tableData = ref([]);
const loading = ref(false);
const showSearch = ref(true);
const ids = ref([]);
const selectionData = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const rowData = ref([]);
const idName = ref("cardId");
const formSelectData = ref({
  yearMonth: getCookie("warehouseYearMonth"),
  verifyType: 1,
});
const plantOpts = ref([]); // 用料地区原始数据（含 id，供仓库级联反查）
const depotOpts = ref([]); // 仓库原始数据（含 id，供分区级联反查）
const data = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 30,
  },
});

const defaultSearchForm = {
  yearMonth: getCookie("warehouseYearMonth"),
};

const { queryParams } = toRefs(data);

const tabConfigSuccess = (data) => {
  tableJsonArr.value = data;
};

const formatTwoDecimal = (val) => {
  if (val === null || val === undefined || val === "") return 0;
  const num = Number(val);
  return isNaN(num) ? 0 : Math.round(num * 100) / 100;
};

/** 查询列表 */
const getList = async () => {
  loading.value = true;
  getDataSecAuditList(queryParams.value)
    .then(({ data }) => {
      const numFieldList = [
        "cardPrice",
        "initialAmount",
        "nowInAmount",
        "intoStorageAmount",
        "returnMatlAmount",
        "nowOutAmount",
        "outWarehouseAmount",
        "allotAmount",
        "profitLoseAmount",
        "movementIntoAmount",
        "movementOutAmount",
        "adjustmentAmount",
        "nowAmount",
      ];
      const formatList = (data.list || []).map((row) => {
        numFieldList.forEach((field) => {
          row[field] = formatTwoDecimal(row[field]);
        });
        return row;
      });

      tableData.value = formatList;
      total.value = data.total;
    })
    .finally(() => {
      loading.value = false;
    });
};

/** 搜索按钮操作（el-pro-table 检索区 @search 触发）：按所选条件执行数据检查并加载列表 */
const flagVisible = ref(1);
const handleQuery = async (form) => {
  let res = { ...formSelectData.value, ...(form || {}) };

  if (!res.yearMonth) {
    ElMessage.warning("请选择年月！");
    return;
  }

  res.yearMonth =
    res.yearMonth.split("-").slice(0, 2).join("") || res.yearMonth.split("-");
  if (res.verifyType === undefined || res.verifyType === "") {
    res.verifyType = 1; // 默认数量
  }
  queryParams.value.pageNum = 1;
  flagVisible.value = res.verifyType;

  queryParams.value = Object.assign({}, queryParams.value, res);
  await verifyCheck(
    res.verifyType,
    res.yearMonth,
    res.depotCode || "",
    res.plantCode || "",
    res.partitionCode || ""
  );
};

/** 重置按钮操作 */
// const resetQuery = (data) => {
//   proxy.$refs.formdataRef.formData = {
//     yearMonth: getCookie("warehouseYearMonth"),
//     verifyType: 1,
//   };
//   getList();
// };

// 查看计算公式
const lookBtn = () => {
  proxy.$refs.detailDialog.show(ids.value);
};

// function handleSelectionChange(selection) {
//   selectionData.value = selection;
//   ids.value = selection.map((item) => item[idName.value]);
//   single.value = selection.length != 1;
//   multiple.value = !selection.length;
// }

const playBatchVisible = ref(false);
const onAction = (payload) => {
  const { code, row, files } = payload;
  const eventObj = {
    // 更正卡片数据
    updateCred: () => {
      loading.value = true;
      if (!formSelectData.value.yearMonth) {
        ElMessage.warning("请选择年月！");
        return;
      }
      let timeData = formSelectData.value.yearMonth.split("-").slice(0, 2).join("");
      updateCardChange(
        formSelectData.value.verifyType,
        timeData,
        formSelectData.value.depotCode || "",
        formSelectData.value.plantCode || "",
        formSelectData.value.partitionCode || ""
      )
        .then((data) => {
          const numFieldList = [
            "cardPrice",
            "initialAmount",
            "nowInAmount",
            "intoStorageAmount",
            "returnMatlAmount",
            "nowOutAmount",
            "outWarehouseAmount",
            "allotAmount",
            "profitLoseAmount",
            "movementIntoAmount",
            "movementOutAmount",
            "adjustmentAmount",
            "nowAmount",
          ];

          const formatList = (data.data?.list || []).map((row) => {
            numFieldList.forEach((field) => {
              row[field] = formatTwoDecimal(row[field]);
            });
            return row;
          });

          tableData.value = formatList;

          total.value = data.data?.total;
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          loading.value = false;
          verifyCheck(
            formSelectData.value.verifyType,
            formSelectData.value.yearMonth,
            formSelectData.value.depotCode || "",
            formSelectData.value.plantCode || "",
            formSelectData.value.partitionCode || ""
          );
        });
    },
    verification: () => {
      verificaFun(row);
    },
    viewFormula: () => {
      lookBtn();
    },
  };
  eventObj[code] && eventObj[code]();
};

const verificaFun = (data) => {
  let res = { ...formSelectData.value };

  if (!res.yearMonth) {
    ElMessage.warning("请选择年月！");
    return;
  }

  res.yearMonth =
    res.yearMonth.split("-").slice(0, 2).join("") || res.yearMonth.split("-");
  queryParams.value.pageNum = 1;
  flagVisible.value = res.verifyType;

  queryParams.value = Object.assign({}, queryParams.value, res);
  verifyCheck(
    res.verifyType,
    res.yearMonth,
    res.depotCode || "",
    res.plantCode || "",
    res.partitionCode || ""
  );
};

// 校验类别
const verifyCheck = async (val, day, depot, plant, partit) => {
  await getChecked(val, day, depot, plant, partit)
    .then((data) => {
      const numFieldList = [
        "cardPrice",
        "initialAmount",
        "nowInAmount",
        "intoStorageAmount",
        "returnMatlAmount",
        "nowOutAmount",
        "outWarehouseAmount",
        "allotAmount",
        "profitLoseAmount",
        "movementIntoAmount",
        "movementOutAmount",
        "adjustmentAmount",
        "nowAmount",
      ];
      const formatList = (data.data.list || []).map((row) => {
        numFieldList.forEach((field) => {
          row[field] = formatTwoDecimal(row[field]);
        });
        return row;
      });

      tableData.value = formatList;

      total.value = data.data.total;
    })
    .catch((err) => {
      tableData.value = [];
      total.value = 0;
    });
};

// 用料地区下拉数据源：pro-table 初始化检索区时通过 requestOptions 自动加载
const getPlantOptions = async () => {
  let { data } = await plantDictList();
  plantOpts.value = data || [];
  return plantOpts.value.map((item) => ({
    label: `【${item.plantCode}】${item.plantName}`,
    value: item.plantCode,
    id: item.id,
  }));
};

// 仓库下拉级联：选中用料地区后用其 id 加载该地区下仓库
const getWarehouseOptions = async ({ form, setFieldValue, setFieldProps }) => {
  if (!form.plantCode) {
    setFieldValue("depotCode", undefined);
    setFieldValue("partitionCode", undefined);
    setFieldProps("depotCode", { options: [] });
    setFieldProps("partitionCode", { options: [] });
    return;
  }
  // 用料地区选项可能来自 requestOptions 缓存（getPlantOptions 未被执行），
  // plantOpts 为空时按需回源拉取一次，确保能反查到所选用料地区的 id
  if (!plantOpts.value.length) {
    try {
      let { data } = await plantDictList();
      plantOpts.value = data || [];
    } catch (e) {}
  }
  const plant = plantOpts.value.find((item) => item.plantCode === form.plantCode);
  if (!plant) {
    setFieldValue("depotCode", undefined);
    setFieldValue("partitionCode", undefined);
    setFieldProps("depotCode", { options: [] });
    setFieldProps("partitionCode", { options: [] });
    return;
  }
  try {
    let { data } = await warehouseDict(plant.id);
    depotOpts.value = data || [];
    setFieldValue("depotCode", undefined);
    setFieldProps("depotCode", {
      options: depotOpts.value.map((item) => ({
        label: `【${item.whCode}】${item.whName}`,
        value: item.whCode,
        id: item.id,
      })),
    });
  } catch (e) {
    // 接口异常仅清空选项，不冒泡导致整页崩溃
    setFieldProps("depotCode", { options: [] });
  }
};

// 仓库分区下拉级联：选中仓库后用其 id 加载该仓库下分区
const getPartitionOptions = async ({ form, setFieldValue, setFieldProps }) => {
  if (!form.depotCode) {
    setFieldValue("partitionCode", undefined);
    setFieldProps("partitionCode", { options: [] });
    return;
  }
  const depot = depotOpts.value.find((item) => item.whCode === form.depotCode);
  if (!depot) {
    setFieldValue("partitionCode", undefined);
    setFieldProps("partitionCode", { options: [] });
    return;
  }
  try {
    let { data } = await partation(depot.id);
    setFieldValue("partitionCode", undefined);
    setFieldProps("partitionCode", {
      options: (data || []).map((item) => ({
        label: `【${item.partitionCode}】${item.partitionName}`,
        value: item.partitionCode,
        id: item.id,
      })),
    });
  } catch (e) {
    // 接口异常仅清空选项，不冒泡导致整页崩溃
    setFieldProps("partitionCode", { options: [] });
  }
};

// 列配置可能来自本地缓存(JSON 序列化后函数丢失)，在此兜底补上下拉数据源与级联
const activeColumns = computed(() => {
  const cols =
    flagVisible.value === 1 ? tableJsonArr.value : tablePriceJsonArr.value;
  return (cols || []).map((col) => {
    if (col.field === "plantCode") {
      return { ...col, requestOptions: getPlantOptions };
    } else if (col.field === "depotCode") {
      return {
        ...col,
        searchProps: { ...col.searchProps, options: [] },
        dependsOn: ["plantCode"],
        onDependencyChange: getWarehouseOptions,
      };
    } else if (col.field === "partitionCode") {
      return {
        ...col,
        searchProps: { ...col.searchProps, options: [] },
        dependsOn: ["depotCode"],
        onDependencyChange: getPartitionOptions,
      };
    }
    return col;
  });
});

// 检索区下拉选中值同步给工具栏「数据检查/更正卡片数据」按条件过滤使用
const onSearchFormChange = (val = {}) => {
  if (val.yearMonth !== undefined) {
    formSelectData.value.yearMonth = val.yearMonth;
  }
  if (val.verifyType !== undefined && val.verifyType !== "") {
    formSelectData.value.verifyType = val.verifyType;
  }
  formSelectData.value.plantCode = val.plantCode;
  formSelectData.value.depotCode = val.depotCode;
  formSelectData.value.partitionCode = val.partitionCode;
};

onMounted(() => {
  // getList();
  // 用料地区下拉已由列配置 requestOptions 自动加载，无需在此预取
  // proxy.$refs.formdataRef.formData = {
  //   yearMonth: getCookie("warehouseYearMonth"),
  //   verifyType: 1,
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
