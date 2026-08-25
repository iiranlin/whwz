import { shareStatusArr, payStatusArr } from '@/utils/dictionary'
export const formJson = [
  {prop: 'invoiceCode', label: '发票号', type: 'input'},
  {prop: 'supplierName', label: '供应商名称', type: 'input'},
  {prop: 'issueTime', label: '开票日期', type: 'date'},
  {prop: 'useUnitName', label: '用料单位名称', type: 'input'},
  {prop: 'status', label: '报账状态', type: 'select', selectData: shareStatusArr},
  {prop: 'payStatus', label: '付款状态', type: 'select', selectData: payStatusArr},
]