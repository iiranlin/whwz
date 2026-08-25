import { ibmtFlagArr, dateTypeArr, obdtHasArr } from '@/utils/dictionary'
export const formJson = [
  {prop: 'flag', label: '单据状态', type: 'select', selectData: ibmtFlagArr},
  {prop: 'obBillCode', label: '出库单号', type: 'input'},
  {prop: 'plantCode', label: '用料地区', type: 'select', selectData: null, isSelectCode: true},
  {prop: 'depotCode', label: '仓库', type: 'select', selectData: null, isSelectCode: true},
  {prop: 'partitionCode', label: '仓库分区', type: 'select', selectData: null, isSelectCode: true},
  {prop: 'matlCode', label: '物资编码', type: 'input'},
  {prop: 'matlName', label: '物资名称', type: 'input'},
  {prop: 'dateType', label: '日期', type: 'select', selectData: dateTypeArr, clearable: true},
  {prop: 'date', label: '', type: 'date', clearable: true },
  {prop: 'deptName', label: '领料部门', type: 'search'},
  {prop: 'bmName', label: '下单人', type: 'input'},
  {prop: 'has', label: '分组汇总', type: 'slot', selectData: obdtHasArr},
]