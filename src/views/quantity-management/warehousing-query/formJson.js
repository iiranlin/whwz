import { ibmtFlagArr, dateTypeArr, ibdtHasArr } from '@/utils/dictionary'
export const formJson = [
  {prop: 'flag', label: '单据状态', type: 'select', selectData: ibmtFlagArr},
  {prop: 'ibBillCode', label: '入库单号', type: 'input'},
  {prop: 'plantCode', label: '用料地区', type: 'select', selectData: null, isSelectCode: true},
  {prop: 'depotCode', label: '仓库', type: 'select', selectData: null, isSelectCode: true},
  {prop: 'partitionCode', label: '仓库分区', type: 'select', selectData: null, isSelectCode: true},
  {prop: 'supUnitName', label: '供货单位', type: 'search', clearable: true},
  {prop: 'matlCode', label: '物资编码', type: 'input'},
  {prop: 'matlName', label: '物资名称', type: 'input'},
  {prop: 'dateType', label: '日期', type: 'select', selectData: dateTypeArr, clearable: true},
  {prop: 'date', label: '', type: 'date', clearable: true },
  {prop: 'bmName', label: '下单人', type: 'input'},
  {prop: 'has', label: '分组汇总', type: 'slot', selectData: ibdtHasArr},
]