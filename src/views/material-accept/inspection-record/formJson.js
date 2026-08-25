import { statusArr } from '@/utils/dictionary'
export const formJson = [
  { prop: 'spdCode', label: '采购订单号', type: 'input', labelWidth: '110' },
  { prop: 'batchNo', label: '发货批次号', type: 'input', labelWidth: '110' },
  { prop: 'matlCode', label: '物资编码', type: 'input', labelWidth: '110' },
  { prop: 'matlName', label: '物资名称', type: 'input', labelWidth: '110' },
  { prop: 'matlType', label: '规格型号', type: 'input', labelWidth: '110' },
  {prop: 'acceptanceFlag', label: '是否通过验收', type: 'select', selectData: null,labelWidth: '110'},
  { prop: 'suName', label: '供应商名称', type: 'input', labelWidth: '110' },
  { prop: 'scontCode', label: '合同号', type: 'input', labelWidth: '110' },
  { prop: 'jointReceiver', label: '联合验收人', type: 'input', labelWidth: '110' },
  { prop: 'credCode', label: '技证号', type: 'input', labelWidth: '110' },
]
