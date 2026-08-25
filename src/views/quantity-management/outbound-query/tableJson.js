import { ibmtFlagObj } from '@/utils/dictionary'
export const tableJson = [
  {isShow: true, fixed: false, type: 'dict', key: 'flag', prop: 'flag', label: '单据状态', align: 'center', width: 200, stats: ibmtFlagObj},
  {isShow: true, fixed: false, type: '', key: 'plantName', prop: 'plantName', label: '用料地区', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'depotName', prop: 'depotName', label: '仓库', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'partitionName', prop: 'partitionName', label: '仓库分区', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'deptName', prop: 'deptName', label: '领料部门', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'teamName', prop: 'teamName', label: '领料班组', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'obBillCode', prop: 'obBillCode', label: '出库单号', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'ptWhName', prop: 'ptWhName', label: '下单人', align: 'center', width: 160},
  {isShow: true, fixed: false, type: 'date', key: 'orderDate', prop: 'orderDate', label: '下单日期', align: 'center', width: 160},
  {isShow: true, fixed: false, type: 'date', key: 'noteDate', prop: 'noteDate', label: '登卡日期', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'bmName', prop: 'bmName', label: '审核人', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'comments', prop: 'comments', label: '备注', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'matlCode', prop: 'matlCode', label: '物资编码', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'matlName', prop: 'matlName', label: '物资名称', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'matlType', prop: 'matlType', label: '规格型号/材质/图号', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'matlUnit', prop: 'matlUnit', label: '计量单位', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'credCode', prop: 'credCode', label: '技证号', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'price', prop: 'price', label: '单价', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'outNum', prop: 'outNum', label: '支出数量', align: 'center', width: 160},
  {isShow: false, fixed: false, type: '', key: 'totalOutNum', prop: 'totalOutNum', label: '支出数量', align: 'center', width: 160},
]

export const tableButtonJson = [
  {code: 'export', name: '导出'}
]