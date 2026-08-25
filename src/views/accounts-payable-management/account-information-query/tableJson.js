import { shareStatusArr } from '@/utils/dictionary'

export const columns = [
  {
    field: "prePayNo",
    title: "待清算物资明细单号",
    minWidth: 220,
    type: 'link',
    align: "center",
    searchable: true,
    searchType: "input",
  },
  {
    field: "supplierName",
    title: "供应商名称",
    minWidth: 160,
    searchable: true,
    searchType: "input",
  },
  {
    field: "useUnitName",
    title: "用料单位名称",
    minWidth: 160,
    searchable: true,
    searchType: "input",
  },
  {
    field: "sumAmount",
    title: "单据总金额(元)",
    minWidth: 160,
    type: 'number'
  },
  {
    field: "plantName",
    title: "用料地区",
    minWidth: 160,
  },
  {
    field: "matlCode",
    title: "物资编码",
    minWidth: 160,
    align: "center",
    searchable: true,
    searchType: "input",
  },
  {
    field: "matlName",
    title: "物资名称",
    minWidth: 160,
    searchable: true,
    searchType: "input",
  },
  {
    field: "matlType",
    title: "规格型号",
    minWidth: 160,
    hideInTable: true,
    searchable: true,
    searchType: "input",
  },
  {
    field: "matlTypeSlot",
    title: "规格型号/材质/图号",
    minWidth: 160,
    slotName: 'matlTypeSlot'
  },
  {
    field: "matlUnit",
    title: "计量单位",
    minWidth: 160,
    align: "center",
  },
  {
    field: "ibBillCode",
    title: "入库单号",
    minWidth: 160,
    align: "center",
  },
  {
    field: "spdCode",
    title: "采购单号",
    minWidth: 160,
    align: "center",
    searchable: true,
    searchType: "input",
  },
  {
    field: "scontCode",
    title: "合同号",
    minWidth: 160,
    align: "center",
  },
  {
    field: "taxFlagName",
    title: "应税用途",
    minWidth: 160,
    align: "center",
  },
  {
    field: "paNum",
    title: "入库数量",
    minWidth: 160,
    type: 'number'
  },
  {
    field: "stkPrice",
    title: "采购单价",
    minWidth: 160,
    type: 'number'
  },
  {
    field: "taxRate",
    title: "税率",
    minWidth: 160,
    type: 'number'
  },
  {
    field: "taxAmount",
    title: "采购金额(含税)",
    minWidth: 160,
    type: 'number'
  },
  {
    field: "noTaxAmount",
    title: "采购金额(不含税)",
    minWidth: 160,
    type: 'number'
  },
  {
    field: "onlyTaxAmount",
    title: "采购税额(元)",
    minWidth: 160,
    type: 'number',
    slotName: 'onlyTaxAmount'
  },
  {
    field: "invoiceCodeList",
    title: "关联发票号",
    minWidth: 160,
  },
  {
    field: "createUserName",
    title: "制单人",
    minWidth: 160,
  },
  {
    field: "createDate",
    title: "制单日期",
    minWidth: 160,
    type: "date",
    searchable: true,
    searchType: "dateRange",
  },
  {
    field: "status",
    title: "报账状态",
    minWidth: 160,
    type: 'dict',
    dict: shareStatusArr,
  },
  {
    field: "shareStatus",
    title: "报账状态",
    minWidth: 160,
    type: 'dict',
    dict: shareStatusArr,
    hideInTable: true,
    searchable: true,
    searchType: "select",
  },
  {
    field: "shareNo",
    title: "报账单号",
    minWidth: 160,
    align: "center",
  },
]

export const toolbarConfig = {
  buttons: [
    {code: 'export', name: '导出', type: 'primary'},
  ]
}