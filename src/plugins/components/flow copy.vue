<template>
    <el-dialog v-loading="loading" modal-class="flow-el-dialog" top="15vh" :title="title" close-on-click-modal
        v-model="visible" :fullscreen="fullscreen" append-to-body destroy-on-close width="80%" @close="handleClose">
        <template #header="{ close, titleId, titleClass }">
            <div class="flow-header">
                <div class="flow-header-title">{{ title }}</div>
                <div class="flow-header-btns">
                    <div v-if="!fullscreen" class="flow-btn" @click.stop="() => fullscreen = true"><FullScreen /></div>
                    <div v-else class="flow-btn" @click.stop="() => fullscreen = false"><Rank /></div>
                    <div class="flow-btn" @click.stop="handleClose"><Close /></div>
                </div>
            </div>
        </template>
        <iframe id="flow-wind-dialog" :src="iframeUrl" @load="handleLoad" frameborder="0" :height="height" width="100%"></iframe>
    </el-dialog>
</template>
<script setup name="FlowDialog">
import { ref, computed } from 'vue'
import { ElDialog, ElIcon } from 'element-plus'
import 'element-plus/theme-chalk/src/index.scss'
import { FullScreen, Rank, Close } from '@element-plus/icons-vue'

const props = defineProps({
    options: {
        type: Object,
        default: () => ({})
    }
})

const fullscreen = ref(false)
const loading = ref(false)
const visible = ref(false)
const title = ref('审核历史')
const iframeUrl = ref('')

let resolveRef = null
let rejectRef = null

const height = computed(() => {
    if (fullscreen.value) {
        return `${document.body.clientHeight - 100}px`
    }
    return '600px'
})

function open() {
    loading.value = true
    fullscreen.value = false
    initData()
    return new Promise((resolve, reject) => {
        resolveRef = resolve
        rejectRef = reject
    })
}

function initData() {
    const { mid = '', bid = '' } = props.options
    iframeUrl.value = `/integrated-manage/bpmn/processViewr?mid=${mid}&bid=${bid}`
    visible.value = true
}

function handleClose() {
    visible.value = false
    if (rejectRef) {
        rejectRef(new Error('取消操作'))
        resolveRef = null
        rejectRef = null
    }
}

function handleLoad() {
    loading.value = false
    const iframeEl = document.getElementById('flow-wind-dialog')
    const iframeDoc = iframeEl.contentDocument || iframeEl.contentWindow.document
    const style = iframeDoc.createElement('style')
    style.textContent = `
            #app #appContainer {
            height: 100% !important;
            }
            `
    iframeDoc.head.appendChild(style)
    console.info(iframeDoc)
}

defineExpose({ open })
</script>
<style lang="scss">
.flow-el-dialog {
    background-color: rgba(0, 0, 0, 0.5);
    position: absolute;
    left: 0;
    top: 0;
    height: 100vh;
    width: 100%;
    overflow: hidden;
}
.flow-el-dialog .is-fullscreen .el-dialog__body {
    height: calc(100% - 60px);
}
.flow-el-dialog .el-dialog__header {
    padding: 0 !important;
}
.flow-el-dialog .flow-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    background-color: #fff !important;
    background: url('@/assets/images/login_top.jpg') no-repeat;
    background-size: 66% 101%;
    background-position: right;
    border-bottom: 1px solid #cccccc;
    color: #002748 !important;
    padding: 10px;
}
.flow-el-dialog .flow-header .flow-header-title{

}
.flow-el-dialog .flow-header .flow-header-btns {
    width: 40%;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
}
.flow-el-dialog .flow-header .flow-header-btns .flow-btn {
    padding: 5px;
    box-sizing: border-box;
    width: 30px;
    cursor: pointer;
    color: #ccc;
}
.flow-el-dialog .flow-header .flow-header-btns .flow-btn:hover {
    color: #ccc;
}
.flow-el-dialog .is-fullscreen {
    height: 100vh;
}
</style>
