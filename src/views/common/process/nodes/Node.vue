<template>
  <div :class="{'node': true, 'root': isRoot || !show, 'node-error-state': showError}">
    <div v-if="show" @click="onSelect" :class="{'node-body': true, 'error': showError}" >
      <div @mouseenter="hoverHeader = true" @mouseleave="hoverHeader = false">
        <div class="node-body-header" :style="{'background-color': headerBgc}">
          <el-icon style="margin-right: 5px" size="12" v-if="(iconComponent || '') !== ''"><component :is="iconComponent" /></el-icon>
          <ellipsis class="name" hover-tip :content="title"/>
          <el-icon v-if="!isRoot && processStore.diagramMode !== 'viewer'" v-show="hoverHeader" style="float:right;" size="15" @click="onDelNode"><Close/></el-icon>
        </div>
        <div class="node-body-content">
          <i :class="leftIcon" v-if="leftIcon"></i>
          <span class="placeholder" v-if="(content || '').trim() === ''">{{placeholder}}</span>
          <ellipsis :row="3" :content="content" v-else/>
          <el-icon v-if="processStore.diagramMode !== 'viewer'"><ArrowRight /></el-icon>
        </div>
        <div class="node-error" v-if="showError">
          <el-tooltip effect="dark" :content="errorInfo" placement="top-start">
            <el-icon><Warning /></el-icon>
          </el-tooltip>
        </div>
      </div>
    </div>
    <div class="node-footer">
      <div class="btn">
        <insert-button
          v-show="processStore.diagramMode !== 'viewer'"
          @insertNode="onInsertNode"
        ></insert-button>
      </div>
    </div>
  </div>
</template>

<script setup name="Node">
import { onMounted, onBeforeUnmount, watch, computed } from 'vue'
import InsertButton from '@/views/common/InsertButton.vue'
import { useProcessStore } from '@/store/modules/process'
import {
  UserFilled,
  Search,
  Edit,
  Setting,
  Delete
} from '@element-plus/icons-vue'

const processStore = useProcessStore()
const hoverHeader = ref(false)
const props = defineProps({
  //是否为根节点
  isRoot: {
    type: Boolean,
    default: false
  },
  //是否显示节点体
  show: {
    type: Boolean,
    default: true
  },
  //节点内容区域文字
  content: {
    type: String,
    default: ""
  },
  title: {
    type: String,
    default: "标题"
  },
  placeholder: {
    type: String,
    default: "请设置"
  },
  //节点体左侧图标
  leftIcon: {
    type: String,
    default: undefined
  },
  //头部图标
  headerIcon: {
    type: String,
    default: ''
  },
  //头部背景色
  headerBgc: {
    type: String,
    default: '#576a95'
  },
  //是否显示错误状态
  showError: {
    type: Boolean,
    default: false
  },
  errorInfo: {
    type: String,
    default: '无信息'
  },
})
const emit = defineEmits(['selected', 'delNode', 'insertNode'])
// Element UI 类名 → Element Plus 组件的映射
const iconMap = {
  'el-icon-user-solid': UserFilled,
  'el-icon-s-check': UserFilled,
  'el-icon-search': Search,
  'el-icon-edit': Edit,
  'el-icon-setting': Setting,
  'el-icon-delete': Delete
  // ...按项目实际用到的图标继续补充
}

const iconComponent = computed(() => iconMap[props.headerIcon] || null)


onMounted(() => {
})

onBeforeUnmount(() => {
  console.log('[Node] onBeforeUnmount, title =', props.title)
})

// 监听 diagramMode 变化，观察按钮是否被隐藏
watch(
  () => processStore.diagramMode,
  (val, oldVal) => {
    console.log('[Node] diagramMode 变化:', oldVal, '->', val, ', title =', props.title)
  }
)

// 监听 show，确认节点体是否渲染
watch(
  () => props.show,
  (val) => {
    console.log('[Node] show 变化:', val, ', title =', props.title)
  },
  { immediate: true }
)
/* ========== 调试日志结束 ========== */

function onSelect() {
  console.log('[Node] 节点被点击 (selected), title =', props.title)
  emit('selected')
}

function onDelNode() {
  console.log('[Node] 删除节点 (delNode), title =', props.title)
  emit('delNode')
}

function onInsertNode(type) {
  console.log('[Node] 收到 InsertButton 的 insertNode 事件, type =', type, ', title =', props.title)
  emit('insertNode', type)
}
</script>

<style lang="scss" scoped>

.root{
  &:before{
    display: none !important;
  }
}
.node-error-state{
  .node-body{
    box-shadow: 0px 0px 5px 0px #F56C6C !important;
  }
}
.node{
  padding: 0 50px;
  width: 220px;
  position: relative;
  &:before{
    content: '';
    position: absolute;
    top: -12px;
    left: 50%;
    -webkit-transform: translateX(-50%);
    transform: translateX(-50%);
    width: 0;
    border-style: solid;
    border-width: 8px 6px 4px;
    border-color: #CACACA transparent transparent;
    background: #F5F5F7;
  }
  .node-body{
    cursor: pointer;
    max-height: 120px;
    position: relative;
    border-radius: 5px;
    background-color: white;
    box-shadow: 0px 0px 5px 0px #d8d8d8;
    &:hover{
      box-shadow: 0px 0px 3px 0px #1890FF;
      .node-body-header {
        .el-icon-close {
          display: inline;
          font-size: medium;
        }
      }
    }
    .node-body-header{
      border-top-left-radius: 5px;
      border-top-right-radius: 5px;
      padding: 5px 15px;
      color: white;
      font-size: xx-small;
      .el-icon-close{
        display: none;
      }
      .name{
        height: 14px;
        width: 150px;
        display: inline-block
      }
    }
    .node-body-content{
      padding: 18px;
      color: #656363;
      font-size: 14px;
      i{
        position: absolute;
        top: 55%;
        right: 5px;
        font-size: medium;
      }
      .placeholder{
        color: #8c8c8c;
      }
    }
    .node-error{
      position: absolute;
      right: -40px;
      top: 20px;
      font-size: 25px;
      color: #F56C6C;
    }
  }

  .node-footer{
    position: relative;
    .btn{
      width: 100%;
      display: flex;
      padding: 20px 0 32px;
      justify-content: center;
      /* 调试：临时提高层级，排除被 ::before 盖住的可能 */
      position: relative;
      z-index: 10;
    }
    :deep(.el-button){
      height: 32px;
    }
    &::before{
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: -1;
      margin: auto;
      width: 2px;
      height: 100%;
      background-color: #CACACA;
    }
  }
}
</style>