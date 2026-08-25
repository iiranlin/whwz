export const approvalObj = [{ value: '0', label: '未登卡' },{ value: '2', label: '已登卡' }]
export const formJson = [
  { prop: 'flag', label: '单据状态', type: 'select', selectData: approvalObj },
  { prop: 'obCode', label: '出库单号', type: 'input' },
  { prop: 'planCode', label: '请领单编号', type: 'input' },
  { prop: 'deptName', label: '请领车间', type: 'input' },
  { prop: 'teamName', label: '请领班组', type: 'input' },
  { prop: 'plantCode', label: '用料地区', type: 'select', selectData: null ,isSelectCode: true},
  { prop: 'depotCode', label: '仓库', type: 'select', selectData: null,isSelectCode: true },
  { prop: 'partitionCode', label: '仓库分区', type: 'select',selectData: null ,isSelectCode: true},
  { prop: 'matlCode', label: '物资编码', type: 'input' },
  { prop: 'matlName', label: '物资名称', type: 'input' },
  { prop: 'matlType', label: '规格型号', type: 'input' },
  { prop: 'pickmatlName', label: '请领人', type: 'input' },
  {prop: 'makeDate', label: '下单日期', type: 'date',autoMonth:true},
]
