<template>
  <ep-dialog iconTitle="form" :title="title" v-model="dialogTableVisible" width="780px" v-loading="loading">
    <div class="sso-front-table-container">
      <el-form
        class="form-wrapper"
        ref="makerForm"
        :inline="true"
        :model="formData"
        :rules="formDataRules"
        label-width="140px"
      >
        <div class="form-left flex1">
          <el-form-item prop="mtCode" label="字典分类编号：">
            <el-input
              :disabled="isEdit"
              v-limit-text-len="50"
              v-model.trim="formData.mtCode"
              placeholder="请输入字典分类编号"
            />
          </el-form-item>
          <el-form-item prop="mtName" label="字典分类名称：">
            <el-input
              v-limit-text-len="100"
              v-model.trim="formData.mtName"
              placeholder="请输入字典分类名称"
            />
          </el-form-item>
          <el-form-item prop="seq" label="字典分类序号：">
            <el-input
              v-limit-text-len="60"
              v-number-input
              v-model.trim="formData.seq"
              placeholder="请输入字典分类序号"
            />
          </el-form-item>
          <el-form-item prop="enableStatus" label="启用状态：">
            <el-switch
              v-model="formData.enableStatus"
              active-value="1"
              inactive-value="0"
            ></el-switch>
          </el-form-item>
          <el-form-item prop="comments" label="备注：">
            <el-input
              style="width: 500px"
              type="textarea"
              v-limit-text-len="500"
              v-model.trim="formData.comments"
              placeholder="请输入"
            />
          </el-form-item>
        </div>
      </el-form>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogTableVisible = false" class="cancel-btn"
          ><svg-icon icon-class="cancel" /> 关闭</el-button
        >
        <el-button
          type="primary"
          class="determine-btn"
          @click="submitConfirm"
          ><svg-icon icon-class="determine" /> 确定</el-button
        >
      </div>
    </template>
  </ep-dialog>
</template>

<script setup>
import {
  dictMtCreate,
  dictGetMtDetail,
  dictMtModify,
} from '@/api/system/commonDict'

const { proxy } = getCurrentInstance()
const emit = defineEmits(['createSuccess'])

const dialogTableVisible = ref(false)
const loading = ref(false)
const title = ref('新增')
const row = ref(null)

const formData = reactive({
  mtCode: "",
  mtName: "",
  seq: "",
  enableStatus: "1",
  comments: ""
})

const formDataRules = {
  mtName: [
    {
      required: true,
      trigger: "change",
      message: "请输入字典分类名称！",
    },
  ],
  mtCode: [
    {
      required: true,
      trigger: "change",
      message: "请输入字典分类编号！",
    },
  ],
}

const isEdit = computed(() => !!row.value)

function init(data) {
  row.value = data || null
  dialogTableVisible.value = true
  proxy.$nextTick(() => {
    proxy.$refs["makerForm"] && proxy.$refs["makerForm"].clearValidate()
    proxy.$refs["makerForm"] && proxy.$refs["makerForm"].resetFields()
    if (data) {
      getDetail()
      title.value = "编辑"
    } else {
      row.value = null
      title.value = "新增"
    }
  })
}

function getDetail() {
  const dictCode = row.value.dictCode
  dictGetMtDetail(dictCode).then((res) => {
    Object.assign(formData, {
      mtCode: res.data.dictCode,
      mtName: res.data.dictName,
      seq: res.data.dictSeq,
      enableStatus: res.data.enableStatus,
      comments: res.data.dictComment
    })
  })
}

function submitConfirm() {
  proxy.$refs.makerForm.validate((valid) => {
    if (valid) {
      loading.value = true
      const ajaxFn = row.value ? dictMtModify : dictMtCreate
      const params = {
        dictCode: formData.mtCode,
        dictComment: formData.comments,
        dictName: formData.mtName,
        dictSeq: formData.seq,
        enableStatus: formData.enableStatus,
      }
      ajaxFn(params)
        .then(({ message }) => {
          proxy.$modal.msgSuccess(message)
          dialogTableVisible.value = false
          emit("createSuccess")
        })
        .finally(() => {
          loading.value = false
        })
    }
  })
}

defineExpose({ init })
</script>

<style lang="scss" scoped>
.dialog .el-dialog .sso-front-table-container {
  height: 280px !important;
}
</style>
