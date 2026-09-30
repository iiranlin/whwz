<template>
  <div>
    <div v-if="mode === 'DESIGN'">
      <draggable class="l-drag-from" :list="_columns" group="form"
                 :options="{animation: 300, chosenClass:'choose', sort:true}"
                 @start="drag = true; selectFormItem = null" @end="drag = false">
        <div v-for="(cp, id) in _columns" :key="id" class="l-form-item" @click.stop="selectItem(cp)" :style="getSelectedClass(cp)">
          <div class="l-form-header">
            <p><span v-if="cp.props.required">*</span>{{ cp.title }}</p>
            <div class="l-option">
              <i class="el-icon-close" @click="delItem(id)"></i>
            </div>
            <form-design-render :config="cp"/>
          </div>
        </div>
      </draggable>
      <div style="color: #c0bebe;text-align: center; width: 90%; padding: 5px;">☝ 拖拽控件到表格内部</div>
    </div>
    <div v-else>

      <div v-if="rowLayout">
        <el-table size="medium" :header-cell-style="{background:'#E5E6EB', color:'#1D2129', padding:'3px 0'}" :border="showBorder" :data="_value" style="width: 100%">
          <el-table-column fixed type="index" label="序号" width="50"></el-table-column>
          <el-table-column :min-width="getMinWidth(column)" v-for="(column, index) in _columns" :key="column.id" :prop="column.id" :label="column.title">
            <template #default="scope">
              <form-design-render :class="{'valid-error': showError(column, _value[scope.$index][column.id])}" v-model="_value[scope.$index][column.id]" :mode="mode" :config="column"/>
            </template>
          </el-table-column>
          <el-table-column fixed="right" min-width="90" label="操作">
            <template #default="scope">
              <el-button size="mini" type="text" @click="copyData(scope.$index, scope.row)">复制</el-button>
              <el-button size="mini" type="text" @click="delRow(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button size="small" icon="Plus" @click="addRow">{{placeholder}}</el-button>
      </div>
      <div v-else>
        <el-form :rules="rules" :model="row" :ref="`table-form-${i}`" class="table-column" v-for="(row, i) in _value" :key="i">
          <div class="table-column-action">
            <span>第 {{i + 1}} 项</span>
            <i class="el-icon-close" @click="delRow(i, row)"></i>
          </div>
          <el-form-item v-for="(column, index) in _columns" :key="'column_' + index" :prop="column.id" :label="column.title">
            <form-design-render v-model="row[column.id]" :mode="mode" :config="column"/>
          </el-form-item>
        </el-form>
        <el-button size="small" icon="Plus" @click="addRow">{{placeholder}}</el-button>
      </div>
    </div>
  </div>

</template>

<script setup name="TableList">
import { computed, ref, getCurrentInstance } from 'vue'
import { ElMessage } from 'element-plus'
import draggable from "vuedraggable";
import { ValueType } from "../ComponentsConfigExport";
import FormDesignRender from '@/views/admin/layout/form/FormDesignRender'
import { useProcessStore } from '@/store/modules/process'
import { deepClone, isNotEmpty } from '@/utils/process'

const props = defineProps({
  value: {
    type: Array,
    default: () => {
      return []
    }
  },
  placeholder: {
    type: String,
    default: '添加数据'
  },
  columns: {
    type: Array,
    default: () => {
      return []
    }
  },
  showBorder: {
    type: Boolean,
    default: true
  },
  maxSize: {
    type: Number,
    default: 0
  },
  rowLayout: {
    type: Boolean,
    default: true
  },
  mode: {
    type: String,
    default: 'DESIGN'
  },
  required: {
    type: Boolean,
    default: false
  },
})
const emit = defineEmits(['input'])

const { proxy } = getCurrentInstance()
const processStore = useProcessStore()

const _value = computed({
  get() { return props.value },
  set(v) { emit('input', v) }
})

// created 钩子逻辑（setup 顶层直接执行）
if (!Array.isArray(props.value)) {
  emit('input', [])
}

const rules = computed(() => {
  const rules = {}
  props.columns.forEach(col => {
    if (col.props.required) {
      rules[col.id] = [{
        type: col.valueType === 'Array' ? 'array' : undefined,
        required: true,
        message: `请填写${col.title}`, trigger: 'blur'
      }]
    }
  })
  return rules
})

const _columns = computed({
  get() {
    return props.columns;
  },
  set(val) {
    // columns 是 prop，保持与原 computed setter 行为一致
  }
})

const selectFormItem = computed({
  get() {
    return processStore.selectFormItem
  },
  set(val) {
    processStore.setSelectFormItem(val)
  },
})

const select = ref(null)
const drag = ref(false)

function getMinWidth(col) {
  switch (col.name) {
    case 'DateTime': return '250px'
    case 'DateTimeRange': return '280px'
    case 'MultipleSelect': return '200px'
    default: return '150px'
  }
}
function showError(col, val) {
  if (col.props.required) {
    switch (col.valueType) {
      case ValueType.dept:
      case ValueType.user:
      case ValueType.dateRange:
      case ValueType.array: return !(Array.isArray(val) && val.length > 0)
      default: return !isNotEmpty(val)
    }
  }
  return false
}
function copyData(i, row) {
  const arr = [..._value.value]
  arr.push(deepClone(row))
  emit('input', arr)
}
function delRow(i, row) {
  const arr = [..._value.value]
  arr.splice(i, 1)
  emit('input', arr)
}
function addRow() {
  if (props.maxSize > 0 && _value.value.length >= props.maxSize) {
    ElMessage.warning(`最多只能添加${props.maxSize}行`)
  } else {
    let row = {}
    props.columns.forEach(col => row[col.id] = undefined)
    const arr = [..._value.value]
    arr.push(row)
    emit('input', arr)
  }
}
function delItem(id) {
  _columns.value.splice(id, 1)
}
function selectItem(cp) {
  selectFormItem.value = cp
}
function getSelectedClass(cp) {
  return selectFormItem.value && selectFormItem.value.id === cp.id ? 'border-left: 4px solid #f56c6c' : ''
}
function validate(call) {
  if (props.rowLayout) {
    let result = true
    for (let i = 0; i < props.columns.length; i++) {
      if (props.columns[i].props.required) {
        for (let j = 0; j < _value.value.length; j++) {
          result = !showError(props.columns[i], _value.value[j][props.columns[i].id])
          if (!result) {
            call(false)
            return
          }
        }
      }
    }
    call(result)
  } else {
    let success = 0
    _value.value.forEach((v, i) => {
      let formRef = proxy.$refs[`table-form-${i}`]
      if (formRef && Array.isArray(formRef) && formRef.length > 0) {
        formRef[0].validate(valid => {
          if (valid) {
            success++;
          }
        })
      }
    })
    if (success === _value.value.length) {
      call(true)
    } else {
      call(false)
    }
  }
}
</script>

<style lang="scss" scoped>

:deep(.valid-error) {
  .el-input__inner{
    border-color: #F56C6C;
  }
}

.choose {
  border: 1px dashed #1890FF !important;
}

.table-column {
  padding: 5px;
  margin-bottom: 10px;
  border-left: 3px solid #409eff;
  border-radius: 5px;
  background: #fafafa;
  :deep(.el-form-item){
    margin-bottom: 0;
    .el-form-item__label{
      height: 25px;
    }
  }
  .table-column-action{
    float: right;
    span{
      color: #afafaf;
      margin-right: 10px;
      font-size: 13px;
    }
    i{
      color: #afafaf;
      padding: 5px;
      font-size: large;
      cursor: pointer;
      &:hover{
        color: #666666;
      }
    }
  }
}

.l-drag-from {
  min-height: 50px;
  background-color: rgb(245, 246, 246);

  .l-form-item, li {
    cursor: grab;
    background: #ffffff;
    padding: 10px;
    border: 1px solid #ebecee;
    margin: 5px 0;
  }
}

.l-form-header {
  font-size: small;
  color: #818181;
  text-align: left;
  position: relative;
  background-color: #fff;

  p {
    position: relative;
    margin: 0 0 10px 0;

    span {
      position: absolute;
      left: -8px;
      top: 3px;
      color: rgb(217, 0, 19);
    }
  }

  .l-option {
    position: absolute;
    top: -10px;
    right: -10px;

    i {
      font-size: large;
      cursor: pointer;
      color: #8c8c8c;
      padding: 5px;

      &:hover {
        color: #1890FF;
      }
    }
  }
}

</style>
