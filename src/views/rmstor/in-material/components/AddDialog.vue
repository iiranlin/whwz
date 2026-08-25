<template>
  <ep-dialog
    class="ep-dialog-list"
    :title="
      dialogType == 'create'
        ? '进库料新增'
        : dialogType == 'modify'
        ? '进库料修改'
        : '进库料详情'
    "
    iconTitle="form"
    v-model="visible"
    width="1300px"
    top="5vh"
    append-to-body
  >
    <div class="sso-front-table-container app-container">
      <div class="font_s">进库料信息</div>
      <el-form
        class="form-wrapper"
        :model="formData"
        :rules="rules"
        ref="elForm"
        label-width="120px"
      >
        <div class="form-left flex1">
          <el-row>
            <el-col :span="8">
              <el-form-item label="进库料单号：" prop="imCode">
                <el-input
                  v-if="dialogType != 'details'"
                  v-model.trim="formData.imCode"
                  placeholder="自动生成"
                  :disabled="true"
                />
                <span v-else>{{ formData.imCode }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="地区：" prop="plantName">
                <el-select
                  v-if="dialogType != 'details'"
                  v-model="formData.plantName"
                  placeholder="请选择"
                  clearable
                  @change="plantChange"
                  :disabled="dialogType != 'create'"
                >
                  <el-option
                    v-for="item in plantLists"
                    :key="item.plantCode"
                    :label="`${item.plantName}`"
                    :value="item.plantCode"
                  >
                  </el-option>
                </el-select>
                <span v-else>{{ formData.plantName }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="仓库：" prop="depotName">
                <el-select
                  v-if="dialogType != 'details'"
                  v-model="formData.depotName"
                  placeholder="请选择"
                  clearable
                  @change="depotChange"
                  :disabled="dialogType != 'create'"
                >
                  <el-option
                    v-for="item in warehouseLists"
                    :key="item.whCode"
                    :label="`${item.whName}`"
                    :value="item.whCode"
                  >
                  </el-option>
                </el-select>
                <span v-else>{{ formData.depotName }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="采购订单号：" prop="spdCode">
                <el-input
                  v-if="dialogType != 'details'"
                  v-model.trim="formData.spdCode"
                  placeholder="请选择采购订单号"
                  :disabled="spdVisible"
                  readonly
                >
                  <template #append>
                    <el-button
                      :icon="Search"
                      style="height: 28px"
                      @click="handleGroupCode"
                      :disabled="dialogType != 'create' || spdVisible"
                    ></el-button>
                  </template>
                </el-input>
                <span v-else>{{ formData.spdCode }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="16">
              <el-form-item label="供货单位：" prop="suName">
                <el-input
                  v-if="dialogType != 'details'"
                  v-model="formData.suName"
                  readonly
                  clearable
                  placeholder="请选择收料单位"
                >
                  <template #append>
                    <el-button
                      class="ep-input-button-icon"
                      icon="Search"
                      @click="rluClick"
                    ></el-button>
                  </template>
                </el-input>
                <!-- <el-input
                  v-if="dialogType != 'details'"
                  v-model.trim="formData.suCode"
                  style="width: 150px"
                  readonly
                />
                <el-input
                  v-if="dialogType != 'details'"
                  v-model.trim="formData.suName"
                  placeholder="请输入供货单位"
                  readonly
                  style="width: 400px"
                >
                  <template #append>
                    <el-button
                      :icon="Search"
                      style="height: 28px"
                      @click="handleUnitCode"
                    ></el-button>
                  </template>
                </el-input>
                <div v-else>
                  <span>{{ formData.suCode }}</span>
                  <span>{{ formData.suName }}</span>
                </div> -->
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="发货地点：" prop="startStation">
                <el-input
                  v-if="dialogType != 'details'"
                  v-model.trim="formData.startStation"
                  placeholder="请输入发货地点"
                  :disabled="false"
                />
                <span v-else>{{ formData.startStation }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="到货地点：" prop="arrStation">
                <el-input
                  v-if="dialogType != 'details'"
                  v-model.trim="formData.arrStation"
                  placeholder="请输入到货地点"
                  :disabled="false"
                />
                <span v-else>{{ formData.arrStation }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="运单号：" prop="carryCode">
                <el-input
                  v-if="dialogType != 'details'"
                  v-model.trim="formData.carryCode"
                  placeholder="请输入运单号"
                  :disabled="false"
                />
                <span v-else>{{ formData.carryCode }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="包装物：" prop="packages">
                <el-input
                  v-if="dialogType != 'details'"
                  v-model.trim="formData.packages"
                  placeholder="请输入包装物"
                  :disabled="false"
                />
                <span v-else>{{ formData.packages }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="件数：" prop="pieces">
                <el-input
                  v-if="dialogType != 'details'"
                  v-model.trim="formData.pieces"
                  placeholder="请输入件数"
                  :disabled="false"
                />
                <span v-else>{{ formData.pieces }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="交料人：" prop="sender">
                <el-input
                  v-if="dialogType != 'details'"
                  v-model.trim="formData.sender"
                  placeholder="请输入交料人"
                  :disabled="false"
                />
                <span v-else>{{ formData.sender }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="包装状况：" prop="packageState">
                <el-input
                  v-if="dialogType != 'details'"
                  v-model.trim="formData.packageState"
                  placeholder="请输入包装状况"
                  :disabled="false"
                />
                <span v-else>{{ formData.packageState }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="进库日期：" prop="inDate">
                <el-date-picker
                  v-if="dialogType != 'details'"
                  v-model.trim="formData.inDate"
                  type="date"
                  placeholder="请选择进库日期"
                  :size="size"
                />
                <span v-else>{{ formData.inDate }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="备注：" prop="comments">
                <el-input
                  v-if="dialogType != 'details'"
                  v-model.trim="formData.comments"
                  placeholder="请输入"
                  :disabled="false"
                />
                <span v-else>{{ formData.comments }}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
      <div class="font_s" style="margin-bottom: 17px">进库料明细信息</div>
      <div class="header">
        <el-button
          v-if="dialogType != 'details'"
          type="primary"
          class="btn-select"
          @click="openSelectDialog"
          :disabled="openSelectVisible"
        >
          <el-icon>
            <Plus />
          </el-icon>
          选择物资
        </el-button>
      </div>
      <!-- 表格数据 -->
      <table-index
        class="table-index"
        :selectionShow="false"
        :tableJson="materialTableJson"
        :tableButtonJson="dialogType != 'details' ? materialButtonJson : []"
        :tableData="tableData"
        @handleButtonClick="handleButtonClick"
      >
        <template #credCode="{ scope }">
          <el-input
            v-if="dialogType != 'details'"
            v-model="scope.row.credCode"
            clearable
            @change="tsNumChange(scope)"
          />
          <span v-else>{{ scope.row.credCode }}</span>
        </template>
        <template #num="{ scope }">
          <el-input
            v-if="dialogType != 'details'"
            v-model="scope.row.num"
            v-number-input.float="2"
            clearable
            @change="tsNumChange(scope)"
          />
          <span v-else>{{ scope.row.num }}</span>
        </template>
        <template #batch="{ scope }">
          <el-input
            v-if="dialogType != 'details'"
            v-model="scope.row.batch"
            clearable
            @change="tsNumChange(scope)"
          />
          <span v-else>{{ scope.row.batch }}</span>
        </template>
        <template #pddFlag="{ scope }">
          <el-select
            v-if="dialogType != 'details'"
            v-model="scope.row.pddFlag"
            size="small"
            class="cell-select"
            style="width: 80px"
          >
            <el-option label="是" value="1" />
            <el-option label="否" value="0" />
          </el-select>
          <span v-else>{{ scope.row.pddFlag }}</span>
        </template>
        <template #ibBillCode="{ scope }">
          <el-input
            v-if="dialogType != 'details'"
            v-model="scope.row.ibBillCode"
            clearable
            @change="tsNumChange(scope)"
          />
          <span v-else>{{ scope.row.ibBillCode }}</span>
        </template>
        <template #ibBillSeq="{ scope }">
          <el-input
            v-if="dialogType != 'details'"
            v-model="scope.row.ibBillSeq"
            clearable
            @change="tsNumChange(scope)"
          />
          <span v-else>{{ scope.row.ibBillSeq }}</span>
        </template>
        <template #obCode="{ scope }">
          <el-input
            v-if="dialogType != 'details'"
            v-model="scope.row.obCode"
            clearable
            @change="tsNumChange(scope)"
          />
          <span v-else>{{ scope.row.obCode }}</span>
        </template>
        <template #obSeq="{ scope }">
          <el-input
            v-if="dialogType != 'details'"
            v-model="scope.row.obSeq"
            clearable
            @change="tsNumChange(scope)"
          />
          <span v-else>{{ scope.row.obSeq }}</span>
        </template>
        <template #durDate="{ scope }">
          <el-date-picker
            v-if="dialogType != 'details'"
            v-model="scope.row.durDate"
            type="date"
            size="small"
            style="width: 120px"
            class="cell-date"
            value-format="YYYY-MM-DD"
          />
          <span v-else>{{ scope.row.durDate }}</span>
        </template>
        <template #comments="{ scope }">
          <el-input
            v-if="dialogType != 'details'"
            v-model="scope.row.comments"
            clearable
            @change="tsNumChange(scope)"
          />
          <span v-else>{{ scope.row.comments }}</span>
        </template>
      </table-index>
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
          @click="saveBtn"
          ><svg-icon icon-class="determine" />&nbsp;保存</el-button
        >
      </div>
    </template>
  </ep-dialog>
  <Group v-model="groupVisible" @selectData="selectData" />
  <CheckMaterial
    title="物资选择"
    :key="addMatlKey"
    :visible="addMatlVisible"
    :already-table-data="_tableData"
    width="90%"
    @dialog-close="addMatlDialogClose"
    @return-matl-data="returnMatlData"
  />
  <Supplier v-model="supplierVisible" @supplierData="supplierData" />
  <rlu-dialog ref="rluDialog" @selectChange="rluSelectChange" />
</template>

<script setup>
import { Search } from "@element-plus/icons-vue";
import Group from "./Group.vue";
import CheckMaterial from "./checkMaterial.vue";
import { getCookie } from "@/utils/auth";
import Supplier from "./supplier.vue";
import { onMounted } from "vue";
import { ElMessage } from "element-plus";
import { materialTableJson, materialButtonJson } from "../tableJson";
import {
  materialCreate,
  materialModify,
  plantDictList,
  warehouseDict,
  materialDetail,
  generateCode,
} from "@/api/inMaterial/inMaterialGroup";
import RluDialog from "./rluDialog.vue";

const { proxy } = getCurrentInstance();

const visible = ref(false);
const title = ref("进库料信息");
const total = ref(0);
let idCounter = 1;
const generateId = () => `row_${Date.now()}_${idCounter++}`;
const warehouseGetYear =
  getCookie("warehouseGetYear") && JSON.parse(getCookie("warehouseGetYear"));

// 表格定义数据
const tableData = ref([]);

const data = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 10,
  },
  formData: {},
  rules: {
    plantName: [{ required: true, message: "请选择地区", trigger: ["blur", "change"] }],
    depotName: [{ required: true, message: "请选择仓库", trigger: ["blur", "change"] }],
    suName: [{ required: true, message: "请选择供货单位", trigger: ["blur", "change"] }],
    inDate: [{ required: true, message: "请选择进库日期", trigger: ["blur", "change"] }],
  },
});

const { queryParams, formData, rules } = toRefs(data);
const plantLists = ref();
const warehouseLists = ref();
const openSelectVisible = ref(false);
const spdVisible = ref(false);
const _tableData = ref([]);
const addMatlKey = ref(1);

// 数量输入验证 （只允许数字和小数点）
const validateNumber = (row) => {
  row.quantity = row.quantity.replace(/[^\d.]/g, "");
  // 防止多个小数点
  const parts = row.quantity.split(".");
  if (parts.length > 2) {
    row.quantity = parts[0] + "." + parts.slice(1).join("");
  }
};

const returnMatlData = (data = []) => {
  // for (const item of data) {
  //   item.cardPrice = 0;
  // }
  tableData.value = [...data];
  _tableData.value = [...data];
};

// 选择物资按钮逻辑
const addMatlVisible = ref(false);
const openSelectDialog = () => {
  addMatlVisible.value = true;
};

const addMatlDialogClose = () => {
  addMatlVisible.value = false;
  addMatlKey.value++;
};

const checkData = (row) => {
  tableData.value.push(...row);
  spdVisible.value = true;
  total.value = tableData.value.length;
};

// 声明触发的事件（可选，增强类型校验）
const emit = defineEmits(["createSuccess"]);
const dialogType = ref("");

// 显示弹框
const show = (type, row = {}) => {
  visible.value = true;
  dialogType.value = type;
  formData.value = {};
  tableData.value = [];
  total.value = 0;
  spdVisible.value = false;
  openSelectVisible.value = false;
  trackNumber();
  proxy.$nextTick(() => {
    proxy.$refs.elForm && proxy.$refs.elForm.resetFields();
    if (dialogType.value === "modify") {
      materialDetail(row).then(({ data }) => {
        const list = (data.rmstorImdtList || []).map((item) => {
          return {
            ...item,
            durDate: formatDurDate(item.durDate),
          };
        });
        formData.value = data;
        tableData.value = list;
        if (formData.value.spdCode) {
          openSelectVisible.value = true;
        } else {
          openSelectVisible.value = false;
        }
      });
    }
    // formData.value = Object.assign({}, formData.value, row)
  });
};

//单号
const trackNumber = async () => {
  const { data } = await generateCode({
    name: "进库料登记",
    receiptDate: warehouseGetYear?.yearMonth,
  });
  formData.value.imCode = data;
};

const formatDurDate = (timestamp) => {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const closeDialog = () => {
  formData.value = {};
  tableData.value = [];
  visible.value = false;
  dialogType.value = "create";
};

// 采购订单逻辑
const groupVisible = ref(false);
const handleGroupCode = () => {
  groupVisible.value = true;
};
const selectData = (row) => {
  formData.value.spdCode = row.spdCode;
  formData.value.pdmId = row.pdmId;
  formData.value.suName = row.suName;
  formData.value.suCode = row.suCode;
  tableData.value = row.selection;
  openSelectVisible.value = true;
  total.value = row.selection.length;
};

// 删除
const handleDel = (index) => {
  tableData.value.splice(index, 1);
  total.value = tableData.value.length;
  if (!total.value) {
    if (formData.value.spdCode) {
      formData.value.spdCode = "";
      openSelectVisible.value = false;
    } else {
      spdVisible.value = false;
    }
  }
};

const handleButtonClick = (code, data) => {
  const eventObj = {
    // 删除
    delete: () => {
      handleDel();
    },
  };

  eventObj[code] && eventObj[code]();
};

// 供货单位逻辑
const supplierVisible = ref(false);
const handleUnitCode = () => {
  supplierVisible.value = true;
};
const supplierData = (row) => {
  formData.value.suCode = row.orgCode;
  formData.value.suName = row.caName;
};

// 地区选中后逻辑
const plantChange = (value) => {
  let plantArr = plantLists.value.filter((item) => {
    return item.plantCode === value;
  });
  formData.value.plantCode = plantArr[0]?.plantCode;
  formData.value.plantName = plantArr[0]?.plantName;
  if (!value) {
    // 清空地区时，清空仓库
    formData.value.depotCode = "";
    formData.value.depotName = "";
    warehouseLists.value = [];
  } else {
    warehouseList(plantArr[0]?.id);
  }
};
// 仓库选中后逻辑
const depotChange = (value) => {
  let depotArr = warehouseLists.value.filter((item) => {
    return item.whCode === value;
  });
  formData.value.depotCode = depotArr[0].whCode;
  formData.value.depotName = depotArr[0].whName;
};

// 获取地区列表
const plantList = async () => {
  await plantDictList().then(({ data }) => {
    plantLists.value = data;
  });
};

// 获取仓库列表
const warehouseList = async (val) => {
  await warehouseDict(val).then(({ data }) => {
    warehouseLists.value = data;
  });
  const warehouseExists = warehouseLists.value.some(
    (item) => item.whCode === formData.value.depotCode
  );
  if (!warehouseExists) {
    formData.value.depotCode = "";
    formData.value.depotName = "";
  }
};

// 保存逻辑
const saveBtn = async () => {
  let submit;

  const hasEmptyNum = tableData.value.some((item) => {
    if (!item.num) {
      ElMessage.error("请输入数量");
      return true;
    }
    return false;
  });

  if (hasEmptyNum) return;

  if (dialogType.value === "modify") {
    submit = await materialModify;
  } else {
    submit = await materialCreate;
  }

  proxy.$refs.elForm.validate((valid) => {
    if (valid) {
      submit({ ...formData.value, rmstorImdtList: tableData.value })
        .then(({ message }) => {
          ElMessage.success(message);
          visible.value = false;
          emit("createSuccess");
          tableData.value = [];
          formData.value = {};
          total.value = 0;
          openSelectVisible.value = false;
          spdVisible.value = false;
        })
        .finally((message) => {
          console.log(message);
        });
    }
  });
};

const rluClick = () => {
  proxy.$refs.rluDialog.show();
};

const rluSelectChange = (data) => {
  formData.value.suCode = data[0].unitCode;
  formData.value.suName = data[0].unitName;
};

// 初始化逻辑
onMounted(() => {
  plantList();
});

defineExpose({
  show,
});
</script>
<style lang="scss" scoped>
.dialog.ep-dialog {
  padding: 0;

  .ep-dialog__title {
    font-size: 18px;
  }

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
}
</style>
