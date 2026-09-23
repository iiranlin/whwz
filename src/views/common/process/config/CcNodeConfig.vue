<template>
  <div>
    <el-button size="mini" icon="el-icon-plus" type="primary" @click="selectOrg" round>选择抄送人</el-button>
    <div class="option">
      <el-checkbox label="允许发起人添加抄送人" v-model="config.shouldAdd"></el-checkbox>
    </div>
    <org-items v-model="select"/>
    <org-picker multiple ref="orgPicker" :selected="select" @ok="selected"/>
  </div>
</template>

<script setup name="CcNodeConfig">
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

const select = computed({
  get: () => props.config.assignedUser || [],
  set: (val) => { props.config.assignedUser = val }
})

function selectOrg() {
  orgPicker.value.show()
}
function selected(selectList) {
  console.log(selectList)
  select.value = Object.assign([], selectList)
}
function removeOrgItem(index) {
  select.value.splice(index, 1)
}
</script>

<style lang="scss" scoped>
.option{
  color: #606266;
  margin-top: 20px;
  font-size: small;
}

.desc{
  font-size: small;
  color: #8c8c8c;
}
.org-item{
  margin: 5px;
}
</style>
