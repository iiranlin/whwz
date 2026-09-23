<template>
    <el-select popper-class="treeSelectPopper" :value="valueTitle" :clearable="clearable" @clear="clearHandle"  ref="treeSelectRef" :style="dialogType?'width: 280px':''" :disabled="disabled">
        <el-input
            v-if="selectInputShow"
            class="selectInput"
            :placeholder="placeholder"
            v-model="filterText">
        </el-input>
        <el-option :value="valueTitle" :label="valueTitle" class="options">
            <el-tree  id="tree-option"
                ref="selectTreeRef"
                :expand-on-click-node="expandOnClickNode"
                :accordion="accordion"
                :data="options"
                :props="compProps.props"
                :node-key="compProps.props.value"
                :default-expanded-keys="defaultExpandedKey"
                :filter-node-method="filterNode"
                @node-click="handleNodeClick">
            </el-tree>
        </el-option>
    </el-select>
</template>

<script setup name="select-tree">
import { ref, watch, onMounted, nextTick } from 'vue'

const compProps = defineProps({
  /* 配置项 */
  props: {
    type: Object,
    default: () => {
      return {
        value: 'id',             // ID字段名
        label: 'deptName',       // 显示名称
        children: 'children'     // 子级字段名
      }
    }
  },
  /* 选项列表数据(树形结构的对象数组) */
  options: {
    type: Array,
    default: () => { return [] }
  },
  /* 初始值 */
  value: {
    type: String,
    default: () => { return '' }
  },
  /* 可清空选项 */
  clearable: {
    type: Boolean,
    default: () => { return true }
  },
  /* 是否只点击箭头收缩 */
  expandOnClickNode: {
    type: Boolean,
    default: () => { return false }
  },
  /* 自动收起 */
  accordion: {
    type: Boolean,
    default: () => { return false }
  },
  /* 是否展示搜索 */
  selectInputShow: {
    type: Boolean,
    default: () => { return false }
  },
  placeholder: {
    type: String,
    default: () => { return '检索关键字' }
  },
  parentNode: {
    type: Boolean,
    default: () => { return true }
  },
  dialogType: {
    type: Boolean,
    default: () => { return true }
  },
  isObj: {
    type: Boolean,
    default: () => { return false }
  },
  // 制度体系文件上传需要
  isUpload: {
    type: Boolean,
    default: () => { return false }
  },
  // 非叶子节点是否可选
  notLeafNodeSelectable: {
    type: Boolean,
    default: true
  },
  disabled: {
    type: Boolean,
    default: () => { return false }
  }
})

const emit = defineEmits(['getValue'])

const filterText = ref('')
const valueId = ref(compProps.value)    // 初始值
const valueTitle = ref('')
const defaultExpandedKey = ref([])

// template refs
const treeSelectRef = ref(null)
const selectTreeRef = ref(null)

// 初始化值
const initHandle = () => {
  if (valueId.value) {
    nextTick(() => {
      valueTitle.value = selectTreeRef.value.getNode(valueId.value) && selectTreeRef.value.getNode(valueId.value).data[compProps.props.label]     // 初始化显示
      selectTreeRef.value.setCurrentKey(valueId.value)       // 设置默认选中
      defaultExpandedKey.value = [valueId.value]      // 设置默认展开
    })
  } else {
    filterText.value = ''
    valueTitle.value = ''
  }
  initScroll()
}
// 初始化滚动条
const initScroll = () => {
  nextTick(() => {
    let scrollWrap = document.querySelectorAll('.treeSelectPopper .el-scrollbar .el-select-dropdown__wrap')[0]
    let scrollBar = document.querySelectorAll('.treeSelectPopper .el-scrollbar .el-scrollbar__bar')
    scrollWrap.style.cssText = 'margin: 0px; max-height: none; overflow: hidden;'
    scrollBar.forEach(ele => ele.style.width = 0)
  })
}
// 切换选项
const handleNodeClick = (node) => {
  console.log(node, '==============')
  if (!compProps.notLeafNodeSelectable && node.children && node.children.length > 0) {
    return
  }
  if (compProps.parentNode) {
    valueTitle.value = node[compProps.props.label]
    valueId.value = node[compProps.props.value]
    if (compProps.isObj) {
      emit('getValue', node)
    } else {
      emit('getValue', valueId.value)
    }
    defaultExpandedKey.value = []
    treeSelectRef.value.blur()
  } else {
    if (!node.children || node.children.length == 0) {
      valueTitle.value = node[compProps.props.label]
      valueId.value = node[compProps.props.value]
      if (compProps.isUpload) {
        emit('getValue', node)
      } else {
        emit('getValue', { code: valueId.value, name: valueTitle.value })
      }
      defaultExpandedKey.value = []
      treeSelectRef.value.blur()
    }
  }
}
// 清除选中
const clearHandle = () => {
  valueTitle.value = ''
  valueId.value = null
  defaultExpandedKey.value = []
  clearSelected()
  emit('getValue', null)
}
/* 清空选中样式 */
const clearSelected = () => {
  let allNode = document.querySelectorAll('#tree-option .el-tree-node')
  allNode.forEach((element) => element.classList.remove('is-current'))
}
const filterNode = (value, data) => {
  if (!value) return true
  return data.deptName.indexOf(value) !== -1
}

watch(() => compProps.value, () => {
  valueId.value = compProps.value
  initHandle()
})
watch(filterText, (val) => {
  selectTreeRef.value.filter(val)
})
watch(() => compProps.options, () => {
  valueId.value = compProps.value
  initHandle()
})

onMounted(() => {
  initHandle()
})
</script>
<style scoped>
    .el-scrollbar .el-scrollbar__view .el-select-dropdown__item{
        height: auto;
        max-height: 200px;
        padding: 0;
        overflow: hidden;
        overflow-y: auto;
    }
    .el-select-dropdown__item.selected{
        font-weight: normal;
    }
    ul li >>>.el-tree .el-tree-node__content{
        height:auto;
        padding: 0 20px;
    }
    .el-tree-node__label{
        font-weight: normal;
    }
    .el-tree >>>.is-current .el-tree-node__label{
        color: #409EFF;
        font-weight: 700;
    }
    .el-tree >>>.is-current .el-tree-node__children .el-tree-node__label{
        color:#606266;
        font-weight: normal;
    }
    .selectInput{
        padding: 0 5px;
        box-sizing: border-box;
    }
</style>
