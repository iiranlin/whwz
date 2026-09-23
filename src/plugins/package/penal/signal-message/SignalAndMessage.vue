<template>
  <div class="panel-tab__content">
    <div class="panel-tab__content--title">
      <span><i class="el-icon-menu" style="margin-right: 8px; color: #555555"></i>消息列表</span>
      <el-button size="mini" type="primary" icon="el-icon-plus" @click="openModel('message')">创建新消息</el-button>
    </div>
    <el-table :data="messageList" size="mini" border>
      <el-table-column align="left" type="index" label="序号" width="60px" />
      <el-table-column align="left" label="消息ID" prop="id" max-width="300px" show-overflow-tooltip />
      <el-table-column align="left" label="消息名称" prop="name" max-width="300px" show-overflow-tooltip />
    </el-table>
    <div class="panel-tab__content--title" style="padding-top: 8px; margin-top: 8px; border-top: 1px solid #eeeeee">
      <span><i class="el-icon-menu" style="margin-right: 8px; color: #555555"></i>信号列表</span>
      <el-button size="mini" type="primary" icon="el-icon-plus" @click="openModel('signal')">创建新信号</el-button>
    </div>
    <el-table :data="signalList" size="mini" border>
      <el-table-column align="left" type="index" label="序号" width="60px" />
      <el-table-column align="left"label="信号ID" prop="id" max-width="300px" show-overflow-tooltip />
      <el-table-column align="left" label="信号名称" prop="name" max-width="300px" show-overflow-tooltip />
    </el-table>

    <el-dialog v-model="modelVisible" :title="modelConfig.title" :close-on-click-modal="false" width="400px" append-to-body destroy-on-close >
      <el-form :model="modelObjectForm" size="mini" label-width="90px" @submit.native.prevent>
        <el-form-item :label="modelConfig.idLabel">
          <el-input v-model="modelObjectForm.id" clearable />
        </el-form-item>
        <el-form-item :label="modelConfig.nameLabel">
          <el-input v-model="modelObjectForm.name" clearable />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button size="mini" @click="modelVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="addNewObject">保 存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="SignalAndMassage">
import { ref, reactive, computed, onMounted } from 'vue';
import { ElMessage } from 'element-plus';

const signalList = ref([]);
const messageList = ref([]);
const modelVisible = ref(false);
const modelType = ref("");
const modelObjectForm = reactive({});

let rootElements = null;
let messageIdMap = null;
let signalIdMap = null;

const modelConfig = computed(() => {
  if (modelType.value === "message") {
    return { title: "创建消息", idLabel: "消息ID", nameLabel: "消息名称" };
  } else {
    return { title: "创建信号", idLabel: "信号ID", nameLabel: "信号名称" };
  }
});

function initDataList() {
  rootElements = window.bpmnInstances.modeler.getDefinitions().rootElements;
  messageIdMap = {};
  signalIdMap = {};
  messageList.value = [];
  signalList.value = [];
  rootElements.forEach(el => {
    if (el.$type === "bpmn:Message") {
      messageIdMap[el.id] = true;
      messageList.value.push({ ...el });
    }
    if (el.$type === "bpmn:Signal") {
      signalIdMap[el.id] = true;
      signalList.value.push({ ...el });
    }
  });
}

function openModel(type) {
  modelType.value = type;
  Object.keys(modelObjectForm).forEach(k => delete modelObjectForm[k]);
  modelVisible.value = true;
}

function addNewObject() {
  if (modelType.value === "message") {
    if (messageIdMap[modelObjectForm.id]) {
      return ElMessage.error("该消息已存在，请修改id后重新保存");
    }
    const messageRef = window.bpmnInstances.moddle.create("bpmn:Message", { ...modelObjectForm });
    rootElements.push(messageRef);
  } else {
    if (signalIdMap[modelObjectForm.id]) {
      return ElMessage.error("该信号已存在，请修改id后重新保存");
    }
    const signalRef = window.bpmnInstances.moddle.create("bpmn:Signal", { ...modelObjectForm });
    rootElements.push(signalRef);
  }
  modelVisible.value = false;
  initDataList();
}

onMounted(() => {
  initDataList();
});
</script>
