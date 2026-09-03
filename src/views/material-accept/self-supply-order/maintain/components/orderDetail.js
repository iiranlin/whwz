// 自采供货单明细（只读）列配置
export const orderDetailConfig = [
  { field: 'smatlCode', title: '物资编号', minWidth: 140, align: 'left' },
  { field: 'smatlName', title: '物资名称', minWidth: 160, align: 'left' },
  { field: 'smatlType', title: '规格型号/材质/图号', minWidth: 220, align: 'left' },
  { field: 'smatlUnit', title: '计量单位', minWidth: 100, align: 'left' },
  { field: 'madeBrand', title: '产地品牌', minWidth: 140, align: 'center' },
  { field: 'purNum', title: '数量', minWidth: 100, align: 'right' },
  { field: 'contPrice', title: '单价(元)', minWidth: 120, align: 'right' },
  { field: 'taxRate', title: '税率', minWidth: 100, align: 'center' },
  { field: 'purAmount', title: '采购金额(元)', minWidth: 140, align: 'right' },
  // { field: 'sharePrice', title: '共享价格(元)', minWidth: 140, align: 'right' },
  // { field: 'offsetRate', title: '共享价格偏离率', minWidth: 140, align: 'right' },
  { field: 'stopFlag', title: '终止状态', minWidth: 100, align: 'center', dict: { 0: '未终止', 1: '已终止' } },
  { field: 'purReason', title: '采购理由', minWidth: 160, align: 'left' },
]
