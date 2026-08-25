import { statusObj } from '@/utils/dictionary'
export const tableJson = [
  {isShow: true, fixed: false, type: '', key: 'plantName', prop: 'plantName', label: '用料地区', align: 'center'},
  {isShow: true, fixed: false, type: '', key: 'whCode', prop: 'whCode', label: '仓库编码', align: 'center'},
  {isShow: true, fixed: false, type: '', key: 'whName', prop: 'whName', label: '仓库名称', align: 'center'},
  {isShow: true, fixed: false, type: '', key: 'taxFlagName', prop: 'taxFlagName', label: '应税用途', align: 'center'},
  {isShow: true, fixed: false, type: 'dict', key: 'stockattr', prop: 'stockattr', label: '存货属性', align: 'center', stats: null},
  {isShow: true, fixed: false, type: '', key: 'parentWhName', prop: 'parentWhName', label: '上级库位', align: 'center'},
  {isShow: true, fixed: false, type: 'dict', key: 'isOneLevel', prop: 'isOneLevel', label: '是否一级库', align: 'center', stats: statusObj },
  {isShow: true, fixed: false, type: 'dict', key: 'isCostAccount', prop: 'isCostAccount', label: '是否实际成本计价法', align: 'center', stats: statusObj, width: '140' },
  {isShow: true, fixed: false, type: 'dict', key: 'isWorkshop', prop: 'isWorkshop', label: '是否车间库', align: 'center', stats: statusObj },
  {isShow: true, fixed: false, type: 'dict', key: 'status', prop: 'status', label: '是否启用', align: 'center', stats: statusObj },
]

export const tableButtonJson = [
  {code: 'modify', name: '修改', type: 'inline'},
  {code: 'allocate', name: '物资范围分配', type: 'inline'},
]

export const allocateTableJson = [
  {isShow: true, fixed: false, type: 'slot', key: 'whCode', prop: 'whCode', label: '仓库编码', align: 'center'},
  {isShow: true, fixed: false, type: 'slot', key: 'whName', prop: 'whName', label: '仓库名称', align: 'center'},
  {isShow: true, fixed: false, type: '', key: 'firMatlcode', prop: 'firMatlcode', label: '前物资分类', align: 'center'},
  {isShow: true, fixed: false, type: '', key: 'endMatlcode', prop: 'endMatlcode', label: '后物资分类', align: 'center'},
]

export const allocateTableButtonJson = [
  {code: 'delete', name: '删除', type: 'inline'}
]
