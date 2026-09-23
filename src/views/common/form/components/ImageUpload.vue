<template>
  <div>
    <div v-if="mode === 'DESIGN'">
      <div class="design">
        <i class="el-icon-plus"></i>
      </div>
      <p>{{ placeholder }} {{ sizeTip }}</p>
    </div>
    <div v-else>
      <el-upload :file-list="_value" action="#" :limit="maxSize" with-credentials :multiple="maxSize > 0" :data="uploadParams"
                 list-type="picture-card" :auto-upload="false" :before-upload="beforeUpload">
        <i #default class="el-icon-plus"></i>
        <div #file="{file}">
          <img class="el-upload-list__item-thumbnail" :src="file.url" alt="">
          <span class="el-upload-list__item-actions">
            <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
              <i class="el-icon-zoom-in"></i>
            </span>
            <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleDownload(file)">
              <i class="el-icon-download"></i>
            </span>
            <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleRemove(file)">
              <i class="el-icon-delete"></i>
            </span>
          </span>
        </div>
        <div #tip class="el-upload__tip">{{ placeholder }} {{ sizeTip }}</div>
      </el-upload>
    </div>
  </div>
</template>

<script setup name="ImageUpload">
import { computed, reactive } from 'vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  value: {
    type: Array,
    default: () => {
      return []
    }
  },
  placeholder: {
    type: String,
    default: '请选择'
  },
  maxSize: {
    type: Number,
    default: 5
  },
  maxNumber: {
    type: Number,
    default: 10
  },
  enableZip: {
    type: Boolean,
    default: true
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
  return props.maxSize > 0 ? `| 每张图不超过${props.maxSize}MB` : ''
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
.design {
  i {
    padding: 10px;
    font-size: xx-large;
    // background: white;
    border: 1px dashed #8c8c8c;
  }
}
:deep(.el-upload--picture-card){
  width: 80px;
  height: 80px;
  line-height: 87px;
}
:deep(.el-upload-list__item){
  width: 80px;
  height: 80px;
  .el-upload-list__item-actions{
    &> span+span{
      margin: 1px;
    }
  }
}
</style>
