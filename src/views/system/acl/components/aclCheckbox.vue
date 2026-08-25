<template>
  <div class="acl-checkbox">
    <!-- 功能按钮组 -->
    <div v-if="item.buttonList && item.buttonList.length" class="button_checked">
      <el-checkbox :indeterminate="isIndeterminateButton" :disabled="disabled"
        v-model="checkAllButton" @change="handleCheckAllButtonChange">功能按钮</el-checkbox>
      <div class="button_list">
        <el-checkbox-group v-model="checkedButton" :disabled="disabled" @change="handleCheckedButtonChange">
          <el-checkbox v-for="btn in item.buttonList" :key="btn.id" :value="btn.id">{{ btn.aclName }}</el-checkbox>
        </el-checkbox-group>
      </div>
    </div>
    <!-- 列表字段组 -->
    <div v-if="item.fieldList && item.fieldList.length" class="button_checked">
      <div class="button_all">
        <el-checkbox :indeterminate="isIndeterminateList" :disabled="disabled"
          v-model="checkAllList" @change="handleCheckAllListChange">列表字段</el-checkbox>
      </div>
      <div class="button_list">
        <el-checkbox-group v-model="checkedList" :disabled="disabled" @change="handleCheckedListChange">
          <el-checkbox v-for="field in item.fieldList" :key="field.id" :value="field.id">{{ field.aclName }}</el-checkbox>
        </el-checkbox-group>
      </div>
    </div>
  </div>
</template>

<script setup name="AclCheckbox">
const props = defineProps({
  // 菜单行数据（含 buttonList/fieldList/isSelect）
  item: { type: Object, default: () => ({}) },
  // 菜单行 id
  id: { type: [String, Number], default: '' },
  // 是否禁用（查询明细弹窗只读）
  disabled: { type: Boolean, default: false }
})

const emit = defineEmits(['changeAll'])

const checkAllButton = ref(false)
const isIndeterminateButton = ref(true)
const checkedButton = ref([])
const checkAllList = ref(false)
const isIndeterminateList = ref(true)
const checkedList = ref([])
// 全量按钮/字段 id（用于全选判断）
const arrButton = ref([])
const arrfieldList = ref([])

// 初始化：回显已绑定项，全部绑定则置为全选
onMounted(() => {
  if (props.item.buttonList) {
    const all = props.item.buttonList.map(v => v.id)
    const bound = props.item.buttonList.filter(v => v.isBind == 1).map(v => v.id)
    arrButton.value = all
    checkedButton.value = bound
    checkAllButton.value = bound.length === all.length && all.length > 0
    isIndeterminateButton.value = bound.length > 0 && bound.length < all.length
  }
  if (props.item.fieldList) {
    const all = props.item.fieldList.map(v => v.id)
    const bound = props.item.fieldList.filter(v => v.isBind == 1).map(v => v.id)
    arrfieldList.value = all
    checkedList.value = bound
    checkAllList.value = bound.length === all.length && all.length > 0
    isIndeterminateList.value = bound.length > 0 && bound.length < all.length
  }
  nextTick(() => {
    const arr = checkedButton.value.concat(checkedList.value)
    if (arr.length > 0) {
      emit('changeAll', arr, props.id)
    }
  })
})

function emitChange(withItem = false) {
  const arr = checkedButton.value.concat(checkedList.value)
  emit('changeAll', arr, props.id, withItem ? props.item : undefined)
}

/** 供父组件联动：菜单行勾选状态变化时同步全选/清空 */
function isWatch() {
  if (props.item.id === props.id && props.item.isSelect == true) {
    checkedButton.value = [...arrButton.value]
    checkAllButton.value = true
    isIndeterminateButton.value = false
    checkedList.value = [...arrfieldList.value]
    checkAllList.value = true
    isIndeterminateList.value = false
  } else {
    checkedButton.value = []
    checkAllButton.value = false
    isIndeterminateButton.value = false
    checkedList.value = []
    checkAllList.value = false
    isIndeterminateList.value = false
  }
  emitChange()
}

/** 按钮单选 */
function handleCheckedButtonChange(value) {
  const checkedCount = value.length
  checkAllButton.value = checkedCount === arrButton.value.length
  isIndeterminateButton.value = checkedCount > 0 && checkedCount < arrButton.value.length
  emitChange(true)
}

/** 按钮全选 */
function handleCheckAllButtonChange(val) {
  checkedButton.value = val ? [...arrButton.value] : []
  isIndeterminateButton.value = false
  emitChange(true)
}

/** 列表字段单选 */
function handleCheckedListChange(value) {
  const checkedCount = value.length
  checkAllList.value = checkedCount === arrfieldList.value.length
  isIndeterminateList.value = checkedCount > 0 && checkedCount < arrfieldList.value.length
  emitChange(true)
}

/** 列表字段全选 */
function handleCheckAllListChange(val) {
  checkedList.value = val ? [...arrfieldList.value] : []
  isIndeterminateList.value = false
  emitChange(true)
}

defineExpose({ isWatch })
</script>

<style lang="scss" scoped>
.acl-checkbox {
  margin-top: 6px;

  .button_checked {
    display: flex;
    margin-left: 60px;
    margin-bottom: 6px;

    .button_list {
      margin-left: 10px;
    }
  }

  .el-checkbox {
    min-width: 100px;
  }
}
</style>
