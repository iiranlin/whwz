// 自采供货单审批列表列配置
// 是否含税
export const taxFlagOptions = [
  { label: '不含税', value: '0' },
  { label: '含税', value: '1' },
]

// 审批状态
export const statusOptions = [
  { label: '待审批', value: '0' },
  { label: '已通过', value: '1' },
  { label: '已驳回', value: '2' },
]

export const columns = [
  {
    field: 'spdCode',
    title: '采购订单号',
    minWidth: 180,
    align: 'center',
    searchable: true,
    searchType: 'input',
    type: 'link',
  },
  {
    field: 'suName',
    title: '供应商',
    minWidth: 160,
    align: 'left',
  },
  {
    field: 'plantName',
    title: '用料地区',
    minWidth: 120,
    align: 'left',
  },
  {
    field: 'taxFlagName',
    title: '是否应税',
    minWidth: 100,
    align: 'center',
  },
  {
    field: 'taxFlag',
    title: '是否含税',
    minWidth: 100,
    align: 'center',
    type: 'dict',
    searchProps: { options: taxFlagOptions },
  },
  {
    field: 'consAmount',
    title: '采购总金额(元)',
    minWidth: 140,
    align: 'right',
  },
  {
    field: 'auditStatus',
    title: '状态',
    minWidth: 100,
    align: 'center',
    type: 'dict',
    searchable: true,
    searchType: 'select',
    searchProps: { options: statusOptions },
  },
  {
    field: 'subDate',
    title: '提交时间',
    minWidth: 160,
    align: 'center',
    type: 'date',
  },
  {
    field: 'auditDate',
    title: '审核时间',
    minWidth: 160,
    align: 'center',
    type: 'date',
  },
  {
    field: 'comments',
    title: '备注',
    minWidth: 140,
    align: 'left',
  },
  {
    field: 'smatlCode',
    title: '物资编号',
    hideInTable: true,
    searchable: true,
    searchType: 'input',
  },
]
