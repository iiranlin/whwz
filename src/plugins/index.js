import cache from './cache'
import modal from './modal'
import download from './download'
import reviewerDialog from './reviewerDialog'
import flow from './flow'
import tab from './tab'
export default function installPlugins(app){
  app.use(flow)
  // 缓存对象
  app.config.globalProperties.$cache = cache
  // 模态框对象
  app.config.globalProperties.$modal = modal
  // 下载文件
  app.config.globalProperties.$download = download
  // 审批人
  app.config.globalProperties.$reviewerDialog = reviewerDialog
  // 页签操作
  app.config.globalProperties.$tab = tab
}
