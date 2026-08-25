export const auditFlagObj = { '1': '未登卡', '2': '已登卡' }
export const tableJson = [
  {searchType: 'dict', field: 'flag', title: '状态', align: 'center', searchProps:{
    options:[
      {value:'1',label:'未登卡'},
      {value:'2',label:'已登卡'},
    ],
    clearable:true
  } },
  {searchType: '', field: 'ibBillCode', title: '入库单号', align: 'center',slotName: 'code-cell',},
  {searchType: '', field: 'supUnitName', title: '供货单位', align: 'center',},
  {searchType: '', field: 'plantName', title: '用料地区', align: 'center',},
  {searchType: '', field: 'depotName', title: '仓库', align: 'center',},
  {searchType: '', field: 'partitionName', title: '仓库分区', align: 'center',},
  {searchType: '', field: 'taxFlagName', title: '应税用途', align: 'center',},
  {searchType: '', field: 'bmName', title: '业务员', align: 'center',},
  {searchType: 'date', field: 'orderDate', title: '下单日期', align: 'center',},
  {searchType: 'date', field: 'noteDate', title: '登卡日期', align: 'center',},
  {searchType: '', field: 'matlAmount', title: '料款（元）', align: 'center',},
  {searchType: '', field: 'incotaxAmount', title: '税额（元）', align: 'center',},
  {searchType: '', field: 'taxMatlAmount', title: '含税料款（元）', align: 'center',},

  // 搜索
  { field: 'flag', title: '单据状态', searchType: 'select', searchProps:{
    options:[
      { value: '0,1', label: '未登卡' },
      { value: '2', label: '已登卡' }
    ],
    clearable: true,
  },hideInTable:true,searchable: true},
  { field: 'ibBillCode', title: '入库单号', searchType: 'input',hideInTable:true,searchable: true, },
  { field: 'plantCode', title: '用料地区', searchType: 'select',hideInTable:true,searchable: true,},
  { field: 'depotCode', title: '仓库', searchType: 'select',hideInTable:true,searchable: true,},
  { field: 'partitionCode', title: '仓库分区', searchType: 'select',hideInTable:true,searchable: true,},
  { field: 'supUnitName', title: '供货单位', searchType: 'inputDialog',hideInTable:true,searchable: true, },
  { field: 'matlCode', title: '物资编码', searchType: 'input',hideInTable:true,searchable: true, },
  { field: 'matlName', title: '物资名称', searchType: 'input',hideInTable:true,searchable: true, },
  { field: 'matlType', title: '规格型号', searchType: 'input',hideInTable:true,searchable: true, },
  { field: "orderDate", title: "下单日期", searchType: "date",hideInTable:true,searchable: true, },
]

export const tableButtonJson = {
  buttons: [
    { code: 'create', 
      name: '新增',
      type: "primary",
      showInTop: true,
      tooltip: "新增"
    },
    { code: 'delete', 
      name: '删除',
      type: "primary",
      showInTop: true,
      tooltip: "删除"
    },
    { code: 'publish', 
      name: '登卡',
      type: "primary",
      showInTop: true,
      tooltip: "登卡"
    },
    { code: 'cancelPublish', 
      name: '撤销登卡',
      type: "primary",
      showInTop: true,
      tooltip: "撤销登卡"
    },
    { code: 'print',
      name: '打印',
      type: "primary",
      showInTop: true,
      tooltip: "打印" 
    },
    { code: 'export', 
      name: '导出',
      type: "primary",
      showInTop: true,
      tooltip: "导出" 
    },
    { code: 'modify', 
      name: '修改',
      type: "primary",
      showInTop: false,
      showInRow: true,
      tooltip: "修改", 
    },
    { code: 'report', 
      name: '红冲',
      type: "primary",
      showInTop: false,
      showInRow: true,
      tooltip: "红冲",
    },
  ]
} 

// 新增弹框明细字段
export const matlTableJson = [
  { isShow: true, fixed: false, type: '', key: 'matlCode', prop: 'matlCode', label: '物资编码', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'matlName', prop: 'matlName', label: '物资名称', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'matlType', prop: 'matlType', label: '规格型号/材质/图号', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'matlUnit', prop: 'matlUnit', label: '计量单位', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: 'slot', key: 'credCode', prop: 'credCode', label: '技证号', align: 'center', width: 160, },
  { isShow: true, fixed: false, type: 'slot', key: 'paNum', prop: 'paNum', label: '入库数量', align: 'center', width: 160 ,required: true},
  { isShow: true, fixed: false, type: 'slot', key: 'stkPrice', prop: 'stkPrice', label: '采购单价', align: 'center', width: 160,required: true },
  { isShow: true, fixed: false, type: 'slot', key: 'stkAmount', prop: 'stkAmount', label: '采购金额', align: 'center', width: 160, required: true },
  { isShow: true, fixed: false, type: '', key: 'cardPrice', prop: 'cardPrice', label: '库存单价', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'standardAmount', prop: 'standardAmount', label: '入库金额', align: 'center', width: 160 },
]

export const matlTableButtonJson = [
  // { code: 'choiceMatl', name: '添加物资' },
  { code: 'delete', name: '删除', type: 'inline' },
]

// 打印字段
export const printMatlTableJson = [
  { isShow: true, fixed: false, type: '', key: 'typeIndex', prop: 'typeIndex', label: '序号', align: 'center', width: 50 },
  { isShow: true, fixed: false, type: '', key: 'matlCode', prop: 'matlCode', label: '物资编码', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'matlName', prop: 'matlName', label: '物资名称/规格型号', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'matlUnit', prop: 'matlUnit', label: '单位', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'paNum', prop: 'paNum', label: '数量', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'stkPrice', prop: 'stkPrice', label: '采购单价', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'stkAmount', prop: 'stkAmount', label: '采购金额', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'cardPrice', prop: 'cardPrice', label: '库存单价', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'standardAmount', prop: 'standardAmount', label: '入库金额', align: 'center', width: 160 },
]

// 选择供货单位弹框字段
export const rluTableJson = [
  { isShow: true, fixed: false, type: '', key: 'unitCode', prop: 'unitCode', label: '往来单位编号', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'unitName', prop: 'unitName', label: '往来单位名称', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'type', prop: 'type', label: '往来单位类型', align: 'center', width: 160 },
]

// 调拨单字段
export const rmstorMatlTableJson = [
  { isShow: true, fixed: false, type: '', key: 'matlCode', prop: 'matlCode', label: '物资编码', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'matlName', prop: 'matlName', label: '物资名称', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'matlType', prop: 'matlType', label: '规格型号', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'matlUnit', prop: 'matlUnit', label: '计量单位', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'cardPrice', prop: 'cardPrice', label: '库存单价', align: 'center', width: 160, },
  { isShow: true, fixed: false, type: '', key: 'outsalePrice', prop: 'outsalePrice', label: '调拨销售单价', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'outsaleNum', prop: 'outsaleNum', label: '调拨数量', align: 'center', width: 160, },
  { isShow: true, fixed: false, type: '', key: 'outsaleAmount', prop: 'outsaleAmount', label: '调拨销售金额（元）', align: 'center', width: 160 },
]

// 选择物资
export const tableJsonCheckMaterial = [
  { isShow: true, fixed: false, type: '', key: 'matlCode', prop: 'matlCode', label: '物资编码', align: 'center' },
  { isShow: true, fixed: false, type: '', key: 'matlName', prop: 'matlName', label: '物资名称', align: 'center' },
  { isShow: true, fixed: false, type: '', key: 'matlType', prop: 'matlType', label: '规格型号/图号/材质', align: 'center', },
  { isShow: true, fixed: false, type: '', key: 'matlUnit', prop: 'matlUnit', label: '计量单位', align: 'center', },
  // { isShow: true, fixed: false, type: '', key: 'matlUnit', prop: 'matlUnit', label: '管理权限', align: 'center', },
]

//红冲
export const rmstorRedReversalTableJson = [
  { isShow: true, fixed: false, type: '', key: 'matlCode', prop: 'matlCode', label: '物资编码', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'matlName', prop: 'matlName', label: '物资名称', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'matlType', prop: 'matlType', label: '规格型号/材质/图号', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'matlUnit', prop: 'matlUnit', label: '计量单位', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'credCode', prop: 'credCode', label: '技证号', align: 'center', width: 160, },
  { isShow: true, fixed: false, type: '', key: 'paNum', prop: 'paNum', label: '入库数量', align: 'center', width: 160, },
  { isShow: true, fixed: false, type: 'slot', key: 'RpaNum', prop: 'RpaNum', label: '红冲数量', align: 'center', width: 160, },
  { isShow: true, fixed: false, type: '', key: 'stkPrice', prop: 'stkPrice', label: '采购单价', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'stkAmount', prop: 'stkAmount', label: '采购金额（元）', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: 'slot', key: 'RstkAmount', prop: 'RstkAmount', label: '红冲采购金额（元）', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'cardPrice', prop: 'cardPrice', label: '库存单价', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'standardAmount', prop: 'standardAmount', label: '入库金额（元）', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: 'slot', key: 'RstandardAmount', prop: 'RstandardAmount', label: '红冲入库金额（元）', align: 'center', width: 160 },
]


