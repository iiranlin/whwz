<template>
  <ep-dialog :title="title" iconTitle="form" v-model="groupVisible" width="70vw" top="5vh" append-to-body height="60vh"
    :close-on-press-escape="false" :close-on-click-model="false">
    <div class="sso-front-table-container2">
      <div class="app-container app-container-splitpanes">
        <el-row :gutter="20" class="app-container-row integrated-manage-pane-form integrated-manage-pane-form-a">
          <el-col class="app-container-col">
            <el-form class="form-wrapper" :model="formData" ref="elForm" :inline="true"
              label-width="120px" style="margin-top: 10px;">
              <el-row class="form-left flex1">
                <el-col :span="12">
                  <el-form-item label="供货编号：" prop="orgCode">
                    <el-input v-model.trim="formData.orgCode" placeholder="请输入">
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="供货名称：" prop="caName">
                    <el-input v-model.trim="formData.caName" placeholder="请输入">
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-button type="primary" @click="onSearch" class="search-btn"><svg-icon
                      icon-class="search" />&nbsp;查询</el-button>
                  <el-button type="default" @click="resetQuery" class="reset-btn"><svg-icon
                      icon-class="Line-Refresh" />&nbsp;重置</el-button>
                </el-col>
              </el-row>
            </el-form>
            <el-row :gutter="10" class="mb8 integrated-manage-pane-form-button">
              <!-- <right-toolbar v-model:showSearch="showSearch" :tableJson="tableJsonArr" @queryTable="getList"
                @tabConfigSuccess="tabConfigSuccess"></right-toolbar> -->
            </el-row>
            <!-- 表格数据 -->
            <table-index ref="tableRef" class="table-index" :loading="loading" :queryParams="queryParams" :tableJson="tableJsonArr"
              :selectionShow="false" :highlight-current-row="true" :row-class-name="tableRowClassName" @row-click="rowClick" :tableData="tableData"
              operationWidth="150">
            </table-index>

            <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
              v-model:limit="queryParams.pageSize" @pagination="getList" />
          </el-col>
        </el-row>
      </div>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="groupVisible = false" class="cancel-btn"><svg-icon icon-class="cancel" />&nbsp;关闭</el-button>
        <el-button type="primary" class="determine-btn" @click="saveBtn"><svg-icon icon-class="determine" />&nbsp;{{
          dialogType === 'create' ? '保存' : '确定' }}</el-button>
      </div>
    </template>
  </ep-dialog>
</template>

<script setup>
import { supplierList } from '@/api/inMaterial/inMaterialGroup'
import { tableJsonSupper } from "../tableJson"
import { getLocalStorage } from '@/utils/auth'
const { proxy } = getCurrentInstance()
const tableJsonArr = ref(JSON.parse(getLocalStorage(proxy.$route.meta?.menuId)) || tableJsonSupper)

const props = defineProps({

})
const groupVisible = defineModel({ default: false })

// 采购订单下拉菜单
const searchOptions = ref([]);
const searchValue = ref('')
const searchLoading = ref(false);

watch(groupVisible, (newVal) => {
  if (newVal) {
    getList()
  } else {
    resetQuery()
  }
})

const tableData = ref([])
const loading = ref(false)
const total = ref(0)
const tableRef = ref()


const title = ref('物资分类编号')
const queryParams = ref({
  pageNum: 1,
  pageSize: 30
})
const formData = ref({
})

const emit = defineEmits(['createSuccess', 'supplierData']);
const dialogType = ref('')


const getList = async () => {
  loading.value = true
  
    //查询供货列表
    await supplierList().then(({ data }) => {
      searchOptions.value = data.list || []
      tableData.value = data.list || []
      total.value = data.total
    }).finally(() => {
      loading.value = false
    })
}

/** 查询按钮操作 */
const onSearch = () => {

}
/** 重置按钮操作 */
function resetQuery() {
  queryParams.value.pageNum = 1
  formData.value.orgCode = ''
  formData.value.caName = ''
  getList()
}

const supplierData = ref({})
// const handleSelectionChange = (val) => {
//     supplierData.value = {
//       spdCode:searchValue.value,
//       ...val[0]
//     }
// }

const tableRowClassName = ({row,rowIndex}) => {
  row.index = rowIndex
}

const rowClick = (val) => {
  supplierData.value = {
      spdCode:searchValue.value,
      ...val
    }
  
}
const saveBtn = () => {
  groupVisible.value = false
  emit('supplierData', supplierData.value)
}



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