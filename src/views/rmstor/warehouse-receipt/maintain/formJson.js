import { whReceiptSourceArr, whReceiptStatusArr, whReceiptSourceTypeArr} from "@/utils/dictionary";

const whReceiptSourceArr2 = whReceiptSourceArr.filter(item => {
  return item.value !== "3" && item.value !=="6";
})

export const initFormJson = [
  { prop: "ibBillCode", label: "入库单号", type: "input", labelWidth: "84" },
  { prop: "ibSource", label: "来源", type: "select", selectData: whReceiptSourceArr2, labelWidth: "84" },
  { prop: "supUnitName", label: "供货单位", type: "inputDialog", labelWidth: "84" },
  { prop: "flag", label: "单据状态", type: "select", selectData: whReceiptStatusArr, labelWidth: "84" },
  { prop: "plantCode", label: "用料地区", type: "select", labelWidth: "84" },
  { prop: "depotCode", label: "仓库", type: "select", labelWidth: "84" },
  { prop: "partitionCode", label: "仓库分区", type: "select", labelWidth: "84" },
  { prop: "taxFlagCode", label: "应税用途", type: "select", labelWidth: "84" },
  { prop: "orderDate", label: "下单日期", type: "date", labelWidth: "84" },
  { prop: "matlCode", label: "物资编码", type: "input", labelWidth: "84" },
  { prop: "supplierName", label: "供应商名称", type: "input", labelWidth: "84" }
];
// 外购
export const pFormJson = [
  { prop: "ibBillCode", label: "入库单号", type: "input", labelWidth: "84" },
  // { prop: "supUnitName", label: "供货单位", type: "inputDialog", labelWidth: "84" },
  { prop: "supUnitName", label: "供应商", type: "inputDialog", labelWidth: "84", readonly: true },
  { prop: "flag", label: "单据状态", type: "select", selectData: whReceiptStatusArr, labelWidth: "84" },
  { prop: "plantCode", label: "用料地区", type: "select", labelWidth: "84", valueKey: "id" },
  { prop: "depotCode", label: "仓库", type: "select", labelWidth: "84", valueKey: "id" },
  { prop: "partitionCode", label: "仓库分区", type: "select", labelWidth: "84", valueKey: "id" },
  { prop: "taxFlagCode", label: "应税用途", type: "select", labelWidth: "84" },
  { prop: "matlCode", label: "物资编码", type: "input", labelWidth: "84" },
  { prop: "orderDate", label: "下单日期", type: "date", labelWidth: "84" },
];
// 调拨
export const formJson = [
  { prop: "ibBillCode", label: "入库单号", type: "input", labelWidth: "84" },
  { prop: "supUnitName", label: "供货单位", type: "inputDialog", labelWidth: "84", readonly: true },
  { prop: "flag", label: "单据状态", type: "select", selectData: whReceiptStatusArr, labelWidth: "84" },
  { prop: "plantCode", label: "用料地区", type: "select", labelWidth: "84", valueKey: "id" },
  { prop: "depotCode", label: "仓库", type: "select", labelWidth: "84", valueKey: "id" },
  { prop: "partitionCode", label: "仓库分区", type: "select", labelWidth: "84", valueKey: "id" },
  { prop: "taxFlagCode", label: "应税用途", type: "select", labelWidth: "84" },
  { prop: "matlCode", label: "物资编码", type: "input", labelWidth: "84" },
  { prop: "supplierName", label: "供应商名称", type: "input", labelWidth: "84" },
  { prop: "orderDate", label: "下单日期", type: "date", labelWidth: "84" },
];

// 其他来源使用
export const formJson3 = [
  { prop: "ibBillCode", label: "入库单号", type: "input", labelWidth: "84" },
  { prop: "supUnitName", label: "供货单位", type: "inputDialog", labelWidth: "84", readonly: true },
  { prop: "flag", label: "单据状态", type: "select", selectData: whReceiptStatusArr, labelWidth: "84" },
  { prop: "plantCode", label: "用料地区", type: "select", labelWidth: "84", valueKey: "id" },
  { prop: "depotCode", label: "仓库", type: "select", labelWidth: "84", valueKey: "id" },
  { prop: "partitionCode", label: "仓库分区", type: "select", labelWidth: "84", valueKey: "id" },
  { prop: "taxFlagCode", label: "应税用途", type: "select", labelWidth: "84" },
  { prop: "matlCode", label: "物资编码", type: "input", labelWidth: "84" },
  // { prop: "supplierName", label: "供货单位", type: "input", labelWidth: "84" },
  { prop: "otherTypeCode", label: "来源类别", type: "select", selectData: whReceiptSourceTypeArr, labelWidth: "84" },
  { prop: "orderDate", label: "下单日期", type: "date", labelWidth: "84" },
];

// 修旧利废、旧品、自制
export const noSupFormJson = [
  { prop: "ibBillCode", label: "入库单号", type: "input", labelWidth: "84" },
  { prop: "flag", label: "单据状态", type: "select", selectData: whReceiptStatusArr, labelWidth: "84" },
  { prop: "plantCode", label: "用料地区", type: "select", labelWidth: "84", valueKey: "id" },
  { prop: "depotCode", label: "仓库", type: "select", labelWidth: "84", valueKey: "id" },
  { prop: "partitionCode", label: "仓库分区", type: "select", labelWidth: "84", valueKey: "id" },
  { prop: "taxFlagCode", label: "应税用途", type: "select", labelWidth: "84" },
  { prop: "matlCode", label: "物资编码", type: "input", labelWidth: "84" },
  { prop: "orderDate", label: "下单日期", type: "date", labelWidth: "84" },
];

// 委外修/返厂修使用
export const singleSupFormJson = [
  { prop: "ibBillCode", label: "入库单号", type: "input", labelWidth: "84" },
  { prop: "supUnitName", label: "供货单位", type: "inputDialog", labelWidth: "84", readonly: true, },
  { prop: "flag", label: "单据状态", type: "select", selectData: whReceiptStatusArr, labelWidth: "84" },
  { prop: "plantCode", label: "用料地区", type: "select", labelWidth: "84", valueKey: "id" },
  { prop: "depotCode", label: "仓库", type: "select", labelWidth: "84", valueKey: "id" },
  { prop: "partitionCode", label: "仓库分区", type: "select", labelWidth: "84", valueKey: "id" },
  { prop: "taxFlagCode", label: "应税用途", type: "select", labelWidth: "84" },
  { prop: "matlCode", label: "物资编码", type: "input", labelWidth: "84" },
  // { prop: "supplierName", label: "供货单位", type: "input", labelWidth: "84" },
  { prop: "orderDate", label: "下单日期", type: "date", labelWidth: "84" },
];

export const addMatlDialogFormJson = [
  { prop: "matlCode", label: "物资编码", type: "input", },
  { prop: "matlName", label: "物资名称", type: "input", },
  { prop: "matlType", label: "规格型号", type: "input", },
]

export const purchasedDialogFormJson = [
  // { prop: "unitCode", label: "供货单位编号", type: "input", labelWidth: "116", disabled: false, },
  { prop: "spdCode", label: "采购订单/商城订单号", type: "input", labelWidth: "160" },
  { prop: "unitName", label: "供应商", type: "input", labelWidth: "160", disabled: false, },
  { prop: "bmName", label: "制单人", type: "input", labelWidth: "160" },
  { prop: "matlCode", label: "物资编码", type: "input", labelWidth: "160" },
  { prop: "matlName", label: "物资名称", type: "input", labelWidth: "160" },
  { prop: "matlType", label: "规格型号", type: "input", labelWidth: "160" },
  // { prop: "_spdCode", label: "商城订单号", type: "input", labelWidth: "116" },
  // { prop: "finish", label: "是否完成标记", type: "radio", labelWidth: "116", selectData: [
  //   { label: "是", value: "true" },
  //   { label: "否", value: "false" },
  // ] },
];

export const outsaleDialogFormJson = [
  { prop: "unitCode", label: "供货单位编码", type: "input", disabled: true, labelWidth: "108" },
  { prop: "unitName", label: "供货单位", type: "input", disabled: true, labelWidth: "108" },
  { prop: "outsaleCode", label: "调拨单号", type: "input", labelWidth: "108" },
  { prop: "matlCode", label: "物资编码", type: "input", labelWidth: "108" },
  { prop: "matlName", label: "物资名称", type: "input", labelWidth: "108" },
];