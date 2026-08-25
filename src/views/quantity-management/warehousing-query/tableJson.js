import { ibmtFlagObj } from '@/utils/dictionary'
export const tableJson = [
  {isShow: true, fixed: false, type: 'dict', key: 'flag', prop: 'flag', label: '单据状态', align: 'center', width: 200, stats: ibmtFlagObj},
  {isShow: true, fixed: false, type: '', key: 'plantName', prop: 'plantName', label: '用料地区', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'depotName', prop: 'depotName', label: '仓库', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'partitionName', prop: 'partitionName', label: '仓库分区', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'supUnitName', prop: 'supUnitName', label: '供货单位', align: 'center', width: 220},
  {isShow: true, fixed: false, type: '', key: 'ibBillCode', prop: 'ibBillCode', label: '入库单号', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'bmName', prop: 'bmName', label: '下单人', align: 'center', width: 160},
  {isShow: true, fixed: false, type: 'date', key: 'orderDate', prop: 'orderDate', label: '下单日期', align: 'center', width: 160},
  {isShow: true, fixed: false, type: 'date', key: 'noteDate', prop: 'noteDate', label: '登卡日期', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'comments', prop: 'comments', label: '备注', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'matlCode', prop: 'matlCode', label: '物资编码', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'matlName', prop: 'matlName', label: '物资名称', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'matlType', prop: 'matlType', label: '规格型号/材质/图号', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'matlUnit', prop: 'matlUnit', label: '计量单位', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'credCode', prop: 'credCode', label: '技证号', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'cardPrice', prop: 'cardPrice', label: '单价', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'num', prop: 'num', label: '入库数量', align: 'center', width: 160},
  {isShow: false, fixed: false, type: '', key: 'totalNum', prop: 'totalNum', label: '入库数量', align: 'center', width: 160},
]

export const tableButtonJson = [
  {code: 'export', name: '导出'}
]