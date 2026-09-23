<template>
  <div style="margin-top: 16px">
    <el-form-item label="脚本格式">
      <el-input v-model="scriptTaskForm.scriptFormat" clearable @input="updateElementTask()" @change="updateElementTask()" />
    </el-form-item>
    <el-form-item label="脚本类型">
      <el-select v-model="scriptTaskForm.scriptType">
        <el-option label="内联脚本" value="inline" />
        <el-option label="外部资源" value="external" />
      </el-select>
    </el-form-item>
    <el-form-item label="脚本" v-show="scriptTaskForm.scriptType === 'inline'">
      <el-input
        v-model="scriptTaskForm.script"
        type="textarea"
        resize="vertical"
        :autosize="{ minRows: 2, maxRows: 4 }"
        clearable
        @input="updateElementTask()"
        @change="updateElementTask()"
      />
    </el-form-item>
    <el-form-item label="资源地址" v-show="scriptTaskForm.scriptType === 'external'">
      <el-input v-model="scriptTaskForm.resource" clearable @input="updateElementTask()" @change="updateElementTask()" />
    </el-form-item>
    <el-form-item label="结果变量">
      <el-input v-model="scriptTaskForm.resultVariable" clearable @input="updateElementTask()" @change="updateElementTask()" />
    </el-form-item>
  </div>
</template>

<script setup name="ScriptTask">
import { reactive, watch, nextTick, onBeforeUnmount } from 'vue';

const props = defineProps({
  id: String,
  type: String
});

const defaultTaskForm = {
  scriptFormat: "",
  script: "",
  resource: "",
  resultVariable: ""
};
const scriptTaskForm = reactive({});

let bpmnElement = null;

watch(
  () => props.id,
  () => {
    bpmnElement = window.bpmnInstances.bpmnElement;
    nextTick(() => resetTaskForm());
  },
  { immediate: true }
);

function resetTaskForm() {
  for (let key in defaultTaskForm) {
    let value = bpmnElement?.businessObject[key] || defaultTaskForm[key];
    scriptTaskForm[key] = value;
  }
  scriptTaskForm.scriptType = scriptTaskForm.script ? "inline" : "external";
}

function updateElementTask() {
  let taskAttr = Object.create(null);
  taskAttr.scriptFormat = scriptTaskForm.scriptFormat || null;
  taskAttr.resultVariable = scriptTaskForm.resultVariable || null;
  if (scriptTaskForm.scriptType === "inline") {
    taskAttr.script = scriptTaskForm.script || null;
    taskAttr.resource = null;
  } else {
    taskAttr.resource = scriptTaskForm.resource || null;
    taskAttr.script = null;
  }
  window.bpmnInstances.modeling.updateProperties(bpmnElement, taskAttr);
}

onBeforeUnmount(() => {
  bpmnElement = null;
});
</script>
