<template>
  <div>
    <div v-for="(group, index) in selectedNode.props.groups" :key="index + '_g'" class="group">
      <div class="group-header">
        <span class="group-name">条件组 {{ groupNames[index] }}</span>
        <div class="group-cp">
          <span>组内条件关系：</span>
          <el-switch v-model="group.groupType" active-color="#409EFF"
                     inactive-color="#c1c1c1" active-value="AND" inactive-value="OR"
                     active-text="且" inactive-text="或"/>
        </div>
        <div class="group-operation">
          <el-popover placement="bottom" title="选择审批条件" width="300" trigger="click">
            <!-- <div>以下条件将决定具体的审批流程</div>-->
            <el-checkbox-group v-model="group.cids" value-key="id">
              <el-checkbox :label="condition.id" v-for="(condition, cindex) in conditionList" :key="condition.id"
                           @change="conditionChange(cindex, group)">
                {{ condition.title }}
              </el-checkbox>
            </el-checkbox-group>
            <template #reference><el-icon><Plus /></el-icon></template>
          </el-popover>
          <el-icon class="Delete" @click="delGroup(index)"><Delete /></el-icon>
        </div>
      </div>
      <div class="group-content">
        <p v-if="group.conditions.length === 0">点击右上角 + 为本条件组添加条件 <el-icon class="pointer-icon"><Pointer /></el-icon></p>
        <div v-else>
          <el-form label-width="100px">
            <!--构建表达式-->
            <el-form-item v-for="(condition, cindex) in group.conditions" :key="condition.id + '_' + cindex">
              <Ellipsis #label hover-tip :content="condition.title"/>
              <template v-if="condition.valueType === ValueType.string" style="display: flex;">
                <el-select size="small" placeholder="判断符" style="width: 120px;margin-left: 10px;" v-model="condition.compare"
                           @change="condition.value = []">
                  <el-option v-if="condition.id !== 'materialClassify'" label="等于" value="="></el-option>
                  <el-option v-if="condition.id !== 'materialClassify'" label="包含在" value="IN"></el-option>
                  <el-option v-else label="区间" value="RANGE"></el-option>
                </el-select>
                <!--物资分类范围-->
                <template v-if="condition.id === 'materialClassify'" style="margin-left: 10px;">
                  <el-tree-select
                    v-model="condition.value[0]"
                    :data="categoryTree"
                    :props="{ label: 'label', children: 'children' }"
                    node-key="id"
                    style="width: 400px; margin: 8px 0"
                    :placeholder="condition.compare === 'RANGE' ? '请选择开始范围' : '请选择'"
                    empty-text="无数据"
                  />
                  <el-tree-select
                    v-model="condition.value[1]"
                    :data="categoryTree"
                    :props="{ label: 'label', children: 'children' }"
                    node-key="id"
                    style="width: 400px"
                    placeholder="请选择结束范围"
                    empty-text="无数据"
                  />

                </template>
                <template v-else-if="condition.dictFlag" style="margin-left: 10px">
                  <el-select style="width: 280px;" clearable :multiple="condition.compare === 'IN'" size="small" v-model="condition.value"
                             placeholder="请选字典值">
                    <el-option v-for="(option, oi) in getDictMapToLabelValue(condition.dictMap)" :key="oi" :label="option.label"
                               :value="option.value"></el-option>
                  </el-select>
                </template>
                <template v-else-if="isSelect(condition.id)" style="margin-left: 10px">
                  <el-select v-if="condition.compare === 'IN'" style="width: 280px;" clearable multiple size="small"
                             v-model="condition.value" placeholder="选择值">
                    <el-option v-for="(option, oi) in getOptions(condition.id)" :key="oi" :label="option" :value="option"></el-option>
                  </el-select>
                  <el-select v-else style="width: 280px;" clearable size="small" v-model="condition.value[0]" placeholder="选择值">
                    <el-option v-for="(option, oi) in getOptions(condition.id)" :key="oi" :label="option" :value="option"></el-option>
                  </el-select>
                </template>
                <template v-else style="margin-left: 10px">
                  <el-input v-if="condition.compare === '='" style="width: 280px;" placeholder="输入比较值" size="small"
                            v-model="condition.value[0]"/>
                  <el-select v-else style="width: 280px;" multiple clearable filterable allow-create size="small" v-model="condition.value"
                             placeholder="输入可能包含的值"></el-select>
                </template>
              </template>
              <span v-else-if="condition.valueType === ValueType.number">
                <el-select size="small" placeholder="判断符" style="width: 120px;" v-model="condition.compare">
                  <el-option :label="exp.label" :value="exp.value" :key="exp.value" v-for="exp in explains"></el-option>
                </el-select>
                <span style="margin-left: 10px">
                  <el-input style="width: 280px;" v-if="conditionValType(condition.compare) === 0" size="small" placeholder="输入比较值"
                            type="number" v-model="condition.value[0]"/>
                  <el-select style="width: 280px;" multiple filterable allow-create v-else-if="conditionValType(condition.compare) === 1"
                             size="small" v-model="condition.value" placeholder="输入可能包含的值"></el-select>
                  <span v-else>
                    <el-input style="width: 130px;" size="small" type="number" placeholder="输入比较值" v-model="condition.value[0]"/>
                    <span> ~
                      <el-input size="small" style="width: 130px;" type="number" placeholder="输入比较值" v-model="condition.value[1]"/>
                    </span>
                  </span>
                </span>
              </span>
              <!-- <span v-else-if="condition.valueType === ValueType.user">
                <span class="item-desc" style="margin-right: 20px">为某些人其中之一</span>
                <el-button size="mini" icon="Plus" type="primary" @click="selectUser(condition.value, 'user')" round>选择人员</el-button>
                <org-items v-model="condition.value"/>
              </span> -->
              <!-- <span v-else-if="condition.valueType === ValueType.dept">
                <span class="item-desc" style="margin-right: 20px">为某部门 / 某部门下的部门</span>
                <el-button size="mini" icon="Plus" type="primary" @click="selectUser(condition.value, 'dept')" round>选择部门</el-button>
                <org-items v-model="condition.value"/>
              </span> -->
              <span v-else-if="condition.valueType === ValueType.date"></span>
              <el-icon class="el-icon-delete" @click="rmSubCondition(group, cindex)"><Delete /></el-icon>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <!-- <org-picker :type="orgType" multiple ref="orgPicker" :selected="users" @ok="selected"></org-picker> -->

    <select-user-tree ref="selectUserTreeRef" @handleTaskUserComplete="selected"/>

    <el-dialog
      class="unit-dialog"
      v-model="visible"
      append-to-body
      width="800px"
      :title="`${currentCondition.title}`"
      :close-on-click-modal="false"
    >
      <div class="unit-dialog-content">
        <div class="select-title">
          {{ currentCondition.title }}:
        </div>
        <el-tree-select
          style="width: 600px;"
          size="small"
          v-model="currentDeptVal"
          :props="{ label: 'label', children: 'children' }"
          node-key="id"
          class="custom-tree"
          :placeholder="`请选择${currentCondition.title}`"
          empty-text="无数据"
          @change="selectTreeSelect"
        />
      </div>
      <template #footer>
        <div class="dialog-footer">
          <div class="pop-btn-box">
            <el-button type="primary" @click="confirmButton()" :disabled="!currentDeptVal"
            >确定
            </el-button
            >
            <el-button @click="visible = false">取消</el-button>
          </div>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="ConditionGroupItemConfig">
import { ref, computed, onMounted, getCurrentInstance } from 'vue'
import { deptTreeAll } from '@/api/system/dept'
import selectUserTree from '@/components/common/selectUserTree'
import Ellipsis from '@/components/common/Ellipsis'
import { ValueType } from '@/views/common/form/ComponentsConfigExport'
import { useProcessStore } from '@/store/modules/process'

const { proxy } = getCurrentInstance()
const processStore = useProcessStore()

const selectUserTreeRef = ref(null)

const users = ref([])
const orgType = ref('user')
const showOrgSelect = ref(false)
const groupNames = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']
const supportTypes = [ValueType.number, ValueType.string, ValueType.date, ValueType.dept, ValueType.user]
const explains = [
  { label: '等于', value: '=' },
  { label: '大于', value: '>' },
  { label: '大于等于', value: '>=' },
  { label: '小于', value: '<' },
  { label: '小于等于', value: '<=' },
  { label: 'x < 值 < x', value: 'B' },
  { label: 'x ≤ 值 < x', value: 'AB' },
  { label: 'x < 值 ≤ x', value: 'BA' },
  { label: 'x ≤ 值 ≤ x', value: 'ABA' }
]
const unitOptions = ref([])
const currentCondition = ref({})
const currentDeptVal = ref(null)
const currentDeptName = ref('')
const visible = ref(false)
const categoryTree = ref([])

const selectedNode = computed(() => processStore.selectedNode)
const select = computed(() => selectedNode.value.props.assignedUser || [])
const formItems = computed(() => processStore.design.formItems)
const formMap = computed(() => {
  const map = new Map()
  formItems.value.forEach(item => itemToMap(map, item))
  return map
})
const conditionList = computed(() => {
  const conditionItems = []
  formItems.value.forEach(item => filterCondition(item, conditionItems))
  return conditionItems
})

function itemToMap(map, item) {
  map.set(item.id, item)
  if (item.name === 'SpanLayout') {
    item.props.items.forEach(sub => itemToMap(map, sub))
  }
}

function getDictMapToLabelValue(dictMap = {}) {
  let res = []
  if (JSON.stringify(dictMap) === '{}') {
    return res
  }
  for (let key in dictMap) {
    let obj = {
      label: dictMap[key],
      value: key
    }
    res.push(obj)
  }
  return res
}

function isSelect(formId) {
  let form = formMap.value.get(formId)
  if (form && (form.name === 'SelectInput' || form.name === 'MultipleSelect')) {
    return true
  }
  return false
}

function getOptions(formId) {
  return formMap.value.get(formId).props.options || []
}

function conditionValType(type) {
  switch (type) {
    case '=':
    case '>':
    case '>=':
    case '<':
    case '<=':
      return 0
    case 'IN':
      return 1
    default:
      return 2
  }
}

function selectUser(value, orgType) {
  orgType.value = orgType
  users.value = value
  selectUserTreeRef.value?.init()
}

function filterCondition(item, list) {
  console.info(item, list)
  if (item.name === 'SpanLayout') {
    item.props.items.forEach(sub => filterCondition(sub, list))
  } else if (supportTypes.indexOf(item.valueType) > -1 && item.props.required) {
    list.push({
      title: item.title,
      id: item.id,
      valueType: item.valueType,
      dictMap: item.dictMap,
      dictFlag: item.dictFlag,
      orgFlag: item.orgFlag
    })
  }
}

function selected(selectData) {
  const oldData = [...select.value]
  users.value.length = 0
  const newData = [...oldData, ...selectData]
  const uniqData = _.uniqBy(newData, 'id')
  uniqData.forEach(u => users.value.push(u))
}

function delGroup(index) {
  selectedNode.value.props.groups.splice(index, 1)
}

function rmSubCondition(group, index) {
  group.cids.splice(index, 1)
  group.conditions.splice(index, 1)
}

function conditionChange(index, group) {
  group.cids.forEach(cid => {
    if (0 > group.conditions.findIndex(cd => cd.id === cid)) {
      let condition = { ...conditionList.value[index] }
      condition.compare = ''
      condition.value = []
      if (condition?.dictFlag || condition?.orgFlag) {
        condition.compare = '='
        condition.value = ''
      }
      group.conditions.push(condition)
    }
  })
  for (let i = 0; i < group.conditions.length; i++) {
    if (group.cids.indexOf(group.conditions[i].id) < 0) {
      group.conditions.splice(i, 1)
    }
  }
}

function categoryTreeNormalizerList(list) {
  return list.map(node => {
    if (node.children && !node.children.length) {
      delete node.children
    }
    const normalized = {
      id: node.matlCateCode,
      label: node.matlCateName,
      children: node.children ? categoryTreeNormalizerList(node.children) : undefined
    }
    if (!normalized.children) delete normalized.children
    return normalized
  })
}

function deptNormalizerList(list) {
  return list.map(node => {
    if (node.children && !node.children.length) {
      delete node.children
    }
    const normalized = {
      id: node.id,
      label: node.deptName,
      children: node.children ? deptNormalizerList(node.children) : undefined
    }
    if (!normalized.children) delete normalized.children
    return normalized
  })
}

function findNodeById(list, targetId) {
  for (const item of list) {
    if (item.id === targetId) return item
    if (item.children && item.children.length) {
      const found = findNodeById(item.children, targetId)
      if (found) return found
    }
  }
  return null
}

async function getUnitOrDeptOptions() {
  try {
    deptTreeAll().then(res => {
      if (res.success) {
        const unitOptionsData = res.data || []
        unitOptions.value = deptNormalizerList(unitOptionsData)
      } else {
        proxy.$modal.msgError(res.message)
      }
    })
  } catch (e) {
    console.error(e)
  }
}

function handleIconSearch(row) {
  currentCondition.value = row
  currentDeptName.value = ''
  currentDeptVal.value = null
  visible.value = true
}

function selectTreeSelect(val) {
  const node = findNodeById(unitOptions.value, val)
  if (node) currentDeptName.value = node.label
}

function confirmButton() {
  currentDeptVal.value ? currentCondition.value.value = currentDeptName.value : null
  visible.value = false
}

onMounted(() => {
  getUnitOrDeptOptions()
})
</script>

<style lang="scss" scoped>
.group {
  margin-bottom: 20px;
  color: #5e5e5e;
  overflow: hidden;
  border-radius: 6px;
  border: 1px solid #e3e3e3;

  .group-header {
    padding: 5px 10px;
    background: #e3e3e3;
    display: flex;
    align-items: center;

    .group-name {
      font-size: small;
    }

    .group-cp {
      font-size: small;
      display: flex;
      align-items: center;
      margin-left: 20px;
    }

    .group-operation {
      display: flex;
      align-items: center;
      margin-left: auto;

      i {
        margin: 0 10px;

        &:hover {
          cursor: pointer;
        }
      }
    }
  }

  .group-content {
    padding: 10px 5px;

    p {
      text-align: center;
      font-size: small;

      // 替代 U+261D 字符（其字形依赖系统回退字体，颜色/方向不稳定），改用 EP 图标固定为橙色、方向朝上
      .pointer-icon {
        color: #e6a23c;
        vertical-align: middle;
        font-weight: bold;
        font-size: 16px;
      }
    }

    .el-icon-delete {
      position: absolute;
      cursor: pointer;
      top: 12px;
      right: 0;
    }
  }

  .condition-title {
    display: block;
    width: 100px;
  }
}

.unit-dialog-content {
  display: flex;

  .select-title {
    display: flex;
    align-items: center;
    font-weight: 600;
    margin-right: 20px;
  }
}
</style>
