export const formJson = [
  { prop: "yearMonth", label: "年月", type: "date", dateType: "month", clearable: true, editable: true},
  { prop: "plantCode", label: "用料地区", type: "select",},
  { prop: "depotCode", label: "仓库", type: "select",},
  { prop: "partitionCode", label: "仓库分区", type: "select",},
  { prop: "csCode", label: "盘点单号", type: "input"},
  { prop: "status", label: "单据状态", type: "select", selectData: [
    { value: "1", label: "未维护" },
    { value: "2", label: "未提交" },
    { value: "3", label: "已提交" },
    { value: "4", label: "已生成调整单" },
  ]},
  // 不走审核：报批即一步定稿，"审核状态"检索项隐藏，将来恢复审核放开
  // { prop: "permFlag", label: "审核状态", type: "select", selectData: [
  //   { value: "1", label: "未审核" },
  //   { value: "2", label: "审核中" },
  //   { value: "3", label: "审核通过" }
  // ]},
];


const reviewFlagArr = [];

const reviewFlagObj = {}