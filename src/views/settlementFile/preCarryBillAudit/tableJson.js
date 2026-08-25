import { statusObj } from '@/utils/dictionary'

export const tableJson = [
  {searchType: '', field: 'billType', title: '单据类型', align: 'center',},
  {searchType: '', field: 'billCode', title: '单据号', align: 'center',slotName: 'billCode-cell',},
  {searchType: '', field: 'bmName', title: '制单人', align: 'center',},
  {searchType: '', field: 'orderDate', title: '下单日期', align: 'center',},
  {searchType: '', field: 'flag', title: '单据状态', align: 'center',},

  // 搜索
  {field: 'yearMonth', title: '财务年月', searchType: 'date',dateType: "month",searchable: true,hideInTable:true},
  {field: 'billType', title: '单据类型', searchType: 'select',searchable: true,hideInTable:true,searchProps:{
    options:[
    {value: "入库单", label: "入库单"},
    {value: "出库单", label: "出库单"},
    {value: "退料单", label: "退料单"},
    {value: "移库单", label: "移库单"},
    {value: "调拨(销售)单", label: "调拨(销售)单"},
    {value: "调整单", label: "调整单"},
    {value: "调价单", label: "调价单"},
  ]
  }},
  {field: 'billCode', title: '单据号', searchType: 'input',searchable: true,hideInTable:true},
  {field: 'isNoStorageAllotFlag', title: '单据状态', searchType: 'select',searchable: true,hideInTable:true,dependsOn: ['billType'],searchProps:{
    options:[],
    clearable:true,
  }, async onDependencyChange({
      form,
      changedField,
      setFieldValue,
      setFieldProps,
  }) {
      if (changedField !== 'billType') return
      if (!form.billType) {
        setFieldProps('isNoStorageAllotFlag',{options:[]})
        setFieldValue('isNoStorageAllotFlag','')
        return
      }
      const isDiaoBo = form.billType === "调拨(销售)单";
      const flagOptions = [{ value: "0", label: "未登卡" }];
      if (isDiaoBo) {
        flagOptions.push({ value: "1", label: "当月末入库调拨单" });
      }
      setFieldProps('isNoStorageAllotFlag',{options:flagOptions})
      if (!isDiaoBo) {
       setFieldValue('isNoStorageAllotFlag','')
      }
      setFieldProps('depotCode',{options:depotOptions})
      setFieldValue('depotCode','')
  }},
]

export const toolbarConfig = {

}

// 出库单明细字段
export const matlTableJson = [
  { isShow: true, fixed: false, type: '', key: 'matlCode', prop: 'matlCode', label: '物资编码', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'matlName', prop: 'matlName', label: '物资名称', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'matlType', prop: 'matlType', label: '规格型号/材质/图号', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'matlUnit', prop: 'matlUnit', label: '计量单位', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'cardPrice', prop: 'cardPrice', label: '技证号', align: 'center', width: 160, },
  { isShow: true, fixed: false, type: '', key: 'batchNo', prop: 'batchNo', label: '批次号', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: 'date', key: 'productionDate', prop: 'productionDate', label: '生产日期', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: 'date', key: 'expirationDate', prop: 'expirationDate', label: '到期日期', align: 'center', width: 160, },
  { isShow: true, fixed: false, type: '', key: 'outNum', prop: 'outNum', label: '出库数量', align: 'center', width: 160, required: true },
  { isShow: true, fixed: false, type: '', key: 'price', prop: 'price', label: '库存单价（元）', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'outAmount', prop: 'outAmount', label: '出库金额（元）', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'noOutNum', prop: 'noOutNum', label: '未登卡数量', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'nowNum', prop: 'nowNum', label: '结存数量', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'templateName', prop: 'templateName', label: '报账模板', align: 'center', width: 160 },
]

// 入库单字段
export const detailDialogTableJson = [
  { isShow: true, fixed: false, key: "matlCode", prop: "matlCode", label: "物资编码", align: "center", width: 160, },
  { isShow: true, fixed: false, key: "matlName", prop: "matlName", label: "物资名称", align: "center", width: 220 },
  { isShow: true, fixed: false, key: "matlType", prop: "matlType", label: "规格型号/图号/材质", align: "center", width: 180, type: "slot"},
  { isShow: true, fixed: false, key: "matlUnit", prop: "matlUnit", label: "计量单位", align: "center", width: 120 },
  //输入框（数字、必填），默认显示该条物资验收通过且未入库的数量，可手动修改。未引用采购订单入库数量手输。
  { isShow: true, fixed: false, key: "paNum", prop: "paNum", label: "入库数量", align: "center", width: 150, },
  //引入采购订单后会显示此字段，为采购订单单价，不引入则不显示。
  { isShow: true, fixed: false, key: "stkPrice", prop: "stkPrice", label: "采购单价", align: "center", width: 180, },
  { isShow: false, fixed: false, key: "orderPrice", prop: "orderPrice", label: "订单单价", align: "center", width: 130, },
  //输入框（数字、必填），默认值为订单单价×入库数量默认值，可手动修改。未引用采购订单采购金额手输。
  { isShow: true, fixed: false, key: "stkAmount", prop: "stkAmount", label: "采购金额", align: "center", width: 180, },
  { isShow: true, fixed: false, key: "cardPrice", prop: "cardPrice", label: "库存单价", align: "center", width: 180, },
  // 库存单价x入库数量
  { isShow: true, fixed: false, key: "standardAmount", prop: "standardAmount", label: "入库金额", align: "center", width: 180,},
  //技证号，验收时录入的技证号带过来（外购），可修改
  { isShow: true, fixed: false, key: "credCode", prop: "credCode", label: "技证号", align: "center", width: 160, },
  { isShow: true, fixed: false, key: "productionDate", prop: "productionDate", label: "生产日期", align: "center", width: 180, type: "slot"},
  { isShow: true, fixed: false, key: "validityPeriod", prop: "validityPeriod", label: "有效期", align: "center", width: 120, },
  { isShow: true, fixed: false, key: "validityPeriodUnit", prop: "validityPeriodUnit", label: "有效期单位", align: "center", width: 120, },
  { isShow: true, fixed: false, key: "expirationDate", prop: "expirationDate", label: "到期日期", align: "center", width: 180, type: "slot"},
  { isShow: true, fixed: false, key: "batchNo", prop: "batchNo", label: "批次号", align: "center", width: 160, },
  { isShow: true, fixed: false, key: "accPic", prop: "accPic", label: "验收照片", align: "center", width: 180, type: "link" },
  { isShow: true, fixed: false, key: "contractPic", prop: "contractPic", label: "合同照片", align: "center", width: 180, type: "link" },
];

// 数据管理入库单
export const quantityTableJson = [
  {isShow: true, fixed: false, type: '', key: 'matlCode', prop: 'matlCode', label: '物资编码', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'matlName', prop: 'matlName', label: '物资名称', align: 'center', width: 160},
  {isShow: true, fixed: false, type: 'slot', key: 'matlType', prop: 'matlType', label: '规格型号/材质/图号', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'matlUnit', prop: 'matlUnit', label: '计量单位', align: 'center', width: 160},
  {isShow: true, fixed: false, type: 'slot', key: 'credCode', prop: 'credCode', label: '技证号', align: 'center', width: 160},
  {isShow: true, fixed: false, type: 'slot', key: 'num', prop: 'num', label: '入库数量', align: 'right', width: 160, required: true},
  {isShow: true, fixed: false, type: 'slot', key: 'cardPrice', prop: 'cardPrice', label: '单价', align: 'right', width: 200, required: true},
]

// 数据管理入库单选择物资弹框字段
export const rmstorMatlTableJson = [
  {isShow: true, fixed: false, type: '', key: 'matlCode', prop: 'matlCode', label: '物资编码', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'matlName', prop: 'matlName', label: '物资名称', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'matlType', prop: 'matlType', label: '规格型号', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'matlRaw', prop: 'matlRaw', label: '材质', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'matlpCode', prop: 'matlpCode', label: '图号', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'matlUnit', prop: 'matlUnit', label: '计量单位', align: 'center', width: 160},
]

// 数据管理出库单
export const quantityOutboundMatlTableJson = [
  {isShow: true, fixed: false, type: '', key: 'matlCode', prop: 'matlCode', label: '物资编码', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'matlName', prop: 'matlName', label: '物资名称', align: 'center', width: 160},
  {isShow: true, fixed: false, type: 'slot', key: 'matlType', prop: 'matlType', label: '规格型号/材质/图号', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'matlUnit', prop: 'matlUnit', label: '计量单位', align: 'center', width: 160},
  {isShow: true, fixed: false, type: 'slot', key: 'credCode', prop: 'credCode', label: '技证号', align: 'center', width: 160},
  {isShow: true, fixed: false, type: 'slot', key: 'outNum', prop: 'outNum', label: '出库数量', align: 'right', width: 160, required: true},
  {isShow: true, fixed: false, type: '', key: 'price', prop: 'price', label: '库存单价(元)', align: 'right', width: 200},
  {isShow: true, fixed: false, type: '', key: 'nowNum', prop: 'nowNum', label: '结存数量', align: 'right', width: 200},
]

// 内部调拨单
export const internalMatlTableJson = [
  {isShow: true, fixed: false, type: '', key: 'matlCode', prop: 'matlCode', label: '物资编码', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'matlName', prop: 'matlName', label: '物资名称', align: 'center', width: 160},
  {isShow: true, fixed: false, type: 'slot', key: 'matlType', prop: 'matlType', label: '规格型号/材质/图号', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'matlUnit', prop: 'matlUnit', label: '计量单位', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'batchNo', prop: 'batchNo', label: '移出批次号', align: 'center', width: 160},
  {isShow: true, fixed: false, type: 'slot', key: 'tsNum', prop: 'tsNum', label: '移出数量', align: 'right', width: 160, required: true},
  {isShow: true, fixed: false, type: '', key: 'cardPrice', prop: 'cardPrice', label: '库存单价(元)', align: 'right', width: 200},
  {isShow: true, fixed: false, type: '', key: 'tsAmount', prop: 'tsAmount', label: '移出金额(元)', align: 'right', width: 160},
  {isShow: true, fixed: false, type: '', key: 'stockNum', prop: 'stockNum', label: '结存数量', align: 'right', width: 160},
  {isShow: true, fixed: false, type: '', key: 'noOutNum', prop: 'noOutNum', label: '未登卡数量', align: 'right', width: 160},
]

// 对外调拨单
export const externalMatlTableJson = [
  {isShow: true, fixed: false, type: '', key: 'matlCode', prop: 'matlCode', label: '物资编码', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'matlName', prop: 'matlName', label: '物资名称', align: 'center', width: 160},
  {isShow: true, fixed: false, type: 'slot', key: 'matlType', prop: 'matlType', label: '规格型号/材质/图号', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'matlUnit', prop: 'matlUnit', label: '计量单位', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'batchNo', prop: 'batchNo', label: '批次号', align: 'center', width: 160},
  {isShow: true, fixed: false, type: 'slot', key: 'outsaleNum', prop: 'outsaleNum', label: '调拨数量', align: 'right', width: 160, required: true},
  {isShow: true, fixed: false, type: '', key: 'cardPrice', prop: 'cardPrice', label: '库存单价(元)', align: 'right', width: 200},
  {isShow: true, fixed: false, type: 'slot', key: 'outsalePrice', prop: 'outsalePrice', label: '调拨单价(元)', align: 'right', width: 160, required: true},
  {isShow: true, fixed: false, type: '', key: 'outsaleAmount', prop: 'outsaleAmount', label: '调拨金额(元)', align: 'right', width: 160},
  {isShow: true, fixed: false, type: '', key: 'cardNum', prop: 'cardNum', label: '结存数量', align: 'right', width: 160},
]

// 退料单
export const tableJsonDetail = [
  {isShow: true, fixed: false, type: '', key: 'matlCode', prop: 'matlCode', label: '物资编码', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'matlName', prop: 'matlName', label: '物资名称', align: 'center', width: 160},
  {isShow: true, fixed: false, type: 'slot', key: 'matlType', prop: 'matlType', label: '规格型号/材质/图号', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'matlUnit', prop: 'matlUnit', label: '计量单位', align: 'center', width: 160},
  {isShow: true, fixed: false, type: 'slot', key: 'rmNum', prop: 'rmNum', label: '退料数量', align: 'right', width: 160, required: true},
  {isShow: true, fixed: false, type: '', key: 'price', prop: 'price', label: '库存单价（元）', align: 'right', width: 160},
  {isShow: true, fixed: false, type: '', key: 'rmAmount', prop: 'rmAmount', label: '退料金额（元）', align: 'right', width: 160},
  // {isShow: true, fixed: false, type: '', key: 'stockNum', prop: 'stockNum', label: '出库数量', align: 'right', width: 160},
]

// 调整单
export const adjustMatlTableJson = [
  {isShow: true, fixed: false, type: '', key: 'matlCode', prop: 'matlCode', label: '物资编码', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'matlName', prop: 'matlName', label: '物资名称', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'matlType', prop: 'matlType', label: '规格型号/材质/图号', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'matlUnit', prop: 'matlUnit', label: '计量单位', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'batchNo', prop: 'batchNo', label: '批次号', align: 'center', width: 160},
  {isShow: true, fixed: false, type: 'date', key: 'productionDate', prop: 'productionDate', label: '生产日期', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'validityPeriod', prop: 'validityPeriod', label: '有效期', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'validityPeriodUnit', prop: 'validityPeriodUnit', label: '有效期单位', align: 'center', width: 160},
  {isShow: true, fixed: false, type: 'date', key: 'expirationDate', prop: 'expirationDate', label: '到期日期', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'cardPrice', prop: 'cardPrice', label: '库存单价（元）', align: 'right', width: 160,},
  {isShow: true, fixed: false, type: '', key: 'prNum', prop: 'prNum', label: '调整前数量', align: 'right', width: 160},
  {isShow: true, fixed: false, type: '', key: 'prAmount', prop: 'prAmount', label: '调整前金额', align: 'right', width: 160},
  {isShow: true, fixed: false, type: 'slot', key: 'ptNum', prop: 'ptNum', label: '调整后数量', align: 'right', width: 160,required: true},
  {isShow: true, fixed: false, type: '', key: 'ptAmount', prop: 'ptAmount', label: '调整后金额', align: 'right', width: 160},
  {isShow: true, fixed: false, type: '', key: 'profitAmount', prop: 'profitAmount', label: '盈亏金额（元）', align: 'right', width: 160},
]

// 调价单
export const priceMatlTableJson = [
  {isShow: true, fixed: false, type: '', key: 'matlCode', prop: 'matlCode', label: '物资编码', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'matlName', prop: 'matlName', label: '物资名称', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'matlType', prop: 'matlType', label: '规格型号/材质/图号', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'matlUnit', prop: 'matlUnit', label: '计量单位', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'batchNo', prop: 'batchNo', label: '批次号', align: 'center', width: 160},
  {isShow: true, fixed: false, type: 'date', key: 'productionDate', prop: 'productionDate', label: '生产日期', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'validityPeriod', prop: 'validityPeriod', label: '有效期', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'validityPeriodUnit', prop: 'validityPeriodUnit', label: '有效期单位', align: 'center', width: 160},
  {isShow: true, fixed: false, type: 'date', key: 'expirationDate', prop: 'expirationDate', label: '到期日期', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'num', prop: 'num', label: '库存数量', align: 'right', width: 160,},
  {isShow: true, fixed: false, type: '', key: 'prPrice', prop: 'prPrice', label: '前库存单价（元）', align: 'right', width: 160},
  {isShow: true, fixed: false, type: 'slot', key: 'ptPrice', prop: 'ptPrice', label: '后库存单价（元）', align: 'right', width: 160,required: true},
  {isShow: true, fixed: false, type: '', key: 'profitAmount', prop: 'profitAmount', label: '盈亏金额（元）', align: 'right', width: 160},
]