<template>
  <div class="app-container">
    <el-row :gutter="20" class="app-container-row">
      <splitpanes class="app-container-splitpanes default-theme">
        <!--左侧字典分类-->
        <pane size="16" class="integrated-manage-pane-tree">
          <div class="dict-cate-pane">
            <div class="cate-header flex-between-center">
              <span>字典分类</span>
              <el-button type="primary" circle :icon="Plus" @click="onHandleCate()"></el-button>
            </div>
            <el-input
              v-model="filterKeyword"
              placeholder="搜索关键字"
              @change="onFilterCate"
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
            <div class="cate-main">
              <div
                v-for="item in cateList"
                :key="item.dictCode"
                :class="`${
                  curCate && curCate.dictCode === item.dictCode && 'selected-cate'
                } dict-cate-item flex-between-center`"
                @click="onSelectCate(item)"
                @mouseenter="hoverCate = item"
                @mouseleave="hoverCate = null"
              >
                <div class="flex-1 flex-align-center">
                  <el-icon><Folder /></el-icon>
                  <span class="flex-1">{{ item.dictName }}</span>
                </div>
                <div v-show="hoverCate === item">
                  <el-button type="text" @click.stop="onHandleCate(item)"
                    ><el-icon><EditPen /></el-icon>编辑</el-button
                  >
                  <el-button
                    type="text"
                    style="color:#f03232;"
                    @click.stop="cateDeleteBatch(item)"
                    ><el-icon><Delete /></el-icon>删除</el-button
                  >
                </div>
              </div>
            </div>
          </div>
        </pane>
        <!--右侧字典明细-->
        <pane size="84" class="integrated-manage-pane-form">
          <el-col class="app-container-col">
            <div class="sso-front-table-container">
              <el-form
                class="form-wrapper"
                ref="elForm"
                :model="formData"
                label-width="75px"
                :inline="true"
              >
                <div
                  class="form-left flex1"
                  :class="{ 'form-left-h': isForm && formWidth }"
                >
                  <el-form-item label="字典名称：" prop="dictName">
                    <el-input
                      v-model="formData.dictName"
                      placeholder="请输入字典名称"
                      @keyup.enter="handleFilter"
                      class="customInput"
                    >
                    </el-input>
                  </el-form-item>
                  <el-form-item label="字典编号：" prop="dictCode">
                    <el-input
                      v-model="formData.dictCode"
                      placeholder="请输入字典编号"
                      @keyup.enter="handleFilter"
                      class="customInput"
                    >
                    </el-input>
                  </el-form-item>
                </div>
                <div class="form-right-show" v-show="formWidth">
                  <span @click="showFormClick">{{
                    isForm ? "展开更多" : "收起"
                  }}</span>
                  <span @click="showFormClick"><svg-icon icon-class="open" /></span>
                  <div class="form-right-show-y"></div>
                </div>
                <div class="form-right" :class="formWidth ? '' : 'form-rights'">
                  <el-button type="primary" @click="handleFilter" class="search-btn"
                    ><svg-icon icon-class="search" /> 查询</el-button
                  >
                  <el-button type="default" @click="resetForm('elForm')" class="reset-btn"
                    ><svg-icon icon-class="Line-Refresh" /> 重置</el-button
                  >
                </div>
              </el-form>
              <div class="tab-bten">
                <el-form label-position="left" class="flex1">
                  <el-button class="tableButton" type="primary" @click="onHandleDict()"
                    ><svg-icon icon-class="form" /> 新增</el-button
                  >
                  <el-button class="tableButton" type="danger" @click="handleDictDelete(null)"
                    ><el-icon><Delete /></el-icon> 批量删除</el-button
                  >
                </el-form>
                <div class="tab-bten-set">
                  <el-button type="success" @click="handleFilter"
                    ><svg-icon icon-class="Line-Refresh"
                  /></el-button>
                  <el-button type="danger" @click="setClick"
                    ><svg-icon icon-class="Line-Filter"
                  /></el-button>
                </div>
              </div>
              <el-table
                class="table-wrapper"
                @row-click="(row) => rowClick(row, 'elTable')"
                ref="elTable"
                height="100%"
                :data="dataList"
                border
                fit
                stripe
                v-loading="loading"
                @sort-change="sortableColumnChange"
                highlight-current-row
                @selection-change="handleSelectionChange"
              >
                <el-table-column
                  key="selection"
                  align="center"
                  type="selection"
                  width="55"
                  fixed="left"
                  :selectable="selectable"
                ></el-table-column>
                <el-table-column
                  type="index"
                  align="center"
                  :index="tableIndex"
                  label="序号"
                  width="55"
                ></el-table-column>
                <template v-for="item in tabConfig">
                  <el-table-column
                    v-if="item.isShow"
                    :key="item.code"
                    :width="item.width"
                    :label="item.name"
                    :align="item.align"
                    :sortable="item.sortable"
                    :prop="item.code"
                    :show-overflow-tooltip="item.showOverflowTooltip"
                    :fixed="item.fixed"
                  >
                    <template #default="{ row }">
                      <span v-if="item.stats">{{ item.stats[row[item.code]] }}</span>
                      <span v-else-if="item.date">{{
                        parseTime(row[item.code], '{y}-{m}-{d}')
                      }}</span>
                      <el-switch
                        v-else-if="item.switch"
                        v-model="row[item.code]"
                        active-value="1"
                        inactive-value="0"
                        @change="dictStatusChange(row)"
                      ></el-switch>
                      <span v-else>{{ row[item.code] }}</span>
                    </template>
                  </el-table-column>
                </template>
                <el-table-column label="操作" width="150" fixed="right" align="center">
                  <template #default="{ row }">
                    <el-button type="text" @click="onHandleDict(row)"
                      ><el-icon><EditPen /></el-icon>修改</el-button
                    >
                    <el-button type="text" @click="handleDictDelete(row)"
                      ><el-icon><Delete /></el-icon>删除</el-button
                    >
                  </template>
                </el-table-column>
              </el-table>

              <pagination
                v-model:page="listQuery.pageNum"
                v-model:limit="listQuery.pageSize"
                :total="total"
                @pagination="getList"
              />
              <to-configure ref="toConfigure" :tableJson="tabConfig" @tabConfigSuccess="tabConfigSuccess" />
            </div>
          </el-col>
        </pane>
      </splitpanes>
    </el-row>

    <add-dialog
      :cateList="cateList"
      ref="addDialog"
      @createSuccess="handleFilter"
      @createCate="onHandleCate()"
    ></add-dialog>
    <add-cate ref="addCateDialog" @createSuccess="createSuccess"></add-cate>
  </div>
</template>

<script setup name="dict-manage">
import { Splitpanes, Pane } from "splitpanes"
import "splitpanes/dist/splitpanes.css"
import { Plus, Search, Folder, EditPen, Delete } from '@element-plus/icons-vue'
import tabConfigSource from './components/table-config.js'
import { getLocalStorage } from '@/utils/auth'
import { parseTime } from '@/utils/generalMethod'
import ToConfigure from '@/components/RightToolbar/toConfigure.vue'
import AddDialog from './components/addDialog.vue'
import addCate from './components/addCate.vue'
import {
  dictGetMtList,
  dictList,
  dictDeleteBatch,
  dictModify,
  dictMtDeleteBatch,
} from '@/api/system/commonDict'

const { proxy } = getCurrentInstance()

const loading = ref(false)
const isForm = ref(false)
const formWidth = ref(false)
const formData = reactive({
  dictCode: "",
  dictName: "",
})
const total = ref(0)
const listQuery = reactive({
  pageNum: 1,
  pageSize: 30,
  isAsc: '',
  orderByColumn: ''
})
const cateList = ref([])
const dataList = ref([])
const curCate = ref('')
const hoverCate = ref(null)
const filterKeyword = ref('')
const selectionDataList = ref([])
const tabConfig = ref([])

/** 初始化列配置（本地持久化，key 与 toConfigure 写入保持一致） */
function initTabConfig() {
  const key = proxy.$route.meta?.menuId || proxy.$route.meta?.id
  let local = null
  try {
    local = key ? JSON.parse(getLocalStorage(key)) : null
  } catch (e) {
    local = null
  }
  tabConfig.value = local || tabConfigSource
}

function handleSelectionChange(data) {
  selectionDataList.value = data
}

function selectable(row) {
  return true
}

function handleFilter() {
  listQuery.pageNum = 1
  getList()
}

function showFormClick() {
  isForm.value = !isForm.value
}

function setClick() {
  proxy.$refs.toConfigure.init()
}

function tabConfigSuccess(row) {
  tabConfig.value = []
  proxy.$nextTick(() => {
    tabConfig.value = row
    proxy.$nextTick(() => {
      proxy.$refs.elTable && proxy.$refs.elTable.doLayout()
    })
  })
}

function createSuccess() {
  getDictCate()
  handleFilter()
}

function getDictCate() {
  dictGetMtList({
    dictName: filterKeyword.value,
  }).then(({ data }) => {
    cateList.value = data
  })
}

function getList() {
  loading.value = true
  const params = Object.assign({}, formData, listQuery, {
    mtCode: curCate.value?.dictCode,
  })
  dictList(params)
    .then(({ data }) => {
      total.value = data.total
      dataList.value = data.list || []
    })
    .finally(() => {
      loading.value = false
    })
}

function emitAblFilter() {
  handleFilter()
}

/** 排序变化（indexMixin 内联） */
function sortableColumnChange({ order, prop }) {
  if (order) {
    listQuery.isAsc = order === 'descending' ? 'desc' : 'asc'
    listQuery.orderByColumn = prop
  } else {
    listQuery.isAsc = ''
    listQuery.orderByColumn = ''
  }
  emitAblFilter()
}

/** 重置表单（indexMixin 内联） */
function resetForm(formName) {
  proxy.$refs[formName] && proxy.$refs[formName].resetFields()
  emitAblFilter()
}

/** 序号（indexMixin 内联） */
function tableIndex(index) {
  const { pageNum, pageSize } = listQuery
  return ((pageNum - 1) * pageSize) + (index + 1)
}

/** 行点击选中（indexMixin 内联） */
function rowClick(row, elTable = 'elTable') {
  if (row.disabled) return
  proxy.$refs[elTable] && proxy.$refs[elTable].toggleRowSelection(row)
}

/** 计算查询表单是否展开更多（indexMixin 内联） */
function formWidths() {
  proxy.$nextTick(() => {
    const formLeft = document.getElementsByClassName('form-left')
    if (formLeft.length) {
      const w = window.innerWidth
      const formLen = formLeft[0].getElementsByClassName('el-form-item').length
      if (w >= 1700) {
        formWidth.value = formLen > 10
      } else if (w < 1700 && w > 1400) {
        formWidth.value = formLen > 8
      } else if (w <= 1400) {
        formWidth.value = formLen > 6
      }
    }
  })
}

function onHandleDict(row) {
  proxy.$refs.addDialog.init(row)
}

function handleDictDelete(row) {
  let ids = []
  if (!row) {
    if (selectionDataList.value.length === 0) {
      proxy.$modal.msgWarning('请选择数据！')
      return
    }
    ids = selectionDataList.value.map((t) => t.id)
  } else {
    ids = [row.id]
  }
  proxy.$modal.confirm('确定要删除吗？').then(() => {
    loading.value = true
    dictDeleteBatch({ ids })
      .then(({ message }) => {
        proxy.$modal.msgSuccess(message)
        getList()
      })
      .finally(() => {
        loading.value = false
      })
  }).catch(() => {})
}

function dictStatusChange(row) {
  loading.value = true
  dictModify(row)
    .then(({ message }) => {
      proxy.$modal.msgSuccess(message)
    })
    .finally(() => {
      getList()
      loading.value = false
    })
}

function onSelectCate(cate) {
  curCate.value = curCate.value?.dictCode === cate.dictCode ? null : cate
  handleFilter()
}

function onFilterCate(val) {
  getDictCate()
}

function onHandleCate(cate) {
  proxy.$refs.addCateDialog.init(cate)
}

function cateDeleteBatch(row) {
  proxy.$modal.confirm('确定要删除吗？').then(() => {
    const ids = [row.dictCode]
    loading.value = true
    dictMtDeleteBatch({ ids })
      .then(({ message }) => {
        proxy.$modal.msgSuccess(message)
        if (curCate.value?.dictCode === row.dictCode) {
          curCate.value = null
        }
        getDictCate()
        getList()
      })
      .finally(() => {
        loading.value = false
      })
  }).catch(() => {})
}

onMounted(() => {
  formWidths()
  proxy.$nextTick(() => {
    proxy.$refs.elTable && proxy.$refs.elTable.doLayout()
  })
})

onActivated(() => {
  proxy.$refs.elTable && proxy.$refs.elTable.doLayout()
})

// created 逻辑
initTabConfig()
getDictCate()
handleFilter()
</script>

<style lang="scss" scoped>
// 左侧分类栏（撑满 pane 高度，复用全局 integrated-manage-pane-tree 背景）
.dict-cate-pane {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 5px 10px 10px;
  .ep-input {
    margin-bottom: 8px;
  }
}
.flex-between-center {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.flex-align-center {
  display: flex;
  align-items: center;
}
.flex-1 {
  flex: 1;
  overflow: hidden;
}
.cate-header {
  padding: 5px 0 10px;
  span {
    font-weight: bold;
    font-size: 15px;
    color: #3d424d;
  }
}
.cate-main {
  flex: 1;
  overflow: auto;
  .dict-cate-item {
    cursor: pointer;
    padding: 4px 8px;
    border-radius: 4px;
    span {
      margin-left: 4px;
      font-size: 14px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    &:hover {
      background: #e8f0fe;
    }
  }
  .selected-cate {
    background: #64a1ff !important;
    border-radius: 4px;
    span,
    .el-icon {
      color: #fff;
    }
  }
}
// 右侧主区：撑满 pane 高度，查询表单 + 按钮行 + 表格 + 分页
.app-container-col {
  height: 100%;
  .sso-front-table-container {
    height: 100%;
    display: flex;
    flex-direction: column;
    .form-wrapper {
      display: flex;
      align-items: flex-start;
      flex-wrap: wrap;
      .form-left {
        display: flex;
        flex-wrap: wrap;
        .ep-form-item {
          margin-bottom: 0;
        }
      }
      .form-right {
        display: flex;
        align-items: center;
      }
    }
    .tab-bten {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 10px 0;
    }
    .table-wrapper {
      flex: 1;
    }
    .pagination-container {
      padding-top: 10px;
    }
  }
}
// 表格表头样式（与老系统一致：白字蓝底）
.table-wrapper {
  :deep(th) {
    color: #fff;
    background-color: #3d8aff !important;
    padding: 0;
    height: 40px;
    border-color: #dcddde;
  }
}
</style>
