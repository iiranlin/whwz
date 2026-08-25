
export const tableJson = [
  { isShow: true, fixed: false, key: "ibBillCode", prop: "ibBillCode", label: "入库单号", align: "center", type: "link", width: 180, sortable: true},
  { isShow: true, fixed: false, key: "invoiceCode", prop: "invoiceCode", label: "发票号", align: "center", width: 180, },
  { isShow: true, fixed: false, key: "supUnitName", prop: "supUnitName", label: "自制项目/供货单位", align: "center", width: 220 },
  { isShow: true, fixed: false, key: "supplierName", prop: "supplierName", label: "供货商名称", align: "center", width: 220, },
  { isShow: true, fixed: false, key: "taxFlagName", prop: "taxFlagName", label: "应税用途", align: "center", width: 150, },
  { isShow: true, fixed: false, key: "bmName", prop: "bmName", label: "业务员", align: "center", width: 150, },
  { isShow: true, fixed: false, key: "plantName", prop: "plantName", label: "用料地区", align: "center", width: 150, },
  { isShow: true, fixed: false, key: "depotName", prop: "depotName", label: "仓库", align: "center", width: 150, },
  { isShow: true, fixed: false, key: "partitionName", prop: "partitionName", label: "仓库分区", align: "center", width: 150, },
  { isShow: true, fixed: false, key: "flag", prop: "flag", label: "状态", align: "center", type: "slot", width: 120, },
  { isShow: true, fixed: false, key: "orderDate", prop: "orderDate", label: "下单日期", align: "center", width: 150, type: "slot", },
  { isShow: true, fixed: false, key: "noteDate", prop: "noteDate", label: "登卡日期", align: "center", width: 150, type: "slot", },
  { isShow: true, fixed: false, key: "matlAmount", prop: "matlAmount", label: "料款（元）", align: "center", width: 150, },
  { isShow: true, fixed: false, key: "incotaxAmount", prop: "incotaxAmount", label: "税额（元）", align: "center", width: 150, },
  { isShow: true, fixed: false, key: "taxMatlAmount", prop: "taxMatlAmount", label: "含税料款（元）", align: "center", width: 150, },
];

// 外购维护页使用
export const pTableJson = [
  { isShow: true, fixed: false, key: "ibBillCode", prop: "ibBillCode", label: "入库单号", align: "center", type: "link", width: 180, sortable: true},
  { isShow: true, fixed: false, key: "invoiceCode", prop: "invoiceCode", label: "发票号", align: "center", width: 180, },
  // { isShow: true, fixed: false, key: "supUnitName", prop: "supUnitName", label: "自制项目/供货单位", align: "center", width: 220 },
  { isShow: true, fixed: false, key: "supplierName", prop: "supplierName", label: "供应商", align: "center", width: 220, },
  { isShow: true, fixed: false, key: "taxFlagName", prop: "taxFlagName", label: "应税用途", align: "center", width: 150, },
  { isShow: true, fixed: false, key: "bmName", prop: "bmName", label: "业务员", align: "center", width: 150, },
  { isShow: true, fixed: false, key: "plantName", prop: "plantName", label: "用料地区", align: "center", width: 150, },
  { isShow: true, fixed: false, key: "depotName", prop: "depotName", label: "仓库", align: "center", width: 150, },
  { isShow: true, fixed: false, key: "partitionName", prop: "partitionName", label: "仓库分区", align: "center", width: 150, },
  { isShow: true, fixed: false, key: "flag", prop: "flag", label: "状态", align: "center", type: "slot", width: 120, },
  { isShow: true, fixed: false, key: "orderDate", prop: "orderDate", label: "下单日期", align: "center", width: 150, type: "slot", },
  { isShow: true, fixed: false, key: "noteDate", prop: "noteDate", label: "登卡日期", align: "center", width: 150, type: "slot", },
  { isShow: true, fixed: false, key: "matlAmount", prop: "matlAmount", label: "料款（元）", align: "center", width: 150, },
  { isShow: true, fixed: false, key: "incotaxAmount", prop: "incotaxAmount", label: "税额（元）", align: "center", width: 150, },
  { isShow: true, fixed: false, key: "taxMatlAmount", prop: "taxMatlAmount", label: "含税料款（元）", align: "center", width: 150, },
];

// 修旧利废、旧品
export const noSupTableJson = [
  { isShow: true, fixed: false, key: "ibBillCode", prop: "ibBillCode", label: "入库单号", align: "center", type: "link", width: 180, sortable: true},
  { isShow: true, fixed: false, key: "invoiceCode", prop: "invoiceCode", label: "发票号", align: "center", width: 180, },
  { isShow: true, fixed: false, key: "taxFlagName", prop: "taxFlagName", label: "应税用途", align: "center", width: 150, },
  { isShow: true, fixed: false, key: "bmName", prop: "bmName", label: "业务员", align: "center", width: 150, },
  { isShow: true, fixed: false, key: "plantName", prop: "plantName", label: "用料地区", align: "center", width: 150, },
  { isShow: true, fixed: false, key: "depotName", prop: "depotName", label: "仓库", align: "center", width: 150, },
  { isShow: true, fixed: false, key: "partitionName", prop: "partitionName", label: "仓库分区", align: "center", width: 150, },
  { isShow: true, fixed: false, key: "flag", prop: "flag", label: "状态", align: "center", type: "slot", width: 120, },
  { isShow: true, fixed: false, key: "orderDate", prop: "orderDate", label: "下单日期", align: "center", width: 150, type: "slot", },
  { isShow: true, fixed: false, key: "noteDate", prop: "noteDate", label: "登卡日期", align: "center", width: 150, type: "slot", },
  { isShow: true, fixed: false, key: "matlAmount", prop: "matlAmount", label: "料款（元）", align: "center", width: 150, },
  { isShow: true, fixed: false, key: "incotaxAmount", prop: "incotaxAmount", label: "税额（元）", align: "center", width: 150, },
  { isShow: true, fixed: false, key: "taxMatlAmount", prop: "taxMatlAmount", label: "含税料款（元）", align: "center", width: 150, },
];

// 委外修、其他来源
export const singleSupTableJson = [
  { isShow: true, fixed: false, key: "ibBillCode", prop: "ibBillCode", label: "入库单号", align: "center", type: "link", width: 180, sortable: true},
  { isShow: true, fixed: false, key: "invoiceCode", prop: "invoiceCode", label: "发票号", align: "center", width: 180, },
  { isShow: true, fixed: false, key: "supUnitName", prop: "supUnitName", label: "供货单位", align: "center", width: 220 },
  { isShow: true, fixed: false, key: "taxFlagName", prop: "taxFlagName", label: "应税用途", align: "center", width: 150, },
  { isShow: true, fixed: false, key: "bmName", prop: "bmName", label: "业务员", align: "center", width: 150, },
  { isShow: true, fixed: false, key: "plantName", prop: "plantName", label: "用料地区", align: "center", width: 150, },
  { isShow: true, fixed: false, key: "depotName", prop: "depotName", label: "仓库", align: "center", width: 150, },
  { isShow: true, fixed: false, key: "partitionName", prop: "partitionName", label: "仓库分区", align: "center", width: 150, },
  { isShow: true, fixed: false, key: "flag", prop: "flag", label: "状态", align: "center", type: "slot", width: 120, },
  { isShow: true, fixed: false, key: "orderDate", prop: "orderDate", label: "下单日期", align: "center", width: 150, type: "slot", },
  { isShow: true, fixed: false, key: "noteDate", prop: "noteDate", label: "登卡日期", align: "center", width: 150, type: "slot", },
  { isShow: true, fixed: false, key: "matlAmount", prop: "matlAmount", label: "料款（元）", align: "center", width: 150, },
  { isShow: true, fixed: false, key: "incotaxAmount", prop: "incotaxAmount", label: "税额（元）", align: "center", width: 150, },
  { isShow: true, fixed: false, key: "taxMatlAmount", prop: "taxMatlAmount", label: "含税料款（元）", align: "center", width: 150, },
];

// 调拨
export const outsaleSingleSupTableJson = [
  { isShow: true, fixed: false, key: "ibBillCode", prop: "ibBillCode", label: "入库单号", align: "center", type: "link", width: 180, sortable: true},
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
  { isShow: true, fixed: false, key: "incotaxAmount", prop: "incotaxAmount", label: "税额（元）", align: "center", width: 150, },
  { isShow: true, fixed: false, key: "taxMatlAmount", prop: "taxMatlAmount", label: "含税料款（元）", align: "center", width: 150, },
];

export const topTableButtonJson = [
  {code: 'add', name: "新增"},
  {code: 'del', name: "删除"},
  {code: 'board', name: "登卡"},
  {code: 'revokeBoard', name: "撤销登卡"},
  {code: 'print', name: "打印"},
  {code: 'export', name: "导出"},
]

export const tableButtonJson = [
  {code: 'redReversal', name: "红冲", type: "inline", disabled: false},
  {code: 'edit', name: "修改", type: "inline", disabled: false},
  {code: 'print', name: "打印", type: "inline", disabled: false},
];

// 入库单新增-入库单明细信息表格
export const createDialogTableJson = [
  { isShow: true, fixed: false, key: "matlCode", prop: "matlCode", label: "物资编码", align: "center", width: 160, required: true, },
  { isShow: true, fixed: false, key: "matlName", prop: "matlName", label: "物资名称", align: "center", width: 220 },
  { isShow: true, fixed: false, key: "matlType", prop: "matlType", label: "规格型号/图号/材质", align: "center", width: 180, type: "slot" },
  { isShow: true, fixed: false, key: "matlUnit", prop: "matlUnit", label: "计量单位", align: "center", width: 120 },
  //输入框（数字、必填），默认显示该条物资验收通过且未入库的数量，可手动修改。未引用采购订单入库数量手输。
  { isShow: true, fixed: false, key: "paNum", prop: "paNum", label: "入库数量", align: "center", width: 150, type: "slot", required: true, },
  //引入采购订单后会显示此字段，为采购订单单价，不引入则不显示。
  { isShow: true, fixed: false, key: "stkPrice", prop: "stkPrice", label: "采购单价", align: "center", width: 180, type: "slot", required: true, },
  { isShow: false, fixed: false, key: "orderPrice", prop: "orderPrice", label: "订单单价", align: "center", width: 130, },
  //输入框（数字、必填），默认值为订单单价×入库数量默认值，可手动修改。未引用采购订单采购金额手输。
  { isShow: true, fixed: false, key: "stkAmount", prop: "stkAmount", label: "采购金额", align: "center", width: 180, type: "slot", required: true, },
  { isShow: true, fixed: false, key: "cardPrice", prop: "cardPrice", label: "库存单价", align: "center", width: 180, type: "slot", required: true,},
  // 库存单价x入库数量
  { isShow: true, fixed: false, key: "standardAmount", prop: "standardAmount", label: "入库金额", align: "center", width: 180, type: "slot" },
  //技证号，验收时录入的技证号带过来（外购），可修改
  { isShow: true, fixed: false, key: "credCode", prop: "credCode", label: "技证号", align: "center", width: 160, type: "slot" },
  { isShow: true, fixed: false, key: "productionDate", prop: "productionDate", label: "生产日期", align: "center", width: 180, type: "slot" },
  { isShow: true, fixed: false, key: "validityPeriod", prop: "validityPeriod", label: "有效期", align: "center", width: 120, type: "slot" },
  { isShow: true, fixed: false, key: "validityPeriodUnit", prop: "validityPeriodUnit", label: "有效期单位", align: "center", width: 120, type: "slot" },
  { isShow: true, fixed: false, key: "expirationDate", prop: "expirationDate", label: "到期日期", align: "center", width: 180, type: "slot" },
];

// 入库单新增-入库单明细信息表格-含订单单价、验收照片、合同照片
export const pCreateDialogTableJson = [
  { isShow: true, fixed: false, key: "matlCode", prop: "matlCode", label: "物资编码", align: "center", width: 160, required: true, },
  { isShow: true, fixed: false, key: "matlName", prop: "matlName", label: "物资名称", align: "center", width: 220 },
  { isShow: true, fixed: false, key: "matlType", prop: "matlType", label: "规格型号/图号/材质", align: "center", width: 180, type: "slot" },
  { isShow: true, fixed: false, key: "matlUnit", prop: "matlUnit", label: "计量单位", align: "center", width: 120 },
  //输入框（数字、必填），默认显示该条物资验收通过且未入库的数量，可手动修改。未引用采购订单入库数量手输。
  { isShow: true, fixed: false, key: "paNum", prop: "paNum", label: "入库数量", align: "center", width: 150, type: "slot", required: true, },
  //引入采购订单后会显示此字段，为采购订单单价，不引入则不显示。
  { isShow: true, fixed: false, key: "stkPrice", prop: "stkPrice", label: "采购单价", align: "center", width: 180, type: "slot", required: true, },
  { isShow: true, fixed: false, key: "orderPrice", prop: "orderPrice", label: "订单单价", align: "center", width: 130, },
  //输入框（数字、必填），默认值为订单单价×入库数量默认值，可手动修改。未引用采购订单采购金额手输。
  { isShow: true, fixed: false, key: "stkAmount", prop: "stkAmount", label: "采购金额", align: "center", width: 180, type: "slot", required: true, },
  { isShow: true, fixed: false, key: "cardPrice", prop: "cardPrice", label: "库存单价", align: "center", width: 180, type: "slot", required: true,},
  // 库存单价x入库数量
  { isShow: true, fixed: false, key: "standardAmount", prop: "standardAmount", label: "入库金额", align: "center", width: 180, type: "slot" },
  //技证号，验收时录入的技证号带过来（外购），可修改
  { isShow: true, fixed: false, key: "credCode", prop: "credCode", label: "技证号", align: "center", width: 160, type: "slot" },
  { isShow: true, fixed: false, key: "productionDate", prop: "productionDate", label: "生产日期", align: "center", width: 180, type: "slot" },
  { isShow: true, fixed: false, key: "validityPeriod", prop: "validityPeriod", label: "有效期", align: "center", width: 120, type: "slot" },
  { isShow: true, fixed: false, key: "validityPeriodUnit", prop: "validityPeriodUnit", label: "有效期单位", align: "center", width: 120, type: "slot" },
  { isShow: true, fixed: false, key: "expirationDate", prop: "expirationDate", label: "到期日期", align: "center", width: 180, type: "slot" },
  { isShow: true, fixed: false, key: "accPic", prop: "accPic", label: "验收照片", align: "center", width: 180, type: "link" },
  { isShow: true, fixed: false, key: "contractPic", prop: "contractPic", label: "合同照片", align: "center", width: 180, type: "link" },
];

// 入库单新增-入库单明细信息表格-不含订单单价、验收照片、合同照片
export const npCreateDialogTableJson = [
  { isShow: true, fixed: false, key: "matlCode", prop: "matlCode", label: "物资编码", align: "center", width: 160, required: true, },
  { isShow: true, fixed: false, key: "matlName", prop: "matlName", label: "物资名称", align: "center", width: 220 },
  { isShow: true, fixed: false, key: "matlType", prop: "matlType", label: "规格型号/图号/材质", align: "center", width: 180, type: "slot" },
  { isShow: true, fixed: false, key: "matlUnit", prop: "matlUnit", label: "计量单位", align: "center", width: 120 },
  //输入框（数字、必填），默认显示该条物资验收通过且未入库的数量，可手动修改。未引用采购订单入库数量手输。
  { isShow: true, fixed: false, key: "paNum", prop: "paNum", label: "入库数量", align: "center", width: 150, type: "slot", required: true, },
  //引入采购订单后会显示此字段，为采购订单单价，不引入则不显示。
  { isShow: true, fixed: false, key: "stkPrice", prop: "stkPrice", label: "采购单价", align: "center", width: 180, type: "slot", required: true, },
  //输入框（数字、必填），默认值为订单单价×入库数量默认值，可手动修改。未引用采购订单采购金额手输。
  { isShow: true, fixed: false, key: "stkAmount", prop: "stkAmount", label: "采购金额", align: "center", width: 180, type: "slot", required: true, },
  { isShow: true, fixed: false, key: "cardPrice", prop: "cardPrice", label: "库存单价", align: "center", width: 180, type: "slot", required: true,},
  // 库存单价x入库数量
  { isShow: true, fixed: false, key: "standardAmount", prop: "standardAmount", label: "入库金额", align: "center", width: 180, type: "slot" },
  //技证号，验收时录入的技证号带过来（外购），可修改
  { isShow: true, fixed: false, key: "credCode", prop: "credCode", label: "技证号", align: "center", width: 160, type: "slot" },
  { isShow: true, fixed: false, key: "productionDate", prop: "productionDate", label: "生产日期", align: "center", width: 180, type: "slot" },
  { isShow: true, fixed: false, key: "validityPeriod", prop: "validityPeriod", label: "有效期", align: "center", width: 120, type: "slot" },
  { isShow: true, fixed: false, key: "validityPeriodUnit", prop: "validityPeriodUnit", label: "有效期单位", align: "center", width: 120, type: "slot" },
  { isShow: true, fixed: false, key: "expirationDate", prop: "expirationDate", label: "到期日期", align: "center", width: 180, type: "slot" },
  
];

export const createDialogTableButtonJson = [
  { code: "del", name: "删除", type: "inline" }
]

export const purchasedDialogTableJson = [
  { isShow: true, fixed: false, key: "matlCode", prop: "matlCode", label: "物资编码", align: "center", width: 160, },
  { isShow: true, fixed: false, key: "matlName", prop: "matlName", label: "物资名称", align: "center", width: 220, },
  { isShow: true, fixed: false, key: "matlType", prop: "matlType", label: "规格型号/图号/材质", align: "center", width: 180, type: "slot" },
  { isShow: true, fixed: false, key: "matlUnit", prop: "matlUnit", label: "计量单位", align: "center", width: 120 },
  { isShow: true, fixed: false, key: "sfiniFlag", prop: "sfiniFlag", label: "是否完成", align: "center", width: 100, type: "slot"},
  { isShow: true, fixed: false, key: "productionDate", prop: "productionDate", label: "生产日期", align: "center", width: 180, type: "slot"},
  { isShow: true, fixed: false, key: "validityPeriod", prop: "validityPeriod", label: "有效期", align: "center", width: 120, },
  { isShow: true, fixed: false, key: "validityPeriodUnit", prop: "validityPeriodUnit", label: "有效期单位", align: "center", width: 120, },
  { isShow: true, fixed: false, key: "expirationDate", prop: "expirationDate", label: "到期日期", align: "center", width: 180, type: "slot"},
  { isShow: true, fixed: false, key: "taxFlag", prop: "taxFlag", label: "是否含税", align: "center", width: 180, type: "slot"},
  { isShow: true, fixed: false, key: "taxRate", prop: "taxRate", label: "税率", align: "center", width: 180,},
  { isShow: true, fixed: false, key: "stkPrice", prop: "stkPrice", label: "采购单价（元）", align: "center", width: 180,},
  { isShow: true, fixed: false, key: "signInNum", prop: "signInNum", label: "签认数量", align: "center", width: 180,},
  { isShow: true, fixed: false, key: "compNum", prop: "compNum", label: "已完成数量", align: "center", width: 180,},
  { isShow: true, fixed: false, key: "stkAmound", prop: "stkAmound", label: "采购金额（元）", align: "center", width: 180,},
  { isShow: true, fixed: false, key: "zycType", prop: "zycType", label: "是否配件中心资源", align: "center", width: 180, type: "slot"},
  { isShow: true, fixed: false, key: "signInName", prop: "signInName", label: "签认人", align: "center", width: 180,},
  { isShow: true, fixed: false, key: "signInDetail", prop: "signInDetail", label: "签认信息", align: "center", width: 220,},
  { isShow: true, fixed: false, key: "comments", prop: "comments", label: "备注", align: "center", width: 220,},
  
];

export const outsaleDialogTableJson = [
  { isShow: true, fixed: false, key: "matlCode", prop: "matlCode", label: "物资编码", align: "center", width: 180 },
  { isShow: true, fixed: false, key: "matlName", prop: "matlName", label: "物资名称", align: "center", width: 220 },
  { isShow: true, fixed: false, key: "matlType", prop: "matlType", label: "规格型号/图号/材质", align: "center", width: 220, type: "slot" },
  { isShow: true, fixed: false, key: "matlUnit", prop: "matlUnit", label: "计量单位", align: "center", width: 120 },
  { isShow: true, fixed: false, key: "cardPrice", prop: "cardPrice", label: "库存单价", align: "center", type: "slot",width: 180 },
  { isShow: true, fixed: false, key: "cardPrice", prop: "outsalePrice", label: "调拨销售单价", align: "center", type: "slot", width: 180 },
  { isShow: true, fixed: false, key: "cardPrice", prop: "outsaleNum", label: "调拨数量", align: "center", type: "slot", width: 180 },
  { isShow: true, fixed: false, key: "cardPrice", prop: "outsaleAmount", label: "调拨销售金额（元）", align: "center", type: "slot", width: 200 },
];

export const addMatlDialogTableJson = [
  { isShow: true, fixed: false, key: "matlCode", prop: "matlCode", label: "物资编码", align: "center" },
  { isShow: true, fixed: false, key: "matlName", prop: "matlName", label: "物资名称", align: "center", width: 330 },
  { isShow: true, fixed: false, key: "matlType", prop: "matlType", label: "规格型号/图号/材质", align: "center", width: 330, type: "slot" },
  { isShow: true, fixed: false, key: "matlUnit", prop: "matlUnit", label: "计量单位", align: "center" },
  { isShow: true, fixed: false, key: "manageRule", prop: "manageRule", label: "管理权限", align: "center", type: "slot" },
];

export const manageRuleArr = [
  { value: "1", label: "总公司管", },
  { value: "2", label: "铁路局管" },
  { value: "3", label: "采购所管" },
  { value: "4", label: "供应段管" },
  { value: "5", label: "站段管" },
];

export const manageRuleObj = {
  "1": "总公司管",
  "2": "铁路局管",
  "3": "采购所管",
  "4": "供应段管",
  "5": "站段管",
}


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

export const editDialogTableJson = [
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
  { isShow: true, fixed: false, key: "credCode", prop: "credCode", label: "技证号", align: "center", width: 160, type: "slot" },
  { isShow: true, fixed: false, key: "productionDate", prop: "productionDate", label: "生产日期", align: "center", width: 180, type: "slot" },
  { isShow: true, fixed: false, key: "validityPeriod", prop: "validityPeriod", label: "有效期", align: "center", width: 120, },
  { isShow: true, fixed: false, key: "validityPeriodUnit", prop: "validityPeriodUnit", label: "有效期单位", align: "center", width: 120, },
  { isShow: true, fixed: false, key: "expirationDate", prop: "expirationDate", label: "到期日期", align: "center", width: 180, type: "slot"},
  { isShow: true, fixed: false, key: "batchNo", prop: "batchNo", label: "批次号", align: "center", width: 160, },
  { isShow: true, fixed: false, key: "accPic", prop: "accPic", label: "验收照片", align: "center", width: 180, type: "link" },
  { isShow: true, fixed: false, key: "contractPic", prop: "contractPic", label: "合同照片", align: "center", width: 180, type: "link" },
];
export const npeditDialogTableJson = [
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
  { isShow: true, fixed: false, key: "credCode", prop: "credCode", label: "技证号", align: "center", width: 160, type: "slot" },
  { isShow: true, fixed: false, key: "productionDate", prop: "productionDate", label: "生产日期", align: "center", width: 180, type: "slot" },
  { isShow: true, fixed: false, key: "validityPeriod", prop: "validityPeriod", label: "有效期", align: "center", width: 120, },
  { isShow: true, fixed: false, key: "validityPeriodUnit", prop: "validityPeriodUnit", label: "有效期单位", align: "center", width: 120, },
  { isShow: true, fixed: false, key: "expirationDate", prop: "expirationDate", label: "到期日期", align: "center", width: 180, type: "slot"},
  { isShow: true, fixed: false, key: "batchNo", prop: "batchNo", label: "批次号", align: "center", width: 160, },
];

export const redReversalTableJson = [
  { isShow: true, fixed: false, key: "matlCode", prop: "matlCode", label: "物资编码", align: "center", width: 160, },
  { isShow: true, fixed: false, key: "matlName", prop: "matlName", label: "物资名称", align: "center", width: 220 },
  { isShow: true, fixed: false, key: "matlType", prop: "matlType", label: "规格型号/图号/材质", align: "center", width: 180, type: "slot"},
  { isShow: true, fixed: false, key: "matlUnit", prop: "matlUnit", label: "计量单位", align: "center", width: 120 },
  //输入框（数字、必填），默认显示该条物资验收通过且未入库的数量，可手动修改。未引用采购订单入库数量手输。
  { isShow: true, fixed: false, key: "paNum", prop: "paNum", label: "入库数量", align: "center", width: 150, },
  { isShow: true, fixed: false, key: "RpaNum", prop: "RpaNum", label: "红冲数量", align: "center", width: 150, type: "slot", },
  //引入采购订单后会显示此字段，为采购订单单价，不引入则不显示。
  { isShow: true, fixed: false, key: "stkPrice", prop: "stkPrice", label: "采购单价", align: "center", width: 180, },
  { isShow: true, fixed: false, key: "orderPrice", prop: "orderPrice", label: "订单单价", align: "center", width: 130, },
  //输入框（数字、必填），默认值为订单单价×入库数量默认值，可手动修改。未引用采购订单采购金额手输。
  { isShow: true, fixed: false, key: "stkAmount", prop: "stkAmount", label: "采购金额", align: "center", width: 180, },
  { isShow: true, fixed: false, key: "RstkAmount", prop: "RstkAmount", label: "红冲采购金额", align: "center", width: 180, type: "slot", },
  { isShow: true, fixed: false, key: "cardPrice", prop: "cardPrice", label: "库存单价", align: "center", width: 180, },
  // 库存单价x入库数量
  { isShow: true, fixed: false, key: "standardAmount", prop: "standardAmount", label: "入库金额", align: "center", width: 180,},
  { isShow: true, fixed: false, key: "RstandardAmount", prop: "RstandardAmount", label: "红冲入库金额", align: "center", width: 180, type: "slot", },
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

export const npredReversalTableJson = [
  { isShow: true, fixed: false, key: "matlCode", prop: "matlCode", label: "物资编码", align: "center", width: 160, },
  { isShow: true, fixed: false, key: "matlName", prop: "matlName", label: "物资名称", align: "center", width: 220 },
  { isShow: true, fixed: false, key: "matlType", prop: "matlType", label: "规格型号/图号/材质", align: "center", width: 180, type: "slot"},
  { isShow: true, fixed: false, key: "matlUnit", prop: "matlUnit", label: "计量单位", align: "center", width: 120 },
  //输入框（数字、必填），默认显示该条物资验收通过且未入库的数量，可手动修改。未引用采购订单入库数量手输。
  { isShow: true, fixed: false, key: "paNum", prop: "paNum", label: "入库数量", align: "center", width: 150, },
  { isShow: true, fixed: false, key: "RpaNum", prop: "RpaNum", label: "红冲数量", align: "center", width: 150, type: "slot", },
  //引入采购订单后会显示此字段，为采购订单单价，不引入则不显示。
  { isShow: true, fixed: false, key: "stkPrice", prop: "stkPrice", label: "采购单价", align: "center", width: 180, },
  //输入框（数字、必填），默认值为订单单价×入库数量默认值，可手动修改。未引用采购订单采购金额手输。
  { isShow: true, fixed: false, key: "stkAmount", prop: "stkAmount", label: "采购金额", align: "center", width: 180, },
  { isShow: true, fixed: false, key: "RstkAmount", prop: "RstkAmount", label: "红冲采购金额", align: "center", width: 180, type: "slot", },
  { isShow: true, fixed: false, key: "cardPrice", prop: "cardPrice", label: "库存单价", align: "center", width: 180, },
  // 库存单价x入库数量
  { isShow: true, fixed: false, key: "standardAmount", prop: "standardAmount", label: "入库金额", align: "center", width: 180,},
  { isShow: true, fixed: false, key: "RstandardAmount", prop: "RstandardAmount", label: "红冲入库金额", align: "center", width: 180, type: "slot", },
  //技证号，验收时录入的技证号带过来（外购），可修改
  { isShow: true, fixed: false, key: "credCode", prop: "credCode", label: "技证号", align: "center", width: 160, },
  { isShow: true, fixed: false, key: "productionDate", prop: "productionDate", label: "生产日期", align: "center", width: 180, type: "slot"},
  { isShow: true, fixed: false, key: "validityPeriod", prop: "validityPeriod", label: "有效期", align: "center", width: 120, },
  { isShow: true, fixed: false, key: "validityPeriodUnit", prop: "validityPeriodUnit", label: "有效期单位", align: "center", width: 120, },
  { isShow: true, fixed: false, key: "expirationDate", prop: "expirationDate", label: "到期日期", align: "center", width: 180, type: "slot"},
  { isShow: true, fixed: false, key: "batchNo", prop: "batchNo", label: "批次号", align: "center", width: 160, },
];

export const printMatlTableJson = [
  { key: "matlCode", prop: "matlCode", label: "物资编码" },
  { key: "matlName", prop: "matlName", label: "物资名称/规格型号" },
  { key: "paNum", prop: "paNum", label: "数量" },
  { key: "stkPrice", prop: "stkPrice", label: "采购单价" },
  { key: "stkAmount", prop: "stkAmount", label: "采购金额" },
  { key: "cardPrice", prop: "cardPrice", label: "库存单价" },
  { key: "standardAmount", prop: "standardAmount", label: "入库金额" },
];
