import request from '@/utils/request'
import { saveAs } from 'file-saver'

const BASE = import.meta.env.VITE_APP_BASE_BASE_SERVICE

// 异步导出任务分页列表
export function exportTaskMyPage(params) {
  return request({
    url: `${BASE}/exportTask/myPage`,
    method: 'get',
    params
  })
}

// 下载导出文件（minio）
export function downloadFileUrl(row) {
  return request({
    url: `${BASE}/minio/download`,
    method: 'get',
    params: { filePath: row.filePath, fileName: row.fileName },
    responseType: 'blob'
  }).then(res => {
    const blob = new Blob([res.data])
    saveAs(blob, row.fileName || 'download')
  })
}
