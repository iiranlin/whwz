// 盘点单生成表格表头
export const tableJson = [
  {isShow: true, fixed: false, type: '', key: 'matlCode', prop: 'matlCode', label: '物资编码', align: 'center', width: 180},
  {isShow: true, fixed: false, type: '', key: 'matlName', prop: 'matlName', label: '物资名称', align: 'center', width: 180},
  {isShow: true, fixed: false, type: '', key: 'matlType', prop: 'matlType', label: '规格型号', align: 'center', width: 180},
  {isShow: true, fixed: false, type: '', key: 'matlUnit', prop: 'matlUnit', label: '计量单位', align: 'center', width: 140},
  {isShow: true, fixed: false, type: '', key: 'batchNo', prop: 'batchNo', label: '批次', align: 'center', width: 160},
  {isShow: true, fixed: false, type: 'slot', key: 'productionDate', prop: 'productionDate', label: '生产日期', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'validityPeriod', prop: 'validityPeriod', label: '有效期', align: 'center', width: 160},
  {isShow: true, fixed: false, key: 'validityPeriodUnit', prop: 'validityPeriodUnit', label: '有效期单位', align: 'center', type: 'slot', width: 120},
  {isShow: true, fixed: false, type: 'slot', key: 'expirationDate', prop: 'expirationDate', label: '到期日期', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'cardPrice', prop: 'cardPrice', label: '库存单价（元）', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'nowNum', prop: 'nowNum', label: '库存数量', align: 'center', width: 160},
  // {isShow: true, fixed: false, type: '', key: 'shdw', prop: 'shdw', label: '四号定位', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'stockFlag', prop: 'stockFlag', label: '已盘点次数', align: 'center', width: 120},
];

export const rangeTableJson = [
  { isShow: true, fixed: false, type: '', key: 'matlCode', prop: 'matlCode', label: '物资编码', align: 'center', width: 160, },
  { isShow: true, fixed: false, type: '', key: 'matlName', prop: 'matlName', label: '物资名称', align: 'center', width: 200, },
  {isShow: true, fixed: false, type: '', key: 'matlType', prop: 'matlType', label: '规格型号', align: 'center', width: 160,},
  {isShow: true, fixed: false, type: '', key: 'matlUnit', prop: 'matlUnit', label: '计量单位', align: 'center', width: 100,},
  {isShow: true, fixed: false, type: '', key: 'batchNo', prop: 'batchNo', label: '批次', align: 'center', width: 160,},
  {isShow: true, fixed: false, type: 'slot', key: 'productionDate', prop: 'productionDate', label: '生产日期', align: 'center', width: 150,},
  {isShow: true, fixed: false, type: '', key: 'validityPeriod', prop: 'validityPeriod', label: '有效期', align: 'center', width: 120,},
  {isShow: true, fixed: false, key: 'validityPeriodUnit', prop: 'validityPeriodUnit', label: '有效期单位', align: 'center', type: "slot", width: 120,},
  {isShow: true, fixed: false, type: 'slot', key: 'expirationDate', prop: 'expirationDate', label: '到期日期', align: 'center', width: 150,},
  {isShow: true, fixed: false, type: '', key: 'cardPrice', prop: 'cardPrice', label: '库存单价（元）', align: 'center', width: 160,},
  {isShow: true, fixed: false, type: '', key: 'stockFlag', prop: 'stockFlag', label: '已盘点次数', align: 'center', width: 100,},
];