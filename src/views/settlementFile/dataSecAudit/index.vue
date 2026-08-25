<!-- 数据安全检查 -->
<template>
  <div class="app-container app-container-splitpanes">
    <el-pro-table
      :columns="flagVisible === 1 ? tableJsonArr : tablePriceJson"
      :page-size="queryParams.pageSize"
      :height="height"
      :toolbar-config="toolbarConfig"
      :search-collapse-threshold="3"
      :default-search-form="defaultSearchForm"
      @action="onAction"
      :data="tableData"
      :total="total"
      :showResetButton="false"
      :showSearchButton="false"
      :show-checkbox="true"
      :selection-mode="'multiple'"
      :keep-selection="true"
    >
    </el-pro-table>

    <detail-dialog ref="detailDialog" @deleteSuccess="getList" />
  </div>
</template>

<script setup name="system-parameter-configuration">
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
import { onMounted } from "vue";
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
const plantSelectList = ref([]); // 地区
const depotSelectList = ref([]); //  仓库
const partationList = ref([]); // 仓库地区
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

/** 搜索按钮操作 */
const flagVisible = ref(1);
const handleQuery = (data) => {
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
  // verifyCheck(
  //   res.verifyType,
  //   res.yearMonth,
  //   res.depotCode || "",
  //   res.plantCode || "",
  //   res.partitionCode || ""
  // );
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

// 获取地区列表
const getPlantList = async () => {
  let { data } = await plantDictList();
  plantSelectList.value = data;
  // formSelectData.value.plantCode = data.map((item) => {
  //   return {
  //     label: `【${item.plantCode}】${item.plantName}`,
  //     value: item.plantCode,
  //     ...item,
  //   };
  // });
};

// 获取仓库列表
const warehouseList = async (value) => {
  formSelectData.value.depotCode = "";
  formSelectData.value.partitionCode = "";
  let { data } = await warehouseDict(value);
  depotSelectList.value = data;
  // formSelectData.value.depotCode = data.map((item) => {
  //   return {
  //     label: `【${item.whCode}】${item.whName}`,
  //     value: item.whCode,
  //     ...item,
  //   };
  // });
};

// 获取仓库分区
const partationFun = async (value) => {
  formSelectData.value.partitionCode = "";
  let { data } = await partation(value);
  partationList.value = data;
  // formSelectData.value.partitionCode = data.map((item) => {
  //   return {
  //     label: `【${item.partitionCode}】${item.partitionName}`,
  //     value: item.partitionCode,
  //     ...item,
  //   };
  // });
};

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
//       if (item.depotCode === value) {
//         id = item.id;
//       }
//     });
//     partationFun(id);
//   }
// };

// 用料地区逻辑
const plantIds = ref("");
const plantChange = (val) => {
  plantSelectList.value.map((item) => {
    if (item.plantCode === val) {
      plantIds.value = item.id;
    }
  });
  warehouseList(plantIds.value);
};

// 仓库逻辑
const depotIds = ref("");
const deptChange = (val) => {
  depotSelectList.value.map((item) => {
    if (item.whCode === val) {
      depotIds.value = item.id;
    }
  });
  partationFun(depotIds.value);
};

onMounted(() => {
  // getList();
  getPlantList();
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
