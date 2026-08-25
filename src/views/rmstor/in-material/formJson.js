import { statusArr } from '@/utils/dictionary'
export const formJson = [
  {prop: 'imCode', label: '进库料单号', type: 'input',labelWidth:'90'},
  {prop: 'suName', label: '供应商', type: 'input',labelWidth:'90'},
  {prop: 'plantCode', label: '用料地区', type: 'select',labelWidth:'90'},
  {prop: 'depotCode', label: '仓库', type: 'select',labelWidth:'90'},
  {prop: 'matlCode', label: '物资编码', type: 'input',labelWidth:'90'},
  {prop: 'matlName', label: '物资名称', type: 'input',labelWidth:'90'},
  {prop: 'matlType', label: '规格型号', type: 'input',labelWidth:'90'},
  {prop: 'arrStation', label: '到货地点', type: 'input',labelWidth:'90'},
]

export const formSelectJson = [
  {prop: 'spdCode', label: '采购订单号', type: 'input',labelWidth:'90'},
  {prop: 'suName', label: '供应商', type: 'input',labelWidth:'90'},
  {prop: 'matlCode', label: '物资编码', type: 'input',labelWidth:'90'},
  {prop: 'matlName', label: '物资名称', type: 'input',labelWidth:'90'},
]

export const rluFormJson = [
  {prop: 'unitCode', label: '单位编号', type: 'input'},
  {prop: 'unitName', label: '单位名称', type: 'input'},
]