<template>
  <ep-dialog :title="title" iconTitle="form" v-model="classifyVisible" width="50vw" top="5vh" append-to-body
    :close-on-press-escape="false" :close-on-click-model="false">
    <div class="sso-front-table-container2">
      <el-scrollbar height="70vh">
        <div class="tree-wrapper">
          <el-tree ref="treeRef" :data="treeData" show-checkbox node-key="id" :props="treeProps" default-expand-all
            :check-strictly="false" class="permission-tree" @check-change="handleCheckChange">
            <template #default="{ node }">
              <span class="node-label">{{ node.groupName || node.classFlagName || node.label }}</span>
            </template>
          </el-tree>
        </div>
      </el-scrollbar>

    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleCancel" class="cancel-btn"><svg-icon icon-class="cancel" />&nbsp;关闭</el-button>
        <el-button type="primary" class="determine-btn" @click="saveBtn"><svg-icon icon-class="determine" />&nbsp;{{
          dialogType === 'create' ? '保存' : '确定' }}</el-button>
      </div>
    </template>
  </ep-dialog>
</template>

<script setup>
import { selectListMap, selectListMapDetail } from '@/api/materialAccept/acceptMaterial'
import { onMounted } from 'vue'
const { proxy } = getCurrentInstance()
const props = defineProps({
  acceptanceGroups: {
    type: Array,
    default: () => []
  }
})
const classifyVisible = defineModel({ default: false })
const title = ref('验收分组名称')
const emit = defineEmits(['createSuccess', 'selectedItems']);
const dialogType = ref('')
const loading = ref(false)

const treeRef = ref(null)
const treeData = ref([])

const treeProps = {
  children: 'groups',
  label: (node) => node.classFlagName || node.groupName || node.label
}

watch(classifyVisible, async (newVal) => {
  if (newVal) {
    await getList()
    if (props.acceptanceGroups) {
      if (treeRef.value) {
        let attr = props.acceptanceGroups?.map(item => item.id)
        treeRef.value?.setCheckedKeys(attr)
      }
    }
  } else {
    handleCancel()
  }
})
const getList = async () => {
  loading.value = true
  selectListMap().then(({ data }) => {
    treeData.value = data || []
  }).finally(() => {
    loading.value = false
  })
}

const handleCancel = () => {
  classifyVisible.value = false
  treeRef.value?.setCheckedKeys([])
}

const saveBtn = () => {
  //验收分组必须同时包含一二级验收
  const checkedKeys = treeRef.value.getCheckedKeys()
  const selectedItems = checkedKeys.map(key => {
    const node = findNode(treeData.value, key)
    if (node && !node.groups) {
      return node
    }
    return null
  }).filter(item => item !== null)

  const isflagtwo = selectedItems.map(item => item.classFlag)
  if (isflagtwo.includes(2)) {
    emit('selectedItems', selectedItems)
    handleCancel()
  } else {
    proxy.$modal.msgWarning('验收分组必须同时包含一二级验收')
    return
  }
}
const findNode = (data, id) => {
  for (const node of data) {
    if (node.id === id) {
      return node
    }
    if (node.groups) {
      const found = findNode(node.groups, id)
      if (found) return found
    }
  }
  return null
}

//校验

const getLevel = (nodeId) => {
  //一级
  if (treeData.value[0]?.id === nodeId) return 1
  if (treeData.value[0]?.groups.some(child => child.id === nodeId)) return 1
  //二级
  if (treeData.value[1]?.id === nodeId) return 2
  if (treeData.value[1]?.groups.some(child => child.id === nodeId)) return 2
  //三级
  if (treeData.value[2]?.id === nodeId) return 3
  if (treeData.value[2]?.groups.some(child => child.id === nodeId)) return 3
  //四级
  if (treeData.value[3]?.id === nodeId) return 4
  if (treeData.value[3]?.groups.some(child => child.id === nodeId)) return 4
  //五级
  if (treeData.value[4]?.id === nodeId) return 5
  if (treeData.value[4]?.groups.some(child => child.id === nodeId)) return 5
}

const isLeafNode = (nodeId) => {
  return treeData.value.some(level => level.groups?.some(child => child.id === nodeId))
}
const getLevelChildIds = (levelNum) => {
  const index = levelNum - 1
  if (treeData.value[index]?.groups) {
    return treeData.value[index].groups.map(child => child.id)
  }
  return []
}

const hasLevelChecked = (levelNum, checkedKeys) => {
  const levelChildren = getLevelChildIds(levelNum)
  return levelChildren.some(id => checkedKeys.includes(id))
}

const checkLevelOrder = (nodeId, checkedKeys) => {
  if (!isLeafNode(nodeId)) return true
  const currentLevel = getLevel(nodeId)
  if (!currentLevel || currentLevel <= 1) return true
  const otherKeys = checkedKeys.filter(key => key !== nodeId)
  for (let i = 1; i < currentLevel; i++) {
    if (!hasLevelChecked(i, otherKeys)) {
      return false
    }
  }
  return true
}
const checkHasJump = (checkedKeys) => {
  const checkedLevels = []
  for (let i = 1; i <= 5; i++) {
    if (hasLevelChecked(i, checkedKeys)) {
      checkedLevels.push(i)
    }
  }
  for (let i = 0; i < checkedLevels.length; i++) {
    const expected = checkedLevels[0] + i
    if (checkedLevels[i] !== expected) {
      return { hasJump: true, firstMissing: expected }
    }
  }
  return {
    hasJump: false, firstMissing: null
  }
}

const cascadeUncheckFromLevel = (startLevel) => {
  for (let i = startLevel; i <= 5; i++) {
    getLevelChildIds(i).forEach(id => {
      treeRef.value.setChecked(id, false)
    })
  }
}

const uncheckAllLevels = () => {
  for (let i = 1; i <= 5; i++) {
    getLevelChildIds(i).forEach(id => {
      treeRef.value.setChecked(id, false)
    })
  }
}

let isShowTip = false
function showTip(message){
  if(isShowTip) return
  isShowTip = true
    proxy.$modal.msgWarning(message)
    setTimeout(() =>{
       isShowTip = false
    },1500)
}
const handleCheckChange = (data, checked) => {
  setTimeout(() => {
    const checkedKeys = treeRef.value.getCheckedKeys()
    if (checked) {
      if (!checkLevelOrder(data.id, checkedKeys)) {
         showTip('请按验收级别从小到大选择组号')
        treeRef.value.setChecked(data.id, false)
        return
      }

      const jumpResult = checkHasJump(checkedKeys)
      if (jumpResult.hasJump) {
        showTip('请按验收级别从小到大选择组号')
        treeRef.value.setChecked(data.id, false)
        cascadeUncheckFromLevel(jumpResult.firstMissing)
      }

    } else {
      if (!isLeafNode(data.id)) return
      const currentLevel = getLevel(data.id)
      if (!currentLevel) return
      if (currentLevel === 1) {
        const hasLevel1Checked = hasLevelChecked(1, checkedKeys)
        if (!hasLevel1Checked) {
          uncheckAllLevels()
          return
        }
      }
      if (currentLevel >= 2 && currentLevel <= 4) {
        const hasCurrentLevelChecked = hasLevelChecked(currentLevel, checkedKeys)
        if (!hasCurrentLevelChecked) {
          cascadeUncheckFromLevel(currentLevel + 1)
        }
      }
    }
  }, 0)
}

</script>
<style lang="scss" scoped>
.sso-front-table-container2 {
  height: 70vh;
  border: none;
  margin: 0;
  display: flex;
  flex-direction: column;

  .tree-wrapper {
    flex: 1;
    padding: 20px;

    .permission-tree {
      padding: 20px;
    }
  }
}

.node-label {
  font-size: 14px;
  color: #303133;
}

:deep(.ep-tree-node__content) {
  height: 36px;
  line-height: 36px;
}

:deep(.ep-tree) {
  display: flex;
  flex-direction: column;
}

:deep(.ep-tree-node) {
  display: flex;
  flex-direction: column;
}

:deep(.ep-tree-node.is-expanded > .ep-tree-node__children) {
  display: flex;
  flex-wrap: wrap;
  // gap: 12px;
  // margin-top: 8px;
}

:deep(.ep-tree-node > .ep-tree-node__children) {
  display: flex;
  flex-direction: row;
}
</style>