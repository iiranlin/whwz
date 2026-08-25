import { prePayPlanDtStatusObj } from '@/utils/dictionary'
export const tableJson = [
  {isShow: true, fixed: false, type: 'slot', key: 'payedPercent', prop: 'payedPercent', label: '付款比例(%)', align: 'center', width: 200},
  {isShow: true, fixed: false, type: 'slot', key: 'payedAmount', prop: 'payedAmount', label: '本期付款金额', align: 'center', width: 200},
  {isShow: true, fixed: false, type: 'dict', key: 'status', prop: 'status', label: '单据状态', align: 'center', width: 160, stats: prePayPlanDtStatusObj},
  {isShow: true, fixed: false, type: 'link', key: 'prePayPlanCode', prop: 'prePayPlanCode', label: '待付款计划单号', align: 'center', width: 220},
  {isShow: true, fixed: false, type: '', key: 'supplierName', prop: 'supplierName', label: '供应商名称', align: 'left', width: 160},
  {isShow: true, fixed: false, type: '', key: 'scontCode', prop: 'scontCode', label: '合同号', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'spurcTypeName', prop: 'spurcTypeName', label: '采购组织形式', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'warrantyPeriod', prop: 'warrantyPeriod', label: '质保期', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'paymentCycle', prop: 'paymentCycle', label: '付款周期', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'sumAmount', prop: 'sumAmount', label: '计划付款总金额(元)', align: 'right', width: 160},
  {isShow: true, fixed: false, type: '', key: 'sumPayedAmount', prop: 'sumPayedAmount', label: '已付款总金额(元)', align: 'right', width: 160},
  {isShow: true, fixed: false, type: 'slot', key: 'remainPayedAmount', prop: 'remainPayedAmount', label: '剩余可付款金额(元)', align: 'right', width: 160},
  {isShow: true, fixed: false, type: 'date', key: 'createDate', prop: 'createDate', label: '制单日期', align: 'center', width: 160},
]

export const tableButtonJson = [
  {code: 'create', name: '保存'},
  {code: 'submit', name: '提交'},
  {code: 'viewMatl', name: '查看付款记录', type: 'inline'},
]

// 付款记录
export const payedDetailsTableJson = [
  {isShow: true, fixed: false, type: 'date', key: 'confirmDate', prop: 'confirmDate', label: '付款日期', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'payedAmount', prop: 'payedAmount', label: '付款金额', align: 'right', width: 160},
  {isShow: true, fixed: false, type: '', key: 'confirmUserName', prop: 'confirmUserName', label: '付款人', align: 'center', width: 160},
]