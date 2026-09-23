<template>
  <el-popover placement="bottom-start" title="添加流程节点" width="350" trigger="click">
    <div class="node-select">
      <div @click="addApprovalNode">
        <i class="el-icon-s-check" style="color:rgb(255, 148, 62);"></i>
        <span>审批人</span>
      </div>
      <!-- <div @click="addCcNode">
        <i class="el-icon-s-promotion" style="color:rgb(50, 150, 250);"></i>
        <span>抄送人</span>
      </div> -->
      <!-- TODO 项目二期 工作流不展示条件分支 0913 -->
      <div @click="addConditionsNode">
        <i class="el-icon-share" style="color:rgb(21, 188, 131);"></i>
        <span>条件分支</span>
      </div>
    <!-- <div @click="addConcurrentsNode">
        <i class="el-icon-s-operation" style="color:#718dff;"></i>
        <span>并行分支</span>
      </div> -->
      <!--
      <div @click="addDelayNode">
        <i class="el-icon-time" style="color:#f25643;"></i>
        <span>延迟等待</span>
      </div>
      <div @click="addTriggerNode">
        <i class="el-icon-set-up" style="color:#15BC83;"></i>
        <span>触发器</span>
      </div> -->
    </div>
    <el-button style="margin: 0" icon="el-icon-plus" #reference type="primary" size="small" circle></el-button>
  </el-popover>
</template>

<script setup name="InsertButton">
import { computed } from 'vue'
import { useProcessStore } from '@/store/modules/process'

const processStore = useProcessStore()

const emit = defineEmits(['insertNode'])

const selectedNode = computed(() => {
  processStore.selectedNode
})

function addApprovalNode() {
  emit('insertNode', "APPROVAL")
}
function addCcNode() {
  emit('insertNode', "CC")
}
function addDelayNode() {
  emit('insertNode', "DELAY")
}
function addConditionsNode() {
  emit('insertNode', "CONDITIONS")
}
function addConcurrentsNode() {
  emit('insertNode', "CONCURRENTS")
}
function addTriggerNode() {
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
