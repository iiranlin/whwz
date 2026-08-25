export const formJson = [
  { prop: "yearMonth", label: "年月", type: "date", dateType: "month"},
  { prop: "plantCode", label: "地区", type: "select",},
  { prop: "depotCode", label: "仓库", type: "select",},
  { prop: "csCode", label: "盘点单号", type: "input"},
  { prop: "permFlag", label: "状态", type: "select", selectData: [
    { value: "1", label: "未审核" },
    { value: "2", label: "已审核" },
    { value: "3", label: "已生成调整单" }
  ]},
];
