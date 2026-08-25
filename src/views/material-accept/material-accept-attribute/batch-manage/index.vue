<template>
  <div class="material-accetp-attribute-batch-manage-page">
    <el-row class="app-container-row integrated-manage-pane-form integrated-manage-pane-form-a material-accetp-attribute-batch-manage-row-2">
      <el-col class="app-container-col">
        <el-row v-if="false" :gutter="10" class="mb8 integrated-manage-pane-form-button">
          <el-col :span="1.5">
            <el-button type="primary" class="tableButton" @click="toHandleCreate">新增批次管理</el-button>
          </el-col>
        </el-row>
        <el-pro-table
          :columns="columns"
          :data="tableData"
          :pagination="pagination"
          :pager-config="pagerConfig"
          :pageSize="queryParams.pageSize"
          action-width="120"
          :total="total"
          :toolbar-config="toolBarConfig"
          :search-collapse-threshold="5"
          v-loading="loading"
          @action="handleAction"
          @search="tableSearch"
          @reset="tableReset"
        >
        </el-pro-table>
      </el-col>
    </el-row>
    <create-batch-dialog class="create-batch-dialog" title="新增批次管理" :visible="createVisible" width="90%" @dialog-close="createDialogClose">
      <template #default>
        <el-row :gutter="20" class="app-container-row integrated-manage-pane-form integrated-manage-pane-form-a">
          <el-col class="app-container-col">
            <div class="batch-manage-form-row">
              <div class="batch-manage-form-row-name">批次</div>
              <div class="batch-manage-form-row-content">
                <el-form :model="batchForm" inline :rules="batchFormRules">
                  <el-form-item label="启用批次管理：" prop="matlBatchStatus">
                    <el-switch :disabled="true" v-model="batchForm.matlBatchStatus"></el-switch>
                  </el-form-item>
                  <div class="batch-manage-form-row-content-item">
                    <!-- <div class="batch-manage-form-row-content-item-title">有效期信息：</div> -->
                    <el-form-item label="启用效期管理：" prop="periodManage">
                      <el-switch v-model="batchForm.periodManage" active-value="1" inactive-value="0" @change="validityPeriodStatusChange"></el-switch>
                    </el-form-item>
                    <el-form-item v-if="batchForm.periodManage === '1'" label="有效期单位：" prop="validityPeriodUnit">
                      <el-select v-model="batchForm.validityPeriodUnit" placeholder="请选择">
                        <el-option v-for="item in validityPeriodUnitArr" :key="item.value" :value="item.value" :label="item.label"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item v-if="batchForm.periodManage === '1'" label="有效期：" prop="validityPeriod">
                      <el-input v-model="batchForm.validityPeriod" clearable placeholder="请输入"></el-input>
                    </el-form-item>
                  </div>
                </el-form>
              </div>
            </div>
            <div class="batch-manage-form-row">
              <div class="batch-manage-form-row-name">物资信息</div>
            </div>
            <el-pro-table
              :columns="bColumns"
              :data="paginatedData"
              :pagination="bPagination"
              :page-size="selectedQueryParams.pageSize"
              action-width="80"
              :total="selectedTableData.length"
              :toolbar-config="bToolBarConfig"
              :search-collapse-threshold="4"
              @action="bHandleAction"
              @search="bTableSearch"
              @reset="bTableReset"
            />
          </el-col>
        </el-row>
      </template>
      <template #footer>
        <div>
          <el-button @click="createDialogClose">取消</el-button>
          <el-button type="primary" :disabled="!!!selectedTableData.length" @click="createDialogConfirm">确定</el-button>
        </div>
      </template>
    </create-batch-dialog>
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
                  v-loading="addMatlLoading"
                  :show-checkbox="true"
                  :table-alert-render="false"
                  :grid-options="{rowId: 'matlCode'}"
                  :keepSelection="true"
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
    <edit-dialog
      class="edit-batch-dialog"
      ref="editDialogRef"
      :currentRowData="currentRowData"
      :visible="editVisible"
      @dialog-close="editDialogClose"
      @edit-dialog-confirm="editDialogConfirm"
      @switch-to-false="editSwitchToFalse"
      title="物资属性编辑"
      width="60%"
    />
    <confirm-dialog :visible="confirmVisible" @dialog-close="confirmDialogClose" title="操作确认" />
  </div>
</template>

<script setup>
import { formJson } from "./formJson";
import { tableJson, tableButtonJson, selectedTableJson, selectedTableButtonJson, matlTableJson } from "./tableJson";
import createBatchDialog from "./components/createBatchDialog.vue";
import addMatlDialog from "../components/addMatlDialog.vue";
import editDialog from "./components/editDialog.vue";
import confirmDialog from "./components/confirmDialog.vue";
import attributeTable from "../components/attributeTable.vue";
import elTrees from "@/components/elTrees";
import { listToTree } from "../tool";
import { ElMessage, ElMessageBox } from "element-plus";
import { paramConfignoAuthorizeList} from "@/api/materialAccept/acceptMaterial.js";
import { matlBatchAdd, getMatlBatchPageData, matlBatchDel } from "@/api/materialAccept/matlBatch.js";
import { validityPeriodUnitArr, validityPeriodUnitObj } from "@/utils/dictionary";
import { matlcateNoAuthorizeTree } from "@/api/warehouse/inventory.js";

const matlFormJson = [
  { prop: "matlCode", label: "物资编码", type: "input" },
  { prop: "matlName", label: "物资名称", type: "input" },
]

const loading = ref(false);
const formRef = ref(null);
const editDialogRef = ref(null);
const showSearch = ref(true);
const queryParams = ref({
  pageNum: 1,
  pageSize: 30,
});
const tableData = ref([]);
const total = ref(0);
const editVisible = ref(false);
const confirmVisible = ref(false);
const currentRowData = ref({});
const createTableKey = ref(1);

// 新增批次管理
const createVisible = ref(false);
const createSearchFormRef = ref(null);
const batchForm = ref({
  matlBatchStatus: true,
  periodManage: "0",
  validityPeriodUnit: "",
  validityPeriod: "",
});
const batchFormRules = ref({
  validityPeriod: [
    { pattern: /^[1-9]\d*$/, message: "请输入正整数", trigger: ["change", "blur"] },
    // { required: true, message: "请填写有效期", trigger: ["change", "blure"]/ }
  ],
  validityPeriodUnit: [
    // { required: true, message: "请选择有效期单位", trigger: ["change", "blure"] }
  ]
});
const selectedQueryParams = ref({
  pageNum: 1,
  pageSize: 30,
});
const selectedTableData = ref([
]);
const copySelectedTableData = ref([]);
const paginatedData = ref([]);

watch(() => [copySelectedTableData.value, selectedQueryParams.value.pageNum, selectedQueryParams.value.pageSize], () => {
  const start = (selectedQueryParams.value.pageNum - 1) * selectedQueryParams.value.pageSize;
  const end = start + selectedQueryParams.value.pageSize;
  paginatedData.value = copySelectedTableData.value.slice(start, end);
}, {deep: true});

// 选择物资
const addMatlLoading = ref(false);
const matlTreeLoading = ref(false);
const defaultExpandedKeys = ref(["all"]);
const addMatlVisible = ref(false);
const addMatlFormRef = ref(null);
const addMatlTableRef = ref(null);

const addMatlQueryParams = ref({
  pageNum: 1,
  pageSize: 30,
});
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

const getMatlCateName = (data) => {

  if (data.matlCateCode !== "all" && data.matlCateCode) {
    return `${data.matlCateCode} ${data.matlCateName}`;
  } else {
    return `${data.matlCateName}`
  }
}

const searchConfig = ref({labelWidth: 120})
const searchFormData = ref({});

const columns = [
  { field: "matlCode", title: "物资编码", minWidth: 140, align: "center", searchable: true, searchType: "input", },
  { field: "matlName", title: "物资名称", minWidth: 200, align: "center", searchable: true, searchType: "input",},
  { field: "matlType", title: "规格类型", minWidth: 200, align: "center",},
  { field: "matlUnit", title: "计量单位", minWidth: 120, align: "center",},
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
  },},
  { field: "matlBatchStatus", title: "批次管理状态", minWidth: 120, align: "center", searchable: true, searchType: "select", searchProps: {
    options: [
      { label: "已开启", value: "1" },
      { label: "未开启", value: "0"}
    ]
  }, render: (row) => row.matlBatchStatus === "1" ? "已开启" : "未开启"},
  { field: "periodManage", title: "效期管理状态", minWidth: 120, align: "center", searchable: true, searchType: "select", searchProps: {
    options: [
      { label: "已开启", value: "1" },
      { label: "未开启", value: "0"}
    ]
  }, render: (row) => row.periodManage === "1" ? "已开启" : "未开启"},

  { field: "validityPeriod", title: "有效期", minWidth: 120, align: "center", },
  { field: "validityPeriodUnit", title: "有效期单位", minWidth: 120, align: "center", },
];

const pagination = {current: queryParams.value.pageNum, pageSize: queryParams.value.pageSize, total: total.value, pageSizes: [10, 20, 30 ,50],};
const pagerConfig = { pageSizes: [10, 20, 30 ,50], pageSize: queryParams.value.pageSize }


const toolBarConfig = {
  buttons: [
    { code: 'add', name: "新增批次管理", type: "primary", showInRow: false, showInTop: true },
    { code: 'edit', name: '编辑', type: 'primary', showInRow: true, showInTop: false },
    { code: 'del', name: '删除', type: 'danger', showInRow: true, showInTop: false },
  ]
}

//---新增批次管理--
const bSearchFormData = ref({
  matlCode: "",
  matlName: "",
});

const bPagination = { current: selectedQueryParams.value.pageNum, pageSize: selectedQueryParams.value.pageSize, total: selectedTableData.value.length, pageSizes: [10, 20, 30, 50] };

const bColumns = [
  { field: "matlCode", title: "物资编码", minWidth: 160, align: "center", searchable: true, searchType: "input", },
  { field: "matlName", title: "物资名称", minWidth: 200, align: "center", searchable: true, searchType: "input", },
  { field: "matlType", title: "规格类型", minWidth: 200, align:  "center", },
  { field: "matlUnit", title: "计量单位", minWidth: 120, align:  "center", },
];

const bToolBarConfig = {
  buttons: [
    { code: "add", name: "添加物资", type: "primary", showInTop: true, showInRow: false, },
    { code: "del", name: "删除", type: "danger", showInTop: false, showInRow: true, },
  ]
}

//---选择物资---

const mSearchFormData = ref();

const mPagination = { current: addMatlQueryParams.value.pageNum, pageSize: addMatlQueryParams.value.pageSize, total: matlTableCount, pageSizes: [10, 20, 30, 50] };

const mColumns = [
  { field: "matlCode", title: "物资编码", minWidth: 160, align: "center", searchable: true, searchType: "input",},
  { field: "matlName", title: "物资名称", minWidth: 200, align: "center", searchable: true, searchType: "input", },
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
  { field: "matlType", title: "规格类型", minWidth: 200, align:  "center", },
  { field: "matlUnit", title: "计量单位", minWidth: 120, align:  "center", },
];


const getList = async () => {
  loading.value = true;

  try {
    const res = await getMatlBatchPageData({
      ...queryParams.value,
      // ...formRef.value?.formData,
      ...searchFormData.value,
    });
    tableData.value = res.data?.list || [];
    total.value = res.data?.total || 0;
  } catch (error) {
    
  }

  loading.value = false;
}

const tableSearch = (form, pageInfo) => {
  searchFormData.value = {...form};
  queryParams.value.pageNum = pageInfo.page;
  queryParams.value.pageSize = pageInfo.pageSize;
  getList();
}

const tableReset = () => {
  queryParams.value.pageNum = 1;
  searchFormData.value = {};
  getList();
}

const handleAction = ({code, name, row}) => {
  if (code === "add") {
    toHandleCreate();
  }
  if (code === "edit") {
    currentRowData.value = {...row};
    editVisible.value = true;
  }

  if (code === "del") {
    ElMessageBox.confirm(
      "确定要删除吗？",
      "提示",
      {
        type: "warning"
      }
    ).then(async () => {
      try {
        const res = await matlBatchDel({id: row.id});
        ElMessage.success("删除成功！");
        getList();
      } catch (error) {
        
      }
    }).catch(err => {});
  }
}

const bHandleAction = ({code, name, row}) => {
  if (code === "add") {
    toAddMatl();
  }

  if(code === "del") {
    const _index = copySelectedTableData.value.findIndex(item => item.matlCode === row.matlCode);
    if(_index !== -1) copySelectedTableData.value.splice(_index, 1);

    const index = selectedTableData.value.findIndex(item => item.matlCode === row.matlCode);
    if(index !== -1) selectedTableData.value.splice(index, 1);
  }
}

const bTableSearch = (form, pageInfo) => {
  selectedQueryParams.value.pageNum = pageInfo.page;
  selectedQueryParams.value.pageSize = pageInfo.pageSize;
  bSearchFormData.value = {
    matlCode: form.matlCode || "",
    matlName: form.matlName || "",
  };
  createSearchHandleQuery();
}

const bTableReset = () => {
  bSearchFormData.value = {
    matlCoe: "",
    matlName: "",
  };
  selectedQueryParams.value.pageNum = 1;
  
  createSearchResetQuery();
}

// ---选择物资---
const mTableSearch = (form, pageInfo) => {
  addMatlQueryParams.value.pageNum = pageInfo.page;
  addMatlQueryParams.value.pageSize = pageInfo.pageSize;
  mSearchFormData.value = {...form};
  getMaltList();
}

const mTableReset = () => {
  mSearchFormData.value = {};
  addMatlQueryParams.value.pageNum = 1;
  getMaltList();
}

const toHandleCreate = () => {
  createVisible.value = true;
}

const validityPeriodStatusChange = (val) => {
  if (val === "0") {
    batchForm.value.validityPeriod = "";
    batchForm.value.validityPeriodUnit = "";
    for (const element of selectedTableJson) {
      if (element.prop === "validityPeriod") element.isShow = false;
      if (element.prop === "validityPeriodUnit") element.isShow = false;
    }
    createTableKey.value++;
  } else {
    for (const element of selectedTableJson) {
      if (element.prop === "validityPeriod") element.isShow = true;
      if (element.prop === "validityPeriodUnit") element.isShow = true;
    }
    createTableKey.value++;
  }
}

const handleHomeTableButtonClick = (prop, {row}) => {
  if (prop === "edit") {
    currentRowData.value = {...row};
    editVisible.value = true;
  }
  if (prop === "del") {
    ElMessageBox.confirm(
      "确定要删除吗？",
      "提示",
      {
        type: "warning"
      }
    ).then(async () => {
      try {
        const res = await matlBatchDel({id: row.id});
        ElMessage.success("删除成功！");
        getList();
      } catch (error) {
        
      }
    }).catch(err => {});
  }
}

const editDialogClose = () => {
  currentRowData.value = {};
  editVisible.value = false;
}

const editDialogConfirm = () => {
  currentRowData.value = {};
  editVisible.value = false;
  getList();
}

const editSwitchToFalse = () => {
  confirmVisible.value = true;
}

const confirmDialogClose = () => {
  confirmVisible.value = false;
  editDialogRef.value.batchForm.matlBatchStatus = true;
}


const createDialogClose = () => {
  selectedQueryParams.value.pageNum = 1;
  copySelectedTableData.value = [];
  selectedTableData.value = [];
  matlTableSelectedData.value = [];
  for (const element of selectedTableJson) {
    if (element.prop === "validityPeriod") element.isShow = false;
    if (element.prop === "validityPeriodUnit") element.isShow = false;
  }
  createTableKey.value++;
  batchForm.value.periodManage = "0";
  batchForm.value.validityPeriod = null;
  batchForm.value.validityPeriodUnit = "";
  createVisible.value = false;
}

const getMaltCategory = async () => {
  matlTreeLoading.value = true;
  try {
    const res = await matlcateNoAuthorizeTree();
    const arr = res.data || [];
    matlCategoryTreeData.value[0].children = arr || [];
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
    matlTableData.value = res.data?.list || [];
    matlTableCount.value = res.data?.total || 0;
  } catch (error) {
    console.log(error);
  }

  addMatlLoading.value = false;
}

const toAddMatl = async () => {
  addMatlVisible.value = true;
  Promise.all([getMaltList()]).then(() => {
    clearMatlTableSelectedData();
    for (const item of selectedTableData.value) {
      toggleMatlTableSelectedItem(item, true);
    }
  });
}

const createSearchHandleQuery = () => {
  copySelectedTableData.value = selectedTableData.value.filter(item => {
    return item.matlName.includes(bSearchFormData.value.matlName) && item.matlCode.startsWith(bSearchFormData.value.matlCode);
  });
  selectedQueryParams.value.pageNum = 1;
}

const createSearchResetQuery = () => {
  copySelectedTableData.value = [...selectedTableData.value];
  selectedQueryParams.value.pageNum = 1;
}

const handleCreateButtonClick = (prop, {row}) => {
  if (prop === "del") {

    const _index = copySelectedTableData.value.findIndex(item => item.matlCode === row.matlCode);
    if(_index !== -1) copySelectedTableData.value.splice(_index, 1);

    const index = selectedTableData.value.findIndex(item => item.matlCode === row.matlCode);
    if(index !== -1) selectedTableData.value.splice(index, 1);
  }
}

const createDialogConfirm = async () => {

  try {
    const regex = /^[1-9]\d*$/;
    const arr = selectedTableData.value.map(item => ({
      matlBatchStatus: batchForm.value.matlBatchStatus ? "1" : "0",
      periodManage: batchForm.value.periodManage,
      validityPeriod: item.validityPeriod ? Number(item.validityPeriod) : "",
      validityPeriodUnit: item.validityPeriodUnit || null,
      matlCode: item.matlCode,
      matlName: item.matlName,
      matlType: item.matlType,
      matlUnit: item.matlUnit,
    }));
    const errArr = [];
    for (const element of arr) {
      const obj = { matlCode: element.matlCode, errData: [] }
      if (element.validityPeriodUnit === "") {
        obj.errData.push(`有效期单位未填写！`);
      }
      if (element.validityPeriod === "") {
        obj.errData.push(`有效期未填写！`);
      }
      if (!regex.test(element.validityPeriod)) {
        obj.errData.push(`有效期必须是正整数！`);
      }
      if (obj.errData.length !== 0) {
        errArr.push(obj);
      }
    }
    const errArr2 = [];
    for (const element of errArr) {
      errArr2.push(`${element.matlCode}-${element.errData.join('、')}`);
    }
    
    if(errArr2.length && batchForm.value.periodManage === "1") {
      ElMessage.error("物资的有效期单位或有效期未正常填写，请检查！");
      return;
    };
    const res = await matlBatchAdd(arr || []);
    ElMessage.success("新增成功！")
    getList();
    // createVisible.value = false;
    createDialogClose();
  } catch (error) {
    console.log(error);
  }

}

const tableValidDateInput = (val, row) => {
  const regex = /^[1-9]\d*$/;
  if (!regex.test(val) && val !== "") {
    ElMessage.error("请输入正整数！")
  }
}

watch(() => batchForm.value.validityPeriodUnit, (nval) => {
  for (const element of selectedTableData.value) {
    element.validityPeriodUnit = nval;
  }
});

watch(() => batchForm.value.validityPeriod, (nval) => {
  const regex = /^[1-9]\d*$/;
  if (!regex.test(nval) && nval !== "") return;
  for (const element of selectedTableData.value) {
    element.validityPeriod = nval;
  }
});

watch(() => selectedTableData.value, (nval) => {
  if (!!nval.length) {
    if (!!batchForm.value.validityPeriod) {
      for (const element of selectedTableData.value) {
        element.validityPeriod = batchForm.value.validityPeriod;
      }
    }
    if (!!batchForm.value.validityPeriodUnit) {
      for (const element of selectedTableData.value) {
        element.validityPeriodUnit = batchForm.value.validityPeriodUnit;
      }
    }
  }
});

const addMatlDialogClose = () => {
  addMatlQueryParams.value.pageNum = 1;
  clearMatlTableSelectedData();
  addMatlVisible.value = false;
}

const addMatlDialogConfirm = () => {
  // addMatlQueryParams.value.pageNum = 1;
  selectedTableData.value = [...matlTableSelectedData.value];
  copySelectedTableData.value = [...matlTableSelectedData.value]
  // addMatlVisible.value = false;
  addMatlDialogClose();
}

const handleMatlSelectionChange = (data) => {
  console.log(data);
  matlTableSelectedData.value = [...data];
}

const clearMatlTableSelectedData = () => {
  addMatlTableRef.value?.clearSelection();
}

const toggleMatlTableSelectedItem = (data, flag) => {
  addMatlTableRef.value?.toggleRowSelection(data, flag);
}

onBeforeMount(() => {
  getMaltCategory();
});

onMounted(() => {
  getList();
})
</script>

<style lang="scss" scoped>
.material-accetp-attribute-batch-manage-page {
  height: 100%;
  >.ep-row {
    height: auto;
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
          height: calc(100% - 254px);
        }
      }
    }
  }
  :deep(.ep-dialog) {
    .ep-dialog__body {
      overflow: auto;
    }
    .ep-table {
      min-height: 220px;
    }
  }
  :deep(.create-batch-dialog) {
    height: 80vh;
    .ep-dialog__body {
      padding: 12px 24px 0 24px;
      height: calc(100% - 89.39px);
      >.ep-row {
        height: 100% !important;
        >.ep-col {
          border: none;
        }
        .ep-table__empty-block {
          height: 100% !important;
        }
      }
      .ep-table {
        .ep-button {
          &:last-child {
            >span {
              color: red;
            }
          }
        }
      }
      .ep-pro-table {
        .ep-pro-table__wrapper {
          height: 100%;
        }
        .ep-pro-table__body {
          height: calc(100% - 240px) !important;
        }
      }
    }
    .batch-manage-form-row {
      .batch-manage-form-row-name {
        margin-bottom: 12px;
      }
      .batch-manage-form-row-name {
        font-weight: 800;
      }
      .batch-manage-form-row-content {
        .ep-form {
          .ep-form-item {
            .ep-form-item__label {
              font-weight: normal;
            }
            .ep-form-item__content {
              .ep-select__wrapper {
                width: 100px;
              }
              .ep-input__wrapper {
                width: 220px;
              }
            }
          }
          .batch-manage-form-row-content-item {
            display: flex;
            align-items: center;
            .batch-manage-form-row-content-item-title {
              width: 98px;
              display: flex;
              justify-content: flex-end;
              margin: 0 0 18px 0;
            }
          }
        }
      }
    }
    .integrated-manage-pane-form-button {
      >.ep-col {
        padding-bottom: 2px;
      }
    }
    .pagination-container {
      margin-top: 0;
      // margin-bottom: 10px;
    }
    .ep-dialog__footer {
      margin-top: 10px;
    }
  }
  :deep(.edit-batch-dialog) {
    height: auto;
    .ep-dialog__body {
      margin-bottom: 40px;
    }
  }
  :deep(.add-matl-dialog) {
    height: 80vh;
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
</style>