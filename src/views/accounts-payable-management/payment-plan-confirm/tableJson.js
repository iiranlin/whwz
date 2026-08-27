import { auditStatusObj, paymentStatusObj } from '@/utils/dictionary'
export const tableJson = [
  {isShow: true, fixed: false, type: 'dict', key: 'status', prop: 'status', label: '付款状态', align: 'center', width: 160, stats: paymentStatusObj},
  {isShow: true, fixed: false, type: 'dict', key: 'auditStatus', prop: 'auditStatus', label: '审批状态', align: 'center', width: 160, stats: auditStatusObj},
  {isShow: true, fixed: false, type: 'link', key: 'payBatchNo', prop: 'payBatchNo', label: '付款批次号', align: 'center', width: 220},
  {isShow: true, fixed: false, type: 'link', key: 'prePayPlanCode', prop: 'prePayPlanCode', label: '待付款计划单号', align: 'center', width: 220},
  {isShow: true, fixed: false, type: '', key: 'supplierName', prop: 'supplierName', label: '供应商名称', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'scontCode', prop: 'scontCode', label: '合同号', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'sumAmount', prop: 'sumAmount', label: '计划付款总金额(元)', align: 'right', width: 160},
  {isShow: true, fixed: false, type: '', key: 'sumPayedAmount', prop: 'sumPayedAmount', label: '已付款总金额(元)', align: 'right', width: 160},
  {isShow: true, fixed: false, type: 'slot', key: 'remainPayedAmount', prop: 'remainPayedAmount', label: '剩余可付款金额(元)', align: 'right', width: 160},
  {isShow: true, fixed: false, type: '', key: 'payedPercent', prop: 'payedPercent', label: '付款比例(%)', align: 'right', width: 160},
  {isShow: true, fixed: false, type: '', key: 'payedAmount', prop: 'payedAmount', label: '本期付款金额(元)', align: 'right', width: 160},
  {isShow: true, fixed: false, type: '', key: 'payedAmount', prop: 'payedAmount', label: '本期已付金额(元)', align: 'right', width: 160},
  {isShow: true, fixed: false, type: '', key: 'createUserName', prop: 'createUserName', label: '制单人', align: 'center', width: 160},
  {isShow: true, fixed: false, type: 'date', key: 'createDate', prop: 'createDate', label: '制单日期', align: 'center', width: 160},
  {isShow: true, fixed: false, type: 'date', key: 'auditDate', prop: 'auditDate', label: '审批日期', align: 'center', width: 160},
  {isShow: true, fixed: false, type: 'date', key: 'confirmDate', prop: 'confirmDate', label: '付款日期', align: 'center', width: 160},
]

export const tableButtonJson = [
  {code: 'submitForApproval', name: '报批'},
  {code: 'paymentConfirm', name: '付款确认'},
  {code: 'back', name: '回退'},
  {code: 'export', name: '导出'},
  {code: 'uploadEnclosure', name: '上传附件'},
  // 无工作流：隐藏"审核历史"入口（$flow 流程轨迹），将来接入工作流放开
  // {code: 'history', name: '审核历史', type: 'inline'},
]

// 付款计划明细列表
export const detailsTableJson = [
  {isShow: true, fixed: false, type: '', key: 'prePayPlanCode', prop: 'prePayPlanCode', label: '待付款计划单号', align: 'center', width: 200},
  {isShow: true, fixed: false, type: '', key: 'scontCode', prop: 'scontCode', label: '合同号', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'spurcTypeName', prop: 'spurcTypeName', label: '采购组织形式', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'warrantyPeriod', prop: 'warrantyPeriod', label: '质保期', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'paymentCycle', prop: 'paymentCycle', label: '付款周期', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'sumAmount', prop: 'sumAmount', label: '待付款总金额', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'payedPercent', prop: 'payedPercent', label: '付款比例', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'payedAmount', prop: 'payedAmount', label: '本期付款金额', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'supplierName', prop: 'supplierName', label: '供应商名称', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'supUnitName', prop: 'supUnitName', label: '采供单位', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'invoiceCodeList', prop: 'invoiceCodeList', label: '关联发票号', align: 'center', width: 160},
]

export const detailsTableButtonJson = [
  {code: 'addEnclosure', name: '添加附件'},
  {code: 'viewInvoice', name: '查看发票附件', type: 'inline'},
]