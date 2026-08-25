<template>
  <ep-dialog
    class="ep-dialog-list"
    :title="title"
    iconTitle="form"
    v-model="visible"
    width="90%"
    top="5vh"
    append-to-body
  >
    <div class="sso-front-table-container app-container" style="margin: 0">
      <el-form :model="formData" :rules="rules" ref="elForm" label-width="90px">
        <div class="form-left flex1">
          <el-row>
            <el-col :span="6">
              <el-form-item prop="ibBillCode" label="入库单号：">
                <el-input
                  v-if="isFormShow"
                  v-model="formData.ibBillCode"
                  placeholder="自动生成"
                  disabled
                  style="width: 100%"
                />
                <span v-else>{{ formData.ibBillCode }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="plantCode" label="用料地区：">
                <el-select
                  v-if="isFormShow"
                  v-model="formData.plantCode"
                  placeholder="请选择"
                  clearable
                  @change="plantChange"
                  :disabled="dialogType === 'modify'"
                >
                  <el-option
                    v-for="dict in plantLists"
                    :key="dict.plantCode"
                    :label="`${dict.plantName}`"
                    :value="dict.plantCode"
                  />
                </el-select>
                <span v-else>{{ `${formData.plantName}` }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="depotCode" label="仓库：">
                <el-select
                  v-if="isFormShow"
                  v-model="formData.depotCode"
                  placeholder="请选择"
                  clearable
                  @change="depotChange"
                  :disabled="dialogType === 'modify'"
                >
                  <el-option
                    v-for="dict in warehouseLists"
                    :key="dict.whCode"
                    :label="`${dict.whName}`"
                    :value="dict.whCode"
                  />
                </el-select>
                <span v-else>{{ `${formData.depotName}` }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="partitionCode" label="仓库分区：">
                <el-select
                  v-if="isFormShow"
                  v-model="formData.partitionCode"
                  placeholder="请选择"
                  clearable
                  @change="handlepartition"
                  :disabled="dialogType === 'modify'"
                >
                  <el-option
                    v-for="dict in partitionLists"
                    :key="dict.partitionCode"
                    :label="`${dict.partitionName}`"
                    :value="dict.partitionCode"
                  />
                </el-select>
                <span v-else>{{ `${formData.partitionName ?? ""}` }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="供货单位：" prop="supUnitName">
                <el-input
                  v-if="isFormShow"
                  v-model.trim="formData.supUnitCode"
                  placeholder="编号"
                  style="flex: 1"
                  readonly
                />&nbsp;&nbsp;
                <el-input
                  v-if="isFormShow"
                  v-model.trim="formData.supUnitName"
                  placeholder="名称"
                  readonly
                  style="flex: 2"
                >
                  <template #append>
                    <el-button
                      class="ep-input-button-icon"
                      icon="Search"
                      @click="handleSupUnit"
                      :disabled="dialogType === 'modify'"
                    ></el-button>
                  </template>
                </el-input>
                <div v-else>
                  <span
                    >{{ formData.supUnitCode }}&nbsp;&nbsp;{{
                      formData.supUnitName
                    }}</span
                  >
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="引用单据：" prop="refBillCode">
                <el-input
                  v-if="isFormShow"
                  v-model.trim="formData.refBillCode"
                  placeholder="请选择"
                  readonly
                >
                  <template #append>
                    <el-button
                      class="ep-input-button-icon"
                      icon="Search"
                      @click="handleRequisitionFrom('1')"
                      :disabled="isSupplier"
                    ></el-button>
                  </template>
                </el-input>
                <div v-else>
                  <span>{{ formData.refBillCode }}</span>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="invoiceCode" label="发票号：">
                <el-input
                  v-if="isFormShow"
                  v-model="formData.invoiceCode"
                  placeholder="请输入"
                />
                <span v-else>{{ formData.invoiceCode }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="freightAmount" label="运费：">
                <el-input
                  v-if="isFormShow"
                  v-model="formData.freightAmount"
                  v-number-input.float="2"
                  clearable
                  placeholder="请输入"
                />
                <span v-else>{{ formData.freightAmount }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="extrasAmount" label="杂费：">
                <el-input
                  v-if="isFormShow"
                  v-model="formData.extrasAmount"
                  v-number-input.float="2"
                  clearable
                  placeholder="请选择"
                >
                </el-input>
                <span v-else>{{ formData.extrasAmount }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="otherAmount" label="其他费：">
                <el-input
                  v-if="isFormShow"
                  v-model="formData.otherAmount"
                  v-number-input.float="2"
                  clearable
                  placeholder="请输入"
                />
                <span v-else>{{ formData.otherAmount }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="incotaxAmount" label="税额：">
                <el-input
                  v-if="isFormShow"
                  v-model="formData.incotaxAmount"
                  v-number-input.float="2"
                  clearable
                  placeholder="请输入"
                />
                <span v-else>{{ formData.incotaxAmount }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="matlAmount" label="料款：">
                <el-input
                  v-if="isFormShow"
                  v-model="formData.matlAmount"
                  placeholder="请输入"
                  disabled
                />
                <span v-else>{{ formData.matlAmount }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="taxMatlAmount" label="税额+料款：">
                <el-input
                  v-if="isFormShow"
                  v-model="formData.taxMatlAmount"
                  placeholder=""
                  disabled
                />
                <span v-else>{{ formData.taxMatlAmount }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="totalAmount" label="总金额：">
                <el-input
                  v-if="isFormShow"
                  v-model="formData.totalAmount"
                  placeholder=""
                  disabled
                />
                <span v-else>{{ formData.totalAmount }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item prop="comments" label="备注：">
                <el-input
                  v-if="isFormShow"
                  v-model.trim="formData.comments"
                  style="width: 99%"
                  :maxlength="500"
                  type="textarea"
                  :rows="2"
                  placeholder="请输入"
                  :disabled="false"
                />
                <span v-else>{{ formData.comments }}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
      <el-divider style="margin-bottom: 10px; margin-top: 0px"></el-divider>
      <el-button
        v-if="dialogType === 'create' && isSupplier"
        @click="openSelectDialog('2')"
        type="primary"
        class="addMaterial_s"
        >添加明细</el-button
      >
      <button-top
        :buttonJson="dialogType === 'create' ? matlTableButtonJson : []"
        @handleButton="handleButtonClick"
        v-if="dialogType != 'details'"
      >
      </button-top>
      <!-- 表格数据 -->
      <table-index
        class="table-index"
        :selectionShow="dialogType === 'report' ? true : false"
        :tableButtonJson="dialogType === 'create' ? matlTableButtonJson : []"
        :tableJson="dialogType === 'report' ? rmstorRedReversalTableJson : matlTableJson"
        :tableData="tableData"
        :idName="idName"
        @handleButtonClick="handleButtonClick"
        @handleSelectionChange="handleSelectionChange"
      >
        <template #paNum="{ scope }">
          <el-input
            v-if="dialogType != 'details'"
            v-model="scope.row.paNum"
            v-number-input.float="2"
            clearable
            @input="(val) => paNumChange(val, scope.row)"
          />
          <span v-else>{{ scope.row.paNum }}</span>
        </template>
        <template #stkPrice="{ name, scope }">
          <el-input
            v-if="dialogType != 'details'"
            v-model="scope.row.stkPrice"
            @input="(val) => stkPriceChange(val, scope.row)"
            type="number"
          ></el-input>
          <span v-else>{{ scope.row.stkPrice }}</span>
        </template>
        <template #stkAmount="{ scope }">
          <el-input
            v-if="dialogType != 'details'"
            v-model="scope.row.stkAmount"
            v-number-input.float="2"
            clearable
            @input="(val) => stkAmountChange(val, scope.row)"
          />
          <span v-else>{{ scope.row.stkAmount }}</span>
        </template>
        <template #credCode="{ scope }">
          <el-input
            v-if="dialogType != 'details'"
            v-model="scope.row.credCode"
            clearable
          />
          <span v-else>{{ scope.row.credCode }}</span>
        </template>
        <template #standardAmount="{ name, scope }">
          {{ scope.row.standardAmount }}
        </template>
        <template #cardPrice="{ name, scope }">
          {{ scope.row.cardPrice }}
        </template>
      </table-index>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="visible = false" class="cancel-btn"
          ><svg-icon icon-class="cancel" />&nbsp;关闭</el-button
        >
        <el-button
          v-if="dialogType === 'create' || dialogType === 'modify'"
          type="primary"
          class="determine-btn"
          @click="saveBtn"
          ><svg-icon icon-class="determine" />&nbsp;保存</el-button
        >
        <el-button
          v-if="dialogType === 'report'"
          type="primary"
          class="determine-btn"
          @click="redStamp"
          ><svg-icon icon-class="determine" />&nbsp;红冲</el-button
        >
      </div>
    </template>
  </ep-dialog>
  <rlu-dialog ref="rluDialog" @selectChange="rluSelectChange" />
  <requisitionForm
    v-model="pubmedVisible"
    :inBoundFormData="inBoundFormData"
    @selectData="selectData"
  />
  <CheckMaterial
    title="物资选择"
    :key="addMatlKey"
    :visible="addMatlVisible"
    :already-table-data="_tableData"
    @dialog-close="addMatlDialogClose"
    @return-matl-data="returnMatlData"
  />
</template>
<script setup>
import {
  inboundUpdate,
  rmstorInternalListdetail,
  createInbound,
  rmstorwriteBack,
  plantDictList,
  warehouseDict,
  warehouseplantDictList,
  createInBoundCode,
  getPublishList,
} from "@/api/diesel-inbound/dieselEntryGroup.js";
import {
  matlTableJson,
  rmstorRedReversalTableJson,
  matlTableButtonJson,
} from "../tableJson";
import RluDialog from "./rluDialog";
import requisitionForm from "./requisitionForm.vue";
import CheckMaterial from "./checkMaterial.vue";
const { proxy } = getCurrentInstance();
import { getCookie } from "@/utils/auth";
const warehouseGetYear =
  getCookie("warehouseGetYear") && JSON.parse(getCookie("warehouseGetYear"));

const idName = ref("ibdtId");
const ids = ref([]);
const selectionData = ref([]);
const single = ref(true);
const multiple = ref(true);

// 接收参数并指定类型（可选）
const props = defineProps({});
const title = ref("");
const visible = ref(false);
const dialogType = ref("create");
const addMatlKey = ref(1);
const tableData = ref([]);
const formData = ref({});
const data = reactive({
  rules: {
    plantCode: [{ required: true, message: "请选择地区", trigger: ["blur", "change"] }],
    depotCode: [{ required: true, message: "请选择仓库", trigger: ["blur", "change"] }],
    partitionCode: [
      { required: true, message: "请选择仓库分区", trigger: ["blur", "change"] },
    ],
    supUnitName: [
      { required: true, message: "请选择供货单位", trigger: ["blur", "change"] },
    ],
    freightAmount: [
      { required: true, message: "请输入运费", trigger: ["blur", "change"] },
    ],
    extrasAmount: [
      { required: true, message: "请输入杂费", trigger: ["blur", "change"] },
    ],
    otherAmount: [
      { required: true, message: "请输入其他费", trigger: ["blur", "change"] },
    ],
    incotaxAmount: [
      { required: true, message: "请输入税额", trigger: ["blur", "change"] },
    ],
    matlAmount: [{ required: true, message: "请输入料款", trigger: ["blur", "change"] }],
  },
});

const isSupplierDetail = ref(false);
const { rules } = toRefs(data);
const emit = defineEmits(["createSuccess"]);
//详情
const getRmstorInternalGetMatls = (id) => {
  proxy.$modal.loading();
  rmstorInternalListdetail(id)
    .then(({ data }) => {
      formData.value = data;
      tableData.value = data.inBoundDts || [];

      if (formData.value.refBillCode !== "") {
        isSupplierDetail.value = true;
      } else {
        isSupplierDetail.value = false;
      }
    })
    .finally(() => {
      proxy.$modal.closeLoading();
    });
};
//表单显示
const isFormShow = ref(false);

// 显示弹框
function show(type = "create", row = {}) {
  getBlishList();
  visible.value = true;
  dialogType.value = type;
  tableData.value = [];
  formData.value.supUnitCode = "";
  proxy.$nextTick(async () => {
    proxy.$refs.elForm && proxy.$refs.elForm.resetFields();
    await plantList();
    if (type === "create") {
      title.value = "新增柴油入库单信息";
      getcreateInBoundCode();
      isFormShow.value = true;
      isSupplier.value = false;
    } else if (type === "modify") {
      title.value = "修改柴油入库单信息";
      isFormShow.value = true;
      isSupplier.value = true;
      getRmstorInternalGetMatls(row.ibmtId);
      const plantId = plantLists.value.find((a) => a.plantCode === row.plantCode)?.id;
      await warehouseList(plantId);
      const partitionId = plantLists.value.find((a) => a.whCode === row.partitionCode)
        ?.id;
      await getwarehouseplantDictList(partitionId);
    } else if (type === "report") {
      title.value = "红冲入库单详情";
      isFormShow.value = false;
      getRmstorInternalGetMatls(row.ibmtId);
    } else if (type === "details") {
      title.value = "入库单详情";
      isFormShow.value = false;
      getRmstorInternalGetMatls(row.ibmtId);
    }
  });
}
const getcreateInBoundCode = async () => {
  const { data } = await createInBoundCode({
    name: "入库单",
    receiptDate: warehouseGetYear?.yearMonth,
  });
  formData.value.ibBillCode = data;
};
const inBoundFormData = ref({});
const pubmedVisible = ref(false);
const codeSymbal = ref("");
const _tableData = ref([]);
const handleRequisitionFrom = (val) => {
  codeSymbal.value = val;
  // if (!formData.value.supUnitCode) {
  //   proxy.$modal.msgWarning("请先选择供货单位");
  //   return;
  // }
  pubmedVisible.value = true;
  inBoundFormData.value = Object.assign({}, { unitCode: formData.value.supUnitCode });
};
const handleButtonClick = (code, data) => {
  const eventObj = {
    // 删除
    delete: () => {
      tableData.value.splice(data.$index, 1);
    },
  };
  eventObj[code] && eventObj[code]();
};

// 选择物资按钮逻辑
const addMatlVisible = ref(false);
const openSelectDialog = (val) => {
  codeSymbal.value = val;
  addMatlVisible.value = true;
};

const addMatlDialogClose = () => {
  addMatlVisible.value = false;
  addMatlKey.value++;
};

// 获取库存单价
const blishList = ref([]);
const getBlishList = async (val) => {
  await getPublishList().then((data) => {
    blishList.value = data.data || [];
  });
};

const returnMatlData = (data = []) => {
  for (const item of data) {
    item.stkPrice = detailPriceformat(item.stkPrice);
    item.paNum = detailPriceformat(item.paNum);
    item._stkPrice = item.stkPrice;
    item.cardPrice = detailPriceformat(item.cardPrice);
    item.orderPrice = detailPriceformat(item.orderPrice);

    if (
      !!item.stkPrice &&
      !!item.paNum &&
      !isNaN(Number(item.stkPrice)) &&
      !isNaN(Number(item.paNum))
    ) {
      item.stkAmount = detailPriceformat(item.stkPrice * item.paNum);
    }
  }

  tableData.value = [...data];
  tableData.value.forEach((item) => {
    item.stkPrice = getMatchPrice(item, blishList.value);
  });

  _tableData.value = [...data];
};

const getMatchPrice = (rowItem, priceList) => {
  const match = priceList.find((priceInfo) => {
    return rowItem.matlType?.includes(priceInfo.specification);
  });
  return match?.price || 0;
};

const saveBtn = () => {
  proxy.$refs.elForm.validate((valid) => {
    if (valid) {
      if (!tableData.value.length) {
        proxy.$modal.msgWarning(`请先输入调拨单明细内容！`);
        return;
      }
      if (isSupplier.value && !isSupplierDetail.value) {
        let isTsNum = false;
        for (let i = 0; i < tableData.value.length; i++) {
          if (!tableData.value[i].paNum || tableData.value[i].paNum == "0") {
            isTsNum = true;
            proxy.$modal.msgWarning(`请先输入第${i + 1}行明细的"入库数量"！`);
            break;
          }
          if (!tableData.value[i].stkAmount || tableData.value[i].stkAmount == "0") {
            isTsNum = true;
            proxy.$modal.msgWarning(`请先输入第${i + 1}行明细的"采购金额"！`);
            break;
          }
        }
        if (isTsNum) {
          return;
        }
      }

      //校验
      proxy.$modal.loading();
      if (dialogType.value === "create") {
        handleAdd();
      } else {
        handleEdit();
      }
    }
  });
};
const handleAdd = () => {
  let params = {
    ...formData.value,
    idmtId: formData.value.ibmtId,
    inBoundDts: tableData.value,
    ibSource: "3",
    otherTypeCode: null,
    allotFlag: null,
    otherTypeCode: null,
  };
  createInbound(params)
    .then(({ message }) => {
      proxy.$modal.msgSuccess(message);
      visible.value = false;
      emit("createSuccess");
    })
    .finally(() => {
      proxy.$modal.closeLoading();
    });
};
const handleEdit = () => {
  let params = {
    ...formData.value,
    idmtId: formData.value.ibmtId,
    inBoundDts: tableData.value,
  };
  inboundUpdate(params)
    .then(({ message }) => {
      proxy.$modal.msgSuccess(message);
      visible.value = false;
      emit("createSuccess");
    })
    .finally(() => {
      proxy.$modal.closeLoading();
    });
};
const redStamp = async () => {
  let params = {
    ibmtId: formData.value.ibmtId,
    ibdtIds: selectionData.value?.map((item) => item.ibdtId),
  };
  const { message } = await rmstorwriteBack(params);
  proxy.$modal.msgSuccess(message);
  visible.value = false;
  emit("createSuccess");
};
/** 多选框选中数据 */
function handleSelectionChange(selection) {
  selectionData.value = selection;
  ids.value = selection.map((item) => item[idName.value]);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

const selectData = (code, row) => {
  if (codeSymbal.value === "1") {
    formData.value.refBillCode = code[0].outsaleCode;
    formData.value.supUnitCode = code[0].unitCode;
    formData.value.supUnitName = code[0].unitName;
  } else {
    formData.value.refBillCode = "";
  }
  tableData.value = row?.map((item) => {
    return {
      ...item,
      cardPrice: Number(item.cardPrice.toFixed(2)),
    };
  });
};
const plantLists = ref([]);
// 获取地区列表
const plantList = async () => {
  const { data } = await plantDictList({
    inSource: "3",
  });
  plantLists.value = data || [];
};
const warehouseLists = ref([]);
// 获取仓库列表
const warehouseList = async (val) => {
  const { data } = await warehouseDict({ plantId: val, inSource: "3" });
  warehouseLists.value = data || [];
};
const partitionLists = ref([]);
//仓库分区
const getwarehouseplantDictList = async (val) => {
  const { data } = await warehouseplantDictList({ whId: val, inSource: "3" });
  partitionLists.value = data || [];
};
const plantChange = (val) => {
  formData.value.depotCode = "";
  formData.value.partitionCode = "";
  partitionLists.value = [];
  let plantArr = plantLists.value.filter((item) => {
    return item.plantCode === val;
  });
  formData.value.plantCode = val;
  formData.value.plantName = plantArr[0]?.plantName;
  warehouseList(plantArr.length > 0 ? plantArr[0].id : "xx");
};
const depotChange = (val) => {
  formData.value.partitionCode = "";
  let plantArr = warehouseLists.value.filter((item) => {
    return item.whCode === val;
  });
  formData.value.depotCode = val;
  formData.value.depotName = plantArr[0]?.whName;
  getwarehouseplantDictList(plantArr.length > 0 ? plantArr[0].id : "xx");
};
const handlepartition = (val) => {
  let plantArr = partitionLists.value.filter((item) => {
    return item.partitionCode === val;
  });
  if (dialogType.value === "create") {
    formData.value.partitionCode = val;
    formData.value.partitionName = plantArr[0]?.partitionName;
  }
  //应税用途
  formData.value.taxFlagName = plantArr[0]?.taxFlagName;
  formData.value.taxFlagCode = plantArr[0]?.taxFlagCode;
};
const handleSupUnit = () => {
  // formData.value.refBillCode = "";
  proxy.$refs.rluDialog.show();
};

const detailPriceformat = (val, decimal = "2") => {
  if (checkDecimalPlaces(val) > 2) {
    return _formatDecimal(val, decimal);
  } else {
    return val;
  }
};

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
  return parts[1].replace(/0+$/, "").length;
};

const _formatDecimal = (value, decimals) => {
  const value2 = Number(value);
  if (typeof value2 !== "number" || isNaN(value2) || !isFinite(value2)) {
    return value?.toString() ?? "";
  }

  const factor = Math.pow(10, decimals);
  return String(value).trim() === ""
    ? ""
    : Math.round((Number(value) + Number.EPSILON) * factor) / factor;
};

const isSupplier = ref(false);
const rluSelectChange = (data) => {
  // tableData.value = [];
  switch (data[0].type) {
    case "局内单位":
      formData.value.supUnitType = "1";
      isSupplier.value = false;
      break;
    case "路外单位":
      formData.value.supUnitType = "2";
      isSupplier.value = false;
      break;
    case "供应商":
      formData.value.supUnitType = "3";
      isSupplier.value = true;
      break;
    default:
      return null;
  }
  formData.value.supUnitCode = data[0].unitCode;
  formData.value.supUnitName = data[0].unitName;
};

watchEffect(() => {
  //税额+料款
  const newTaxMatlAmount =
    Number(formData.value.incotaxAmount || 0) + Number(formData.value.matlAmount || 0);
  formData.value.taxMatlAmount = Number(newTaxMatlAmount.toFixed(2));

  //总金额
  const newTotalAmount =
    Number(formData.value.freightAmount || 0) +
    Number(formData.value.extrasAmount || 0) +
    Number(formData.value.otherAmount || 0) +
    Number(formData.value.incotaxAmount || 0) +
    Number(formData.value.matlAmount || 0);
  formData.value.totalAmount = Number(newTotalAmount.toFixed(2));

  //料款
  if (tableData.value.length > 0) {
    const newMatlAmount = Number(
      tableData.value?.reduce((sum, item) => sum + Number(item.stkAmount || 0), 0)
    );
    formData.value.matlAmount = Number(newMatlAmount.toFixed(2));
  } else {
    formData.value.matlAmount = null;
  }
});

const paNumChange = (val, data) => {
  if (!!data.stkPrice && !!val) {
    data.stkAmount = detailPriceformat(data.stkPrice * val);
  } else if (!!data.stkAmount && !!val) {
    data.stkPrice = detailPriceformat(data.stkAmount / val);
  }
  data.cardPrice = data.stkPrice;
  console.log(data, "12121212");

  const res = data.paNum * data.cardPrice;
  data.standardAmount = detailPriceformat(res) || 0;
};
const stkAmountChange = (val, data) => {
  if (!!val && !!data.paNum) {
    data.stkPrice = detailPriceformat(val / data.paNum);
  }
  data.cardPrice = data.stkPrice;
  console.log(data.cardPrice, "23232323232");

  const res = data.paNum * data.cardPrice;
  data.standardAmount = detailPriceformat(res) || 0;
};

const stkPriceChange = (val, data) => {
  if (!!val && !!data.paNum) {
    data.stkAmount = detailPriceformat(val * data.paNum);
  }
  data.cardPrice = data.stkPrice;
  console.log(data.cardPrice, "4545454545");
  const res = data.paNum * data.cardPrice;
  data.standardAmount = detailPriceformat(res) || 0;
};

defineExpose({
  show,
});
</script>
<style lang="scss" scoped>
.ep-dialog-list {
  display: flex;
  flex-direction: column;
  height: 80vh;
  .sso-front-table-container {
    max-height: 78vh;
    overflow-y: auto !important;
    box-sizing: border-box;
    .form-left {
      .ep-select,
      :deep(.ep-input) {
        width: 100% !important;
      }
    }
  }
}

.table-index {
  min-height: 200px;
}

.addMaterial_s {
  padding: 8px 15px;
  width: 80px;
  height: 32px;
}
</style>
