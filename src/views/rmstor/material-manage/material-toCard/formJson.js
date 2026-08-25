import { statusArr } from '@/utils/dictionary'
export const formJson = [
  {prop: 'flag', label: '单据状态', type: 'select',labelWidth:'90',selectData: [
    {value: 0, label: "未登卡"},
    {value: 1, label: "已登卡"},
  ]},
  {prop: 'returnCode', label: '退料单号', type: 'input',labelWidth:'90'},
  {prop: 'plantCode', label: '用料地区', type: 'select',labelWidth:'90'},
  {prop: 'depotCode', label: '仓库', type: 'select',labelWidth:'90'},
  {prop: 'partitionName', label: '仓库分区', type: 'select',labelWidth:'90'},
  {prop: 'deptName', label: '领料部门', type: 'input',labelWidth:'90'},
  {prop: 'matlCode', label: '物资编码', type: 'input',labelWidth:'90'},
  {prop: 'matlName', label: '物资名称', type: 'input',labelWidth:'90'},
  {prop: 'matlType', label: '规格型号', type: 'input',labelWidth:'90'},
  {prop: 'orderDate', label: '下单日期', type: 'date',labelWidth:'90'},
  
  // {prop: 'rtmtSource', label: '退料来源', type: 'select',labelWidth:'90',selectData: [
  //   {value: 0, label: "正常退料"},
  //   {value: 1, label: "废料回收"}
  // ]},
]

export const addFormJson = [
  {prop: 'returnCode', label: '退料单号', type: '', labelWidth: '90'},
]

// 出库单查询
export const formOrderJson = [
  {prop: 'obCode', label: '出库单号', type: '', labelWidth: '90'},
  {prop: 'matlCode', label: '物资编码', type: '', labelWidth: '90'},
  {prop: 'matlName', label: '物资名称', type: '', labelWidth: '90'},
]

// 退料人查询
export const userFormJson = [
  {prop: 'userCode', label: '用户编号', type: 'input'},
  {prop: 'userName', label: '姓名', type: 'input'},
]