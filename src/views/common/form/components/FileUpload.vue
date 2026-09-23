<template>
  <div>
    <div v-if="mode === 'DESIGN'">
      <el-button size="small" icon="el-icon-paperclip" round>选择文件</el-button>
      <ellipsis :row="1" :content="placeholder + sizeTip" hoverTip #tip class="el-upload__tip"/>    </div>
    <div v-else>
      <el-upload :file-list="_value" action="#" :limit="maxSize" with-credentials :multiple="maxSize > 0" :data="uploadParams"
                 :auto-upload="false" :before-upload="beforeUpload">
        <el-button size="small" icon="el-icon-paperclip" round>选择文件</el-button>
        <ellipsis :row="1" :content="placeholder + sizeTip" hoverTip #tip class="el-upload__tip"/>      </el-upload>
    </div>
  </div>
</template>

<script setup name="ImageUpload">
import { computed, reactive } from 'vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  placeholder: {
    type: String,
    default: '请选择'
  },
  value: {
    type: Array,
    default: () => {
      return []
    }
  },
  maxSize: {
    type: Number,
    default: 5
  },
  maxNumber: {
    type: Number,
    default: 10
  },
  fileTypes: {
    type: Array,
    default: () => {
      return []
    }
  },
  mode: {
    type: String,
    default: 'DESIGN'
  },
  required: {
    type: Boolean,
    default: false
  },
})
const emit = defineEmits(['input'])

const _value = computed({
  get() { return props.value },
  set(v) { emit('input', v) }
})

const disabled = false
const uploadParams = reactive({})

const sizeTip = computed(() => {
  if (props.fileTypes.length > 0) {
    return ` | 只允许上传[${String(props.fileTypes).replaceAll(",", "、")}]格式的文件，且单个附件不超过${props.maxSize}MB`
  }
  return props.maxSize > 0 ? ` | 单个附件不超过${props.maxSize}MB` : ''
})

function beforeUpload(file) {
  const alows = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
  if (alows.indexOf(file.type) === -1) {
    ElMessage.warning("存在不支持的图片格式")
  } else if (props.maxSize > 0 && file.size / 1024 / 1024 > props.maxSize) {
    ElMessage.warning(`单张图片最大不超过 ${props.maxSize}MB`)
  } else {
    return true
  }
  return false
}
function handleRemove(file, fileList) {
  console.log(file, fileList);
}
function handlePictureCardPreview(file) {
  console.log(file)
}
function handleDownload(file) {
  console.log(file);
}
</script>

<style lang="scss" scoped>

</style>
