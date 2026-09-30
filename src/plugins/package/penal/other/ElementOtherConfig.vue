<template>
  <div class="panel-tab__content">
    <div class="element-property input-property">
      <div class="element-property__label">元素文档：</div>
      <div class="element-property__value">
        <el-input
          type="textarea"
          v-model="documentation"
          size="mini"
          resize="vertical"
          :autosize="{ minRows: 2, maxRows: 4 }"
          @input="updateDocumentation"
          @blur="updateDocumentation"
        />
      </div>
    </div>
  </div>
</template>

<script setup name="ElementOtherConfig">
import { ref, watch, nextTick, onBeforeUnmount } from 'vue';

const props = defineProps({
  id: String
});

const documentation = ref("");
let bpmnElement = null;

watch(
  () => props.id,
  (id) => {
    if (id && id.length) {
      nextTick(() => {
        const documentations = window.bpmnInstances.bpmnElement.businessObject?.documentation;
        documentation.value = documentations && documentations.length ? documentations[0].text : "";
      });
    } else {
      documentation.value = "";
    }
  },
  { immediate: true }
);

function updateDocumentation() {
  (!bpmnElement || bpmnElement.id !== props.id) && (bpmnElement = window.bpmnInstances.elementRegistry.get(props.id));
  const doc = window.bpmnInstances.bpmnFactory.create("bpmn:Documentation", { text: documentation.value });
  window.bpmnInstances.modeling.updateProperties(bpmnElement, {
    documentation: [doc]
  });
}

onBeforeUnmount(() => {
  bpmnElement = null;
});
</script>
