import { paymentStatusArr } from '@/utils/dictionary'
export const formJson = [
  {prop: 'payBatchNo', label: '付款审批单号', type: 'input'},
  {prop: 'prePayPlanCode', label: '待付款计划单号', type: 'input'},
  {prop: 'createDate', label: '制单日期', type: 'date'},
  {prop: 'supplierName', label: '供应商名称', type: 'input'},
  {prop: 'supUnitName', label: '采供单位名称', type: 'input'},
  {prop: 'scontCode', label: '合同号', type: 'input'},
  {prop: 'invoiceCode', label: '发票号', type: 'input'},
  {prop: 'confirmDate', label: '支付日期', type: 'date'},
  {prop: 'status', label: '付款状态', type: 'select', selectData: paymentStatusArr},
]