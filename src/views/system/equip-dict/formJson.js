import { statusArr } from '@/utils/dictionary'
export const formJson = [
  {prop: 'equipCode', label: '设备编码', type: 'input'},
  {prop: 'equipName', label: '设备名称', type: 'input'},
  {prop: 'equipType', label: '设备类型', type: 'input'},
  {prop: 'status', label: '是否有效', type: 'select', selectData: statusArr}
]
