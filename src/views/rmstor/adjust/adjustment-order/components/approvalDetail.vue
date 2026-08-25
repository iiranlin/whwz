<template>
  <ep-dialog :title="title" iconTitle="form" v-model="approvalVisible" width="70vw" top="5vh" append-to-body height="60vh"
    :close-on-press-escape="false" :close-on-click-model="false">
    <div class="sso-front-table-container2">
      <div class="app-container app-container-splitpanes">
        <el-row :gutter="20" class="app-container-row integrated-manage-pane-form integrated-manage-pane-form-a">
          <el-col class="app-container-col">
            <el-form class="form-wrapper" :model="formData"  :inline="true" label-width="83px"
              style="margin-top: 10px;">
              <el-row class="form-left flex1">
                <el-col :span="8">
                  <el-form-item label="调整单号：" >
                        {{props.rowData.billCode}}
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
             <el-divider style="margin-top: 0px"></el-divider>
            <!-- 表格数据 -->
            <table-index class="table-index" :loading="loading" :queryParams="queryParams" :tableJson="tableJsonArr"
              :selectionShow="false" :tableData="tableData" 
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
        <el-button @click="approvalVisible = false" class="cancel-btn"><svg-icon icon-class="cancel" />&nbsp;关闭</el-button>
        <!-- <el-button type="primary" class="determine-btn" @click="saveBtn"><svg-icon icon-class="determine" />&nbsp;{{
          dialogType === 'create' ? '保存' : '确定' }}</el-button> -->
      </div>
    </template>
  </ep-dialog>
</template>

<script setup>
import { paramConfignoAuthorizeList, paramConfignoAuthorizeTree } from '@/api/materialAccept/acceptMaterial'
import { tableJsonArrroval } from "../tableJson"
import { getLocalStorage } from '@/utils/auth'
const { proxy } = getCurrentInstance()
const tableJsonArr = ref(JSON.parse(getLocalStorage(proxy.$route.meta?.menuId)) || tableJsonArrroval)

const props = defineProps({
    rowData: {
        type: Object,
        default: () => { }
    }
})


const approvalVisible = defineModel({ default: false })

watch(approvalVisible, (newVal) => {
  if (newVal) {
    getList()
  } else {
    formData.value = Object.assign({})
  }
})

const tableData = ref([])
const loading = ref(false)
const total = ref(0)


const title = ref('审批详情')
const queryParams = ref({
  pageNum: 1,
  pageSize: 30
})
const formData = ref({})

const emit = defineEmits(['createSuccess', 'selectData']);



const getList = async () => {
  loading.value = true
  //查询物资目录列表
  paramConfignoAuthorizeList({ ...formData.value, ...queryParams.value }).then(({ data }) => {
    tableData.value = data.list || []
    total.value = data.total
  }).finally(() => {
    loading.value = false
  })
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