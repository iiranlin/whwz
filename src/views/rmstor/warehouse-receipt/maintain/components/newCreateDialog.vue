<template>
  <div class="entry-create-dialog-box">
    <el-dialog class="dialog godown-entry-dialog" :model-value="visible" :width="width" top="5vh" draggable @close="dialogClose" destroy-on-close @open="createDialogOpen">
      <template #header>
        <span><svg-icon :icon-class="iconTitle" v-if="iconTitle" /> {{ title }}</span>
      </template>
      <el-form v-loading="_loading" ref="createFormRef" :model="createForm" style="width: 100%;" :inline="true" :rules="createFormRules">
        <div class="entry-form-row-div" v-if="createForm.ibSource === '8'">
          <div class="entry-form-row-title">来源类别</div>
          <el-form-item prop="otherTypeCode" class="entry-form-item-source">
            <el-radio-group v-model="createForm.otherTypeCode">
              <el-radio v-for="item in whReceiptSourceTypeArr" :key="item.value" :value="item.value" size="large">{{ item.label }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
        <div class="entry-form-row-div entry-form-row-div-basic">
          <div class="entry-form-row-title">入库单基本信息</div>
          <el-form-item label="入库单号：" prop="ibBillCode" v-loading="_loading2">
            <el-input v-model="createForm.ibBillCode" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="用料地区：" prop="plantId">
            <el-select v-model="createForm.plantId" value-key="id" clearable placeholder="请选择">
              <el-option v-for="item in plantOptions" :key="item.label" :value="item.value" :label="item.label"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="仓库：" prop="whId">
            <el-select v-model="createForm.whId" value-key="whCode" clearable placeholder="请选择">
              <el-option v-for="item in whOptions" :key="item.label" :value="item.value" :label="item.label"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="仓库分区：" prop="partitionId">
            <el-select v-model="createForm.partitionId" value-key="id" clearable placeholder="请选择" @change="whPartitionChange">
              <el-option v-for="item in partitionOptions" :key="item.label" :value="item.value" :label="item.label"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="应税用途：" prop="taxFlagName">
            <el-input v-model="createForm.taxFlagName" ></el-input>
          </el-form-item>
          <el-form-item v-if="createForm.ibSource === '0'" label="采购订单：" prop="refBillCode" class="entry-form-item-dialog">
            <el-input v-model="createForm.refBillCode" readonly>
               <template #append>
                <el-button :icon="Search" @click="toFindManifest" />
              </template>
            </el-input>
          </el-form-item>
          <el-form-item v-if="createForm.ibSource ==='0'" label="供应商：" prop="supUnitName" class="entry-form-item-dialog">
            <el-input v-model="createForm.supUnitName" readonly disabled>
            </el-input>
          </el-form-item>
          <el-form-item v-if="createForm.ibSource === '2'" label="引用单据：" prop="refBillCode" class="entry-form-item-dialog">
            <el-input v-model="createForm.refBillCode" readonly>
               <template #append>
                <el-button :icon="Search" @click="toFindManifest" />
              </template>
            </el-input>
          </el-form-item>
          <el-form-item v-if="createForm.ibSource === '0'" label="采购方式：">
            <el-select v-model="createForm.buyTypeCode" value-key="value" placeholder="" :disabled="createForm.ibSource === '0'">
              <el-option v-for="item in buyTypesData" :key="item.value" :label="item.label" :value="item"></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="一收一支：" prop="inOutFlag">
            <el-checkbox disabled v-model="createForm.inOutFlag" true-value="1" false-value="0"></el-checkbox>
          </el-form-item> -->
          <!-- <el-form-item label="一收一移库：" prop="allotFlag">
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
          </el-form-item> -->
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
            <el-input v-model="createForm.matlAmount" @blur="(val) => basicPriceBlur(val, 'matlAmount')" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="税额+料款：" prop="taxMatlAmount">
            <el-input v-model="createForm.taxMatlAmount" readonly></el-input>
          </el-form-item>
          <el-form-item label="总金额：" prop="totalAmount">
            <el-input v-model="createForm.totalAmount" readonly></el-input>
          </el-form-item>
          <div class="entry-comments-form-row">
            <el-form-item label="备注：" prop="comments" class="entry-comments-form-item">
              <el-input v-model="createForm.comments" type="textarea" :rows="2" placeholder="请输入" maxlength="500" show-word-limit></el-input>
            </el-form-item>
          </div>
        </div>
      </el-form>
      <div class="entry-table-row">
        <div class="entry-table-row-title">入库单明细信息</div>
        <div class="entry-table-btn-row">
          <el-button v-if="!addMatlDisabled" type="primary" @click="toAddMatl" :disabled="addMatlDisabled">添加明细</el-button>
        </div>
        <div class="entry-table-content-row">
          <el-pro-table
            :columns="columns"
            :data="tableData"
            :show-refresh="false"
            :show-setting="false"
            :show-pagination="false"
            :grid-options="{rowId: cTableKey}"
            :edit-config="{enabled: true}"
            :toolbar-config="tableToolbarConfig"
            ref="tableRef"
            @edit-save="editSave"
            @edit-cancel="editCancel"
            @cell-change="cellChange"
            @action="handleTableAction"
          >
            <template #contractPic="{row}">
              <el-link type="primary" @click="clickLink('contractPic', row)">合同照片</el-link>
            </template>
            <template #accPic="{row}">
              <el-link type="primary" @click="clickLink('accPic', row)">验收照片</el-link>
            </template>
            <template #standardAmount="{row}">
             {{ getStandardAmount(row)}}
            </template>
          </el-pro-table>
          <div style="margin-top: 16px;">采购金额合计：{{ (tableData.map(item => item.stkAmount ? Number(item.stkAmount) : 0).reduce((acc, curr) => acc + curr, 0) || 0).toFixed(2) }}</div>
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
      :refBillCode="createForm.refBillCode"
      :already-table-data="_tableData"
      width="90%"
      @dialog-close="purchasedDialogClose"
      @return-data="returnPurchaseData"
      :plantCode="createForm.plantId?.plantCode"
    />
    <outsale-dialog title="调拨单选择" :key="outsaleKey" :visible="outsaleVisible" width="90%" @dialog-close="outsaleDialogClose" @return-data="returnOutsaleData" :refBillCode="createForm.refBillCode" :already-table-data="_tableData" :unit-name="createForm.supUnitName" :unit-code="createForm.supUnitCode" />
    <add-matl-dialog title="物资选择" :key="addMatlKey" :partitionCode="createForm.partitionId?.partitionCode" :visible="addMatlVisible" :already-table-data="_tableData" width="90%" @dialog-close="addMatlDialogClose" @return-matl-data="returnMatlData" />
    <picture-list-dialog title="验收图片查看" :visible="pictureListVisible" width="80%" @dialog-close="pictureListDialogClose" :pdb-id="currentData.acId" />
    <picture-carousel-dialog title="合同照片查看" :visible="pictureCarouselVisible" width="80%" @dialog-close="pictureCarouselClose" :pdb-id="currentData.acId" />
  </div>
</template>

<script setup>
import { whReceiptSourceTypeArr, whReceiptSourceTypeObj, validityPeriodUnitArr } from '@/utils/dictionary';
import { Search, CircleClose } from '@element-plus/icons-vue';
import purchasedDialog from './purchasedDialog.vue';
import outsaleDialog from './outsaleDialog.vue';
import supplierDialog from '../../components/supplierDialog.vue';
import addMatlDialog from './addMatlDialog.vue';
import { createDialogTableJson, pCreateDialogTableJson, npCreateDialogTableJson, createDialogTableButtonJson } from '../tableJson';
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
import pictureListDialog from '../../components/pictureListDialog.vue';
import pictureCarouselDialog from '../../components/pictureCarouselDialog.vue';
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
  },
  ibSource: {
    type: String,
    default: ""
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
const tableJsonArr = ref(props.ibSource === "0" ? pCreateDialogTableJson : npCreateDialogTableJson);

const plantOptions = ref([]);
const whOptions = ref([]);
const partitionOptions = ref([]);

const ptPlantOptions = ref([]);
const ptWhOptions = ref([]);
const ptPartitionOptions = ref([]);

const buyTypesData = ref([]);
const stockAttrsData = ref([]);
const pictureListVisible = ref(false);
const pictureCarouselVisible = ref(false);

const watchPlantFlag = ref(false);

const createForm = ref({
  ibSource: props.ibSource,
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
  // supplierName: "", // 供应商
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
  otherTypeCode: "1", // 来源类别
  comments: "", // 备注
  inBoundDts: [],
});
const ibBillCode = ref("");
const tableKey = ref(1);
const tableData = ref([]);
const _tableData = ref([]);

const tableToolbarConfig = {
  buttons: [
    { code: 'deleteRow', name: "删除", type: "danger", showInRow: true, showInTop: false },
  ]
};

const supUnitTypeObj = {
  "局内单位": "1",
  "路内局外单位": "2",
  "供应商": "3",
}

const supUnitData = ref({});

const accPicList = ref([]);
const currentData = ref({});

const tableRef = ref(null);

const columns = computed(() => [
  { field: "matlCode", title: "物资编号", minWidth: 180, align: "center", required: true, headerClassName: "required-col-header" },
  { field: "matlName", title: "物资名称", minWidth: 200, align: "center"},
  { field: "matlType", title: "规格类型/图号/材质", minWidth: 200, align: "center", render: (row) => [row.matlType, row.matlpCode, row.matlRaw].filter(item => !!item).join("/") },
  { field: "matlUnit", title: "计量单位", minWidth: 140, align: "center" },
  { field: "paNum", title: "入库数量", minWidth: 120, align: "center", required: true, headerClassName: "required-col-header", render: (row) => row.paNum != null && row.paNum !== '' ? Number(row.paNum).toFixed(4) : '', editRender: { name: "el-input", props: { type: "number", placeholder: "请输入" } } },
  { field: "stkPrice", title: "采购单价", minWidth: 140, align: "center", required: true, headerClassName: "required-col-header", render: (row) => row.stkPrice != null && row.stkPrice !== '' ? Number(row.stkPrice).toFixed(2) : '', editRender: { name: "el-input", props: { disabled: true, type: "number", placeholder: "自动计算" } } },
  { field: "orderPrice", title: "订单单价", minWidth: 140, align: "center", render: (row) => row.orderPrice != null && row.orderPrice !== '' ? Number(row.orderPrice).toFixed(2) : '', visible: createForm.value.ibSource === "0" },
  { field: "stkAmount", title: "采购金额", minWidth: 140, align: "center", required: true, headerClassName: "required-col-header", render: (row) => row.stkAmount != null && row.stkAmount !== '' ? Number(row.stkAmount).toFixed(2) : '', editRender: { name: "el-input", props: { type: "number", placeholder: "请输入" } } },
  { field: "cardPrice", title: "库存单价", minWidth: 140, align: "center", required: true, headerClassName: "required-col-header", render: (row) => row.cardPrice != null && row.cardPrice !== '' ? Number(row.cardPrice).toFixed(2) : '', editRender: { name: "el-input", props: { disabled: true, type: "number", placeholder: "自动计算" } } },
  { field: "standardAmount", title: "入库金额", minWidth: 140, align: "center", type: "slot", slotName: "standardAmount" },
  { field: "credCode", title: "技证号", minWidth: 180, align: "center", editRender: { name: "el-input", props: { placeholder: "请输入" } }},
  { field: "productionDate", title: "生产日期", minWidth: 180, align: "center", type: "date", editRender: {name: "el-date-picker", props: { valueFormat: "x", editable: false, placeholder: "请选择"}}},
  { field: "validityPeriod", title: "有效期", minWidth: 120, align: "center", editRender: { name: "el-input", props: { placeholder: "请输入" } } },
  { field: "validityPeriodUnit", title: "有效期单位", minWidth: 120, align: "center", editRender: { name: "el-select", props: { placeholder: "请选择", options: validityPeriodUnitArr } } },
  { field: "expirationDate", title: "到期日期", minWidth: 180, align: "center", type: "date", editRender: { name: "el-date-picker", props: { placeholder: "自动计算", readonly: true, } } },
  // { field: "accPic", title: "验收照片",minWidth: 160, align: "center", slotName: "accPic", hideInTable: createForm.value.ibSource !== "0"},
  // { field: "contractPic", title: "合同照片",minWidth: 160, align: "center", slotName: "contractPic", hideInTable: createForm.value.ibSource !== "0" }
]);

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
// 移除一收一移库规则后，默认值是0
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
  if (!!!num && num !== 0) return 0;
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
    return null;
  }

  const factor = Math.pow(10, decimals);
  return String(value).trim() === "" ? "" : Math.round((Number(value) + Number.EPSILON) * factor) / factor;
}

const _formatDecimal2 = (value, decimals) => {
  const value2 = Number(value);
  if (typeof value2 !== "number" || isNaN(value2) || !isFinite(value2)) {
    return value?.toString() ?? "";
  }

  const factor = Math.pow(10, decimals);

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
  // supUnitName: [
 //   { required: suCodeRequiredFlag, message: "请选择供货单位", trigger: ["blur", "change"] },
  // ],
  // freightAmount: [
  //   { pattern: amountRegex, message: "请输入非负数字", trigger: ["blur",] },
  //   { required: true, message: "请填写", trigger: ["blur"] },
  // ],
  // extrasAmount: [
  //   { pattern: amountRegex, message: "请输入非负数字", trigger: ["blur",] },
  //   { required: true, message: "请填写", trigger: ["blur"] },
  // ],
  // otherAmount: [
  //   { pattern: amountRegex, message: "请输入非负数字", trigger: ["blur",] },
  //   { required: true, message: "请填写", trigger: ["blur"] },
  // ],
  // incotaxAmount: [
  //   { pattern: amountRegex, message: "请输入非负数字", trigger: ["blur",] },
  //   { required: true, message: "请填写", trigger: ["blur"] },
  // ],
  // matlAmount: [
  //   { pattern: /^(?:[1-9]\d*|0)(?:\.\d+)?$/, message: "请输入非负数字", trigger: ["blur",] },
  //   { required: true, message: "请填写", trigger: ["blur"] },
  // ],
  otherTypeCode: [
    { required: true, message: "请选择来源类别", trigger: ["blur",] }
  ],
  refBillCode: [
    { required: manifestCodeRequiredFlag, message: "请选择引用单据", trigger: ["blur", "change"] }
  ],
  // ptPlantId: [
  //   { required: allotRuleFlag, message: "请选择", trigger: ["blur"] }
  // ],
  // ptWhId: [
  //   { required: allotRuleFlag, message: "请选择", trigger: ["blur"] }
  // ],
  // ptPartitionId: [
  //   { required: allotRuleFlag, message: "请选择", trigger: ["blur"] }
  // ]
});

const detailPriceformat = (val, decimal = "2") => {
  if (checkDecimalPlaces(val) > 2) {
    return _formatDecimal(val, decimal)
  } else {
    return _formatDecimal(val, checkDecimalPlaces(val));
  }
}

const detailPriceformat2 = (val, decimal = "2") => {
  const num = checkDecimalPlaces(val) > 2
    ? _formatDecimal2(val, decimal)
    : _formatDecimal2(val, checkDecimalPlaces(val));
  return Number(num).toFixed(decimal);
}

const basicPriceBlur = (val, prop) => {
  createForm.value[prop] = detailPriceformat2(createForm.value[prop]);
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
  createForm.value.taxMatlAmount = (total / 100).toFixed(2);
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
  createForm.value.totalAmount = (total / 100).toFixed(2);
})

// 供货单位列表数据
// const supplierTableData = ref([]);

const supplierVisible = ref(false);
const toFindSupplier = () => {
  if (!!tableData.value.length && createForm.value.ibSource === "0") {
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
    if (!!!createForm.value.partitionId?.id) {
      ElMessage.error("请先选择仓库分区！");
      return;
    }
    purchasedVisible.value = true;
  }

  if (createForm.value.ibSource === "2") {
    if (!!!createForm.value.supUnitCode) {
      ElMessage.error("请先选择供货单位！");
      return;
    }
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
    ElMessage.error("请选择用料地区！");
    return;
  }
  if (!!!createForm.value.whId.whCode) {
    ElMessage.error("请选择仓库！");
    return;
  }
  if (!!!createForm.value.partitionId.partitionCode) {
    ElMessage.error("请选择仓库分区！");
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
  createFormRef.value.validate(async (valid) => {
    if (valid) {
      // if (createForm.value.allotFlag === "1") {
      //   if (createForm.value.partitionId.stockattr !== createForm.value.ptPartitionId.stockattr) {
      //     ElMessage.error("移入与移出仓库存货属性不一致，请检查！")
      //     return;
      //   }
      // }

      if (createForm.value.ibSource === "0" || createForm.value.ibSource === "1") {
        const scrapData = stockAttrsData.value.find(item => item.code === createForm.value.partitionId.stockattr);
        if (scrapData) {
          if (scrapData.name === "报废物资") {
            ElMessage.error("所选仓库属性为报废物资，请检查！");
            return;
          }
        }
      }

      if (!!!tableData.value.length) {
        ElMessage.error("入库单明细内容不可为空！");
        return;
      };

      let periodFlag = true;
      tableData.value.forEach((item, index) => {
        const arr = [];
        if (!!!item.matlCode) {
          periodFlag = false;
          arr.push("物资编号");
        }
        if (!!!item.paNum || Number(item.paNum) === 0) {
          periodFlag = false;
          arr.push("入库数量");
        }
        if (!!!item.stkPrice || Number(item.stkPrice) === 0) {
          periodFlag = false;
          arr.push("采购单价");
        }
        if (!!!item.stkAmount || Number(item.stkAmount) === 0) {
          periodFlag = false;
          arr.push("采购金额");
        }
        if (!!!item.cardPrice || Number(item.cardPrice) === 0) {
          periodFlag = false;
          arr.push("库存单价");
        }
        if (item.periodManage === "1" || item.isPeriodManage === "1") {
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

      let periodFlag2 = true;
      tableData.value.forEach((item, index) => {
        const arr2 = [];
        if (createForm.value.ibSource === "0") {
          if (Number(item.paNum) > Number(item.arrivalNum)) {
            periodFlag2 = false;
            arr2.push(`输入的入库数量大于可入库数量${item.arrivalNum}！`);
          }
          if (stkPriceRange && item._stkPrice && Number(item.stkPrice) - Number(item._stkPrice) < stkPriceRange.value.split(",")[0] || Number(item.stkPrice) - Number(item._stkPrice) > stkPriceRange.value.split(",")[1]) {
            periodFlag2 = false;
            arr2.push(`采购单价与订单单价差异超出系统参数配置值！`)
          }
          if (!!arr2.length) {
             ElMessage.error(`第${index + 1}行${arr2.join("、")}`);
          }
        }
        if (createForm.value.ibSource === "2" && Number(item.paNum) > Number(item.outsaleNum) - Number(item.outQuantity)) {
          periodFlag2 = false;
          ElMessage.error(`第${index + 1}行输入的入库数量大于可入库数量${Number(item.outsaleNum) - Number(item.outQuantity)}！`);
        }
      });
      if (!periodFlag2) return;

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
          buyTypeCode: createForm.value.buyTypeCode?.value || null,
          buyTypeName: createForm.value.buyTypeCode?.label || null,
          // inOutFlag: createForm.value.inOutFlag,
          allotFlag: createForm.value.allotFlag,
          ptPlantCode: createForm.value.ptPlantId?.plantCode,
          ptPlantName: createForm.value.ptPlantId?.plantName,
          ptDepotCode: createForm.value.ptWhId?.whCode,
          ptDepotName: createForm.value.ptWhId?.whName,
          ptPartitionCode: createForm.value.ptPartitionId?.partitionCode,
          ptPartitionName: createForm.value.ptPartitionId?.partitionName,
          invoiceCode: createForm.value.invoiceCode || null,
          supUnitCode: createForm.value.supUnitCode || null,
          supUnitName: createForm.value.supUnitName || null,
          supUnitType: createForm.value.supUnitType || null,
          // supplierName: createForm.value.supplierName || null,
          freightAmount: createForm.value.freightAmount || '0.00',
          extrasAmount: createForm.value.extrasAmount || '0.00',
          otherAmount: createForm.value.otherAmount || '0.00',
          incotaxAmount: createForm.value.incotaxAmount || '0.00',
          matlAmount: createForm.value.matlAmount || '0.00',
          otherTypeCode: createForm.value.ibSource === '8' ? createForm.value.otherTypeCode : null,
          otherTypeName: createForm.value.ibSource === '8' ? (whReceiptSourceTypeObj[createForm.value.otherTypeCode] || null) : null,
          comments: createForm.value.comments,
          refBillMid: createForm.value.refBillMid || null,
          refBillCode: createForm.value.refBillCode || null,
          taxMatlAmount: createForm.value.taxMatlAmount || '0.00',
          inBoundDts: tableData.value.map(item => {
            if (item.periodManage === "1" || item.isPeriodManage === "1") {
              return {
                ...item,
                matlpCode: item.matlpCode || null,
                stkPrice: item.stkPrice || 0,
                stkAmount: item.stkAmount || 0,
                orderPrice: item.orderPrice || null,
                matlRaw: item.matlRaw || null,
                standardAmount: getStandardAmount(item) || 0,
                stkPrice: item.stkPrice || 0,
                productionDate: parseTime(item.productionDate, '{y}-{m}-{d}'),
                expirationDate: parseTime(item.expirationDate, '{y}-{m}-{d}'),
              }
            } else {
              return {
                ...item,
                matlpCode: item.matlpCode || null,
                stkPrice: item.stkPrice || 0,
                stkAmount: item.stkAmount || 0,
                orderPrice: item.orderPrice || null,
                matlRaw: item.matlRaw || null,
                standardAmount: getStandardAmount(item) || 0,
                stkPrice: item.stkPrice || 0,
              }
            }
          }),
          yearMonth,
          loginDate,
          orderDate: loginDate,
        };
        console.log(createData);
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
  createForm.value.taxFlagCode = "";
  createForm.value.taxFlagName = "";
  if (!!nval && !!nval.id && watchPlantFlag.value) {
    getWhOptions();
  }
});

watch(() => createForm.value.whId, (nval) => {
  partitionOptions.value = [];
  createForm.value.partitionId = "";
  createForm.value.taxFlagCode = "";
  createForm.value.taxFlagName = "";
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
    createForm.value.taxFlagName = "";
    // delete createForm.value.taxFlagName;
  }
}

watch(() => createForm.value.taxFlagCode, (nval, oval) => {
  if (nval !== oval) {
    if (createForm.value.ibSource === "0") {
      createForm.value.supUnitCode = "";
      createForm.value.supUnitName = "";
      createForm.value.supUnitType = "";

      createForm.value.buyTypeCode = "";
      createForm.value.buyTypeName ="";

      createForm.value.refBillCode = "";
      createForm.value.refBillMid = "";

      tableData.value = [];
      _tableData.value = [];
    }
  }
})

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


const returnMatlData = async (data = []) => {
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
    element.cardPrice = _formatDecimal(element.cardPrice, decimalPlaces.value) || 0;
    // element.cardPrice = detailPriceformat(element.cardPrice) || 0;
    element.paNum = detailPriceformat(element.paNum) || 0;
  }
   tableData.value = [...arr];
  _tableData.value = [...arr];
  createForm.value.refBillCode = data.outsaleCode;
  createForm.value.refBillMid = data.mtId;
  // createForm.value.orderDate = data.orderDate;
}

const returnPurchaseData = ([arr, data]) => {
  for (const item of arr) {
    if(!!item.productionDate) item.productionDate.includes("-") ? item.productionDate = new Date(item.productionDate).getTime() : item.productionDate = Number(item.productionDate);
    if(!!item.expirationDate) item.expirationDate.includes("-") ? item.expirationDate = new Date(item.expirationDate).getTime() : item.expirationDate = Number(item.expirationDate);
    item.stkPrice = detailPriceformat(item.stkPrice) || 0;
    item.paNum = detailPriceformat(item.paNum) || 0;
    item._stkPrice = item.stkPrice;
    // item.cardPrice = _formatDecimal(item.cardPrice, decimalPlaces.value);
    item.cardPrice = _formatDecimal(item.cardPrice, decimalPlaces.value) || 0;
    item.orderPrice = detailPriceformat(item.orderPrice) || 0;

    if (!!item.stkPrice && !!item.paNum && !isNaN(Number(item.stkPrice)) && !isNaN(Number(item.paNum))) {
      item.stkAmount = detailPriceformat(item.stkPrice * item.paNum) || 0;
    }

    if (createForm.value.taxFlagName === "免税" || createForm.value.taxFlagName === "零税率" || createForm.value.taxFlagCode === "03" || createForm.value.taxFlagCode === "04") {
      item.cardPrice = _formatDecimal(item.stkAmount / item.paNum, decimalPlaces.value) || 0;
    }

    if (createForm.value.taxFlagName === "应税" || createForm.value.taxFlagCode === "01") {
      // 含税
      if (item.taxFlag === "1") {
        item.cardPrice = _formatDecimal(item.orderPrice / (1 + item.taxRate), decimalPlaces.value) || 0;
      }

      // 不含税
      if (item.taxFlag == "0") {
          item.cardPrice = item.orderPrice;
      }
    }
    if (createForm.value.taxFlagName === "非应税" || createForm.value.taxFlagCode === "02") {
      // 含税
      if (item.taxFlag === "1") {
        item.cardPrice = item.orderPrice;
      }
      // 不含税
      if (item.taxFlag === "0") {
        item.cardPrice = _formatDecimal(item.orderPrice * (1 + item.taxRate), decimalPlaces.value) || 0;
      }
    }

    if (!!item.productionDate && !!item.validityPeriod && !!item.validityPeriodUnit) {
      item.expirationDate = computedExpirationDate(item.productionDate, item.validityPeriod, item.validityPeriodUnit);
    }
  }

  tableData.value = [...arr];
  _tableData.value = [...arr];

  createForm.value.refBillCode = data.spdCode;
  // createForm.value.orderDate = data.makeDate;
  createForm.value.refBillMid = data.pdmId;
  
  createForm.value.buyTypeCode = buyTypesData.value.find(item => item.value === arr[0].purcType) || {};

  // 是否配件中心订单
  // const z_flag1 = createForm.value.ibSource === "0";
  // const z_flag2 = tableData.value.every(item => item.zycType !== "");

  // if(z_flag1 && z_flag2) {
  //   createForm.value.inOutFlag = "1";
  // }

  if (!!data.suName && !!!createForm.value.supUnitCode) {
    createForm.value.supUnitName = data.suName;
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
  }

  if (!!data.suName && !!createForm.value.supUnitCode && createForm.value.supUnitName !== data.suName) {
    createForm.value.supUnitName = data.suName;
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
  }
}

const paNumInput = (val, data, row) => {
  if (createForm.value.ibSource === "0" &&  (val > data.arrivalNum)) {
    ElMessage.error(`大于可入库数量${data.arrivalNum}！`);
    // return;
  }
  if (createForm.value.ibSource === "2" && (val > data.outsaleNum - data.outQuantity)) {
    ElMessage.error(`大于可入库数量${data.outsaleNum - data.outQuantity}！`);
  }
  if (!!row.stkAmount && !!val && row.stkAmount !== "0" && !!val !== "0") {
      // data.stkPrice = _formatDecimal(data.stkAmount / val, 2);
      row.stkPrice = detailPriceformat(data.stkAmount / val) || 0;

  } else {
    row.stkPrice = 0;
  }

  if (createForm.value.ibSource !== "0" && createForm.value.ibSource !== "2") {
    row.cardPrice = _formatDecimal(row.stkAmount / val, decimalPlaces.value) || 0;
  }
};


const stkAmountInput = (val, data, row) => {
  if (!!val && !!row.paNum && val !== "0" && row.paNum !== "0") {
    // data.stkPrice = _formatDecimal(val / data.paNum, 2);
    row.stkPrice = detailPriceformat(val / data.paNum) || 0;
    
  } else {
    row.stkPrice = 0;
  }

  if (createForm.value.ibSource !== "0" && createForm.value.ibSource !== "2") {
    row.cardPrice = _formatDecimal(val / row.paNum, decimalPlaces.value) || 0;
  }
}

const getStandardAmount = (data = {}) => {
  if (!!data.paNum && !!data.cardPrice && data.paNum !== "0" && data.cardPrice !== "0") {
    const res = data.paNum * data.cardPrice;
    // return res;
    return detailPriceformat(res)?.toFixed(2) || '0.00';
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

        await getWhOptions();
        const res3 = whOptions.value.find(item => item.value.whCode === res.data.depotCode);
        if (createForm.value.ibSource === "0" && res2.value.id && res.data.depotCode) {
          setTimeout(() => {
            createForm.value.whId = {
              whCode: res.data.depotCode,
              whName: res.data.depotName,
              id: res3?.value?.id || "",
            }
          });
        }
      }
    }
  } catch (error) {
  }
  watchPlantFlag.value = true;
}

const createDialogOpen = async () => {
  // _loading2.value = true;
  try {
    createForm.value.ibSource = props.ibSource;
    
    getInBoundCode();
    await getPlantOptions();
    getInboundLatestDetail();
    getDecimalPlaces();
    getStockAttrs();
    getStkPriceRange();
    getPurTypes();
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

const cTableKey = computed(() => {
  if (createForm.value.ibSource === "0") {
    return "acId";
  } else if (createForm.value.ibSource === "2") {
    return "dtId";
  } else {
    return "matlCode";
  }
})

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
        createForm.value.buyTypeCode = "";
        createForm.value.buyTypeName = "";
        createForm.value.supUnitCode = "";
        createForm.value.supUnitName = "";
        createForm.value.supUnitType = "";
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

const clickLink = async (prop, row) => {
  if (prop === "accPic") {
    currentData.value = {...row}
    pictureListVisible.value = true;
  }

  if (prop === "contractPic") {
    currentData.value = {...row}
    pictureCarouselVisible.value = true;
  }
}

const pictureListDialogClose = () => {
  currentData.value = {};
  pictureListVisible.value = false;
}

const pictureCarouselClose = () => {
  currentData.value = {};
  pictureCarouselVisible.value = false;
}

const editSave = ({editedData, row, rowId}) => {
  const res = tableData.value.find(item => item[cTableKey.value] === rowId);

  res.paNum = row.paNum = detailPriceformat2(row.paNum, "4");
  res.stkAmount = row.stkAmount = detailPriceformat2(row.stkAmount);
  res.stkPrice = row.stkPrice;
  res.cardPrice = row.cardPrice;

  res.credCode = row.credCode;
  res.productionDate = row.productionDate;
  res.validityPeriod = row.validityPeriod;
  res.validityPeriodUnit = row.validityPeriodUnit;
  res.expirationDate = row.expirationDate;

}

const editCancel = ({row, rowId}) => {
  const res = tableData.value.find(item => item[cTableKey.value] === rowId);
  row.paNum = res.paNum;
  row.stkAmount = res.stkAmount;
  row.credCode = res.credCode;
  row.productionDate = res.productionDate;
  row.validityPeriod = res.validityPeriod;
  row.validityPeriodUnit = res.validityPeriodUnit;
  row.expirationDate = res.expirationDate;
}

const cellChange = ({editedData, row, rowId}) => {
  const res = tableData.value.find(item => item[cTableKey.value] === rowId);

  if (Object.hasOwn(editedData, "paNum")) {
    paNumInput(editedData.paNum, res, row);
  }

  if (Object.hasOwn(editedData, "stkAmount")) {
    stkAmountInput(editedData.stkAmount, res, row);
  }

  if (Object.hasOwn(editedData, "productionDate")) {
    if (!!row.validityPeriod && !!row.validityPeriodUnit && !!row.productionDate) {
      row.expirationDate = computedExpirationDate(row.productionDate, row.validityPeriod, row.validityPeriodUnit);
    }
    if (!!!row.productionDate) {
      row.expirationDate = null;
    }
  }

  if (Object.hasOwn(editedData, "validityPeriod")) {
    if (!!row.validityPeriod && !!row.validityPeriodUnit && !!row.productionDate) {
      row.expirationDate = computedExpirationDate(row.productionDate, row.validityPeriod, row.validityPeriodUnit);
    }
  }

  if (Object.hasOwn(editedData, "validityPeriodUnit")) {
    if (!!row.validityPeriod && !!row.validityPeriodUnit && !!row.productionDate) {
      row.expirationDate = computedExpirationDate(row.productionDate, row.validityPeriod, row.validityPeriodUnit);
    }
  }
}

const handleTableAction = ({code, row}) => {
  if (code === "deleteRow") {
    const idx = tableData.value.findIndex(item => item[cTableKey.value] === row[cTableKey.value]);
    if (idx !== -1) {
      tableData.value.splice(idx, 1);
      ElMessage.success("删除成功");
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

<style lang="scss">
/* 入库单明细表头必填列红色 * 标识（仅表头 th，排除表体 td） */
th.required-col-header .cell::after {
  content: ' *';
  color: #f56c6c;
}
</style>