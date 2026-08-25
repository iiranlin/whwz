<template>
  <ep-dialog
    title="查看计算公式"
    iconTitle="form"
    v-model="visible"
    top="5vh"
    append-to-body
  >
    <div class="sso-front-table-container">
      <el-form
        class="form-wrapper"
        :model="formData"
        :rules="rules"
        ref="elForm"
        :inline="true"
        label-width="120px"
      >
        <div class="form-left flex1">
          <div class="test">
            1.卡片金额/数量合: 当月期初+当月收入-当月支出+当月调整=当月期末
          </div>
          <div class="test">2.当月收支存与单据间对应关系:</div>
          <div class="test">●卡片收入合计= (入库单合计+退料单合计)</div>
          <div class="test">●卡片支出合计= (出库单合计+调拨(销售)单合计)</div>
          <div class="test">
            ●卡片调整合计= (移库单移入合计-移库单移除合计+调整单合计)
          </div>
        </div>
      </el-form>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" class="determine-btn" @click="saveBtn"
          ><svg-icon icon-class="determine" />&nbsp;确定</el-button
        >
      </div>
    </template>
  </ep-dialog>
</template>

<script setup>
const { proxy } = getCurrentInstance();

const visible = ref(false);

const dataIds = ref([]);

const data = reactive({
  formData: {
    reason: "",
  },
  rules: {},
});

const { formData, rules } = toRefs(data);

// 声明触发的事件（可选，增强类型校验）
const emit = defineEmits(["deleteSuccess"]);

// 显示弹框
function show(ids = []) {
  visible.value = true;
  dataIds.value = ids;
  proxy.$nextTick(() => {
    proxy.$refs.elForm && proxy.$refs.elForm.resetFields();
  });
}

const saveBtn = () => {
  visible.value = false;
};

defineExpose({
  show,
});
</script>
<style lang="scss" scoped>
.test {
  font-size: 20px;
  margin: 10px 0;
}
</style>
