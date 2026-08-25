<!-- 柴油预发布价格维护 -->
<template>
  <div class="app-container app-container-splitpanes">
    <el-pro-table
      :columns="columns"
      :page-size="queryParams.pageSize"
      :height="height"
      :toolbar-config="toolbarConfig"
      :search-collapse-threshold="3"
      @action="onAction"
      :data="tableData"
      :total="total"
      @search="getList"
      @reset="getList"
      :show-checkbox="true"
      :selection-mode="'multiple'"
      :keep-selection="true"
    >
    </el-pro-table>
    <add-dialog ref="addDialog" @createSuccess="getList()" />
  </div>
</template>

<script setup name="system-parameter-configuration">
import { formJson } from "./formJson";
import { tableJson, toolbarConfig } from "./tableJson";
import { getLocalStorage, getSessionStorage } from "@/utils/auth";
import {
  getDieselForePriceList,
  dieselForePriceDetail,
  dieselForePricePull,
  dieselForePriceDel,
} from "@/api/diesel-inbound/dieselPriceMaintGroup";
import { onMounted } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import { getCookie } from "@/utils/auth";
import AddDialog from "./components/AddDialog";

const { proxy } = getCurrentInstance();
const columns = tableJson;
const height = 460;

const tableJsonArr = ref(
  JSON.parse(getLocalStorage(proxy.$route.meta?.menuId) || "null") || tableJson
);
const tableData = ref([]);
const loading = ref(false);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const rowData = ref([]);
const idName = ref("id");
const data = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 30,
  },
  formSelectData: {},
});

const { queryParams, formSelectData } = toRefs(data);

/** 查询列表 */
const getList = async () => {
  loading.value = true;
  getDieselForePriceList(queryParams.value)
    .then(({ data }) => {
      tableData.value = data.list || [];
      total.value = data.total;
    })
    .finally(() => {
      loading.value = false;
    });
};

const isIdsFun = () => {
  if (!ids.value.length) {
    proxy.$modal.msgWarning("请选择数据");
    return false;
  }
  if (ids.value.length > 1) {
    proxy.$modal.msgWarning("只能选择一条数据进行发布");
    return false;
  }
  return true;
};

// 发布
const pricePushFun = async () => {
  let row = ids.value[0];
  console.log(row, "111");

  if (isIdsFun()) {
    loading.value = true;
    await dieselForePricePull(row).then((data) => {
      proxy.$modal.msgSuccess("发布成功");
      loading.value = false;
    });
    getList();
  }
};

const playBatchVisible = ref(false);
const onAction = (payload) => {
  const { code, row, files } = payload;
  const eventObj = {
    // 新增
    create: () => {
      proxy.$refs.addDialog.show();
    },
    // 修改
    edit: () => {
      proxy.$refs.addDialog.show("modify", row.id);
    },
    // 删除
    delete: () => {
      proxy.$modal
        .confirm("确定要删除吗？")
        .then(() => {
          return dieselForePriceDel({ ids: [row.id] });
        })
        .then(({ message }) => {
          proxy.$modal.msgSuccess(message);
          getList();
        });
    },
    // 详情
    detail: () => {
      proxy.$refs.addDialog.show("details", row.id);
    },
    // 发布
    pricePush: () => pricePushFun(),
  };
  eventObj[code] && eventObj[code]();
};

const handleSelectChange = (val, value) => {};

onMounted(() => {
  getList();
});
</script>
<style lang="scss"></style>
