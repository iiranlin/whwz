import { statusObj, prePayPlanStatusObj } from '@/utils/dictionary'
export const tableJson = [
  {isShow: true, fixed: false, type: 'dict', key: 'status', prop: 'status', label: '单据状态', align: 'center', width: 160, stats: prePayPlanStatusObj},
  {isShow: true, fixed: false, type: 'link', key: 'prePayPlanCode', prop: 'prePayPlanCode', label: '待付款计划单号', align: 'center', width: 220},
  {isShow: true, fixed: false, type: '', key: 'supplierName', prop: 'supplierName', label: '供应商名称', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'scontCode', prop: 'scontCode', label: '合同号', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'sumAmount', prop: 'sumAmount', label: '计划付款总金额(元)', align: 'right', width: 160},
  {isShow: true, fixed: false, type: '', key: 'sumPayedAmount', prop: 'sumPayedAmount', label: '已付款金额', align: 'right', width: 160},
  {isShow: true, fixed: false, type: 'slot', key: 'remainingAmount', prop: 'remainingAmount', label: '剩余付款金额', align: 'right', width: 160},
  {isShow: true, fixed: false, type: '', key: 'createUserName', prop: 'createUserName', label: '制单人', align: 'center', width: 160},
  {isShow: true, fixed: false, type: 'date', key: 'createDate', prop: 'createDate', label: '制单日期', align: 'center', width: 160},
]

export const tableButtonJson = [
  {code: 'create', name: '生成待付款计划'},
  {code: 'delete', name: '删除'},
  {code: 'submit', name: '提交'},
  {code: 'export', name: '导出'},
  {code: 'viewMatl', name: '查看物资明细', type: 'inline'},
]

// 详情附件
export const matlTableJson = [
  {isShow: true, fixed: false, type: '', key: 'invoiceCode', prop: 'invoiceCode', label: '关联发票号', align: 'center', width: 160},
  {isShow: true, fixed: false, type: 'link', key: 'originFileName', prop: 'originFileName', label: '发票附件', align: 'center', width: 160},
]

// 物资明细
export const matlDetailsTableJson = [
  {isShow: true, fixed: false, type: '', key: 'ibBillCode', prop: 'ibBillCode', label: '入库单号', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'spdCode', prop: 'spdCode', label: '采购单号', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'taxFlagName', prop: 'taxFlagName', label: '应税用途', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'matlCode', prop: 'matlCode', label: '物资编码', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'matlName', prop: 'matlName', label: '物资名称', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'matlType', prop: 'matlType', label: '规格型号/材质/图号', align: 'center', width: 160},
  {isShow: true, fixed: false, type: 'dict', key: 'taxFlag', prop: 'taxFlag', label: '单价是否含税', align: 'center', width: 160, stats: statusObj},
  {isShow: true, fixed: false, type: '', key: 'matlUnit', prop: 'matlUnit', label: '计量单位', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'paNum', prop: 'paNum', label: '入库数量', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'stkPrice', prop: 'stkPrice', label: '采购单价(元)', align: 'right', width: 160},
  {isShow: true, fixed: false, type: '', key: 'taxRate', prop: 'taxRate', label: '税率', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'taxAmount', prop: 'taxAmount', label: '采购金额(含税)', align: 'right', width: 160},
  {isShow: true, fixed: false, type: '', key: 'noTaxAmount', prop: 'noTaxAmount', label: '采购金额(不含税)', align: 'right', width: 160},
  {isShow: true, fixed: false, type: 'slot', key: 'onlyTaxAmount', prop: 'onlyTaxAmount', label: '采购税额(元)', align: 'right', width: 160},
]