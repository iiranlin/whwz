import { statusObj } from '@/utils/dictionary'
import {
  warehouseDict,
} from "@/api/inMaterial/inMaterialGroup";
// const statusObj = {'0': '停用', '1': '启用'}
export const tableJson = [
  {searchType: '', field: 'imCode', title: '进库料单号', align: 'center',searchable: true,slotName: 'imCode-cell',},
  {searchType: '', field: 'spdCode',  title: '采购订单号', align: 'center'},
  {searchType: 'date', field: 'inDate', title: '进库日期', align: 'center',},
  {searchType: 'select', field: 'plantName', title: '用料地区', align: 'center'},
  {searchType: 'select', field: 'depotName', title: '仓库', align: 'center'},
  {searchType: 'select', field: 'plantCode', title: '用料地区', align: 'center',searchable: true,searchProps:{
    options:[],
    clearable: true,
  },hideInTable:true},
  {searchType: 'select', field: 'depotCode', title: '仓库', align: 'center',searchable: true,hideInTable:true,dependsOn: ['plantCode'],searchProps:{
    options:[],
    clearable: true,
  },async onDependencyChange({
      form,
      changedField,
      setFieldValue,
      setFieldProps,
    }) {
      if (changedField !== 'plantCode') return
      if (!form.plantCode) {
        setFieldProps('depotCode',{options:[]})
        setFieldValue('depotCode','')
        return
      }
      const {data} = await warehouseDict(form.plantCode)
      const depotOptions = data.map(item => ({
        label:item.whName,
        value:item.whCode
      }))
      setFieldProps('depotCode',{options:depotOptions})
      setFieldValue('depotCode','')
    }},
  {searchType: '', field: 'suName', title: '供应商', align: 'center',searchable: true},
  {searchType: '', field: 'pieces', title: '件数', align: 'center',},
  {searchType: '', field: 'startStation', title: '发货地点', align: 'center',},
  {field: 'matlCode', title: '物资编码', type: 'input',searchable: true,hideInTable:true},
  {field: 'matlName', title: '物资名称', type: 'input',searchable: true,hideInTable:true},
  {field: 'matlType', title: '规格型号', type: 'input',searchable: true,hideInTable:true},
  {searchType: '', field: 'arrStation', title: '到货地点', align: 'center',searchable: true},
  {searchType: '', field: 'comments',title: '备注', align: 'center',},
]

export const tableButtonJson = [
   {code: 'edit', name: '编辑',type: 'inline'},
]

export const tableJsonSupper = [
  { isShow: true, fixed: false, type: '', key: 'orgCode', prop: 'orgCode', label: '供货编号', align: 'center' },
  { isShow: true, fixed: false, type: '', key: 'caName', prop: 'caName', label: '供货名称', align: 'center' },
]

export const tableJsonGroup = [
  { isShow: true, fixed: false, type: '', key: 'matlCode', prop: 'matlCode', label: '物资编码', align: 'center' },
  { isShow: true, fixed: false, type: '', key: 'matlName', prop: 'matlName', label: '物资名称', align: 'center' },
  { isShow: true, fixed: false, type: '', key: 'matlType', prop: 'matlType', label: '规格型号', align: 'center' },
  { isShow: true, fixed: false, type: '', key: 'matlUnit', prop: 'matlUnit', label: '计量单位', align: 'center' },
  { isShow: true, fixed: false, type: '', key: '', prop: '', label: '应税用途', align: 'center' },
  { isShow: true, fixed: false, type: 'dict', stats: statusObj, key: 'taxFlag', prop: 'taxFlag', label: '是否含税', align: 'center' },
  { isShow: true, fixed: false, type: '', key: 'taxRate', prop: 'taxRate', label: '税率(%)', align: 'center' },
  { isShow: true, fixed: false, type: '', key: 'purNum', prop: 'purNum', label: '采购数量', align: 'center' },
  { isShow: true, fixed: false, type: '', key: '', prop: '', label: '采购单价(元)', align: 'center' },
  { isShow: true, fixed: false, type: '', key: 'contPrice', prop: 'contPrice', label: '采购金额', align: 'center' },
  { isShow: true, fixed: false, type: '', key: 'inNum', prop: 'inNum', label: '已进库数量', align: 'center' },
  { isShow: true, fixed: false, type: '', key: 'siginName', prop: 'siginName', label: '签认人', align: 'center' },
  { isShow: true, fixed: false, type: '', key: 'siginNum', prop: 'siginNum', label: '签认数量', align: 'center' },
]

export const tableJsonDetail = [
    { isShow: true, fixed: false, type: '', key: 'matlCode', prop: 'matlCode', label: '物资编码', align: 'center' },
    { isShow: true, fixed: false, type: '', key: 'matlName', prop: 'matlName', label: '物资名称', align: 'center' },
    { isShow: true, fixed: false, type: '', key: 'matlType', prop: 'matlType', label: '规格型号/材质/型号', align: 'center' },
    { isShow: true, fixed: false, type: '', key: 'matlUnit', prop: 'matlUnit', label: '计量单位', align: 'center' },
    { isShow: true, fixed: false, type: '', key: 'credCode', prop: 'credCode', label: '技证号', align: 'center' },
    { isShow: true, fixed: false, type: '', key: 'num', prop: 'num', label: '数量', align: 'center' },
    { isShow: true, fixed: false, type: '', key: 'batch', prop: 'batch', label: '批次', align: 'center' },
    { isShow: true, fixed: false, type: 'dict', stats:statusObj, key: 'pddFlag', prop: 'pddFlag', label: '是否签认', align: 'center' },
    { isShow: true, fixed: false, type: '', key: 'ibBillCode', prop: 'ibBillCode', label: '入库单号', align: 'center' },
    { isShow: true, fixed: false, type: '', key: 'ibBillSeq', prop: 'ibBillSeq', label: '入库单明细号', align: 'center' },
    { isShow: true, fixed: false, type: '', key: 'obCode', prop: 'obCode', label: '出库单号', align: 'center' },
    { isShow: true, fixed: false, type: '', key: 'obSeq', prop: 'obSeq', label: '出库单明细号', align: 'center' },
    { isShow: true, fixed: false, type: 'date', key: 'durDate', prop: 'durDate', label: '保质期', align: 'center' },
    { isShow: true, fixed: false, type: '', key: 'comments', prop: 'comments', label: '备注', align: 'center' },
    
  ]

export const tableJsonCheckMaterial = [
  { isShow: true, fixed: false, type: '', key: 'matlCode', prop: 'matlCode', label: '物资编码', align: 'center' },
  { isShow: true, fixed: false, type: '', key: 'matlName', prop: 'matlName', label: '物资名称', align: 'center' },
  { isShow: true, fixed: false, type: '', key: 'matlType', prop: 'matlType', label: '规格型号', align: 'center', },
  { isShow: true, fixed: false, type: '', key: 'matlRaw', prop: 'matlRaw', label: '材质', align: 'center', },
  { isShow: true, fixed: false, type: '', key: 'matlPcode', prop: 'matlPcode', label: '图号', align: 'center', },
  { isShow: true, fixed: false, type: '', key: 'matlUnit', prop: 'matlUnit', label: '计量单位', align: 'center', },
]

export const tableGroupButtonJson = [
    {code: 'modify', name: '详情',type: 'inline'},
 ]

 // 新增明细
 export const materialTableJson = [
  { isShow: true, fixed: false, type: '', key: 'matlCode', prop: 'matlCode', label: '物资编码', align: 'center' },
  { isShow: true, fixed: false, type: '', key: 'matlName', prop: 'matlName', label: '物资名称', align: 'center' },
  { isShow: true, fixed: false, type: '', key: 'matlType', prop: 'matlType', label: '规格型号/材质/图号', align: 'center' },
  { isShow: true, fixed: false, type: '', key: 'matlUnit', prop: 'matlUnit', label: '计量单位', align: 'center' },
  { isShow: true, fixed: false, type: 'slot', key: 'credCode', prop: 'credCode', label: '技证号', align: 'center' },
  { isShow: true, fixed: false, type: 'slot', key: 'num', prop: 'num', label: '数量', align: 'center', required: true },
  { isShow: true, fixed: false, type: 'slot', key: 'batch', prop: 'batch', label: '批次', align: 'center' },
  { isShow: true, fixed: false, type: 'slot', key: 'pddFlag', prop: 'pddFlag', label: '是否签认', align: 'center' },
  { isShow: true, fixed: false, type: 'slot', key: 'ibBillCode', prop: 'ibBillCode', label: '入库单号', align: 'center' },
  { isShow: true, fixed: false, type: 'slot', key: 'ibBillSeq', prop: 'ibBillSeq', label: '入库单明细号', align: 'center' },
  { isShow: true, fixed: false, type: 'slot', key: 'obCode', prop: 'obCode', label: '出库单号', align: 'center' },
  { isShow: true, fixed: false, type: 'slot', key: 'obSeq', prop: 'obSeq', label: '出库单明细号', align: 'center' },
  { isShow: true, fixed: false, type: 'slot', key: 'durDate', prop: 'durDate', label: '保质期', align: 'center' },
  { isShow: true, fixed: false, type: 'slot', key: 'comments', prop: 'comments', label: '备注', align: 'center' },
 ]

 // 新增明细按钮
 export const materialButtonJson = [
  {code: 'delete', name: '删除', type: 'inline'},
 ]

 export const rluTableJson = [
  {isShow: true, fixed: false, type: '', key: 'unitCode', prop: 'unitCode', label: '单位编号', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'unitName', prop: 'unitName', label: '单位名称', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'type', prop: 'type', label: '单位类型', align: 'center', width: 160},
]