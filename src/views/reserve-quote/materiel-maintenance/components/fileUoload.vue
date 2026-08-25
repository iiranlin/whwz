<template>
    <ep-dialog :title="title" iconTitle="form" v-model="fileVisible" width="50vw" top="5vh" append-to-body height="60vh"
        :close-on-press-escape="false" :close-on-click-model="false">
        <div class="sso-front-table-container">
            <el-upload class="upload-demo" drag :auto-upload="false" :on-remove="handleRemove" :on-change="handleChange"
                ref="uploadRef" :limit="1" :on-exceed="handleExceed" list-type="text">
                <el-icon style="font-size: 50px;"><upload-filled /></el-icon>
                <div class="el-upload__text">请上传文件</div>
            </el-upload>
        </div>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="fileVisible = false" class="cancel-btn"><svg-icon
                        icon-class="cancel" />&nbsp;关闭</el-button>
                <el-button type="primary" class="determine-btn" @click="saveBtn"><svg-icon
                        icon-class="determine" />&nbsp;确定</el-button>
            </div>
        </template>
    </ep-dialog>
</template>

<script setup>
import {
    normListImport,
} from '@/api/reserve-quote/materiel-maintenance'
import { genFileId } from 'element-plus';
import { ref } from 'vue';

const { proxy } = getCurrentInstance()
const emit = defineEmits(['handleQuery']);
const props = defineProps({

})

const uploadRef = ref()
const uploadFile = ref(null) // 改用 ref 声明


const title = ref('文件上传')
const fileVisible = defineModel({ default: false })

const fileList = ref([

])


const handleRemove = (file, uploadFiles) => {
    console.log(file, uploadFiles)
}

const handleChange = (file) => {
    fileList.value = [file]
    uploadFile.value = file.raw // 正确赋值
}
const handleExceed = (files) => {
    uploadRef.value.clearFiles()
    const file = files[0]
    file.uid = genFileId()
    uploadFile.value = file.raw // 确保超出限制时也能获取文件
    uploadRef.value.handleStart(file)
}




const saveBtn = async () => {
    // 验证文件是否存在
    if (!uploadFile.value) {
        console.error('请先选择文件')
        return
    }

    const formData = new FormData()
    formData.append('file', uploadFile.value)

    await normListImport(formData)
    fileVisible.value = false
    emit('handleQuery')
}



</script>
<style scoped>
.upload-demo {
    width: 90%;
    margin: 0 auto;
}

.el-upload__text {
    margin-top: 10px;
    font-size: 16px;
}
</style>