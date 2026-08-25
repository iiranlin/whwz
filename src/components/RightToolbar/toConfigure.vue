<template>
  <el-dialog class="dialog" :close-on-click-modal="false" v-model="dialogVisible" :append-to-body="true">
    <template #header>
      <span><svg-icon icon-class="Line-Filter" /> 列表配置</span>
    </template>
    <div class="sso-front-table-container">
      <el-table class="table-wrapper table-sortable" ref="elTable" height="100%" :data="tableJsonArr" border fit stripe
        @selection-change="handleSelectionChange" :highlight-current-row="false" row-key="prop">
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column label="列名称" align="center" prop="label" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="操作" align="center" width="350">
          <template #default="scope">
            <el-button type="primary" link><el-switch v-model="scope.row.fixed" active-color="#00aaf3"
                inactive-color="#d0d0d0"></el-switch>&nbsp;锁定</el-button>
            <el-button type="primary" link @click="upwardClick(scope.row, scope.$index)"
              :disabled="scope.$index === 0"><svg-icon icon-class="Upward" />&nbsp;向上</el-button>
            <el-button type="primary" link @click="downClick(scope.row, scope.$index)"
              :disabled="getFormLength(scope.$index)"><svg-icon icon-class="down" />&nbsp;向下</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button class="cancel-btn" @click="dialogVisible = false"><svg-icon
            icon-class="cancel" />&nbsp;取消</el-button>
        <el-button class="determine-btn" type="primary" @click="determineClick"><svg-icon
            icon-class="determine" />&nbsp;确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import Sortable from 'sortablejs'
import { setLocalStorage } from '@/utils/auth'
const { proxy } = getCurrentInstance()

// 接收参数并指定类型（可选）
const props = defineProps({
  tableJson: {
    type: Array,
    default: []
  },
  menuId: {
    type: String,
    default: ''
  }
})

const dialogVisible = ref(false)
const selectionData = ref([])
const tableJsonArr = ref([])

// 声明触发的事件（可选，增强类型校验）
const emit = defineEmits(['tabConfigSuccess'])



const rowDrop = () => {
  const tbody = document.querySelector('.table-sortable .ep-table__body-wrapper tbody');
  Sortable.create(tbody, {
    onEnd({ newIndex, oldIndex }) {
      const currRow = tableJsonArr.value.splice(oldIndex, 1)[0];
      tableJsonArr.value.splice(newIndex, 0, currRow);
    }
  })
}

const init = () => {
  dialogVisible.value = true
  tableJsonArr.value = [...props.tableJson]
  proxy.$nextTick(() => {
    tableJsonArr.value.forEach(row => {
      if (row.isShow) {
        proxy.$refs.elTable && proxy.$refs.elTable.toggleRowSelection(row, true);
      }
    })
    rowDrop()
  })
}

const getFormLength = (index) => {
  if (index === tableJsonArr.value.length - 1) return true
  else return false
}
const upwardClick = (row, index) => {
  tableJsonArr.value.splice(index - 1, 0, row)
  tableJsonArr.value.splice(index + 1, 1)
}
const downClick = (row, index) => {
  tableJsonArr.value.splice(index + 2, 0, row)
  tableJsonArr.value.splice(index, 1)
}

const handleSelectionChange = (data) => {
  selectionData.value = data
}

const determineClick = () => {
  if (!selectionData.value.length) {
    proxy.$modal.msgWarning('请勾选要保留的字段')
    return
  }
  tableJsonArr.value.forEach(item => {
    item.isShow = false
    selectionData.value.forEach(row => {
      if (row.prop === item.prop) {
        item.isShow = true
      }
    })
  })
  setLocalStorage(props.menuId || proxy.$route.meta?.menuId, JSON.stringify(tableJsonArr.value))
  dialogVisible.value = false
  emit('tabConfigSuccess', tableJsonArr.value)
}

defineExpose({
  init,
})
</script>

<style lang="scss" scoped>
:deep(td.ep-table__cell) {
  background: #fff !important;
}
</style>
