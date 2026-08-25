export const tableJson = [
  {isShow: true, fixed: false, type: '', key: "yearMonth", prop: "yearMonth", label: "年月", align: "center"},
  {isShow: true, fixed: false, key: "plantCode", prop: "plantCode", label: "地区", align: 'center', type: "slot"},
  {isShow: true, fixed: false, key: "depotCode", prop: "depotCode", label: "仓库", align: "center", type: "slot"},
  {isShow: true, fixed: false, key: "csCode", prop: "csCode", label: "盘点单号", align: "center", type: "link"},
  {isShow: true, fixed: false, key: "operDate", prop: "operDate", label: "制表日期", align: "center", type: "slot"},
  {isShow: true, fixed: false, key: "permFlag", prop: "permFlag", label: "单据状态", align: "center", type: "slot"}
];

export const detailTableJson = [
  {isShow: true, fixed: false, key: 'plantCode', prop: 'plantCode', label: '地区', align: 'center', type: "slot"},
  {isShow: true, fixed: false, key: 'depotCode', prop: 'depotCode', label: '仓库', align: 'center', type: "slot"},
  {isShow: true, fixed: false, type: '', key: 'matlCode', prop: 'matlCode', label: '物资编码', align: 'center', width: "100"},
  {isShow: true, fixed: false, type: '', key: 'matlName', prop: 'matlName', label: '物资名称', align: 'center'},
  {isShow: true, fixed: false, type: '', key: 'matlType', prop: 'matlType', label: '规格型号', align: 'center'},
  {isShow: true, fixed: false, type: '', key: 'matlUnit', prop: 'matlUnit', label: '计量单位', align: 'center'},
  {isShow: true, fixed: false, type: '', key: 'cardPrice', prop: 'cardPrice', label: '库存单价（元）', align: 'center', width: "100"},
  {isShow: true, fixed: false, type: '', key: 'accStock', prop: 'accStock', label: '库存数量', align: 'center'},
  {isShow: true, fixed: false, type: '', key: 'realStock', prop: 'realStock', label: '盘点数量', align: 'center'},
  {isShow: true, fixed: false, type: '', key: 'diffInfo', prop: 'diffInfo', label: '盈亏原因', align: 'center'},
  {isShow: true, fixed: false, type: '', key: 'comments', prop: 'comments', label: '备注', align: 'center'},
  {isShow: true, fixed: false, type: '', key: 'shdw', prop: 'shdw', label: '四号定位', align: 'center'},
];