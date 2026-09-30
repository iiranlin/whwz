<template>
  <div>
    <el-form inline label-width="88px">
      <el-form-item label="调整优先级" prop="level">
        <el-popover placement="right" title="拖拽条件调整优先级顺序" width="250" trigger="click">
          <draggable
            style="width: 100%; min-height:25px"
            :list="prioritySortList"
            group="from"
            :animation="300"
            chosen-class="choose"
            :scroll="true"
            :sort="true"
            item-key="id"
          >
            <template #item="{ element, index }">
              <div :class="{'drag-no-choose': true, 'drag-hover': element.id === selectedNode.id}">
                <ellipsis style="width: 160px;" hover-tip :content="element.name"/>
                <div>优先级 {{ index + 1 }}</div>
              </div>
            </template>
          </draggable>
          <template #reference>
            <el-button style="margin-left: 10px;" icon="Sort" size="small">第{{ nowNodeLeave + 1 }}级</el-button>
          </template>
        </el-popover>
      </el-form-item>
      <el-form-item label="条件组关系" label-width="150px" class="groups-type-item">
        <el-switch v-model="config.groupsType" active-color="#409EFF"
                   inactive-color="#c1c1c1" active-value="AND" inactive-value="OR"
                   active-text="且" inactive-text="或">
        </el-switch>
      </el-form-item>
      <!-- <el-form-item label="条件组表达式">
        <el-input size="mini" v-model="config.expression" placeholder="输入条件组关系表达式  &为与，|为或"/>
        <span class="item-desc">使用表达式构建复杂逻辑，例如: (A & B) | C</span>
      </el-form-item> -->
    </el-form>
    <div class="add-group-bar">
      <el-button type="primary" size="mini" icon="Plus" style="margin: 0 15px 0 0" round @click="addConditionGroup">
        添加条件组
      </el-button>
      <span class="item-desc">（只有必填字段才能作为审核条件）</span>
    </div>
    <group-item/>
  </div>
</template>

<script setup name="ConditionNodeConfig">
import { computed } from 'vue'
import draggable from 'vuedraggable'
import GroupItem from './ConditionGroupItemConfig.vue'
import { useProcessStore } from '@/store/modules/process'

const props = defineProps({
  config: {
    type: Object,
    default: () => ({})
  }
})

const processStore = useProcessStore()

const selectedNode = computed(() => processStore.selectedNode)
const select = computed(() => props.config.assignedUser || [])
const prioritySortList = computed(() => {
  let node = processStore.nodeMap.get(selectedNode.value.parentId)
  console.log(selectedNode.value.id, node)
  if (node) {
    return node.branchs || []
  }
  return []
})
const nowNodeLeave = computed(() => prioritySortList.value.indexOf(selectedNode.value))

function addConditionGroup() {
  props.config.groups.push({
    cids: [],
    groupType: 'OR',
    conditions: []
  })
}

function selectUser() {
  // showOrgSelect = true
}

function selected(selectList) {
  console.log(selectList)
  // showOrgSelect = false
  // selectList.forEach(val => select.value.push(val))
}

function removeOrgItem(index) {
  // select.value.splice(index, 1)
}
</script>

<style lang="scss" scoped>
// 条件组关系：switch 与 label 同行展示不换行错位，switch 距离 label 10px
.groups-type-item {
  :deep(.el-form-item__content) {
    flex-wrap: nowrap;
  }

  :deep(.el-switch) {
    margin-left: 10px;
  }
}

// 添加条件组：按钮与说明文字同行、垂直居中不错位；原按钮 bottom 15px 间距移到容器
.add-group-bar {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.choose {
  border-radius: 5px;
  margin-top: 2px;
  background: #f4f4f4;
  border: 1px dashed #1890FF !important;
}

.drag-hover {
  color: #1890FF
}

.drag-no-choose {
  cursor: move;
  background: #f8f8f8;
  border-radius: 5px;
  margin: 5px 0;
  height: 25px;
  line-height: 25px;
  padding: 5px 10px;
  border: 1px solid #ffffff;
  div{
    display: inline-block;
    font-size: small !important;
  }

  div:nth-child(2) {
    float: right !important;
  }
}
</style>
