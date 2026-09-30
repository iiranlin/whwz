<template>
  <div style="margin-top: 16px">
    <el-form-item label="消息实例">
      <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: nowrap">
        <el-select v-model="bindMessageId" @change="updateTaskMessage">
          <el-option v-for="id in Object.keys(messageMap)" :value="id" :label="messageMap[id]" :key="id" />
        </el-select>
        <el-button size="mini" type="primary" icon="Plus" style="margin-left: 8px" @click="openMessageModel" />
      </div>
    </el-form-item>
    <el-dialog v-model="messageModelVisible" :close-on-click-modal="false" title="创建新消息" width="400px" append-to-body destroy-on-close >
      <el-form :model="newMessageForm" size="mini" label-width="90px" @submit.native.prevent>
        <el-form-item label="消息ID">
          <el-input v-model="newMessageForm.id" clearable />
        </el-form-item>
        <el-form-item label="消息名称">
          <el-input v-model="newMessageForm.name" clearable />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button size="mini" type="primary" @click="createNewMessage">确 认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="ReceiveTask">
import { ref, reactive, watch, nextTick, onBeforeUnmount } from 'vue';
import { ElMessage } from 'element-plus';

const props = defineProps({
  id: String,
  type: String
});

const bindMessageId = ref("");
const newMessageForm = reactive({});
const messageMap = ref({});
const messageModelVisible = ref(false);

let bpmnElement = null;
let bpmnMessageRefsMap = null;
let bpmnRootElements = null;

function initMessageMap() {
  bpmnMessageRefsMap = Object.create(null);
  bpmnRootElements = window.bpmnInstances.modeler.getDefinitions().rootElements;
  bpmnRootElements
    .filter(el => el.$type === "bpmn:Message")
    .forEach(m => {
      bpmnMessageRefsMap[m.id] = m;
      messageMap.value[m.id] = m.name;
    });
  messageMap.value["-1"] = "无"; // 添加一个空对象，保证可以取消原消息绑定
}
// created
initMessageMap();

watch(
  () => props.id,
  () => {
    nextTick(() => getBindMessage());
  },
  { immediate: true }
);

function getBindMessage() {
  bpmnElement = window.bpmnInstances.bpmnElement;
  bindMessageId.value = bpmnElement.businessObject?.messageRef?.id || "-1";
}

function openMessageModel() {
  Object.keys(newMessageForm).forEach(k => delete newMessageForm[k]);
  messageModelVisible.value = true;
}

function createNewMessage() {
  if (messageMap.value[newMessageForm.id]) {
    ElMessage.error("该消息已存在，请修改id后重新保存");
    return;
  }
  const newMessage = window.bpmnInstances.moddle.create("bpmn:Message", { ...newMessageForm });
  bpmnRootElements.push(newMessage);
  messageMap.value[newMessageForm.id] = newMessageForm.name;
  bpmnMessageRefsMap[newMessageForm.id] = newMessage;
  messageModelVisible.value = false;
}

function updateTaskMessage(messageId) {
  if (messageId === "-1") {
    window.bpmnInstances.modeling.updateProperties(bpmnElement, {
      messageRef: null
    });
  } else {
    window.bpmnInstances.modeling.updateProperties(bpmnElement, {
      messageRef: bpmnMessageRefsMap[messageId]
    });
  }
}

onBeforeUnmount(() => {
  bpmnElement = null;
});
</script>
