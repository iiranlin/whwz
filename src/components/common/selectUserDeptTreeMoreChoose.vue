<template>
  <div class="select-user-tree">
    <div>
      <el-dialog
        title="候选用户1"
        v-model="userOpen"
        width="1200px"
        append-to-body
        :before-close="beforeClose"
      >
        <template #title>
        <div class="dialog-title dialog-search">
          <span class="title">{{ title }}</span>

        </div>
        </template>
        <el-row :gutter="20">
          <el-form
            ref="userFormDataRef"
            label-suffix=":"
            :inline="true"
            :model="userFormData"
            class="demo-form-inline search-form"
          >
            <el-form-item label="员工工号" prop="username">
              <el-input
                v-model="userFormData.username"
                placeholder="员工工号"
                @keyup.enter="handleQuery"
              ></el-input>
            </el-form-item>
            <el-form-item label="员工姓名" prop="nickName">
              <el-input
                v-model="userFormData.nickName"
                placeholder="员工姓名"
                @keyup.enter="handleQuery"
              ></el-input>
            </el-form-item>
          </el-form>
        </el-row>
        <el-row type="flex" :gutter="20">
          <!--部门数据-->
          <el-col :span="7" class="left-col">
            <el-card shadow="never" style="height: 100%">
              <template #header>
                <span>部门列表</span>
              </template>
              <div class="head-container">
                <!-- <el-input
                v-model="deptName"
                placeholder="请输入"
                clearable
                size="small"
                prefix-icon="el-icon-search"
                style="margin-bottom: 20px"
              /> -->
                <el-tree
                  node-key="id"
                  :data="treeData"
                  :props="deptProps"
                  :expand-on-click-node="false"
                  ref="tree"
                  accordion
                  highlight-current
                  @node-click="handleNodeClick"
                  :default-expanded-keys="defExpandedKeys"
                >
                  <template #default="{ data, node }">
                  <span class="custom-tree-node">
                    <el-tooltip
                      :content="`${data.label}`"
                      placement="top-start"
                    >
                      <span>{{ data.label }}</span>
                    </el-tooltip>
                  </span>
                  </template>
                </el-tree>
              </div>
            </el-card>
          </el-col>
          <el-col :span="16" class="right-col">
             <div class="body-tool">
              <el-button
                class="button-item search"
                round
                icon="Search" 
                type="primary"
                @click="handleQuery"
              >
                搜索
              </el-button>
              <el-button
                class="button-item reset"
                icon="RefreshLeft" 
                round
                @click="resetQuery"
                ><span class="button-text">重置</span>
              </el-button>
          </div>
            <el-table
              v-if="userOpen"
              ref="multipleTable"
              height="100%"
              :loading="loading"
              :data="userTableList"
              tooltip-effect="dark"
              row-key="id"
              @selection-change="handleSelectionChange"
              @select="handleSelection"
              @select-all="handleSelectionAll"
              @row-dblclick="dblclick"
            >
              <el-table-column reserve-selection type="selection" width="50" align="center" />
              <el-table-column label="员工姓名" width="120" align="left" prop="nickName" />
              <el-table-column label="员工工号" width="100" align="center" prop="username" />
              <el-table-column label="单位名称" align="left" prop="unitName" />
              <el-table-column label="部门名称" align="left" prop="deptName" />
            </el-table>
            <pagination
              :total="userTotal"
              v-model:page="page.pageNum"
              v-model:limit="page.pageSize"
              @pagination="getUserList(userFormData)"
            />
          </el-col>
        </el-row>
        <template #footer>
        <div class="dialog-footer">
          <hz-button round type="primary" @click="handleTaskUserComplete"
            >确 定</hz-button
          >
          <hz-button round @click="userOpen = false">取 消</hz-button>
        </div>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script setup name="selectUserDeptTreeMoreChoose">
import { ref, reactive, nextTick, getCurrentInstance } from 'vue'
import { userPage, userListAll } from "@/api/system/user";
import { getUserListAllByDept } from "@/api/common/index";
import {
  getDeptTreeByUser,
  deptGetTreeByDeptId,
  deptTreeAll,
} from "@/api/system/dept";

let unitsMap = new Map();

const { proxy } = getCurrentInstance()
const emit = defineEmits(['handleTaskUserComplete'])

const props = defineProps({
  title: { type: String, default: () => "" },
  modeType: { type: Boolean, default: false },
  multiple: { type: Boolean, default: false },
  checkedIds: { type: Array, default: () => [] },
  selectedIds: { type: Array, default: () => [] },
  apiType: { type: String, default: () => "" },
  append: { type: Boolean, default: false },
  children: { type: Boolean, default: false },
  isFilter: { type: Boolean, default: false },
  hadSelectedRows: { type: Array, default: () => [] },
  alreadySelectUser: { type: Object, default: () => ({}) },
})

// reactive refs
const loading = ref(false)
const userOpen = ref(false)
const deptOptions = ref([])
const deptTreeData = ref([])
const ostatus = ref({})
const treeData = ref([])
const deptProps = reactive({ children: "children", label: "label" })
const queryParams = reactive({ deptId: undefined })
const page = reactive({ pageNum: 1, pageSize: 30 })
const selectedItems = ref([])
const defExpandedKeys = ref(["DEPT00600023"])
const deptId = ref("")
const userTotal = ref(0)
const userTableList = ref([])
const selectedUserData = ref([])
const userFormData = reactive({ username: "", nickName: "" })
const beforeCheckUser = ref({})
const currentSort = ref(null)
const treeDeptId = ref("00600023")
const currentType = ref('')
const historyCheckUserIds = ref([])
const deleteOldDataIds = ref([])
const treeLoading = ref(false)

// template refs
const multipleTable = ref(null)
const tree = ref(null)
const userFormDataRef = ref(null)
function init(currentSortVal, type = '', historyCheckUserIdsVal = []) {
  userTableList.value = []
  deleteOldDataIds.value = []
  if (type === 'update') {
    currentType.value = type;
    historyCheckUserIds.value = historyCheckUserIdsVal;
  }
  if (currentSortVal != currentSort.value) {
    beforeCheckUser.value = {};
  } else {
    beforeCheckUser.value = props.alreadySelectUser;
  }
  beforeCheckUser.value = props.alreadySelectUser;
  currentSort.value = currentSortVal
  selectedUserData.value = [];
  selectedItems.value = [];
  userOpen.value = true;
  userFormData.username = "";
  userFormData.nickName = "";
  userFormData.deptId = deptId.value;
  handleQuery();
  getDeptTreeData();
}

function dblclick(row) {
  selectedUserData.value = [];
  if (props.modeType) {
    selectedUserData.value.push({
      userId: row.id,
      userName: row.nickName,
      userCode: row.userCode,
      type: "user",
      sex: false,
      selected: false,
    });
    emit("handleTaskUserComplete", selectedUserData.value, currentSort.value);
    userOpen.value = false;
  }
}

function handleNodeClick(data) {
  queryParams.pageNum = 1;
  queryParams.deptId = data.treeId;
  userFormData.deptId = data.treeId;
  getUserList(queryParams);
}
async function getDeptTreeData() {
  function refactorTree(data) {
    return data.map((node) => {
      let treeNode = {
        ...node,
        id: `DEPT${node.id}`,
        treeId: node.id,
        label: node.deptName,
      };
      if (node.children && node.children.length > 0) {
        treeNode.children = refactorTree(node.children);
      }
      return treeNode;
    });
  }
  let params = {
    deptId: treeDeptId.value,
    containsHeader: true,
    levelNumber: 7,
  };
  deptGetTreeByDeptId(params).then((res) => {
    if (res?.success) {
      const deptOptions = res.data || [];
      treeData.value = refactorTree(deptOptions) || [];
    } else {
      proxy.$modal.msgError(res.message);
    }
  });
}

async function getDeptTreeByUserFun(params = {}) {
  function refactorTree(data) {
    return data.map((node) => {
      let treeNode = {
        ...node,
        id: `DEPT${node.id}`,
        treeId: node.id,
        label: node.deptName,
      };
      if (node.children && node.children.length > 0) {
        treeNode.children = refactorTree(node.children);
      }
      return treeNode;
    });
  }
  treeLoading.value = true;
  const loading = proxy.$loading(proxy.$c?.loadingCommonOptions || { lock: true, text: '加载中...' });
  try {
    const res = await getDeptTreeByUser(params);
    if (res.success && Array.isArray(res.data) && res.data.length) {
      const deptOptions = res.data || [];
      if (!props.children && deptOptions[0].children.length > 0) {
        deptOptions[0].children = [];
      }
      treeData.value = refactorTree(deptOptions) || [];
      getUnitsMap(res.data);
    } else {
      treeData.value = [];
    }
  } catch (e) {
    console.error(e.message);
  } finally {
    treeLoading.value = false;
    loading?.close();
  }
}

async function getUserUnitTreeByDeptIdFun(params = {}) {
  function refactorTree(data) {
    return data.map((node) => {
      let treeNode = {
        ...node,
        id: `DEPT${node.id}`,
        treeId: node.id,
        label: node.deptName,
      };
      if (node.children && node.children.length > 0) {
        treeNode.children = refactorTree(node.children);
      }
      return treeNode;
    });
  }
  treeLoading.value = true;
  const loading = proxy.$loading(proxy.$c?.loadingCommonOptions || { lock: true, text: '加载中...' });
  try {
    const res = await deptGetTreeByDeptId(params);
    if (res.success && Array.isArray(res.data) && res.data.length) {
      const deptOptions = res.data || [];
      if (!props.children && deptOptions[0].children.length > 0) {
        deptOptions[0].children = [];
      }
      treeData.value = refactorTree(deptOptions) || [];
      getUnitsMap(res.data);
    } else {
      treeData.value = [];
    }
  } catch (e) {
    console.error(e.message);
  } finally {
    treeLoading.value = false;
    loading?.close();
  }
}

function getUnitsMap(data) {
  data.forEach((e) => {
    unitsMap.set(e.id, e.deptName);
    e.children && e.children.length && getUnitsMap(e.children);
  });
}
async function getUserList(p = {}) {
  loading.value = true;
  try {
    const params = {
      orderByColumn: "updateTime",
      isAsc: "desc",
      ...page,
      ...p,
    };
    let alreadySelectUserIDList = []
    let res = {};
    if (props.isFilter) {
      res = await getUserListAllByDept(params);
    } else {
      res = await userPage(params);
    }
    if (res.success) {
      const { data = {} } = res || {};
      const userTableListArr = data.list.map((e) => {
        e.status = ostatus.value[e.status] || e.status;
        e.createTime = e.createTime ? proxy.$m.formatDate(e.createTime) : "";
        return e;
      });

      userTableList.value = userTableListArr
      if (alreadySelectUserIDList.length) {
        userTableListArr.forEach(item => {
          if (alreadySelectUserIDList.includes(item.id)) {
            nextTick(() => {
              multipleTable.value?.toggleRowSelection(item, true);
            })
          }
        })
      }

      if (currentType.value === 'update') {
        userTableListArr.forEach(item => {
          if (historyCheckUserIds.value.includes(item.id)) {
            nextTick(() => {
              multipleTable.value?.toggleRowSelection(item, true);
            })
          }
        })
      }

      userTotal.value = res.data.total;
      if (
        props.multiple &&
        props.hadSelectedRows.length &&
        data?.list.length
      ) {
        let ids = props.hadSelectedRows.map((e) => e.id);
        data.list.forEach((row) => {
          ids.includes(row.id) &&
            nextTick(() => {
              multipleTable.value?.toggleRowSelection(row, true);
            });
        });
      }
    }
  } catch (e) {
    console.error(e.message);
  } finally {
    loading.value = false;
  }
}
function selectable(row) {
  return !props.checkedIds.includes(row.id);
}

function handleTaskUserComplete() {
  if (!(selectedUserData.value?.length || props.hadSelectedRows?.length) || (!selectedUserData.value?.length && props.hadSelectedRows?.length && props.hadSelectedRows?.length === deleteOldDataIds.value?.length)) {
    proxy.$modal.msgError("请选择用户");
    return;
  }
  emit("handleTaskUserComplete", selectedUserData.value, currentSort.value, deleteOldDataIds.value);
  userOpen.value = false;
}

function handleSelection(selection, row) {
  const selectionIds = selection?.map(item => item.id) || []
  const rowId = row.id
  let hadSelectedRowsIds = props.hadSelectedRows.map(item => item.id);
  let deleteOldDataIdsArr = deleteOldDataIds.value || [];
  if (!selectionIds.includes(rowId) && hadSelectedRowsIds.includes(rowId) && !deleteOldDataIdsArr.includes(rowId)) {
    return deleteOldDataIdsArr.push(rowId)
  }
  if (selectionIds.includes(rowId) && hadSelectedRowsIds.includes(rowId) && deleteOldDataIdsArr.includes(rowId) ) {
    deleteOldDataIdsArr.forEach((_item, index) => {
      deleteOldDataIdsArr.splice(index, 1)
    })
  }
}

function handleSelectionAll(selection) {
  const isAllSelected = multipleTable.value?.store?.states?.isAllSelected
  let hadSelectedRowsIds = props.hadSelectedRows.map(item => item.id);
  const selectAllIds = userTableList.value.map(item => item.id) || [];
  let deleteOldDataIdsArr = deleteOldDataIds.value || [];
  if (!isAllSelected) {
    selectAllIds.forEach((rowId) => {
      hadSelectedRowsIds.includes(rowId) && deleteOldDataIdsArr.push(rowId)
    })
    return
  }
  deleteOldDataIds.value = deleteOldDataIdsArr.filter(item => !selectAllIds.includes(item))
}

function handleSelectionChange(selection) {
  selectedUserData.value = selection.map((i) => {
    return {
      userId: i.id,
      userName: i.nickName,
      userCode: i.userCode,
      type: "user",
      sex: false,
      selected: false,
    };
  });
}

function handleQuery() {
  page.pageNum = 1;
  let res = {
    ...userFormData
  };
  for (let name in userFormData) {
    if (name && userFormData[name] && typeof userFormData[name] === 'string') {
      res[name] = userFormData[name].trim()
    }
  }
  getUserList(res);
}

function resetQuery() {
  userFormDataRef.value?.resetFields();
  handleQuery();
}

function beforeClose() {
  multipleTable.value?.clearSelection();
  userOpen.value = false;
}
</script>

<style scoped lang="scss">
.dialog-search {
  margin-right: 50px;
  display: flex;
  justify-content: space-between;
}
:deep(.el-dialog__body) {
  padding-top: 0px;
}

.head-container {
  height: 480px;
  overflow: auto;
}

.custom-tree-node {
  width: calc(100% - 25px);
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-size: 14px;
  padding-right: 8px;
}
.custom-tree-node :deep(.el-tooltip) {
  overflow: hidden;
  text-overflow: ellipsis;
}
.body-tool {
  height: 50px;
  display: flex;
  justify-content: flex-end;
  align-items: center;

}
.left-col {
  padding: 0 10px!important;
}
.right-col {
  display: flex;
  flex-direction: column;;
}
</style>
