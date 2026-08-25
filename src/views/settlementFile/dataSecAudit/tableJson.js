import { statusObj } from '@/utils/dictionary'

export const tableJson = [
  {searchType: '', field: 'plantName', title: '用料地区', align: 'center',},
  {searchType: '', field: 'depotName', title: '仓库', align: 'center',},
  {searchType: '', field: 'partitionName', title: '仓库分区', align: 'center',},
  {searchType: '', field: 'batchNo', title: '批次号', align: 'center',},
  {searchType: '', field: 'matlCode', title: '物资编码', align: 'center',},
  {searchType: '', field: 'matlName', title: '物资名称', align: 'center',},
  {searchType: '', field: 'matlType', title: '规格型号/图号/材质', align: 'center',},
  {searchType: '', field: 'matlUnit', title: '计量单位', align: 'center',},
  {searchType: '', field: 'cardPrice', title: '库存单价', align: 'center',},
  {searchType: '', field: 'initialNum', title: '卡片期初', align: 'center',},
  {searchType: '', field: 'nowInNum', title: '卡片收入合计=', align: 'center',},
  {searchType: '', field: 'intoStorageNum', title: '(入库+', align: 'center',},
  {searchType: '', field: 'returnMatlNum', title: '退料)', align: 'center',},
  {searchType: '', field: 'nowOutNum', title: '卡片支出合计=', align: 'center',},
  {searchType: '', field: 'outWarehouseNum', title: '(出库+', align: 'center',},
  {searchType: '', field: 'allotNum', title: '调拨(销售))', align: 'center',},
  {searchType: '', field: 'profitLoseNum', title: '卡片调整合计=', align: 'center',},
  {searchType: '', field: 'movementIntoNum', title: '(+移库移入', align: 'center',},
  {searchType: '', field: 'movementOutNum', title: '-移库移出', align: 'center',},
  {searchType: '', field: 'adjustmentNum', title: '+调整)', align: 'center',},
  {searchType: '', field: 'nowNum', title: '卡片期末', align: 'center',},

  // 搜索
  {field: 'yearMonth', title: '财务年月', searchType: 'date',searchable: true,hideInTable:true},
  {field: 'plantCode', title: '用料地区', searchType: 'select',searchable: true,hideInTable:true},
  {field: 'depotCode', title: '仓库', searchType: 'select',searchable: true,hideInTable:true},
  {field: 'partitionCode', title: '仓库分区', searchType: 'select',searchable: true,hideInTable:true},
  {field: 'verifyType', title: '校验类别', searchType: 'select',searchable: true,hideInTable:true,searchPorps:{
    options:[
    {value:1, label: "数量"},
    {value:0, label: "金额"}
  ],
    clearable: true,
  }}
]

export const tablePriceJson = [
  {searchType: '', field: 'plantName', title: '用料地区', align: 'center',},
  {searchType: '', field: 'depotName', title: '仓库', align: 'center',},
  {searchType: '', field: 'partitionName', title: '仓库分区', align: 'center',},
  {searchType: '', field: 'batchNo', title: '批次号', align: 'center',},
  {searchType: '', field: 'matlCode', title: '物资编码', align: 'center',},
  {searchType: '', field: 'matlName', title: '物资名称', align: 'center',},
  {searchType: '', field: 'matlType', title: '规格型号/图号/材质', align: 'center',},
  {searchType: '', field: 'matlUnit', title: '计量单位', align: 'center',},
  {searchType: '', field: 'cardPrice', title: '库存单价', align: 'center',},
  {searchType: '', field: 'initialAmount', title: '卡片期初', align: 'center',},
  {searchType: '', field: 'nowInAmount', title: '卡片收入合计=', align: 'center',},
  {searchType: '', field: 'intoStorageAmount', title: '(入库+', align: 'center',},
  {searchType: '', field: 'returnMatlAmount', title: '退料)', align: 'center',},
  {searchType: '', field: 'nowOutAmount', title: '卡片支出合计=', align: 'center',},
  {searchType: '', field: 'outWarehouseAmount', title: '(出库+', align: 'center',},
  {searchType: '', field: 'allotAmount', title: '调拨(销售))', align: 'center',},
  {searchType: '', field: 'profitLoseAmount', title: '卡片调整合计=', align: 'center',},
  {searchType: '', field: 'movementIntoAmount', title: '(+移库移入', align: 'center',},
  {searchType: '', field: 'movementOutAmount', title: '-移库移出', align: 'center',},
  {searchType: '', field: 'adjustmentAmount', title: '+调整)', align: 'center',},
  {searchType: '', field: 'nowAmount', title: '卡片期末', align: 'center',},

   // 搜索
  {field: 'yearMonth', title: '财务年月', searchType: 'date',searchable: true,hideInTable:true},
  {field: 'plantCode', title: '用料地区', searchType: 'select',searchable: true,hideInTable:true},
  {field: 'depotCode', title: '仓库', searchType: 'select',searchable: true,hideInTable:true},
  {field: 'partitionCode', title: '仓库分区', searchType: 'select',searchable: true,hideInTable:true},
  {field: 'verifyType', title: '校验类别', searchType: 'select',searchable: true,hideInTable:true,searchPorps:{
    options:[
    {value:1, label: "数量"},
    {value:0, label: "金额"}
  ],
    clearable: true,
  }}
]

export const toolbarConfig = {
  buttons:[
  {
    code: 'verification', 
    name: '数据检查',
    type: "primary",
    showInTop: true,
    tooltip: "数据检查",
  },
  {
    code: 'updateCred', 
    name: '更正卡片数据',
    type: "primary",
    showInTop: true,
    tooltip: "更正卡片数据",
  },
  {
    code: 'viewFormula',
    name: '查看计算公式',
    type: 'primary',
    showInTop: true,
    tooltip: '查看计算公式'
  }
]
}