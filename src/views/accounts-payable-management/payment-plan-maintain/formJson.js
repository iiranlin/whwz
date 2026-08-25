import { spurcTypeArr } from '@/utils/dictionary'
export const formJson = [
  {prop: 'prePayPlanCode', label: '待付款计划单号', type: 'input'},
  {prop: 'scontCode', label: '合同号', type: 'input'},
  {prop: 'createDate', label: '制单日期', type: 'date'},
  {prop: 'invoiceCode', label: '发票号', type: 'input'},
  {prop: 'spurcTypeName', label: '采购组织形式', type: 'select', selectData: spurcTypeArr},
  {prop: 'paymentCycle', label: '付款周期', type: 'input'},
  {prop: 'supplierName', label: '供应商', type: 'input'},
]