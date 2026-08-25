export const formJson = [
  {prop: 'yearMonth', label: '年月', type: 'date', dateType: "monthrange", valueFormat: 'YYYYMM', clearable: true},
  {prop: 'plantCode', label: '用料地区', type: 'select', selectData: null, isSelectCode: true},
  {prop: 'depotCode', label: '仓库', type: 'select', selectData: null, isSelectCode: true},
  {prop: 'partitionCode', label: '仓库分区', type: 'select', selectData: null, isSelectCode: true},
  {prop: 'matlCode', label: '物资编码', type: 'input'},
  {prop: 'matlName', label: '物资名称', type: 'input'},
  {prop: 'isNotZero', label: '', type: 'slot'},
]