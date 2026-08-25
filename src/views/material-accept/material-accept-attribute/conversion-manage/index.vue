<template>
  <div class="material-accetp-attribute-batch-manage-page">
    <el-row class="app-container-row integrated-manage-pane-form integrated-manage-pane-form-a material-accetp-attribute-batch-manage-row-2">
      <el-col class="app-container-col">
        <el-pro-table
          :columns="columns"
          :data="tableData"
          :pagination="pagination"
          :page-size="queryParams.pageSize"
          action-width="100"
          :total="total"
          :toolbar-config="toolBarConfig"
          :search-collapse-threshold="4"
          @action="handleAction"
          @search="tableSearch"
          @reset="tableReset"
        />
      </el-col>
    </el-row>
    <add-matl-dialog class="add-matl-dialog" title="选择物资" :visible="addMatlVisible" width="90%" @dialog-close="addMatlDialogClose">
      <template #default>
        <el-row class="app-container-row integrated-manage-pane-form integrated-manage-pane-form-a">
          <el-col :span="19" class="add-matl-dialog-left">
            <el-row class="app-container-row integrated-manage-pane-form integrated-manage-pane-form-a" style="height: 100%;">
              <el-col>
                <el-pro-table
                  ref="addMatlTableRef"
                  :columns="mColumns"
                  :data="matlTableData"
                  :pagination="mPagination"
                  :page-size="addMatlQueryParams.pageSize"
                  :total="matlTableCount"
                  :search-collapse-threshold="3"
                  :show-action="false"
                  :keep-selection="true"
                  v-loading="addMatlLoading"
                  :show-checkbox="true"
                  :table-alert-render="false"
                  :grid-options="{rowId: 'matlCode'}"
                  @selection-change="handleMatlSelectionChange"
                  @search="mTableSearch"
                  @reset="mTableReset"
                />
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="5">
            <div class="select-matl-box">
              <div class="select-matl-box-header">
                <div class="select-matl-box-header-left">
                  <span>已选</span>
                  <span>（{{ matlTableSelectedData.length || 0 }}）</span>
                </div>
                <div class="select-matl-box-header-right">
                  <el-button type="primary" link @click="clearMatlTableSelectedData">清空</el-button>
                </div>
              </div>
              <div class="select-matl-box-content">
                <div v-for="item in matlTableSelectedData" class="select-matl-box-content-item">
                  <div class="select-matl-box-content-item-title">{{ item.matlCode }}{{ item.matlName }}</div>
                  <div class="select-matl-box-content-item-close" @click="toggleMatlTableSelectedItem(item, false)">x</div>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </template>
      <template #footer>
        <div>
          <el-button @click="addMatlDialogClose">取消</el-button>
          <el-button :disabled="!!!matlTableSelectedData.length" type="primary" @click="addMatlDialogConfirm">确定</el-button>
        </div>
      </template>
    </add-matl-dialog>
  </div>
</template>

<script setup>
import { formJson } from "./formJson";
import { tableJson, tableButtonJson, matlTableJson } from "./tableJson";
import attributeTable from "../components/attributeTable.vue";
import addMatlDialog from "../components/addMatlDialog.vue";
import { listToTree } from "../tool";
import { ElMessage, ElMessageBox } from "element-plus";
import { paramConfignoAuthorizeList} from "@/api/materialAccept/acceptMaterial.js";
import { addConversion, delConversion, getConversionPage } from "@/api/materialAccept/matlBatch.js";
import { formatDate } from "@/utils/index.js";
import { matlcateNoAuthorizeTree } from "@/api/warehouse/inventory.js";
import { parseTime } from "@/utils/generalMethod.js";

const validDateUnitOptions = [
  { label: "天", value: "day" },
  { label: "周", value: "week" },
  { label: "月", value: "month" },
  { label: "年", value: "year" }
]


const loading = ref(false);
const formRef = ref(null);
const showSearch = ref(true);
const queryParams = ref({
  pageNum: 1,
  pageSize: 30,
});
const tableData = ref([]);
const total = ref(0);

// 选择物资
const addMatlLoading = ref(false);
const matlTreeLoading = ref(false);
const defaultExpandedKeys = ref(["all"]);
const addMatlVisible = ref(false);
const addMatlFormRef = ref(null);
const addMatlTableRef = ref(null);
const addMatlFormJson = ref([
  { prop: "matlCode", label: "物资编码", type: "input" },
  { prop: "matlName", label: "物资名称", type: "input" },
]);
const addMatlQueryParams = ref({
  pageNum: 1,
  pageSize: 30,
});
const currentCategory = ref("");
const selectMatlCount = ref(0);
const matlTableData = ref([]);
const matlTableCount = ref(0);
const matlTableSelectedData = ref([]);
const matlCategoryTreeData = ref([{
  matlCateName: "全部类别",
  matlCateCode: "all",
  supCateCode: "",
  children: [],
}]);

const searchFormData = ref({});

const pagination = { current: queryParams.value.pageNum, pageSize: queryParams.value.pageSize, total: total.value, pageSizes: [10, 20, 30, 50] };

const getMatlCateName = (data) => {
  if (data.matlCateCode !== "all" && data.matlCateCode) {
    return `${data.matlCateCode} ${data.matlCateName}`;
  } else {
    return `${data.matlCateName}`
  }
}

const columns = [
  { field: "matlCode", title: "物资编码", minWidth: 160, align: "center", searchable: true, searchType: "input", },
  { field: "matlName", title: "物资名称", minWidth: 200, align: "center", searchable: true, searchType: "input", },
  { field: "matlCateCode", title: "物资类别", hideInTable: true, searchable: true, searchType: "treeSelect", searchProps: {
    data: matlCategoryTreeData.value,
    nodeKey: "matlCateCode",
    defaultExpandedKeys: defaultExpandedKeys.value,
    expandOnClickNode: false,
    checkStrictly: true,
    props: {
      label: getMatlCateName,
    }
  },},
  { field: "matlType", title: "规格类型", minWidth: 200, align:  "center", },
  { field: "matlUnit", title: "计量单位", minWidth: 120, align:  "center", },
  { field: "createDate", title: "添加时间", minWidth: 120, align: "center", render: (row) => parseTime(row.createDate, '{y}-{m}-{d}')},
];

const toolBarConfig = {
  buttons: [
    { code: "add", name: "选择物资", type: "primary", showInTop: true, showInRow: false, },
    { code: "del", name: "删除", type: "danger", showInTop: false, showInRow: true, },
  ]
}

//---选择物资---
const mSearchFormData = ref();

const mPagination = { current: addMatlQueryParams.value.pageNum, pageSize: addMatlQueryParams.value.pageSize, total: matlTableCount, pageSizes: [10, 20, 30, 50] };

const mColumns = [
  { field: "matlCode", title: "物资编码", "min-width": 180, align: "center", searchable: true, searchType: "input", },
  { field: "matlName", title: "物资名称", "min-width": 200, align: "center", searchable: true, searchType: "input", },
  { field: "matlCateCode", title: "物资类别", hideInTable: true, searchable: true, searchType: "treeSelect", searchProps: {
    data: matlCategoryTreeData.value,
    nodeKey: "matlCateCode",
    defaultExpandedKeys: defaultExpandedKeys.value,
    expandOnClickNode: false,
    checkStrictly: true,
    placeholder: "请选择 物资类别",
    props: {
      label: getMatlCateName,
    }
  }},
  { field: "matlType", title: "规格类型", "min-width": 180, align:  "center", },
  { field: "matlUnit", title: "计量单位", "min-width": 180, align:  "center", },
];

const gridOptions = ref({
  rowId: 'matlCode'
})

const getList = async () => {
  loading.value = true;

  try {
    const res = await getConversionPage({
      ...queryParams.value,
      ...searchFormData.value,
    });
    tableData.value = res.data?.list || [];
    total.value = res.data?.total || 0;
  } catch (error) {
    console.log(error);
  }

  loading.value = false;
}

const handleHomeTableButtonClick = (prop, {row}) => {
  if (prop === "del") {
    ElMessageBox.confirm(
      "确定要删除吗？",
      "提示",
      {
        type: "warning",
      }
    ).then(async () => {
      loading.value = true;

      try {
        const res = await delConversion({
          id: row.id,
        });
        ElMessage.success("删除成功！");
        getList();
      } catch (error) {
        
      }
      
      loading.value = false;
    }).catch(err => {});
  }
}

const getMaltCategory = async () => {
  matlTreeLoading.value = true;
  try {
    const res = await matlcateNoAuthorizeTree();
    matlCategoryTreeData.value[0].children = res.data || [];
    // defaultExpandedKeys.value = ["all"];
  } catch (error) {
  }
  matlTreeLoading.value = false;
}

const getMaltList = async () => {

  addMatlLoading.value = true;

  try {
    
    const res = await paramConfignoAuthorizeList({
      ...addMatlQueryParams.value,
      // ...addMatlFormRef.value?.formData,
      ...mSearchFormData.value,
    });
    const arr = res.data?.list || [];

    matlTableData.value = arr;
    matlTableCount.value = res.data?.total || 0;
  } catch (error) {
    console.log(error);
  }

  addMatlLoading.value = false;
}

const toAddMatl = async () => {
  addMatlVisible.value = true;
  // matlTableSelectedData.value = [...selectedTableData.value];
  Promise.all([getMaltList()]).then(() => {
    clearMatlTableSelectedData();
    // for (const item of matlTableSelectedData.value) {
    //   toggleMatlTableSelectedItem(item, true);
    // }
  });
}

const addMatlDialogClose = () => {
  addMatlQueryParams.value.pageNum = 1;
  matlTableSelectedData.value = [];
  currentCategory.value = "";
  clearMatlTableSelectedData();
  addMatlVisible.value = false;
}

const addMatlDialogConfirm = async () => {

  try {
    const res = await addConversion(matlTableSelectedData.value.map(item => ({
      matlCode: item.matlCode,
      matlName: item.matlName,
      matlType: item.matlType,
      matlUnit: item.matlUnit,
    })));
    ElMessage.success("创建成功！");
    addMatlQueryParams.value.pageNum = 1;
    // addMatlVisible.value = false;
    addMatlDialogClose();
    getList();
  } catch (error) {
    
  }
}

const handleMatlSelectionChange = (data) => {
  matlTableSelectedData.value = [...data];
}

const clearMatlTableSelectedData = () => {
  addMatlTableRef.value?.clearSelection();
}

const toggleMatlTableSelectedItem = (data, flag) => {
  addMatlTableRef.value?.toggleRowSelection(data, flag);
}

const handleAction = ({code, name, row}) => {
  if (code === "add") {
    toAddMatl();
  }

  if (code === "del") {
    ElMessageBox.confirm(
      "确定要删除吗？",
      "提示",
      {
        type: "warning",
      }
    ).then(async () => {
      loading.value = true;

      try {
        const res = await delConversion({
          id: row.id,
        });
        ElMessage.success("删除成功！");
        getList();
      } catch (error) {
        
      }
      
      loading.value = false;
    }).catch(err => {});
  }
}

const tableSearch = (form, pageInfo) => {
  searchFormData.value = {...form};
  queryParams.value.pageNum = pageInfo.page;
  queryParams.value.pageSize = pageInfo.pageSize;

  getList();
}

const tableReset = () => {
  searchFormData.value = {};
  queryParams.value.pageNum = 1;

  getList();
}

//---选择物资---
const mTableSearch = (form, pageInfo) => {
  mSearchFormData.value = {...form};
  addMatlQueryParams.value.pageNum = pageInfo.page;
  addMatlQueryParams.value.pageSize = pageInfo.pageSize;

  getMaltList();
}

const mTableReset = () => {
  mSearchFormData.value = {};
  addMatlQueryParams.value.pageNum = 1;
  currentCategory.value = "";

  getMaltList();
}

onBeforeMount(() => {
  getMaltCategory();
});

onMounted(() => {
  getList();
});
</script>

<style lang="scss" scoped>
.material-accetp-attribute-batch-manage-page {
  width: 100%;
  height: 100%;
  >.ep-row {
    height: auto;
    &.material-accetp-attribute-batch-manage-row-1 {
      .ep-col {
        border-bottom: none;
      }
    }
    &.material-accetp-attribute-batch-manage-row-2 {
      height: calc(100% - 20px);
      .ep-col {
        border-top: none;
        &:first-child {
          border-right: none;
          overflow: auto;
        }
      }
      :deep(.home-table-index) {
        .ep-button {
          &:last-child {
            >span {
              color: red;
            }
          }
        }
      }
      :deep(.ep-pro-table) {
        height: 100%;
        overflow: auto;
        .ep-pro-table__wrapper {
          height: 100%;
        }
        .ep-pro-table__body {
          height: calc(100% - 210px);
        }
      }
    }
    :deep(.ep-tree) {
      .ep-tree-node {
        &.is-current {
          >.ep-tree-node__content {
            background-color: #64a1ff !important;
            .ep-icon,.ep-text {
              color: #ffffff;
            }
          }
        }
        .ep-tree-node__content {
          &:hover {
            background-color: #93befe !important;
            .ep-icon, .ep-text {
              color: #ffffff;
            }
          }
        }
      }
    }
  }
  :deep(.ep-dialog) {
    height: 80vh;
    .ep-dialog__body {
      overflow: auto;
    }
    .ep-table {
      min-height: 220px;
    }
  }
  :deep(.add-matl-dialog) {
    .ep-dialog__body {
      height: calc(100% - 39.39px - 57px);
      .ep-col.add-matl-dialog-left {
        border-right: 1px solid rgb(210, 210, 210);
        .ep-table {
          padding-top: 5px;
          margin-bottom: 5px;
        }
        .ep-pro-table {
          height: 100%;
          overflow: auto;
          .ep-pro-table__wrapper {
            height: 100%;
          }
          .ep-pro-table__body {
            height: calc(100% - 240px);
          }
        }
      }
      >.ep-row {
        >.ep-col {
          >.ep-row {
            height: calc(100% - 62px - 46px);
          }
        }
      }
      .select-matl-box {
        padding: 10px;
        .select-matl-box-header {
          width: 100%;
          display: flex;
          justify-content: space-between;
        }
        .select-matl-box-content {
          padding-top: 3px;
          .select-matl-box-content-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 3px;
            padding: 2px 4px;
            &:hover {
              background-color: #f0f1f5;
            }
            .select-matl-box-content-item-close {
              cursor: pointer;
              margin-left: 4px;
            }
          }
        }
      }
      .ep-tree {
        .ep-tree-node {
          &.is-current {
            >.ep-tree-node__content {
              background-color: #64a1ff !important;
              .ep-icon,.ep-text {
                color: #ffffff;
              }
            }
          }
          .ep-tree-node__content {
            &:hover {
              background-color: #93befe !important;
              .ep-icon, .ep-text {
                color: #ffffff;
              }
            }
          }
        }
      }
    }
  }
}
</style>