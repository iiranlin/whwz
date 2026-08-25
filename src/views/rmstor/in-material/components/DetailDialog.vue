<template>
    <ep-dialog :title="title" iconTitle="form" v-model="playBatchVisible" width="90vw" top="5vh" append-to-body
        :close-on-press-escape="false" :close-on-click-model="false">
        <el-form class="form-wrapper" :model="formData" :rules="rules" ref="elForm" :inline="true" label-width="120px">
        <el-row class="form-left flex1">
          <el-col :span="8">
            <el-form-item label="进库料单号：" prop="imCode">
              <el-input v-model.trim="formData.imCode" placeholder="请输入进库料单号" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="地区：" prop="plantName">
              <el-input v-model.trim="formData.plantName" placeholder="请输入" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="仓库：" prop="depotName">
              <el-input v-model.trim="formData.depotName" placeholder="请输入" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="采购订单号：" prop="spdCode">
              <el-input v-model.trim="formData.spdCode" placeholder="请输入" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="供货单位：" prop="suName">
              <el-input v-model.trim="formData.suCode" style="width:150px;" readonly :disabled="true"/>
              <el-input v-model.trim="formData.suName" placeholder="请输入供货单位" readonly :disabled="true" style="width:400px;" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="发货地点：" prop="startStation">
              <el-input v-model.trim="formData.startStation" placeholder="请输入发货地点" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="到货地点：" prop="arrStation">
              <el-input v-model.trim="formData.arrStation" placeholder="请输入到货地点" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="运单号：" prop="carryCode">
              <el-input v-model.trim="formData.carryCode" placeholder="请输入运单号" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="包装物：" prop="packages">
              <el-input v-model.trim="formData.packages" placeholder="请输入包装物" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="件数：" prop="pieces">
              <el-input v-model.trim="formData.pieces" placeholder="请输入件数" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="交料人：" prop="sender">
              <el-input v-model.trim="formData.sender" placeholder="请输入交料人" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="包装状况：" prop="packageState">
              <el-input v-model.trim="formData.packageState" placeholder="请输入包装状况" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="进库日期：" prop="inDate">
              <el-date-picker v-model.trim="formData.inDate" type="date" placeholder="请选择进库日期" :size="size" :disabled="true"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="备注：" prop="comments">
              <el-input v-model.trim="formData.comments" placeholder="请输入" :disabled="true" />
            </el-form-item>
          </el-col>
          
        </el-row>
      </el-form>
        <!-- 表格列表 -->
        <div class="sso-front-table-container2">
            <div class="app-container app-container-splitpanes" style="padding: 0;">
                <table-index class="table-index" :loading="loading" :queryParams="queryParams" :tableJson="tableJsonArr"
                   :selectionShow="false" :tableData="tableData"
                    operationWidth="150" @handleButtonClick="handleButtonClick">
                </table-index>

                 <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
                  v-model:limit="queryParams.pageSize" @pagination="getList" />
            </div>
        </div>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="playBatchVisible = false" class="cancel-btn"><svg-icon
                        icon-class="cancel" />&nbsp;关闭</el-button>
            </div>
        </template>
    </ep-dialog>
</template>

<script setup>
import { materialDetail } from '@/api/inMaterial/inMaterialGroup'
import { tableJsonDetail, tableGroupButtonJson } from "../tableJson"
import { Search } from '@element-plus/icons-vue'
import { getLocalStorage } from '@/utils/auth'
const { proxy } = getCurrentInstance()
const tableJsonArr = ref(JSON.parse(getLocalStorage(proxy.$route.meta?.menuId)) || tableJsonDetail)
const props = defineProps({
    rowData: {
        type: Object,
        default: () => { }
    }
})



const playBatchVisible = defineModel({ default: false })

const title = ref('进库料信息详情')

const emit = defineEmits(['createSuccess']);

watch(playBatchVisible, (newVal) => {
    if (newVal) {
        getList()
    }
})
const tableData = ref([]); // 表格数据
const formData = ref([]); // 表单数据
const loading = ref(false)
const total = ref(0)

const queryParams = ref({
    pageNum: 1,
    pageSize: 30
})

const getList = async () => {
    loading.value = true
    materialDetail(props.rowData.immtId).then(({ data }) => {
        tableData.value = data.rmstorImdtList || []
        formData.value = data
        total.value = data.total
    }).finally(() => {
        loading.value = false
    })
}
const historyVisible = ref(false)
const rowData = ref({})
const handleButtonClick = (code, { row }) => {
    if (code === 'modify') {
        historyVisible.value = true
        rowData.value = row
    }
}
</script>
<style lang="scss" scoped>
.sso-front-table-container2 {
    height: 70vh;
    border: none;
    margin: 0;
    display: flex;
    flex-direction: column;
    padding: 10px;
}
</style>