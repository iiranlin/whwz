<template>
  <ep-dialog class="ep-dialog-list" :title="title" iconTitle="form" v-model="visible" width="90vw" top="5vh"
    append-to-body>
    <div class="sso-front-table-container app-container">
      <div class="font_s">退料单信息</div>
      <div style="height: 240px;">
        <el-form class="form-wrapper" :model="formData" :rules="rules" ref="elForm" label-width="120px">
          <div class="form-left flex1">
            <el-row>
              <el-col :span="8">
                <el-form-item prop="returnCode" label="退料单号：">
                  <el-input v-if="dialogType != 'details'" v-model="formData.returnCode" placeholder="自动生成" disabled />
                  <span v-else>{{ formData.returnCode }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="退料人：" prop="materialReturner">
                  <el-input v-if="dialogType != 'details'" v-model.trim="formData.materialReturner" placeholder="请选择"
                    readonly>
                    <template #append>
                      <el-button :icon="Search" style="height: 28px" @click="handleUserCode"
                        :disabled="dialogType != 'create'"></el-button>
                    </template>
                  </el-input>
                  <span v-else>{{ formData.materialReturner }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="出库单号：" prop="obCode">
                  <el-input v-if="dialogType != 'details'" v-model.trim="formData.obCode" placeholder="请选择" readonly>
                    <template #append>
                      <el-button :icon="Search" style="height: 28px" @click="handleOrderCode"
                        :disabled="dialogType != 'create'"></el-button>
                    </template>
                  </el-input>
                  <span v-else>{{ formData.obCode }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item prop="unitName" label="领料部门：">
                  <el-input v-if="dialogType != 'details'" v-model="formData.unitName" placeholder="由出库单号自动带出"
                    disabled />
                  <span v-else>{{ formData.unitName }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item prop="plantName" label="用料地区：">
                  <el-input v-if="dialogType != 'details'" v-model="formData.plantName" placeholder="由出库单号自动带出"
                    disabled />
                  <span v-else>{{ formData.plantName }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item prop="depotName" label="仓库：">
                  <el-input v-if="dialogType != 'details'" v-model="formData.depotName" placeholder="由出库单号自动带出"
                    disabled />
                  <span v-else>{{ formData.depotName }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="仓库分区：" prop="partitionName">
                  <el-select v-if="dialogType != 'details'" v-model="formData.partitionName" placeholder="请选择" clearable
                    disabled>
                    <el-option v-for="item in plantLists" :key="item.partationCode" :label="item.partationName"
                      :value="item.partationCode">
                    </el-option>
                  </el-select>
                  <span v-else>{{ formData.partationName }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item prop="taxFlagName" label="应税用途：">
                  <el-input v-if="dialogType != 'details'" v-model="formData.taxFlagName" placeholder="请输入应税用途"
                    disabled />
                  <span v-else>{{ formData.taxFlagName }}</span>
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item prop="natureValueName" label="成本预算项目：">
                  <el-input v-if="dialogType != 'details'" v-model="formData.natureValueName" placeholder="由出库单号自动带出"
                    disabled />
                  <span v-else>{{ formData.natureValueName }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item prop="comments" label="备注：">
                  <el-input v-if="dialogType != 'details'" v-model.trim="formData.comments" placeholder="请输入"
                    :disabled="false" style="width: 100%" type="textarea" />
                  <span v-else>{{ formData.comments }}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-form>
      </div>
      <div class="font_s" style="margin-bottom: 17px">退料单明细信息</div>
      <div style="height:calc(100% - 240px)">
        <el-pro-table ref="proTableRef" :columns="matlTableJsonQuery" :show-pagination="false" :data="tableData"
          :show-checkbox="false" :grid-options="{ rowId: 'returnId' }" :table-alert-render="false"
          :show-action="dialogType === 'create' ? true : false" :show-refresh="false" :show-setting="false"
          :toolbar-config="dialogType === 'create' ? toolbarConfig : {}" @action="onAction">
          <template #rmNum="{ row, column, index }">
            <el-input v-if="dialogType != 'details'" v-model="row.rmNum" placeholder="请输入" clearable
              v-number-input.float="4" @input="tsNumChange(row)" />
            <span v-else>{{ row.rmNum != null && row.rmNum !== '' ? Number(row.rmNum).toFixed(4) : '' }}</span>
          </template>
        </el-pro-table>
      </div>
    </div>
    <template #footer>
      <div class="dialog-footer">
            <el-button v-if="dialogType != 'details'" type="primary" class="determine-btn" @click="saveBtn('0')"><svg-icon
            icon-class="determine" />&nbsp;保存</el-button>    
        <el-button @click="visible = false" class="cancel-btn"><svg-icon icon-class="cancel" />&nbsp;返回</el-button>

      </div>
    </template>
  </ep-dialog>
  <user-dialog ref="userDialog" @selectChange="userSelectChange" />
  <OutboundOrder v-model="orderVisible" @selectData="orderData" />
</template>
<script setup>
import {
  maintainDetail,
  maintainCreate,
  maintainModify,
  generateCode,
} from "@/api/materialMaintain/materialGroup";
import { matlTableJsonQuery } from "../tableJson";
import { getCookie } from "@/utils/auth";
import { Search } from "@element-plus/icons-vue";
import OutboundOrder from "./outboundOrderQuery.vue";
import UserDialog from "@/views/components/userDialogQuery"
const { proxy } = getCurrentInstance();
const warehouseGetYear =
  getCookie("warehouseGetYear") && JSON.parse(getCookie("warehouseGetYear"));

// 接收参数并指定类型（可选）
const props = defineProps({

});
const title = ref('')
const visible = ref(false);
const dialogType = ref("create");
const tableData = ref([]);
const formData = ref({});
const plantLists = ref([]);

const data = reactive({
  rules: {
    materialReturner: [
      { required: true, message: "请选择退料人", trigger: ["blur", "change"] },
    ],
    obCode: [{ required: true, message: "请选择出库单号", trigger: ["blur", "change"] }],
    unitName: [
      { required: true, message: "请输入领料部门", trigger: ["blur", "change"] },
    ],
    plantName: [
      { required: true, message: "请输入用料地区", trigger: ["blur", "change"] },
    ],
    depotName: [{ required: true, message: "请输入仓库", trigger: ["blur", "change"] }],
    natureValueName: [
      { required: true, message: "请输入成本预算项目", trigger: ["blur", "change"] },
    ],
    partitionName: [
      { required: true, message: "请选择仓库分区", trigger: ["blur", "change"] },
    ],
    taxFlagName: [
      { required: true, message: "请输入应税用途", trigger: ["blur", "change"] },
    ],
  },
});

const { rules } = toRefs(data);
const proTableRef = ref(null)
const emit = defineEmits(["createSuccess"]);

// 显示弹框
function show(type = "create", row) {
  visible.value = true;
  dialogType.value = type;
  tableData.value = [];
  proxy.$nextTick(async () => {
    proxy.$refs.elForm && proxy.$refs.elForm.resetFields()
    if (type === 'create') {
      title.value = '退料单新增'
      trackNumber()
    } else if (type === 'modify') {
      title.value = '退料单修改'
      getRmstorInternalGetMatls(row.returnId)
    } else if (type === 'details') {
      title.value = '退料单详情'
      getRmstorInternalGetMatls(row.returnId)
    }
  })
}
//详情
const getRmstorInternalGetMatls = (id) => {
  proxy.$modal.loading()
  maintainDetail(id).then(({ data }) => {
    formData.value = data
    tableData.value = data.details || []
  }).finally(() => {
    proxy.$modal.closeLoading()
  })
}
//单号
const trackNumber = async () => {
  const { data } = await generateCode({
    name: "退料单",
    receiptDate: warehouseGetYear?.yearMonth,
  });
  formData.value.returnCode = data
}
const toolbarConfig = {
  buttons: [
    {
      code: 'delete',
      name: '删除',
      type: 'primary',
      showInTop: false,
      showInRow: true,
    },
  ]
}
const onAction = ({ code, row, selectedRows }) => {
  const eventObj = {
    // 删除
    delete: () => {
      proTableRef.value?.removeEditableRow(row)
    },
  }
  eventObj[code] && eventObj[code]()
}

// 退料人逻辑
const handleUserCode = (row) => {
  proxy.$refs.userDialog.show()
};
const userSelectChange = (row) => {
  formData.value.userCode = row[0].userCode;
  formData.value.materialReturner = row[0].userName;
};

// 出库单号逻辑
const orderVisible = ref(false);
const handleOrderCode = (row) => {
  orderVisible.value = true;
};
const orderData = (row) => {
  Object.assign(formData.value, row.searchOptions);
  tableData.value = row.selection;
  tableData.value = tableData.value.map((item) => {
    item.rmNum = item.outNum - item.retNum;
    return {
      ...item,
      rmNum: item.rmNum,
      rmAmount: (item.rmNum * item.price).toFixed(2),
    };
  });
};
const tsNumChange = (row) => {
  row.rmAmount = (row.rmNum * row.price).toFixed(2);
};
const saveBtn = async (flag) => {
  let submit;
  if (dialogType.value === "modify") {
    submit = await maintainModify;
  } else {
    submit = await maintainCreate;
  }
  proxy.$refs.elForm.validate((valid) => {
    let amount = 0;
    if (valid) {
      const newTableData = proTableRef.value?.getCurrentData()
      let isTsNum = false;
      for (let i = 0; i < newTableData.length; i++) {
        if (!newTableData[i].rmNum || newTableData[i].rmNum == "0") {
          isTsNum = true;
          proxy.$modal.msgWarning(`第${i + 1}行，退料数量不能为空或0！`);
          break;
        }
      }
      if (isTsNum) {
        return;
      }
      if (!newTableData.length) {
        proxy.$modal.msgWarning(`退料单明细不能为空`);
        return;
      }
      newTableData.forEach((item) => {
        item.yearMonth = getCookie("warehouseYearMonth").split("-").slice(0, 2).join("");
      });
      formData.value = {
        ...formData.value,
        flag,
        details: newTableData,
        amount: amount,
      };
      delete formData.value.yearMonth;
      formData.value.yearMonth = getCookie("warehouseYearMonth")
        .split("-")
        .slice(0, 2)
        .join("");
      proxy.$modal.loading();
      submit(formData.value, dialogType.value)
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
