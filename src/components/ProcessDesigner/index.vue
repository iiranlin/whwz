<template>
  <div class="process-design" :style="'display: flex; height:' + height">
    <bpmn-process-designer
      v-model="xmlString"
      v-bind="controlForm"
      keyboard
      ref="processDesigner"
      :events="[
        'element.click',
        'connection.added',
        'connection.removed',
        'connection.changed'
      ]"
      @element-click="elementClick"
      @init-finished="initModeler"
      @event="handlerEvent"
      @save="onSaveProcess"
    />
    <bmpn-process-penal :bpmn-modeler="modeler" :prefix="controlForm.prefix" class="process-panel" />
  </div>
</template>

<script setup name="ProcessDesigner">
import '@/plugins/package/theme/index.scss'
import { BpmnProcessDesigner, BmpnProcessPenal } from '@/plugins/package/index'
// 自定义元素选中时的弹出菜单（修改 默认任务 为 用户任务）
import CustomContentPadProvider from '@/plugins/package/designer/plugins/content-pad'
// 自定义左侧菜单（修改 默认任务 为 用户任务）
import CustomPaletteProvider from '@/plugins/package/designer/plugins/palette'
import 'highlight.js/styles/atom-one-dark-reasonable.css'

const props = defineProps({
  bpmnXml: {
    type: String,
    required: true
  },
  designerForm: {
    type: Object,
    required: true
  }
})
const emit = defineEmits(['save'])

const height = document.documentElement.clientHeight - 94.5 + 'px;'
const xmlString = ref(props.bpmnXml)
const modeler = ref(null)
const element = ref(null)
const controlForm = reactive({
  processId: props.designerForm.processKey || '',
  processName: props.designerForm.processName || '',
  simulation: false,
  labelEditing: false,
  labelVisible: false,
  prefix: 'flowable',
  headerButtonSize: 'small',
  additionalModel: [CustomContentPadProvider, CustomPaletteProvider]
})

const elementClick = (el) => {
  element.value = el
}
const initModeler = (m) => {
  setTimeout(() => {
    modeler.value = m
  }, 10)
}
const handlerEvent = (eventName, el) => {
  // no-op
}
const onSaveProcess = (saveData) => {
  emit('save', saveData)
}
</script>

<style lang="scss">
body {
  overflow: hidden;
  margin: 0;
  box-sizing: border-box;
}
body,
body * {
  /* 滚动条 */
  &::-webkit-scrollbar-track-piece {
    background-color: #fff; /*滚动条的背景颜色*/
    -webkit-border-radius: 0; /*滚动条的圆角宽度*/
  }

  // &::-webkit-scrollbar {
  //   width: 10px; /*滚动条的宽度*/
  //   height: 8px; /*滚动条的高度*/
  // }

  &::-webkit-scrollbar-thumb:vertical {
    /*垂直滚动条的样式*/
    height: 50px;
    background-color: rgba(153, 153, 153, 0.5);
    -webkit-border-radius: 4px;
    outline: 2px solid #fff;
    outline-offset: -2px;
    border: 2px solid #fff;
  }

  &::-webkit-scrollbar-thumb {
    /*滚动条的hover样式*/
    background-color: rgba(159, 159, 159, 0.3);
    -webkit-border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    /*滚动条的hover样式*/
    background-color: rgba(159, 159, 159, 0.5);
    -webkit-border-radius: 4px;
  }
}
</style>
