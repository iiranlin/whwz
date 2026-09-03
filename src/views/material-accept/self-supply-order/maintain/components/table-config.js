// 自采供货单明细（编辑态）列配置
export const detailConfig = [
  { field: 'smatlCode', title: '物资编号', minWidth: 140, align: 'left' },
  { field: 'smatlName', title: '物资名称', minWidth: 160, align: 'left' },
  { field: 'smatlType', title: '规格型号/材质/图号', minWidth: 220, align: 'left', type: 'smatlType' },
  { field: 'smatlUnit', title: '计量单位', minWidth: 100, align: 'left' },
  { field: 'madeBrand', title: '产地品牌', minWidth: 140, align: 'center', type: 'input' },
  { field: 'purNum', title: '数量', minWidth: 140, align: 'center', type: 'inputNumber' },
  { field: 'contPrice', title: '单价(元)', minWidth: 140, align: 'center', type: 'inputNumber' },
  { field: 'purAmount', title: '采购金额(元)', minWidth: 140, align: 'right', type: 'purAmount' },
  { field: 'comments', title: '备注', minWidth: 160, align: 'center', type: 'input' },
]
