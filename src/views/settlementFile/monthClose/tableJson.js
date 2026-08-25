import { statusObj } from '@/utils/dictionary'
// 校验标志
const checkFlagObj = {'0': '未校验', '1': '已校验'}
// 结转标志
const carryoverFlagObj = {'0': '未结转', '1': '已结转'}
// 登卡标志
const stopnoteFlagObj = {'0': '未禁止', '1': '已禁止'}
// 封账标志
const closeFlagObj = {'0': '未封账', '1': '已封账'}

export const tableJson = [
  {searchType: 'date', field: 'yearMonth', title: '财务年月', align: 'center',},
  {searchType: '', field: 'stopnoteFlag', title: '是否允许登卡', align: 'center',slotName:'stopnoteFlag',searchProps:{
    options:[
      {value:'0',label:'未禁止'},
      {value:'1',label:'已禁止'},
    ]
  }},
  {searchType: 'date', field: 'stopnoteDate', title: '禁止登卡日期', align: 'center',},
  {searchType: '', field: 'checkFlag', title: '数据校验标志', align: 'center',slotName:'checkFlag'},
  {searchType: 'date', field: 'checkDate', title: '数据校验日期', align: 'center',},
  {searchType: '', field: 'closeFlag', title: '封账状态', align: 'center',slotName:'closeFlag',searchProps:{
    options:[
      {value:'0',label:'未封账'},
      {value:'1',label:'已封账'},
    ]
  }},
  {searchType: 'date', field: 'closeDate', title: '封账日期', align: 'center',},
]

export const toolbarConfig = {
  buttons:[
    {
      code: 'carryOver', 
      name: '本月结转下月',
      type: "primary",
      showInTop: true,
      tooltip: "本月结转下月",
    },
    {
      code: 'isOver', 
      name: '包括库存为0的物资卡片',
      type: "primary",
      showInTop: true,
      tooltip: "包括库存为0的物资卡片",
    }
  ]
}