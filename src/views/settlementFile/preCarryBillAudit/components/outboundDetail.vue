<template>
  <ep-dialog
    class="ep-dialog-list"
    :title="title"
    iconTitle="form"
    v-model="visible"
    width="85vw"
    top="5vh"
    append-to-body
  >
    <div class="sso-front-table-container app-container">
      <div class="font_s">出库单信息</div>
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
              <el-form-item prop="obCode" label="出库单号：">
                <el-input
                  v-if="isFormShow"
                  v-model="formData.obCode"
                  placeholder="自动生成"
                  disabled
                />
                <span v-else>{{ formData.obCode }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="planCode" label="电子请领单：">
                <el-input
                  v-if="isFormShow"
                  v-model.trim="formData.planCode"
                  placeholder="请选择"
                  readonly
                >
                  <template #append>
                    <el-button
                      :icon="Search"
                      style="height: 28px"
                      @click="handleRequisitionFrom"
                      :disabled="dialogType !== 'create'"
                    ></el-button>
                  </template>
                </el-input>
                <span v-else>{{ formData.planCode }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="deptName" label="请领车间：">
                <el-input
                  v-if="isFormShow"
                  v-model="formData.deptName"
                  placeholder="请输入"
                  disabled
                />
                <span v-else>{{ formData.deptName }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="teamName" label="请领班组：">
                <el-input
                  v-if="isFormShow"
                  v-model="formData.teamName"
                  placeholder="请输入"
                  disabled
                />
                <span v-else>{{ formData.teamName }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="plantName" label="用料地区：">
                <el-input
                  v-if="isFormShow"
                  v-model="formData.plantName"
                  placeholder="请输入"
                  disabled
                />
                <span v-else>{{ `${formData.plantName}` }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="depotName" label="仓库：">
                <el-input
                  v-if="isFormShow"
                  v-model="formData.depotName"
                  placeholder="请输入"
                  disabled
                />
                <span v-else>{{ `${formData.depotName}` }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="partitionName" label="仓库分区：">
                <el-input
                  v-if="isFormShow"
                  v-model="formData.partitionName"
                  placeholder="请输入"
                  disabled
                />
                <span v-else>{{ `${formData.partitionName}` }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="taxFlagName" label="应税用途：">
                <el-input
                  v-if="isFormShow"
                  v-model="formData.taxFlagName"
                  placeholder="请输入"
                  disabled
                />
                <span v-else>{{ formData.taxFlagName }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="natureValueName" label="成本预算项目：">
                <el-input
                  v-if="isFormShow"
                  v-model="formData.natureValueName"
                  placeholder="请输入"
                  disabled
                />
                <span v-else>{{ formData.natureValueName }}</span>
              </el-form-item>
            </el-col>

            <el-col :span="6">
              <el-form-item prop="pickmatlName" label="领料人：">
                <el-input
                  v-if="isFormShow"
                  v-model="formData.pickmatlName"
                  placeholder="请选择"
                  disabled
                >
                </el-input>
                <span v-else>{{ formData.pickmatlName }}</span>
              </el-form-item>
            </el-col>

            <el-col :span="6">
              <el-form-item prop="receiveName" label="收料人：">
                <el-input
                  v-if="isFormShow"
                  v-model="formData.receiveName"
                  placeholder="请输入"
                >
                  <template #append>
                    <el-button
                      class="ep-input-button-icon"
                      icon="Search"
                      @click="approverClick"
                    ></el-button>
                  </template>
                </el-input>
                <span v-else>{{ formData.receiveName }}</span>
              </el-form-item>
            </el-col>

            <el-col :span="6">
              <el-form-item prop="carType" label="车型：">
                <el-input
                  v-if="isFormShow"
                  v-model="formData.carType"
                  placeholder="请输入"
                />
                <span v-else>{{ formData.carType }}</span>
              </el-form-item>
            </el-col>

            <el-col :span="6">
              <el-form-item prop="trainsetName" label="车组号：">
                <el-input
                  v-if="isFormShow"
                  v-model="formData.trainsetName"
                  placeholder="请输入"
                />
                <span v-else>{{ formData.trainsetName }}</span>
              </el-form-item>
            </el-col>

            <el-col :span="6">
              <el-form-item prop="trainNo" label="车号：">
                <el-input
                  v-if="isFormShow"
                  v-model="formData.trainNo"
                  placeholder="请输入"
                />
                <span v-else>{{ formData.trainNo }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="idsCode" label="单台设备：">
                <el-select
                  v-if="isFormShow"
                  v-model="formData.idsCode"
                  placeholder="请选择"
                  clearable
                  :disabled="isShow"
                  @change="handleidsChange"
                >
                  <el-option
                    v-for="dict in warehouseLists"
                    :key="dict.id"
                    :label="dict.equipName"
                    :value="dict.equipCode"
                  />
                </el-select>
                <span v-else>{{ formData.idsName }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="iddCode" label="设备部件：">
                <el-select
                  v-if="isFormShow"
                  v-model="formData.iddCode"
                  placeholder="请选择"
                  clearable
                  :disabled="isShow"
                  @change="handleiddChange"
                >
                  <el-option
                    v-for="dict in plantLists"
                    :key="dict.id"
                    :label="dict.epPartName"
                    :value="dict.epPartCode"
                  />
                </el-select>
                <span v-else>{{ formData.iddName }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="transType" label="供应方式：">
                <el-select
                  v-if="isFormShow"
                  v-model="formData.transType"
                  placeholder="请选择"
                  clearable
                  :disabled="isShow"
                >
                  <el-option
                    v-for="(dict, index) in transTypeLists"
                    :key="index"
                    :label="dict.label"
                    :value="dict.value"
                  />
                </el-select>
                <span v-else>{{ formData.transType }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="18">
              <el-form-item prop="comments" label="备注：">
                <el-input
                  v-if="isFormShow"
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
      <div class="font_s" style="margin-bottom: 17px">出库单明细信息</div>
      <!-- 表格数据 -->
      <table-index
        class="table-index"
        :selectionShow="dialogType === 'report' ? true : false"
        :tableJson="matlTableJson"
        :tableData="tableData"
        :idName="idName"
        @handleButtonClick="handleButtonClick"
        @handleSelectionChange="handleSelectionChange"
      >
        <template #redNum="{ scope }">
          <span>{{ -scope.row.outNum }}</span>
        </template>
        <template #redAmount="{ scope }">
          <span>{{ -scope.row.outAmount }}</span>
        </template>
      </table-index>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="visible = false" class="cancel-btn"
          ><svg-icon icon-class="cancel" />&nbsp;关闭</el-button
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
  rmstorwriteBack,
  equipPartListAll,
  equipPartList,
} from "@/api/rmstor/outbound-maintenance";
import { matlTableJson } from "../tableJson";
import { getCookie } from "@/utils/auth";
const warehouseGetYear =
  getCookie("warehouseGetYear") && JSON.parse(getCookie("warehouseGetYear"));
import UserDialog from "@/views/components/userDialog";
const { proxy } = getCurrentInstance();
import { Search } from "@element-plus/icons-vue";

const idName = ref("obdtId");
const ids = ref([]);
const selectionData = ref([]);
const single = ref(true);
const multiple = ref(true);

// 接收参数并指定类型（可选）
const props = defineProps({});
const title = ref("");
const isShow = ref(false);
const visible = ref(false);
const dialogType = ref("create");
const tableData = ref([]);
const formData = ref({});
const data = reactive({
  rules: {
    planCode: [
      { required: true, message: "请选择电子请领单", trigger: ["blur", "change"] },
    ],
    receiveName: [
      { required: true, message: "请选择收料人", trigger: ["blur", "change"] },
    ],
  },
});
const transTypeLists = [
  { label: "配送", value: "配送" },
  { label: "自提", value: "自提" },
  { label: "快件", value: "快件" },
  { label: "其它", value: "其它" },
];
const { rules } = toRefs(data);
const emit = defineEmits(["createSuccess"]);
//详情
const getRmstorInternalGetMatls = (id) => {
  proxy.$modal.loading();
  rmstorInternalListdetail(id)
    .then(({ data }) => {
      formData.value = data;
      tableData.value = data.rmstorOutBoundDtDTOList || [];
    })
    .finally(() => {
      proxy.$modal.closeLoading();
    });
};
//表单显示
const isFormShow = ref(false);

// 显示弹框
function show(type = "create", row = {}) {
  visible.value = true;
  dialogType.value = type;
  tableData.value = [];
  isShow.value = false;
  proxy.$nextTick(async () => {
    proxy.$refs.elForm && proxy.$refs.elForm.resetFields();
    if (type === "details") {
      title.value = "出库单详情";
      isFormShow.value = false;
      getRmstorInternalGetMatls(row.billId);
    }
  });
}

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
