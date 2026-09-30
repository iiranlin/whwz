import BpmnPropertiesPanel from "./PropertiesPanel.vue";

BpmnPropertiesPanel.install = function(app) {
  app.component(BpmnPropertiesPanel.name, BpmnPropertiesPanel);
};

export default BpmnPropertiesPanel;
