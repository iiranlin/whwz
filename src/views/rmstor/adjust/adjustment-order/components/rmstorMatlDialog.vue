<template>
  <ep-dialog class="ep-dialog-list" title="选择物资" iconTitle="form" v-model="visible" width="85vw" top="5vh"
    append-to-body>
    <div class="sso-front-table-container app-container">
      <el-row :gutter="20" class="app-container-row integrated-manage-pane-form integrated-manage-pane-form-a">
        <el-col class="app-container-col">
          <el-form :model="queryParams" ref="elForm" :inline="true" label-width="100px" class="form-data">
            <el-row>
              <el-col :span="5">
                <el-form-item label="物资编码：" prop="matlCode">
                  <el-input v-model.trim="queryParams.matlCode" placeholder="请输入" style="width: 175px;" />
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="物资名称：" prop="matlName">
                  <el-input v-model.trim="queryParams.matlName" placeholder="请输入" style="width: 175px;" />
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="规格型号：" prop="matlType">
                  <el-input v-model.trim="queryParams.matlType" placeholder="请输入" style="width: 175px;" />
                </el-form-item>
              </el-col>
              <el-col :span="5" style="display: flex;justify-content: center;">
                <el-form-item label="" prop="isRepertory">
                  <el-radio-group v-model="queryParams.isRepertory">
                    <el-radio value="1" @click.stop.prevent="handleChange('1')">库存不为0</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="4" class="form-right" style="display: flex;justify-content: flex-end;">
                <el-button type="primary" @click="getList" class="search-btn"><svg-icon
                    icon-class="search" />&nbsp;查询</el-button>
                <el-button type="default" @click="resetQuery('1')" class="reset-btn"><svg-icon
                    icon-class="Line-Refresh" />&nbsp;重置</el-button>
              </el-col>
            </el-row>
          </el-form>
          <el-divider style="margin-top: 0px"></el-divider>
          <!-- 表格数据 -->
          <table-index class="table-index" :loading="loading" :idName="idName" :queryParams="queryParams"
            :tableJson="rmstorMatlTableJson" :tableData="tableData" @handleSelectionChange="handleSelectionChange"
            :selectable="handleSelectable">
          </table-index>
          <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
            v-model:limit="queryParams.pageSize" @pagination="getList" />

        </el-col>
      </el-row>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="visible = false" class="cancel-btn"><svg-icon icon-class="cancel" />&nbsp;关闭</el-button>
        <el-button type="primary" class="determine-btn" @click="saveBtn"><svg-icon
            icon-class="determine" />&nbsp;保存</el-button>
      </div>
    </template>
  </ep-dialog>
</template>

<script setup>

import { rmstorMatlTableJson } from "../tableJson"
import { rmstorMatlSelectPageList } from '@/api/rmstor/price-adjustment'
import { warehouseDictListAll } from '@/api/warehouse/warehouseDict'
import { generateUUID } from '@/utils'
const { proxy } = getCurrentInstance()

const visible = ref(false)
const loading = ref(false)
const tableData = ref([])
const idName = ref('uid')
const ids = ref([])
const selectionData = ref([])
const selectableData = ref([])
const single = ref(true)
const multiple = ref(true)
const total = ref(0)


const data = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 30,
    matlCode: '',
    matlName: '',
    matlType: '',
    isRepertory: ''
  },
  formSelectData: {
    depotCode: []
  },
})

const { queryParams, formSelectData } = toRefs(data)

// 声明触发的事件（可选，增强类型校验）
const emit = defineEmits(['selectChange']);

// 显示弹框
const show = async ({ partitionCode, depotCode }, list = []) => {
  visible.value = true
  resetQuery('')
  queryParams.value.partitionCode = partitionCode
  queryParams.value.depotCode = depotCode
  selectableData.value = list
  const { data } = await warehouseDictListAll()
  formSelectData.value.depotCode = data.map(item => {
    return { ...item, label: item.whName, value: item.whCode }
  })
  getList()
}

/** 查询列表 */
function getList() {
  loading.value = true
  rmstorMatlSelectPageList(queryParams.value).then(({ data }) => {
    tableData.value = (data.list || []).map(a => { return { ...a, uid: generateUUID() } })
    total.value = data.total
  }).finally(() => {
    loading.value = false
  })
}

/** 重置按钮操作 */
function resetQuery(val) {
  queryParams.value.pageNum = 1
  queryParams.value.matlCode = ''
  queryParams.value.matlName = ''
  queryParams.value.matlType = ''
  queryParams.value.isRepertory = ''
  if(val === '1'){
     getList()
  }
}

/** 多选框选中数据 */
function handleSelectionChange(selection) {
  selectionData.value = selection
  ids.value = selection.map(item => item[idName.value])
  single.value = selection.length != 1
  multiple.value = !selection.length
}

const handleSelectable = (row) => {
  const idArr = selectableData.value.map(a => a.matlCode + a.matlUnit + a.cardPrice)
  return !idArr.includes(row.matlCode + row.matlUnit + row.cardPrice)
}

const saveBtn = () => {
  if (!selectionData.value.length) {
    proxy.$modal.msgWarning('请选择数据')
    return
  }
  emit('selectChange', selectionData.value)
  visible.value = false
}

const handleChange = (val) => {
  if (queryParams.value.isRepertory === val) {
    queryParams.value.isRepertory = ''
  } else {
    queryParams.value.isRepertory = val
  }
}


defineExpose({
  show,
})
</script>
<style lang="scss" scoped>
.form-data {
  // height: 100px;
  margin-top: 10px;
}
</style>