<template>
  <ep-dialog class="dialog" iconTitle="form" title="版本记录" v-model="visible" width="800px" top="5vh" append-to-body
    :close-on-click-modal="false" @close="cancelOpenVersionRecord">
    <div class="sso-front-table-container app-container">
      <el-table :data="versionRecordTableData" :height="height" border fit stripe highlight-current-row>
        <el-table-column v-for="item in tabColumns" :key="item.prop" :prop="item.prop" :label="item.label"
          align="center">
          <template #default="{ row }">
            <span v-if="item.date">{{ parseTime(row[item.prop], '{y}-{m}-{d}') }}</span>
            <span v-else>{{ row[item.prop] }}</span>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页（与 historyDialog.vue 同结构） -->
      <div class="ep-pro-table__pagination">
        <el-pagination
          v-show="total > 0"
          :current-page="listQuery.pageNum"
          :page-size="listQuery.pageSize"
          :total="total"
          :page-sizes="[10, 20, 30, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="visible = false" class="cancel-btn"><svg-icon icon-class="cancel" />&nbsp;关闭</el-button>
      </div>
    </template>
  </ep-dialog>
</template>

<script setup name="versionRecord">
import { parseTime } from '@/utils/generalMethod'
import { getVersionRecord } from '@/api/workflow/category'
// props / emits —— 与 Options API 版本完全一致
const props = defineProps({
  processKey: {
    type: String,
    default: ''
  },
  openVersionRecord: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['update:openVersionRecord', 'linkClick'])

const { proxy } = getCurrentInstance()

// 响应式状态 —— 与原始 data() 完全一致
const visible = ref(false)
const listQuery = reactive({
  pageNum: 1,
  pageSize: 30,
})
const total = ref(0)
const versionRecordTableData = ref([])
const tabColumns = [
  { prop: 'processName', label: '流程名称' },
  { prop: 'version', label: '流程版本' },
  { prop: 'updateUserName', label: '最后修改人' },
  { prop: 'updateDate', label: '最后修改时间' }
]

// computed
const height = computed(() => '50vh')

// —— 业务方法 ——

// 获取版本记录（原始逻辑：loading → 接口 → 成功显示/失败 msgError → 关闭 loading）
async function getList() {
  proxy.$modal.loading()
  try {
    versionRecordTableData.value = []
    const res = await getVersionRecord({
      pageNum: listQuery.pageNum,
      pageSize: listQuery.pageSize,
      processKey: props.processKey
    })
    if (res?.code == 0) {
      total.value = res?.data?.total
      versionRecordTableData.value = res?.data?.list || []
    } else {
      proxy.$modal.msgError(res?.message)
    }
  } catch (e) {
    console.error('versionRecord', e)
  } finally {
    proxy.$modal.closeLoading()
  }
}

// 序号函数
function indexMethod(index) {
  const { pageNum, pageSize } = listQuery
  return (pageNum - 1) * pageSize + (index + 1)
}

// 分页事件（原 sizeChange / indexChange 合并）
function handleSizeChange(size) {
  listQuery.pageSize = size
  getList()
}
function handleCurrentChange(current) {
  listQuery.pageNum = current
  getList()
}

// 关闭弹窗
function cancelOpenVersionRecord() {
  visible.value = false
  updateOpenVersionRecord()
}
function updateOpenVersionRecord() {
  emit('update:openVersionRecord', visible.value)
}

// 链接点击（预留）
function linkClick(row) {
  emit('linkClick', row)
}

// —— watch ——
watch(() => props.openVersionRecord, async (val) => {
  if (val) {
    total.value = 0
    versionRecordTableData.value = []
    visible.value = val
    try { await getList() } catch (e) {}
  }
})

watch(visible, val => {
  if (!val) {
    updateOpenVersionRecord()
  }
})
</script>

<style lang="scss" scoped>
.ep-pro-table__pagination {
  display: flex;
  justify-content: center;
  margin-top: 6px;
  :deep(.ep-pagination__total) {
    font-size: 13px !important;
    color: #909399 !important;
  }
}
</style>
