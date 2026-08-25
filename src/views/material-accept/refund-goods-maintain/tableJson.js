import { operationTypeArr } from '@/utils/dictionary'

export const columns = [
  {
    field: "spdCode",
    title: "采购订单号",
    minWidth: 160,
    align: "center",
    searchable: true,
    searchType: "input",
  },
  {
    field: "suName",
    title: "供应商",
    minWidth: 160,
    searchable: true,
    searchType: "input",
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
    field: "matlTypeSlot",
    title: "规格型号/材质/图号",
    minWidth: 140,
    slotName: 'matlTypeSlot',
  },
  {
    field: "matlType",
    title: "规格型号",
    minWidth: 140,
    hideInTable: true,
    searchable: true,
    searchType: "input",
  },
  {
    field: "operationType",
    title: "业务类型",
    minWidth: 140,
    hideInTable: true,
    searchable: true,
    searchType: "select",
    searchProps: {clearable: false},
    requestOptions: async () => operationTypeArr,
    optionsCacheKey: "refund-goods-maintain:operationType",
  },
  {
    field: "matlUnit",
    title: "计量单位",
    minWidth: 160,
    align: "center",
  },
  {
    field: "madeBrand",
    title: "产地/品牌",
    minWidth: 160,
  },
  {
    field: "purNum",
    title: "采购数量",
    minWidth: 140,
    type: 'number'
  },
  {
    field: "contPrice",
    title: "采购单价",
    minWidth: 160,
    type: 'number'
  },
  {
    field: "deliverNum",
    title: "发货数量",
    minWidth: 160,
    type: 'number'
  },
  {
    field: "arrivalNum",
    title: "到货数量",
    minWidth: 160,
    type: 'number'
  },
  {
    field: "batchNo",
    title: "发货批次号",
    minWidth: 160,
    align: "center",
  },
  {
    field: "acceptanceNum",
    title: "验收通过数量",
    minWidth: 160,
    type: 'number'
  },
  {
    field: "notAcceptanceNum",
    title: "验收不通过数量",
    minWidth: 160,
    type: 'number'
  },
  {
    field: "deliverDate",
    title: "发货日期",
    minWidth: 160,
    type: 'date'
  },
];

export const toolbarConfig = {
  buttons: [
    {code: 'exchange', name: '换货', showInTop: false, showInRow: true},
    {code: 'return', name: '退货', showInTop: false, showInRow: true},
    {code: 'replenishBatch', name: '补录发货批次', showInTop: false, showInRow: false},
    {code: 'history', name: '验收历史', showInTop: false, showInRow: true},
  ]
}