<template>
  <ep-dialog
    :title="title"
    iconTitle="form"
    v-model="groupVisible"
    width="70vw"
    top="5vh"
    append-to-body
    height="60vh"
    :close-on-press-escape="false"
    :close-on-click-model="false"
  >
    <div class="sso-front-table-container2">
      <div class="app-container app-container-splitpanes">
        <el-row
          :gutter="20"
          class="app-container-row integrated-manage-pane-form integrated-manage-pane-form-a"
        >
          <el-col class="app-container-col">
            <form-data
              :showSearch="showSearch"
              :formJson="formSelectJson"
              @handleQuery="handleQuery"
              :formSelectData="formSelectData"
              @resetQuery="resetQuery"
              @handleSelectChange="handleSelectChange"
            ></form-data>
            <el-row :gutter="24" class="mb8 integrated-manage-pane-form-button">
              <el-col :span="18">
                <el-form-item label="请选择采购订单：" prop="matlName">
                  <el-select
                    v-model="searchValue"
                    :loading="searchLoading"
                    @change="spdChange"
                    clearable
                  >
                    <el-option
                      v-for="item in searchOptions"
                      :key="item.spdCode"
                      :label="`${item.spdCode}&nbsp;&nbsp;&nbsp;&nbsp;${item.suName}&nbsp;&nbsp;&nbsp;&nbsp;${item.geneType}`"
                      :value="item.spdCode"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <!-- <right-toolbar v-model:showSearch="showSearch" :tableJson="tableJsonArr" @queryTable="getList"
                @tabConfigSuccess="tabConfigSuccess"></right-toolbar> -->
            </el-row>
            <!-- 表格数据 -->
            <table-index
              ref="tableRef"
              class="table-index"
              :loading="loading"
              :idName="idName"
              :queryParams="queryParams"
              :tableJson="tableJsonArr"
              :selectionShow="true"
              :tableData="tableData"
              @handleSelectionChange="handleSelectionChange"
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
          </el-col>
        </el-row>
      </div>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="groupVisible = false" class="cancel-btn"
          ><svg-icon icon-class="cancel" />&nbsp;关闭</el-button
        >
        <el-button type="primary" class="determine-btn" @click="saveBtn"
          ><svg-icon icon-class="determine" />&nbsp;{{
            dialogType === "create" ? "保存" : "确定"
          }}</el-button
        >
      </div>
    </template>
  </ep-dialog>
</template>

<script setup>
import { getMaterialCode, getMaterialCodePage } from "@/api/inMaterial/inMaterialGroup";
import { tableJsonGroup, tableButtonJson } from "../tableJson";
import { getLocalStorage } from "@/utils/auth";
import { formSelectJson } from "../formJson";
import { useDict } from "@/utils/Dict";
const { proxy } = getCurrentInstance();
const tableJsonArr = ref(
  JSON.parse(getLocalStorage(proxy.$route.meta?.menuId)) || tableJsonGroup
);

const props = defineProps({});
const groupVisible = defineModel({ default: false });

// 字典
const { dictList, dictMap } = useDict("pur_org");

// 采购订单下拉菜单
const searchOptions = ref([]);
const searchValue = ref("");
const searchLoading = ref(false);
const showSearch = ref(true);

watch(groupVisible, (newVal) => {
  if (newVal) {
    getList();
  } else {
    resetQuery();
  }
});

const tableData = ref([]);
const loading = ref(false);
const total = ref(0);
const tableRef = ref();
const idName = ref("pddId");
const selectData = ref({});
const parList = ref([]);

const title = ref("物资分类编号");

const data = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 30,
  },
  formSelectData: {},
});

const { queryParams, formSelectData } = toRefs(data);

const emit = defineEmits(["createSuccess", "selectData"]);
const dialogType = ref("");

// 采购订单明细
const spdListPage = async (val) => {
  await getMaterialCodePage(val).then(({ data }) => {
    tableData.value = data.list || [];
  });
};

const spdChange = (val) => {
  spdListPage(val);
};

const getList = async (val) => {
  loading.value = true;

  //查询采购订单列表
  await getMaterialCode(queryParams.value)
    .then(({ data }) => {
      let res = data.map((item) => {
        const dictItem = dictList.value.find((d) => d.code === item.geneType);
        return {
          ...item,
          geneType: dictItem ? dictItem.name : item.geneType,
        };
      });
      searchOptions.value = res || [];
      if (val.spdCode) {
        searchValue.value = data[0].spdCode;
        spdListPage(searchValue.value);
      }
      total.value = data.total;
    })
    .finally(() => {
      loading.value = false;
      if (searchOptions.value.length < 1) {
        searchValue.value = "";
        tableData.value = [];
      }
    });
};

/** 查询按钮操作 */
const handleQuery = (data) => {
  queryParams.value.pageNum = 1;
  queryParams.value = Object.assign({}, queryParams.value, data);
  getList(data);
};
/** 重置按钮操作 */
function resetQuery(data = {}) {
  handleQuery(data);

  searchValue.value = "";
  tableData.value = [];
}

const handleSelectionChange = (selection, row) => {
  let id = "";
  let name = "";
  let code = "";
  searchOptions.value.map((item) => {
    if (item.spdCode === searchValue.value) {
      return (id = item.pdmId), (name = item.suName), (code = item.suCode);
    }
  });

  selectData.value = {
    spdCode: searchValue.value,
    suCode: code,
    suName: name,
    pdmId: id,
    selection,
  };
};
const saveBtn = () => {
  groupVisible.value = false;
  emit("selectData", selectData.value);
  searchValue.value = "";
  tableData.value = [];
};
</script>
<style lang="scss" scoped>
.sso-front-table-container2 {
  height: 70vh;
  border: none;
  margin: 0;
  display: flex;
  flex-direction: column;
}
</style>
