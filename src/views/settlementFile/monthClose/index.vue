<!-- 数据安全检查 -->
<template>
  <div class="app-container app-container-splitpanes">
    <!-- <el-row
      :gutter="20"
      class="app-container-row integrated-manage-pane-form integrated-manage-pane-form-a"
    >
      <el-col class="app-container-col">
        <button-top :buttonJson="tableButtonJson" @handleButton="handleButtonClick">
          <el-checkbox
            v-model="isOverVisible"
            true-label="0"
            false-label="1"
            @change="isOverFen"
            >包括库存为0的物资卡片</el-checkbox
          >
          <right-toolbar
            v-model:showSearch="showSearch"
            :tableJson="tableJsonArr"
            @queryTable="getList"
            @tabConfigSuccess="tabConfigSuccess"
          ></right-toolbar>
        </button-top>
        <table-index
          class="table-index"
          :loading="loading"
          :idName="idName"
          :queryParams="queryParams"
          :tableJson="tableJsonArr"
          :tableButtonJson="tableButtonJson"
          :selectionShow="false"
          :tableData="tableData"
          @handleSelectionChange="handleSelectionChange"
          operationWidth="150"
          @handleButtonClick="handleButtonClick"
        >
          <template #stopnoteFlag="{ scope }">
            <el-checkbox
              v-model="scope.row.stopnoteFlag"
              id="scope.row.recoredId"
              true-label="0"
              false-label="1"
              :disabled="scope.row.isSubmittings"
              @change="checkStopnoteFlagFun(scope)"
            >
              <span v-if="scope.row.stopnoteFlag === '1'">禁止</span>
              <span v-else>允许</span>
            </el-checkbox>
          </template>
          <template #checkFlag="{ scope }">
            <el-link type="primary" v-if="scope.row.checkFlag == '0'" @click="onAudit"
              >未校验</el-link
            >
            <span v-else>已校验</span>
          </template>
          <template #closeFlag="{ scope }">
            <el-checkbox
              v-model="scope.row.closeFlag"
              id="scope.row.recoredId"
              true-label="0"
              false-label="1"
              :disabled="scope.row.isSubmitting"
              @change="checkCloseFlagFun(scope)"
            >
              <span v-if="scope.row.closeFlag === '1'">封账</span>
              <span v-else>开账</span>
            </el-checkbox>
          </template>
        </table-index>

        <pagination
          v-show="total > 0"
          :total="total"
          v-model:page="queryParams.pageNum"
          v-model:limit="queryParams.pageSize"
          @pagination="getList"
        />
      </el-col>
    </el-row> -->
    <el-row :gutter="20" class="app-container-row integrated-manage-pane-form integrated-manage-pane-form-a">
      <el-col class="app-container-col">
    <el-pro-table
      ref="proTableRef" 
      :columns="columns"
      :page-size="queryParams.pageSize"
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
      <template #stopnoteFlag="{ row }">
        <el-checkbox
          v-model="row.stopnoteFlag"
          id="row.recoredId"
          true-label="0"
          false-label="1"
          :disabled="row.isSubmittings"
          @change="() => checkStopnoteFlagFun(row)"
        >
          <span v-if="row.stopnoteFlag === '1'">禁止</span>
          <span v-else>允许</span>
        </el-checkbox>
      </template>
      <template #checkFlag="{ row }">
        <el-link type="primary" v-if="row.checkFlag == '0'" @click="onAudit"
          >未校验</el-link
        >
        <span v-else>已校验</span>
      </template>
      <template #closeFlag="{ row }">
        <el-checkbox
          v-model="row.closeFlag"
          id="scope.row.recoredId"
          true-label="0"
          false-label="1"
          :disabled="row.isSubmitting"
          @change="checkCloseFlagFun(row)"
        >
          <span v-if="row.closeFlag === '1'">封账</span>
          <span v-else>开账</span>
        </el-checkbox>
      </template>
    </el-pro-table>
    </el-col>
    </el-row>
  </div>
</template>

<script setup name="system-parameter-configuration">
import { formJson } from "./formJson";
import { tableJson, toolbarConfig } from "./tableJson";
import { getLocalStorage } from "@/utils/auth";
import {
  getMonthCloseList,
  getStopnoteFlag,
  getCloseFlag,
  getCarryOver,
} from "@/api/settlementFile/monthCloseGroup";
import { onMounted, ref } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import { getCookie } from "@/utils/auth";

const { proxy } = getCurrentInstance();
const columns = tableJson;
const height = 460;

const tableJsonArr = ref(
  JSON.parse(getLocalStorage(proxy.$route.meta?.menuId)) || tableJson
);
const tableData = ref([]);
const loading = ref(false);
const showSearch = ref(true);
const selectionData = ref([]);
const ids = ref([]);
const total = ref(0);
const rowData = ref([]);
const idName = ref("recoredId");
const formSelectData = ref({});
const isOverVisible = ref(1);

const data = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 30,
    yearMonth: "",
  },
});

const { queryParams } = toRefs(data);

const tabConfigSuccess = (data) => {
  tableJsonArr.value = data;
};

/** 查询列表 */
const getList = async () => {
  loading.value = true;

  getMonthCloseList(queryParams.value)
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
//   queryParams.value.pageNum = 1;
//   let res;
//   if (data.yearMonth) {
//     res = { ...data };
//     res.yearMonth = res.yearMonth.split("-").slice(0, 2).join("");
//   } else {
//     res = { ...data };
//   }

//   queryParams.value = Object.assign({}, queryParams.value, res);
//   getList();
// };

// /** 重置按钮操作 */
// const resetQuery = (data) => {
//   handleQuery(data);
//   proxy.$refs.formdataRef.formData = {
//     yearMonth: getCookie("warehouseYearMonth"),
//   };
// };

const onAudit = () => {
  proxy.$router.push({ path: "/settlementFile/dataSecAudit" });
};

function handleSelectionChange(selection) {
  ids.value = [];
  selectionData.value = selection;
  selectionData.value.map((item) => {
    ids.value.push(item.recoredId);
  });
}
//本月结转
const carryOverBtn = async () => {
  let ter = getCookie("warehouseYearMonth").split("-").slice(0, 2).join("");

  let list = [];
  tableData.value.map((item) => {
    if (item.yearMonth === ter) {
      list.push(item.recoredId);
    }
  });

  let res = await getCarryOver({
    ids: list,
    yearMonth: ter,
    isOver: isOverVisible.value,
    ...formSelectData.value,
  });
  if (res.code === 0) {
    ElMessage.success(res.message);
  } else {
    ElMessage.error(res.message);
  }
  getList();
};

// 0库存是否结转
const isOverFen = () => {
  formSelectData.value.isOver = isOverVisible.value;
  getList();
};

const playBatchVisible = ref(false);
const onAction = (payload) => {
  const { code, row, files } = payload;
  const eventObj = {
    carryOver: () => {
      carryOverBtn();
    },
    isOver: () => {
      isOverFen();
    },
  };
  eventObj[code] && eventObj[code]();
};

// 登卡操作
const stopnoteIds = ref([]);
const checkStopnoteFlagFun = async (row) => {
  if (row.isSubmittings) return;
  row.isSubmittings = true;
  try {
    stopnoteIds.value = [];
    stopnoteIds.value.push(row.recoredId);

    // let yearTime = proxy.$refs.formdataRef.formData;
    // if (!yearTime.yearMonth) {
    //   ElMessage.warning("请先选择年月");
    //   return;
    // }
    let res = await getStopnoteFlag(
      {
        ids: stopnoteIds.value,
        yearMonth: getCookie("warehouseYearMonth").split("-").slice(0, 2).join(""),
      },
      row.stopnoteFlag
    );
    if (res.data == 1) {
      tableData.value.forEach((item) => {
        if (item.recoredId === row.recoredId) {
          item.stopnoteFlag = row.stopnoteFlag == "1" ? "0" : "1";
        }
      });
      ElMessage.error(res.message);
    } else {
      ElMessage.success(res.message);
    }
    getList();
  } catch (error) {
    tableData.value.forEach((item) => {
      if (item.recoredId === row.recoredId) {
        item.stopnoteFlag = row.stopnoteFlag == "1" ? "0" : "1";
      }
    });
  } finally {
    row.isSubmittings = false;
  }
};

// 封账操作
const closeIds = ref([]);
const checkCloseFlagFun = async (row) => {
  if (row.isSubmitting) return;
  row.isSubmitting = true;
  try {
    closeIds.value = [];
    closeIds.value.push(row.recoredId);
    // let yearTime = proxy.$refs.formdataRef.formData;
    // if (!yearTime.yearMonth) {
    //   ElMessage.warning("请先选择年月");
    //   return;
    // }

    let res = await getCloseFlag(
      {
        ids: closeIds.value,
        yearMonth: getCookie("warehouseYearMonth").split("-").slice(0, 2).join(""),
      },
      row.closeFlag
    );
    if (res?.data == 1) {
      tableData.value.forEach((item) => {
        if (item.recoredId === row.recoredId) {
          item.closeFlag = row.closeFlag == "1" ? "0" : "1";
        }
      });
      ElMessage.error(res.message);
    } else {
      ElMessage.success(res.message);
    }
    getList();
  } catch (error) {
    tableData.value.forEach((item) => {
      if (item.recoredId === row.recoredId) {
        item.closeFlag = row.closeFlag == "1" ? "0" : "1";
      }
    });
  } finally {
    row.isSubmitting = false;
  }
};

const handleSelectChange = (val, value) => {};

onMounted(() => {
  getList();
  // proxy.$refs.formdataRef.formData = {
  //   yearMonth: getCookie("warehouseYearMonth"),
  // };
});
</script>
<style lang="scss" scoped>
.form-data {
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
