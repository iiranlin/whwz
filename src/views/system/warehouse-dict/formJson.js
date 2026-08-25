import { statusArr } from '@/utils/dictionary'
export const formJson = [
  {prop: 'whCode', label: '仓库编码', type: 'input'},
  {prop: 'whName', label: '仓库名称', type: 'input'},
  {prop: 'stockattr', label: '存货属性', type: 'select', selectData: null},
  {prop: 'status', label: '是否启用', type: 'select', selectData: statusArr}
]