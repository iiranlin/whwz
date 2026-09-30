<template>
  <div class="panel-tab__content">
    <el-form size="mini" label-width="90px" @submit.native.prevent>
      <el-form-item label="ID">
        <el-input
          v-model="elementBaseInfo.id"
          :disabled="idEditDisabled || elementBaseInfo.$type === 'bpmn:Process'"
          clearable
          @change="updateBaseInfo('id')"
        />
      </el-form-item>
      <el-form-item label="名称">
        <el-input v-model="elementBaseInfo.name" clearable @change="updateBaseInfo('name')" />
      </el-form-item>
      <!--流程的基础属性-->
      <template v-if="elementBaseInfo.$type === 'bpmn:Process'">
        <el-form-item label="版本标签">
          <el-input v-model="elementBaseInfo.versionTag" clearable @change="updateBaseInfo('versionTag')" />
        </el-form-item>
        <el-form-item label="可执行">
          <el-switch v-model="elementBaseInfo.isExecutable" active-text="是" inactive-text="否" @change="updateBaseInfo('isExecutable')" />
        </el-form-item>
      </template>
    </el-form>
  </div>
</template>

<script setup name="ElementBaseInfo">
import { ref, watch, nextTick, onBeforeUnmount } from 'vue';

const props = defineProps({
  businessObject: Object,
  type: String,
  idEditDisabled: {
    type: Boolean,
    default: true
  }
});

const elementBaseInfo = ref({});
let bpmnElement = null;

watch(
  () => props.businessObject,
  (val) => {
    if (val) {
      nextTick(() => resetBaseInfo());
    }
  }
);

function resetBaseInfo() {
  bpmnElement = window?.bpmnInstances?.bpmnElement;
  elementBaseInfo.value = JSON.parse(JSON.stringify(bpmnElement.businessObject));
}

function updateBaseInfo(key) {
  const attrObj = Object.create(null);
  attrObj[key] = elementBaseInfo.value[key];
  if (key === "id") {
    window.bpmnInstances.modeling.updateProperties(bpmnElement, {
      id: elementBaseInfo.value[key],
      di: { id: `${elementBaseInfo.value[key]}_di` }
    });
  } else {
    window.bpmnInstances.modeling.updateProperties(bpmnElement, attrObj);
  }
}

onBeforeUnmount(() => {
  bpmnElement = null;
});
</script>
