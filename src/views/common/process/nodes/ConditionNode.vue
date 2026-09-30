<template>
  <div :class="{'node': true, 'node-error-state': showError}">
    <div :class="{'node-body': true, 'error': showError}">
      <div class="node-body-left" @click="$emit('leftMove')" v-if="level > 1 && processStore.diagramMode !== 'viewer' && config.id.indexOf('default_node') === -1">
        <el-icon><ArrowLeft /></el-icon>
      </div>
      <div class="node-body-main" @click="$emit('selected')">
        <div class="node-body-main-header">
          <ellipsis class="title" hover-tip :content="config.name ? config.name : ('条件' + level)"/>
          <span class="level">优先级{{ level }}</span>
          <span class="option"  v-if="processStore.diagramMode !== 'viewer' && config.id.indexOf('default_node') === -1">
            <el-tooltip effect="dark" content="复制条件" placement="top">
              <el-icon @click.stop="$emit('copy')"><CopyDocument /></el-icon>
            </el-tooltip>
            <el-icon @click.stop="$emit('delNode')"><Close /></el-icon>
          </span>
        </div>
        <!-- 条件显示框内的条件 -->
        <div class="node-body-main-content">
          <span class="placeholder" v-if="(content || '').trim() === ''">{{ config.id.indexOf('default_node') !== -1 ? '其他情况进入此分支' : placeholder }}</span>
          <ellipsis hoverTip :row="4" :content="content" v-else/>
        </div>
      </div>
      <div class="node-body-right" @click="$emit('rightMove')" v-if="level < size && processStore.diagramMode !== 'viewer' && config.id.indexOf('default_node') === -1">
        <el-icon><ArrowRight /></el-icon>
      </div>
      <div class="node-error" v-if="showError">
        <el-tooltip effect="dark" :content="errorInfo" placement="top-start">
          <el-icon><Warning /></el-icon>
        </el-tooltip>
      </div>
    </div>
    <div class="node-footer">
      <div class="btn">
        <insert-button v-if="processStore.diagramMode !== 'viewer'" @insertNode="type => $emit('insertNode', type)"></insert-button>
      </div>
    </div>
  </div>
</template>

<script setup name="ConditionNode">
import { ref, computed } from 'vue'
import InsertButton from '@/views/common/InsertButton.vue'
import { ValueType } from '@/views/common/form/ComponentsConfigExport'
import { useProcessStore } from '@/store/modules/process'

const processStore = useProcessStore()
const groupNames = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

const props = defineProps({
  config: {
    type: Object,
    default: () => {
      return {}
    }
  },
  //索引位置
  level: {
    type: Number,
    default: 1
  },
  //条件数
  size: {
    type: Number,
    default: 0
  }
})
defineEmits(['selected', 'leftMove', 'rightMove', 'copy', 'delNode', 'insertNode'])

const placeholder = '请设置条件'
const errorInfo = ref('')
const showError = ref(false)

const content = computed(() => {
  const groups = props.config.props.groups
  // console.log("🚀 ~ file: ConditionNode.vue:78 ~ content ~ groups", groups)
  let confitions = []
  groups.forEach(group => {
    let subConditions = []
    group.conditions.forEach(subCondition => {
      let subConditionStr = ''
      switch (subCondition.valueType) {
        case ValueType.dept:
        case ValueType.user:
          subConditionStr = `${subCondition.title}属于[${String(subCondition.value.map(u => u.name)).replaceAll(',', '. ')}]之一`
          break;
        case ValueType.number:
        case ValueType.string:
          subConditionStr = getOrdinaryConditionContent(subCondition)
          break;
      }
      subConditions.push(subConditionStr)
    })
    //根据子条件关系构建描述
    let subConditionsStr = String(subConditions)
        .replaceAll(',', subConditions.length > 1 ?
            (group.groupType === 'AND' ? ') 且 (' : ') 或 (') :
            (group.groupType === 'AND' ? ' 且 ' : ' 或 '))
    confitions.push(subConditions.length > 1 ? `(${subConditionsStr})` : subConditionsStr)
  })
  //构建最终描述
  return String(confitions).replaceAll(',', (props.config.props.groupsType === 'AND' ? ' 且 ' : ' 或 '))
})

function getDefault(val, df) {
  return val && val !== '' ? val : df;
}

function getOrdinaryConditionContent(subCondition) {
  switch (subCondition.compare) {
    case 'IN':
      if (subCondition.dictFlag) {
        let title = ''
        subCondition.value.map((item, index) => {
          title += subCondition.dictMap[item] + ','
        })
        return `${subCondition.title}为[${title.replaceAll(',', '、')}]中之一`
      }
      return `${subCondition.title}为[${String(subCondition.value).replaceAll(',', '、')}]中之一`
    case 'B':
      return `${subCondition.value[0]} < ${subCondition.title} < ${subCondition.value[1]}`
    case 'AB':
      return `${subCondition.value[0]} ≤ ${subCondition.title} < ${subCondition.value[1]}`
    case 'BA':
      return `${subCondition.value[0]} < ${subCondition.title} ≤ ${subCondition.value[1]}`
    case 'ABA':
      return `${subCondition.value[0]} ≤ ${subCondition.title} ≤ ${subCondition.value[1]}`
    case '<=':
      return `${subCondition.title} ≤ ${getDefault(subCondition.value[0], ' ?')}`
    case '>=':
      return `${subCondition.title} ≥ ${getDefault(subCondition.value[0], ' ?')}`
    case 'RANGE':
      return `${subCondition.title}范围${subCondition.value[0]}-${subCondition.value[1]}`
    default:
      let res = getDefault(subCondition.value[0], ' ?')
      if (subCondition.dictFlag) {
        res = isDictValue(subCondition.dictMap, subCondition.value) || ' ?'
      }
      if (subCondition.orgFlag) {
        res = subCondition.value || ' ?'
      }
      return `${subCondition.title}${subCondition.compare}${res}`
  }
}

// 是否是字典值  之后的处理
function isDictValue(dictMap = {}, value = '') {
  if (!value) {
    return '?'
  }
  return dictMap[value]
}

//校验数据配置的合法性
function validate(err) {
  if (!props.config.children?.id) {
    // showError.value = true
    // errorInfo.value = '条件分支后不能为空'
    // err.push(`条件分支后不能为空`)
    // return !showError.value
    return true;
  }

  if (props.config?.id?.indexOf('default_node') !== -1) {
    showError.value = false
    errorInfo.value = ''
    return true
  }

  const pc = props.config.props
  if (pc.groups.length <= 0) {
    showError.value = true
    errorInfo.value = '请设置分支条件'
    err.push(`${props.config.name} 未设置条件`)
  } else {
    for (let i = 0; i < pc.groups.length; i++) {
      if (pc.groups[i].cids.length === 0) {
        showError.value = true
        errorInfo.value = `请设置条件组${groupNames[i]}内的条件`
        err.push(`条件 ${props.config.name} 条件组${groupNames[i]}内未设置条件`)
        break
      } else {
        let conditions = pc.groups[i].conditions
        for (let ci = 0; ci < conditions.length; ci++) {
          let subc = conditions[ci]
          if (subc.value.length === 0) {
            showError.value = true
          } else {
            showError.value = false
          }
          if (showError.value) {
            errorInfo.value = `请完善条件组${groupNames[i]}内的${subc.title}条件`
            err.push(`条件 ${props.config.name} 条件组${groupNames[i]}内${subc.title}条件未完善`)
            return false
          }
        }
      }
    }
  }
  return !showError.value
}
</script>

<style lang="scss" scoped>


.node-error-state {
  .node-body {
    box-shadow: 0px 0px 5px 0px #F56C6C !important;
  }
}

.node {
  padding: 30px 55px 0;
  width: 220px;

  .node-body {
    cursor: pointer;
    min-height: 80px;
    max-height: 120px;
    position: relative;
    border-radius: 5px;
    background-color: white;
    box-shadow: 0px 0px 5px 0px #d8d8d8;

    &:hover {
      .node-body-left, .node-body-right {
        i {
          display: block !important;
        }
      }

      .node-body-main {
        .level {
          display: none !important;
        }

        .option {
          display: inline-block !important;
        }
      }

      box-shadow: 0px 0px 3px 0px #1890FF;
    }

    .node-body-left, .node-body-right {
      display: flex;
      align-items: center;
      position: absolute;
      height: 100%;

      i {
        display: none;
      }

      &:hover {
        background-color: #ececec;
      }
    }

    .node-body-left {
      left: 0;
    }

    .node-body-right {
      right: 0;
      top: 0;
    }

    .node-body-main {
      //position: absolute;
      width: 188px;
      margin-left: 17px;
      display: inline-block;

      .node-body-main-header {
        padding: 10px 0px 5px;
        font-size: xx-small;
        position: relative;

        .title {
          color: #15bca3;
          display: inline-block;
          height: 15px;
          width: 125px;
        }

        .level {
          position: absolute;
          right: 15px;
          color: #888888;
        }

        .option {
          position: absolute;
          right: 0;
          display: none;
          font-size: medium;

          i {
            color: #888888;
            padding: 0 3px;
          }
        }
      }

      .node-body-main-content {
        padding: 6px;
        color: #656363;
        font-size: 14px;

        i {
          position: absolute;
          top: 55%;
          right: 10px;
          font-size: medium;
        }

        .placeholder {
          color: #8c8c8c;
        }
      }
    }

    .node-error {
      position: absolute;
      right: -40px;
      top: 20px;
      font-size: 25px;
      color: #F56C6C;
    }
  }

  .node-footer {
    position: relative;

    .btn {
      width: 100%;
      display: flex;
      height: 70px;
      padding: 20px 0 32px;
      justify-content: center;
    }

    :deep(.el-button) {
      height: 32px;
    }

    &::before {
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
