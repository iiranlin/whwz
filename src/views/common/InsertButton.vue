<template>
  <el-popover placement="bottom-start" title="添加流程节点" width="350" trigger="click">
    <template #reference>
      <el-button style="margin: 0" icon="el-icon-plus" type="primary" size="small" circle></el-button>
    </template>
    <div class="node-select">
      <div @click="addApprovalNode">
        <i class="el-icon-s-check" style="color:rgb(255, 148, 62);"></i>
        <span>审批人</span>
      </div>
      <div @click="addConditionsNode">
        <i class="el-icon-share" style="color:rgb(21, 188, 131);"></i>
        <span>条件分支</span>
      </div>
    </div>
  </el-popover>
</template>

<script setup name="InsertButton">
import { computed, onMounted } from 'vue'
import { useProcessStore } from '@/store/modules/process'

const processStore = useProcessStore()
const emit = defineEmits(['insertNode'])

/* ========== 调试日志开始 ========== */
console.log('[InsertButton] setup 执行')
onMounted(() => {
  console.log('[InsertButton] onMounted 执行')
})
/* ========== 调试日志结束 ========== */

const selectedNode = computed(() => processStore.selectedNode)

function addApprovalNode() {
  console.log('[InsertButton] 点击了 审批人')
  emit('insertNode', "APPROVAL")
}
function addCcNode() {
  console.log('[InsertButton] 点击了 抄送人')
  emit('insertNode', "CC")
}
function addDelayNode() {
  console.log('[InsertButton] 点击了 延迟等待')
  emit('insertNode', "DELAY")
}
function addConditionsNode() {
  console.log('[InsertButton] 点击了 条件分支')
  emit('insertNode', "CONDITIONS")
}
function addConcurrentsNode() {
  console.log('[InsertButton] 点击了 并行分支')
  emit('insertNode', "CONCURRENTS")
}
function addTriggerNode() {
  console.log('[InsertButton] 点击了 触发器')
  emit('insertNode', "TRIGGER")
}
</script>

<style lang="scss" scoped>
.node-select{
  div{
    display: inline-block;
    margin: 5px 5px;
    cursor: pointer;
    padding: 10px 15px;
    border: 1px solid #F8F9F9;
    background-color: #F8F9F9;
    border-radius: 10px;
    width: 130px;
    position: relative;
    span{
      position: absolute;
      left: 65px;
      top: 18px;
    }
    &:hover{
      background-color: #fff;
      box-shadow: 0 0 8px 2px #d6d6d6;
    }
    i{
      font-size: 25px;
      padding: 5px;
      border: 1px solid #dedfdf;
      border-radius: 14px;
    }
  }
}
</style>