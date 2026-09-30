import BpmnProcessDesigner from "./ProcessDesigner.vue";

BpmnProcessDesigner.install = function(app) {
  app.component(BpmnProcessDesigner.name, BpmnProcessDesigner);
};

export default BpmnProcessDesigner;
