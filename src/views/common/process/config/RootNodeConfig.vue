<template>
  <div>
    <p class="desc">选择能发起该审批的人员/部门，不选则默认开放给所有人</p>
    <el-button size="mini" @click="selectOrg" icon="el-icon-plus" type="primary" round>请选择</el-button>
    <org-items v-model="select"/>
    <org-picker title="请选择可发起本审批的人员/部门" multiple ref="orgPicker" :selected="select" @ok="selected"/>
  </div>
</template>

<script setup name="RootConfig">
import { ref, computed } from 'vue'
import OrgPicker from "@/components/common/OrgPicker";
import OrgItems from "../OrgItems";

const props = defineProps({
  config: {
    type: Object,
    default: () => {
      return {}
    }
  }
})

const orgPicker = ref(null)

const showOrgSelect = ref(false)

const select = computed(() => props.config.assignedUser)

function selectOrg() {
  orgPicker.value.show()
}
function selected(selectList) {
  select.value.length = 0
  selectList.forEach(val => select.value.push(val))
}
function removeOrgItem(index) {
  select.value.splice(index, 1)
}
</script>

<style lang="scss" scoped>
.desc{
  font-size: small;
  color: #8c8c8c;
}
.org-item{
  margin: 5px;
}
</style>
