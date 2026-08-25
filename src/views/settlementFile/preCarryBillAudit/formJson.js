import { statusArr } from '@/utils/dictionary'
export const formJson = [
  {prop: 'yearMonth', label: '财务年月', type: 'date',dateType: "month",labelWidth:'90'},
  {prop: 'billType', label: '单据类型', type: 'select',labelWidth:'90',selectData:[
    {value: "入库单", label: "入库单"},
    {value: "出库单", label: "出库单"},
    {value: "退料单", label: "退料单"},
    {value: "移库单", label: "移库单"},
    {value: "调拨(销售)单", label: "调拨(销售)单"},
    {value: "调整单", label: "调整单"},
    {value: "调价单", label: "调价单"},
  ]},
  {prop: 'billCode', label: '单据号', type: 'input',labelWidth:'90'},
  {prop: 'isNoStorageAllotFlag', label: '单据状态', type: 'select',labelWidth:'90'},
]