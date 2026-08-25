<template>
  <div class="ep-pro-table">
    <!-- 搜索区 -->
    <el-form
      v-if="searchColumns.length > 0"
      :model="searchForm"
      :inline="true"
      class="ep-pro-table__search"
      @submit.prevent
    >
      <el-form-item v-for="col in searchColumns" :key="col.field" :label="col.title + '：'">
        <el-input
          v-if="col.searchType === 'input' || !col.searchType"
          v-model="searchForm[col.field]"
          placeholder="请输入"
          clearable
          style="width: 200px"
          @keyup.enter="handleSearch"
        />
        <el-select
          v-else-if="col.searchType === 'select'"
          v-model="searchForm[col.field]"
          placeholder="请选择"
          clearable
          :filterable="col.filterable || false"
          :multiple="col.multiple"
          style="width: 200px"
        >
          <el-option
            v-for="opt in getOptions(col)"
            :key="opt.value"
            :label="opt.label"
            :value="opt.value"
          />
        </el-select>
        <el-date-picker
          v-else-if="col.searchType === 'dateRange'"
          v-model="searchForm[col.field]"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="YYYY-MM-DD"
          style="width: 240px"
        />
        <el-date-picker
          v-else-if="col.searchType === 'date'"
          v-model="searchForm[col.field]"
          type="date"
          placeholder="选择日期"
          value-format="YYYY-MM-DD"
          style="width: 200px"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">查询</el-button>
        <el-button @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 顶部工具栏 -->
    <div v-if="topButtons.length > 0" class="ep-pro-table__toolbar">
      <el-button
        v-for="btn in topButtons"
        :key="btn.code"
        :type="btn.type || 'primary'"
        :disabled="btn.disabled ? btn.disabled(selectedRows) : false"
        @click="emitAction(btn.code)"
      >{{ btn.name }}</el-button>
    </div>

    <!-- 表格：外层定高容器 + 表格内部滚动，避免数据行撑长页面 -->
    <div class="ep-pro-table__body">
    <el-table
      v-loading="loading"
      :data="data"
      border
      fit
      stripe
      height="100%"
      highlight-current-row
      :row-key="rowId"
      :row-style="rowStyle"
      @selection-change="handleSelectionChange"
      @row-click="handleRowClick"
    >
      <el-table-column v-if="showCheckbox" type="selection" fixed="left" width="55" align="center" :reserve-selection="reserveSelection" />
      <el-table-column type="index" label="序号" width="55" align="center" />
      <template v-for="col in tableColumns">
        <el-table-column
          v-if="col.type !== 'slot'"
          :key="col.field"
          :prop="col.field"
          :label="col.title"
          :min-width="col.minWidth"
          :width="col.width"
          :align="col.align || 'center'"
          :fixed="col.fixed"
          show-overflow-tooltip
        >
          <template #default="scope">
            <el-tag v-if="col.type === 'dict'">{{ dictLabel(col, scope.row[col.field]) }}</el-tag>
            <el-link v-else-if="col.type === 'link'" type="primary" @click.stop="emitLink(col, scope.row)">{{ scope.row[col.field] }}</el-link>
            <span v-else-if="col.type === 'date'">{{ parseTime(scope.row[col.field], col.timeFormat) }}</span>
            <span v-else>{{ scope.row[col.field] }}</span>
          </template>
        </el-table-column>
        <el-table-column
          v-else
          :key="col.field"
          :label="col.title"
          :min-width="col.minWidth"
          :width="col.width"
          :align="col.align || 'center'"
        >
          <template #default="scope">
            <slot :name="col.field" :row="scope.row" :scope="scope" :value="scope.row[col.field]"></slot>
          </template>
        </el-table-column>
      </template>
      <!-- 操作列 -->
      <el-table-column v-if="rowButtons.length > 0 && showAction !== false" label="操作" fixed="right" align="center" :width="actionWidth">
        <template #default="scope">
          <el-button
            v-for="btn in rowButtons"
            :key="btn.code"
            type="primary"
            link
            @click="emitAction(btn.code, scope.row)"
            :disabled="btn.disabled ? btn.disabled([scope.row]) : false"
          >{{ btn.name }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    </div>

    <!-- 分页 -->
    <div class="ep-pro-table__pagination">
      <el-pagination
        v-show="total > 0"
        background
        :current-page="pageNum"
        :page-size="pageSize"
        :total="total"
        :page-sizes="[10, 20, 30, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { parseTime } from '@/utils/generalMethod'

const props = defineProps({
  // 列配置：数组 或 异步函数返回 { columnsArr }
  columns: {
    type: [Array, Function],
    default: () => []
  },
  // 工具栏配置：对象 或 异步函数返回 { buttons }
  toolbarConfig: {
    type: [Object, Function],
    default: () => ({})
  },
  data: {
    type: Array,
    default: () => []
  },
  total: {
    type: Number,
    default: 0
  },
  loading: Boolean,
  pageSize: {
    type: Number,
    default: 30
  },
  actionWidth: {
    type: String,
    default: '120'
  },
  showCheckbox: Boolean,
  reserveSelection: Boolean,
  clickRowToToggleSelection: Boolean,
  tableAlertRender: {
    type: Boolean,
    default: true
  },
  gridOptions: {
    type: Object,
    default: () => ({})
  },
  tableId: {
    type: String,
    default: ''
  },
  defaultSearchForm: {
    type: Object,
    default: () => ({})
  },
  showAction: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['search', 'action', 'selection-change', 'link-click'])

const columnList = ref([])
const buttonList = ref([])
const searchForm = ref({ ...props.defaultSearchForm })
const selectedRows = ref([])
const pageNum = ref(1)
const pageSize = ref(props.pageSize)
// 字典 options 缓存
const dictOptionsCache = new Map()

// 初始化列与按钮（支持异步配置）
async function initConfig() {
  if (typeof props.columns === 'function') {
    const res = await props.columns()
    columnList.value = res.columnsArr || []
  } else {
    columnList.value = props.columns
  }
  if (typeof props.toolbarConfig === 'function') {
    const res = await props.toolbarConfig()
    buttonList.value = (res && res.buttons) || []
  } else {
    buttonList.value = (props.toolbarConfig && props.toolbarConfig.buttons) || []
  }
}

onMounted(() => {
  initConfig()
  // 默认查询参数
  Object.keys(props.defaultSearchForm).forEach(key => {
    searchForm.value[key] = props.defaultSearchForm[key]
  })
})

watch(() => [props.columns, props.toolbarConfig], () => initConfig())

// 搜索列（searchable 的列）
const searchColumns = computed(() => columnList.value.filter(col => col.searchable))

// 表格列（过滤 hideInTable）
const tableColumns = computed(() => columnList.value.filter(col => !col.hideInTable))

// 顶部按钮（showInTop !== false）
const topButtons = computed(() => buttonList.value.filter(btn => btn.showInTop !== false))

// 行内按钮（showInRow === true）
const rowButtons = computed(() => buttonList.value.filter(btn => btn.showInRow === true))

const rowId = computed(() => (props.gridOptions && props.gridOptions.rowId) || 'id')
const rowStyle = computed(() => (props.gridOptions && props.gridOptions.rowStyle) || (() => ({})))

// 获取下拉选项（支持 requestOptions 异步 + 本地 options 缓存）
function getOptions(col) {
  if (col.searchProps && col.searchProps.options) {
    return col.searchProps.options
  }
  if (col.requestOptions) {
    const cacheKey = col.optionsCacheKey || col.field
    if (!dictOptionsCache.has(cacheKey)) {
      dictOptionsCache.set(cacheKey, [])
      Promise.resolve(col.requestOptions()).then(options => {
        dictOptionsCache.set(cacheKey, options || [])
      })
    }
    return dictOptionsCache.get(cacheKey)
  }
  return []
}

// 字典列 label 渲染
function dictLabel(col, value) {
  const options = getOptions(col)
  const opt = options.find(item => String(item.value) === String(value))
  return opt ? opt.label : value
}

// 查询
function handleSearch() {
  pageNum.value = 1
  emitSearch()
}

// 重置
function handleReset() {
  searchForm.value = { ...props.defaultSearchForm }
  handleSearch()
}

// 组装查询参数（dateRange 拆分为 fieldStart/fieldEnd）
function buildParams() {
  const params = {}
  Object.keys(searchForm.value).forEach(key => {
    const val = searchForm.value[key]
    if (val === null || val === undefined || val === '') return
    // dateRange 拆分为 Start/End
    const col = searchColumns.value.find(c => c.field === key)
    if (col && col.searchType === 'dateRange' && Array.isArray(val) && val.length === 2) {
      params[key + 'Start'] = val[0]
      params[key + 'End'] = val[1]
      return
    }
    params[key] = val
  })
  return params
}

function emitSearch() {
  emit('search', buildParams(), { pageNum: pageNum.value, pageSize: pageSize.value })
}

// 分页
function handleSizeChange(size) {
  pageSize.value = size
  pageNum.value = 1
  emitSearch()
}

function handleCurrentChange(current) {
  pageNum.value = current
  emitSearch()
}

// 选中变化
function handleSelectionChange(rows) {
  selectedRows.value = rows
  emit('selection-change', rows)
}

// 行点击（配合 clickRowToToggleSelection）
function handleRowClick(row) {
  if (props.clickRowToToggleSelection && props.showCheckbox) {
    // 通过 ref 切换选中状态
    const tableEl = document.querySelector('.ep-pro-table .el-table')
    if (tableEl && tableEl.__vueParentComponent) {
      // 简化处理：不做行点击选中，避免依赖内部实现
    }
  }
}

// 按钮事件
function emitAction(code, row) {
  emit('action', {
    code,
    row: row || {},
    selectedRows: selectedRows.value,
    files: {}
  })
}

// 链接点击
function emitLink(col, row) {
  emit('action', { code: 'link', row, column: col.field, selectedRows: [row] })
  emit('link-click', col.field, row)
}
</script>

<style lang="scss" scoped>
.ep-pro-table {
  width: 100%;
  // 在定高 flex 容器（.app-container-col）里占满剩余高度，表格体内滚动
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;

  &__body {
    flex: 1;
    min-height: 0;
  }

  &__search {
    padding: 12px 12px 0;
    background: #fff;
    border-radius: 4px;
  }

  &__toolbar {
    padding: 10px 12px;
    background: #fff;
    display: flex;
    gap: 8px;
  }

  &__pagination {
    padding: 10px 0;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
