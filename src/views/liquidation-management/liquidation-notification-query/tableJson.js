import { statusObj, notificationStatusObj } from '@/utils/dictionary'
export const tableJson = [
  {isShow: true, fixed: false, type: 'link', key: 'prePayNoticeNo', prop: 'prePayNoticeNo', label: '清算通知书单号', align: 'center', width: 220},
  {isShow: true, fixed: false, type: '', key: 'useUnitName', prop: 'useUnitName', label: '用料单位名称', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'sumAmount', prop: 'sumAmount', label: '单据总金额(元)', align: 'right', width: 160},
  {isShow: true, fixed: false, type: '', key: 'createUserName', prop: 'createUserName', label: '制单人', align: 'center', width: 160},
  {isShow: true, fixed: false, type: 'date', key: 'createDate', prop: 'createDate', label: '制单日期', align: 'center', width: 160},
]

export const detailsTableJson = [
  {isShow: true, fixed: false, type: '', key: 'prePayNoticeNo', prop: 'prePayNoticeNo', label: '清算通知书单号', align: 'center', width: 220},
  {isShow: true, fixed: false, type: '', key: 'useUnitName', prop: 'useUnitName', label: '用料单位名称', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'ibBillCode', prop: 'ibBillCode', label: '入库单号', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'spdCode', prop: 'spdCode', label: '采购订单号', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'matlCode', prop: 'matlCode', label: '物资编码', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'matlName', prop: 'matlName', label: '物资名称', align: 'center', width: 160},
  {isShow: true, fixed: false, type: 'slot', key: 'matlType', prop: 'matlType', label: '规格型号/材质/图号', align: 'center', width: 160},
  {isShow: true, fixed: false, type: 'dict', key: 'taxFlag', prop: 'taxFlag', label: '单价是否含税', align: 'center', width: 160, stats: statusObj},
  {isShow: true, fixed: false, type: '', key: 'matlUnit', prop: 'matlUnit', label: '计量单位', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'purNum', prop: 'purNum', label: '采购订单数量', align: 'right', width: 160},
  {isShow: true, fixed: false, type: '', key: 'paNum', prop: 'paNum', label: '入库数量', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'stkPrice', prop: 'stkPrice', label: '采购单价(元)', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'taxRate', prop: 'taxRate', label: '税率', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'taxAmount', prop: 'taxAmount', label: '采购金额(含税)', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'noTaxAmount', prop: 'noTaxAmount', label: '采购金额(不含税)', align: 'center', width: 160},
  {isShow: true, fixed: false, type: 'slot', key: 'onlyTaxAmount', prop: 'onlyTaxAmount', label: '采购税额(元)', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'invoiceCodeList', prop: 'invoiceCodeList', label: '关联发票号', align: 'center', width: 160},
  // {isShow: true, fixed: false, type: '', key: 'invoiceCodeList', prop: 'invoiceCodeList', label: '发票附件', align: 'center', width: 160},
  {isShow: true, fixed: false, type: 'dict', key: 'checkStatus', prop: 'checkStatus', label: '是否核对', align: 'center', width: 160, stats: statusObj},
  {isShow: true, fixed: false, type: 'dict', key: 'status', prop: 'status', label: '报账状态', align: 'center', width: 160, stats: notificationStatusObj},
  {isShow: true, fixed: false, type: '', key: 'shareNo', prop: 'shareNo', label: '报账单号', align: 'center', width: 160},
]

export const tableButtonJson = [
  {code: 'print', name: '打印清算物资明细'},
  {code: 'delete', name: '删除'},
]

export const detailsTableButtonJson = [
  {code: 'viewInvoice', name: '查看发票附件', type: 'inline'},
]


// 清算核对明细字段
export const matlTableJson = [
  {isShow: true, fixed: false, type: '', key: 'ibBillCode', prop: 'ibBillCode', label: '入库单号', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'spdCode', prop: 'spdCode', label: '采购单号', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'scontCode', prop: 'scontCode', label: '合同号', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'supplierName', prop: 'supplierName', label: '供应商名称', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'plantName', prop: 'plantName', label: '用料地区', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'taxFlagName', prop: 'taxFlagName', label: '应税用途', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'taxAmount', prop: 'taxAmount', label: '入库金额(含税)', align: 'right', width: 160},
  {isShow: true, fixed: false, type: '', key: 'noTaxAmount', prop: 'noTaxAmount', label: '入库金额(不含税)', align: 'right', width: 160},
  {isShow: true, fixed: false, type: 'slot', key: 'onlyTaxAmount', prop: 'onlyTaxAmount', label: '入库税额(元)', align: 'right', width: 160},
  {isShow: true, fixed: false, type: '', key: 'invoiceCodeList', prop: 'invoiceCodeList', label: '关联发票号', align: 'center', width: 160},
]

export const matltableButtonJson = [
  // {code: 'viewInvoice', name: '查看发票附件', type: 'inline'},
  {code: 'viewMatl', name: '查看物资明细', type: 'inline'},
]

// 清算核对明细物资字段
export const matlDetailsTableJson = [
  {isShow: true, fixed: false, type: 'dict', key: 'status', prop: 'status', label: '报账状态', align: 'center', width: 160, stats: notificationStatusObj},
  {isShow: true, fixed: false, type: '', key: 'ibBillCode', prop: 'ibBillCode', label: '入库单号', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'matlCode', prop: 'matlCode', label: '物资编码', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'matlName', prop: 'matlName', label: '物资名称', align: 'center', width: 160},
  {isShow: true, fixed: false, type: 'slot', key: 'matlType', prop: 'matlType', label: '规格型号/材质/图号', align: 'center', width: 160},
  {isShow: true, fixed: false, type: 'dict', key: 'taxFlag', prop: 'taxFlag', label: '单价是否含税', align: 'center', width: 160, stats: statusObj},
  {isShow: true, fixed: false, type: '', key: 'matlUnit', prop: 'matlUnit', label: '计量单位', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'purNum', prop: 'purNum', label: '采购订单数量', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'paNum', prop: 'paNum', label: '入库数量', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'stkPrice', prop: 'stkPrice', label: '采购单价(元)', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'taxRate', prop: 'taxRate', label: '税率', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'taxAmount', prop: 'taxAmount', label: '采购金额(含税)', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'noTaxAmount', prop: 'noTaxAmount', label: '采购金额(不含税)', align: 'center', width: 160},
  {isShow: true, fixed: false, type: 'slot', key: 'onlyTaxAmount', prop: 'onlyTaxAmount', label: '采购税额(元)', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'invoiceCodeList', prop: 'invoiceCodeList', label: '关联发票号', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'shareNo', prop: 'shareNo', label: '报账单号', align: 'center', width: 160},
]

export const matlDetailstableButtonJson = [
  {code: 'viewInvoice', name: '查看发票附件', type: 'inline'},
]

// 打印
export const printMatlTableJson = [
  {isShow: true, fixed: false, type: '', key: 'ibBillCode', prop: 'ibBillCode', label: '入库单号', align: 'center'},
  {isShow: true, fixed: false, type: '', key: 'spdCode', prop: 'spdCode', label: '采购订单号', align: 'center'},
  {isShow: true, fixed: false, type: '', key: 'plantName', prop: 'plantName', label: '用料地区', align: 'center'},
  {isShow: true, fixed: false, type: '', key: 'matlCode', prop: 'matlCode', label: '物资编码', align: 'center'},
  {isShow: true, fixed: false, type: '', key: 'matlName', prop: 'matlName', label: '物资名称', align: 'center'},
  {isShow: true, fixed: false, type: '', key: 'matlType', prop: 'matlType', label: '规格型号', align: 'center'},
  {isShow: true, fixed: false, type: '', key: 'matlUnit', prop: 'matlUnit', label: '计量单位', align: 'center'},
  {isShow: true, fixed: false, type: '', key: 'purNum', prop: 'purNum', label: '订单数量', align: 'center'},
  {isShow: true, fixed: false, type: '', key: 'paNum', prop: 'paNum', label: '入库数', align: 'center'},
  {isShow: true, fixed: false, type: '', key: 'stkPrice', prop: 'stkPrice', label: '采购单价', align: 'center'},
  {isShow: true, fixed: false, type: '', key: 'taxAmount', prop: 'taxAmount', label: '清算金额', align: 'center'},
  {isShow: true, fixed: false, type: '', key: 'noteUserName', prop: 'noteUserName', label: '登卡人姓名', align: 'center'},
  {isShow: true, fixed: false, type: 'date', key: 'noteDate', prop: 'noteDate', label: '登卡日期', align: 'center'},
]