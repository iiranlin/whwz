import {createApp, h, ref} from 'vue'
import reviewerWorkflow from '@/components/reviewerDialog'
import { workflowUserList, taskNextFlowNode } from '@/api/workflow'
import ElementPlus, { ElLoading } from 'element-plus'
import SvgIcon from '@/components/SvgIcon'
import { getCookie } from '@/utils/auth'

let loadingWorkflow
const reviewerDialog = async (options) => {
  try {
    const {billId, billIdList, billType, urlType = true} = options
    const multiple = options.multiple !== undefined ? options.multiple : true
    loadingWorkflow = ElLoading.service({lock: true, background: "rgba(255, 255, 255, 0.7)"})
    const apiUrl = urlType?workflowUserList:taskNextFlowNode
    const res = await apiUrl({ billId, billIdList, billType, deptId: getCookie('unitCode')})
    loadingWorkflow.close()
    const assigneeList = res.data || []
    if (assigneeList.length === 1 && urlType) {
      let auditUserId = ''
      if (res.data[0]) {
        auditUserId = res.data[0].id
      }
      options.success({auditUserId})
    } else {
      const container = document.createElement('div')
      document.body.appendChild(container)

      const app = createApp({
        setup() {
          const workflowRef = ref()
          const onMounted = () => {
            setTimeout(() => {
              workflowRef.value.init(assigneeList)
            }, 0)
          }
          return () => h(reviewerWorkflow, {
            ref: workflowRef,
            onVnodeMounted: onMounted,
            multiple,
            urlType,
            success: (assignee) => {
              options.success(assignee)
            },
            remove: () => {
              app.unmount()
              container.remove()
            }
          })
        }
      })

      app.component('svg-icon', SvgIcon)
      app.use(ElementPlus,{
        namespace: 'ep',
      })
      app.mount(container)
    }
  } catch (error) {
    loadingWorkflow.close()
  }
}
export default reviewerDialog