<template>
  <div
    class="process-panel__container"
    :style="{ width: `${props.width}px` }"
  >
    <el-collapse v-model="activeTab">
      <el-collapse-item name="base">
        <template #title>
          <div class="panel-tab__title"><i class="el-icon-info"></i>常规</div>
        </template>
        <element-base-info
          :id-edit-disabled="idEditDisabled"
          :business-object="elementBusinessObject"
          :type="elementType"
        />
      </el-collapse-item>
      <!-- <el-collapse-item name="condition" v-if="elementType === 'Process'" key="message">
        <div #title class="panel-tab__title"><i class="el-icon-s-comment"></i>消息与信号</div>
        <signal-and-massage />
      </el-collapse-item> -->
      <el-collapse-item
        name="condition"
        v-if="conditionFormVisible"
        key="condition"
      >
        <template #title>
          <div class="panel-tab__title"><i class="el-icon-s-promotion"></i>流转条件</div>
        </template>
        <flow-condition
          :business-object="elementBusinessObject"
          :type="elementType"
        />
      </el-collapse-item>
      <!-- <el-collapse-item name="condition" v-if="formVisible" key="form">
        <div #title class="panel-tab__title"><i class="el-icon-s-order"></i>表单</div>
        <element-form :id="elementId" :type="elementType" />
      </el-collapse-item> -->
      <el-collapse-item
        name="task"
        v-if="elementType.indexOf('Task') !== -1"
        key="task"
      >
        <template #title>
          <div class="panel-tab__title"><i class="el-icon-s-claim"></i>任务</div>
        </template>
        <element-task
          :id="elementId"
          :type="elementType"
        />
      </el-collapse-item>
      <el-collapse-item
        name="multiInstance"
        v-if="elementType.indexOf('Task') !== -1 && elementType !== 'UserTask'"
        key="multiInstance"
      >
        <template #title>
          <div class="panel-tab__title"><i class="el-icon-s-help"></i>多实例</div>
        </template>
        <element-multi-instance
          :business-object="elementBusinessObject"
          :type="elementType"
        />
      </el-collapse-item>
      <!-- <el-collapse-item name="listeners" key="listeners">
        <div #title class="panel-tab__title"><i class="el-icon-message-solid"></i>执行监听器</div>
        <element-listeners :id="elementId" :type="elementType" />
      </el-collapse-item> -->
      <!-- <el-collapse-item name="taskListeners" v-if="elementType === 'UserTask'" key="taskListeners">
        <div #title class="panel-tab__title"><i class="el-icon-message-solid"></i>任务监听器</div>
        <user-task-listeners :id="elementId" :type="elementType" />
      </el-collapse-item> -->
      <!-- <el-collapse-item name="extensions" key="extensions">
        <div #title class="panel-tab__title"><i class="el-icon-circle-plus"></i>扩展属性</div>
        <element-properties :id="elementId" :type="elementType" />
      </el-collapse-item> -->
      <!-- <el-collapse-item name="other" key="other">
        <div #title class="panel-tab__title"><i class="el-icon-s-promotion"></i>其他</div>
        <element-other-config :id="elementId" />
      </el-collapse-item> -->
    </el-collapse>
  </div>
</template>
<script setup name="BpmnPropertiesPanel">
import { ref, reactive, watch, provide, onBeforeUnmount } from "vue";
import ElementBaseInfo from "./base/ElementBaseInfo";
import ElementOtherConfig from "./other/ElementOtherConfig";
import ElementTask from "./task/ElementTask";
import ElementMultiInstance from "./multi-instance/ElementMultiInstance";
import FlowCondition from "./flow-condition/FlowCondition";
import SignalAndMassage from "./signal-message/SignalAndMessage";
import ElementListeners from "./listeners/ElementListeners";
import ElementProperties from "./properties/ElementProperties";
import ElementForm from "./form/ElementForm";
import UserTaskListeners from "./listeners/UserTaskListeners";

/**
 * 侧边栏
 * @Author MiyueFE
 * @Home https://github.com/miyuesc
 * @Date 2021年3月31日18:57:51
 */

const props = defineProps({
  bpmnModeler: Object,
  prefix: {
    type: String,
    default: "camunda"
  },
  width: {
    type: Number,
    default: 480
  },
  idEditDisabled: {
    type: Boolean,
    default: false
  }
});

provide("prefix", props.prefix);
provide("width", props.width);

const activeTab = ref(["base", "task"]);
const elementId = ref("");
const elementType = ref("");
const elementBusinessObject = reactive({}); // 元素 businessObject 镜像，提供给需要做判断的组件使用
const conditionFormVisible = ref(false); // 流转条件设置
const formVisible = ref(false); // 表单配置

let timer = null;

watch(elementId, () => {
  // activeTab.value = "base";
  activeTab.value = ["base", "task"];
});

// 兼容原 methods 里对 this.bpmnElement 的赋值（initFormOnChanged 里 this.bpmnElement = activatedElement）
// 原文件 this.bpmnElement 仅被赋值，未被读取，这里保留为全局挂载的 window.bpmnInstances.bpmnElement 即可

function initModels() {
  // 初始化 modeler 以及其他 moddle
  if (!props.bpmnModeler) {
    // 避免加载时 流程图 并未加载完成
    timer = setTimeout(() => initModels(), 10);
    return;
  }
  if (timer) clearTimeout(timer);
  window.bpmnInstances = {
    modeler: props.bpmnModeler,
    modeling: props.bpmnModeler.get("modeling"),
    moddle: props.bpmnModeler.get("moddle"),
    eventBus: props.bpmnModeler.get("eventBus"),
    bpmnFactory: props.bpmnModeler.get("bpmnFactory"),
    elementFactory: props.bpmnModeler.get("elementFactory"),
    elementRegistry: props.bpmnModeler.get("elementRegistry"),
    replace: props.bpmnModeler.get("replace"),
    selection: props.bpmnModeler.get("selection")
  };
  getActiveElement();
}

function getActiveElement() {
  // 初始第一个选中元素 bpmn:Process
  initFormOnChanged(null);
  props.bpmnModeler.on("import.done", () => {
    initFormOnChanged(null);
  });
  // 监听选择事件，修改当前激活的元素以及表单
  props.bpmnModeler.on("selection.changed", ({ newSelection }) => {
    initFormOnChanged(newSelection[0] || null);
  });
  props.bpmnModeler.on("element.changed", ({ element }) => {
    // 保证 修改 "默认流转路径" 类似需要修改多个元素的事件发生的时候，更新表单的元素与原选中元素不一致。
    if (element && element.id === elementId.value) {
      initFormOnChanged(element);
    }
  });
}

// 初始化数据
function initFormOnChanged(element) {
  let activatedElement = element;
  if (!activatedElement) {
    activatedElement =
      window.bpmnInstances.elementRegistry.find(el => el.type === "bpmn:Process") ??
      window.bpmnInstances.elementRegistry.find(el => el.type === "bpmn:Collaboration");
  }
  if (!activatedElement) return;
  console.log(`
              ----------
      select element changed:
                id:  ${activatedElement.id}
              type:  ${activatedElement.businessObject.$type}
              ----------
              `);
  // console.log("businessObject: ", activatedElement.businessObject);
  // 如果是任务节点 即 type === 'bpmn:UserTask'  第一个任务节点为必须选择为发起人
  // if (activatedElement?.type === 'bpmn:UserTask') {
  //   const userTaskList = activatedElement?.parent?.children?.filter(i => i.type === 'bpmn:UserTask');
  // }
  window.bpmnInstances.bpmnElement = activatedElement;
  elementId.value = activatedElement.id;
  elementType.value = activatedElement.type.split(":")[1] || "";
  Object.assign(elementBusinessObject, JSON.parse(JSON.stringify(activatedElement.businessObject)));
  conditionFormVisible.value = !!(
    elementType.value === "SequenceFlow" &&
    activatedElement.source &&
    activatedElement.source.type.indexOf("StartEvent") === -1
  );
  formVisible.value = elementType.value === "UserTask" || elementType.value === "StartEvent";
}

initModels();

onBeforeUnmount(() => {
  window.bpmnInstances = null;
});
</script>
