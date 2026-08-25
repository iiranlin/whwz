<template>
  <ep-dialog
    class="ep-dialog-list"
    :title="
      dialogType === 'modify'
        ? '柴油预发布价格维护修改'
        : dialogType == 'details'
        ? '柴油预发布价格维护详情'
        : '柴油预发布价格维护新增'
    "
    iconTitle="form"
    v-model="visible"
    width="90%"
    top="5vh"
    append-to-body
  >
    <div class="sso-front-table-container app-container">
      <!-- 表格数据 -->
      <table-index
        class="table-index"
        :selectionShow="false"
        :tableJson="materialTableJson"
        :tableData="tableData"
        @handleButtonClick="handleButtonClick"
      >
        <template #price="{ scope }">
          <el-input
            v-if="dialogType != 'details' && scope.row.specification == '0#'"
            v-model="scope.row.price"
            v-number-input.float="2"
            clearable
            @change="tsNumChange(scope)"
          />
          <span v-else>{{ scope.row.price }}</span>
        </template>
        <template #effectDate="{ scope }">
          <el-date-picker
            type="datetime"
            v-if="dialogType != 'details' && scope.row.specification == '0#'"
            v-model="scope.row.effectDate"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
            clearable
            @change="tsDateChange(scope)"
          />
          <span v-else>{{ scope.row.effectDate }}</span>
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
</template>

<script setup>
import { Search } from "@element-plus/icons-vue";
import { getCookie } from "@/utils/auth";
import { onMounted } from "vue";
import { ElMessage } from "element-plus";
import { materialTableJson } from "../tableJson";
import {
  dieselForePriceAdd,
  dieselForePriceUpdate,
  getDiseslForePriceDtList,
  dieselForePriceDetail,
} from "@/api/diesel-inbound/dieselForePriceGroup";

const { proxy } = getCurrentInstance();

const visible = ref(false);
const title = ref("进库料信息");
const total = ref(0);

// 表格定义数据
const tableData = ref([
  {
    specification: "0#",
    price: null,
    effectDate: "",
  },
  {
    specification: "-10#",
    price: null,
    effectDate: "",
  },
  {
    specification: "-20#",
    price: null,
    effectDate: "",
  },
  {
    specification: "-35#",
    price: null,
    effectDate: "",
  },
]);

const data = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 10,
  },
});

const { queryParams } = toRefs(data);
// 声明触发的事件（可选，增强类型校验）
const emit = defineEmits(["createSuccess"]);
const dialogType = ref("");

// 转换时间格式
const formatMsToDateTime = (timestamp) => {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const pad = (num) => String(num).padStart(2, "0");
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hour = pad(date.getHours());
  const minute = pad(date.getMinutes());
  const second = pad(date.getSeconds());
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
};

// 显示弹框
const show = async (type, row = {}) => {
  visible.value = true;
  dialogType.value = type;
  total.value = 0;
  if (type === "modify" || type === "details") {
    // 修改
    let params = {
      mtId: row,
      yearMonth: "",
    };
    let res = await getDiseslForePriceDtList(params);
    tableData.value = res.data.list.map((item) => {
      return {
        ...item,
        effectDate: formatMsToDateTime(item.effectDate),
      };
    });
  }
};

const closeDialog = () => {
  visible.value = false;
  dialogType.value = "create";
};

const handleButtonClick = (code, data) => {
  const eventObj = {};

  eventObj[code] && eventObj[code]();
};

// 价格
const tsNumChange = (scope) => {
  if (scope.row.specification === "0#") {
    const basePrice = Number(scope.row.price) || 0;

    tableData.value.map((item) => {
      switch (item.specification) {
        case "-10#":
          item.price = (basePrice * 1.06).toFixed(2);
          break;
        case "-20#":
          item.price = (basePrice * 1.11).toFixed(2);
          break;
        case "-35#":
          item.price = (basePrice * 1.15).toFixed(2);
          break;
      }
    });
  }
};

// 日期
const tsDateChange = (scope) => {
  tableData.value.map((item) => {
    item.effectDate = scope.row.effectDate;
  });
};

// 保存逻辑
const saveBtn = async () => {
  const hasPrice = tableData.value.some((item) => {
    if (!(item.price && item.effectDate)) {
      ElMessage.warning("预发布价格或生效日期不能为空");
      return true;
    }
    return false;
  });

  if (hasPrice) return;

  tableData.value.map((item) => {
    item.effectDate = new Date(item.effectDate).toISOString();
  });

  if (dialogType.value === "modify") {
    submit = await dieselForePriceUpdate(tableData.value).then(({ message }) => {
      ElMessage.success(message);
      visible.value = false;
      emit("createSuccess");
      total.value = 0;
    });
  } else {
    submit = await dieselForePriceAdd({ dtList: tableData.value }).then(({ message }) => {
      ElMessage.success(message);
      visible.value = false;
      emit("createSuccess");
      total.value = 0;
    });
  }
};

// 初始化逻辑
onMounted(() => {});

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
:deep(.ep-input-number.is-center .ep-input__inner) {
  text-align: right;
}
</style>
