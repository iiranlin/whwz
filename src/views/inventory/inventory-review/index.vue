<template>
  <div class="app-container app-container-splitpanes inventory-review-page">
    <el-row :gutter="20" class="app-container-row integrated-manage-pane-form integrated-manage-pane-form-a">
      <el-col class="app-container-col">
        <inventory-review-form
          :show-search="showSearch"
          :form-json="formJson"
          @handle-query="handleQuery"
          @reset-query="resetQuery"
          @handle-select-change="handleSelectChange"
          :form-select-data="formSelectData"
          ref="formRef"
        />
        <el-row :gutter="10" class="mb8 integrated-manage-pane-form-button">
          <el-col :span="1.5">
            <el-button :disabled="!!!tableSelectedData.length" type="primary" class="tableButton" @click="handleReview">审核</el-button>
            <el-button :disabled="!!!tableSelectedData.length" type="primary" class="tableButton" @click="handleRevoke">撤销审核</el-button>
            <el-button :disabled="!!!tableSelectedData.length" type="primary" class="tableButton" @click="handleRollback">回退</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" :tableJson="tableJsonArr" @queryTable="getList" @tabConfigSuccess="tabConfigSuccess"></right-toolbar>
        </el-row>
        <table-index
          class="table-index"
          :loading="loading"
          idName="csmId"
          :tableJson="tableJsonArr"
          :selectionShow="true"
          :tableData="tableData"
          @handleSelectionChange="handleSelectionChange"
          @clickLink="clickLink"
          :reserveSelection="true"
          :queryParams="queryParams"
        >
          <template #plantCode="{name, scope}">{{ scope.row.plantName }}</template>
          <template #depotCode="{name, scope}">{{ scope.row.depotName }}</template>
          <template #operDate="{name, scope}">{{ formatDate(scope.row.operDate).split(" ")[0] }}</template>
          <template #permFlag="{name, scope}">{{ permObj[scope.row.permFlag] }}</template>
        </table-index>
        <pagination 
          v-show="total > 0"
          :total="total"
          v-model:page="queryParams.pageNum"
          v-model:limit="queryParams.pageSize"
          @pagination="getList"
        />
      </el-col>
    </el-row>
    <detail-dialog class="inventory-detail-dialog" :visible="detailVisible" title="盘点单详情" width="90%" @detail-dialog-close="detailDialogClose">
      <template #footer><el-button @click="detailDialogClose">关闭</el-button></template>
      <template #default>
        <div class="inventory-detail-dialog-body">
          <div class="inventory-detail-dialog-body-code-row">
            <span>盘点单号：<span>{{ currentDetailData.csCode }}</span></span>
          </div>
          <div class="inventory-detail-dialog-body-btn-row"></div>
          <div class="inventory-detail-dialog-body-table-box">
            <table-index
              class="table-index"
              :loading="dialogLoading"
              idName="csdId"
              :tableJson="detailTableJson"
              :selectionShow="false"
              :tableData="detailTableData"
              height="380"
            >
              <template #plantCode="{scope}">{{ scope.row.plantName }}</template>
              <template #depotCode="{scope}">{{ scope.row.depotName }}</template>
            </table-index>
          </div>
        </div>
      </template>
    </detail-dialog>
  </div>
</template>

<script setup>
import { getLocalStorage, getCookie } from '@/utils/auth';
import { formatDate } from "@/utils/index";
import { plantDictList } from "@/api/warehouse/plantDict.js";
import { warehouseDictList } from "@/api/warehouse/warehouseDict.js";
import { getInventoryList, toAudit, revokeAudit, rollBack, getDetailList } from "@/api/warehouse/inventory";
import { ElMessageBox } from "element-plus";
import InventoryReviewForm from "./components/inventoryReviewForm.vue";
import MessageContent from './components/messageContent.vue';
import DetailDialog from "./components/detailDialog.vue";
import { formJson } from './formJson';
import { tableJson, detailTableJson } from "./tableJson";

const route = useRoute();
const showSearch = ref(true);
const tableJsonArr = ref(JSON.parse(getLocalStorage(route.meta?.menuId)) || tableJson);

const loading = ref(false);
const formRef = ref(null);
const formSelectData = ref({
  plantCode: [],
  depotCode: [],
});
const queryParams = ref({
  pageNum: 1,
  pageSize: 30,
});

const tableData = ref([]);
const tableSelectedData = ref([]);
const total = ref(0);
const currentDetailData = ref({});
const detailVisible = ref(false);
const detailTableData = ref([]);

const permObj = computed(() => {
  const item = formJson.find(item => item.prop === 'permFlag');
  const obj = {};
  const arr = item ? (item.selectData ? item.selectData : []) : [];
  if (arr.length) {
    for (const element of arr) {
      obj[element.value] = element.label
    }
  }
  return obj;
});

const getList = async () => {
  loading.value = true;
  try {

    if (!!!formRef.value.formData.permFlag) {
      const params = new URLSearchParams({
        ...formRef.value.formData,
        permFlag: formRef.value.formData.permFlag === undefined ? "" : formRef.value.formData.permFlag,
        ...queryParams.value,
        orderByColumn: "operDate",
        isAsc: false,
      });
      ["1", "2", "3"].forEach(permFlag => params.append("permFlagList", permFlag));

      const keysToDel = [];
      for (const [key, value] of params.entries()) {
        if (value === "") {
          keysToDel.push(key);
        }
      }
      keysToDel.forEach(item => params.delete(item))

      const res = await getInventoryList({}, params.toString());
      tableData.value = res.data?.list || [];
      total.value = res.data?.total || 0;
    } else {
      const res = await getInventoryList({
        ...formRef.value.formData,
        ...queryParams.value,
        orderByColumn: "operDate",
        isAsc: false,
      });
      tableData.value = res.data?.list || [];
      total.value = res.data?.total || 0;
    }
    
  } catch (error) {
    console.log(error);
  }
  loading.value = false;
}

const tabConfigSuccess = (data) => {
  tableJsonArr.value = data;
}

const detailDialogClose = () => {
  detailVisible.value = false;
  currentDetailData.value = {};
}

const handleQuery = () => {
  queryParams.value.pageNum = 1;
  getList();
}

const resetQuery = () => {
  tableSelectedData.value = [];
  queryParams.value.pageNum = 1;
  getList();
}

const getPlantData = async () => {
  try {
    const res = await plantDictList({ unitCode: getCookie('unitCode') });
    formSelectData.value['plantCode'] = res.data?.list.map(item => ({ ...item, label: item.plantName, value: item.plantCode })) || [];
  } catch (error) {
    
  }
}

const getWarehouseData = async (val) => {
  try {
    const res = await warehouseDictList({ unitCode: getCookie('unitCode'), plantCode: val });
    formSelectData.value['depotCode'] = res.data?.list.map(item => ({ ...item, label: item.whName, value: item.whCode })) || [];
  } catch (err) {
    
  }
}

watch(() => formRef.value?.formData.plantCode, (nval) => {
  if (!!!nval) {
    formSelectData.value.depotCode = [];
  }
  formRef.value.formData.depotCode = "";
})

// 针对地区改变-查询仓库选项
const handleSelectChange = (prop, val) => {
  if (prop === 'plantCode') {
    if (!!val) {
      getWarehouseData(val);
    }
  }
}

const handleReview = async () => {
  ElMessageBox.confirm(
    '您确定审核吗？',
    '提示',
    {
      type: "primary",
      confirmButtonText: "确定",
      cancelButtonText: "取消",
    }
  ).then(async () => {
    try {
      const res = await toAudit({
        csCodeList: tableSelectedData.value.map(item => item.csCode) || [],
      });
      ElMessageBox({
        title: "提示",
        message: () => h(MessageContent, {
          _info: `共选择${res.data?.total}条单据，审核成功${res.data?.success}条，失败${res.data?.failed}条`,
          _arr: res.data?.message || []
        }),
        showCancelButton: false,
        customClass: "divider-message-box-inventory-common"
      }).then(() => {
      }).catch((err) => {
        console.log(err);
      }).finally(() => {
        tableSelectedData.value = [];
        getList();
      });
    } catch (error) { 
    }
  }).catch(err => {})
}

const handleRevoke = async () => {
  try {
    const res = await revokeAudit({
      csCodeList: tableSelectedData.value.map(item => item.csCode) || [],
    });
    ElMessageBox({
      title: "提示",
      message: () => h(MessageContent, {
        _info: `共选择${res.data?.total}条单据，撤销审核成功${res.data?.success}条，失败${res.data?.failed}条`,
        _arr: res.data?.message || [],
      }),
      showCancelButton: false,
      customClass: "divider-message-box-inventory-common",
    }).then(() => {}).catch(err => {
      console.log(err);
    }).finally(() => {
      tableSelectedData.value = [];
      getList();
    })
  } catch (error) {
  }
}

const handleRollback = async () => {
  try {
    const res = await rollBack({
      csCodeList: tableSelectedData.value.map(item => item.csCode) || [],
    });
    ElMessageBox({
      title: "提示",
      message: () => h(MessageContent, {
        _info: `共选择${res.data?.total}条单据，回退成功${res.data?.success}条，失败${res.data?.failed}条`,
        _arr: res.data?.message || [],
      }),
      showCancelButton: false,
      customClass: "divider-message-box-inventory-common",
    }).then(() => {}).catch(err => {
      console.log(err);
    }).finally(() => {
      tableSelectedData.value = [];
      getList();
    })
  } catch (error) {
  }
}

const handleSelectionChange = (data = []) => {
  tableSelectedData.value = data;
}

const dialogLoading = ref(false);

const clickLink = async (prop, data) => {
  if(prop === 'csCode') {
    dialogLoading.value = true;
    try {
      currentDetailData.value = {...data};
      detailVisible.value = true;
      const res = await getDetailList({
        csCode: currentDetailData.value.csCode,
        orderByColumn: "seq",
        isAsc: false,
        pageNum: 1,
        pageSize: 1000
      });
      detailTableData.value = res.data?.list || [];
    } catch (error) {
    }
    dialogLoading.value = false;
  }
}

onBeforeMount(() => {
  getPlantData();
});

onMounted(() => {
  getList();
})

</script>

<style lang="scss" scoped>
.inventory-review-page {
  :deep(.inventory-detail-dialog) {
    .ep-dialog__header {
      padding: 14px 24px;
    }
    .inventory-detail-dialog-body {
      padding: 28px 24px;
      height: 100%;
      overflow: auto;
      .maintain-dialog-body-code-row {
        margin-bottom: 24px;
      }
      .inventory-detail-dialog-body-btn-row {
        margin-bottom: 14px;
      }
      .maintain-detail-dialog-body-table-box {
        height: calc(100% - 76px) !important;
      }
    }
  }
}
</style>