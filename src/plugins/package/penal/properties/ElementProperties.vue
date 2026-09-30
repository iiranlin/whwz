<template>
  <div class="panel-tab__content">
    <el-table :data="elementPropertyList" size="mini" max-height="240" border fit>
      <el-table-column align="left" label="序号" width="50px" type="index" />
      <el-table-column align="left" label="属性名" prop="name" min-width="100px" show-overflow-tooltip />
      <el-table-column align="left" label="属性值" prop="value" min-width="100px" show-overflow-tooltip />
      <el-table-column label="操作" width="90px">
        <template #default="{ row, $index }">
          <el-button size="mini" type="text" @click="openAttributesForm(row, $index)">编辑</el-button>
          <el-divider direction="vertical" />
          <el-button size="mini" type="text" style="color: #ff4d4f" @click="removeAttributes(row, $index)">移除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="element-drawer__button">
      <el-button size="mini" type="primary" icon="Plus" @click="openAttributesForm(null, -1)">添加属性</el-button>
    </div>

    <el-dialog v-model="propertyFormModelVisible" title="属性配置" width="600px" append-to-body destroy-on-close>
      <el-form :model="propertyForm" label-width="80px" size="mini" ref="attributeFormRef" @submit.native.prevent >
        <el-form-item label="属性名：" prop="name">
          <el-input v-model="propertyForm.name" clearable />
        </el-form-item>
        <el-form-item label="属性值：" prop="value">
          <el-input v-model="propertyForm.value" clearable />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button size="mini" @click="propertyFormModelVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="saveAttribute">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="ElementProperties">
import { ref, reactive, inject, watch, nextTick, getCurrentInstance } from 'vue';

const { proxy } = getCurrentInstance();
const props = defineProps({
  id: String,
  type: String
});

const prefix = inject('prefix');
const width = inject('width');

const attributeFormRef = ref(null);

const elementPropertyList = ref([]);
const propertyForm = reactive({});
const editingPropertyIndex = ref(-1);
const propertyFormModelVisible = ref(false);

let bpmnElement = null;
let otherExtensionList = null;
let bpmnElementProperties = null;
let bpmnElementPropertyList = null;

watch(
  () => props.id,
  (val) => {
    val && val.length && resetAttributesList();
  },
  { immediate: true }
);

function resetAttributesList() {
  bpmnElement = window.bpmnInstances.bpmnElement;
  otherExtensionList = []; // 其他扩展配置
  bpmnElementProperties =
    bpmnElement.businessObject?.extensionElements?.values?.filter(ex => {
      if (ex.$type !== `${prefix}:Properties`) {
        otherExtensionList.push(ex);
      }
      return ex.$type === `${prefix}:Properties`;
    }) ?? [];

  // 保存所有的 扩展属性字段
  bpmnElementPropertyList = bpmnElementProperties.reduce((pre, current) => pre.concat(current.values), []);
  // 复制 显示
  elementPropertyList.value = JSON.parse(JSON.stringify(bpmnElementPropertyList ?? []));
}

function openAttributesForm(attr, index) {
  editingPropertyIndex.value = index;
  if (index === -1) {
    Object.keys(propertyForm).forEach(k => delete propertyForm[k]);
  } else {
    Object.assign(propertyForm, JSON.parse(JSON.stringify(attr)));
  }
  propertyFormModelVisible.value = true;
  nextTick(() => {
    attributeFormRef.value?.clearValidate();
  });
}

function removeAttributes(attr, index) {
  proxy.$modal.confirm("确认移除该属性吗？", "提示", {
    confirmButtonText: "确 认",
    cancelButtonText: "取 消"
  })
    .then(() => {
      elementPropertyList.value.splice(index, 1);
      bpmnElementPropertyList.splice(index, 1);
      // 新建一个属性字段的保存列表
      const propertiesObject = window.bpmnInstances.moddle.create(`${prefix}:Properties`, {
        values: bpmnElementPropertyList
      });
      updateElementExtensions(propertiesObject);
      resetAttributesList();
    })
    .catch(() => console.info("操作取消"));
}

function saveAttribute() {
  const { name, value } = propertyForm;
  if (editingPropertyIndex.value !== -1) {
    window.bpmnInstances.modeling.updateModdleProperties(bpmnElement, bpmnElementPropertyList[editingPropertyIndex.value], {
      name,
      value
    });
  } else {
    // 新建属性字段
    const newPropertyObject = window.bpmnInstances.moddle.create(`${prefix}:Property`, { name, value });
    // 新建一个属性字段的保存列表
    const propertiesObject = window.bpmnInstances.moddle.create(`${prefix}:Properties`, {
      values: bpmnElementPropertyList.concat([newPropertyObject])
    });
    updateElementExtensions(propertiesObject);
  }
  propertyFormModelVisible.value = false;
  resetAttributesList();
}

function updateElementExtensions(properties) {
  const extensions = window.bpmnInstances.moddle.create("bpmn:ExtensionElements", {
    values: otherExtensionList.concat([properties])
  });
  window.bpmnInstances.modeling.updateProperties(bpmnElement, {
    extensionElements: extensions
  });
}
</script>
