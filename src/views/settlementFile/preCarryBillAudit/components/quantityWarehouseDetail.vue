<template>
  <ep-dialog
    class="ep-dialog-list"
    :title="
      dialogType == 'create'
        ? '数量管理入库单新增'
        : dialogType == 'modify'
        ? '数量管理入库单修改'
        : '数量管理入库单详情'
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
              <el-form-item prop="ibBillCode" label="入库单号：">
                <el-input
                  v-if="dialogType != 'details'"
                  v-model="formData.ibBillCode"
                  placeholder="自动生成"
                  disabled
                />
                <span v-else>{{ formData.ibBillCode }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="plantCode" label="地区：" :required="isRequired()">
                <el-select
                  v-if="dialogType != 'details'"
                  :disabled="dialogType == 'modify'"
                  v-model="formData.plantCode"
                  placeholder="请选择地区"
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
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item
                label="供货单位："
                prop="supUnitName"
                :required="isRequired()"
              >
                <el-input
                  v-if="dialogType != 'details'"
                  v-model.trim="formData.supUnitCode"
                  placeholder="编号"
                  style="width: 205px !important"
                  readonly
                />&nbsp;&nbsp;
                <el-input
                  v-if="dialogType != 'details'"
                  v-model.trim="formData.supUnitName"
                  placeholder="名称"
                  readonly
                  style="width: 307px !important"
                >
                  <template #append>
                    <el-button
                      class="ep-input-button-icon"
                      icon="Search"
                      @click="handleSupUnit"
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
      <!-- 表格数据 -->
      <table-index
        class="table-index"
        :selectionShow="false"
        :required="isRequired()"
        :tableJson="quantityTableJson"
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
        <template #num="{ scope }">
          <el-input
            v-if="dialogType != 'details'"
            v-model="scope.row.num"
            v-number-input.float="4"
            clearable
          />
          <span v-else>{{ scope.row.num }}</span>
        </template>
        <template #cardPrice="{ scope }">
          <el-input
            v-if="dialogType != 'details'"
            v-model="scope.row.cardPrice"
            v-number-input.float="byCodeObj['25'] || 2"
            clearable
          />
          <span v-else>{{ scope.row.cardPrice }}</span>
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
import { ibmtCreateModify, ibmtGetDetail } from "@/api/warehouse/ibmt";
import { getwarehouseByUserAndPlant } from "@/api/warehouse/warehouseDict";
import { getWarehousePartition } from "@/api/warehouse/partition";
import { noAuthorizeList } from "@/api/system/common";
import { quantityTableJson, rmstorMatlTableJson } from "../tableJson";
import { getSessionStorage } from "@/utils/auth";

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
const byCodeObj = ref(JSON.parse(getSessionStorage("byCodeObj") || "{}")); //权限判断是否显示登卡按钮（1：隐藏）

const data = reactive({
  formData: {
    ibBillCode: "",
    plantCode: "",
    plantName: "",
    depotCode: "",
    depotId: "",
    depotName: "",
    partitionCode: "",
    partitionName: "",
    supUnitCode: "",
    supUnitName: "",
    comments: "",
  },
  rules: {
    plantCode: [{ required: true, message: "请选择地区", trigger: ["blur", "change"] }],
    depotCode: [{ required: true, message: "请选择仓库", trigger: ["blur", "change"] }],
    partitionCode: [
      { required: true, message: "请选择仓库分区", trigger: ["blur", "change"] },
    ],
    supUnitName: [
      { required: true, message: "请选择供货单位", trigger: ["blur", "change"] },
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

const getIbmtGetDetail = (id) => {
  proxy.$modal.loading();
  ibmtGetDetail(id)
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
  formData.value.supUnitCode = "";
  proxy.$nextTick(async () => {
    proxy.$refs.elForm && proxy.$refs.elForm.resetFields();
    if (type != "create") {
      // 明细详情
      getIbmtGetDetail(row.billId);
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

const handleSupUnit = () => {
  proxy.$refs.rluDialog.show();
};

const rluSelectChange = (data) => {
  formData.value.supUnitCode = data[0].unitCode;
  formData.value.supUnitName = data[0].unitName;
};

const handleButtonClick = (code, data) => {
  const eventObj = {
    // 选择物资
    choiceMatl: () => {
      proxy.$refs.rmstorMatlDialog.show({}, tableData.value);
    },
    // 删除
    delete: () => {
      tableData.value.splice(data.$index, 1);
    },
  };
  eventObj[code] && eventObj[code]();
};

const handleSelectChange = (data) => {
  tableData.value.push(...data);
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
        if (!tableData.value[i].num || tableData.value[i].num == "0") {
          isTsNum = true;
          proxy.$modal.msgWarning(`第${i + 1}行，入库数量不能为空或0！`);
          break;
        }
        if (!tableData.value[i].cardPrice || tableData.value[i].cardPrice == "0") {
          isTsNum = true;
          proxy.$modal.msgWarning(`第${i + 1}行，单价不能为空或0！`);
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
      ibmtCreateModify(formData.value, type)
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
