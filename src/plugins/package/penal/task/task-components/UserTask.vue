<template>
  <div>
    <el-row>
      <h4><b>审批人设置</b></h4>
      <el-radio-group
        v-model="dataType"
        @change="changeDataType"
        :disabled="currentUserTaskIndex === 0"
      >
        <el-radio label="USERS">指定用户</el-radio>
        <el-radio label="ROLES">角色</el-radio>
        <el-radio label="DEPTS">部门</el-radio>
        <el-radio label="INITIATOR">发起人</el-radio>
      </el-radio-group>
    </el-row>
    <el-row>
      <div v-if="dataType === 'USERS'">
        <el-tag
          v-for="(userText, index) in selectedUser.text"
          :key="userText"
          closable
          effect="plain"
          @close="deleteUser(index)"
        >
          {{userText}}
        </el-tag>
        <div class="element-drawer__button">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-plus"
            @click="onSelectUsers()"
          >添加用户</el-button>
        </div>
      </div>
      <div v-if="dataType === 'ROLES'">
        <el-select
          v-model="roleIds"
          multiple
          :multiple-limit="1"
          size="mini"
          placeholder="请选择 角色"
          @change="changeSelectRoles"
        >
          <el-option
            v-for="item in roleOptions"
            :key="item.id"
            :label="item.roleName"
            :value="`ROLE${item.id}`"
          >
            <!--
            :disabled="item.status === 1" -->
          </el-option>
        </el-select>
      </div>
      <div
        v-if="dataType === 'DEPTS'"
        style="visibility: auto;"
      >
        <tree-select
          :width="320"
          :height="400"
          size="mini"
          :data="deptTreeData"
          :defaultProps="deptProps"
          multiple
          clearable
          checkStrictly
          nodeKey="id"
          :checkedKeys="deptIds"
          @checked-change="checkedDeptChange"
        >
        </tree-select>
      </div>
    </el-row>
    <!-- 影藏多实例审批方式 -->
    <el-row>
      <div v-show="showMultiFlog">
        <el-divider />
        <h4><b>多实例审批方式</b></h4>
        <el-radio-group
          v-model="multiLoopType"
          @change="changeMultiLoopType"
        >
          <el-row>
            <el-radio
              disabled
              label="Null"
            >无</el-radio>
          </el-row>
          <el-row>
            <el-radio label="SequentialMultiInstance">会签（需所有审批人同意）</el-radio>
          </el-row>
          <el-row>
            <el-radio label="ParallelMultiInstance">或签（一名审批人同意即可）</el-radio>
          </el-row>
        </el-radio-group>
      </div>
    </el-row>

    <!-- 候选用户弹窗 -->
    <el-dialog
      title="候选用户"
      v-model="userOpen"
      width="1200px"
      append-to-body
      
    >
      <el-row
        type="flex"
        :gutter="20"
      >
        <!--部门数据-->
        <el-col :span="7">
          <el-card
            shadow="never"
            style="height: 600px"
          >
            <template #header>
              <span>部门列表</span>
            </template>
            <div class="head-container">
              <el-tree
                :data="deptTreeData"
                :props="deptProps"
                :expand-on-click-node="false"
                ref="treeRef"
                @node-click="handleNodeClick"
              />
            </div>
          </el-card>
        </el-col>
        <el-col :span="16">
          <el-table
            ref="multipleTableRef"
            height="600"
            :data="userTableList"
            border
            @selection-change="handleSelectionChange"
          >
            <el-table-column
              type="selection"
              width="50"
              align="center"
            />
            <el-table-column
              label="用户名"
              align="left"
              prop="nickName"
            />
            <el-table-column
              label="账号"
              align="left"
              prop="username"
            />
          </el-table>
          <pagination
            :total="userTotal"
            v-model:pageNum="queryParams.pageNum"
            v-model:pageSize="queryParams.pageSize"
            @pagination="getUserList"
          />
        </el-col>
      </el-row>
      <template #footer>
        <div class="dialog-footer">
          <el-button
            type="primary"
            @click="handleTaskUserComplete"
          >确 定</el-button>
          <el-button @click="userOpen = false">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>

</template>

<script setup name="UserTask">
import { ref, reactive, watch, nextTick, onBeforeUnmount, getCurrentInstance } from 'vue';
import uniqBy from "lodash/uniqBy";
import TreeSelect from "@/components/TreeSelect";
import request from '@/utils/request';

const { proxy } = getCurrentInstance();
const props = defineProps({
  id: String,
  type: String
});

const userTaskForm = {
  dataType: '',
  assignee: '',
  candidateUsers: '',
  candidateGroups: '',
  text: '',
};

const multiInstanceForm = {
  completionCondition: "",
  loopCardinality: "",
  extensionElements: [],
  asyncAfter: false,
  asyncBefore: false,
  exclusive: false
};

// refs
const treeRef = ref(null);
const multipleTableRef = ref(null);

const loading = ref(false);
const dataType = ref('USERS');
const selectedUser = reactive({
  ids: [],
  text: []
});
const userOpen = ref(false);
const deptName = ref(undefined);
const deptOptions = ref([]);
const deptProps = {
  children: "children",
  label: "label"
};
const deptTempOptions = ref([]);
const userTableList = ref([]);
const userTotal = ref(0);
const selectedUserDate = ref([]);
const oldSelectedUserDate = ref([]);
const roleOptions = ref([]);
const roleIds = ref([]);
const deptTreeData = ref([]);
const deptIds = ref([]);
// 查询参数
const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  deptId: undefined
});
const showMultiFlog = ref(false);
// TODOD 默认或签 ParallelMultiInstance
const multiLoopType = ref('ParallelMultiInstance');
const currentUserTaskIndex = ref(null);

let bpmnElement = null;
let multiLoopInstance = null;

watch(
  () => props.id,
  () => {
    bpmnElement = window.bpmnInstances.bpmnElement;
    nextTick(() => {
      // TODO  这一块是默认第一节点为禁用审批人 计算出当前选中的是第几个userTask 审批人设置----start
      const be = bpmnElement;
      const { id = '', type = '' } = be;
      const currentUserTaskInfo = { id, type, }
      const userTaskAllList = be?.parent?.children?.filter(i => i?.type === 'bpmn:UserTask') || [];
      const curIdx = userTaskAllList.findIndex((userTaskItem) => currentUserTaskInfo?.id === userTaskItem.id);
      currentUserTaskIndex.value = curIdx;
      // TODO  这一块是默认第一节点为禁用禁用审批人 计算出当前选中的是第几个userTask 审批人设置----end
      resetTaskForm();
    });
  },
  { immediate: true }
);

async function resetTaskForm() {
  const bpmnElementObj = bpmnElement?.businessObject;
  if (!bpmnElementObj) {
    return;
  }
  oldSelectedUserDate.value = [];
  clearOptionsData();
  // TODO  这一块是默认第一节点发起人自己
  if (currentUserTaskIndex.value === 0) {
    // TODO 默认发起人
    dataType.value = 'INITIATOR';
    changeDataType(dataType.value);
    return;
  }
  dataType.value = bpmnElementObj['dataType'];
  if (dataType.value === 'USERS') {
    let userIdData = bpmnElementObj['candidateUsers'] || bpmnElementObj['assignee'];
    let userText = bpmnElementObj['text'] || [];
    if (userIdData && userIdData.toString().length > 0 && userText && userText.length > 0) {
      selectedUser.ids = userIdData?.toString().split(',');
      selectedUser.text = userText?.split(',');
      for (let i = 0; i < selectedUser.ids.length; i++) {
        const item = {
          id: selectedUser.ids[i],
          nickName: selectedUser.text[i],
        };
        oldSelectedUserDate.value.push(item);
      }
      oldSelectedUserDate.value = uniqBy([...oldSelectedUserDate.value], 'id');
    }
    if (selectedUser.ids.length > 1) {
      showMultiFlog.value = true;
    } else {
      showMultiFlog.value = false;
    }
  } else if (dataType.value === 'ROLES') {
    await getRoleOptions();
    let roleIdData = bpmnElementObj['candidateGroups'] || [];
    if (roleIdData && roleIdData.length > 0) {
      roleIds.value = roleIdData.split(',');
    }
    showMultiFlog.value = true;
  } else if (dataType.value === 'DEPTS') {
    await getDeptTreeData();
    let deptIdData = bpmnElementObj['candidateGroups'] || [];
    if (deptIdData && deptIdData.length > 0) {
      deptIds.value = deptIdData.split(',');
    }
    showMultiFlog.value = true;
  }
  getElementLoop(bpmnElementObj);
}

/**
 * 清空选项数据
 */
function clearOptionsData() {
  selectedUser.ids = [];
  selectedUser.text = [];
  roleIds.value = [];
  deptIds.value = [];
}

/**
 * 跟新节点数据
 */
function updateElementTask() {
  const taskAttr = Object.create(null);
  for (let key in userTaskForm) {
    taskAttr[key] = userTaskForm[key];
  }
  window.bpmnInstances.modeling.updateProperties(bpmnElement, taskAttr);
}

/**
 * 查询部门下拉树结构
 */
async function getDeptOptions() {
  if (!deptOptions.value || deptOptions.value.length <= 0) {
    try {
      const deptId = sessionStorage.getItem('startDeptId') || '';
      const params = {
        deptId,
        containsHeader: true,
        levelNumber: 7,
      };
      const res = await request.get('/blcd-base/dept/treeAll', {});
      if (res?.success) {
        deptTempOptions.value = res.data || [];
        deptOptions.value = res.data || [];
      } else {
        proxy.$modal.msgError(res.message);
      }
    } catch (e) {
      console.error(e);
    }
  }
}

/**
 * 查询部门下拉树结构（含部门前缀）
 */
async function getDeptTreeData() {
  function refactorTree(data) {
    return data.map(node => {
      let treeData = {
        ...node,
        id: `DEPT${node.id}`,
        treeId: node.id,
        label: node.deptName,
      };
      if (node.children && node.children.length > 0) {
        treeData.children = refactorTree(node.children);
      }
      return treeData;
    });
  }
  await getDeptOptions();
  deptTreeData.value = refactorTree(deptOptions.value) || [];
}

/**
 * 查询角色下拉树结构
 */
async function getRoleOptions() {
  if (!roleOptions.value || roleOptions.value.length <= 0) {
    const res = await request.get(`${import.meta.env.VUE_APP_BASE_PREFIX || ''}/role/listAll`);
    if (res?.success) {
      roleOptions.value = res?.data?.list || [];
    } else {
      proxy.$modal.msgError(res.message);
    }
  }
}

/** 查询用户列表 */
async function getUserList() {
  const params = {
    ...queryParams,
  };
  const res = await request.get('/blcd-base/user/listAll', params);
  if (res?.success) {
    userTableList.value = res.data.list;
    userTotal.value = res.data.total;
  } else {
    proxy.$modal.msgError(res.message);
  }
}

// 筛选节点
function filterNode(value, data) {
  if (!value) return true;
  return data.label.indexOf(value) !== -1;
}

// 节点单击事件
function handleNodeClick(data) {
  queryParams.pageNum = 1;
  queryParams.deptId = data.treeId;
  getUserList();
}

// 关闭标签
function handleClose(tag) {
  selectedUserDate.value.splice(selectedUserDate.value.indexOf(tag), 1);
  multipleTableRef.value?.toggleRowSelection(tag);
}

// 多选框选中数据
function handleSelectionChange(selection) {
  selectedUserDate.value = selection;
}

async function onSelectUsers() {
  selectedUserDate.value = [];
  multipleTableRef.value?.clearSelection();
  await getDeptTreeData();
  userOpen.value = true;
}

// 用户选择弹出框确认按钮
function handleTaskUserComplete() {
  if (!selectedUserDate.value || selectedUserDate.value.length <= 0) {
    proxy.$modal.msgError('请选择用户');
    return;
  }
  userTaskForm.dataType = 'USERS';
  selectedUserDate.value = uniqBy([...oldSelectedUserDate.value, ...selectedUserDate.value], 'id');
  selectedUser.text = selectedUserDate.value.map(k => k.nickName) || [];
  if (selectedUserDate.value.length === 1) {
    let data = selectedUserDate.value[0];
    userTaskForm.assignee = data.id;
    userTaskForm.text = data.nickName;
    userTaskForm.candidateUsers = null;
    showMultiFlog.value = false;
    multiLoopType.value = 'Null';
  } else if (selectedUserDate.value.length > 1) {
    userTaskForm.candidateUsers = selectedUserDate.value.map(k => k.id).join() || null;
    userTaskForm.text = selectedUserDate.value.map(k => k.nickName).join() || null;
    userTaskForm.assignee = null;
    multiLoopType.value = 'ParallelMultiInstance';
    showMultiFlog.value = true;
  } else {
    showMultiFlog.value = false;
  }
  changeMultiLoopType(multiLoopType.value);
  oldSelectedUserDate.value = [...selectedUserDate.value];
  updateElementTask();
  userOpen.value = false;
}

// 用户展示标签 右侧删除按钮
function deleteUser(index) {
  oldSelectedUserDate.value.splice(index, 1);
  selectedUserDate.value = oldSelectedUserDate.value;
  selectedUser.text = selectedUserDate.value.map(k => k.nickName) || [];
  if (selectedUserDate.value.length === 1) {
    let data = selectedUserDate.value[0];
    userTaskForm.assignee = data.id;
    userTaskForm.text = data.nickName;
    userTaskForm.candidateUsers = null;
    showMultiFlog.value = false;
    multiLoopType.value = 'Null';
  } else if (selectedUserDate.value.length > 1) {
    userTaskForm.candidateUsers = selectedUserDate.value.map(k => k.id).join() || null;
    userTaskForm.text = selectedUserDate.value.map(k => k.nickName).join() || null;
    userTaskForm.assignee = null;
    multiLoopType.value = 'ParallelMultiInstance';
    showMultiFlog.value = true;
  } else {
    userTaskForm.assignee = '';
    userTaskForm.text = '';
    userTaskForm.candidateUsers = '';
    multiLoopType.value = 'Null';
    showMultiFlog.value = false;
  }
  changeMultiLoopType(multiLoopType.value);
  oldSelectedUserDate.value = [...selectedUserDate.value];
  updateElementTask();
}

function changeSelectRoles(val) {
  userTaskForm.dataType = 'ROLES';
  userTaskForm.candidateGroups = val.join() || null;
  let textArr = roleOptions.value.filter(k => val.indexOf(`ROLE${k.id}`) >= 0);
  userTaskForm.text = textArr?.map(k => k.roleName).join() || null;
  updateElementTask();
}

function checkedDeptChange(checkedIds, checkedData) {
  userTaskForm.dataType = 'DEPTS';
  if (checkedIds && checkedIds.length > 0) {
    deptIds.value = checkedIds;
  }
  if (checkedData && checkedData.length > 0) {
    userTaskForm.candidateGroups = checkedData.map(k => k.id).join() || null;
    userTaskForm.text = checkedData.map(k => k.label).join() || null;
    updateElementTask();
  }
}

function changeDataType(val) {
  // 清空 userTaskForm 所有属性值
  Object.keys(userTaskForm).forEach(key => userTaskForm[key] = null);
  userTaskForm.dataType = val;
  if (val === 'USERS') {
    if (selectedUser && selectedUser.ids && selectedUser.ids.length > 0) {
      if (selectedUser.ids.length === 1) {
        userTaskForm.assignee = selectedUser.ids[0];
      } else {
        userTaskForm.candidateUsers = selectedUser.ids.join();
      }
      userTaskForm.text = selectedUser.text?.join() || null;
    }
  } else if (val === 'ROLES') {
    getRoleOptions();
    if (roleIds.value && roleIds.value.length > 0) {
      userTaskForm.candidateGroups = roleIds.value.join() || null;
      let textArr = roleOptions.value.filter(k => roleIds.value.indexOf(`ROLE${k.id}`) >= 0);
      userTaskForm.text = textArr?.map(k => k.roleName).join() || null;
    }
  } else if (val === 'DEPTS') {
    getDeptTreeData();
    if (deptIds.value && deptIds.value.length > 0) {
      userTaskForm.candidateGroups = deptIds.value.join() || null;
      let textArr = [];
      let treeStarkData = JSON.parse(JSON.stringify(deptTreeData.value));
      deptIds.value.forEach(id => {
        let stark = [];
        stark = stark.concat(treeStarkData);
        while (stark.length) {
          let temp = stark.shift();
          if (temp.children) {
            stark = temp.children.concat(stark);
          }
          if (id === temp.id) {
            textArr.push(temp);
          }
        }
      });
      userTaskForm.text = textArr?.map(k => k.label).join() || null;
    }
  } else if (val === 'INITIATOR') {
    userTaskForm.assignee = "${initiator}";
    userTaskForm.text = "流程发起人";
    multiLoopType.value = 'Null';
  }
  updateElementTask();
  if (val === 'USERS' && selectedUser.ids.length === 1) {
    multiLoopType.value = "Null";
    showMultiFlog.value = false;
  } else if (val === 'ROLES' || val === 'DEPTS' || (val === 'USERS' && selectedUser.ids.length > 1)) {
    showMultiFlog.value = true;
    multiLoopType.value = "ParallelMultiInstance";
  } else {
    showMultiFlog.value = false;
  }
  changeMultiLoopType(multiLoopType.value);
}

function getElementLoop(businessObject) {
  if (!businessObject.loopCharacteristics) {
    multiLoopType.value = "Null";
    // 选择任何方式都触发 审批方式函数
    changeMultiLoopType(multiLoopType.value);
    multiLoopType.value = 'ParallelMultiInstance';
    return;
  }
  if (businessObject.loopCharacteristics.isSequential) {
    multiLoopType.value = "SequentialMultiInstance";
  } else {
    multiLoopType.value = "ParallelMultiInstance";
  }
  // 选择任何方式都触发 审批方式函数
  changeMultiLoopType(multiLoopType.value);
}

function changeMultiLoopType(type) {
  // 取消多实例配置
  if (type === "Null") {
    window.bpmnInstances.modeling.updateProperties(bpmnElement, { loopCharacteristics: null });
    return;
  }
  // 完成条件
  let completionCondition = null;
  // 会签
  if (type === "SequentialMultiInstance") {
    multiLoopInstance = window.bpmnInstances.moddle.create("bpmn:MultiInstanceLoopCharacteristics", { isSequential: true });
    completionCondition = window.bpmnInstances.moddle.create("bpmn:FormalExpression", { body: '${nrOfCompletedInstances >= nrOfInstances}' });
  }
  // 或签
  if (type === "ParallelMultiInstance") {
    multiLoopInstance = window.bpmnInstances.moddle.create("bpmn:MultiInstanceLoopCharacteristics");
    completionCondition = window.bpmnInstances.moddle.create("bpmn:FormalExpression", { body: '${nrOfCompletedInstances > 0}' });
  }
  // 更新多实例配置
  window.bpmnInstances.modeling.updateProperties(bpmnElement, {
    loopCharacteristics: multiLoopInstance,
    assignee: '${assignee}'
  });
  // 更新模块属性信息
  window.bpmnInstances.modeling.updateModdleProperties(bpmnElement, multiLoopInstance, {
    collection: '${multiInstanceHandler.getUserIds(execution)}',
    elementVariable: 'assignee',
    completionCondition
  });
}

onBeforeUnmount(() => {
  bpmnElement = null;
});
</script>

<style scoped lang="scss">
.el-row .el-radio-group {
  margin-bottom: 15px;
  .el-radio {
    line-height: 28px;
  }
}
.el-tag {
  margin-bottom: 10px;
  + .el-tag {
    margin-left: 10px;
  }
}
.head-container {
  height: 500px;
  overflow: auto;
}
</style>
