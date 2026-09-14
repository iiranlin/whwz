<template>
  <div class="app-container app-container-splitpanes inventory-create-page">
    <el-row :gutter="20" class="app-container-row integrated-manage-pane-form integrated-manage-pane-form-a">
      <el-col class="app-container-col">
        <div class="ep-pro-table__search-area">
        <inventory-form ref="formRef" :show-search="showSearch" :form-json="formJson" @handle-query="handleQuery" @reset-query="resetQuery" :rules="formRules"></inventory-form>
        </div>
        <div class="ep-pro-table__toolbar">
          <el-form label-position="left" class="flex1">
            <el-button type="primary" @click="inventoryRangeSelect" :disabled="!!!formRef?.formData.partitionCode">盘点范围选择</el-button>
            <el-button :disabled="!!!tableData.length" type="primary" class="tableButton" @click="handleCreate">生成</el-button>
            <el-button :disabled="!!!tableData.length" type="primary" class="tableButton" @click="handleExport">导出</el-button>
            <el-button :disabled="!replayFalg" type="primary" class="tableButton" @click="handleReplay">重新盘点</el-button>
          </el-form>
          <div class="ep-pro-table__toolbar-tools">
            <right-toolbar v-model:showSearch="showSearch" :tableJson="tableJsonArr" @queryTable="rightToolGetList" @tabConfigSuccess="tabConfigSuccess"></right-toolbar>
          </div>
        </div>
        <!-- 表格数据 -->
        <table-index
          class="table-index"
          :loading="loading"
          idName="cardId"
          :queryParams="queryParams"
          :tableJson="tableJsonArr"
          :tableData="paginatedData"
          :selectionShow="false"
        >
          <template #validityPeriodUnit="{name, scope}">
            {{ scope.row.validityPeriodUnit ? validityPeriodUnitObj[scope.row.validityPeriodUnit] || "" : "" }}
          </template>
          <template #productionDate="{name, scope}">
            {{ parseTime(scope.row.productionDate, "{y}-{m}-{d}") }}
          </template>
          <template #expirationDate="{name, scope}">
            {{ parseTime(scope.row.expirationDate, "{y}-{m}-{d}") }}
          </template>
        </table-index>
        <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
          v-model:limit="queryParams.pageSize" @pagination="paginationChange" />
      </el-col>
    </el-row>
    <inverntory-range-dialog class="inventory-range-dialog" title="盘点范围选择" :visible="inventoryRangeVisible" @dialog-close="inventoryRangeDialogClose" width="90%">
      <template #default>
        <el-row :gutter="20" class="app-container-row integrated-manage-pane-form integrated-manage-pane-form-a">
          <el-col :span="19" class="add-matl-dialog-left">
            <form-data
              ref="rangeFormRef"
              :show-search="showSearch"
              :form-json="rangeFormJson"
              @handle-query="handleRangeQuery"
              @reset-query="resetRangeQuery"
              :isShowMore="false"
            />
            <el-row :gutter="20" class="app-container-row integrated-manage-pane-form integrated-manage-pane-form-a">
              <el-col :span="5" style="overflow: auto;">
                <el-tree
                  key="matlTree"
                  v-loading="rangeTreeLoading"
                  style="width: 100%;"
                  node-key="matlCateCode"
                  :data="matlCategoryTreeData"
                  :props="{children: 'children', label: getTreeLabelName}"
                  :default-expanded-keys="defaultExpandedKeys"
                  :expand-on-click-node="false"
                  @node-click="categoryTreeClick"
                />
              </el-col>
              <el-col :span="19">
                <range-table
                  ref="rangeTableRef"
                  class="table-index"
                  :loading="rangeTableLoading"
                  idName="cardId"
                  :queryParams="rangeQueryParams"
                  :tableJson="rangeTableJson"
                  :tableData="rangeTableData"
                  :selectionShow="true"
                  @handleSelectionChange="handleRangeSelectionChange"
                  :reserveSelection="true"
                  @handle-query="tableHandleQuery"
                >
                  <template #validityPeriodUnit="{name, scope}">
                    {{ scope.row.validityPeriodUnit ? validityPeriodUnitObj[scope.row.validityPeriodUnit] || "" : "" }}
                  </template>
                  <template #productionDate="{name, scope}">
                    {{ parseTime(scope.row.productionDate, "{y}-{m}-{d}") }}
                  </template>
                  <template #expirationDate="{name, scope}">
                    {{ parseTime(scope.row.expirationDate, "{y}-{m}-{d}") }}
                  </template>
                </range-table>
                <pagination
                  v-show="rangeTotal > 0"
                  :total="rangeTotal"
                  v-model:page="rangeQueryParams.pageNum"
                  v-model:limit="rangeQueryParams.pageSize"
                  @pagination="getRangeList"
                />
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="5">
            <div class="select-matl-box" v-loading="rangeTableLoading">
              <div class="select-matl-box-header">
                <div class="select-matl-box-header-left">
                  <span>已选</span>
                  <span>（{{ rangeSelectedTableData.length || 0 }}）</span>
                </div>
                <div class="select-matl-box-header-right">
                  <el-button type="primary" link @click="clearRangeableSelectedData">清空</el-button>
                </div>
              </div>
              <div class="select-matl-box-content">
                <div v-for="item in rangeSelectedTableData" class="select-matl-box-content-item">
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
          <el-button @click="inventoryRangeDialogClose">取消</el-button>
          <el-button type="primary" @click="inventoryRangeDialogConfirm">确定</el-button>
        </div>
      </template>
    </inverntory-range-dialog>
  </div>
</template>

<script setup name="inventory-create">
import InventoryForm from './components/InventoryForm.vue';
import { formJson, formRules, rangeFormJson } from './formJson';
import { tableJson, rangeTableJson } from './tableJson';
import { getLocalStorage } from '@/utils/auth';
import { ElMessageBox, ElMessage } from 'element-plus';
import rangeTable from "./components/RangeTable.vue";
import { selectUncountedStockList, exportUncountedStockList, create, matlcateNoAuthorizeTree, createCode } from '@/api/warehouse/inventory';
import inverntoryRangeDialog from "./components/inventoryRangeDialog.vue";
import { validityPeriodUnitObj } from '@/utils/dictionary';
import { paramConfignoAuthorizeList} from "@/api/materialAccept/acceptMaterial.js";
import { rmstorMatlSelectPageList } from "@/api/warehouse/rmstorInternal.js";
import { getCookie } from '@/utils/auth';
import { parseTime } from "@/utils/generalMethod.js";

const { proxy } = getCurrentInstance();
const yearMonth = getCookie('warehouseGetYear') ? JSON.parse(getCookie('warehouseGetYear')).yearMonth ? JSON.parse(getCookie('warehouseGetYear')).yearMonth : parseTime(new Date(), '{y}{m}') : parseTime(new Date(), '{y}{m}');

const route = useRoute();
const loading = ref(false);
const rangeDialogLoading = ref(false);
const showSearch = ref(true);
const tableJsonArr = ref(JSON.parse(getLocalStorage(route.meta?.menuId)) || tableJson);
const queryParams = ref({
  pageNum: 1,
  pageSize: 30,
});
const tableData = ref([]);
const total = ref(0);
const formRef = ref(null);
const rangeFormRef = ref(null);
const inventoryRangeVisible = ref(false);
const rangeTreeLoading = ref(false);
const currentCategory = ref("");
const defaultExpandedKeys = ref(["all"]);
const matlCategoryTreeData = ref([{
  matlCateName: "全部类别",
  matlCateCode: "all",
  supCateCode: "",
  children: [],
}]);
const rangeQueryParams = ref({
  pageNum: 1,
  pageSize: 30,
  // isAsc: "desc",
  // orderByColumn: "cardPrice",
});
const rangeTableLoading = ref(false);
const rangeTableRef = ref(null);
const rangeTotal = ref(0);
const rangeTableData = ref([]);
const rangeSelectedTableData = ref([]);

const getList = async () => {
  loading.value
  try {
    const res = await selectUncountedStockList({
      // ...queryParams.value,
      currentCount: formRef.value.formData.currentCount,
      numIsNotZero: formRef.value.formData.numIsNotZero.length ? true : false,
      plantCode: formRef.value.formData.plantCode,
      depotCode: formRef.value.formData.depotCode,
      partitionCode: formRef.value.formData.partitionCode,
      // "yearMonth": "202605",
    });
    tableData.value = res.data || [];
    total.value = res.data?.length || 0;
  } catch (error) {
    
  }
  loading.value = false;
}

const paginationChange = () => {
}

// const paginatedData = computed(() => {
//   const start = (queryParams.value.pageNum - 1) * queryParams.value.pageSize;
//   const end = start + queryParams.value.pageSize;
//   return tableData.value.slice(start, end);
// });

const paginatedData = ref([]);

watch(() => [tableData.value, queryParams.value.pageNum, queryParams.value.pageSize], () => {
  const start = (queryParams.value.pageNum - 1) * queryParams.value.pageSize;
  const end = start + queryParams.value.pageSize;
  paginatedData.value = tableData.value.slice(start, end);
}, {deep: true});


const handleQuery = (pageNumOne) => {
  if (pageNumOne) {
    queryParams.value.pageNum = 1;
  }
  getList();
}

const resetQuery = () => {
  queryParams.value.pageNum = 1;
  tableData.value = [];
  total.value = 0;
}

// 生成盘点单-成功后点击弹窗确定按钮弹窗消失、查询条件清空、列表数据清空
// 表单组件-控制查询条件清空，本页-控制弹窗、列表数据清空
const handleCreate = async () => {
  try {
    const plant = formRef.value.areaArr.find(item => item.plantCode === formRef.value.formData.plantCode);
    const depot = formRef.value.warehouseArr.find(item => item.whCode === formRef.value.formData.depotCode);
    const partition = formRef.value.partitionArr.find(item => item.partitionCode === formRef.value.formData.partitionCode);
    const plantName = plant ? plant.plantName : '';
    const depotName = depot ? depot.whName : '';
    const partitionName = partition ? partition.partitionName : '';
    const data = {
      plantName,
      plantCode: formRef.value.formData.plantCode,
      depotName,
      depotCode: formRef.value.formData.depotCode,
      partitionCode: formRef.value.formData.partitionCode,
      partitionName,
      yearMonth: yearMonth,
      "checkStockDtList": [...tableData.value],
      
    }

    createCode({name: "盘点单",  receiptDate: yearMonth}).then(async (_res) => {
      const res = await create({...data, csCode: _res.data});
      ElMessageBox.confirm(
        `盘点单生成成功！盘点单单号为${res.data?.csCode}`,
        "提示",
        {
          type: "warning",
          confirmButtonText: "确定",
          showCancelButton: false,
        }
      ).then(() => {}).catch(() => {}).finally(() => {
        formRef.value.resetQuery();
      });
    }).catch(() => {
      ElMessage.error("盘点单号生成失败！");
    })

    
  } catch (error) {
    
  }
  
}

const handleExport = async () => {
  try {
    const res = await exportUncountedStockList({
      // "yearMonth": "202605",
      currentCount: formRef.value.formData.currentCount,
      numIsNotZero: formRef.value.formData.numIsNotZero.length ? true : false,
      plantCode: formRef.value.formData.plantCode,
      depotCode: formRef.value.formData.depotCode,
      partitionCode: formRef.value.formData.partitionCode,
      cardIdList: tableData.value.map(item => (item.cardId || ""))
    });

    const plant = formRef.value?.areaArr.find(item => item.plantCode === formRef.value.formData.plantCode);
    const depot = formRef.value?.warehouseArr.find(item => item.whCode === formRef.value.formData.depotCode);
    const partition = formRef.value?.partitionArr.find(item => item.partitionCode === formRef.value.formData.partitionCode);
    const plantName = plant ? plant.plantName : '';
    const depotName = depot ? depot.whName : '';
    const partitionName = partition ? partition.partitionName : '';

    const url = URL.createObjectURL(new Blob([res.data], { type: res.headers['content-type'] }));
    const a = document.createElement('a');
    a.href = url;
    a.download = !!plantName ? `${plantName}-${depotName}-${partitionName}-物资卡片信息.xlsx` : '地区仓库物资卡片信息.xlsx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (err) {
    console.log(err);
  }
}

// 重新盘点-已盘点笔数、已盘点次数置为0
const handleReplay = async () => {

  try {
    tableData.value = [];
    total.value = 0;

    formRef.value.handleReplay();
  } catch (error) {
    
  }
}

const tabConfigSuccess = (data) => {
  tableJsonArr.value = data;
}

const replayFalg = ref(false);

watch(() => formRef.value?.formData.totalStock, (nval) => {
  if(!!!nval) {
    replayFalg.value = false;
  } else {
    replayFalg.value = true;
  }
})

// 右侧刷新
const rightToolGetList = () => {
  formRef.value.handleQuery(false);
}

const getTreeData = async () => {
  rangeTreeLoading.value = true;
  try {
    const res = await matlcateNoAuthorizeTree();
    matlCategoryTreeData.value[0].children = res.data || [];
  } catch (error) {
  }
  rangeTreeLoading.value = false;
}

const inventoryRangeSelect = async () => {
  inventoryRangeVisible.value = true;

  Promise.allSettled([getRangeList(), getTreeData()]).then(results => {
    if(results[1].status === 'fulfilled') {
      clearRangeableSelectedData();
      for (const element of tableData.value) {
        toggleRangeTableSelectedItem(element, true);
      }
    }
  })

}

const inventoryRangeDialogClose = () => {
  inventoryRangeVisible.value = false;
}

const inventoryRangeDialogConfirm = () => {
  if (rangeSelectedTableData.value.length != formRef.value.formData.currentCount) {
    ElMessage.warning("选择数量必须等于本次盘点数量！");
    return;
  }
  inventoryRangeVisible.value = false;
  tableData.value = [...rangeSelectedTableData.value];
  queryParams.value.pageNum = 1;
  // formRef.value.formData.currentCount = tableData.value.length
}

const getRangeList = async () => {
  rangeTableLoading.value = true;

  try {
    // const res = await selectUncountedStockList({
    //   currentCount: 0,
    //   matlCode: rangeFormRef.value?.formData.matlCode,
    //   matlName: rangeFormRef.value?.formData.matlName,
    //   matlCateCode: currentCategory.value,
      
    // });
    // rangeTableData.value = res.data || [];
    // rangeTotal.value = res.data?.length || 0;

    const res = await rmstorMatlSelectPageList({
      matlCode: rangeFormRef.value?.formData.matlCode,
      matlName: rangeFormRef.value?.formData.matlName,
      // matlCateCode: currentCategory.value,
      partitionCode: formRef.value?.formData.partitionCode,
      ...rangeQueryParams.value,
      // isAsc: rangeQueryParams.value.isAsc === "asc" ? true : false,
    });
    rangeTableData.value = res.data?.list || [];
    rangeTotal.value = res.data?.total || 0;

  } catch (error) {
    console.log(error);
  }

  setTimeout(() => {
    rangeTableLoading.value = false;
  }, 500);
}

const tableHandleQuery = (data) => {
  // rangeQueryParams.value.isAsc = data.isAsc === "asc" ? true : false;
  // rangeQueryParams.value.orderByColumn = data.orderBy;
  // rangeQueryParams.value.pageNum = 1;
  // delete rangeQueryParams.value.orderBy;
  // getRangeList();
}

const handleRangeQuery = () => {
  rangeQueryParams.value.pageNum = 1;
  getRangeList();
}

const resetRangeQuery = () => {
  rangeQueryParams.value.pageNum = 1;
  getRangeList();
}

const categoryTreeClick = (data) => {
  if (data.matlCateCode === "all") {
    currentCategory.value = "";
  } else {
    currentCategory.value = data.matlCateCode;
  }
  rangeQueryParams.value.pageNum = 1;
  rangeFormRef.value.formData.matlCode = currentCategory.value;
  getRangeList();
}

const handleRangeSelectionChange = (data) => {
  rangeSelectedTableData.value = [...data];
}

const toggleRangeTableSelectedItem = (data, flag) => {
  rangeTableRef.value?.toggleRowSelection(data, flag);
}

const toggleMatlTableSelectedItem = (data, flag) => {
  rangeTableRef.value?.toggleRowSelection(data, flag);
}

const clearRangeableSelectedData = () => {
  rangeTableRef.value?.clearTableSelection();
}

const getTreeLabelName = (data) => {
  if (data.matlCateCode !== "all" && data.matlCateCode) {
    return `${data.matlCateCode} ${data.matlCateName}`;
  } else {
    return `${data.matlCateName}`
  }
}

onMounted(() => {

})
</script>

<style lang="scss" scoped>
.inventory-create-page {
  :deep(.ep-form) {
    .ep-form-search {
      padding-bottom: 2px;
    }
    .ep-form-item {
      margin-bottom: 14px;
      margin-right: 32px;
    }
  }
  .integrated-manage-pane-form-button-1 {
    margin-bottom: 0px;
  }
  .integrated-manage-pane-form-button-2 {
    justify-content: flex-end;
  }
  :deep(.inventory-range-dialog) {
    height: 80vh;
    .ep-dialog__body {
      height: calc(100% - 39.39px - 57px);
      .ep-col.add-matl-dialog-left {
        border-right: 1px solid rgb(210, 210, 210);
        .ep-table {
          padding-top: 5px;
          margin-bottom: 5px;
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
        height: 100%;
        .select-matl-box-header {
          width: 100%;
          display: flex;
          justify-content: space-between;
        }
        .select-matl-box-content {
          padding-top: 3px;
          height: calc(100% - 19px);
          overflow-y: auto;
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
              margin-left: 4px;
              cursor: pointer;
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
.table-index {
  :deep(th) {
    color: #fff;
    background-color: #409EFF !important;
  }
}
</style>