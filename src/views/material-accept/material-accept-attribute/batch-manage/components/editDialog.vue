<template>
  <el-dialog class="dialog" :model-value="visible" :width="width" top="5vh" draggable @close="dialogClose" @open="dialogOpen" destroy-on-close>
    <template #header>
      <span><svg-icon :icon-class="iconTitle" v-if="iconTitle" /> {{ title }}</span>
    </template>
    <div class="app-container" v-loading="loading">
      <div class="batch-manage-form-row">
        <div class="batch-manage-form-row-name">批次</div>
        <div class="batch-manage-form-row-content">
          <el-form :model="batchForm" inline :rules="batchFormRules" ref="batchFormRef">
            <el-form-item label="启用批次管理：" prop="matlBatchStatus">
              <el-switch v-model="batchForm.matlBatchStatus" @change="switchChange"></el-switch>
            </el-form-item>
            <div class="batch-manage-form-row-content-item">
              <!-- <div class="batch-manage-form-row-content-item-title">有效期信息：</div> -->
              <el-form-item label="启用效期管理：" prop="periodManage">
                <el-switch :disabled="batchForm.matlBatchStatus === false" v-model="batchForm.periodManage" active-value="1" inactive-value="0" @change="validityPeriodStatusChange"></el-switch>
              </el-form-item>
              <el-form-item v-if="batchForm.periodManage === '1'" label="有效期单位：" prop="validityPeriodUnit">
                <el-select v-model="batchForm.validityPeriodUnit" clearable placeholder="请选择">
                  <el-option v-for="item in validityPeriodUnitArr" :key="item.value" :value="item.value" :label="item.label"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item v-if="batchForm.periodManage ==='1'" label="有效期：" prop="validityPeriod">
                <el-input v-model="batchForm.validityPeriod" clearable placeholder="请输入"></el-input>
              </el-form-item>
            </div>
          </el-form>
        </div>
      </div>
    </div>
    <template #footer>
      <div>
        <el-button @click="dialogClose">取消</el-button>
        <el-button type="primary" @click="editDialogConfirm" :disabled="loading">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { getMatlBatchInfo, matlBatchUpate, batchMangeCheckStore } from "@/api/materialAccept/matlBatch.js";
import { ElMessage } from "element-plus";
import { validityPeriodUnitArr } from "@/utils/dictionary";
// 接收参数并指定类型（可选）
const props = defineProps({
  iconTitle: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: '新增'
  },
  width: {
    type: String,
    default: '800px'
  },
  visible: {
    type: Boolean,
    default: false
  },
  currentRowData: {
    type: Object,
    default: () => {},
  }
});

const loading = ref(false);

const batchFormRef = ref(null);
const batchForm = ref({
  matlBatchStatus: false,
  validityPeriodUnit: "",
  validityPeriod: "",
  periodManage: "0",
});
const batchFormRules = ref({
  validityPeriod: [
    { pattern: /^[1-9]\d*$/, message: "请输入正整数", trigger: ["change", "blur"] },
    { required: true, message: "请填写有效期", trigger: ["change", "blure"] }
  ],
  validityPeriodUnit: [
    { required: true, message: "请选择有效期单位", trigger: ["change", "blure"] }
  ]
});

const detailData = ref({});

const emit = defineEmits(['dialogClose', 'editDialogConfirm', 'switchToFalse']);

const dialogClose = () => {
  emit('dialogClose');
}

const editDialogConfirm = async () => {
  try {
    batchFormRef.value.validate(async (valid) => {
      if (valid) {
        const res = await matlBatchUpate({
          id: props.currentRowData.id,
          matlBatchStatus: batchForm.value.matlBatchStatus === true ? "1" : "0",
          validityPeriod: batchForm.value.validityPeriod ? Number(batchForm.value.validityPeriod) : "",
          validityPeriodUnit: batchForm.value.validityPeriodUnit || null,
          periodManage: batchForm.value.periodManage,
        });
        ElMessage.success("编辑成功！");
        emit('editDialogConfirm');
      }
    })
  } catch (error) {
    console.log(error);
  }
}

const switchChange = async (val) => {

  if (val === false) {
    const res = await batchMangeCheckStore({
      id: props.currentRowData.id,
      matlBatchStatus: "1"
    });
    if (res.code == 1) {
      emit('switchToFalse');
    } else {
      batchForm.value.periodManage = "0";
      batchForm.value.validityPeriod = null;
      batchForm.value.validityPeriodUnit = "";
    }
  }
}

const validityPeriodStatusChange = async (val) => {
  if (val === "0") {
    batchForm.value.validityPeriodUnit = "";
    batchForm.value.validityPeriod = null;
  } else {

  }
}

const dialogOpen = async () => {
  loading.value = true;
  try {
    const res= await getMatlBatchInfo({id: props.currentRowData.id});
    batchForm.value.matlBatchStatus = res.data?.matlBatchStatus === "1" ? true : false;
    batchForm.value.validityPeriod = res.data?.validityPeriod;
    batchForm.value.validityPeriodUnit = res.data?.validityPeriodUnit;
    batchForm.value.periodManage = res.data?.periodManage;
  } catch (err) {
    
  }
  setTimeout(() => {
    loading.value = false;
  }, 500);
}

defineExpose({batchForm})
</script>
<style lang="scss" scoped>
.batch-manage-form-row {
  .batch-manage-form-row-name {
    margin-bottom: 12px;
  }
  .batch-manage-form-row-name {
    font-weight: 800;
  }
  .batch-manage-form-row-content {
    :deep(.ep-form) {
      .ep-form-item {
        .ep-form-item__label {
          font-weight: normal;
        }
        .ep-form-item__content {
          .ep-select__wrapper {
            width: 100px;
          }
          .ep-input__wrapper {
            width: 220px;
          }
        }
      }
      .batch-manage-form-row-content-item {
        display: flex;
        align-items: center;
        .batch-manage-form-row-content-item-title {
          width: 98px;
          display: flex;
          justify-content: flex-end;
          margin: 0 0 18px 0;
        }
      }
    }
  }
}
</style>