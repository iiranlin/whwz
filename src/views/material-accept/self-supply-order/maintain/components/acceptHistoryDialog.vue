<!-- 验收历史弹窗（订单明细行内查看） -->
<template>
  <ep-dialog title="验收历史" iconTitle="form" v-model="visible" width="1000px" top="5vh" append-to-body v-loading="loading">
    <el-steps direction="vertical" :active="1" v-if="dataList.length">
      <el-step v-for="(item, index) in dataList" :key="item.acId || index" :status="index == 0 ? '' : 'wait'">
        <template #icon>
          <span class="step-index">{{ index + 1 }}</span>
        </template>
        <template #title>
          <span :style="{ color: CheckStatusMap.getColor(item.acceptanceFlag) }">{{ CheckStatusMap.getName(item.acceptanceFlag) }}</span>
          <span class="step-title-date">{{ parseTime(item.acceptanceDate) }}</span>
        </template>
        <template #description>
          <el-row :gutter="10">
            <el-col :span="8">
              <label class="step-label">验收人：</label>
              <span>{{ item.userName }}</span>
            </el-col>
            <el-col :span="8">
              <label class="step-label">验收级别：</label>
              <span>{{ item.acceptanceLevel }}</span>
            </el-col>
            <el-col :span="8">
              <label class="step-label">验收数量：</label>
              <span>{{ item.acceptanceNumber }}</span>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="8">
              <label class="step-label">品牌相符标志：</label>
              <span>{{ ['相符', '不符'][item.brandFlag] }}</span>
            </el-col>
            <el-col :span="8">
              <label class="step-label">外观标志：</label>
              <span>{{ ['完好', '破损'][item.facadeFlag] }}</span>
            </el-col>
            <el-col :span="8">
              <label class="step-label">验收说明：</label>
              <span>{{ item.comments }}</span>
            </el-col>
          </el-row>
          <el-row v-for="t in item.files" :key="t.fileId">
            <el-col :span="24">
              <div>
                <label class="step-label" style="float: left;">{{ imageType[t.type] }}：</label>
                <el-image fit="cover" style="width: 100px; height: 100px;" :src="t.fileUrl"
                  :preview-src-list="[t.fileUrl]" preview-teleported />
              </div>
            </el-col>
          </el-row>
        </template>
      </el-step>
    </el-steps>
    <div v-else style="text-align: center;">暂无数据</div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="visible = false" class="cancel-btn"><svg-icon icon-class="cancel" />&nbsp;关闭</el-button>
      </div>
    </template>
  </ep-dialog>
</template>

<script setup name="accept-history-dialog">
import { parseTime } from '@/utils/generalMethod'
import { getCookie } from '@/utils/auth'
import { getAcceptanceHistory, getFtpPic } from '@/api/warehouse/selfSupplyOrder'
import { CheckStatusMap } from './utils'
const { proxy } = getCurrentInstance()

const visible = ref(false)
const loading = ref(false)
const dataList = ref([])

const imageType = {
  1: '技术证件',
  2: '产品',
  3: '验收过程',
  11: '技术证件缩略图',
  22: '产品缩略图',
  33: '验收过程缩略图',
}

function show(row) {
  visible.value = true
  getInvoiceList(row)
}

async function getInvoiceList(row) {
  loading.value = true
  try {
    const { data } = await getAcceptanceHistory({
      railwayCode: getCookie('railwayCode'),
      pddId: row.pddId,
    })
    const list = data || []
    for (let index = 0; index < list.length; index++) {
      const files = list[index]['files'] || []
      for (let fileIndex = 0; fileIndex < files.length; fileIndex++) {
        const file = files[fileIndex]
        const url = await proxy.$download.preview(getFtpPic, { railwayCode: getCookie('railwayCode'), fileName: file.fileName })
        file['fileUrl'] = url
      }
    }
    dataList.value = list
  } catch (e) {
    dataList.value = []
  } finally {
    loading.value = false
  }
}

defineExpose({
  show,
})
</script>
<style lang="scss" scoped>
.step-index {
  width: 24px;
  height: 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #409eff;
  color: #fff;
  font-size: 13px;
}
.step-title-date {
  color: #b4b4b4;
  margin-left: 10px;
  font-size: 14px;
}
.step-label {
  color: #002748;
  font-weight: 500;
}
</style>
