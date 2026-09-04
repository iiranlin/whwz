<template>
  <ep-dialog
    class="ep-dialog-list"
    :title="title"
    iconTitle="form"
    v-model="playBatchVisible"
    width="90vw"
    top="5vh"
    append-to-body
    :close-on-press-escape="false"
    :close-on-click-model="false"
  >
    <div class="sso-front-table-container app-container">
      <div class="font_s">退料单信息</div>
      <el-form
        class="form-wrapper"
        :model="formData"
        :rules="rules"
        ref="elForm"
        :inline="true"
        label-width="120px"
      >
        <el-row class="form-left flex1">
          <el-col :span="8">
            <el-form-item label="退料单号：" prop="returnCode">
              <el-input
                v-model.trim="formData.returnCode"
                placeholder="请输入退料单号"
                :disabled="true"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="退料人：" prop="materialReturner">
              <el-input
                v-model.trim="formData.materialReturner"
                placeholder="请输入退料人"
                :disabled="true"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="出库单号：" prop="obCode">
              <el-input
                v-model.trim="formData.obCode"
                placeholder="请输入出库单号"
                :disabled="true"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="领料部门：" prop="unitName">
              <el-input
                v-model.trim="formData.unitName"
                placeholder="请输入领料部门"
                :disabled="true"
              />
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="用料地区：" prop="plantName">
              <el-input
                v-model.trim="formData.plantName"
                placeholder="请输入用料地区"
                :disabled="true"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="仓库：" prop="depotName">
              <el-input
                v-model.trim="formData.depotName"
                placeholder="请输入仓库"
                :disabled="true"
              />
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="仓库分区：" prop="partitionName">
              <el-input
                v-model.trim="formData.partitionName"
                placeholder="请输入仓库分区"
                :disabled="true"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="应税用途：" prop="taxFlagName">
              <el-input
                v-model.trim="formData.taxFlagName"
                placeholder="请输入应税用途"
                :disabled="true"
              />
            </el-form-item>
          </el-col>
          <!-- 81-退料单改造：隐藏"成本预算项目"字段，与新增弹窗保持一致，如需恢复取消注释 -->
          <!-- <el-col :span="8">
            <el-form-item label="成本预算项目：" prop="natureValueName">
              <el-input
                v-model.trim="formData.natureValueName"
                placeholder="请输入成本预算项目"
                :disabled="true"
              />
            </el-form-item>
          </el-col> -->
          <el-col :span="24">
            <el-form-item prop="comments" label="备注：">
              <el-input
                v-model.trim="formData.comments"
                placeholder="请输入"
                style="width: 100%"
                type="textarea"
                disabled
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="font_s" style="margin-bottom: 17px">退料单明细信息</div>
      <!-- 表格列表 -->
      <div class="sso-front-table-container2">
        <div class="app-container app-container-splitpanes" style="padding: 0">
          <table-index
            class="table-index"
            :loading="loading"
            :queryParams="queryParams"
            :tableJson="tableJsonArr"
            :selectionShow="false"
            :tableData="tableData"
            operationWidth="150"
          >
          </table-index>

          <pagination
            v-show="total > 0"
            :total="total"
            v-model:page="queryParams.pageNum"
            v-model:limit="queryParams.pageSize"
            @pagination="getList"
          />
        </div>
      </div>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="playBatchVisible = false" class="cancel-btn"
          ><svg-icon icon-class="cancel" />&nbsp;关闭</el-button
        >
      </div>
    </template>
  </ep-dialog>
</template>

<script setup>
import { maintainDetail } from "@/api/materialMaintain/materialGroup";
import { tableJsonDetail } from "../tableJson";
import { Search } from "@element-plus/icons-vue";
import { getLocalStorage } from "@/utils/auth";
const { proxy } = getCurrentInstance();
const tableJsonArr = ref(
  JSON.parse(getLocalStorage(proxy.$route.meta?.menuId)) || tableJsonDetail
);
const props = defineProps({
  rowData: {
    type: Object,
    default: () => {},
  },
});

const playBatchVisible = defineModel({ default: false });

const title = ref("退料单详情");

const emit = defineEmits(["createSuccess"]);

watch(playBatchVisible, (newVal) => {
  if (newVal) {
    getList();
  }
});
const tableData = ref([]); // 表格数据
const formData = ref([]); // 表单数据
const loading = ref(false);
const total = ref(0);

const queryParams = ref({
  pageNum: 1,
  pageSize: 30,
});

const getList = async () => {
  loading.value = true;
  maintainDetail(props.rowData.returnId)
    .then(({ data }) => {
      tableData.value = data.details || [];
      formData.value = data;
      total.value = data.total;
      tableData.value.map((item) => {
        if (item.rmNum) {
          item.rmAmount = (item.rmNum * item.price).toFixed(2);
        }
      });
    })
    .finally(() => {
      loading.value = false;
    });
};
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
