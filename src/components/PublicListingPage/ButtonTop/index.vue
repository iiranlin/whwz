<template>
  <el-row :gutter="10" class="mb8 integrated-manage-pane-form-button">
    <template v-for="item in buttonJson" :key="item.code">
      <el-col :span="1.5" v-if="item.children && item.children.length && handleButtonShow(item.code)">
        <el-dropdown class="custom-dropdown" split-button type="primary" @click="handleButton(item.code)" @command="handleButton">
          {{ item.name }}
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item v-for="val in item.children" :key="val.code" :command="val.code" :disabled="!handleButtonDisable(val.code)">{{ val.name }}</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-col>
      <el-col :span="1.5" v-else-if="handleButtonShow(item.code) && item.type != 'inline'">
        <el-button class="tableButton" :type="item.type || 'primary'" @click="handleButton(item.code)"
          :disabled="!handleButtonDisable(item.code)">{{ item.name }}</el-button>
      </el-col>
    </template>
    <slot></slot>
  </el-row>
</template>

<script setup>
const { proxy } = getCurrentInstance()

// 接收参数并指定类型（可选）
const props = defineProps({
  buttonJson: {
    type: Array,
    default: []
  },
  buttonShow: {
    type: Function,
    default: null
  },
  buttonDisable: {
    type: Function,
    default: null
  }
})

// 声明触发的事件（可选，增强类型校验）
const emit = defineEmits(['handleButton'])


const handleButtonDisable = (code) => {
  if (props.buttonDisable) {
    return props.buttonDisable(code)
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

const handleButton = (code) => {
  emit('handleButton', code)
}
</script>
<style lang="scss" scoped>
.custom-dropdown {
  padding: 4px 0;
  
  :deep(.ep-button) {
    background-color: #ecf5ff;
    border-color: #a0cfff;
    color: #fff;
    height: 30px;
    text-align: center;
    padding: 7px 15px;
    font-size: 12px;
  }

  :deep(.ep-button:hover) {
    background-color: #409eff;
    border-color: #409eff;
    color: #fff;
  }

  :deep(.ep-dropdown__caret-button) {
    border-left: 1px solid #a0cfff;
  }

  :deep(.ep-dropdown__caret-button:hover) {
    background-color: #409eff;
    border-color: #409eff;
    color: #fff;
    border-left: none;
  }
}
</style>