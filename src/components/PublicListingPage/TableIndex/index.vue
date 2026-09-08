<template>
  <!-- 表格数据 -->
  <el-table :class="{ 'myTable': props.singleMode }" ref="elTable" v-loading="loading" border fit stripe highlight-current-row :data="tableData" @sort-change="sortableColumnChange"
    @selection-change="handleSelectionChange" @row-click="rowClick" :height="height" :row-key="idName" :row-style="rowSetStyle" :header-cell-style="{'text-align':'center'}">
    <el-table-column type="selection" fixed="left" width="55" align="center" v-if="selectionShow"
      :reserve-selection="reserveSelection" :selectable="handleSelectable" />
    <el-table-column type="index" label="序号" :index="tableIndex" :width="indexWidth" align="center" />
    <template v-for="item in tableJson">
      <el-table-column v-if="item.isShow" :key="item.key" :type="item.type" :prop="item.prop" :fixed="item.fixed"
        :label="item.label" :min-width="item.width" show-overflow-tooltip :align="item.align || align" :sortable="item.sortable || false">
        <template #header v-if="item.required && required">
          <span>{{ item.label }}</span>
          <span class="span-red">*&nbsp;</span>
        </template>
        <template #default="scope">
          <slot v-if="item.type === 'slot'" :name="item.prop" :scope="{$index: scope.$index, row: scope.row, stats: item.stats }"></slot>
          <span v-else-if="item.type === 'date'">{{ parseTime(scope.row[item.prop], item.timeFormat || "{y}-{m}-{d}")
            }}</span>
          <span v-else-if="item.type === 'dict'">{{ item.stats?item.stats[scope.row[item.prop]] : tableDataDict[item.prop][scope.row[item.prop]]}}</span>
          <el-link v-else-if="item.type === 'link'" type="primary" @click.stop="clickLink(item.prop, scope.row)"
            class="el-link-span"><el-icon
              v-if="['invoiceNameXml', 'invoiceNamePdf'].includes(item.prop) && !scope.row[item.prop]">
              <CirclePlusFilled />
            </el-icon>{{ scope.row[item.prop] }}</el-link>
          <el-switch v-else-if="item.type === 'switch'" v-model="scope.row[item.prop]" active-value="1"
            inactive-value="0" @change="switchChange(item.prop, scope.row)"></el-switch>
          <span v-else>{{ scope.row[item.prop] }}</span>
        </template>
      </el-table-column>
    </template>
    <el-table-column label="操作" fixed="right" align="center" v-if="tableButtonData.length"
      :width="`${operationWidth}px`">
      <template #default="scope">
        <template v-for="item in tableButton">
          <slot v-if="item.slot" :name="item.code" :scope="scope"></slot>
          <el-button v-else :type="!handleButtonDisable(item.code, scope.row)?'':'primary'" link @click.stop="handleButtonClick(item.code, scope)" :key="item.code"
            :disabled="!handleButtonDisable(item.code, scope.row)" v-show="handleButtonShow(item.code, scope.row)">{{ item.name }}</el-button>
        </template>
        <el-dropdown @command="handleCommand" style="padding: 8px 15px;" v-if="tableButtons.length > 0">
          <span class="el-dropdown-link">
            更多
            <el-icon class="el-icon--right">
              <arrow-down />
            </el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <div v-for="item in tableButtons" :key="item.code" style="border: 0;">
                <el-dropdown-item :command="{ scope, code: item.code }"
                  :disabled="!handleButtonDisable(item.code, scope.row)" v-if="handleButtonShow(item.code, scope.row)">
                  <slot v-if="item.slot" :name="item.code" :scope="scope"></slot>
                  <el-button v-else :type="!handleButtonDisable(item.code, scope.row)?'':'primary'" link :disabled="!handleButtonDisable(item.code, scope.row)"> {{ item.name
                    }}</el-button>
                </el-dropdown-item>
              </div>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup>
const { proxy } = getCurrentInstance()

// 接收参数并指定类型（可选）
const props = defineProps({
  loading: Boolean,
  required: {
    type: Boolean,
    default: true
  },
  singleMode: {
    type: Boolean,
    default: false
  },
  height: {
    type: String,
    default: '100%'
  },
  indexWidth: {
    type: String,
    default: '55'
  },
  align: {
    type: String,
    default: ''
  },
  queryParams: {
    type: Object,
    default: {}
  },
  idName: {
    type: String,
    default: 'id'
  },
  selectionShow: {
    type: Boolean,
    default: true
  },
  reserveSelection: {
    type: Boolean,
    default: false
  },
  tableJson: {
    type: Array,
    default: []
  },
  tableButtonJson: {
    type: Array,
    default: []
  },
  tableData: {
    type: Array,
    default: []
  },
  operationWidth: {
    type: String,
    default: '100'
  },
  buttonDisable: {
    type: Function,
    default: null
  },
  buttonShow: {
    type: Function,
    default: null
  },
  tableDataDict: {
    type: Object,
    default: null
  },
  selectable: {
    type: Function,
    default: null
  },
  rowStyle: {
    type: Function,
    default: null
  }
})

const selectData = ref([])

const paramsData = ref({ pageNum: 0, pageSize: 0 })

watch(() => props.tableData, val => {
  const propsPageNum = props.queryParams.pageNum
  const propsPageSize = props.queryParams.pageSize
  const paramsPageNum = paramsData.value.pageNum
  const paramsPageSize = paramsData.value.pageSize
  if (paramsPageNum === propsPageNum && paramsPageSize === propsPageSize) {
    proxy.$refs.elTable && proxy.$refs.elTable.clearSelection()
  }
  paramsData.value = Object.assign({}, props.queryParams)
})

const tableButton = ref([])
const tableButtons = ref([])


// 声明触发的事件（可选，增强类型校验）
const emit = defineEmits(['handleSelectionChange', 'handleButtonClick', 'clickLink', 'switchChange', 'handleQuery'])

const tableButtonData = computed(() => {
  if (props.tableButtonJson.length) {
    const tableButtonJson = props.tableButtonJson.filter(item => item.type === 'inline')
    if (tableButtonJson.length == 4) {
      tableButton.value = tableButtonJson
    } else {
      tableButton.value = tableButtonJson.slice(0, 3)
      tableButtons.value = tableButtonJson.slice(3, tableButtonJson.length)
    }
    return tableButtonJson
  }
  return []
})

const tableIndex = (index) => {
  if (props.queryParams.pageNum && props.queryParams.pageSize) {
    return (props.queryParams.pageNum - 1) * props.queryParams.pageSize + index + 1
  } else {
    return index + 1
  }
}

const rowSetStyle = ({ row, rowIndex }) => {
  if (row.background) {
    return {background: row.background}
  }
  if (props.rowStyle) {
    return props.rowStyle(row, rowIndex)
  }
  return {}
}


const sortableColumnChange = ({ order, prop }) => {
  if (order) {
    props.queryParams.isAsc = order === "descending" ? "desc" : "asc";
    props.queryParams.orderBy = prop;
  } else {
    props.queryParams.isAsc = "";
    props.queryParams.orderBy = "";
  }
  emit('handleQuery', props.queryParams)
}

const handleButtonDisable = (code, row) => {
  if (props.buttonDisable) {
    return props.buttonDisable(code, row)
  } else {
    return true
  }
}

const handleButtonShow = (code, row) => {
  if (props.buttonShow) {
    return props.buttonShow(code, row)
  } else {
    return true
  }
}

const handleSelectable = (row) => {
  if (props.selectable) {
    return props.selectable(row)
  } else {
    return true
  }
}

const handleSelectionChange = (data) => {
  if (data.length > 1 && props.singleMode) {
    const preRow = data[0]
    data.splice(0, 1)
    proxy.$refs.elTable.toggleRowSelection(preRow, false)
  }
  selectData.value = data
  emit('handleSelectionChange', data)
}

const rowClick = (row) => {
  if(!handleSelectable(row)){
    return
  }
  if (props.singleMode) {
    // 单选选中行
    proxy.$refs.elTable.toggleRowSelection(row, true)
  } else {
    const selected = selectData.value.some(item => item[props.idName] === row[props.idName])
    if (!selected) {
      proxy.$refs.elTable.toggleRowSelection(row, true)
    } else {
      proxy.$refs.elTable.toggleRowSelection(row, false)
    }
  }
}

const handleButtonClick = (code, scope) => {
  emit('handleButtonClick', code, scope)
}
const handleCommand = (data) => {
  emit('handleButtonClick', data.code, data.scope)
}

const clickLink = (code, data) => {
  emit('clickLink', code, data)
}

const switchChange = (code, data) => {
  emit('switchChange', code, data)
}
</script>
<style lang="scss" scoped>
.el-link-span {
  max-width: 100%;

  :deep(span) {
    display: block;
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

:deep(.ep-table__body) {
  min-height: 1px;
}
</style>
