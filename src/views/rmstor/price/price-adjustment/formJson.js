export const flagObj = [
  { value: '0', label: '未提交' },
  { value: '1', label: '未登卡' },
  { value: '2', label: '已登卡' },
]

export const auditFlagObj = [
  { value: '0', label: '未审批' },
  { value: '1', label: '审批中' },
  { value: '2', label: '已审批' },
]
export const formJson = [
  {prop: 'flag', label: '单据状态', type: 'select', selectData: flagObj},
  {prop: 'adjustCode', label: '调价单号', type: 'input'},
  { prop: 'plantCode', label: '用料地区', type: 'select', selectData: null ,isSelectCode: true},
  { prop: 'depotCode', label: '仓库', type: 'select', selectData: null,isSelectCode: true },
  { prop: 'partitionCode', label: '仓库分区', type: 'select',selectData: null ,isSelectCode: true},
  { prop: 'matlCode', label: '物资编码', type: 'input' },
  { prop: 'matlName', label: '物资名称', type: 'input' },
  { prop: 'matlType', label: '规格型号', type: 'input' },
  {prop: 'makeDate', label: '下单日期', type: 'date',autoMonth:true},
]

export const rmstorMatlFormJson = [
  {prop: 'depotCode', label: '调出仓库', type: 'select', disabled: true, selectData: null},
  {prop: 'matlCode', label: '物资编码', type: 'input'},
  {prop: 'matlName', label: '物资名称', type: 'input'},
]