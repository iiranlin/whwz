import { statusArr } from '@/utils/dictionary'

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
    title: "单据含税总金额(元)",
    minWidth: 160,
    type: 'number'
  },
  {
    field: "checkStatus",
    title: "是否核对",
    minWidth: 160,
    type: 'dict',
    dict: statusArr,
    searchable: true,
    searchType: "select",
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
    field: "ibBillCode",
    title: "入库单号",
    minWidth: 160,
    type: "date",
    hideInTable: true,
    searchable: true,
    searchType: "input",
  },
  {
    field: "spdCode",
    title: "采购订单号",
    minWidth: 160,
    type: "date",
    hideInTable: true,
    searchable: true,
    searchType: "input",
  },
  {
    field: "matlCode",
    title: "物资编码",
    minWidth: 160,
    type: "date",
    hideInTable: true,
    searchable: true,
    searchType: "input",
  },
  {
    field: "matlName",
    title: "物资名称",
    minWidth: 160,
    type: "date",
    hideInTable: true,
    searchable: true,
    searchType: "input",
  },
  {
    field: "matlType",
    title: "规格型号",
    minWidth: 160,
    type: "date",
    hideInTable: true,
    searchable: true,
    searchType: "input",
  },
]

export const toolbarConfig = {
  buttons: [
    {code: 'back', name: '回退', type: 'primary'},
    {code: 'payCreate', name: '生成通知单', type: 'primary'},
    {code: 'payCreateAll', name: '全部生成通知单', type: 'primary'},
  ]
}