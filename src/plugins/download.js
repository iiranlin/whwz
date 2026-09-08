import axios from 'axios'
import { ElLoading, ElMessage } from 'element-plus'
import { saveAs } from 'file-saver'
import { getToken } from '@/utils/auth'
import errorCode from '@/utils/errorCode'
import { blobValidate } from '@/utils/generalMethod'
import request from '@/utils/request'

const baseURL = import.meta.env.VITE_APP_BASE_API
let downloadLoadingInstance

export default {
  name(url, params) {
    downloadLoadingInstance = ElLoading.service({ text: "正在下载数据，请稍候", background: "rgba(0, 0, 0, 0.7)", })
    request({
      url: url,
      method: 'get',
      params,
      responseType: 'blob',
    }).then(async (res) => {
      const header = res.headers['content-disposition'] || res.headers['Content-Disposition']
      // 90-导出优化：存在下载文件名头才按文件保存；否则后端返回的是业务失败 JSON，解析 message 弹出真实原因
      if (header) {
        const blob = new Blob([res.data])
        this.saveAs(blob, decodeURIComponent(header.split('filename=')[1]))
      } else {
        const resText = await res.data.text()
        const rspObj = JSON.parse(resText || '{}')
        const errMsg = rspObj.message || rspObj.msg || errorCode[rspObj.code] || errorCode['default']
        ElMessage.error(errMsg)
      }
      downloadLoadingInstance.close()
    }).catch(async (r) => {
      console.error(r)
      // 90-导出优化：http 层失败但响应体是 JSON 时，尽量解析后端真实文案（如"导出数据为空"业务提示）
      const resp = r.response
      if (resp && resp.data && typeof resp.data.text === 'function') {
        try {
          const resText = await resp.data.text()
          const rspObj = JSON.parse(resText || '{}')
          const errMsg = rspObj.message || rspObj.msg || errorCode[rspObj.code] || errorCode['default']
          ElMessage.error(errMsg)
        } catch (e) {
          ElMessage.error('下载文件出现错误，请联系管理员！')
        }
      } else {
        ElMessage.error('下载文件出现错误，请联系管理员！')
      }
      downloadLoadingInstance.close()
    })
  },
  preview(url, params) {
    return new Promise(resolve => {
      request({
        url: url,
        method: 'get',
        params,
        responseType: 'blob',
      }).then((res) => {
        const blob = new Blob([res.data])
        resolve(window.URL.createObjectURL(blob))
      })
    })
  },
  resource(resource) {
    var url = baseURL + "/common/download/resource?resource=" + encodeURIComponent(resource)
    axios({
      method: 'get',
      url: url,
      responseType: 'blob',
      headers: { 'Authorization': getToken() }
    }).then((res) => {
      const isBlob = blobValidate(res.data)
      if (isBlob) {
        const blob = new Blob([res.data])
        this.saveAs(blob, decodeURIComponent(res.headers['download-filename']))
      } else {
        this.printErrMsg(res.data)
      }
    })
  },
  zip(url, name) {
    var url = baseURL + url
    downloadLoadingInstance = ElLoading.service({ text: "正在下载数据，请稍候", background: "rgba(0, 0, 0, 0.7)", })
    axios({
      method: 'get',
      url: url,
      responseType: 'blob',
      headers: { 'Authorization': getToken() }
    }).then((res) => {
      const isBlob = blobValidate(res.data)
      if (isBlob) {
        const blob = new Blob([res.data], { type: 'application/zip' })
        this.saveAs(blob, name)
      } else {
        this.printErrMsg(res.data)
      }
      downloadLoadingInstance.close()
    }).catch((r) => {
      console.error(r)
      ElMessage.error('下载文件出现错误，请联系管理员！')
      downloadLoadingInstance.close()
    })
  },
  saveAs(text, name, opts) {
    saveAs(text, name, opts)
  },
  async printErrMsg(data) {
    const resText = await data.text()
    const rspObj = JSON.parse(resText)
    const errMsg = errorCode[rspObj.code] || rspObj.msg || errorCode['default']
    ElMessage.error(errMsg)
  }
}

