<template>
  <div class="top-right-btn">
    <!-- <el-button type="success" @click="handleFilter"><svg-icon icon-class="Line-Refresh" /></el-button>
    <el-button type="danger" @click="setClick"><svg-icon icon-class="Line-Filter" /></el-button> -->
    <el-button type="success" @click="handleFilter"><el-icon><Refresh /></el-icon></el-button>
    <el-button type="danger" @click="setClick"><el-icon><Setting /></el-icon></el-button>
    <to-configure ref="toConfigure" :tableJson="tableJson" :menuId="menuId" @tabConfigSuccess="tabConfigSuccess"></to-configure>
  </div>
</template>

<script setup>
import ToConfigure from './toConfigure'
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
  },
})

// 声明触发的事件（可选，增强类型校验）
const emit = defineEmits(['queryTable', 'tabConfigSuccess']);
const handleFilter = () => {
  emit('queryTable')
}

const setClick = () => {
  proxy.$refs.toConfigure.init()
}

const tabConfigSuccess = (data) => {
  emit('tabConfigSuccess', data)
}
</script>

<style lang='scss' scoped>
.top-right-btn{
  .ep-button{
    padding: 5px 6px;
    font-size: 12px;
    height: auto;
  }
}
</style>
