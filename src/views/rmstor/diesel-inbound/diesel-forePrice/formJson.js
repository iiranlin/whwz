import { statusArr } from '@/utils/dictionary'
export const formJson = [
  {prop: 'status', label: '单据状态', type: 'select',labelWidth:'90',selectData: [
    {value: 0, label: "未发布"},
    {value: 1, label: "已发布"},
    {value: 2, label: "已失效"},
  ]},
  {prop: 'code', label: '发布单号', type: 'input',labelWidth:'90'},
]