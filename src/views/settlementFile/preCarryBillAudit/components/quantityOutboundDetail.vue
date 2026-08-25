<template>
  <ep-dialog
    class="ep-dialog-list"
    :title="
      dialogType == 'create'
        ? '数量管理出库单新增'
        : dialogType == 'modify'
        ? '数量管理出库单修改'
        : '数量管理出库单详情'
    "
    iconTitle="form"
    v-model="visible"
    width="90vw"
    top="5vh"
    append-to-body
  >
    <div class="sso-front-table-container app-container">
      <el-form
        class="form-wrapper"
        :model="formData"
        :rules="rules"
        ref="elForm"
        label-width="110px"
      >
        <div class="form-left flex1">
          <el-row>
            <el-col :span="6">
              <el-form-item prop="obBillCode" label="出库单号：">
                <el-input
                  v-if="dialogType != 'details'"
                  v-model="formData.obBillCode"
                  placeholder="自动生成"
                  disabled
                />
                <span v-else>{{ formData.obBillCode }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="deptName" label="领料车间：">
                <el-input
                  v-if="dialogType != 'details'"
                  v-model="formData.deptName"
                  placeholder="选择班组后带出车间"
                  disabled
                />
                <span v-else>{{ formData.deptName }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="teamName" label="领料班组：" :required="isRequired()">
                <el-input
                  v-if="dialogType != 'details'"
                  v-model.trim="formData.teamName"
                  placeholder="请选择领料班组"
                  readonly
                >
                  <template #append>
                    <el-button
                      class="ep-input-button-icon"
                      icon="Search"
                      @click="handleTeam"
                    ></el-button>
                  </template>
                </el-input>
                <span v-else>{{ formData.teamName }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="plantCode" label="用料地区：" :required="isRequired()">
                <el-select
                  v-if="dialogType != 'details'"
                  :disabled="dialogType == 'modify'"
                  v-model="formData.plantCode"
                  placeholder="请选择用料地区"
                  clearable
                  @change="plantChange"
                >
                  <el-option
                    v-for="item in plantDictData"
                    :key="item.plantCode"
                    :label="`${item.plantName}`"
                    :value="item.plantCode"
                  >
                  </el-option>
                </el-select>
                <span v-else>{{ `${formData.plantName}` }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item prop="depotCode" label="仓库：" :required="isRequired()">
                <el-select
                  v-if="dialogType != 'details'"
                  :disabled="dialogType == 'modify'"
                  v-model="formData.depotCode"
                  placeholder="请选择仓库"
                  clearable
                  @change="whCodeChange"
                >
                  <el-option
                    v-for="item in warehouseDictListprePlantCode"
                    :key="item.whCode"
                    :label="`${item.whName}`"
                    :value="item.whCode"
                  >
                  </el-option>
                </el-select>
                <span v-else>{{ `${formData.depotName}` }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                prop="partitionCode"
                label="仓库分区："
                :required="isRequired()"
              >
                <el-select
                  v-if="dialogType != 'details'"
                  :disabled="dialogType == 'modify'"
                  v-model="formData.partitionCode"
                  placeholder="请选择仓库分区"
                  clearable
                  @change="partitionChange"
                >
                  <el-option
                    v-for="item in warehouseDictListPartitionCode"
                    :key="item.partitionCode"
                    :label="`${item.partitionName}`"
                    :value="item.partitionCode"
                  >
                  </el-option>
                </el-select>
                <span v-else>{{ `${formData.partitionName}` }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="comments" label="备注：">
                <el-input
                  v-if="dialogType != 'details'"
                  v-model.trim="formData.comments"
                  placeholder="请输入备注"
                  :disabled="false"
                  style="width: 100%"
                />
                <span v-else>{{ formData.comments }}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
      <button-top
        :buttonJson="matlTableButtonJson"
        @handleButton="handleButtonClick"
        v-if="dialogType != 'details'"
      >
      </button-top>
      <!-- 表格数据 -->
      <table-index
        class="table-index"
        :selectionShow="false"
        :required="isRequired()"
        :tableJson="quantityOutboundMatlTableJson"
        :tableData="tableData"
        @handleButtonClick="handleButtonClick"
      >
        <template #matlType="{ scope }">
          <span>{{
            `${scope.row.matlType}${scope.row.matlRaw ? "/" + scope.row.matlRaw : ""}${
              scope.row.matlpCode ? "/" + scope.row.matlpCode : ""
            }`
          }}</span>
        </template>
        <template #credCode="{ scope }">
          <el-input
            v-if="dialogType != 'details'"
            v-model="scope.row.credCode"
            clearable
          />
          <span v-else>{{ scope.row.credCode }}</span>
        </template>
        <template #outNum="{ scope }">
          <el-input
            v-if="dialogType != 'details'"
            v-model="scope.row.outNum"
            v-number-input.float="4"
            clearable
            @change="numChange(scope)"
          />
          <span v-else>{{ scope.row.outNum }}</span>
        </template>
      </table-index>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="visible = false" class="cancel-btn"
          ><svg-icon icon-class="cancel" />&nbsp;关闭</el-button
        >
        <el-button
          v-if="dialogType != 'details'"
          type="primary"
          class="determine-btn"
          @click="saveBtn"
          ><svg-icon icon-class="determine" />&nbsp;保存</el-button
        >
      </div>
    </template>
  </ep-dialog>
</template>

<script setup>
import { obmtCreateModify, obmtGetDetail } from "@/api/warehouse/obmt";
import { getwarehouseByUserAndPlant } from "@/api/warehouse/warehouseDict";
import { getWarehousePartition } from "@/api/warehouse/partition";
import { matlcardList } from "@/api/warehouse/matlcard";
import { quantityOutboundMatlTableJson } from "../tableJson";

const { proxy } = getCurrentInstance();

// 接收参数并指定类型（可选）
const props = defineProps({
  plantDictData: {
    type: Array,
    default: [],
  },
});

const visible = ref(false);
const dialogType = ref("create");
const tableData = ref([]);

const data = reactive({
  formData: {
    obBillCode: "",
    deptCode: "",
    deptName: "",
    teamCode: "",
    teamName: "",
    plantCode: "",
    plantName: "",
    depotCode: "",
    depotId: "",
    depotName: "",
    partitionCode: "",
    partitionName: "",
    comments: "",
  },
  rules: {
    teamName: [
      { required: true, message: "请选择领料班组", trigger: ["blur", "change"] },
    ],
    plantCode: [
      { required: true, message: "请选择用料地区", trigger: ["blur", "change"] },
    ],
    depotCode: [{ required: true, message: "请选择仓库", trigger: ["blur", "change"] }],
    partitionCode: [
      { required: true, message: "请选择仓库分区", trigger: ["blur", "change"] },
    ],
  },
  warehouseDictListprePlantCode: [],
  warehouseDictListPartitionCode: [],
});

const {
  formData,
  rules,
  warehouseDictListprePlantCode,
  warehouseDictListPartitionCode,
} = toRefs(data);

// 声明触发的事件（可选，增强类型校验）
const emit = defineEmits(["createSuccess"]);

const isRequired = () => {
  return dialogType.value != "details";
};

const getwarehouseByUserAndPlantAll = (plantId) => {
  return new Promise((resolve) => {
    getwarehouseByUserAndPlant({ plantId }).then(({ data }) => {
      warehouseDictListprePlantCode.value = data;
      resolve();
    });
  });
};

const getWarehousePartitionAll = (whId) => {
  return new Promise((resolve) => {
    getWarehousePartition({ whId, stockAttrs: "15" }).then(({ data }) => {
      warehouseDictListPartitionCode.value = data;
      resolve();
    });
  });
};

const getObmtGetDetail = (id) => {
  proxy.$modal.loading();
  obmtGetDetail(id)
    .then(({ data }) => {
      tableData.value = data.dtList || [];
      delete data.dtList;
      formData.value = data;
    })
    .finally(() => {
      proxy.$modal.closeLoading();
    });
};

// 显示弹框
function show(type = "create", row = {}) {
  visible.value = true;
  dialogType.value = type;
  tableData.value = [];
  proxy.$nextTick(async () => {
    proxy.$refs.elForm && proxy.$refs.elForm.resetFields();
    if (type != "create") {
      // 明细详情
      getObmtGetDetail(row.billId);
    }
  });
}
const plantChange = () => {
  formData.value.depotCode = "";
  formData.value.partitionCode = "";
  formData.value.partitionName = "";
  warehouseDictListprePlantCode.value = [];
  warehouseDictListPartitionCode.value = [];
  const plantObj = props.plantDictData.find(
    (item) => item.plantCode === formData.value.plantCode
  );
  formData.value.plantName = plantObj?.plantName;
  if (formData.value.plantCode) {
    getwarehouseByUserAndPlantAll(plantObj?.id);
  }
};

const whCodeChange = () => {
  formData.value.partitionCode = "";
  formData.value.partitionName = "";
  warehouseDictListPartitionCode.value = [];
  const whObj = warehouseDictListprePlantCode.value.find(
    (item) => item.whCode === formData.value.depotCode
  );
  formData.value.depotName = whObj?.whName;
  if (formData.value.depotCode) {
    getWarehousePartitionAll(whObj?.id);
  }
};

const partitionChange = () => {
  const ptWhObj = warehouseDictListPartitionCode.value.find(
    (item) => item.partitionCode === formData.value.partitionCode
  );
  formData.value.partitionName = ptWhObj?.partitionName;
};

const handleTeam = () => {
  proxy.$refs.teamDialog.show();
};

const handleButtonClick = (code, data) => {
  const eventObj = {
    // 选择物资
    choiceMatl: () => {
      let preWhHint = "";
      const { plantCode, depotCode, partitionCode } = formData.value;
      if (!plantCode) {
        // 请选择调出地区！”或“请选择调出仓库！”或“请选择调入地区！”或“请选择调入仓库！
        preWhHint = "请选择地区！";
      } else if (!depotCode) {
        preWhHint = "请选择仓库！";
      } else if (!partitionCode) {
        preWhHint = "请选择仓库分区！";
      }
      if (preWhHint) {
        proxy.$modal.msgWarning(preWhHint);
        return;
      }
      proxy.$refs.rmstorMatlDialog.show({ partitionCode }, tableData.value);
    },
    // 删除
    delete: () => {
      tableData.value.splice(data.$index, 1);
    },
  };
  eventObj[code] && eventObj[code]();
};

const teamSelectChange = (data) => {
  const { deptCode, deptName, pdeptCode, pdeptName } = data[0] || {};
  formData.value.deptCode = pdeptCode;
  formData.value.deptName = pdeptName;
  formData.value.teamCode = deptCode;
  formData.value.teamName = deptName;
};

const handleSelectChange = (data) => {
  tableData.value.push(
    ...data.map((a) => {
      return { ...a, outNum: a.nowNum, price: a.cardPrice };
    })
  );
};

const numChange = (scope) => {
  if (scope.row.outNum > scope.row.nowNum) {
    const num = scope.row.outNum - scope.row.nowNum;
    proxy.$modal.msgWarning(`第${scope.$index + 1}行，数量大于库存数量${num}！`);
    scope.row.outNum = "";
  }
};

const saveBtn = () => {
  proxy.$refs.elForm.validate((valid) => {
    if (valid) {
      if (!tableData.value.length) {
        proxy.$modal.msgWarning(`请选择物资！`);
        return;
      }
      let isTsNum = false;
      for (let i = 0; i < tableData.value.length; i++) {
        if (!tableData.value[i].outNum || tableData.value[i].outNum == "0") {
          isTsNum = true;
          proxy.$modal.msgWarning(`第${i + 1}行，出库数量不能为空或0！`);
          break;
        }
      }
      if (isTsNum) {
        return;
      }
      formData.value = { ...formData.value, details: tableData.value };
      let type = "saveData";
      if (dialogType.value == "modify") {
        type = "updateData";
      }
      proxy.$modal.loading();
      obmtCreateModify(formData.value, type)
        .then(({ message }) => {
          proxy.$modal.msgSuccess(message);
          visible.value = false;
          emit("createSuccess");
        })
        .finally(() => {
          proxy.$modal.closeLoading();
        });
    }
  });
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
          width: 100% !important;
        }
      }
    }
  }
}
</style>
