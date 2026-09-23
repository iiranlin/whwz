<template>
  <div class="panel-tab__content">
    <el-form size="mini" label-width="90px" @submit.native.prevent>
<!--      <el-form-item label="异步延续">-->
<!--        <el-checkbox v-model="taskConfigForm.asyncBefore" label="异步前" @change="changeTaskAsync" />-->
<!--        <el-checkbox v-model="taskConfigForm.asyncAfter" label="异步后" @change="changeTaskAsync" />-->
<!--        <el-checkbox v-model="taskConfigForm.exclusive" v-if="taskConfigForm.asyncAfter || taskConfigForm.asyncBefore" label="排除" @change="changeTaskAsync" />-->
<!--      </el-form-item>-->
      <component :is="witchTaskComponent" v-bind="$props" />
    </el-form>
  </div>
</template>

<script setup name="ElementTaskConfig">
import { ref, reactive, watch, shallowRef } from 'vue';
import UserTask from "./task-components/UserTask";
import ScriptTask from "./task-components/ScriptTask";
import ReceiveTask from "./task-components/ReceiveTask";

const props = defineProps({
  id: String,
  type: String
});

const witchTaskComponent = shallowRef("");

const installedComponent = {
  // 手工任务与普通任务一致，不需要其他配置
  // 接收消息任务，需要在全局下插入新的消息实例，并在该节点下的 messageRef 属性绑定该实例
  // 发送任务、服务任务、业务规则任务共用一个相同配置
  UserTask: "UserTask", // 用户任务配置
  ScriptTask: "ScriptTask", // 脚本任务配置
  ReceiveTask: "ReceiveTask" // 消息接收任务
};

const taskConfigForm = reactive({
  asyncAfter: false,
  asyncBefore: false,
  exclusive: false
});

let bpmnElement = null;

watch(
  () => props.id,
  () => {
    bpmnElement = window.bpmnInstances.bpmnElement;
    taskConfigForm.asyncBefore = bpmnElement?.businessObject?.asyncBefore;
    taskConfigForm.asyncAfter = bpmnElement?.businessObject?.asyncAfter;
    taskConfigForm.exclusive = bpmnElement?.businessObject?.exclusive;
  },
  { immediate: true }
);

watch(
  () => props.type,
  () => {
    witchTaskComponent.value = installedComponent[props.type];
  },
  { immediate: true }
);

function changeTaskAsync() {
  if (!taskConfigForm.asyncBefore && !taskConfigForm.asyncAfter) {
    taskConfigForm.exclusive = false;
  }
  window.bpmnInstances.modeling.updateProperties(window.bpmnInstances.bpmnElement, {
    ...taskConfigForm
  });
}
</script>
