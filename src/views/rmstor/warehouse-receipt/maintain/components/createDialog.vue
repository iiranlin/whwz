<template>
  <div class="entry-create-dialog-box">
    <el-dialog class="dialog godown-entry-dialog" :model-value="visible" :width="width" top="5vh" draggable @close="dialogClose" destroy-on-close @open="createDialogOpen">
      <template #header>
        <span><svg-icon :icon-class="iconTitle" v-if="iconTitle" /> {{ title }}</span>
      </template>
      <el-form v-loading="_loading" ref="createFormRef" :model="createForm" style="width: 100%;" :inline="true" :rules="createFormRules">
        <div class="entry-form-row-div ">
          <div class="entry-form-row-title">入库单来源</div>
          <el-form-item prop="ibSource" class="entry-form-item-source">
            <el-radio-group v-model="createForm.ibSource" @change="sourceRadioChange">
              <el-radio v-for="item in filterWhReceiptSourceArr" :key="item.value" :value="item.value" size="large">{{ item.label }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
        <div class="entry-form-row-div entry-form-row-div-basic">
          <div class="entry-form-row-title">入库单基本信息</div>
          <el-form-item label="入库单号：" prop="ibBillCode" v-loading="_loading2">
            <el-input v-model="createForm.ibBillCode" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="用料地区：" prop="plantId">
            <el-select v-model="createForm.plantId" value-key="id" clearable placeholder="请选择" :disabled="createForm.ibSource === ''">
              <el-option v-for="item in plantOptions" :key="item.label" :value="item.value" :label="item.label"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="仓库：" prop="whId">
            <el-select v-model="createForm.whId" value-key="whCode" clearable placeholder="请选择" :disabled="createForm.ibSource === ''">
              <el-option v-for="item in whOptions" :key="item.label" :value="item.value" :label="item.label"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="仓库分区：" prop="partitionId">
            <el-select v-model="createForm.partitionId" value-key="id" clearable placeholder="请选择" @change="whPartitionChange" :disabled="createForm.ibSource === ''">
              <el-option v-for="item in partitionOptions" :key="item.label" :value="item.value" :label="item.label"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="应税用途：" prop="taxFlagName">
            <el-input v-model="createForm.taxFlagName" placeholder="请输入" disabled></el-input>
          </el-form-item>
          <el-form-item v-if="createForm.ibSource !== '1' && createForm.ibSource !== '4' && createForm.ibSource !== '9'" label="供货单位：" prop="supUnitName" class="entry-form-item-dialog" :class="{'warehouse-receipt-supplier-form-item': createForm.ibSource === '8'}">
            <el-input v-model="createForm.supUnitName" readonly>
              <template #append>
                  <el-button :icon="Search" @click="toFindSupplier"/>
                  <el-button v-if="createForm.ibSource === '8'" :icon="CircleClose" @click="clearSupplier"/>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item v-if="createForm.ibSource === '0' || createForm.ibSource === '2'" label="引用单据：" prop="refBillCode" class="entry-form-item-dialog">
            <el-input v-model="createForm.refBillCode" readonly>
               <template #append>
                <el-button :icon="Search" @click="toFindManifest" />
              </template>
            </el-input>
          </el-form-item>
          <el-form-item v-if="createForm.ibSource === '0'" label="采购方式（发起）：">
            <el-select v-model="createForm.buyTypeCode" value-key="value" :disabled="createForm.ibSource === '0'">
              <el-option v-for="item in _buyTypesData" :key="item.value" :label="item.label" :value="item"></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="一收一支：" prop="inOutFlag">
            <el-checkbox disabled v-model="createForm.inOutFlag" true-value="1" false-value="0"></el-checkbox>
          </el-form-item> -->
          <el-form-item label="一收一移库：" prop="allotFlag">
            <el-checkbox v-model="createForm.allotFlag" true-value="1" false-value="0" @change="movementTypeChange"></el-checkbox>
          </el-form-item>
          <el-form-item label="移库地区：" prop="ptPlantId">
            <el-select v-model="createForm.ptPlantId" :disabled="createForm.allotFlag !== '1'" value-key="id" clearable placeholder="请选择">
              <el-option v-for="item in ptPlantOptions" :key="item.label" :value="item.value" :label="item.label"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="移入仓库：" prop="ptWhId">
            <el-select v-model="createForm.ptWhId" :disabled="createForm.allotFlag !== '1'" value-key="id" clearable placeholder="请选择">
              <el-option v-for="item in ptWhOptions" :key="item.label" :value="item.value" :label="item.label"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="移入库区：" prop="ptPartitionId">
            <el-select v-model="createForm.ptPartitionId" :disabled="createForm.allotFlag !== '1'" value-key="id" clearable placeholder="请选择">
              <el-option v-for="item in ptPartitionOptions" :key="item.label" :value="item.value" :label="item.label"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="发票号：" prop="invoiceCode">
            <el-input v-model="createForm.invoiceCode" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="运费：" prop="freightAmount">
            <el-input v-model="createForm.freightAmount" @blur="(val) => basicPriceBlur(val, 'freightAmount')" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="杂费：" prop="extrasAmount">
            <el-input v-model="createForm.extrasAmount" @blur="(val) => basicPriceBlur(val, 'extrasAmount')" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="其他费：" prop="otherAmount">
            <el-input v-model="createForm.otherAmount" @blur="(val) => basicPriceBlur(val, 'otherAmount')" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="税额：" prop="incotaxAmount">
            <el-input v-model="createForm.incotaxAmount" @blur="(val) => basicPriceBlur(val, 'incotaxAmount')" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="料款：" prop="matlAmount">
            <el-input v-model="createForm.matlAmount" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="税额+料款：" prop="taxMatlAmount">
            <el-input v-model="createForm.taxMatlAmount" readonly></el-input>
          </el-form-item>
          <el-form-item label="总金额：" prop="totalAmount">
            <el-input v-model="createForm.totalAmount" readonly></el-input>
          </el-form-item>
          <el-form-item v-if="createForm.ibSource === '8'" label="来源类别：" prop="otherTypeCode">
            <el-select v-model="createForm.otherTypeCode" value-key="value">
              <el-option v-for="item in whReceiptSourceTypeArr" :key="item.value" :label="item.label" :value="item"></el-option>
            </el-select>
          </el-form-item>
          <div class="entry-comments-form-row">
            <el-form-item label="备注：" prop="comments" class="entry-comments-form-item">
              <el-input v-model="createForm.comments" type="textarea" :rows="5" placeholder="请输入"></el-input>
            </el-form-item>
          </div>
        </div>
      </el-form>
      <div class="entry-table-row">
        <div class="entry-table-row-title">入库单明细信息</div>
        <div class="entry-table-btn-row">
          <el-button type="primary" @click="toAddMatl" :disabled="addMatlDisabled">添加物资</el-button>
        </div>
        <div class="entry-table-content-row">
          <table-index
            class="table-index"
            :loading="loading"
            idName="matlCode"
            :tableJson="tableJsonArr"
            :tableButtonJson="createDialogTableButtonJson"
            :opertionWidth="120"
            :tableData="tableData"
            :selectionShow="false"
            @handleButtonClick="handleButtonClick"
            :key="tableKey"
          >
            <template #paNum="{name, scope}">
              <el-input v-model="scope.row.paNum" placeholder="请输入" @input="(val) => paNumInput(val, scope.row)" @blur="scope.row.paNum = detailPriceformat(scope.row.paNum)" type="number" :min="0"></el-input>
            </template>
            <template #stkPrice="{name, scope}">
              <el-input v-model="scope.row.stkPrice" disabled type="number"></el-input>
            </template>
            <template #stkAmount="{name, scope}">
              <el-input v-model="scope.row.stkAmount" placeholder="请输入" @input="(val) => stkAmountInput(val, scope.row)" @blur="scope.row.stkAmount = detailPriceformat(scope.row.stkAmount)" type="number" :min="0"></el-input>
            </template>
            <template #cardPrice="{name, scope}">
              <el-input v-model="scope.row.cardPrice" disabled></el-input>
            </template>
            <template #credCode="{name, scope}">
              <el-input v-model="scope.row.credCode" placeholder="请输入"></el-input>
            </template>
            <template #standardAmount="{name, scope}">
              {{ getStandardAmount(scope.row) }}
            </template>
            <template #productionDate="{name, scope}">
              <el-date-picker :disabled="scope.row.periodManage !== '1'" v-model="scope.row.productionDate" type="date" placeholder="选择日期" value-format="x"  @change="(val) => productionDateChange(val, scope.row)" :editable="false"></el-date-picker>
            </template>
            <template #validityPeriod="{name, scope}">
              <el-input :disabled="scope.row.periodManage !== '1'" v-model="scope.row.validityPeriod" placeholder="请输入" @input="(val) => validityPeriodInput(val, scope.row)"></el-input>
            </template>
            <template #validityPeriodUnit="{name, scope}">
              <el-select :disabled="scope.row.periodManage !== '1'" v-model="scope.row.validityPeriodUnit" placeholder="请选择" @change="(val) => validityPeriodUnitChange(val, scope.row)">
                <el-option v-for="item in validityPeriodUnitArr" :label="item.label" :key="item.key" :value="item.value"></el-option>
              </el-select>
            </template>
            <template #expirationDate="{name, scope}">
              <el-date-picker :disabled="scope.row.periodManage !== '1'" v-model="scope.row.expirationDate" type="date" placeholder="自动计算" readonly value-format="x"></el-date-picker>
            </template>
            <template #matlType="{name, scope}">
              {{ [scope.row.matlType, scope.row.matlpCode, scope.row.matlRaw].filter(item => !!item).join("/") }}
            </template>
          </table-index>
          <div>采购金额合计：{{ tableData.map(item => item.stkAmount ? Number(item.stkAmount) : 0).reduce((acc, curr) => acc + curr, 0) || 0 }}</div>
        </div>
      </div>
      <template #footer>
        <el-button @click="goBack">返回</el-button>
        <el-button type="primary" @click="toSave">保存</el-button>
      </template>
    </el-dialog>
    <supplier-dialog
      title="供货单位选择"
      :visible="supplierVisible"
      width="90%"
      @dialog-close="supplierDialogClose"
      @return-unit-data="getSupUnitData"
      :key="supplierKey"
      :commonDialogFormJson="supplierDialogFormJson"
      :commonDialogTableJson="supplierDialogTableJson"
      :tableRowDbClickFalg="true"
      :supUnitData="supUnitData"
    />
    <purchased-dialog
      title="采购订单选择"
      :key="purchaseKey"
      :visible="purchasedVisible"
      :suCode="createForm.supUnitCode"
      :suName="createForm.supUnitName"
      :refBillCode="createForm.refBillCode"
      :already-table-data="_tableData"
      width="90%"
      @dialog-close="purchasedDialogClose"
      @return-data="returnPurchaseData"
    />
    <outsale-dialog title="调拨单选择" :key="outsaleKey" :visible="outsaleVisible" width="90%" @dialog-close="outsaleDialogClose" @return-data="returnOutsaleData" :refBillCode="createForm.refBillCode" :already-table-data="_tableData" />
    <add-matl-dialog title="物资选择" :key="addMatlKey" :partitionCode="createForm.partitionId?.partitionCode" :visible="addMatlVisible" :already-table-data="_tableData" width="90%" @dialog-close="addMatlDialogClose" @return-matl-data="returnMatlData" />
  </div>
</template>

<script setup>
import { whReceiptSourceArr, whReceiptSourceTypeArr, validityPeriodUnitArr } from '@/utils/dictionary';
import { Search, CircleClose } from '@element-plus/icons-vue';
import purchasedDialog from './purchasedDialog.vue';
import outsaleDialog from './outsaleDialog.vue';
import supplierDialog from '../../components/supplierDialog.vue';
import addMatlDialog from './addMatlDialog.vue';
import { createDialogTableJson, createDialogTableButtonJson } from '../tableJson';
import { selectPlantDict, plantDictListAll } from "@/api/warehouse/plantDict.js";
import { mainReceiverUnit } from '@/api/warehouse/externalTransfer';
import { getwarehouseByUserAndPlant, warehouseDictListAll } from "@/api/warehouse/warehouseDict.js"; // {plantId: xx}
import { getWarehousePartition, partitionListAll } from "@/api/warehouse/partition.js"; // {whId: xx}
import { dictCateList } from "@/api/system/common.js";
import { ElMessage, ElMessageBox } from "element-plus";
import { createInBoundCode, createInbound, checkOldProductPrice, inboundLatestDetail, getMatlPeriodManage } from '@/api/rmstor/inbound';
import { paramConfigList } from "@/api/system/paramConfig.js";
import { parseTime } from "@/utils/generalMethod";
import { supplierDialogFormJson } from '../../components/formJson.';
import { supplierDialogTableJson } from '../../components/tableJson';
import { getCookie } from '@/utils/auth';
const { proxy } = getCurrentInstance();
const yearMonth = getCookie('warehouseGetYear') ? JSON.parse(getCookie('warehouseGetYear')).yearMonth ? JSON.parse(getCookie('warehouseGetYear')).yearMonth : parseTime(new Date(), '{y}{m}') : parseTime(new Date(), '{y}{m}');
const loginDate = getCookie('warehouseYearMonth') ? getCookie('warehouseYearMonth') : parseTime(new Date(), '{y}-{m}-{d}');
// 接收参数并指定类型（可选）
const props = defineProps({
  iconTitle: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    default: '新增',
  },
  width: {
    type: String,
    default: '800px',
  },
  visible: {
    type: Boolean,
    default: false,
  },
  editFlag: {
    type: Boolean,
    default: false,
  }
});

const supplierKey = ref(1);
const purchaseKey = ref(1);
const outsaleKey = ref(1);
const addMatlKey = ref(1);
const decimalPlaces = ref(2);
const stkPriceRange = ref("");
const createFormRef = ref(null);
const _loading = ref(false);
const _loading2 = ref(false);
const loading = ref(false);
const tableJsonArr = ref(createDialogTableJson);

const plantOptions = ref([]);
const whOptions = ref([]);
const partitionOptions = ref([]);

const ptPlantOptions = ref([]);
const ptWhOptions = ref([]);
const ptPartitionOptions = ref([]);

const buyTypesData = ref([]);
const stockAttrsData = ref([]);

const _buyTypesData = ref([
  { value: "0", label: "合同采购" },
  { value: "1", label: "指定采购" },
  { value: "2", label: "商城订单" }
])

const createForm = ref({
  ibSource: "0",
  ibBillCode: "",
  plantId: "",
  whId: "",
  partitionId: "",
  refBillCode: "", // 引用单据
  refBillMid: "",
  // refBillTypeCode: "",
  // refBillTypeName: "",
  taxFlagCode: "", // 应税用途code
  taxFlagName: "", // 应税用途name
  supUnitName: "", // 供货单位name
  supUnitCode: "", // 供货单位code
  supUnitType: "", // 供应单位类型
  orderDate: "",
  buyTypeCode: "", // 采购方式 name,code
  // inOutFlag: "0", // 一收一支
  allotFlag: "0", // 一收一移库
  ptPlantId: "", // 移库地区
  ptWhId: "", // 移入仓库
  ptPartitionId: "", // 移入地区
  invoiceCode: "", // 发票号
  freightAmount: "", // 运费
  extrasAmount: "", // 杂费
  otherAmount: "", // 其他费
  incotaxAmount: "", // 税额
  matlAmount: "", // 料款
  taxMatlAmount: "", // 税额+料款
  totalAmount: "", // 总金额
  otherTypeCode: "", // 来源类别
  comments: "", // 备注
  inBoundDts: [],
});
const ibBillCode = ref("");
const refBillData = ref({});
const tableKey = ref(1);
const tableData = ref([]);
const _tableData = ref([]);

const supUnitTypeObj = {
  "局内单位": "1",
  "路内局外单位": "2",
  "供应商": "3",
}

const supUnitData = ref({});

const filterWhReceiptSourceArr = computed(() => {
  const res = whReceiptSourceArr.filter(item => {
    return item.value !== "3" && item.value !== "6";
  });
  return res;
});

const suCodeRequiredFlag = computed(() => {
   if (createForm.value.ibSource === "0" || createForm.value.ibSource === "2" || createForm.value.ibSource === "7") {
    return true;
   } else {
    return false;
   }
});

const manifestCodeRequiredFlag = computed(() => {
  if (createForm.value.ibSource === "0" || createForm.value.ibSource === "2") {
    return true;
  } else {
    return false;
  }
});

const allotRuleFlag = computed(() => {
  if (createForm.value.allotFlag === "1") {
    return true;
  } else {
    return false;
  }
})

function addDays(dateStr, days) {
    // 1. 解析年月日
    const parts = dateStr.split('-');
    if (parts.length !== 3) {
        throw new Error('Invalid date format. Expected YYYY-MM-DD');
    }

    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // 月份从 0 开始
    const day = parseInt(parts[2], 10);

    // 2. 使用 UTC 时间创建日期对象（避免时区问题）
    const date = new Date(Date.UTC(year, month, day));

    // 3. 增加天数（setUTCDate 自动处理月份/年份进位）
    date.setUTCDate(date.getUTCDate() + days);

    // 4. 提取新日期的各组成部分
    const newYear = date.getUTCFullYear();
    const newMonth = String(date.getUTCMonth() + 1).padStart(2, '0');
    const newDay = String(date.getUTCDate()).padStart(2, '0');

    // 5. 返回格式化后的日期字符串
    return `${newYear}-${newMonth}-${newDay}`;
}

// 查询数字小数位数
const checkDecimalPlaces = (num) => {
  // 处理科学计数
  if (num === undefined) return 0;
  let str = num.toString();
  if (str.includes("e")) {
    // 转为普通小数形式(尽量保留精度)
    str = Number(num).toFixed(2);
  }
  const parts = str.split(".");
  if (parts.length === 1) return 0;
  return parts[1].replace(/0+$/, '').length;
}

const _formatDecimal = (value, decimals) => {
  const value2 = Number(value);
  if (typeof value2 !== "number" || isNaN(value2) || !isFinite(value2)) {
    return value?.toString() ?? "";
  }

  const factor = Math.pow(10, decimals);

  // const fixedDecimals = Math.max(0, Math.floor(decimals));
  // return String(value).trim() === "" ? "" : Number(value).toFixed(fixedDecimals);
  return String(value).trim() === "" ? "" : Math.round((Number(value) + Number.EPSILON) * factor) / factor;
}

const amountRegex = /^(?:[1-9]\d*|0)(?:\.\d+)?$/;

const createFormRules = ref({
  ibBillCode: [
    { required: true, message: "缺少入库单号，请刷新重试", trigger: ["blur", "change"] }
  ],
  plantId: [
    { required: true, message: "请选择用料地区", trigger: ["blur", "change"] },
  ],
  whId: [
    { required: true, message: "请选择仓库", trigger: ["blur", "change"] },
  ],
  partitionId: [
    { required: true, message: "请选择仓库分区", trigger: ["blur", "change"] },
  ],
  supUnitName: [
    { required: suCodeRequiredFlag, message: "请选择供货单位", trigger: ["blur", "change"] },
  ],
  freightAmount: [
    { pattern: amountRegex, message: "请输入非负数字", trigger: ["blur",] },
    { required: true, message: "请填写", trigger: ["blur"] },
  ],
  extrasAmount: [
    { pattern: amountRegex, message: "请输入非负数字", trigger: ["blur",] },
    { required: true, message: "请填写", trigger: ["blur"] },
  ],
  otherAmount: [
    { pattern: amountRegex, message: "请输入非负数字", trigger: ["blur",] },
    { required: true, message: "请填写", trigger: ["blur"] },
  ],
  incotaxAmount: [
    { pattern: amountRegex, message: "请输入非负数字", trigger: ["blur",] },
    { required: true, message: "请填写", trigger: ["blur"] },
  ],
  matlAmount: [
    { pattern: /^(?:[1-9]\d*|0)(?:\.\d+)?$/, message: "请输入非负数字", trigger: ["blur",] },
    { required: true, message: "请填写", trigger: ["blur"] },
  ],
  otherTypeCode: [
    { required: true, message: "请选择来源类别", trigger: ["blur",] }
  ],
  refBillCode: [
    { required: manifestCodeRequiredFlag, message: "请选择引用单据", trigger: ["blur", "change"] }
  ],
  ptPlantId: [
    { required: allotRuleFlag, message: "请选择", trigger: ["blur"] }
  ],
  ptWhId: [
    { required: allotRuleFlag, message: "请选择", trigger: ["blur"] }
  ],
  ptPartitionId: [
    { required: allotRuleFlag, message: "请选择", trigger: ["blur"] }
  ]
});

const basicPriceBlur = (val, prop) => {
  if (checkDecimalPlaces(createForm.value[prop]) > 2) {
    createForm.value[prop] = _formatDecimal(createForm.value[prop], "2")
  }
}

const detailPriceformat = (val, decimal = "2") => {
  if (checkDecimalPlaces(val) > 2) {
    return _formatDecimal(val, decimal)
  } else {
    return val
  }
}

watch(() => [createForm.value.incotaxAmount, createForm.value.matlAmount], (nval) => {
  // const data = Math.round(createForm.value.incotaxAmount * 100) + Math.round(createForm.value.matlAmount * 100);
  let total = 0;
  for (const item of nval) {
    if (typeof Number(item) !== 'number' || isNaN(Number(item))) {
      // total += Math.round(item * 100);
    } else {
      total += Math.round(item * 100);
    }
  }
  createForm.value.taxMatlAmount = total / 100;
});

watch(() => [createForm.value.incotaxAmount, createForm.value.freightAmount, createForm.value.extrasAmount, createForm.value.otherAmount, createForm.value.matlAmount], (nval) => {
  // const data = Math.round(createForm.value.incotaxAmount * 100) + Math.round(createForm.value.freightAmount * 100) + Math.round(createForm.value.extrasAmount * 100) + Math.round(createForm.value.otherAmount * 100) + Math.round(createForm.value.matlAmount * 100);
  let total = 0;
  for (const item of nval) {
    if (typeof Number(item) !== 'number' || isNaN(Number(item))) {
      // total += Math.round(item * 100);
    } else {
      total += Math.round(item * 100);
    }
  }
  createForm.value.totalAmount = total / 100;
})

// 供货单位列表数据
// const supplierTableData = ref([]);

const supplierVisible = ref(false);
const toFindSupplier = () => {
  if (!!tableData.value.length) {
    ElMessage.error("请先删除物资明细！");
    return;
  }
  supplierVisible.value = true;
}

const clearSupplier = () => {
  createForm.value.supUnitCode = null;
  createForm.value.supUnitType = null;
  createForm.value.supUnitName = "";

  createForm.value.refBillCode = "";
  // createForm.value.orderDate = "";
  createForm.value.refBillMid = "";
  createForm.value.buyTypeCode = "";

  tableData.value = [];
  _tableData.value = [];

  supUnitData.value = {};
}

const supplierDialogClose = () => {
  supplierVisible.value = false;
  supplierKey.value++;
}

// 引用单据列表数据
// const manifestTableData = ref([]);
const purchasedVisible = ref(false);
const outsaleVisible = ref(false);
const toFindManifest = () => {

  if (createForm.value.ibSource === "0") {
    purchasedVisible.value = true;
  }

  if (createForm.value.ibSource === "2") {
    outsaleVisible.value = true;
  }
}

const purchasedDialogClose = () => {
  purchasedVisible.value = false;
  purchaseKey.value++;
}

const outsaleDialogClose = () => {
  outsaleVisible.value = false;
  outsaleKey.value++;
}

const addMatlVisible = ref(false);
const toAddMatl = () => {
  if (!!!createForm.value.plantId.plantCode) {
    ElMessage.warning("请选择用料地区！");
    return;
  }
  if (!!!createForm.value.whId.whCode) {
    ElMessage.warning("请选择仓库！");
    return;
  }
  if (!!!createForm.value.partitionId.partitionCode) {
    ElMessage.warning("请选择仓库分区！");
    return;
  }
  addMatlVisible.value = true;
}

const addMatlDialogClose = () => {
  addMatlVisible.value = false;
  addMatlKey.value++;
}

const goBack = () => {
  dialogClose();
}

const toSave = () => {
  if (!!!tableData.value.length) {
    ElMessage.warning("请先输入收料单明细内容！");
    return;
  };

  let periodFlag = true;
  tableData.value.forEach((item, index) => {
    const arr = [];
    if (!!!item.matlCode) {
      periodFlag = false;
      arr.push("物资编码");
    }
    if (!!!item.paNum) {
      periodFlag = false;
      arr.push("入库数量");
    }
    if (!!!item.stkPrice) {
      periodFlag = false;
      arr.push("采购单价");
    }
    if (!!!item.stkAmount) {
      periodFlag = false;
      arr.push("采购金额");
    }
    if (!!!item.cardPrice) {
      periodFlag = false;
      arr.push("库存单价");
    }
    if (_tableData.value[index].periodManage === "1") {
      if (!!!item.productionDate) {
        periodFlag = false;
        arr.push("生产日期");
      }
      if (!!!item.validityPeriod) {
        periodFlag = false;
        arr.push("有效期");
      }
      if (!!!item.validityPeriodUnit || (item.validityPeriodUnit !== "年" && item.validityPeriodUnit !== "月" && item.validityPeriodUnit !== "周" && item.validityPeriodUnit !== "天")) {
        periodFlag = false;
        arr.push("有效期单位");
      }
      if (!!!item.expirationDate) {
        periodFlag = false;
        arr.push("到期日期");
      }
    }
    if (arr.length) {
      ElMessage.error(`请填写第${index + 1}行明细的${arr.join("、")}！`)
    }
  });
  if (!periodFlag) return;
  createFormRef.value.validate(async (valid) => {
    if (valid) {
      let periodFlag2 = true;
      tableData.value.forEach((item, index) => {
        const arr2 = [];
        if (createForm.value.ibSource === "0") {
          if (item.paNum > item.arrivalNum) {
            periodFlag2 = false;
            arr2.push(`输入的入库数量大于可入库数量${item.arrivalNum}！`);
          }
          if (stkPriceRange && item._stkPrice && item.stkPrice - item._stkPrice < stkPriceRange.value.split(",")[0] || item.stkPrice - item._stkPrice > stkPriceRange.value.split(",")[1]) {
            periodFlag2 = false;
            arr2.push(`采购单价与订单单价差异超出系统参数配置值！`)
          }
          if (!!arr2.length) {
             ElMessage.error(`第${index + 1}行${arr2.join("、")}`);
          }
        }
        if (createForm.value.ibSource === "2" && item.paNum > item.outsaleNum - item.outQuantity) {
          periodFlag2 = false;
          ElMessage.error(`第${index + 1}行输入的入库数量大于可入库数量${item.outsaleNum - item.outQuantity}！`);
        }
      });
      if (!periodFlag2) return;

      if (createForm.value.allotFlag === "1") {
        if (createForm.value.partitionId.stockattr !== createForm.value.ptPartitionId.stockattr) {
          ElMessage.warning("移入与移出仓库存货属性不一致！")
          return;
        }
      }

      if (createForm.value.ibSource === "0" || createForm.value.ibSource === "1") {
        const scrapData = stockAttrsData.value.find(item => item.code === createForm.value.partitionId.stockattr);
        if (scrapData) {
          if (scrapData.name === "报废物资") {
            ElMessage.warning("所选仓库属性为报废物资，请检查！");
            return;
          }
        }
      }
      try {
        const createData = {
          ibSource: createForm.value.ibSource,
          ibBillCode: createForm.value.ibBillCode,
          plantCode: createForm.value.plantId?.plantCode,
          plantName: createForm.value.plantId?.plantName,
          depotCode: createForm.value.whId?.whCode,
          depotName: createForm.value.whId?.whName,
          partitionCode: createForm.value.partitionId?.partitionCode,
          partitionName: createForm.value.partitionId?.partitionName,
          taxFlagCode: createForm.value.taxFlagCode,
          taxFlagName: createForm.value.taxFlagName,
          // refBillTypeCode: createForm.value.refBillTypeCode,
          // refBillTypeName: createForm.value.refBillTypeName,
          buyTypeCode: createForm.value.buyTypeCode?.value,
          buyTypeName: createForm.value.buyTypeCode?.label,
          // inOutFlag: createForm.value.inOutFlag,
          allotFlag: createForm.value.allotFlag,
          ptPlantCode: createForm.value.ptPlantId?.plantCode,
          ptPlantName: createForm.value.ptPlantId?.plantName,
          ptDepotCode: createForm.value.ptWhId?.whCode,
          ptDepotName: createForm.value.ptWhId?.whName,
          ptPartitionCode: createForm.value.ptPartitionId?.partitionCode,
          ptPartitionName: createForm.value.ptPartitionId?.partitionName,
          supUnitCode: createForm.value.supUnitCode || null,
          supUnitName: createForm.value.supUnitName,
          supUnitType: createForm.value.supUnitType || null,
          invoiceCode: createForm.value.invoiceCode || null,
          freightAmount: createForm.value.freightAmount || 0,
          extrasAmount: createForm.value.extrasAmount || 0,
          otherAmount: createForm.value.otherAmount || 0,
          incotaxAmount: createForm.value.incotaxAmount || 0,
          matlAmount: createForm.value.matlAmount || 0,
          otherTypeCode: createForm.value.otherTypeCode?.value,
          otherTypeName: createForm.value.otherTypeCode?.label,
          comments: createForm.value.comments,
          refBillMid: createForm.value.refBillMid || null,
          refBillCode: createForm.value.refBillCode || null,
          orderDate: createForm.value.orderDate || null,
          taxMatlAmount: createForm.value.taxMatlAmount || 0,
          inBoundDts: tableData.value.map(item => ({
            ...item,
            matlpCode: item.matlpCode || null,
            stkPrice: item.stkPrice || 0,
            stkAmount: item.stkAmount || 0,
            orderPrice: item.orderPrice || null,
            matlRaw: item.matlRaw || null,
            standardAmount: item.standardAmount || 0,
            stkPrice: item.stkPrice || 0,
          })),
          yearMonth,
          loginDate,
          // stockattr: createForm.value.partitionId.stockattr || null,
        };
        
        if(createForm.value.ibSource === "4") {
          const pre_res = await checkOldProductPrice({
            ...createData,
          });

          if (pre_res.code == "1") {
            ElMessageBox.confirm(
              pre_res.message,
              "提示",
              {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
              }
            ).then(async () => {
              const res = await createInbound({
                ...createData,
              });
              ElMessage.success("创建成功！")
              dialogClose();
            }).catch(err > {})
          }
          if (pre_res.code == "0") {
            const res = await createInbound({
              ...createData,
            });
            ElMessage.success("创建成功！")
            dialogClose();
          }
        } else {
          const res = await createInbound({
            ...createData,
          });
          ElMessage.success("创建成功！")
          dialogClose();
        }
      } catch (error) {
        console.log(error);
      }
    }
  })
}

const movementTypeChange = (val) => {
  if (val === "0") {
    createForm.value.ptPlantId = "";
    createForm.value.ptWhId = "";
    createForm.value.ptPartitionId = "";
  }
}

const getPlantOptions = async () => {
  _loading.value = true;

  try {
    const res = await selectPlantDict({inSource: createForm.value.ibSource});
    plantOptions.value = res.data ? res.data.length ? res.data.map(({plantCode, plantName, id}) => ({label: `${plantName}`, value: {plantName, plantCode, id}})) : [] : [];
  } catch (error) {
    
  }

  _loading.value = false;
}

const getWhOptions = async () => {
  try {
    const res = await getwarehouseByUserAndPlant({
      plantId: createForm.value.plantId.id,
      inSource: createForm.value.ibSource,
    });
    whOptions.value = res.data ? res.data.length ? res.data.map(({whCode, whName, id}) => ({label: `${whName}`, value: {whName, whCode, id}})) : [] : []
  } catch (error) {
    
  }
}

const getPartitionOptions = async () => {
  try {
    const res = await getWarehousePartition({
      whId: createForm.value.whId.id,
      inSource: createForm.value.ibSource,
    });
    partitionOptions.value = res.data ? res.data.length ? res.data.map(({partitionCode, partitionName, id, taxFlagCode, taxFlagName, stockattr}) => ({label: `${partitionName}`, value: {partitionName, partitionCode, id, taxFlagCode, taxFlagName, stockattr}})) : [] : []
  } catch (error) {
    
  }
}

const getPtPlantOptions = async () => {
  try {
    const res = await plantDictListAll({ 
      allocationStockAttr: createForm.value.partitionId.stockattr,
      allocationTaxFlagCode: createForm.value.partitionId.taxFlagCode,
     });
    ptPlantOptions.value = res.data ? res.data.length ? res.data.map(({plantCode, plantName, id}) => ({label: `${plantName}`, value: {plantName, plantCode, id}})) : [] : [];
    console.log(ptPlantOptions.value);
  } catch (error) {
    console.log(error);
  }
}

const getPtWhOptions = async () => {
  try {
    const res = await warehouseDictListAll({
      plantId: createForm.value.ptPlantId.id,
      allocationStockAttr: createForm.value.partitionId.stockattr,
      allocationTaxFlagCode: createForm.value.partitionId.taxFlagCode,
    });
    ptWhOptions.value = res.data ? res.data.length ? res.data.map(({whCode, whName, id}) => ({label: `${whName}`, value: {whName, whCode, id}})) : [] : []
  } catch (error) {
    
  }
}

const getPtPartitionOptions = async () => {
  try {
    const res = await partitionListAll({
      whId: createForm.value.ptWhId.id,
      allocationStockAttr: createForm.value.partitionId.stockattr,
      allocationTaxFlagCode: createForm.value.partitionId.taxFlagCode,
    });
    ptPartitionOptions.value = res.data ? res.data.length ? res.data.map(({partitionCode, partitionName, id, stockattr}) => ({label: `${partitionName}`, value: {partitionName, partitionCode, id, stockattr}})) : [] : []
  } catch (error) {
    
  }
}

watch(() => createForm.value.plantId, (nval) => {
  whOptions.value = [];
  partitionOptions.value = [];
  createForm.value.whId = "";
  createForm.value.partitionId = "";
  if (!!nval && !!nval.id) {
    getWhOptions();
  }
});

watch(() => createForm.value.whId, (nval) => {
  partitionOptions.value = [];
  createForm.value.partitionId = "";
  if (!!nval && !!nval.whCode) {
    getPartitionOptions();
  }
});

watch(() => createForm.value.partitionId, (nval) => {
  ptPlantOptions.value = [];
  ptWhOptions.value = [];
  ptPartitionOptions.value = [];
  createForm.value.ptPlantId = "";
  createForm.value.ptWhId = "";
  createForm.value.ptPartitionId = "";
  if (!!nval && !!nval.id) {
    getPtPlantOptions();
  }
})

watch(() => createForm.value.ptPlantId, (nval) => {
  ptWhOptions.value = [];
  ptPartitionOptions.value = [];
  createForm.value.ptWhId = "";
  createForm.value.ptPartitionId = "";
  if (!!nval && !!nval.id) {
    getPtWhOptions();
  }
});

watch(() => createForm.value.ptWhId, (nval) => {
  ptPartitionOptions.value = [];
  createForm.value.ptPartitionId = "";
  if (!!nval && !!nval.id) {
    getPtPartitionOptions();
  }
});

const getPurTypes = async () => {

  try {
    const res = await dictCateList({code: "pur_type"});
    buyTypesData.value = res?.data || [];
    for (const item of buyTypesData.value) {
      item.label = item.name;
      item.value = item.code;
    }
  } catch (error) {
    console.log(error);
  }
}

const getStockAttrs = async () => {
  try {
    const res = await dictCateList({code: "stock_attr"});
    stockAttrsData.value = res?.data || [];
    for (const item of stockAttrsData.value) {
      item.label = item.name;
      item.value = item.code;
    }
  } catch (error) {
    
  }
}

const whPartitionChange = (val) => {
  // taxFlagCode/taxFlagName
  if (!!val && !!val.id) {
    createForm.value.taxFlagCode = val.taxFlagCode;
    createForm.value.taxFlagName = val.taxFlagName;
  } else {
    createForm.value.taxFlagCode = "";
    delete createForm.value.taxFlagName;
  }
}

const sourceRadioChange = (val) => {
  setTimeout(() => {
    createFormRef.value.resetFields();
    createForm.value.supUnitCode = "";
    createForm.value.supUnitName = "";
    createForm.value.supUnitType = "";
    createForm.value.ibSource = val;
    createForm.value.ibBillCode = ibBillCode.value;
  })

  getInboundLatestDetail();
  // if (val == "7") {
  //   if (buyTypesData.value.length === 0) {
  //     getPurTypes();
  //   }
  // }
}

const getSupUnitData = (data = {}) => {
  if (Object.keys(data).length) {
    supUnitData.value = {...data};
    createForm.value.supUnitName = data.unitName;
    createForm.value.supUnitCode = data.unitCode;
    createForm.value.supUnitType = supUnitTypeObj[data.type] || null;
  } else {
    supUnitData.value = {};
    createForm.value.supUnitCode = null;
    createForm.value.supUnitName = "";
    createForm.value.supUnitType = null;
  }
}

const addMatlDisabled = computed(() => {
  if (createForm.value.ibSource === "0" || createForm.value.ibSource === "2") {
    return true;
  } else {
    return false;
  }
});

watch(() => createForm.value.ibSource, (nval) => {
  if (nval === "0") {
    createDialogTableJson.find(item => item.prop === "orderPrice").isShow = true;
    // createDialogTableJson.find(item => item.prop === "stkPrice").isShow = true;
    // createDialogTableJson.find(item => item.prop === "stkAmount").isShow = true;
  } else {
    createDialogTableJson.find(item => item.prop === "orderPrice").isShow = false;
    // createDialogTableJson.find(item => item.prop === "stkPrice").isShow = false;
    // createDialogTableJson.find(item => item.prop === "stkAmount").isShow = false;
  }
  tableKey.value++;
  tableData.value = [];
  _tableData.value = [];
});

const returnMatlData = async (data = []) => {
  // for (const item of data) {
  //   item.cardPrice = 0;
  // }
  loading.value = true;
  let arr = [];
  try {
    const res = await getMatlPeriodManage(data.map(item => item.matlCode));
    arr = res?.data || [];
  } catch (error) {
    arr = [];
  }
  loading.value = false;

  for (const item of arr) {
    for (const item2 of data) {
      if (item.matlCode === item2.matlCode) {
        item2.periodManage = item.periodManage;
        if (item.periodManage === "1") {
          item2.validityPeriod = item.validityPeriod;
          item2.validityPeriodUnit = item.validityPeriodUnit;
        }
      }
    }
  }
  tableData.value = [...data];
  _tableData.value = [...data];
}

const returnOutsaleData = ([arr, data]) => {
  for (const element of arr) {
    // element.cardPrice = _formatDecimal(element.cardPrice, decimalPlaces.value);
    element.cardPrice = detailPriceformat(element.cardPrice);
    element.paNum = detailPriceformat(element.paNum);
  }
   tableData.value = [...arr];
  _tableData.value = [...arr];
  createForm.value.refBillCode = data.outsaleCode;
  createForm.value.refBillMid = data.mtId;
}

const returnPurchaseData = ([arr, data]) => {
  for (const item of arr) {
    if(!!item.productionDate) item.productionDate = Number(item.productionDate);
    if(!!item.expirationDate) item.expirationDate = Number(item.expirationDate);
    item.stkPrice = detailPriceformat(item.stkPrice);
    item.paNum = detailPriceformat(item.paNum);
    item._stkPrice = item.stkPrice;
    // item.cardPrice = _formatDecimal(item.cardPrice, decimalPlaces.value);
    item.cardPrice = detailPriceformat(item.cardPrice);
    item.orderPrice = detailPriceformat(item.orderPrice);

    if (!!item.stkPrice && !!item.paNum && !isNaN(Number(item.stkPrice)) && !isNaN(Number(item.paNum))) {
      item.stkAmount = detailPriceformat(item.stkPrice * item.paNum);
    }
  }

  tableData.value = [...arr];
  _tableData.value = [...arr];

  createForm.value.refBillCode = data.spdCode;
  // createForm.value.orderDate = data.makeDate;
  createForm.value.refBillMid = data.pdmId;
  createForm.value.supUnitName = data.suName;
  createForm.value.buyTypeCode = _buyTypesData.value.find(item => item.value === data.orderCategories) || {};

  // 是否配件中心订单
  // const z_flag1 = createForm.value.ibSource === "0";
  // const z_flag2 = tableData.value.every(item => item.zycType !== "");

  // if(z_flag1 && z_flag2) {
  //   createForm.value.inOutFlag = "1";
  // }

  if (!!data.suName) {
    mainReceiverUnit({ unitName: data.suName }).then(res => {
      const _res = res.data?.list || [];
      if (!!_res.length) {
        supUnitData.value = {..._res[0]};
        createForm.value.supUnitType = supUnitTypeObj[_res[0].type] || null;
        createForm.value.supUnitCode = _res[0].unitCode || null;
      } else {
        createForm.value.supUnitType = null;
        createForm.value.supUnitCode = null;
      }
    }).catch(err => {});
  } else {
    createForm.value.supUnitType = null;
    createForm.value.supUnitCode = null; 
  }
}

const paNumInput = (val, data) => {
  if (createForm.value.ibSource === "0" &&  (val > data.arrivalNum)) {
    ElMessage.error(`大于可入库数量${data.arrivalNum}！`);
    // return;
  }
  if (createForm.value.ibSource === "2" && (val > data.outsaleNum - data.outQuantity)) {
    ElMessage.error(`大于可入库数量${data.outsaleNum - data.outQuantity}！`);
  }
  if (!!data.stkAmount && !!val && data.stkAmount !== "0" && !!val !== "0") {
      // data.stkPrice = _formatDecimal(data.stkAmount / val, 2);
      data.stkPrice = detailPriceformat(data.stkAmount / val);
  } else {
    data.stkPrice = 0;
  }

  if (createForm.value.ibSource !== "0" && createForm.value.ibSource !== "2") {
    data.cardPrice = data.stkPrice;
  }
};


const stkAmountInput = (val, data) => {
  if (!!val && !!data.paNum && val !== "0" && data.paNum !== "0") {
    // data.stkPrice = _formatDecimal(val / data.paNum, 2);
    data.stkPrice = detailPriceformat(val / data.paNum);
  } else {
    data.stkPrice = 0;
  }

  if (createForm.value.ibSource !== "0" && createForm.value.ibSource !== "2") {
    data.cardPrice = data.stkPrice;
  }
}

const getStandardAmount = (data = {}) => {
  if (!!data.paNum && !!data.cardPrice && data.paNum !== "0" && data.cardPrice !== "0") {
    const res = data.paNum * data.cardPrice;
    // return res;
    return detailPriceformat(res)
  } else {
    return 0;
  }
}

const computedExpirationDate = (productionDate, num, unit) => {
  const date = new Date(productionDate);

  switch (unit) {
    case "天":
      date.setDate(date.getDate() + num * 1);
      break;
    case "周":
      date.setDate(date.getDate() + num * 7);
      break;
    case "月":
      date.setMonth(date.getMonth() + num * 1);
      break;
    case "年":
      date.setFullYear(date.getFullYear() + num * 1);
      break;
    default:
      return null;
  }

  return date.getTime();
}

const productionDateChange = (val, data) => {
  if (!!data.validityPeriod && !!data.validityPeriodUnit && !!data.productionDate) {
    data.expirationDate = computedExpirationDate(data.productionDate, data.validityPeriod, data.validityPeriodUnit);
  }
}

const validityPeriodInput = (val, data) => {
 if (!!val && !!data.validityPeriodUnit && !!data.productionDate) {
    data.expirationDate = computedExpirationDate(data.productionDate, data.validityPeriod, data.validityPeriodUnit);
  }
}

const validityPeriodUnitChange = (val, data) => {
  if (!!data.validityPeriod && !!data.validityPeriodUnit && !!data.productionDate) {
    data.expirationDate = computedExpirationDate(data.productionDate, data.validityPeriod, data.validityPeriodUnit);
  }
}
const getTotalStkAmount = ref(0);
watch(() => tableData.value, () => {
  const arr = tableData.value.map(item => {
    return Number(item.stkAmount);
  });

  let total = 0;
  for (const item of arr) {
    total+=item;
  }
  getTotalStkAmount.value = total;
}, {deep: true});

const getInBoundCode = async () => {
  const res = await createInBoundCode({name: "入库单", receiptDate: yearMonth});
  ibBillCode.value = res?.data || "";
  createForm.value.ibBillCode = res?.data || "";
}

const getInboundLatestDetail = async () => {
  try {
    const res = await inboundLatestDetail();
    if (res.data.plantCode) {
      const res2 = plantOptions.value.find(item => item.value.plantCode === res.data.plantCode);
      if (res2) {
        createForm.value.plantId = {
          ...res2.value
        };
      }
      if (createForm.value.ibSource === "0" && res2.value.id && res.data.depotCode) {
        setTimeout(() => {
          createForm.value.whId = {
            whCode: res.data.depotCode,
            whName: res.data.depotName,
            id: ""
          }
        });
      }
    }
  } catch (error) {
    
  }
}

const createDialogOpen = async () => {
  // _loading2.value = true;
  try {
    
    getInBoundCode();
    await getPlantOptions();
    getInboundLatestDetail();
    getDecimalPlaces();
    getStockAttrs();
    getStkPriceRange();
  } catch (error) {
    
  }
  // _loading2.value = false;
}

// 查询系统参数限制库存单价的小数位数
const getDecimalPlaces = async() => {
  try {
    const res = await paramConfigList({paramCode: "25"});
    const arr = res.data?.list || [];
    arr.length ? decimalPlaces.value = (isNaN(Number(arr[0].paramValue)) ? 2 : Number(arr[0].paramValue)) : decimalPlaces.value = 2;
    if (decimalPlaces.value > 10 || decimalPlaces.value < 0) {
      decimalPlaces.value = 2;
    }
  } catch (error) {
    console.log(error);
  }
}

// 允许采购单价和入库库存单价差值
const getStkPriceRange = async () => {
  try {
    const res = await paramConfigList({paramCode: "102"});
    const arr = res.data?.list || [];
    arr.length ? stkPriceRange.value = arr[0].paramValue : stkPriceRange.value = "";
  } catch (error) {
    
  }
}

const handleButtonClick = (prop, scope) => {
  if (prop === "del") {
    if (scope.row.acId && createForm.value.ibSource === "0") {
      const index = tableData.value.findIndex(item => item.acId === scope.row.acId);
      tableData.value.splice(index, 1);
      _tableData.value.splice(index, 1);

      if (tableData.value.length === 0) {
        createForm.value.refBillCode = "";
        // createForm.value.orderDate = "";
        createForm.value.refBillMid = "";
        // createForm.value.invoiceCode = "";
        createForm.value.buyTypeCode = "";
      }
      return;
    }

    if (scope.row.matlCode && createForm.value.ibSource !== "0" && createForm.value.ibSource !== "2") {
      const index = tableData.value.findIndex(item => item.matlCode === scope.row.matlCode);
      tableData.value.splice(index, 1);
      _tableData.value.splice(index, 1);

      if (tableData.value.length === 0) {
      }
      return;
    }

    if (scope.row.dtId && createForm.value.ibSource === "2") {
      const index = tableData.value.findIndex(item => item.dtId === scope.row.dtId);
      tableData.value.splice(index, 1);
      _tableData.value.splice(index, 1);

      if (tableData.value.length === 0) {
        createForm.value.refBillCode = "";
        createForm.value.refBillMid = "";
        // createForm.value.orderDate = "";
      }
      return;
    }
  }
}

onMounted(async () => {
  
})

const emit = defineEmits(['dialogClose']);

const dialogClose = () => {
  emit('dialogClose');
}
</script>
<style lang="scss" scoped>
.entry-create-dialog-box {
  :deep(.godown-entry-dialog) {
    height: 80vh;
    // overflow-y: auto;
    .ep-dialog__body {
      padding: 12px;
      overflow-y: auto;
      overflow-x: hidden;
      height: calc(100% - 93px);
      .ep-form {
      .ep-input__wrapper {
        height: 32px !important;
      }
        .entry-form-row-title {
          margin-bottom: 24px;
        }
        .entry-form-item-source {
          padding-left: 63px;
        }
        .entry-form-row-div-basic {
          .ep-form-item {
            width: 22%;
          }
          .ep-form-item__label {
            width: 126px;
            font-weight: normal;
          }
          // .ep-form-item__content {
          //   width: 177px;
          // }
          .entry-form-item-dialog {
            .ep-input__suffix {
              cursor: pointer;
              .ep-icon {
                font-weight: 800;
                color: var(--ep-color-primary);
                font-size: 16px;
              }
            }
          }
          .warehouse-receipt-supplier-form-item {
            .ep-input-group__append {
              padding: 0 10px;
              >.ep-button {
                margin: 0;
                padding: 1px 2px;
                margin: 0 2px;
              }
            }
          }
        }
        .entry-comments-form-row {
          .entry-comments-form-item {
            width: 100%;
          }
        }
      }
      .entry-form-row-title,.entry-table-row-title {
        font-weight: 600;
        font-size: 16px;
      }
      .entry-table-row {
        .entry-table-btn-row {
          margin: 24px 0 12px 0;
        }
        .ep-table {
          .ep-table__empty-block {
            height: 0px !important;
          }
          .ep-date-editor--date {
            width: 160px;
          }
        }
      }
    }
  }

}
</style>