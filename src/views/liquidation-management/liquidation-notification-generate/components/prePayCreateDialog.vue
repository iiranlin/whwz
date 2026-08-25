<template>
  <ep-dialog title="生成通知单" iconTitle="form" v-model="visible" width="900px" top="5vh" append-to-body>
    <div class="sso-front-table-container app-container">
      <div class="app-container-div-p">
        <div v-html="dataHtml"></div>
      </div>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="visible = false" class="cancel-btn"><svg-icon icon-class="cancel" />&nbsp;关闭</el-button>
      </div>
    </template>
  </ep-dialog>
</template>

<script setup>
import { getCookie } from '@/utils/auth'
import { prePayNoticeCreate, prePayNoticeCreateAll } from '@/api/warehouse/prePay'
const { proxy } = getCurrentInstance()

const visible = ref(false)
const dataHtml = ref('')

// 声明触发的事件（可选，增强类型校验）
const emit = defineEmits(['success']);

const getPrePayNoticeCreate = (params, apiUrl) => {
  const warehouseGetYear = getCookie('warehouseGetYear')
  const yearMonth = JSON.parse(warehouseGetYear || '{}').yearMonth
  proxy.$modal.loading()
  apiUrl(params, yearMonth).then(({data, message}) => {
    dataHtml.value = data || message || ''
    emit('success')
  }).finally( (a) => {
    proxy.$modal.closeLoading()
  })
}

const show = (type, data, queryParams) => {
  visible.value = true
  dataHtml.value = '暂无数据'
  if(type == 'payCreate'){
    const params = data.map( a => {return {checkStatus: a.checkStatus, id: a.id}})
    getPrePayNoticeCreate(params, prePayNoticeCreate)
  }else if(type == 'payCreateAll'){
    getPrePayNoticeCreate(queryParams, prePayNoticeCreateAll)
  }
}

defineExpose({
  show,
})
</script>
<style lang="scss" scoped>
.app-container{
  .app-container-div-p{
    margin: 0 auto;
    p{
      font-size: 16px;
      span{
        color: #0000FF;
      }
    }
  }
}
</style>