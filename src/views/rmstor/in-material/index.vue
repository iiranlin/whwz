<!-- 进库料登记簿 -->
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
      <template #imCode-cell="{ row }">
        <el-link type="primary" @click="handleClickLink(row)">{{ row.imCode }}</el-link>
      </template>
    </el-pro-table>

    <add-dialog ref="addDialog" @createSuccess="getList()" />
    <personnel-dialog ref="personnelRef" @createSuccess="getList()" />
    <DetailDialog v-model="playBatchVisible" :rowData="rowData" />
  </div>
</template>

<script setup name="system-parameter-configuration">
import { formJson } from "./formJson";
import { tableJson, tableButtonJson } from "./tableJson";
import AddDialog from "./components/AddDialog";
import { getLocalStorage } from "@/utils/auth";
import {
  getMaterialList,
  materialDelete,
  plantDictList,
  warehouseDict,
} from "@/api/inMaterial/inMaterialGroup";
import { onMounted } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import { getCookie } from "@/utils/auth";
import DetailDialog from "./components/DetailDialog.vue";

const { proxy } = getCurrentInstance();
const columns = tableJson;

const pageSize = 10;
const height = 460;
const tableData = ref([]);
const loading = ref(false);
const showSearch = ref(true);
const ids = ref([]);
const total = ref(0);
const rowData = ref([]);
const idName = ref("immtId");
const plantSelectList = ref([]); // 地区
const depotSelectList = ref([]); //  仓库

const queryParams = ref({
  pageNum: 1,
  pageSize: 30,
});

//按钮配置项
const toolbarConfig = {
  buttons: [
    {
      code: "add",
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
  ],
};

/** 查询角色列表 */
const getList = async (params, pageConfig) => {
  loading.value = true;
  getMaterialList({ ...params, ...pageConfig })
    .then(({ data }) => {
      tableData.value = data.list || [];
      total.value = data.total;
    })
    .finally(() => {
      loading.value = false;
    });
};

// 批量删除
const handleDel = async () => {
  if (ids.value.length < 1) {
    ElMessage({
      message: "请选择至少一条数据",
      type: "warning",
    });
  } else {
    ElMessageBox.confirm("删除后将无法恢复，是否继续？", "警告", {
      confirmButtonText: "确认删除",
      cancelButtonText: "我再想想",
      type: "warning",
      center: true,
      distinguishCancelAndClose: true,
      beforeClose: (action, instance, done) => {
        if (action === "confirm") {
          instance.confirmButtonLoading = true;

          setTimeout(() => {
            done();
            materialDelete({ ids: ids.value }).then((res) => {
              ids.value = [];
              ElMessage.success("删除成功");
              getList();
            });
            instance.confirmButtonLoading = false;
          }, 1000);
        } else {
          done();
        }
      },
    });
  }
};
/** 多选框选中数据 */
const handleSelectionChange = (selection) => {
  ids.value = selection.map((item) => item.immtId);
};

const playBatchVisible = ref(false);
const onAction = (payload) => {
  const { code, row, files } = payload;

  const eventObj = {
    add: () => {
      proxy.$refs["addDialog"].show("create");
    },
    edit: () => {
      proxy.$refs["addDialog"].show("modify", row.immtId);
    },
    delete: () => {
      handleDel();
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

  columns[5].searchProps.options = data.map((item) => {
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
//   formSelectData.value.depotCode = data.map((item) => {
//     return {
//       label: `${item.whName}`,
//       value: item.whCode,
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
//   }
// };

onMounted(() => {
  getList();
  getPlantList();
});
</script>
<style lang="scss"></style>
