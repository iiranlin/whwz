export const formJson = [
  { prop: "matlCode", label: "物资编码", type: "input",  },
  { prop: "matlName", label: "物资名称", type: "input" },
  { prop: "matlBatchStatus", label: "批次管理状态", type: "select", labelWidth: "98", selectData:[
    { label: "已开启", value: "1" },
    { label: "未开启", value: "0"}
  ] },
  { prop: "periodManage", label: "效期管理状态", type: "select", labelWidth: "98", selectData:[
    { label: "已开启", value: "1" },
    { label: "未开启", value: "0"}
  ] }
]