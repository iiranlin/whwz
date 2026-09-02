<template>
  <ep-dialog iconTitle="form" :title="title" v-model="dialogTableVisible" width="710px" v-loading="loading">
    <div class="sso-front-table-container">
      <el-form
        class="form-wrapper"
        ref="makerForm"
        :inline="true"
        :model="formData"
        :rules="formDataRules"
        label-width="120px"
      >
        <div class="form-left flex1">
          <el-form-item label="所属分类：" prop="mtCode">
            <el-select
              v-model="formData.mtCode"
              placeholder="请选择"
              clearable
            >
              <el-option
                v-for="item in cateList"
                :key="item.dictCode"
                :label="item.dictName"
                :value="item.dictCode"
              >
              </el-option>
            </el-select>
            <el-button style="margin-left: 10px" @click="createCate"
              >+ 新建分类</el-button
            >
          </el-form-item>
          <el-form-item prop="dictCode" label="字典编号：">
            <el-input
              :disabled="isEdit"
              v-limit-text-len="50"
              v-model.trim="formData.dictCode"
              placeholder="请输入字典编号"
            />
          </el-form-item>
          <el-form-item prop="dictName" label="字典名称：">
            <el-input
              v-limit-text-len="100"
              v-model.trim="formData.dictName"
              placeholder="请输入字典名称"
            />
          </el-form-item>
          <el-form-item prop="propCode" label="字典属性编号：">
            <el-input
              v-limit-text-len="50"
              v-model.trim="formData.propCode"
              placeholder="请输入字典属性编号"
            />
          </el-form-item>
          <el-form-item prop="propName" label="字典属性名称：">
            <el-input
              v-limit-text-len="100"
              v-model.trim="formData.propName"
              placeholder="请输入字典属性名称"
            />
          </el-form-item>
          <el-form-item prop="dictSeq" label="字典序号：">
            <el-input
              v-limit-text-len="60"
              v-number-input
              v-model.trim="formData.dictSeq"
              placeholder="请输入字典序号"
            />
          </el-form-item>
          <el-form-item prop="enableStatus" label="启用状态：">
            <el-switch
              v-model="formData.enableStatus"
              active-value="1"
              inactive-value="0"
            ></el-switch>
          </el-form-item>
          <el-form-item prop="dictComment" label="备注：">
            <el-input
              style="width: 400px"
              type="textarea"
              v-limit-text-len="500"
              v-model.trim="formData.dictComment"
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
import { dictModify, dictDetail, dictCreate } from "@/api/system/commonDict"

const props = defineProps({
  cateList: {
    default: () => ([]),
    type: Array
  }
})
const emit = defineEmits(['createSuccess', 'createCate'])

const { proxy } = getCurrentInstance()
const dialogTableVisible = ref(false)
const loading = ref(false)
const title = ref('新增')
const row = ref(null)

const formData = reactive({
  dictCode: "",
  dictName: "",
  mtCode: "",
  dictComment: "",
  dictSeq: "",
  enableStatus: "1",
  propName: "",
  propCode: ""
})

const formDataRules = {
  mtCode: [
    {
      required: true,
      trigger: "change",
      message: "请选择所属分类！",
    },
  ],
  dictName: [
    {
      required: true,
      trigger: "change",
      message: "请输入字典名称！",
    },
  ],
  dictCode: [
    {
      required: true,
      trigger: "change",
      message: "请输入字典编号！",
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
  dictDetail(row.value.id).then((res) => {
    Object.assign(formData, res.data)
  })
}

function submitConfirm() {
  proxy.$refs.makerForm.validate((valid) => {
    if (valid) {
      loading.value = true
      const ajaxFn = row.value ? dictModify : dictCreate
      const params = {
        ...formData
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

function createCate() {
  emit("createCate")
}

defineExpose({ init })
</script>

<style lang="scss" scoped>
.dialog .el-dialog .sso-front-table-container {
  height: 400px !important;
  .form-wrapper {
    height: 400px !important;
  }
}
</style>
