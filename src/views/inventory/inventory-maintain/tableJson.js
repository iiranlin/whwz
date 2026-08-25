export const tableJson = [
  {isShow: true, fixed: false, type: '', key: "yearMonth", prop: "yearMonth", label: "年月", align: "center"},
  {isShow: true, fixed: false, key: "plantCode", prop: "plantCode", label: "用料地区", align: 'center', type: "slot"},
  {isShow: true, fixed: false, key: "depotCode", prop: "depotCode", label: "仓库", align: "center", type: "slot"},
  {isShow: true, fixed: false, key: "partitionCode", prop: "partitionCode", label: "仓库分区", align: "center", type: "slot"},
  {isShow: true, fixed: false, key: "csCode", prop: "csCode", label: "盘点单号", align: "center", type: "link"},
  {isShow: true, fixed: false, key: "operDate", prop: "operDate", label: "制表日期", align: "center", type: "slot"},
  {isShow: true, fixed: false, key: "status", prop: "status", label: "单据状态", align: "center", type: "slot"},
  {isShow: true, fixed: false, key: "permFlag", prop: "permFlag", label: "审核状态", align: "center", type: "slot"}
];

export const tableButtonJson = [
   {code: 'maintain', name: "维护盘点单数量", type: "inline", disabled: false},
   {code: 'reviewDetail', name: "审批详情", type: "inline", disabled: false},
]

export const matinTableJson = [
  {isShow: true, fixed: false, key: 'plantCode', prop: 'plantCode', label: '用料地区', align: 'center', type: "slot", width: 160,},
  {isShow: true, fixed: false, key: 'depotCode', prop: 'depotCode', label: '仓库', align: 'center', type: "slot", width: 160},
  {isShow: true, fixed: false, key: 'partitionName', prop: 'partitionName', label: '仓库分区', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'matlCode', prop: 'matlCode', label: '物资编码', align: 'center', width: 180},
  {isShow: true, fixed: false, type: '', key: 'matlName', prop: 'matlName', label: '物资名称', align: 'center', width: 180},
  {isShow: true, fixed: false, type: '', key: 'matlType', prop: 'matlType', label: '规格型号', align: 'center', width: 180},
  {isShow: true, fixed: false, type: '', key: 'matlUnit', prop: 'matlUnit', label: '计量单位', align: 'center', width: 140},
  {isShow: true, fixed: false, type: '', key: 'batchNo', prop: 'batchNo', label: '批次', align: 'center', width: 180},
  {isShow: true, fixed: false, type: 'slot', key: 'productionDate', prop: 'productionDate', label: '生产日期', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'validityPeriod', prop: 'validityPeriod', label: '有效期', align: 'center', width: 160},
  {isShow: true, fixed: false, key: 'validityPeriodUnit', prop: 'validityPeriodUnit', label: '有效期单位', align: 'center', type: 'slot', width: 120},
  {isShow: true, fixed: false, type: 'slot', key: 'expirationDate', prop: 'expirationDate', label: '到期日期', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'cardPrice', prop: 'cardPrice', label: '库存单价（元）', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'accStock', prop: 'accStock', label: '库存数量', align: 'center', width: 160},
  {isShow: true, fixed: false, key: 'realStock', prop: 'realStock', label: '盘点数量', align: 'center', type: "slot", width: 120},
  {isShow: true, fixed: false, key: 'diffInfo', prop: 'diffInfo', label: '盈亏原因', align: 'center', type: "slot", width: 140},
  {isShow: true, fixed: false, type: 'slot', key: 'isCheck', prop: 'isCheck', label: '是否执行六查', align: 'center', width: 120},
  {isShow: true, fixed: false, key: 'comments', prop: 'comments', label: '备注', align: 'center', type: "slot", width: 180},
  // {isShow: true, fixed: false, type: '', key: 'shdw', prop: 'shdw', label: '四号定位', align: 'center', width: 160},
];

export const detailTableJson = [
  {isShow: true, fixed: false, key: 'plantCode', prop: 'plantCode', label: '用料地区', align: 'center', type: "slot", width: 160,},
  {isShow: true, fixed: false, key: 'depotCode', prop: 'depotCode', label: '仓库', align: 'center', type: "slot", width: 160},
  {isShow: true, fixed: false, key: 'partitionName', prop: 'partitionName', label: '仓库分区', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'matlCode', prop: 'matlCode', label: '物资编码', align: 'center', width: 180},
  {isShow: true, fixed: false, type: '', key: 'matlName', prop: 'matlName', label: '物资名称', align: 'center', width: 180},
  {isShow: true, fixed: false, type: '', key: 'matlType', prop: 'matlType', label: '规格型号', align: 'center', width: 180},
  {isShow: true, fixed: false, type: '', key: 'matlUnit', prop: 'matlUnit', label: '计量单位', align: 'center', width: 140},
  {isShow: true, fixed: false, type: '', key: 'batchNo', prop: 'batchNo', label: '批次', align: 'center', width: 180},
  {isShow: true, fixed: false, type: 'slot', key: 'productionDate', prop: 'productionDate', label: '生产日期', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'validityPeriod', prop: 'validityPeriod', label: '有效期', align: 'center', width: 160},
  {isShow: true, fixed: false, key: 'validityPeriodUnit', prop: 'validityPeriodUnit', label: '有效期单位', align: 'center', type: 'slot', width: 120},
  {isShow: true, fixed: false, type: 'slot', key: 'expirationDate', prop: 'expirationDate', label: '到期日期', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'cardPrice', prop: 'cardPrice', label: '库存单价（元）', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'accStock', prop: 'accStock', label: '库存数量', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'realStock', prop: 'realStock', label: '盘点数量', align: 'center', width: 120},
  {isShow: true, fixed: false, type: '', key: 'diffInfo', prop: 'diffInfo', label: '盈亏原因', align: 'center', width: 140},
  {isShow: true, fixed: false, type: 'slot', key: 'isCheck', prop: 'isCheck', label: '是否执行六查', align: 'center', width: 120},
  {isShow: true, fixed: false, type: '', key: 'comments', prop: 'comments', label: '备注', align: 'center', width: 180},
  // {isShow: true, fixed: false, type: '', key: 'shdw', prop: 'shdw', label: '四号定位', align: 'center', width: 160},
];

export const diffInfoOptions = [
  { value: "正常", label: "正常" },
  { value: "变质", label: "变质" },
  { value: "锈蚀", label: "锈蚀" },
  { value: "报损", label: "报损" },
  { value: "淘汰", label: "淘汰" },
  { value: "报废", label: "报废" },
  { value: "盘盈", label: "盘盈" },
]

export const reviewTableJson = [

];