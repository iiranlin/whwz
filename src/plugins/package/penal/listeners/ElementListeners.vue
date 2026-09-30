<template>
  <div class="panel-tab__content">
    <el-table :data="elementListenersList" size="mini" border>
      <el-table-column label="序号" align="left" width="50px" type="index" />
      <el-table-column label="事件类型" align="left" min-width="100px" prop="event" />
      <el-table-column label="监听器类型" align="left" min-width="100px" show-overflow-tooltip :formatter="row => listenerTypeObject[row.listenerType]" />
      <el-table-column label="操作" width="90px">
        <template #default="{ row, $index }">
          <el-button size="mini" type="text" @click="openListenerForm(row, $index)">编辑</el-button>
          <el-divider direction="vertical" />
          <el-button size="mini" type="text" style="color: #ff4d4f" @click="removeListener(row, $index)">移除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="element-drawer__button">
      <el-button size="mini" type="primary" icon="Plus" @click="openListenerForm(null)">添加监听器</el-button>
    </div>

    <!-- 监听器 编辑/创建 部分 -->
    <el-drawer v-model="listenerFormModelVisible" title="执行监听器" :size="`${width}px`" append-to-body destroy-on-close>
      <el-form size="mini" :model="listenerForm" label-width="96px" ref="listenerFormRef" @submit.native.prevent>
        <el-form-item label="事件类型" prop="event" :rules="{ required: true, trigger: ['blur', 'change'] }">
          <el-select v-model="listenerForm.event">
            <el-option label="start" value="start" />
            <el-option label="end" value="end" />
          </el-select>
        </el-form-item>
        <el-form-item label="监听器类型" prop="listenerType" :rules="{ required: true, trigger: ['blur', 'change'] }">
          <el-select v-model="listenerForm.listenerType">
            <el-option v-for="i in Object.keys(listenerTypeObject)" :key="i" :label="listenerTypeObject[i]" :value="i" />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="listenerForm.listenerType === 'classListener'"
          label="Java类"
          prop="class"
          key="listener-class"
          :rules="{ required: true, trigger: ['blur', 'change'] }"
        >
          <el-input v-model="listenerForm.class" clearable />
        </el-form-item>
        <el-form-item
          v-if="listenerForm.listenerType === 'expressionListener'"
          label="表达式"
          prop="expression"
          key="listener-expression"
          :rules="{ required: true, trigger: ['blur', 'change'] }"
        >
          <el-input v-model="listenerForm.expression" clearable />
        </el-form-item>
        <el-form-item
          v-if="listenerForm.listenerType === 'delegateExpressionListener'"
          label="代理表达式"
          prop="delegateExpression"
          key="listener-delegate"
          :rules="{ required: true, trigger: ['blur', 'change'] }"
        >
          <el-input v-model="listenerForm.delegateExpression" clearable />
        </el-form-item>
        <template v-if="listenerForm.listenerType === 'scriptListener'">
          <el-form-item
            label="脚本格式"
            prop="scriptFormat"
            key="listener-script-format"
            :rules="{ required: true, trigger: ['blur', 'change'], message: '请填写脚本格式' }"
          >
            <el-input v-model="listenerForm.scriptFormat" clearable />
          </el-form-item>
          <el-form-item
            label="脚本类型"
            prop="scriptType"
            key="listener-script-type"
            :rules="{ required: true, trigger: ['blur', 'change'], message: '请选择脚本类型' }"
          >
            <el-select v-model="listenerForm.scriptType">
              <el-option label="内联脚本" value="inlineScript" />
              <el-option label="外部脚本" value="externalScript" />
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="listenerForm.scriptType === 'inlineScript'"
            label="脚本内容"
            prop="value"
            key="listener-script"
            :rules="{ required: true, trigger: ['blur', 'change'], message: '请填写脚本内容' }"
          >
            <el-input v-model="listenerForm.value" clearable />
          </el-form-item>
          <el-form-item
            v-if="listenerForm.scriptType === 'externalScript'"
            label="资源地址"
            prop="resource"
            key="listener-resource"
            :rules="{ required: true, trigger: ['blur', 'change'], message: '请填写资源地址' }"
          >
            <el-input v-model="listenerForm.resource" clearable />
          </el-form-item>
        </template>
      </el-form>
      <el-divider />
      <p class="listener-filed__title">
        <span><i class="el-icon-menu"></i>注入字段：</span>
        <el-button size="mini" type="primary" @click="openListenerFieldForm(null)">添加字段</el-button>
      </p>
      <el-table :data="fieldsListOfListener" size="mini" max-height="240" border fit style="flex: none">
        <el-table-column label="序号" align="left" width="50px" type="index" />
        <el-table-column label="字段名称" align="left" min-width="100px" prop="name" />
        <el-table-column label="字段类型" align="left" min-width="80px" show-overflow-tooltip :formatter="row => fieldTypeObject[row.fieldType]" />
        <el-table-column label="字段值/表达式" align="left" min-width="100px" show-overflow-tooltip :formatter="row => row.string || row.expression" />
        <el-table-column label="操作" width="100px">
          <template #default="{ row, $index }">
            <el-button size="mini" type="text" @click="openListenerFieldForm(row, $index)">编辑</el-button>
            <el-divider direction="vertical" />
            <el-button size="mini" type="text" style="color: #ff4d4f" @click="removeListenerField(row, $index)">移除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="element-drawer__button">
        <el-button size="mini" @click="listenerFormModelVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="saveListenerConfig">保 存</el-button>
      </div>
    </el-drawer>

    <!-- 注入西段 编辑/创建 部分 -->
    <el-dialog title="字段配置" v-model="listenerFieldFormModelVisible" width="600px" append-to-body destroy-on-close >
      <el-form :model="listenerFieldForm" size="mini" label-width="96px" ref="listenerFieldFormRef" style="height: 136px" @submit.native.prevent>
        <el-form-item label="字段名称：" prop="name" :rules="{ required: true, trigger: ['blur', 'change'] }">
          <el-input v-model="listenerFieldForm.name" clearable />
        </el-form-item>
        <el-form-item label="字段类型：" prop="fieldType" :rules="{ required: true, trigger: ['blur', 'change'] }">
          <el-select v-model="listenerFieldForm.fieldType">
            <el-option v-for="i in Object.keys(fieldTypeObject)" :key="i" :label="fieldTypeObject[i]" :value="i" />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="listenerFieldForm.fieldType === 'string'"
          label="字段值："
          prop="string"
          key="field-string"
          :rules="{ required: true, trigger: ['blur', 'change'] }"
        >
          <el-input v-model="listenerFieldForm.string" clearable />
        </el-form-item>
        <el-form-item
          v-if="listenerFieldForm.fieldType === 'expression'"
          label="表达式："
          prop="expression"
          key="field-expression"
          :rules="{ required: true, trigger: ['blur', 'change'] }"
        >
          <el-input v-model="listenerFieldForm.expression" clearable />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button size="mini" @click="listenerFieldFormModelVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="saveListenerFiled">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="ElementListeners">
import { ref, reactive, inject, watch, nextTick, getCurrentInstance } from 'vue';
import { createListenerObject, updateElementExtensions } from "../../utils";
import { initListenerType, initListenerForm, listenerType, fieldType } from "./utilSelf";

const { proxy } = getCurrentInstance();
const props = defineProps({
  id: String,
  type: String
});

const prefix = inject('prefix');
const width = inject('width');

const listenerFormRef = ref(null);
const listenerFieldFormRef = ref(null);

const elementListenersList = ref([]);
const listenerForm = reactive({});
const listenerFormModelVisible = ref(false);
const fieldsListOfListener = ref([]);
const listenerFieldForm = reactive({});
const listenerFieldFormModelVisible = ref(false);
const editingListenerIndex = ref(-1);
const editingListenerFieldIndex = ref(-1);
const listenerTypeObject = listenerType;
const fieldTypeObject = fieldType;

let bpmnElement = null;
let otherExtensionList = null;
let bpmnElementListeners = null;

watch(
  () => props.id,
  (val) => {
    val && val.length && nextTick(() => resetListenersList());
  },
  { immediate: true }
);

function resetListenersList() {
  bpmnElement = window.bpmnInstances.bpmnElement;
  otherExtensionList = [];
  bpmnElementListeners =
    bpmnElement.businessObject?.extensionElements?.values?.filter(ex => ex.$type === `${prefix}:ExecutionListener`) ?? [];
  elementListenersList.value = bpmnElementListeners.map(listener => initListenerType(listener));
}

// 打开 监听器详情 侧边栏
function openListenerForm(listener, index) {
  if (listener) {
    Object.assign(listenerForm, initListenerForm(listener));
    editingListenerIndex.value = index;
  } else {
    for (const key in listenerForm) delete listenerForm[key];
    editingListenerIndex.value = -1; // 标记为新增
  }
  if (listener && listener.fields) {
    fieldsListOfListener.value = listener.fields.map(field => ({ ...field, fieldType: field.string ? "string" : "expression" }));
  } else {
    fieldsListOfListener.value = [];
    listenerForm.fields = [];
  }
  // 打开侧边栏并清楚验证状态
  listenerFormModelVisible.value = true;
  nextTick(() => {
    listenerFormRef.value?.clearValidate();
  });
}

// 打开监听器字段编辑弹窗
function openListenerFieldForm(field, index) {
  Object.assign(listenerFieldForm, field ? JSON.parse(JSON.stringify(field)) : {});
  editingListenerFieldIndex.value = field ? index : -1;
  listenerFieldFormModelVisible.value = true;
  nextTick(() => {
    listenerFieldFormRef.value?.clearValidate();
  });
}

// 保存监听器注入字段
async function saveListenerFiled() {
  let validateStatus = await listenerFieldFormRef.value.validate();
  if (!validateStatus) return; // 验证不通过直接返回
  if (editingListenerFieldIndex.value === -1) {
    fieldsListOfListener.value.push({ ...listenerFieldForm });
    listenerForm.fields.push({ ...listenerFieldForm });
  } else {
    fieldsListOfListener.value.splice(editingListenerFieldIndex.value, 1, { ...listenerFieldForm });
    listenerForm.fields.splice(editingListenerFieldIndex.value, 1, { ...listenerFieldForm });
  }
  listenerFieldFormModelVisible.value = false;
  nextTick(() => {
    for (const key in listenerFieldForm) delete listenerFieldForm[key];
  });
}

// 移除监听器字段
function removeListenerField(field, index) {
  proxy.$modal.confirm("确认移除该字段吗？", "提示", {
    confirmButtonText: "确 认",
    cancelButtonText: "取 消"
  })
    .then(() => {
      fieldsListOfListener.value.splice(index, 1);
      listenerForm.fields.splice(index, 1);
    })
    .catch(() => console.info("操作取消"));
}

// 移除监听器
function removeListener(listener, index) {
  proxy.$modal.confirm("确认移除该监听器吗？", "提示", {
    confirmButtonText: "确 认",
    cancelButtonText: "取 消"
  })
    .then(() => {
      bpmnElementListeners.splice(index, 1);
      elementListenersList.value.splice(index, 1);
      updateElementExtensions(bpmnElement, otherExtensionList.concat(bpmnElementListeners));
    })
    .catch(() => console.info("操作取消"));
}

// 保存监听器配置
async function saveListenerConfig() {
  let validateStatus = await listenerFormRef.value.validate();
  if (!validateStatus) return; // 验证不通过直接返回
  const listenerObject = createListenerObject(listenerForm, false, prefix);
  if (editingListenerIndex.value === -1) {
    bpmnElementListeners.push(listenerObject);
    elementListenersList.value.push({ ...listenerForm });
  } else {
    bpmnElementListeners.splice(editingListenerIndex.value, 1, listenerObject);
    elementListenersList.value.splice(editingListenerIndex.value, 1, { ...listenerForm });
  }
  // 保存其他配置
  otherExtensionList = bpmnElement.businessObject?.extensionElements?.values?.filter(ex => ex.$type !== `${prefix}:ExecutionListener`) ?? [];
  updateElementExtensions(bpmnElement, otherExtensionList.concat(bpmnElementListeners));
  // 4. 隐藏侧边栏
  listenerFormModelVisible.value = false;
  for (const key in listenerForm) delete listenerForm[key];
}
</script>
