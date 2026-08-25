<template>
  <ep-dialog class="ep-dialog-list" title="详情" iconTitle="form" v-model="visible" width="1300px" top="5vh" append-to-body isFullscreen>
     <div class="sso-front-table-container app-container">
      <el-row :gutter="20" class="app-container-row integrated-manage-pane-form integrated-manage-pane-form-a">
        <el-col class="app-container-col">
          <el-divider content-position="center">合同信息</el-divider>
          <el-descriptions :column="4" border style="margin-bottom: 15px" label-width="150px">
            <el-descriptions-item label="合同编号：" label-align="right">{{rowData.scontCode}}</el-descriptions-item>
            <el-descriptions-item label="合同号：" label-align="right">{{rowData.scontractCode}}</el-descriptions-item>
            <el-descriptions-item label="合同名称：" label-align="right">{{rowData.scontName}}</el-descriptions-item>
            <el-descriptions-item label="采购单位：" label-align="right">{{rowData.spurcUnitName}}</el-descriptions-item>

            <el-descriptions-item label="供应商：" span="2" label-align="right">{{rowData.ssuCode}} {{rowData.ssuName}}</el-descriptions-item>
            <el-descriptions-item label="付款单位：" label-align="right">{{rowData.spayUnitName}}</el-descriptions-item>
            <el-descriptions-item label="款源：" label-align="right">{{rowData.sectionInformation}}</el-descriptions-item>

            <el-descriptions-item label="买方签字人：" label-align="right">{{rowData.ssignatina}}</el-descriptions-item>
            <el-descriptions-item label="卖方签字人：" label-align="right">{{rowData.ssignatinb}}</el-descriptions-item>
            <el-descriptions-item label="是否含税：" label-align="right">{{rowData.staxFlag === "1" ? "是" : (rowData.staxFlag === "0" ? "否" : "")}}</el-descriptions-item>
            <el-descriptions-item label="税率(%)：" label-align="right">{{rowData.nTaxrate}}</el-descriptions-item>

            <el-descriptions-item label="签约日期：" label-align="right">{{rowData.dcontSignDate}}</el-descriptions-item>
            <el-descriptions-item label="合同生效日期：" label-align="right">{{rowData.dinureDate}}</el-descriptions-item>
            <el-descriptions-item label="合同截止日期：" label-align="right">{{rowData.dabateDate}}</el-descriptions-item>
            <el-descriptions-item label="采购方式(结果)：" label-align="right">{{rowData.purcTypeName}}</el-descriptions-item>

            <el-descriptions-item label="预付款金额：" label-align="right">{{rowData.nadvanceAmount}}</el-descriptions-item>
            <el-descriptions-item label="预付款日期：" label-align="right">{{rowData.dadvanceDate}}</el-descriptions-item>
            <el-descriptions-item label="合同金额：" label-align="right">
              <span style="font-weight: 800">{{rowData.ncontAmount}}</span>
            </el-descriptions-item>
            <el-descriptions-item label="采购方式(发起)：" label-align="right">{{rowData.spupcTypeName}}</el-descriptions-item>

            <el-descriptions-item label="采购种类：" label-align="right">{{rowData.spurcTypeName}}</el-descriptions-item>
            <el-descriptions-item label="合同属性：" label-align="right">
              <span v-if="rowData.skindFlag == '0'">协议合同</span>
              <span v-if="rowData.skindFlag == '1'">数量合同</span>
              <span v-if="rowData.skindFlag =='2'">代储合同</span>
            </el-descriptions-item>
            <el-descriptions-item label="变更合同号：" label-align="right">{{rowData.scontChangeCode}}</el-descriptions-item>

            <el-descriptions-item label="是否公开采购：" label-align="right">{{rowData.sisOpenpurchasing === "1" ? "是" : (rowData.sisOpenpurchasing === "0" ? "否" : "")}}</el-descriptions-item>
            <el-descriptions-item label="是否配件中心协议：" label-align="right">{{rowData.sisAgreement === "1" ? "是" : (rowData.sisAgreement === "0" ? "否" : "")}}</el-descriptions-item>

            <el-descriptions-item label="供应区域：" label-align="right">{{rowData.ssupplyarea}}</el-descriptions-item>

            <el-descriptions-item label="项目编号：" label-align="right">{{rowData.projectCode}}</el-descriptions-item>
            <el-descriptions-item label="项目名称：" label-align="right">{{rowData.projectName}}</el-descriptions-item>

            <el-descriptions-item label="变更理由：" label-align="right">{{rowData.changeReason}}</el-descriptions-item>
            <el-descriptions-item label="备注：" label-align="right">{{rowData.scomments}}</el-descriptions-item>
          </el-descriptions>

          <el-divider content-position="center">合同明细</el-divider>
          <form-data ref="formDataRef" :queryParams="queryParams" :showSearch="showSearch" :isShowMore="false" :formJson="scontFormJson" @handleQuery="handleQuery" :formSelectData="formSelectData"
            @resetQuery="resetQuery" labelWidth="70"></form-data>
          <!-- 表格数据 -->
          <table-index class="table-index" :loading="loading" :selectionShow="false" :queryParams="queryParams" :tableJson="scontTableJson" :tableData="tableData">
          <template #seffeFlag="{ scope }">
            <el-tag :type="scope.row.seffeFlag === '0' ? 'info' : 'success'" disable-transitions>{{scope.row.seffeFlag === '0' ? '无效':'有效'}}</el-tag>
          </template>

          </table-index>

          <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
            v-model:limit="queryParams.pageSize" @pagination="getList" />

        </el-col>
      </el-row>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="visible = false" class="cancel-btn"><svg-icon icon-class="cancel" />&nbsp;关闭</el-button>
      </div>
    </template>
  </ep-dialog>
</template>

<script setup>
import { scontFormJson } from "../formJson"
import { scontTableJson } from "../tableJson"
import { get_contract_detail_by_page, getMtByPage } from '@/api/warehouse/rmpcsContractMt'
const { proxy } = getCurrentInstance()

const visible = ref(false)
const loading = ref(false)
const tableData = ref([])
const showSearch = ref(true)
const total = ref(0)

const data = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 30,
    mtId: ''
  },
  formSelectData: {
    billCode: []
  },
  rowData: {}
})

const { queryParams, formSelectData, rowData } = toRefs(data)

// 声明触发的事件（可选，增强类型校验）
const emit = defineEmits(['selectChange']);

// 显示弹框
const show = async (scontractCode, mtId = '') => {
  visible.value = true
  queryParams.value.mtId = mtId
  getMtByPageList(scontractCode)
  getList()
}

/** 查询列表 */
function getMtByPageList(scontractCode) {
  getMtByPage({scontractCode}).then(({ data }) => {
    rowData.value = data.list[0] || {}
  })
}

/** 查询列表 */
function getList() {
  loading.value = true
  get_contract_detail_by_page(queryParams.value).then(({ data }) => {
    tableData.value = data.list || []
    total.value = data.total
  }).finally(() => {
    loading.value = false
  })
}

/** 搜索按钮操作 */
function handleQuery(data) {
  queryParams.value.pageNum = 1
  queryParams.value = Object.assign({}, queryParams.value, data)
  getList()
}

/** 重置按钮操作 */
function resetQuery(data) {
  handleQuery(data)
}

defineExpose({
  show,
})
</script>
<style lang="scss" scoped>
</style>