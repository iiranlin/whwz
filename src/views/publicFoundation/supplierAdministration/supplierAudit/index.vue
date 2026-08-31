<template>
  <div class="app-container app-container-splitpanes">
    <el-row :gutter="20" class="app-container-row integrated-manage-pane-form integrated-manage-pane-form-a">
      <el-col class="app-container-col">
    <el-pro-table ref="proTableRef" v-loading="loading" action-width="220" :page-size="30" :data="tableData"
      :total="total" :columns="columns" :toolbar-config="toolbarConfig" :grid-options="{ rowId: idName }"
      :table-id="menuId" @search="onSearch" @action="onAction">
    </el-pro-table>
      </el-col>
    </el-row>

    <operate ref="operateRef" />

    <ep-dialog title="驳回意见" v-model="rejectVisible" width="480px" append-to-body>
      <el-form ref="rejectFormRef" :model="rejectForm" :rules="rejectRules" label-width="90px">
        <el-form-item label="驳回意见：" prop="comment">
          <el-input v-model="rejectForm.comment" type="textarea" :rows="4" maxlength="500" placeholder="请输入驳回意见" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitReject">确 定</el-button>
          <el-button @click="rejectVisible = false">取 消</el-button>
        </div>
      </template>
    </ep-dialog>
  </div>
</template>

<script setup name="supplierAudit">
import { columns, toolbarConfig } from "./tableJson"
import Operate from "../supplierArchives/components/operate"
import { supplierList, supplierAudit } from '@/api/base/supplier'

const { proxy } = getCurrentInstance()

const menuId = ref(proxy.$route.meta?.menuId)
const tableData = ref([])
const loading = ref(false)
const idName = ref('suId')
const total = ref(0)

const data = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 30,
    status: '2'
  }
})

const { queryParams } = toRefs(data)

const rejectVisible = ref(false)
const rejectRow = ref(null)
const rejectForm = reactive({ comment: '' })
const rejectRules = {
  comment: [{ required: true, message: '请输入驳回意见', trigger: 'blur' }]
}

/** 查询列表（仅审核中 status=2） */
function getList() {
  loading.value = true
  supplierList(queryParams.value).then(({ data }) => {
    tableData.value = data.list || []
    total.value = data.total || 0
  }).finally(() => {
    loading.value = false
  })
}

/** 搜索 */
function onSearch(form, pageInfo) {
  queryParams.value = { ...form, ...pageInfo, status: '2' }
  getList()
}

/** 通过 */
function handlePass(row) {
  proxy.$modal.confirm('是否确认审核通过?').then(() => {
    loading.value = true
    return supplierAudit(row.suId, '3', '')
  }).then(({ message }) => {
    proxy.$modal.msgSuccess(message || '审核通过')
    getList()
  }).catch(() => {
  }).finally(() => {
    loading.value = false
  })
}

/** 驳回（弹窗填意见） */
function handleReject(row) {
  rejectRow.value = row
  rejectForm.comment = ''
  rejectVisible.value = true
}

function submitReject() {
  proxy.$refs.rejectFormRef.validate(valid => {
    if (!valid) return
    loading.value = true
    supplierAudit(rejectRow.value.suId, '0', rejectForm.comment).then(({ message }) => {
      proxy.$modal.msgSuccess(message || '已驳回')
      rejectVisible.value = false
      getList()
    }).finally(() => {
      loading.value = false
    })
  })
}

/** 详情（只读） */
function handleDetail(row) {
  proxy.$refs.operateRef.init('detail', row.suId)
}

const onAction = (payload) => {
  const { code, row } = payload
  const eventObj = {
    pass: () => handlePass(row),
    reject: () => handleReject(row),
    detail: () => handleDetail(row)
  }
  eventObj[code] && eventObj[code]()
}

getList()
</script>
