export const approvalObj = [{ value: '0,1', label: '未登卡' },{ value: '2', label: '已登卡' }]
export const formJson = [
  { prop: 'flag', label: '单据状态', type: 'select', selectData: approvalObj },
  { prop: 'ibBillCode', label: '入库单号', type: 'input' },
  { prop: 'plantCode', label: '用料地区', type: 'select', selectData: null ,isSelectCode: true},
  { prop: 'depotCode', label: '仓库', type: 'select', selectData: null,isSelectCode: true },
  { prop: 'partitionCode', label: '仓库分区', type: 'select', selectData: null,isSelectCode: true },
  { prop: 'supUnitName', label: '供货单位', type: 'inputDialog' },
  { prop: 'matlCode', label: '物资编码', type: 'input' },
  { prop: 'matlName', label: '物资名称', type: 'input' },
  { prop: 'matlType', label: '规格型号', type: 'input' },
  { prop: "orderDate", label: "下单日期", type: "date", labelWidth: "84" },
]
  // 选择收料单位弹框搜索字段
  export const rluFormJson = [
    {prop: 'unitCode', label: '往来单位编号', type: 'input'},
    {prop: 'unitName', label: '往来单位名称', type: 'input'},
  ]