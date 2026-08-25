export const formJson = [
  { prop: "plantCode", label: "用料地区", type: "select", labelWidth: '120',}, // required
  { prop: "depotCode", label: "仓库", type: "select", labelWidth: '120',}, // required
  { prop: "partitionCode", label: "仓库分区", type: "select", labelWidth: '120',}, // required
  { prop: "numIsNotZero", label: "", type: "checkbox", selectData: [ { label: "库存不为零", value: true } ], labelWidth: '120' },
  { prop: "totalStock", label: "库存总笔数", type: "text", labelWidth: '120'},
  { prop: "countedStock", label: "已盘点笔数", type: "text", labelWidth: '120'},
  { prop: "countedTimes", label: "已盘点次数", type: "text",  labelWidth: '120'},
  { prop: "currentCount", label: "本次盘点笔数", type: "input", labelWidth: '120' }
];

export const formRules = {
  plantCode: [
    { required: true, message: "请选择地区", trigger: ["change", "blur"] },
  ],
  depotCode: [
    { required: true, message: "请选择仓库", trigger: ["change", "blur"] },
  ],
  partitionCode: [
    { required: true, message: "请选择仓库分区", trigger: ["change", "blur"] },
  ],
  currentCount: [
    { required: true, message: "请输入本次盘点笔数", trigger: ["change", "blur"] },
    { pattern: /^(0|[1-9]\d*)$/, message: "请输入非负整数", trigger: ["change", "blur"] },
    // { pattern: /^[1-9]\d*$/, message: "请输入大于0的整数", trigger: ["change", "blur"] },
    
  ],
}

export const rangeFormJson = [
  { prop: "matlCode", label: "物资编码", type: "input" },
  { prop: "matlName", label: "物资名称", type: "input" },
]