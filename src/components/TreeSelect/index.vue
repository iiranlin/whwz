<template>
  <div>
    <div
      class="mask"
      v-show="isShowSelect"
      @click="isShowSelect = !isShowSelect"
    ></div>
    <el-popover
      placement="bottom-start"
      :width="width"
      trigger="manual"
      v-model="isShowSelect"
      @hide="popoverHide"
    >
      <el-select
        #reference
        ref="selectRef"
        :size="size"
        v-model="selectedData"
        :multiple="multiple"
        :clearable="clearable"
        :collapse-tags="collapseTags"
        @click="isShowSelect = !isShowSelect"
        @remove-tag="removeSelectedNodes"
        @clear="removeSelectedNode"
        @change="changeSelectedNodes"
        class="tree-select"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-tree
        class="common-tree"
        ref="treeRef"
        :style="`width: 100%; height: ${height}px`"
        :data="data"
        :props="defaultProps"
        :show-checkbox="multiple"
        :node-key="nodeKey"
        :check-strictly="checkStrictly"
        default-expand-all
        :expand-on-click-node="false"
        :check-on-click-node="multiple"
        :highlight-current="true"
        @node-click="handleNodeClick"
        @check-change="handleCheckChange"
      />
    </el-popover>
  </div>
</template>

<script setup name="tree-select">
import { ref, watch, onMounted } from 'vue'

const props = defineProps({
  // 树结构数据
  data: {
    type: Array,
    default: () => []
  },
  defaultProps: {
    type: Object,
    default: () => ({})
  },
  // 配置是否可多选
  multiple: {
    type: Boolean,
    default: () => false
  },
  // 配置是否可清空选择
  clearable: {
    type: Boolean,
    default: () => false
  },
  // 配置多选时是否将选中值按文字的形式展示
  collapseTags: {
    type: Boolean,
    default: () => false
  },
  nodeKey: {
    type: String,
    default: () => 'id'
  },
  // 显示复选框情况下，是否严格遵循父子不互相关联
  checkStrictly: {
    type: Boolean,
    default: () => false
  },
  // 默认选中的节点key数组
  checkedKeys: {
    type: Array,
    default: () => []
  },
  size: {
    type: String,
    default: () => 'small'
  },
  width: {
    type: Number,
    default: () => 250
  },
  height: {
    type: Number,
    default: () => 300
  }
})

const emit = defineEmits(['checked-change', 'change'])

const isShowSelect = ref(false)
const options = ref([])
const selectedData = ref([])
const style = 'width:' + props.width + 'px;' + 'height:' + props.height + 'px;'
const selectStyle = 'width:' + (props.width + 24) + 'px;'
const checkedIds = ref([])
const checkedData = ref([])

// template refs
const selectRef = ref(null)
const treeRef = ref(null)

// 单选时点击tree节点，设置select选项
const setSelectOption = (node) => {
  let tmpMap = {}
  tmpMap.value = node.key
  tmpMap.label = node.label
  options.value = []
  options.value.push(tmpMap)
  selectedData.value = node.key
}
// 单选，选中传进来的节点
const checkSelectedNode = (checkedKeysArr) => {
  var item = checkedKeysArr[0]
  treeRef.value.setCurrentKey(item)
  var node = treeRef.value.getNode(item)
  setSelectOption(node)
}
// 多选，勾选上传进来的节点
const checkSelectedNodes = (checkedKeysArr) => {
  treeRef.value.setCheckedKeys(checkedKeysArr)
}
// 单选，清空选中
const clearSelectedNode = () => {
  treeRef.value.setCurrentKey(null)
}
// 多选，清空所有勾选
const clearSelectedNodes = () => {
  var checkedKeysArr = treeRef.value.getCheckedKeys() // 所有被选中的节点的 key 所组成的数组数据
  for (let i = 0; i < checkedKeysArr.length; i++) {
    treeRef.value.setChecked(checkedKeysArr[i], false)
  }
}
const initCheckedData = () => {
  if (props.multiple) {
    // 多选
    if (props.checkedKeys.length > 0) {
      selectedData.value = props.checkedKeys
      checkSelectedNodes(props.checkedKeys)
    } else {
      selectedData.value = ''
      clearSelectedNodes()
    }
  } else {
    // 单选
    if (props.checkedKeys.length > 0) {
      selectedData.value = props.checkedKeys[0]
      checkSelectedNode(props.checkedKeys)
    } else {
      selectedData.value = ''
      clearSelectedNode()
    }
  }
}
const a2b = (ls) => {
  return ls.map((obj) => {
    let result = { id: '', text: '' }
    if (obj.children && obj.children.length > 0) {
      result.id = obj.value
      result.text = obj.label
      result.arr = a2b(obj.children)
      return result
    } else {
      result.id = obj.value
      result.text = obj.label
      return result
    }
  })
}
const popoverHide = () => {
  if (props.multiple) {
    checkedIds.value = treeRef.value.getCheckedKeys() // 所有被选中的节点的 key 所组成的数组数据
    checkedData.value = treeRef.value.getCheckedNodes() // 所有被选中的节点所组成的数组数据
  } else {
    checkedIds.value = treeRef.value.getCurrentKey()
    checkedData.value = treeRef.value.getCurrentNode()
  }
  emit('checked-change', checkedIds.value, checkedData.value)
}
// 单选，节点被点击时的回调,返回被点击的节点数据
const handleNodeClick = (data, node) => {
  if (!props.multiple) {
    setSelectOption(node)
    isShowSelect.value = !isShowSelect.value
    emit('change', selectedData.value)
  }
}
// 多选，节点勾选状态发生变化时的回调
const handleCheckChange = () => {
  var checkedKeysArr = treeRef.value.getCheckedKeys() // 所有被选中的节点的 key 所组成的数组数据
  options.value = checkedKeysArr.map((item) => {
    var node = treeRef.value.getNode(item) // 所有被选中的节点对应的node
    let tmpMap = {}
    tmpMap.value = node.key
    tmpMap.label = node.label
    return tmpMap
  })
  selectedData.value = options.value.map((item) => {
    return item.value
  })
  emit('change', selectedData.value)
}
// 多选,删除任一select选项的回调
const removeSelectedNodes = (val) => {
  treeRef.value.setChecked(val, false)
  var node = treeRef.value.getNode(val)
  if (!props.checkStrictly && node.childNodes.length > 0) {
    treeToList(node).map((item) => {
      if (item.childNodes.length <= 0) {
        treeRef.value.setChecked(item, false)
      }
    })
    handleCheckChange()
  }
  emit('change', selectedData.value)
}
const treeToList = (tree) => {
  var queen = []
  var out = []
  queen = queen.concat(tree)
  while (queen.length) {
    var first = queen.shift()
    if (first.childNodes) {
      queen = queen.concat(first.childNodes)
    }
    out.push(first)
  }
  return out
}
// 单选,清空select输入框的回调
const removeSelectedNode = () => {
  clearSelectedNode()
  emit('change', selectedData.value)
}
// 选中的select选项改变的回调
const changeSelectedNodes = (sd) => {
  // 多选,清空select输入框时，清除树勾选
  if (props.multiple && sd.length <= 0) {
    clearSelectedNodes()
  }
  emit('change', selectedData.value)
}

watch(isShowSelect, (val) => {
  // 隐藏select自带的下拉框
  selectRef.value.blur()
})
watch(() => props.checkedKeys, (val) => {
  if (!val) return
  initCheckedData()
})

onMounted(() => {
  initCheckedData()
})
</script>

<style scoped>
.mask {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  opacity: 0;
  z-index: 11;
}

.common-tree {
  overflow: auto;
}

.tree-select {
  z-index: 111;
}
</style>
