<template>
  <div class="upload-file">
    <el-upload
      multiple
      :action="uploadFileUrl"
      :before-upload="handleBeforeUpload"
      :file-list="fileList"
      :data="data"
      :limit="limit"
      :on-error="handleUploadError"
      :on-exceed="handleExceed"
      :on-success="handleUploadSuccess"
      :show-file-list="false"
      :headers="headers"
      class="upload-file-uploader"
      ref="fileUpload"
      v-if="!disabled"
    >
      <!-- 上传按钮 -->
      <el-button :type="buttonType == 'text'?'primary':buttonType" :link="buttonType == 'text'">{{ buttonName }}</el-button>
    </el-upload>
    <!-- 上传提示 -->
    <div class="el-upload__tip" v-if="showTip && !disabled">
      请上传
      <template v-if="fileSize"> 大小不超过 <b style="color: #f56c6c">{{ fileSize }}MB</b> </template>
      <template v-if="fileType"> 格式为 <b style="color: #f56c6c">{{ fileType.join("/") }}</b> </template>
      的文件
    </div>
    <!-- 文件列表 -->
    <transition-group ref="uploadFileList" class="upload-file-list el-upload-list el-upload-list--text" name="el-fade-in-linear" tag="ul" v-if="isShowUploadFile">
      <li :key="file.uid" class="el-upload-list__item ele-upload-list__item-content" v-for="(file, index) in fileList">
        <el-link underline="never" target="_blank" @click="linkclick(file)">
          <span class="el-icon-document"> {{ getFileName(file.fileName) }} </span>
        </el-link>
        <div class="ele-upload-list__item-content-action">
          <el-link underline="never" @click="handleDelete(index, file)" type="danger" v-if="!disabled">&nbsp;删除</el-link>
        </div>
      </li>
    </transition-group>
    <PreviewAttachment ref="previewAttachment"></PreviewAttachment>
  </div>
</template>

<script setup>
import { getToken } from "@/utils/auth"
import Sortable from 'sortablejs'
import { getCookie } from '@/utils/auth'
import { generateUUID } from '@/utils'
import { uploadTypeArr } from '@/utils/dictionary'
import { minioDownload } from "@/api/system/minio"
import PreviewAttachment from '@/components/PreviewAttachment'

const props = defineProps({
  modelValue: [String, Object, Array],
  // 按钮name
  buttonName: {
    type: String,
    default: "选取文件"
  },
  buttonType: {
    type: String,
    default: "primary"
  },
  // 上传接口地址
  action: {
    type: String,
    default: "/common/upload"
  },
  // 上传携带的参数
  data: {
    type: Object
  },
  // 数量限制
  limit: {
    type: Number,
    default: 5
  },
  // 大小限制(MB)
  fileSize: {
    type: Number,
    default: 5
  },
  // 文件类型, 例如['png', 'jpg', 'jpeg']
  fileType: {
    type: Array,
    default: () => ["doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt", "pdf", "xml"]
  },
  // 是否显示提示
  isShowTip: {
    type: Boolean,
    default: true
  },
  // 禁用组件（仅查看文件）
  disabled: {
    type: Boolean,
    default: false
  },
  // 拖动排序
  drag: {
    type: Boolean,
    default: true
  },
  // 是否显示上传列表
  isShowUploadFile: {
    type: Boolean,
    default: true
  },
  row: {
    type: Object,
    default: null
  },
  limitPrompt: {
    type: String,
    default: ""
  },
})

const { proxy } = getCurrentInstance()
const emit = defineEmits()
const number = ref(0)
const uploadList = ref([])
const baseUrl = import.meta.env.VITE_APP_BASE_API
const uploadFileUrl = ref(import.meta.env.VITE_APP_BASE_API + props.action) // 上传文件服务器地址
const headers = ref({ Authorization: getToken() })
const fileList = ref([])
const showTip = computed(
  () => props.isShowTip && (props.fileType || props.fileSize)
)

watch(() => props.modelValue, val => {
  if (val) {
    let temp = 1
    // 首先将值转为数组
    const list = Array.isArray(val) ? val : props.modelValue.split(',')
    // 然后将数组转为对象数组
    fileList.value = list.map(item => {
      if (typeof item === "string") {
        item = { name: item, url: item }
      }
      item.uid = item.uid || new Date().getTime() + temp++
      return item
    })
  } else {
    fileList.value = []
    return []
  }
},{ deep: true, immediate: true })

// 上传前校检格式和大小
function handleBeforeUpload(file) {
  // 校检文件类型
  if (props.fileType.length) {
    const fileName = file.name.split('.')
    const fileExt = fileName[fileName.length - 1]
    const isTypeOk = props.fileType.indexOf(fileExt) >= 0
    if (!isTypeOk) {
      proxy.$modal.msgError(`文件格式不正确，请上传${props.fileType.join("/")}格式文件!`)
      return false
    }
  }
  // 校检文件名长度
  if (file.name.length > 30) {
    proxy.$modal.msgError('文件名长度，不能超过30个字符!')
    return false
  }
  // 校检文件名是否包含特殊字符
  if (file.name.includes(',')) {
    proxy.$modal.msgError('文件名不正确，不能包含英文逗号!')
    return false
  }
  // 校检文件大小
  if (props.fileSize) {
    const isLt = file.size / 1024 / 1024 < props.fileSize
    if (!isLt) {
      proxy.$modal.msgError(`上传文件大小不能超过 ${props.fileSize} MB!`)
      return false
    }
  }
  proxy.$modal.loading("正在上传文件，请稍候...")
  number.value++
  return true
}

// 文件个数超出
function handleExceed() {
  proxy.$modal.msgError(`${props.limitPrompt? props.limitPrompt + '，':''}上传文件数量不能超过 ${props.limit} 个!`)
}

// 上传失败
function handleUploadError(err) {
  proxy.$modal.msgError("上传文件失败")
  proxy.$modal.closeLoading()
}

// 上传成功回调
function handleUploadSuccess(res, file) {
  if (res.code === 0) {
    uploadList.value.push({
      acceptanceLevel: props.row?.acceptancePresentLevel,
      fileFormerName: res.data?.fileName,
      fileName: res.data?.originFileName,
      makerCode: getCookie('userCode'),
      makerName: getCookie('userName'),
      pdbId: props.row?.pdbId,
      type: props.row?.type,
      unitCode: getCookie('unitCode'),
      unitName: getCookie('unitName'),
      uploadDate: new Date(),
      uid: generateUUID()
    })
    uploadedSuccessfully()
    emit("uploadSuccess", res, file)
  } else {
    number.value--
    proxy.$modal.closeLoading()
    proxy.$modal.msgError(res.message)
    proxy.$refs.fileUpload.handleRemove(file)
    uploadedSuccessfully()
  }
}

// 删除文件
function handleDelete(index, file) {
  fileList.value.splice(index, 1)
  emit("deleteSuccess", file)
  emit("update:modelValue", fileList.value)
}

// 上传结束处理
function uploadedSuccessfully() {
  if (number.value > 0 && uploadList.value.length === number.value) {
    fileList.value = fileList.value.concat(uploadList.value)
    uploadList.value = []
    number.value = 0
    emit("update:modelValue", fileList.value)
    proxy.$modal.closeLoading()
  }
}

// 获取文件名称
function getFileName(name) {
  // 如果是url那么取最后的名字 如果不是直接返回
  if (name.lastIndexOf("/") > -1) {
    return name.slice(name.lastIndexOf("/") + 1)
  } else {
    return name
  }
}

// 对象转成指定字符串分隔
function listToString(list, separator) {
  let strs = ""
  separator = separator || ","
  for (let i in list) {
    if (list[i].url) {
      strs += list[i].url + separator
    }
  }
  return strs != '' ? strs.substr(0, strs.length - 1) : ''
}

async function linkclick(file) {
  const type = file.fileName.substring(file.fileName.lastIndexOf('.') + 1)
  if(uploadTypeArr.includes(type)){
    const url = await proxy.$download.preview(minioDownload, {fileName: file.fileFormerName})
    proxy.$refs.previewAttachment.show(url, type)
  }else{
    proxy.$download.name(minioDownload, {fileName: file.fileFormerName})
  }
}

// 初始化拖拽排序
onMounted(() => {
  if (props.drag && !props.disabled) {
    nextTick(() => {
      const element = proxy.$refs.uploadFileList?.$el || proxy.$refs.uploadFileList
      Sortable.create(element, {
        ghostClass: 'file-upload-darg',
        onEnd: (evt) => {
          const movedItem = fileList.value.splice(evt.oldIndex, 1)[0]
          fileList.value.splice(evt.newIndex, 0, movedItem)
          emit('update:modelValue', fileList.value)
        }
      })
    })
  }
})
</script>
<style scoped lang="scss">
.file-upload-darg {
  opacity: 0.5;
  background: #c8ebfb;
}
.upload-file-uploader {
  margin-bottom: 5px;
}
.upload-file-list .el-upload-list__item {
  border: 1px solid #e4e7ed;
  line-height: 2;
  margin-bottom: 10px;
  position: relative;
  transition: none !important;
}
.upload-file-list .ele-upload-list__item-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: inherit;
}
.ele-upload-list__item-content-action .el-link {
  margin-right: 10px;
}
</style>
