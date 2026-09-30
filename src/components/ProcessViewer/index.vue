<template>
    <div class="process-viewer">
      <div class="review-person" v-if="dialogVisible">
        <div class="v-qwe" @click="dialogVisible = false">审批人：{{ reviewPerson }}</div>
      </div>
      <div class="process-canvas" style="height: 100%;" ref="processCanvas" v-show="!isLoading" />
      <!-- 自定义箭头样式，用于成功状态下流程连线箭头 -->
      <defs ref="customSuccessDefs">
        <marker id="sequenceflow-end-white-success" viewBox="0 0 20 20" refX="11" refY="10" markerWidth="10" markerHeight="10" orient="auto">
          <path class="success-arrow" d="M 1 5 L 11 10 L 1 15 Z" style="stroke-width: 1px; stroke-linecap: round; stroke-dasharray: 10000, 1;"></path>
        </marker>
        <marker id="conditional-flow-marker-white-success" viewBox="0 0 20 20" refX="-1" refY="10" markerWidth="10" markerHeight="10" orient="auto">
          <path class="success-conditional" d="M 0 10 L 8 6 L 16 10 L 8 14 Z" style="stroke-width: 1px; stroke-linecap: round; stroke-dasharray: 10000, 1;"></path>
        </marker>
      </defs>
      <!-- 自定义箭头样式，用于失败状态下流程连线箭头 -->
      <defs ref="customFailDefs">
        <marker id="sequenceflow-end-white-fail" viewBox="0 0 20 20" refX="11" refY="10" markerWidth="10" markerHeight="10" orient="auto">
          <path class="fail-arrow" d="M 1 5 L 11 10 L 1 15 Z" style="stroke-width: 1px; stroke-linecap: round; stroke-dasharray: 10000, 1;"></path>
        </marker>
        <marker id="conditional-flow-marker-white-fail" viewBox="0 0 20 20" refX="-1" refY="10" markerWidth="10" markerHeight="10" orient="auto">
          <path class="fail-conditional" d="M 0 10 L 8 6 L 16 10 L 8 14 Z" style="stroke-width: 1px; stroke-linecap: round; stroke-dasharray: 10000, 1;"></path>
        </marker>
      </defs>
      <!-- 已完成节点悬浮弹窗 -->
<!--      <el-dialog class="comment-dialog" :title="dlgTitle || '审批记录'" :visible.sync="dialogVisible" append-to-body >-->
<!--        <el-row>-->
<!--          <el-table height="400"  :data="taskCommentList" size="mini" border header-cell-class-name="table-header-gray">-->
<!--            <el-table-column label="序号" header-align="center" align="left" type="index" width="55px" />-->
<!--            &lt;!&ndash; <el-table-column label="候选办理" prop="candidate" width="150px" align="center"/> &ndash;&gt;-->
<!--            <el-table-column label="处理人" prop="assigneeName" width="300px" align="left"/>-->
<!--            &lt;!&ndash; <el-table-column label="处理时间" prop="createTime" width="140px" align="center"/> &ndash;&gt;-->
<!--            <el-table-column label="操作时间" prop="finishTime" width="140px" align="center" />-->
<!--            <el-table-column label="耗时" prop="duration" width="100px" align="left"/>-->
<!--            <el-table-column label="审批意见" align="left">-->
<!--              <template slot-scope="scope">-->
<!--                {{scope.row.commentList&&scope.row.commentList[0]?scope.row.commentList[0].fullMessage:''}}-->
<!--              </template>-->
<!--            </el-table-column>-->
<!--          </el-table>-->
<!--        </el-row>-->
<!--      </el-dialog>-->
      <div style="position: absolute; top: 0px; right: 0px;">
        <el-row type="flex" justify="end">
          <el-button-group key="scale-control" size="medium">
            <el-button size="medium" type="default" :plain="true" :disabled="defaultZoom <= 0.3" icon="ZoomOut" @click="processZoomOut()" />
            <el-button size="medium" type="default" style="width: 90px;">{{ Math.floor(defaultZoom * 10 * 10) + "%" }}</el-button>
            <el-button size="medium" type="default" :plain="true" :disabled="defaultZoom >= 3.9" icon="ZoomIn" @click="processZoomIn()" />
            <el-button size="medium" type="default" icon="ScaleToOriginal" @click="processReZoom()" />
            <slot />
          </el-button-group>
        </el-row>
      </div>
    </div>
  </template>

<script setup name="ProcessViewer">
import { nextTick, watch, onBeforeUnmount } from 'vue'
import '@/plugins/package/theme/index.scss'
import BpmnViewer from 'bpmn-js/lib/Viewer'
import MoveCanvasModule from 'diagram-js/lib/navigation/movecanvas'

const props = defineProps({
  xml: { type: String },
  finishedInfo: { type: Object },
  // 所有节点审批记录
  allCommentList: { type: Array },
  isShowCommentList: { type: Boolean, default: () => false }
})

const dialogVisible = ref(false)
const dlgTitle = ref(undefined)
const defaultZoom = ref(1)
// 是否正在加载流程图
const isLoading = ref(false)
const bpmnViewer = ref(undefined)
// 已完成流程元素
const processNodeInfo = ref(undefined)
// 当前任务id
const selectTaskId = ref(undefined)
// 任务节点审批记录
const taskCommentList = ref([])
// 已完成任务悬浮延迟Timer
const hoverTimer = ref(null)
const reviewPerson = ref('')

// template refs
const processCanvas = ref(null)
const customSuccessDefs = ref(null)
const customFailDefs = ref(null)

const processReZoom = () => {
  defaultZoom.value = 1
  bpmnViewer.value?.get('canvas').zoom('fit-viewport', 'auto')
}
const processZoomIn = (zoomStep = 0.1) => {
  let newZoom = Math.floor(defaultZoom.value * 100 + zoomStep * 100) / 100
  if (newZoom > 4) {
    throw new Error('[Process Designer Warn ]: The zoom ratio cannot be greater than 4')
  }
  defaultZoom.value = newZoom
  bpmnViewer.value.get('canvas').zoom(defaultZoom.value)
}
const processZoomOut = (zoomStep = 0.1) => {
  let newZoom = Math.floor(defaultZoom.value * 100 - zoomStep * 100) / 100
  if (newZoom < 0.2) {
    throw new Error('[Process Designer Warn ]: The zoom ratio cannot be less than 0.2')
  }
  defaultZoom.value = newZoom
  bpmnViewer.value.get('canvas').zoom(defaultZoom.value)
}
const getOperationTagType = (type) => {
  return 'success'
  // switch (type) {
  //   case this.SysFlowTaskOperationType.AGREE:
  //   case this.SysFlowTaskOperationType.MULTI_AGREE:
  //     return 'success';
  //   case this.SysFlowTaskOperationType.REFUSE:
  //   case this.SysFlowTaskOperationType.PARALLEL_REFUSE:
  //   case this.SysFlowTaskOperationType.MULTI_REFUSE:
  //     return 'warning';
  //   case this.SysFlowTaskOperationType.STOP:
  //     return 'danger'
  //   default:
  //     return 'primary';
  // }
}
// 流程图预览清空
const clearViewer = () => {
  if (processCanvas.value) {
    processCanvas.value.innerHTML = ''
  }
  if (bpmnViewer.value) {
    bpmnViewer.value.destroy()
  }
  bpmnViewer.value = null
}
// 添加自定义箭头
const addCustomDefs = () => {
  const canvas = bpmnViewer.value.get('canvas')
  const svg = canvas._svg
  const successDefs = customSuccessDefs.value
  const failDefs = customFailDefs.value
  svg.appendChild(successDefs)
  svg.appendChild(failDefs)
}
// 任务悬浮弹窗 点击流程图节点展示详细任务框
const onSelectElement = (element) => {
  selectTaskId.value = undefined
  dlgTitle.value = undefined

  // if (processNodeInfo.value == null || processNodeInfo.value.finishedTaskSet == null) return;

  // if (element == null || processNodeInfo.value.finishedTaskSet.indexOf(element.id) === -1) {
  //   return;
  // }
  if (element == null || props.allCommentList.findIndex(i => i.taskDefKey === element.id) === -1) {
    return
  }

  selectTaskId.value = element.id
  dlgTitle.value = element.businessObject ? element.businessObject.name : undefined
  // 计算当前悬浮任务审批记录，如果记录为空不显示弹窗
  taskCommentList.value = (props.allCommentList || []).filter(item => {
    return item.taskDefKey === selectTaskId.value
  })
  reviewPerson.value = taskCommentList.value.map(item => item.assigneeName)?.join(',') || ''
  dialogVisible.value = true
}
// 显示流程图
const importXML = async (xml) => {
  clearViewer()
  if (xml != null && xml !== '') {
    try {
      bpmnViewer.value = new BpmnViewer({
        additionalModules: [
          // 移动整个画布
          MoveCanvasModule
        ],
        container: processCanvas.value,
      })
      // 任务节点悬浮事件
      bpmnViewer.value.on('element.hover', (e) => {
        const { element } = e
        if (props.isShowCommentList && element.type === 'bpmn:UserTask') {
          onSelectElement(element)
        }
      })
      bpmnViewer.value.on('element.out', (e) => {
        const { element } = e
        if (element.type === 'bpmn:UserTask') {
          // dialogVisible.value = false;
        }
      })

      isLoading.value = true
      await bpmnViewer.value.importXML(xml)
      addCustomDefs()
    } catch (e) {
      clearViewer()
    } finally {
      isLoading.value = false
      setProcessStatus(processNodeInfo.value)
    }
  }
  setTimeout(() => {
    processReZoom()
  }, 0)
}
// 设置流程图元素状态
const setProcessStatus = (pnInfo) => {
  processNodeInfo.value = pnInfo
  if (isLoading.value || processNodeInfo.value == null || bpmnViewer.value == null) return
  let { finishedTaskSet, rejectedTaskSet, unfinishedTaskSet, finishedSequenceFlowSet, stopTaskSet } = processNodeInfo.value
  const canvas = bpmnViewer.value.get('canvas')
  const elementRegistry = bpmnViewer.value.get('elementRegistry')
  if (Array.isArray(finishedSequenceFlowSet)) {
    finishedSequenceFlowSet.forEach(item => {
      if (item != null) {
        canvas.addMarker(item, 'success')
        let element = elementRegistry.get(item)
        const conditionExpression = element.businessObject.conditionExpression
        if (conditionExpression) {
          canvas.addMarker(item, 'condition-expression')
        }
      }
    })
  }
  if (Array.isArray(stopTaskSet)) {
    stopTaskSet.forEach(item => canvas.addMarker(item, 'cancel'))
  }
  if (Array.isArray(finishedTaskSet)) {
    finishedTaskSet.forEach(item => canvas.addMarker(item, 'success'))
  }
  if (Array.isArray(unfinishedTaskSet)) {
    unfinishedTaskSet.forEach(item => canvas.addMarker(item, 'primary'))
  }
  if (Array.isArray(rejectedTaskSet)) {
    rejectedTaskSet.forEach(item => {
      if (item != null) {
        let element = elementRegistry.get(item)
        if (element.type.includes('Task')) {
          canvas.addMarker(item, 'danger')
        } else {
          canvas.addMarker(item, 'warning')
        }
      }
    })
  }
}

watch(() => props.xml, (newXml) => {
  importXML(newXml)
}, { immediate: true })

watch(() => props.finishedInfo, (newInfo) => {
  setProcessStatus(newInfo)
}, { immediate: true })

// created → setup 顶层 nextTick
nextTick(() => {
  importXML(props.xml)
  setProcessStatus(props.finishedInfo)
})

onBeforeUnmount(() => {
  clearViewer()
})
</script>

<style lang="scss" scoped>>
.process-viewer {
  position: relative;
}
.review-person {
  width: 1000px;
  display: flex;
  justify-content: center;
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 999999;
  background-color: transparent;
  .v-qwe {
    background: #fefefe;
    height: 60px;
    padding: 10px;
    overflow-x: hidden;
    overflow-y: auto;
    border-radius: 10px;
    border: 1px solid #ccc;
  }
}
</style>
