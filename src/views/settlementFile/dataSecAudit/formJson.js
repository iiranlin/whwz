import { statusArr } from '@/utils/dictionary'
export const formJson = [
  {prop: 'yearMonth', label: '财务年月', type: 'date',dateType: "month",labelWidth:'90'},
  {prop: 'plantCode', label: '用料地区', type: 'select',labelWidth:'90'},
  {prop: 'depotCode', label: '仓库', type: 'select',labelWidth:'90'},
  {prop: 'partitionCode', label: '仓库分区', type: 'select',labelWidth:'90'},
  {prop: 'verifyType', label: '校验类别', type: 'select',labelWidth:'90',selectData:[
    {value:1, label: "数量"},
    {value:0, label: "金额"}
  ]}
]