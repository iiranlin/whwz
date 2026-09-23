<template>
  <div class="panel-tab__content">
    <el-form :model="flowConditionForm" label-width="90px" size="mini" @submit.native.prevent>
      <el-form-item label="流转类型">
        <el-select v-model="flowConditionForm.type" @change="updateFlowType">
          <el-option label="普通流转路径" value="normal" />
          <el-option label="默认流转路径" value="default" />
          <el-option label="条件流转路径" value="condition" />
        </el-select>
      </el-form-item>
      <el-form-item label="条件格式" v-if="flowConditionForm.type === 'condition'" key="condition">
        <el-select v-model="flowConditionForm.conditionType">
          <el-option label="表达式" value="expression" />
          <el-option label="脚本" value="script" />
        </el-select>
      </el-form-item>
      <el-form-item label="表达式" v-if="flowConditionForm.conditionType && flowConditionForm.conditionType === 'expression'" key="express">
        <el-input v-model="flowConditionForm.body" clearable @change="updateFlowCondition" />
      </el-form-item>
      <template v-if="flowConditionForm.conditionType && flowConditionForm.conditionType === 'script'">
        <el-form-item label="脚本语言" key="language">
          <el-input v-model="flowConditionForm.language" clearable @change="updateFlowCondition" />
        </el-form-item>
        <el-form-item label="脚本类型" key="scriptType">
          <el-select v-model="flowConditionForm.scriptType">
            <el-option label="内联脚本" value="inlineScript" />
            <el-option label="外部脚本" value="externalScript" />
          </el-select>
        </el-form-item>
        <el-form-item label="脚本" v-if="flowConditionForm.scriptType === 'inlineScript'" key="body">
          <el-input v-model="flowConditionForm.body" type="textarea" clearable @change="updateFlowCondition" />
        </el-form-item>
        <el-form-item label="资源地址" v-if="flowConditionForm.scriptType === 'externalScript'" key="resource">
          <el-input v-model="flowConditionForm.resource" clearable @change="updateFlowCondition" />
        </el-form-item>
      </template>
    </el-form>
  </div>
</template>

<script setup name="FlowCondition">
import { reactive, watch, nextTick, onBeforeUnmount } from 'vue';

const props = defineProps({
  businessObject: Object,
  type: String
});

const flowConditionForm = reactive({});
let bpmnElement = null;
let bpmnElementSource = null;
let bpmnElementSourceRef = null;

watch(
  () => props.businessObject,
  () => {
    nextTick(() => resetFlowCondition());
  },
  { immediate: true }
);

function resetFlowCondition() {
  bpmnElement = window.bpmnInstances.bpmnElement;
  bpmnElementSource = bpmnElement.source;
  bpmnElementSourceRef = bpmnElement.businessObject.sourceRef;
  if (bpmnElementSourceRef && bpmnElementSourceRef.default && bpmnElementSourceRef.default.id === bpmnElement.id) {
    // 默认
    Object.assign(flowConditionForm, { type: "default" });
  } else if (!bpmnElement.businessObject.conditionExpression) {
    // 普通
    Object.assign(flowConditionForm, { type: "normal" });
  } else {
    // 带条件
    const conditionExpression = bpmnElement.businessObject.conditionExpression;
    Object.assign(flowConditionForm, { ...conditionExpression, type: "condition" });
    // resource 可直接标识 是否是外部资源脚本
    if (flowConditionForm.resource) {
      flowConditionForm.conditionType = "script";
      flowConditionForm.scriptType = "externalScript";
      return;
    }
    if (conditionExpression.language) {
      flowConditionForm.conditionType = "script";
      flowConditionForm.scriptType = "inlineScript";
      return;
    }
    flowConditionForm.conditionType = "expression";
  }
}

function updateFlowType(flowType) {
  // 正常条件类
  if (flowType === "condition") {
    const conditionRef = window.bpmnInstances.moddle.create("bpmn:FormalExpression");
    window.bpmnInstances.modeling.updateProperties(bpmnElement, {
      conditionExpression: conditionRef
    });
    return;
  }
  // 默认路径
  if (flowType === "default") {
    window.bpmnInstances.modeling.updateProperties(bpmnElement, {
      conditionExpression: null
    });
    window.bpmnInstances.modeling.updateProperties(bpmnElementSource, {
      default: bpmnElement
    });
    return;
  }
  // 正常路径，如果来源节点的默认路径是当前连线时，清除父元素的默认路径配置
  if (bpmnElementSourceRef.default && bpmnElementSourceRef.default.id === bpmnElement.id) {
    window.bpmnInstances.modeling.updateProperties(bpmnElementSource, {
      default: null
    });
  }
  window.bpmnInstances.modeling.updateProperties(bpmnElement, {
    conditionExpression: null
  });
}

function updateFlowCondition() {
  let { conditionType, scriptType, body, resource, language } = flowConditionForm;
  let condition;
  if (conditionType === "expression") {
    condition = window.bpmnInstances.moddle.create("bpmn:FormalExpression", { body });
  } else {
    if (scriptType === "inlineScript") {
      condition = window.bpmnInstances.moddle.create("bpmn:FormalExpression", { body, language });
      flowConditionForm.resource = "";
    } else {
      flowConditionForm.body = "";
      condition = window.bpmnInstances.moddle.create("bpmn:FormalExpression", { resource, language });
    }
  }
  window.bpmnInstances.modeling.updateProperties(bpmnElement, { conditionExpression: condition });
}

onBeforeUnmount(() => {
  bpmnElement = null;
  bpmnElementSource = null;
  bpmnElementSourceRef = null;
});
</script>
