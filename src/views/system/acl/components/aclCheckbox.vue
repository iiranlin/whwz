<template>
  <div class="acl-checkbox">
    <!-- 功能按钮组 -->
    <div v-if="item.buttonList && item.buttonList.length" class="button_checked">
      <el-checkbox :indeterminate="isIndeterminateButton" :disabled="disabled"
        :model-value="checkAllButton" @change="handleCheckAllButtonChange">功能按钮</el-checkbox>
      <div class="button_list">
        <el-checkbox-group v-model="checkedButton" :disabled="disabled">
          <el-checkbox v-for="btn in item.buttonList" :key="btn.id" :value="btn.id">{{ btn.aclName }}</el-checkbox>
        </el-checkbox-group>
      </div>
    </div>
    <!-- 列表字段组 -->
    <div v-if="item.fieldList && item.fieldList.length" class="button_checked">
      <div class="button_all">
        <el-checkbox :indeterminate="isIndeterminateList" :disabled="disabled"
          :model-value="checkAllList" @change="handleCheckAllListChange">列表字段</el-checkbox>
      </div>
      <div class="button_list">
        <el-checkbox-group v-model="checkedList" :disabled="disabled">
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
  // 分配页面受控传入；查询明细未传入时读取 isBind。
  selectedIds: { type: Array, default: undefined },
  // 是否禁用（查询明细弹窗只读）
  disabled: { type: Boolean, default: false }
})

const emit = defineEmits(['changeAll'])

const arrButton = computed(() => (props.item.buttonList || []).map(acl => acl.id))
const arrfieldList = computed(() => (props.item.fieldList || []).map(acl => acl.id))
const selectedIds = computed(() => props.selectedIds ??
  [...(props.item.buttonList || []), ...(props.item.fieldList || [])]
    .filter(acl => acl.isBind == 1).map(acl => acl.id))

function emitSelection(buttons, fields) {
  emit('changeAll', [...buttons, ...fields], props.id, props.item)
}

const checkedButton = computed({
  get: () => arrButton.value.filter(id => selectedIds.value.includes(id)),
  set: value => emitSelection(value, checkedList.value)
})
const checkedList = computed({
  get: () => arrfieldList.value.filter(id => selectedIds.value.includes(id)),
  set: value => emitSelection(checkedButton.value, value)
})
const checkAllButton = computed(() => arrButton.value.length > 0 && checkedButton.value.length === arrButton.value.length)
const checkAllList = computed(() => arrfieldList.value.length > 0 && checkedList.value.length === arrfieldList.value.length)
const isIndeterminateButton = computed(() => checkedButton.value.length > 0 && !checkAllButton.value)
const isIndeterminateList = computed(() => checkedList.value.length > 0 && !checkAllList.value)

function handleCheckAllButtonChange(selected) {
  emitSelection(selected ? [...arrButton.value] : [], checkedList.value)
}

function handleCheckAllListChange(selected) {
  emitSelection(checkedButton.value, selected ? [...arrfieldList.value] : [])
}
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
