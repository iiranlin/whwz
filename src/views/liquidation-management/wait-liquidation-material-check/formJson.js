import { isUploadInvoiceArr, statusArr } from '@/utils/dictionary'
export const matlFormJson = [
  {prop: 'ibBillCode', label: '入库单号', type: 'input'},
  {prop: 'spdCode', label: '采购订单号', type: 'input'},
  {prop: 'isUploadInvoice', label: '是否上传发票', type: 'select', selectData: isUploadInvoiceArr},
  {prop: 'matlCode', label: '物资编码', type: 'input'},
  {prop: 'matlName', label: '物资名称', type: 'input'},
  {prop: 'matlType', label: '规格型号', type: 'input'},
  {prop: 'checkStatus', label: '是否核对', type: 'select', selectData: statusArr},
]