import { shareStatusObj, payStatusObj } from '@/utils/dictionary'
export const tableJson = [
  {isShow: true, fixed: false, type: 'dict', key: 'status', prop: 'status', label: '报账状态', align: 'center', width: 160, stats: shareStatusObj},
  {isShow: true, fixed: false, type: 'dict', key: 'payStatus', prop: 'payStatus', label: '付款状态', align: 'center', width: 160, stats: payStatusObj},
  {isShow: true, fixed: false, type: '', key: 'invoiceCode', prop: 'invoiceCode', label: '发票号', align: 'center', width: 220},
  {isShow: true, fixed: false, type: '', key: 'supplierName', prop: 'supplierName', label: '供应商名称', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'useUnitName', prop: 'useUnitName', label: '用料单位名称', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'taxAmount', prop: 'taxAmount', label: '发票金额(含税)', align: 'right', width: 160},
  {isShow: true, fixed: false, type: '', key: 'noTaxAmount', prop: 'noTaxAmount', label: '发票金额(不含税)', align: 'right', width: 160},
  {isShow: true, fixed: false, type: '', key: 'onlyTaxAmount', prop: 'onlyTaxAmount', label: '发票税额', align: 'right', width: 160},
  {isShow: true, fixed: false, type: '', key: 'payedAmount', prop: 'payedAmount', label: '已支付金额', align: 'right', width: 160},
  {isShow: true, fixed: false, type: '', key: 'noPayedAmount', prop: 'noPayedAmount', label: '未支付金额', align: 'right', width: 160},
  {isShow: true, fixed: false, type: 'date', key: 'issueTime', prop: 'issueTime', label: '开票日期', align: 'center', width: 160},
]

export const tableButtonJson = [
  {code: 'export', name: '导出'},
]