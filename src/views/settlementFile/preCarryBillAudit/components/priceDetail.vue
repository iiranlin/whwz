<template>
  <ep-dialog
    class="ep-dialog-list"
    :title="
      dialogType == 'create'
        ? '调价单新增'
        : dialogType == 'modify'
        ? '调价单修改'
        : '调价单详情'
    "
    iconTitle="form"
    v-model="visible"
    width="1300px"
    top="5vh"
    append-to-body
  >
    <div class="sso-front-table-container app-container">
      <div class="font_s">调价单信息</div>
      <el-form
        class="form-wrapper"
        :model="formData"
        :rules="rules"
        ref="elForm"
        label-width="90px"
      >
        <div class="form-left flex1">
          <el-row>
            <el-col :span="8">
              <el-form-item prop="billCode" label="调价单号：">
                <el-input
                  v-if="dialogType != 'details'"
                  v-model="formData.adjustCode"
                  placeholder="自动生成"
                  disabled
                />
                <span v-else>{{ formData.adjustCode }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="plantCode" label="地区：">
                <el-select
                  v-if="dialogType != 'details'"
                  v-model="formData.plantCode"
                  placeholder="请选择"
                  clearable
                  @change="plantChange"
                  :disabled="isShow"
                >
                  <el-option
                    v-for="dict in plantLists"
                    :key="dict.plantCode"
                    :label="`${dict.plantName}`"
                    :value="dict.plantCode"
                  />
                </el-select>
                <span v-else>{{ `${formData.plantName ?? ""}` }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="depotCode" label="仓库：">
                <el-select
                  v-if="dialogType != 'details'"
                  v-model="formData.depotCode"
                  placeholder="请选择"
                  clearable
                  @change="depotChange"
                  :disabled="isShow"
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
            <el-col :span="8">
              <el-form-item prop="partitionCode" label="仓库分区：">
                <el-select
                  v-if="dialogType != 'details'"
                  v-model="formData.partitionCode"
                  placeholder="请选择"
                  clearable
                  @change="handlepartition"
                  :disabled="isShow"
                >
                  <el-option
                    v-for="dict in partitionLists"
                    :key="dict.partitionCode"
                    :label="`${dict.partitionName}`"
                    :value="dict.partitionCode"
                  />
                </el-select>
                <span v-else>{{ `${formData.partitionName}` }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="taxFlagName" label="应税用途：">
                <el-input
                  v-if="dialogType != 'details'"
                  v-model="formData.taxFlagName"
                  placeholder="请输入"
                  disabled
                />
                <span v-else>{{ formData.taxFlagName }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="approver" label="审批人：">
                <el-input
                  v-if="dialogType != 'details'"
                  v-model="formData.approver"
                  placeholder="请选择"
                >
                  <template #append>
                    <el-button
                      class="ep-input-button-icon"
                      icon="Search"
                      @click="approverClick"
                    ></el-button>
                  </template>
                </el-input>
                <span v-else>{{ formData.approver }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item prop="comments" label="备注：">
                <el-input
                  v-if="dialogType != 'details'"
                  v-model.trim="formData.comments"
                  placeholder="请输入"
                  :disabled="false"
                  style="width: 100%"
                  type="textarea"
                />
                <span v-else>{{ formData.comments }}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
      <div class="font_s" style="margin-bottom: 17px">调价单明细信息</div>
      <button-top @handleButton="handleButtonClick" v-if="dialogType != 'details'">
      </button-top>
      <!-- 表格数据 -->
      <table-index
        class="table-index"
        :selectionShow="false"
        :tableJson="priceMatlTableJson"
        :tableData="tableData"
        @handleButtonClick="handleButtonClick"
      >
        <template #ptPrice="{ scope }">
          <el-input
            v-if="dialogType != 'details'"
            v-model="scope.row.ptPrice"
            v-number-input.float="2"
            clearable
            @input="tsNumChange(scope)"
          />
          <span v-else>{{ scope.row.ptPrice }}</span>
        </template>
      </table-index>
      <div style="margin-left: 10px">合计盈亏总金额：{{ profitAmountSum }}元</div>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="visible = false" class="cancel-btn"
          ><svg-icon icon-class="cancel" />&nbsp;返回</el-button
        >
        <el-button
          v-if="dialogType != 'details'"
          type="primary"
          class="determine-btn"
          @click="saveBtn('0')"
          ><svg-icon icon-class="determine" />&nbsp;保存</el-button
        >
      </div>
    </template>
  </ep-dialog>
</template>

<script setup>
import {
  rmstorInternalListdetail,
  rmstorInternalcreate,
  rmstorInternalmodify,
  plantDictList,
  warehouseDict,
  warehouseplantDictList,
} from "@/api/rmstor/price-adjustment";
import { priceMatlTableJson } from "../tableJson";
import { getCookie } from "@/utils/auth";
const warehouseGetYear =
  getCookie("warehouseGetYear") && JSON.parse(getCookie("warehouseGetYear"));
const { proxy } = getCurrentInstance();

// 接收参数并指定类型（可选）
const props = defineProps({});

const isShow = ref(false);
const visible = ref(false);
const dialogType = ref("create");
const tableData = ref([]);
const formData = ref({});

const data = reactive({
  rules: {
    plantCode: [{ required: true, message: "请选择地区", trigger: ["blur", "change"] }],
    depotCode: [{ required: true, message: "请选择仓库", trigger: ["blur", "change"] }],
    partitionCode: [
      { required: true, message: "请选择仓库分区", trigger: ["blur", "change"] },
    ],
    approver: [{ required: true, message: "请选择审批人", trigger: ["blur", "change"] }],
  },
});

const { rules } = toRefs(data);

// 声明触发的事件（可选，增强类型校验）
const emit = defineEmits(["createSuccess"]);

//详情
const getRmstorInternalGetMatls = (id) => {
  proxy.$modal.loading();
  rmstorInternalListdetail(id)
    .then(({ data }) => {
      formData.value = data;
      tableData.value = data.adjustPriceDtDTOList || [];
      getSum(data.adjustPriceDtDTOList);
      if (dialogType.value === "modify" && data.adjustPriceDtDTOList.length > 0) {
        isShow.value = true;
      } else {
        isShow.value = false;
      }
    })
    .finally(() => {
      proxy.$modal.closeLoading();
    });
};
//合计
const getSum = (arr) => {
  let total = 0;
  arr.forEach((item) => {
    if (item.profitAmount) {
      total += item.profitAmount;
    }
    profitAmountSum.value = Number(total.toFixed(2));
  });
};
// 显示弹框
function show(type = "create", row = {}) {
  visible.value = true;
  dialogType.value = type;
  tableData.value = [];
  isShow.value = false;
  proxy.$nextTick(async () => {
    proxy.$refs.elForm && proxy.$refs.elForm.resetFields();
    await plantList();
    if (type === "create") {
      formData.value.adjustCode = "";
      profitAmountSum.value = 0;
      warehouseLists.value = [];
      partitionLists.value = [];
    } else {
      // formData.value = Object.assign({}, formData.value, row);
      // 明细详情
      getRmstorInternalGetMatls(row.billId);
      if (type === "modify" || type === "details") {
        let plantArr = plantLists.value.filter((item) => {
          return item.plantCode === row.plantCode;
        });
        await warehouseList(plantArr[0]?.id);
        let plantArr2 = warehouseLists.value?.filter((item) => {
          return item.whCode === row.partitionCode;
        });
        await getwarehouseplantDictList(plantArr2[0]?.id);
        handlepartition(row.partitionCode);
      }
    }
  });
}
const handleButtonClick = (code, data) => {
  const eventObj = {
    // 选择物资
    choiceMatl: () => {
      let preWhHint = "";
      if (!formData.value.plantCode) {
        // 请选择调出地区！”或“请选择调出仓库！”或“请选择调入地区！”或“请选择调入仓库！
        preWhHint = "请选择地区！";
      } else if (!formData.value.depotCode) {
        preWhHint = "请选择仓库！";
      } else if (!formData.value.partitionCode) {
        preWhHint = "请选择仓库分区！";
      } else if (!formData.value.approver) {
        preWhHint = "请选择审批人！";
      }
      if (preWhHint) {
        proxy.$modal.msgWarning(preWhHint);
        return;
      }
      proxy.$refs.rmstorMatlDialog.show(
        {
          partitionCode: formData.value.partitionCode,
          depotCode: formData.value.depotCode,
        },
        tableData.value
      );
    },
    // 删除
    delete: () => {
      tableData.value.splice(data.$index, 1);
      if (dialogType.value === "modify" && tableData.value.length === 0) {
        isShow.value = false;
      } else {
        isShow.value = true;
      }
      getSum(tableData.value);
      if (tableData.value.length === 0) {
        profitAmountSum.value = 0;
      }
    },
  };
  eventObj[code] && eventObj[code]();
};
const handleSelectChange = (data) => {
  tableData.value.push(
    ...data.map((a) => {
      return {
        ...a,
        num: a.nowNum,
        prPrice: a.cardPrice,
        nowAmount: a.nowAmount,
      };
    })
  );
  if (dialogType.value === "modify" && tableData.value.length === 0) {
    isShow.value = false;
  } else {
    isShow.value = true;
  }
};
const profitAmountSum = ref("0");
const tsNumChange = (scope) => {
  if (scope.row.ptPrice !== "") {
    let newSum =
      Number(scope.row.nowAmount) - Number(scope.row.num) * Number(scope.row.ptPrice);
    scope.row.profitAmount = Number(newSum.toFixed(2));
  } else {
    scope.row.profitAmount = null;
  }
  getSum(tableData.value);
};
const saveBtn = () => {
  proxy.$refs.elForm.validate((valid) => {
    if (valid) {
      if (!tableData.value.length) {
        proxy.$modal.msgWarning(`请先输入调拨单明细内容！`);
        return;
      }
      let isTsNum = false;
      for (let i = 0; i < tableData.value.length; i++) {
        if (!tableData.value[i].ptPrice || tableData.value[i].ptPrice == "0") {
          isTsNum = true;
          proxy.$modal.msgWarning(`请先输入第${i + 1}行明细的"后库存单价"！`);
          break;
        }
      }
      if (isTsNum) {
        return;
      }
      //校验
      proxy.$modal.loading();
      if (dialogType.value === "create") {
        let params = {
          ...formData.value,
          adjustPriceDtSaveList: tableData.value,
          yearMonth: warehouseGetYear?.yearMonth,
        };
        rmstorInternalcreate(params)
          .then(({ message }) => {
            proxy.$modal.msgSuccess(message);
            visible.value = false;
            emit("createSuccess");
          })
          .finally(() => {
            proxy.$modal.closeLoading();
          });
      } else {
        let params = {
          ...formData.value,
          adjustPriceDtSaveList: tableData.value,
        };
        rmstorInternalmodify(params)
          .then(({ message }) => {
            proxy.$modal.msgSuccess(message);
            visible.value = false;
            emit("createSuccess");
          })
          .finally(() => {
            proxy.$modal.closeLoading();
          });
      }
    }
  });
};

const queryMonth = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  return `${year}${month}`;
};

const plantLists = ref([]);
// 获取地区列表
const plantList = async () => {
  const { data } = await plantDictList();
  plantLists.value = data || [];
};
const warehouseLists = ref([]);
// 获取仓库列表
const warehouseList = async (val) => {
  const { data } = await warehouseDict({ plantId: val });
  warehouseLists.value = data || [];
};
const partitionLists = ref([]);
//仓库分区
const getwarehouseplantDictList = async (val) => {
  const { data } = await warehouseplantDictList({ whId: val });
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
const approverClick = () => {
  proxy.$refs.userDialog.show();
};
const userSelectChange = (data) => {
  formData.value.approver = data[0].userName;
};

defineExpose({
  show,
});
</script>
<style lang="scss" scoped>
.ep-dialog-list {
  .sso-front-table-container {
    .form-wrapper {
      .form-left {
        .ep-select,
        :deep(.ep-input) {
          width: 90% !important;
        }
      }
    }
  }
}

.font_s {
  font-size: 16px;
  color: #333333;
  font-weight: 700;
  font-style: normal;
}
</style>
