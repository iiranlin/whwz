import { statusArr } from '@/utils/dictionary'
export const formJson = [
  {prop: 'flag', label: '单据状态', type: 'select',labelWidth:'90',selectData: [
    {value: 0, label: "未登卡"},
    {value: 1, label: "已登卡"},
  ]},
  {prop: 'returnCode', label: '退料单号', type: 'input',labelWidth:'90'},
  {prop: 'plantCode', label: '用料地区', type: 'select',labelWidth:'90'},
  {prop: 'depotCode', label: '仓库', type: 'select',labelWidth:'90'},
  {prop: 'partitionCode', label: '仓库分区', type: 'select',labelWidth:'90'},
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
// 81-退料单改造：按需求图补充检索项（领料部门/仓库/仓库分区/设备/领料人），均为模糊查询
export const formOrderJson = [
  {prop: 'obCode', label: '出库单号', type: '', labelWidth: '90'},
  {prop: 'deptName', label: '领料部门', type: '', labelWidth: '90'},
  {prop: 'depotName', label: '仓库', type: '', labelWidth: '90'},
  {prop: 'partitionName', label: '仓库分区', type: '', labelWidth: '90'},
  {prop: 'idsName', label: '设备', type: '', labelWidth: '90'},
  {prop: 'pickmatlName', label: '领料人', type: '', labelWidth: '90'},
  {prop: 'matlCode', label: '物资编码', type: '', labelWidth: '90'},
  {prop: 'matlName', label: '物资名称', type: '', labelWidth: '90'},
]
// 81-退料单改造：原出库单检索项配置保留备恢复
// export const formOrderJson = [
//   {prop: 'obCode', label: '出库单号', type: '', labelWidth: '90'},
//   {prop: 'matlCode', label: '物资编码', type: '', labelWidth: '90'},
//   {prop: 'matlName', label: '物资名称', type: '', labelWidth: '90'},
// ]

// 退料人查询
export const userFormJson = [
  {prop: 'userCode', label: '用户编号', type: 'input'},
  {prop: 'userName', label: '姓名', type: 'input'},
]