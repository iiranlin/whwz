<template>
  <div class="app-container app-container-splitpanes inventory-maintain-page">
    <el-row :gutter="20" class="app-container-row integrated-manage-pane-form integrated-manage-pane-form-a">
      <el-col class="app-container-col">
        <inventory-maintain-form
          :showSearch="showSearch"
          :formJson="formJson"
          @handleQuery="handleQuery"
          @resetQuery="resetQuery"
          @handleSelectChange="handleSelectChange"
          :formSelectData="formSelectData"
          ref="formRef"
        >
        </inventory-maintain-form>
        <el-row :gutter="10" class="mb8 integrated-manage-pane-form-button">
          <el-col :span="1.5">
            <el-button v-if="submitBtnflag" key="sub" :disabled="!!!tableSelectedData.length" type="primary" class="tableButton" @click="handleSubmit">报批</el-button>
            <el-button v-if="delBtnFlag" key="del" :disabled="!!!tableSelectedData.length" type="primary" class="tableButton" @click="handleDel">删除</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" :tableJson="tableJsonArr" @queryTable="getList" @tabConfigSuccess="tabConfigSuccess"></right-toolbar>
        </el-row>
        <table-index
          class="table-index"
          :loading="loading"
          idName="csmId"
          :queryParams="queryParams"
          :tableJson="tableJsonArr"
          :tableButtonJson="tableButtonJson"
          :selectionShow="true"
          :tableData="tableData"
          @handleSelectionChange="handleSelectionChange"
          operationWidth="180"
          @handleButtonClick="handleButtonClick"
          @clickLink="clickLink"
          :buttonDisable="buttonDisable"
          :reserveSelection="true"
          :row-style="handleRowStyle"
        >
          <template #plantCode="{name, scope}">{{ scope.row.plantName }}</template>
          <template #depotCode="{name, scope}">{{ scope.row.depotName }}</template>
          <template #partitionCode="{name, scope}">{{ scope.row.partitionName }}</template>
          <template #operDate="{name, scope}">{{ parseTime(scope.row.operDate, "{y}-{m}-{d}") }}</template>
          <template #status="{name, scope}">{{ statusObj[scope.row.status] }}</template>
          <template #permFlag="{name, scope}">{{ permObj[scope.row.permFlag] }}</template>
        </table-index>
        <div style="display: flex; align-items: center;">
          <div style="font-weight: 700;">红色：回退</div>
          <pagination 
            v-show="total > 0"
            :total="total"
            v-model:page="queryParams.pageNum"
            v-model:limit="queryParams.pageSize"
            @pagination="getList"
            style="flex: 1;"
          />
        </div>
      </el-col>
    </el-row>
    <maintain-dialog key="maintain" class="inventory-maintain-dialog"  :visible="maintainVisible" title="维护盘点数量" width="90%" @maintain-dialog-close="maintainDialogClose">
      <template #footer>
        <el-button type="primary" :disabled="!!errorTip" @click="handleSaveInventory">保存</el-button>
        <el-button type="primary" :disabled="!!errorTip" @click="handleSubmitInventory">报批</el-button>
        <el-button @click="maintainDialogClose">关闭</el-button>
      </template>
      <template #default>
        <div class="maintain-dialog-body">
          <div class="maintain-dialog-body-code-row">
            <span>盘点单号：</span><span>{{ currentDetailData.csCode }}</span>
          </div>
          <div class="maintain-dialog-body-btn-row">
            <span style="color: red; font-size: 12px; margin-left: 12px;">{{ errorTip }}</span>
          </div>
          <div class="maintain-dialog-body-table-box">
            <table-index
              class="table-index"
              :loading="dialogLoading"
              idName="csdId"
              :tableJson="matinTableJson"
              :selectionShow="false"
              :tableData="maintainTableData"
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
              <template #realStock="{scope}">
                <el-input
                  v-model="scope.row.realStock"
                  clearable
                  @input="(val) => realStockInput(scope.row, val)"
                  @clear="() => clearStockInput(scope.row)"
                  @blur="() => blurStockInput(scope.row)"
                >
                </el-input>
              </template>
              <template #isCheck="{name, scope}">
                <el-select v-model="scope.row.isCheck">
                  <el-option label="是" value="1" :key="1"></el-option>
                  <el-option label="否" value="0" :key="0"></el-option>
                </el-select>
              </template>
              <template #comments="{scope}">
                <el-input v-model="scope.row.comments" clearable :maxlength="40"></el-input>
              </template>
              <template #diffInfo="{scope}">
                <el-select v-model="scope.row.diffInfo" placeholder="">
                  <el-option v-for="item in diffInfoOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </template>
            </table-index>
          </div>
        </div>
      </template>
    </maintain-dialog>
    <detail-dialog key="detail" class="inventory-maintain-dialog" :visible="detailVisible" title="盘点单详情" width="90%" @detail-dialog-close="detailDialogClose">
      <template #footer>
        <el-button type="primary" @click="handleDetailTableExport">导出</el-button>
        <el-button v-if="currentDetailData.permFlag == '2'" type="primary" class="determine-btn" @click="handleApprove('1')">审批</el-button>
        <el-button v-if="currentDetailData.permFlag == '2'" type="primary" class="determine-btn" @click="handleApprove('2')">驳回</el-button>
        <el-button @click="detailDialogClose">关闭</el-button>
      </template>
      <template #default>
        <div class="maintain-dialog-body">
          <div class="maintain-dialog-body-code-row maintain-dialog-body-code-row-notip">
            <span>盘点单号：</span><span>{{ currentDetailData.csCode }}</span>
          </div>
          <div class="maintain-dialog-body-table-box">
            <table-index
              class="table-index"
              :loading="dialogLoading"
              idName="csdId"
              :tableJson="detailTableJson"
              :selectionShow="false"
              :tableData="detailTableData"
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
              <template #isCheck="{name, scope}">
                {{ transformIsCheck(scope.row.isCheck) }}
              </template>
            </table-index>
          </div>
        </div>
      </template>
    </detail-dialog>
    <review-dialog class="inventory-review-dialog inventory-maintain-dialog" :visible="reviewVisible" @dialog-close="reviewDialogClose" title="审批详情" width="90%">
      <template #footer>
        <div>
          <el-button @click="detailDialogClose">取消</el-button>
          <el-button @click="detailDialogClose">确定</el-button>
        </div>
      </template>
      <template #default>
        <div class="maintain-dialog-body">
          <div class="maintain-dialog-body-code-row">
            <span>盘点单号：</span><span>{{ currentDetailData.csCode }}</span>
          </div>
          <div class="maintain-dialog-body-table-box">
            <table-index
              class="table-index"
              :loading="reviewDialogLoading"
              idName="id"
              :tableJson="reviewTableJson"
              :selectionShow="false"
              :tableData="_reviewTableData"
              height="380"
              :queryParams="reviewQueryParams"
            >
            </table-index>
            <pagination 
              v-show="reviewTotal > 0"
              :total="reviewTotal"
              v-model:page="reviewQueryParams.pageNum"
              v-model:limit="reviewQueryParams.pageSize"
              @pagination="getReviewList"
            />
          </div>
        </div>
      </template>
    </review-dialog>
  </div>
</template>

<script setup name="inventory-maintain">
import { formJson } from "./formJson";
import { tableJson, tableButtonJson, matinTableJson, diffInfoOptions, detailTableJson, reviewTableJson } from "./tableJson";
import { getLocalStorage, getCookie } from '@/utils/auth';
import inventoryMaintainForm from "./components/inventoryMaintainForm.vue";
import { selectPlantDict } from "@/api/warehouse/plantDict.js";
import { getwarehouseByUserAndPlant } from "@/api/warehouse/warehouseDict.js"; // {plantId: xx}
import { getWarehousePartition } from "@/api/warehouse/partition.js"; // {whId: xx}
import { getInventoryList, toSubmitBatch, deleteBatch, getDetailList, saveOrUpdate, exportStockDetail, inventorySign, checkReview } from "@/api/warehouse/inventory";
import { formatDate } from "@/utils";
import maintainDialog from "./components/maintainDialog.vue";
import detailDialog from "./components/detailDialog.vue";
import { ElMessageBox, ElMessage } from 'element-plus';
import MessageContent from "./components/messageContent.vue";
import reviewDialog from "./components/reviewDialog.vue";
import { validityPeriodUnitObj } from '@/utils/dictionary';

const { proxy } = getCurrentInstance()

const route = useRoute();
const showSearch = ref(true);

const errorTip = ref("");
const loading = ref(false);
const formRef = ref(null);
const formSelectData = ref({
  plantCode: [],
  depotCode: [],
  partitionCode: [],
});
const queryParams = ref({
  pageNum: 1,
  pageSize: 30,
});
const tableJsonArr = ref(JSON.parse(getLocalStorage(route.meta?.menuId)) || tableJson);
const tableData = ref([]);
const total = ref(0);
const tableSelectedData = ref([]);

const reviewDialogLoading = ref(false);
const reviewVisible = ref(false);
const reviewQueryParams = ref({
  pageNum: 1,
  pageSize: 30,
})
const reviewTableData = ref([]);
const _reviewTableData = ref([]);
const reviewTotal = ref(0);
const maintainVisible = ref(false);
const detailVisible = ref(false);
const maintainTableData = ref([]);
const detailTableData = ref([]);
// 以下currentDetailData维护、详情公用
const currentDetailData = ref({});

const plantId = ref("");
const whId = ref("");
const partitionId = ref("");
const delBtnFlag = ref(true);
const submitBtnflag = ref(false);


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

const statusObj = computed(() => {
  const item = formJson.find(item => item.prop === 'status');
  const obj = {};
  const arr = item ? (item.selectData ? item.selectData : []) : [];
  if (arr.length) {
    for (const element of arr) {
      obj[element.value] = element.label
    }
  }
  return obj;
})

const getList = async () => {
  loading.value = true;
  try {
    const res = await getInventoryList({
      ...formRef.value.formData,
      ...queryParams.value,
      orderByColumn: "operDate",
      isAsc: false,
    });
    tableData.value = res.data?.list || [];
    total.value = res.data?.total || 0;

    if (formRef.value?.formData.status !== '3' && formRef.value?.formData.status !== '4' && formRef.value?.formData.permFlag !==  '2' && formRef.value?.formData.permFlag !== '3') {
      delBtnFlag.value = true;
    } else {
      delBtnFlag.value = false;
    }

    if (formRef.value?.formData.status !== '1' && formRef.value?.formData.status !== '3' && formRef.value?.formData.status !== '4' && formRef.value?.formData.permFlag !== '2' && formRef.value?.formData.permFlag !== '3') {
      submitBtnflag.value = true;
    } else {
      submitBtnflag.value = false;
    }

  } catch (error) {
      console.log(error);
  }
  loading.value = false;
}

const handleQuery = () => {
  queryParams.value.pageNum = 1;
  getList();
};

const resetQuery = () => {
  tableSelectedData.value = [];
  queryParams.value.pageNum = 1;
  getList();
};

const handleSubmit = async () => {

  try {
    
    // const res = await toSubmitBatch({
    //   csCodeList: tableSelectedData.value.map(item => item.csCode),
    // });
    const isPermFlag = tableSelectedData.value.some(a => a.permFlag == '2')
    console.log(isPermFlag)
    if(isPermFlag){
      proxy.$modal.msgWarning(`请选择未审核的数据`)
      return
    }

    proxy.$modal.confirm('您确定要报批所选盘点单吗？').then(async () => {
      const ids = tableSelectedData.value.map(item => item.csmId)
      // 无工作流：直接报批，不走"选审批人"弹窗（$reviewerDialog），不再传 auditUserId
      // proxy.$reviewerDialog({
      //   billType: 'PDD',
      //   billIdList: ids,
      //   multiple: true,
      //   success: async ({auditUserId}) => {
      const res = await inventorySign({
        csmIdList: ids,
      });

      ElMessageBox({
        title: "提示",
        message: () => h(MessageContent, {
          _info: `共选择${(res.data?.successCount || 0) + (res.data?.failureCount || 0)}条单据，提交成功${res.data?.successCount}条，失败${res.data?.failureCount}条`,
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
      //   }
      // })
    })

  } catch (error) {
    
  }
};

const handleDel = async () => {
  
  ElMessageBox.confirm(
    `您确定删除吗？`,
    "提示",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "primary"
    }
  ).then(async () => {

    // let delFlag = false;
    // tableSelectedData.value.forEach((item, index) => {
    //   if (item.status === '3') {
    //     ElMessage.error(`单据${item.csCode}的状态为已提交，不可删除！`);
    //     delFlag = true;
    //   }

    //   if (item.status === '4') {
    //     ElMessage.error(`单据${item.csCode}的状态为已生成调整单，不可删除！`)
    //     delFlag = true;
    //   }
    // })
    // if (delFlag) return;

    try {
      const res = await deleteBatch({
        ids: tableSelectedData.value.map(item => item.csmId),
      });
      ElMessageBox({
        title: "提示",
        message: () => h(MessageContent, {
          _info: `共选择${res.data?.total}条单据，删除成功${res.data?.success}条，失败${res.data?.failed}条`,
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
      console.log(error);
    }
  }).catch(err => {})
};

const tabConfigSuccess = (data) => {
  tableJsonArr.value = data;
}

const dialogLoading = ref(false);

const handleButtonClick = async (prop, {row}) => {
  if (prop === "maintain") {
    dialogLoading.value = true;
    try {
      currentDetailData.value = {...row}
      maintainVisible.value = true;
      const res = await getDetailList({
        csCode: row.csCode,
        orderByColumn: "seq",
        isAsc: false,
        pageNum: 1,
        pageSize: 1000
      });
      maintainTableData.value = res.data?.list || [];
      for (const element of maintainTableData.value) {
        if(!!!element.diffInfo) element.diffInfo = "正常";
        if (element.isCheck === "") {
          element.isCheck = "1";
        }
      }
    } catch (error) {
    }
    dialogLoading.value = false;
  }
  if (prop === "reviewDetail") {
    // 无工作流：隐藏"审批详情"入口（$flow 流程轨迹），将来接入工作流放开
    // proxy.$flow({bid: row.csmId})
    return;
    // reviewVisible.value = true;
    // reviewDialogLoading.value = true;

    // try {
    //   currentDetailData.value = {...row};
    //   const res = await workflowHistoryList({
    //     billId: currentDetailData.value.csmId,
    //   });
    //   console.log(res);
    // } catch (error) {

    // }

    // reviewDialogLoading.value = false;
  }
}

watch(() => [_reviewTableData.value, reviewQueryParams.value.pageNum, reviewQueryParams.value.pageSize], () => {
  const start = (reviewQueryParams.value.pageNum - 1) * reviewQueryParams.value.pageSize;
  const end = start + reviewQueryParams.value.pageSize;
  _reviewTableData.value = reviewTableData.value.slice(start, end);
}, {deep: true});

const clickLink = async (prop, data) => {
  if (prop === 'csCode') {
    dialogLoading.value = true;
    try {
      currentDetailData.value = { ...data };
      detailVisible.value = true;
      const res = await getDetailList({
        csCode: data.csCode,
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

const getPlantData = async () => {
  try {
    const res = await selectPlantDict();
    formSelectData.value['plantCode'] = res.data?.map(item => ({ ...item, label: `${item.plantName}`, value: item.plantCode })) || [];
  } catch (error) {
    
  }
}

const getWarehouseData = async (val) => {
  try {
    const _res = formSelectData.value['plantCode'].find(item => item.plantCode === val);
    if (_res) plantId.value = _res.id;
    const res = await getwarehouseByUserAndPlant({plantId: plantId.value})
    formSelectData.value['depotCode'] = res.data?.map(item => ({ ...item, label: `${item.whName}`, value: item.whCode })) || [];
  } catch (err) {
    
  }
}

const getPartitionData = async (val) => {
  try {
    const _res = formSelectData.value['depotCode'].find(item => item.whCode === val);
    if (_res) whId.value = _res.id;
    const res = await getWarehousePartition({whId: whId.value});
    formSelectData.value['partitionCode'] = res.data?.map(item => ({ ...item, label: `${item.partitionName}`, value: item.partitionCode })) || [];
  } catch (error) {
    
  }
}

watch(() => formRef.value?.formData.plantCode, (nval) => {
  formRef.value.formData.depotCode = "";
  if (!!!nval) formSelectData.value.depotCode = [];
});

watch(() => formRef.value?.formData.depotCode, (nval) => {
  formRef.value.formData.partitionCode = "";
  if (!!!nval) formSelectData.value.partitionCode = [];
})

const handleSelectChange = (prop, val, data) => {
  if (prop === 'plantCode') {
    if (!!val) {
      getWarehouseData(val);
    }
  }
  if (prop === 'depotCode') {
    if (!!val) {
      getPartitionData(val)
    }
  }
}

const handleSelectionChange = (data = []) => {
  tableSelectedData.value = data;
}

const maintainDialogClose = () => {
  maintainVisible.value = false;
  currentDetailData.value = {};
  maintainTableData.value = [];
}

const detailDialogClose = () => {
  detailVisible.value = false;
  currentDetailData.value = {};
  detailTableData.value = [];
}

const getReviewList = async () => {

}

const reviewDialogClose = () => {
  reviewVisible.value = false;
  currentDetailData.value = {};
  reviewTableData.value = [];
  reviewTotal.value = 0;
}

const handleSaveInventory = async () => {
  try {
    const res = await saveOrUpdate({
      csmId: currentDetailData.value.csmId,
      csCode: currentDetailData.value.csCode,
      // permFlag: "0",
      checkStockDtList: maintainTableData.value.map(item => ({
        csId: item.csmId,
        csdId: item.csdId,
        comments: item.comments,
        realStock: Number(item.realStock),
        diffInfo: item.diffInfo,
        flag: item.realStock > item.accStock ? "0" : "1",
        isCheck: item.isCheck,
      }))
    });

    ElMessageBox.confirm(
      `保存成功！`,
      "提示",
      {
        type: "warning",
        confirmButtonText: "确定",
        showCancelButton: false,
      }
    ).then(() => {
    }).catch(() => {
    }).finally(()=> {
      maintainDialogClose();
      getList();
    });
  } catch (error) {
    console.log(error);
  }
}

const handleSubmitInventory = async () => {
  try {
    // if (currentDetailData.value.permFlag !== "0") {
    //   ElMessage.error("当前盘点单不是未提交状态，无法提交，请先保存！");
    //   return;
    // }

    const _res = await saveOrUpdate({
      csmId: currentDetailData.value.csmId,
      csCode: currentDetailData.value.csCode,
      // permFlag: "0",
      checkStockDtList: maintainTableData.value.map(item => ({
        csId: item.csmId,
        csdId: item.csdId,
        comments: item.comments,
        realStock: Number(item.realStock),
        diffInfo: item.diffInfo,
        flag: item.realStock > item.accStock ? "0" : "1",
        isCheck: item.isCheck,
      }))
    });

    // const res = await toSubmitBatch({
    //   csCodeList: [currentDetailData.value.csCode]
    // });
    // 无工作流：直接报批，不走"选审批人"弹窗（$reviewerDialog），不再传 auditUserId
    // proxy.$reviewerDialog({
    //   billType: 'PDD',
    //   billIdList: [currentDetailData.value.csmId],
    //   multiple: true,
    //   success: async ({auditUserId}) => {
    const res = await inventorySign({
      csmIdList: [currentDetailData.value.csmId],
    });

    ElMessageBox.confirm(
      `提交成功！`,
      "提示",
      {
        type: "warning",
        confirmButtonText: "确定",
        showCancelButton: false,
      }
    ).then(() => {
    }).catch(() => {
    }).finally(() => {
      maintainDialogClose();
      getList();
    });
    //   }
    // })

  } catch (error) {
    console.log(error);
  }
}

const handleDetailTableExport = async () => {
  try {
    const res = await exportStockDetail({
      csCode: currentDetailData.value.csCode,
    });

    const url = URL.createObjectURL(new Blob([res.data], { type: res.headers['content-type'] }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentDetailData.value.csCode}盘点单明细信息.xlsx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    
  }
}

const realStockInput = (data, val) => {
  const regex = /^(?:[1-9]\d{0,6}|0)(?:\.\d{1,4})?$/;
  if (!regex.test(val) && val !== "") {
    ElMessage.error("盘点数量限制7位整数4位小数！");
  }
}

const blurStockInput = (data) => {
  if (data.realStock === "") {
    data.realStock = 0;
  }
}

const clearStockInput = (data) => {
  data.realStock = 0;
}

const buttonDisable = (code, data) => {
  if (code === "maintain") {
    if (data.status === "3" || data.status === "4") {
      return false;
    }
  }
  if (code === "reviewDetail") {
    if (data.status === "1") {
      return false;
    }
  }
  return true;
}

watch(() => maintainTableData.value, (nval) => {
  nval.forEach(row => {
    if(row["realStock"] == null) {
      row["realStock"] = row["accStock"] || 0;
    }
    if ((row["accStock"] || row["accStock"] == 0) && row["realStock"] > row["accStock"]) {
      row["diffInfo"] = "盘盈";
    }

    const arr = [];
    const regex = /^(?:[1-9]\d{0,6}|0)(?:\.\d{1,4})?$/;
    maintainTableData.value.forEach((item, index) => {
      if (!regex.test(item.realStock) && item.realStock !== "") {
        arr.push(index + 1);
      }
    });
    if (arr.length) {
      errorTip.value = `第${arr.join('、')}行的盘点数量不满足最多7位整数和最多4位小数，请修改。`;
    } else {
      errorTip.value = ""
    }
  })
}, {deep: true});

const handleRowStyle = (row, index) => {
  
  if (row.backFlag === "1") {
    return { color: "red" };
  }

  return {};
}

const getReviewFlag = (flag) => {
  if (flag === "1") {
    return "审核中";
  } else if (flag == "3") {
    return "";
  } else {
    return "未审核";
  }
}

const transformIsCheck = (val) => {
  if (val == "1") {
    return "是";
  } else {
    return "否";
  }
}

const setCheckReview = (isApproved, comment) => {
  checkReview([{billType: 'PDD', comment, csmId: currentDetailData.value.csmId, state: isApproved}]).then(({message}) => {
    proxy.$modal.msgSuccess(message)
    detailVisible.value = false
    getList()
  })
}

const handleApprove = (isApproved) => {
  if(isApproved === '1'){
    // 无工作流：直接审批通过，不走"选审批人"弹窗（$reviewerDialog），不再传 auditUserId
    // proxy.$reviewerDialog({
    //   billId: currentDetailData.value.csmId,
    //   multiple: true,
    //   urlType: false,
    //   success: ({auditUserId, comment}) => {
    //     setCheckReview(isApproved, auditUserId, comment)
    //   }
    // })
    setCheckReview(isApproved, '')
  }else{
    proxy.$modal.prompt('驳回原因', {
      inputValidator: (val) => {
        if(!val.trim()) return '驳回原因不能为空'
        return true
      },
      inputErrorMessage: '请输入驳回原因'
    }).then( (data) => {
      setCheckReview(isApproved, data.value)
    })
  }
}

onBeforeMount(() => {
  getPlantData();
})

onMounted(() => {
  getList();
})
</script>

<style lang="scss" scoped>
.inventory-maintain-page {
  :deep(.inventory-maintain-dialog) {
    height: 80vh;
    .ep-dialog__footer {
      margin-top: 0;
    }
    .ep-dialog__body {
      height: calc(100% - 93px);
    }
    .maintain-dialog-body {
      padding: 28px 24px;
      height: 100%;
      overflow: auto;
      .maintain-dialog-body-code-row {
        margin-bottom: 12px;
      }
      .maintain-dialog-body-btn-row {
        margin-bottom: 12px;
      }
      .maintain-dialog-body-code-row-notip {
        margin-bottom: 40px;
      }
      .maintain-dialog-body-table-box {
        height: calc(100% - 57px) !important;
      }
      .ep-table {
        margin-bottom: 0 !important;
      }
    }
  }
}
</style>