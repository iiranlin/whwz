<template>
  <div class="app-container app-container-splitpanes inventory-create-modify-page">
     <el-row :gutter="20" class="app-container-row integrated-manage-pane-form integrated-manage-pane-form-a">
      <el-col class="app-container-col">
        <create-modify-form
          ref="formRef"
          :form-json="formJson"
          :show-search="showSearch"
          :formSelectData="formSelectData"
          @handle-query="handleQuery"
          @reset-query="resetQuery"
        >
        </create-modify-form>
        <el-row :gutter="10" class="mb8 integrated-manage-pane-form-button">
          <el-col :span="1.5">
            <el-button :disabled="!!!formRef?.formData.csCode" type="primary" class="tableButton" @click="handleCreateModifyOrder">生成调整单</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" :tableJson="tableJsonArr" @queryTable="getList" @tabConfigSuccess="tabConfigSuccess"></right-toolbar>
        </el-row>
        <table-index
          :loading="loading"
          class="table-index"
          idName="cardId"
          :tableJson="tableJsonArr"
          :tableData="tableData"
          :selectionShow="false"
        >
          <template #plantCode="{scope}">{{ scope.row.plantName }}</template>
          <template #depotCode="{scope}">{{ scope.row.depotName }}</template>
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
        <div v-if="formRef && formRef.formData.csCode" class="diff-price-row"><b>合计盈亏金额：{{ diffPrice }}</b></div>
        <pagination 
          v-show="total > 0"
          :total="total"
          v-model:page="queryParams.pageNum"
          v-model:limit="queryParams.pageSize"
          @pagination="getList"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { formJson } from "./formJson";
import { tableJson } from "./tableJson";
import { getLocalStorage } from "@/utils/auth";
import createModifyForm from "./components/createModifyForm.vue";
import { diffStockOrderList, getDetailList, createModifyOrder, createCode } from "@/api/warehouse/inventory";
import { ElMessage, ElMessageBox } from "element-plus";
import { validityPeriodUnitObj } from '@/utils/dictionary';
import { getCookie } from '@/utils/auth';
import { parseTime } from "@/utils/generalMethod.js";

const route = useRoute();
const showSearch = ref(true);
const tableJsonArr = ref(JSON.parse(getLocalStorage(route.meta?.menuId)) || tableJson);
const yearMonth = getCookie('warehouseGetYear') ? JSON.parse(getCookie('warehouseGetYear')).yearMonth ? JSON.parse(getCookie('warehouseGetYear')).yearMonth : parseTime(new Date(), '{y}{m}') : parseTime(new Date(), '{y}{m}');

const loading = ref(false);
const formRef= ref(null);
const formSelectData = ref({
  csCode: [],
})

const queryParams = ref({
  pageNum: 1,
  pageSize: 30,
});
const total = ref(0);
const tableData = ref([]);
const diffPrice = ref(0); 

// 获取差异盘点单数据
const getInventoryList = async () => {
  try {
    const res = await diffStockOrderList();
    const arr = res?.data || [];
    formSelectData.value.csCode = arr.map(item => ({
      ...item,
      label: item.csCode,
      value: item.csCode,
    }))
  } catch (error) {
    
  }
}

// 获取盘点单内盘点数据
const getList = async () => {
  if (!!!formRef.value.formData.csCode) return;
  loading.value = true;

  try {
    const res = await getDetailList({
      csCode: formRef.value.formData.csCode,
      ...queryParams.value,
      isDiff: true,
      orderByColumn: "seq",
      isAsc: false,
    });
    tableData.value = res.data?.list || [];
    total.value = res.data?.total || 0;
  } catch (error) {
    
  }

  loading.value = false;
}

const tabConfigSuccess = (data) => {
  tableJsonArr.value = data;
}

const handleCreateModifyOrder = async () => {
  try {
    createCode({name: "调整单", receipeDate: yearMonth}).then(async(_res) => {
      const res = await createModifyOrder({ csCode: formRef.value?.formData.csCode, adjustCode: _res.data});

      ElMessageBox.confirm(
        `生成调整单成功！调整单号为${res.data?.adjustCode}`,
        '提示',
        {
          type: "warning",
          showCancelButton: false,
        }
      ).then(() => {}).catch(err => {}).finally(() => {
        formRef.value.formData.csCode = "";
        getInventoryList();
      });
    }).catch(err => {
      ElMessage.error("调整单号生成失败！")
    })
    
  } catch (error) {
    
  }
}

const handleQuery = () => {
  queryParams.value.pageNum = 1;
  diffPrice.value = 0;
  const data = formSelectData.value.csCode.find(item => item.csCode === formRef.value?.formData.csCode);
  diffPrice.value = data ? data.diffPrice : 0;
  getList();
}

const resetQuery = () => {
  tableData.value = [];
  queryParams.value.pageNum = 1;
  total.value = 0;
  diffPrice.value = 0;
}

onMounted(async () => {
  try {
    await getInventoryList();
    if (!!formSelectData.value.csCode.length && formRef.value) {
      formRef.value.formData.csCode = formSelectData.value.csCode[0].value;
      await getList();
    }
  } catch (error) {
    console.log(error);
  }
})
</script>

<style lang="scss" scoped>

</style>