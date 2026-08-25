export const tableJson = [
   { isShow: true, fixed: false, key: "ibBillCode", prop: "ibBillCode", label: "入库单号", align: "center", type: "link", width: 180, sortable: true, },
  { isShow: true, fixed: false, key: "invoiceCode", prop: "invoiceCode", label: "发票号", align: "center", width: 180, },
  { isShow: true, fixed: false, key: "supUnitName", prop: "supUnitName", label: "供货单位", align: "center", width: 220 },
  // { isShow: true, fixed: false, key: "supplierName", prop: "supplierName", label: "供应商", align: "center", width: 220, },
  { isShow: true, fixed: false, key: "taxFlagName", prop: "taxFlagName", label: "应税用途", align: "center", width: 150, },
  { isShow: true, fixed: false, key: "bmName", prop: "bmName", label: "业务员", align: "center", width: 150, },
  { isShow: true, fixed: false, key: "plantName", prop: "plantName", label: "用料地区", align: "center", width: 150, },
  { isShow: true, fixed: false, key: "depotName", prop: "depotName", label: "仓库", align: "center", width: 150, },
  { isShow: true, fixed: false, key: "partitionName", prop: "partitionName", label: "仓库分区", align: "center", width: 150, },
  { isShow: true, fixed: false, key: "flag", prop: "flag", label: "状态", align: "center", type: "slot", width: 120, },
  { isShow: true, fixed: false, key: "orderDate", prop: "orderDate", label: "下单日期", align: "center", width: 150, type: "slot", },
  { isShow: true, fixed: false, key: "noteDate", prop: "noteDate", label: "登卡日期", align: "center", width: 150, type: "slot", },
  { isShow: true, fixed: false, key: "matlAmount", prop: "matlAmount", label: "料款（元）", align: "center", width: 150, },
];

export const tableButtonJson = [
  {code: 'print', name: "打印", type: "inline", disabled: false},
];

export const supplierDialogTableJson = [
   { isShow: true, fixed: false, key: "unitCode", prop: "unitCode", label: "往来单位编码", align: "center" },
  { isShow: true, fixed: false, key: "unitName", prop: "unitName", label: "往来单位名称", align: "center" },
  { isShow: true, fixed: false, key: "type", prop: "type", label: "往来单位类型", align: "center" },
];

export const detailDialogTableJson = [
  { isShow: true, fixed: false, key: "matlCode", prop: "matlCode", label: "物资编码", align: "center", width: 160, },
  { isShow: true, fixed: false, key: "matlName", prop: "matlName", label: "物资名称", align: "center", width: 220 },
  { isShow: true, fixed: false, key: "matlType", prop: "matlType", label: "规格型号/图号/材质", align: "center", width: 180, type: "slot"},
  { isShow: true, fixed: false, key: "matlUnit", prop: "matlUnit", label: "计量单位", align: "center", width: 120 },
  //输入框（数字、必填），默认显示该条物资验收通过且未入库的数量，可手动修改。未引用采购订单入库数量手输。
  { isShow: true, fixed: false, key: "paNum", prop: "paNum", label: "入库数量", align: "center", width: 150, },
  //引入采购订单后会显示此字段，为采购订单单价，不引入则不显示。
  { isShow: true, fixed: false, key: "stkPrice", prop: "stkPrice", label: "采购单价", align: "center", width: 180, },
  { isShow: true, fixed: false, key: "orderPrice", prop: "orderPrice", label: "订单单价", align: "center", width: 130, },
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

export const npdetailDialogTableJson = [
  { isShow: true, fixed: false, key: "matlCode", prop: "matlCode", label: "物资编码", align: "center", width: 160, },
  { isShow: true, fixed: false, key: "matlName", prop: "matlName", label: "物资名称", align: "center", width: 220 },
  { isShow: true, fixed: false, key: "matlType", prop: "matlType", label: "规格型号/图号/材质", align: "center", width: 180, type: "slot"},
  { isShow: true, fixed: false, key: "matlUnit", prop: "matlUnit", label: "计量单位", align: "center", width: 120 },
  //输入框（数字、必填），默认显示该条物资验收通过且未入库的数量，可手动修改。未引用采购订单入库数量手输。
  { isShow: true, fixed: false, key: "paNum", prop: "paNum", label: "入库数量", align: "center", width: 150, },
  //引入采购订单后会显示此字段，为采购订单单价，不引入则不显示。
  { isShow: true, fixed: false, key: "stkPrice", prop: "stkPrice", label: "采购单价", align: "center", width: 180, },
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
];