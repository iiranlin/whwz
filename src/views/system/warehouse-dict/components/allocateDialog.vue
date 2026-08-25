<template>
  <ep-dialog class="dialog" title="物资范围分配" :close-on-click-modal="false" :append-to-body="true" v-model="visible" width="800px">
    <div class="sso-front-table-container app-container">
      <el-form class="form-wrapper" ref="elForm" :inline="true" :model="formData" :rules="formDataRules"
        label-width="94px">
        <div class="form-left flex1">
          <el-form-item prop="firMatlcode" label="前物资分类：">
            <el-input v-model.trim="formData.firMatlcode" v-only-alphanumeric />
          </el-form-item>
          <el-form-item prop="endMatlcode" label="后物资分类：">
            <el-input v-model.trim="formData.endMatlcode" v-only-alphanumeric />
          </el-form-item>
        </div>
        <div class="form-right">
          <el-button type="primary" @click="saveBtn" class="search-btn"><svg-icon icon-class="determine" />&nbsp;保存</el-button>
        </div>
      </el-form>
      
      <!-- 表格数据 -->
      <table-index class="table-index" :selectionShow="false" :queryParams="queryParams" :tableJson="allocateTableJson" :tableButtonJson="allocateTableButtonJson"
        :tableData="tableData" @handleButtonClick="handleButtonClick">
        <template #whCode>
          <span>{{ dialogRow.whCode }}</span>
        </template>
        <template #whName>
          <span>{{ dialogRow.whName }}</span>
        </template>
      </table-index>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="visible = false" class="cancel-btn"><svg-icon icon-class="cancel" />&nbsp;关闭</el-button>
      </div>
    </template>
  </ep-dialog>

</template>
<script setup>
import { allocateTableJson, allocateTableButtonJson } from "../tableJson"
import { warehouseMatlListAll, warehouseMatlCreate, warehouseMatlDeleteBatch } from '@/api/warehouse/warehouseMatl'

const { proxy } = getCurrentInstance()

const visible = ref(false)

const data = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 30
  },
  tableData: [],
  formData: {
    whId: '',
    firMatlcode: '',
    endMatlcode: ''
  },
  formDataRules: {
    firMatlcode: [{ required: true, message: '请输入前物资分类', trigger: 'blur' }],
    endMatlcode: [{ required: true, message: '请输入后物资分类', trigger: 'blur' }],
  },
  dialogRow: {}
})

const { queryParams, tableData, formData, formDataRules, dialogRow } = toRefs(data)

const getWarehouseMatlListAll = () => {
  proxy.$modal.loading()
  warehouseMatlListAll({whId: formData.value.whId}).then(({ data }) => {
    tableData.value = data
  }).finally(() => {
    proxy.$modal.closeLoading()
  })
}

// 显示弹框
function show(row = {}) {
  visible.value = true
  dialogRow.value = row
  proxy.$nextTick(() => {
    proxy.$refs.elForm && proxy.$refs.elForm.resetFields()
    formData.value.whId = row.id
    getWarehouseMatlListAll()
	})
}

const handleButtonClick = (code, { row }) => {
  const eventObj = {
    delete: () => {
      proxy.$modal.loading()
      warehouseMatlDeleteBatch({ids: [row.id]}).then( ({message}) => {
        proxy.$modal.msgSuccess(message)
        getWarehouseMatlListAll()
      }).finally( () => {
        proxy.$modal.closeLoading()
      })
    }
  }
  eventObj[code] && eventObj[code]()
}

const saveBtn = () => {
  proxy.$refs.elForm.validate(valid => {
    if (valid) {
      proxy.$modal.loading()
      warehouseMatlCreate(formData.value).then( ({message}) => {
        proxy.$modal.msgSuccess(message)
        proxy.$refs.elForm && proxy.$refs.elForm.resetFields()
        getWarehouseMatlListAll()
      }).finally( () => {
        proxy.$modal.closeLoading()
      })
    }
  })
}

defineExpose({
  show,
})
</script>
<style lang="scss" scoped>
.form-right{
  height: 50px;
}
</style>