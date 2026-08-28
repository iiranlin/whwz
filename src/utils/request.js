import axios from 'axios'
import { ElMessageBox, ElMessage, ElLoading } from 'element-plus'
import { getToken, setToken, removeToken, getCookie } from '@/utils/auth'
import errorCode from '@/utils/errorCode'
import { tansParams, blobValidate } from '@/utils/generalMethod'
import cache from '@/plugins/cache'
import { saveAs } from 'file-saver'

let downloadLoadingInstance
// 是否显示重新登录
export let isRelogin = { show: false }

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'
// 创建axios实例
const service = axios.create({
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  baseURL: import.meta.env.VITE_APP_BASE_API,
  // 超时
  timeout: 30000
})

// request拦截器
service.interceptors.request.use(config => {
  // 是否需要防止数据重复提交
  const isRepeatSubmit = (config.headers || {}).repeatSubmit === false
  const warehouseGetYear = getCookie('warehouseGetYear') && JSON.parse(getCookie('warehouseGetYear'))
  if (getToken()) {
    config.headers['Authorization'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    config.headers['Yearmonth'] = warehouseGetYear?.yearMonth
    config.headers['Logindate'] = getCookie('warehouseYearMonth')
  }
  // get请求映射params参数
  if (config.method === 'get' && config.params) {
    if(!config.params.hasOwnProperty('yearMonth')){
      config.params.yearMonth = warehouseGetYear?.yearMonth
    }
    config.params.loginDate = config.params.loginDate || getCookie('warehouseYearMonth')
    let url = config.url + '?' + tansParams(config.params)
    url = url.slice(0, -1)
    config.params = {}
    config.url = url
  }
  if (!isRepeatSubmit && (config.method === 'post' || config.method === 'put')) {
    if(config.data){
      if(!config.data.hasOwnProperty('yearMonth')){
        config.data.yearMonth = warehouseGetYear?.yearMonth
      }
      config.data.loginDate = config.data.loginDate || getCookie('warehouseYearMonth')
    }
    const requestObj = {
      url: config.url,
      data: typeof config.data === 'object' ? JSON.stringify(config.data) : config.data,
      time: new Date().getTime()
    }
    const requestSize = Object.keys(JSON.stringify(requestObj)).length // 请求数据大小
    const limitSize = 5 * 1024 * 1024 // 限制存放数据5M
    if (requestSize >= limitSize) {
      console.warn(`[${config.url}]: ` + '请求数据大小超出允许的5M限制，无法进行防重复提交验证。')
      return config
    }
    const sessionObj = cache.session.getJSON('sessionObj')
    if (sessionObj === undefined || sessionObj === null || sessionObj === '') {
      cache.session.setJSON('sessionObj', requestObj)
    } else {
      const s_url = sessionObj.url                // 请求地址
      const s_data = sessionObj.data              // 请求数据
      const s_time = sessionObj.time              // 请求时间
      const interval = 1000                       // 间隔时间(ms)，小于此时间视为重复提交
      if (s_data === requestObj.data && requestObj.time - s_time < interval && s_url === requestObj.url) {
        const message = '数据正在处理，请勿重复提交'
        console.warn(`[${s_url}]: ` + message)
        return Promise.reject(new Error(message))
      } else {
        cache.session.setJSON('sessionObj', requestObj)
      }
    }
  }
  return config
}, error => {
    console.log(error)
    Promise.reject(error)
})

// 响应拦截器
service.interceptors.response.use(res => {
    // 未设置状态码则默认成功状态
    const code = res.data.code || 200
    // 获取错误信息
    const msg = errorCode[code] || res.data.message || errorCode['default']
    // 二进制数据则直接返回
    if (res.request.responseType ===  'blob' || res.request.responseType ===  'arraybuffer') {
      return res
    }
    if (code !== 0) {
      if (code === 401) {
        // 本地无 token 说明本来就没登录，静默 reject，不弹误导性"过期"弹窗
        if (!getToken()) {
          return Promise.reject('未登录')
        }
        // 防重弹窗：多个并行请求同时 401 只弹一次
        if (!isRelogin.show) {
          isRelogin.show = true
          ElMessageBox.confirm('登录状态已过期，您可以继续留在该页面，或者重新登录', '系统提示', { confirmButtonText: '重新登录', cancelButtonText: '取消', type: 'warning' }).then(() => {
            isRelogin.show = false
            removeToken()
            location.href = '/login'
          }).catch(() => {
            isRelogin.show = false
          })
        }
        return Promise.reject('无效的会话，或者会话已过期，请重新登录。')
      } else if (code === 10000) {
        // token 续期：静默更新本地 token 并重放原请求
        const newToken = res.data && res.data.data
        if (newToken) {
          setToken(newToken)
          return service(res.config)
        }
        return Promise.resolve(res.data)
      } else if (code === 10001 || code === 10002) {
        // 初始密码/密码过期：放行交由登录页处理强制改密
        return Promise.resolve(res.data)
      } else if (code === 500) {
        ElMessage({ message: msg, type: 'error' })
        return Promise.reject(new Error(msg))
      } else if (code === 601) {
        ElMessage({ message: msg, type: 'warning' })
        return Promise.reject(new Error(msg))
      } else if (code === 10015) {
        return  Promise.resolve(res.data)
      } else if (code !== 200) {
        ElMessage({ message: msg, type: 'error' })
        return Promise.reject('error')
      } else {
        return  Promise.resolve(res.data)
      }
    }else{
      return  Promise.resolve(res.data)
    }
  },
  error => {
    console.log('err' + error)
    let { message } = error
    if (message == "Network Error") {
      message = "后端接口连接异常"
    } else if (message.includes("timeout")) {
      message = "系统接口请求超时"
    } else if (message.includes("Request failed with status code")) {
      message = "系统接口" + message.substr(message.length - 3) + "异常"
    }
    ElMessage({ message: message, type: 'error', duration: 5 * 1000 })
    return Promise.reject(error)
  }
)

// 通用下载方法
export function download(url, params, filename, config) {
  downloadLoadingInstance = ElLoading.service({ text: "正在下载数据，请稍候", background: "rgba(0, 0, 0, 0.7)", })
  return service.post(url, params, {
    // transformRequest: [(params) => { return tansParams(params) }],
    responseType: 'blob',
    ...config
  }).then(async (data) => {
    const isBlob = blobValidate(data.data)
    if (isBlob) {
      const blob = new Blob([data.data])
      const header = data.headers['content-disposition'] || data.headers['Content-Disposition']
      saveAs(blob, decodeURI(header.split('filename=')[1]))
      ElMessage({ message: "导出成功", type: 'success' })
    } else {
      const resText = await data.data.text()
      const rspObj = JSON.parse(resText)
      const errMsg = errorCode[rspObj.code] || rspObj.msg || errorCode['default']
      ElMessage.error(errMsg)
    }
    downloadLoadingInstance.close()
  }).catch((r) => {
    console.error(r)
    ElMessage.error('下载文件出现错误，请联系管理员！')
    downloadLoadingInstance.close()
  })
}

export default service
