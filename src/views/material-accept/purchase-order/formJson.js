import { statusArr } from '@/utils/dictionary'
export const formJson = [
  { prop: 'spdCode', label: '采购订单号', type: 'input', labelWidth: '110' },
  { prop: 'suName', label: '供应商名称', type: 'input', labelWidth: '110' },
  {prop: 'apunitCode', label: '申请单位', type: 'select', selectData: null,labelWidth: '110',isShow:false},
  {prop: 'plantCode', label: '用料地区', type: 'select', selectData: null,labelWidth: '110'},
  { prop: 'matlCode', label: '物资编码', type: 'input', labelWidth: '110' },
  { prop: 'matlName', label: '物资名称', type: 'input', labelWidth: '110' },
  { prop: 'matlType', label: '规格型号', type: 'input', labelWidth: '110' },
  { prop: 'makeDate', label: '制定日期', type: 'date', labelWidth: '110' },
]
export const formJson2 = [
  { prop: 'spdCode', label: '采购订单号', type: 'input', labelWidth: '110' },
  { prop: 'suName', label: '供应商名称', type: 'input', labelWidth: '110' },
  {prop: 'plantCode', label: '用料地区', type: 'select', selectData: null,labelWidth: '110'},
  { prop: 'matlCode', label: '物资编码', type: 'input', labelWidth: '110' },
  { prop: 'matlName', label: '物资名称', type: 'input', labelWidth: '110' },
  { prop: 'matlType', label: '规格型号', type: 'input', labelWidth: '110' },
  { prop: 'makeDate', label: '制定日期', type: 'date', labelWidth: '110' },
]