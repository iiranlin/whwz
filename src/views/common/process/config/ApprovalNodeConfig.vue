<template>
  <div>
    <el-form
      label-position="top"
      label-width="90px"
    >
      <el-form-item
        label="⚙ 选择审批对象"
        prop="text"
        class="user-type"
      >
        <el-radio-group v-model="nodeProps.assignedType" @change="userTypeChange">
          <el-radio
            v-for="t in approvalTypes"
            :label="t.type"
            :key="t.type"
          >{{ t.name }}
          </el-radio>
        </el-radio-group>
        <div v-if="['ASSIGN_USER'].includes( nodeProps.assignedType)">
          <el-button
            size="mini"
            icon="el-icon-plus"
            type="primary"
            @click="selectUser('ASSIGN')"
            round
          >选择人员
          </el-button>
          <org-items v-model="nodeProps.assignedUser"/>
        </div>
        <div v-if="['EXPERT'].includes( nodeProps.assignedType)">
          <el-button
            size="mini"
            icon="el-icon-plus"
            type="primary"
            @click="selectUser('EXPERT')"
            round
          >选择专家
          </el-button>
          <org-items v-model="nodeProps.assignedUser"/>
        </div>
        <!-- <div v-else-if="nodeProps.assignedType === 'SELF_SELECT'">
          <el-radio-group size="mini" v-model="nodeProps.selfSelect.multiple">
            <el-radio-button :label="false">自选一个人</el-radio-button>
            <el-radio-button :label="true">自选多个人</el-radio-button>
          </el-radio-group>
        </div> -->
        <!-- <div v-else-if="nodeProps.assignedType === 'LEADER_TOP'">
          <el-divider/>
          <el-form-item label="审批终点" prop="text" class="approve-end">
            <el-radio-group v-model="nodeProps.leaderTop.endCondition">
              <el-radio label="TOP">直到最上层主管</el-radio>
              <el-radio label="LEAVE">不超过发起人的</el-radio>
            </el-radio-group>
            <div class="approve-end-leave" v-if="nodeProps.leaderTop.endCondition === 'LEAVE'">
              <span>第 </span>
              <el-input-number :min="1" :max="20" :step="1" size="mini" v-model="nodeProps.leaderTop.level"/>
              <span> 级主管</span>
            </div>
          </el-form-item>
        </div> -->
        <!-- <div v-else-if="nodeProps.assignedType === 'LEADER'">
          <el-divider/>
          <el-form-item label="指定主管" prop="text">
            <span>发起人的第 </span>
            <el-input-number :min="1" :max="20" :step="1" size="mini"
                             v-model="nodeProps.leader.level"></el-input-number>
            <span> 级主管</span>
            <div style="color: #409EFF; font-size: small;">👉 直接主管为 第 1 级主管</div>
          </el-form-item>
        </div>
        -->
        <div v-else-if="nodeProps.assignedType === 'ROLE'">
          <el-button
            size="mini"
            icon="el-icon-plus"
            type="primary"
            @click="selectRole"
            round
          >选择系统角色
          </el-button>
          <org-items v-model="nodeProps.role"/>
        </div>
        <!--
        <div v-else-if="nodeProps.assignedType === 'FORM_USER'">
          <el-form-item label="选择表单联系人项" prop="text" class="approve-end">
            <el-select style="width: 80%;" size="small" v-model="nodeProps.formUser" placeholder="请选择包含联系人的表单项">
              <el-option v-for="op in forms" :label="op.title" :value="op.id"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div v-else>
          <span class="item-desc">发起人自己作为审批人进行审批</span>
        </div> -->

      </el-form-item>
      <!-- <el-divider></el-divider>
      <el-form-item
        label="⚙ 选择抄送对象"
        prop="text"
        class="user-type"
      >
        <div>
          <el-button
            size="mini"
            icon="el-icon-plus"
            type="primary"
            @click="selectUser('NOTICE')"
            round
          >选择人员</el-button>
          <org-items v-model="nodeProps.noticeUsers" :key="noticeUserKey" @removeOrgItem="removeOrgItem"/>
        </div>
      </el-form-item> -->
      <el-divider></el-divider>
      <el-form-item
        label="👤 审批人为空时"
        prop="text"
        class="line-mode"
      >
        <el-radio-group v-model="nodeProps.nobody.handler">
          <el-radio label="TO_PASS">自动通过</el-radio>
          <!-- <el-radio label="TO_REFUSE">自动驳回</el-radio>
          <el-radio label="TO_ADMIN">转交审批管理员</el-radio>
          <el-radio label="TO_USER">转交到指定人员</el-radio> -->
        </el-radio-group>

        <div
          style="margin-top: 10px"
          v-if="nodeProps.nobody.handler === 'TO_USER'"
        >
          <el-button
            size="mini"
            icon="el-icon-plus"
            type="primary"
            @click="selectNoSetUser"
            round
          >选择人员
          </el-button>
          <org-items v-model="nodeProps.nobody.assignedUser"/>
        </div>

      </el-form-item>

      <div v-if="showMode">
        <el-divider/>
        <el-form-item
          label="👩‍👦‍👦 多人审批时审批方式"
          prop="text"
          class="approve-mode"
        >
          <el-radio-group v-model="nodeProps.mode" @change="modeChange">
            <el-radio label="NEXT">顺序会签 （按选择顺序审批，每个人必须同意）</el-radio>
            <el-radio label="AND">并行会签（可同时审批，每个人必须同意）</el-radio>
            <el-radio label="OR">或签（有一人同意即可）</el-radio>
          </el-radio-group>
        </el-form-item>
      </div>
      <el-divider>审批功能选择</el-divider>
      <!-- <el-form-item
        label="✍是否开启字段编辑"
        prop="text"
      >
        <el-switch
          inactive-text="关闭"
          active-text="开启"
          v-model="nodeProps.function.isFuction"
          @change="isFuctionChange"
        ></el-switch>
        <el-tooltip
          class="item"
          effect="dark"
          content="如果开启了字段编辑，则审批时需要填写相关信息"
          placement="top-start"
        >
          <i
            class="el-icon-question"
            style="margin-left: 10px; font-size: medium; color: #b0b0b1"
          ></i>
        </el-tooltip>
      </el-form-item> -->
      <el-form-item
        label=""
        prop="text"
      >
        <el-checkbox-group v-model="nodeProps.function.field" value-key="id">
          <el-checkbox :disabled="!nodeProps.function.isFuction" :label="functionField.id"
                       v-for="(functionField, index) in functionFieldList" :key="functionField.id">
            {{ functionField.title }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item
        label="✍是否可撤回"
        prop="text"
      >
        <el-switch
          inactive-text="否"
          active-text="是"
          v-model="nodeProps.isWithdraw"
        ></el-switch>
        <el-tooltip
          class="item"
          effect="dark"
          content="如果选择是，则当前节点审核完成后，单据可撤回"
          placement="top-start"
        >
          <i
            class="el-icon-question"
            style="margin-left: 10px; font-size: medium; color: #b0b0b1"
          ></i>
        </el-tooltip>
      </el-form-item>
      <el-form-item
        label="✍驳回时是否跳过节点"
        prop="text"
      >
        <el-switch
          inactive-text="否"
          active-text="是"
          v-model="nodeProps.rejectSkip"
        ></el-switch>
        <el-tooltip
          class="item"
          effect="dark"
          content="如果选择是，则驳回到当前节点时自动跳过到上一节点"
          placement="top-start"
        >
          <i
            class="el-icon-question"
            style="margin-left: 10px; font-size: medium; color: #b0b0b1"
          ></i>
        </el-tooltip>
      </el-form-item>
      <!-- <el-form-item
        label="✍重复审批人是否自动通过"
        prop="text"
        v-if="!(nodeProps.mode === 'OR' || nodeProps.function.isFuction)"
      >
        <el-switch
          inactive-text="否"
          active-text="是"
          v-model="nodeProps.isSamePass"
        ></el-switch>
        <el-tooltip
          class="item"
          effect="dark"
          content="如果选择是，则上个节点审核完成后，该节点相同审批人会自动审核通过"
          placement="top-start"
        >
          <i
            class="el-icon-question"
            style="margin-left: 10px; font-size: medium; color: #b0b0b1"
          ></i>
        </el-tooltip>
      </el-form-item> -->
      <!-- <el-divider>高级设置</el-divider>
      <el-form-item label="✍ 审批同意时是否需要签字" prop="text">
        <el-switch inactive-text="不用" active-text="需要" v-model="nodeProps.sign"></el-switch>
        <el-tooltip class="item" effect="dark" content="如果全局设置了需要签字，则此处不生效" placement="top-start">
          <i class="el-icon-question" style="margin-left: 10px; font-size: medium; color: #b0b0b1"></i>
        </el-tooltip>
      </el-form-item>
      <el-form-item label="⏱ 审批期限（为 0 则不生效）" prop="timeLimit">
        <el-input style="width: 180px;" placeholder="时长" size="small" type="number"
                  v-model="nodeProps.timeLimit.timeout.value">
          <template #append>
            <el-select style="width: 75px;" v-model="nodeProps.timeLimit.timeout.unit" placeholder="请选择">
              <el-option label="天" value="D"></el-option>
              <el-option label="小时" value="H"></el-option>
            </el-select>
          </template>
        </el-input>
      </el-form-item> -->
      <!-- <el-form-item label="审批期限超时后执行" prop="level" v-if="nodeProps.timeLimit.timeout.value > 0">
        <el-radio-group v-model="nodeProps.timeLimit.handler.type">
          <el-radio label="PASS">自动通过</el-radio>
          <el-radio label="REFUSE">自动驳回</el-radio>
          <el-radio label="NOTIFY">发送提醒</el-radio>
        </el-radio-group>
        <div v-if="nodeProps.timeLimit.handler.type === 'NOTIFY'">
          <div style="color:#409EEF; font-size: small">默认提醒当前审批人</div>
          <el-switch inactive-text="循环" active-text="一次" v-model="nodeProps.timeLimit.handler.notify.once"></el-switch>
          <span style="margin-left: 20px" v-if="!nodeProps.timeLimit.handler.notify.once">
							每隔
							<el-input-number :min="0" :max="10000" :step="1" size="mini"
                               v-model="nodeProps.timeLimit.handler.notify.hour"/>
							小时提醒一次
						</span>
        </div>
      </el-form-item> -->
      <!-- <el-form-item label="🙅‍ 如果审批被驳回 👇">
        <el-radio-group v-model="nodeProps.refuse.type">
          <el-radio label="TO_END">直接结束流程</el-radio>
          <el-radio label="TO_BEFORE">驳回到上级审批节点</el-radio>
          <el-radio label="TO_NODE">驳回到指定节点</el-radio>
        </el-radio-group>
        <div v-if="nodeProps.refuse.type === 'TO_NODE'">
          <span>指定节点:</span>
          <el-select style="margin-left: 10px; width: 150px;" placeholder="选择跳转步骤" size="small" v-model="nodeProps.refuse.target">
            <el-option v-for="(node, i) in nodeOptions" :key="i" :label="node.name" :value="node.id"></el-option>
          </el-select>
        </div>

      </el-form-item> -->
    </el-form>
    <!-- <org-picker :title="pickerTitle" multiple :type="orgPickerType" ref="orgPicker" :selected="orgPickerSelected"
                @ok="selected"/> -->
    <select-user-tree
      ref="selectUserTreeRef"
      @handleTaskUserComplete="selected"
    />
    <el-dialog
      class="unit-dialog"
      v-model:visible="roleVisible"
      append-to-body
      width="800px"
      :title="`系统角色`"
      :close-on-click-modal="false"
    >
      <div class="unit-dialog-content">
        <div class="select-title">
          系统角色:
        </div>
        <el-select
          v-model="currentRoleVal"
          placeholder="请选择"
          style="width: 600px;"
          @change="roleChange"
        >
          <el-option
            v-for="item in roleOptions"
            :key="item.id"
            :label="item.roleName"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <div class="pop-btn-box">
            <el-button
              type="primary"
              @click="confirmButton()"
              :disabled="!currentRoleVal"
            >确定
            </el-button>
            <el-button @click="roleVisible = false">取消</el-button>
          </div>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="ApprovalNodeConfig">
import { ref, computed, getCurrentInstance } from 'vue'
import { useRoute } from 'vue-router'
import { roleListAll } from '@/api/system/role'
import { getFunctionByType as fetchFunctionByType } from '@/api/workflow/category'
import selectUserTree from '@/components/common/selectUserTree'
import OrgItems from '../OrgItems'
import { useProcessStore } from '@/store/modules/process'

const { proxy } = getCurrentInstance()
const route = useRoute()
const processStore = useProcessStore()

const props = defineProps({
  config: {
    type: Object,
    default: () => ({})
  }
})

const selectUserTreeRef = ref(null)

const showOrgSelect = ref(false)
const orgPickerSelected = ref([])
const orgPickerExpertSelected = ref([])
const orgPickerType = ref('user')
const selectUserType = ref('')
const approvalTypes = ref([
  { name: '指定人员', type: 'ASSIGN_USER' }
])
const roleVisible = ref(false)
const roleOptions = ref([])
const currentCondition = ref({})
const currentRoleVal = ref(null)
const selectRoleItem = ref({})
const currentRoleName = ref('')
const functionFieldList = ref([])
const noticeUserKey = ref(1)

const nodeProps = computed(() => processStore.selectedNode.props)
const select = computed(() => props.config.assignedUser || [])
const selectNotice = computed(() => props.config.noticeUsers || [])
const selectRoleData = computed(() => props.config.role || [])
const forms = computed(() => processStore.design.formItems.filter(f => f.name === 'UserPicker'))
const pickerTitle = computed(() => {
  switch (orgPickerType.value) {
    case 'user':
      return '请选择人员'
    case 'role':
      return '请选择系统角色'
    default:
      return null
  }
})
const nodeOptions = computed(() => {
  let values = []
  const excType = ['ROOT', 'EMPTY', 'CONDITION', 'CONDITIONS', 'CONCURRENT', 'CONCURRENTS']
  processStore.nodeMap.forEach((v) => {
    if (excType.indexOf(v.type) === -1) {
      values.push({ id: v.id, name: v.name })
    }
  })
  return values
})
const showMode = computed(() => {
  switch (nodeProps.value.assignedType) {
    case 'ASSIGN_USER':
      return nodeProps.value.assignedUser.length > 0
    case 'EXPERT':
      return nodeProps.value.assignedUser.length > 0
    case 'SELF_SELECT':
      return nodeProps.value.selfSelect.multiple
    case 'LEADER_TOP':
      return nodeProps.value.formUser !== ''
    case 'FORM_USER':
      return true
    case 'ROLE':
      return true
    default:
      return false
  }
})

function userTypeChange(v) {
  nodeProps.value.rejectSkip = v === 'EXPERT'
  orgPickerSelected.value = []
  orgPickerSelected.value.length = 0
  orgPickerExpertSelected.value = []
  orgPickerExpertSelected.value.length = 0
  nodeProps.value.assignedUser = []
}

function selectUser(type) {
  selectUserType.value = type
  if (selectUserType.value === 'ASSIGN') {
    orgPickerType.value = 'user'
  } else if (selectUserType.value === 'NOTICE') {
  } else if (selectUserType.value === 'EXPERT') {
    nodeProps.value.mode = 'OR'
    orgPickerType.value = 'user'
  }
  selectUserTreeRef.value?.init(type, select.value)
}

function isFuctionChange(flag) {
  if (flag === false) {
    nodeProps.value.isSamePass = false
    nodeProps.value.function.field = []
    return
  }
}

function modeChange(flag) {
  if (flag === 'OR') {
    nodeProps.value.isSamePass = false
  }
}

function selectNoSetUser() {
  orgPickerSelected.value = props.config.nobody.assignedUser
  orgPickerType.value = 'user'
  // proxy.$refs.orgPicker.show()
}

function selectRole() {
  orgPickerSelected.value = selectRoleData.value
  orgPickerType.value = 'role'
  roleVisible.value = true
  currentRoleVal.value = selectRoleData.value?.[0]?.id
  getRoleOptions()
}

function selected(selectData) {
  if (selectUserType.value === 'ASSIGN') {
    orgPickerSelected.value = selectData
    nodeProps.value.assignedUser = orgPickerSelected.value
  } else if (selectUserType.value === 'EXPERT') {
    orgPickerExpertSelected.value = selectData
    nodeProps.value.assignedUser = orgPickerExpertSelected.value
  } else if (selectUserType.value === 'NOTICE') {
    selectNotice.value = selectData
    nodeProps.value.noticeUsers = selectNotice.value
    noticeUserKey.value++
  }
}

function removeOrgItem(index) {
  noticeUserKey.value++
}

async function getRoleOptions() {
  try {
    roleListAll({}).then(res => {
      if (res?.success) {
        const roleOptionsData = res?.data?.list?.map(i => {
          return {
            id: i.id,
            roleCode: i.roleCode,
            roleName: i.roleName,
            type: 'role'
          }
        }) || []
        roleOptions.value = roleOptionsData || []
      } else {
        proxy.$modal.msgError(res.message)
      }
    })
  } catch (e) {
  }
}

function handleIconSearch(row) {
  currentCondition.value = row
  currentRoleName.value = ''
  currentRoleVal.value = null
  // visible.value = true
}

function roleChange(v) {
  const selectRoleItemData = roleOptions.value.find(i => i.id === v) || []
  selectRoleItem.value = selectRoleItemData || {}
  currentRoleName.value = selectRoleItemData.deptName || ''
}

function confirmButton() {
  currentRoleVal.value ? currentCondition.value.value = currentRoleName.value : null
  const currentRole = [selectRoleItem.value] || []
  orgPickerSelected.value.length = 0
  currentRole.forEach(val => orgPickerSelected.value.push(val))
  roleVisible.value = false
}

async function getFunctionByType() {
  const params = {
    billType: route.query.billType
  }
  const loading = proxy.$loading({ lock: true, text: '加载中...' })
  try {
    const res = await fetchFunctionByType(params)
    if (res.success) {
      functionFieldList.value = res?.data || []
    } else {
      proxy.$modal.msgError(res?.message || '请求失败')
    }
  } catch (e) {
  } finally {
    loading?.close()
  }
}
</script>

<style lang="scss" scoped>
.user-type {
  :deep(.el-radio) {
    width: 110px;
    margin-top: 10px;
    margin-bottom: 20px;
  }
}

:deep(.line-mode) {
  .el-radio {
    width: 150px;
    margin: 5px;
  }
}

:deep(.el-form-item__label) {
  line-height: 25px;
}

:deep(.approve-mode) {
  .el-radio {
    float: left;
    width: 100%;
    display: block;
    margin-top: 15px;
  }
}

:deep(.approve-end) {
  position: relative;

  .el-radio-group {
    width: 160px;
  }

  .el-radio {
    margin-bottom: 5px;
    width: 100%;
  }

  .approve-end-leave {
    position: absolute;
    bottom: -5px;
    left: 150px;
  }
}

:deep(.el-divider--horizontal) {
  margin: 10px 0;
}
</style>

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
    position: relative;

    div {
      display: inline-block;
    }

    .group-name {
      font-size: small;
    }

    .group-cp {
      font-size: small;
      position: absolute;
      left: 100px;
      display: flex;
      top: 5px;
      justify-content: center;
      align-items: center;
    }

    .group-operation {
      position: absolute;
      right: 10px;

      i {
        padding: 0 10px;

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
