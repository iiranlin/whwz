import { saleFlagArr } from '@/utils/dictionary'
export const formJson = [
  {prop: 'saleFlag', label: '单据状态', type: 'select', selectData: saleFlagArr},
  {prop: 'outsaleCode', label: '调拨(销售)单号', type: 'input'},
  {prop: 'rluName', label: '收料单位', type: 'input'},
  {prop: 'plantCode', label: '调出地区', type: 'select', selectData: null, isSelectCode: true},
  {prop: 'depotCode', label: '调出仓库', type: 'select', selectData: null, isSelectCode: true},
  {prop: 'partitionCode', label: '调出仓库分区', type: 'select', selectData: null, isSelectCode: true},
  {prop: 'matlCode', label: '物资编码', type: 'input'},
  {prop: 'matlName', label: '物资名称', type: 'input'},
  {prop: 'matlType', label: '规格型号', type: 'input'},
]

// 选择收料单位弹框搜索字段
export const rluFormJson = [
  {prop: 'unitCode', label: '单位编号', type: 'input'},
  {prop: 'unitName', label: '单位名称', type: 'input'},
]

// 选择调剂申请单弹框搜索字段
export const adjustFormJson = [
  {prop: 'matlCode', label: '物资编码', type: 'input'},
  {prop: 'matlName', label: '物资名称', type: 'input'},
  // {prop: 'billCode', label: '调剂单', type: 'select', selectData: null},
]

// 选择审批人弹框搜索字段
export const userFormJson = [
  {prop: 'userCode', label: '用户编号', type: 'input'},
  {prop: 'userName', label: '姓名', type: 'input'},
]

export const rmstorMatlFormJson = [
  {prop: 'partitionCode', label: '调出仓库分区', type: 'select', disabled: true, selectData: null},
  {prop: 'matlCode', label: '物资编码', type: 'input'},
  {prop: 'matlName', label: '物资名称', type: 'input'},
]