<template>
    <div v-if="isRead">
        <process-viewer :key="`designer-${loadIndex}`" :style="'height:' + height" :xml="xmlData" />
    </div>
    <div class="pro-vier" v-else>
        <el-table ref="elTable" style="width:100%;margin-bottom: 20px;" max-height="300px" :data="dataList" border fit
            stripe>
            <el-table-column type="index" align="center" label="序号" width="55"></el-table-column>
            <el-table-column prop="unitName" align="center" label="单位"></el-table-column>
            <el-table-column prop="userName" align="center" label="操作人"></el-table-column>
            <el-table-column prop="createTime" align="center" label="开始时间">
                <template #default="{ row }">
                    {{ filterTime(row.createTime) }}
                </template>
            </el-table-column>
            <el-table-column prop="auditTime" align="center" label="结束时间">
                <template #default="{ row }">
                    {{ filterTime(row.auditTime) }}
                </template>
            </el-table-column>
            <el-table-column prop="statusName" align="center" label="状态">
            </el-table-column>
            <el-table-column prop="commentMsg" align="center" label="审批意见"></el-table-column>
        </el-table>
        <div v-if="hasWorkflow === 1">
            <h3 class="process-title">审核流程图</h3>
            <div class="color-tips">
                <span v-for="item in colorTips" :key="item.text"
                    :style="`border: 1px solid ${item.backColor}; backgroundColor: ${item.color};`">
                    {{ item.text }}
                </span>
            </div>
            <process-viewer :key="`designer-${loadIndex}`" :style="'height:' + height" :xml="xmlData"
                :isShowCommentList="isShowCommentList" :allCommentList="allCommentList" :finishedInfo="finishedInfo" />
        </div>

    </div>
</template>
<script setup name="processViewr">
import { ref, reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import ProcessViewer from '@/components/ProcessViewer'
import { workFlowProcessViewer, categoryBpmnXmlModel, historyList } from "@/api/workflow/category"
import { parseTime } from '@/utils/generalMethod'

const route = useRoute()

// 替代 mixin 的 filterTime 过滤器
function filterTime(value) {
    if (value) {
        return parseTime(value, '{y}-{m}-{d} {h}:{i}:{s}')
    } else {
        return ''
    }
}

const isRead = ref(false)
const isShowCommentList = ref(true)
const allCommentList = ref([])
const finishedInfo = reactive({
    finishedSequenceFlowSet: [],
    finishedTaskSet: [],
    unfinishedTaskSet: [],
    rejectedTaskSet: []
})
const dataList = ref([])
const xmlData = ref(undefined)
const hasWorkflow = ref(false)
const height = ref('500px')
const loadIndex = ref(0)
const colorTips = [
    {
        text: '已通过',
        color: '#e5f4dd',
        backColor: '#4eb819'
    },
    {
        text: '审核中',
        color: '#e0eefc',
        backColor: '#409eff',
    },
    {
        text: '待审核',
        color: '#fff',
        backColor: '#000'
    },
    {
        text: '不通过',
        color: '#fee9e9',
        backColor: '#f56c6c'
    },
]

async function loadData(billId) {
    const res = await historyList({ billId: billId })
    const { data: { recordList, nodeList, hasWorkflow: hw } } = res
    dataList.value = recordList
    hasWorkflow.value = hw
    allCommentList.value = nodeList?.filter(i => i.assigneeId) || [];
    if (hasWorkflow.value === 1) {
        getWorkFlowProcessViewer(billId)
    }
}

async function loadXmlData(mid) {
    try {
        categoryBpmnXmlModel(mid).then(res => {
            if (res?.code === 0) {
                let data = res?.data || ''
                if (data) {
                    xmlData.value = data;
                }
            } else {
                loadIndex.value = 0
                console.error(res.message);
            }
        })
    } catch (e) {
        console.error('e', e);
    }
}

async function getWorkFlowProcessViewer(billId = '') {
    try {
        workFlowProcessViewer(billId).then(res => {
            if (res?.code === 0) {
                let data = res?.data || ''
                if (data) {
                    xmlData.value = data.bpmnXml;
                    finishedInfo.finishedTaskSet = data.finishedTaskSet;
                    finishedInfo.unfinishedTaskSet = data.unfinishedTaskSet;
                    finishedInfo.rejectedTaskSet = data.rejectedTaskSet;
                    finishedInfo.finishedSequenceFlowSet = data.finishedSequenceFlowSet;
                    finishedInfo.stopTaskSet = data.stopTaskSet;
                    loadIndex.value = billId;
                }
            } else {
                loadIndex.value = 0
                console.error(res.message);
            }
        })
    } catch (e) {
        console.error('e', e);
    }
}

onMounted(() => {
    const { mid, bid } = route.query
    xmlData.value = ''
    hasWorkflow.value = ''
    Object.assign(finishedInfo, {
        finishedSequenceFlowSet: [],
        finishedTaskSet: [],
        unfinishedTaskSet: [],
        rejectedTaskSet: [],
        stopTaskSet: []
    })
    if (!!bid) {
        isRead.value = false
        loadData(bid)
        return
    }
    if (!!mid) {
        isRead.value = true
        loadXmlData(mid)
    }
})
</script>
<style lang="scss">
.pro-vier {
    overflow-y: auto;
    height: 100%;
}

.color-tips {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 10px;

    span {
        height: 30px;
        width: 80px;
        color: #000;
        text-align: center;
        line-height: 30px;
        border-radius: 3px;
        margin-right: 10px;
    }
}
</style>
