import { whReceiptSourceArr, whReceiptStatusArr } from "@/utils/dictionary";

// const whReceiptSourceArr2 = whReceiptSourceArr.filter(item => {
//   return item.value !== "3" && item.value !=="6";
// })

export const formJson = [
  { prop: "ibBillCode", label: "入库单号", type: "input", labelWidth: "84" },
  { prop: "ibSource", label: "来源", type: "select", selectData: whReceiptSourceArr, labelWidth: "84" },
  { prop: "supUnitName", label: "供货单位", type: "inputDialog", labelWidth: "84", readonly: true },
  { prop: "flag", label: "单据状态", type: "select", selectData: whReceiptStatusArr, labelWidth: "84" },
  { prop: "plantCode", label: "用料地区", type: "select", labelWidth: "84", valueKey: "id" },
  { prop: "depotCode", label: "仓库", type: "select", labelWidth: "84", valueKey: "id" },
  { prop: "partitionCode", label: "仓库分区", type: "select", labelWidth: "84", valueKey: "id"  },
  { prop: "taxFlagCode", label: "应税用途", type: "select", labelWidth: "84" },
  { prop: "matlCode", label: "物资编码", type: "input", labelWidth: "84" },
  { prop: "matlName", label: "物资名称", type: "input", labelWidth: "84" },
  { prop: "matlType", label: "规格型号", type: "input", labelWidth: "84" },
  { prop: "orderDate", label: "下单日期", type: "date", labelWidth: "84" },
  // { prop: "supplierName", label: "供应商", type: "input", labelWidth: "84" }
];

export const supplierDialgFormJson = [
  { prop: "unitCode", label: "往来单位编码", type: "input", labelWidth: "120" },
  { prop: "unitName", label: "往来单位名称", type: "input", labelWidth: "120" },
];