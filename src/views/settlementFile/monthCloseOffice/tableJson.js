import { closeFlagObj } from '@/utils/dictionary'
export const columns = [
  {
    field: "yearMonthStr",
    title: "财务年月",
    minWidth: 160,
    align: "center",
    hideInTable: true,
    searchable: true,
    searchType: "input",
  },
  {
    field: "yearMonth",
    title: "财务年月",
    minWidth: 160,
    align: "center",
  },
  {
    field: "closeFlag",
    title: "封账状态",
    minWidth: 160,
    type: "dict",
    dict: closeFlagObj,
    slotName: 'closeFlag'
  },
  {
    field: "closeDate",
    title: "封账日期",
    minWidth: 160,
    type: "date",
  },
]

export const toolbarConfig = {
  buttons: [
    {code: 'carryOver', name: '本月结转', type: 'primary'},
  ]
}
