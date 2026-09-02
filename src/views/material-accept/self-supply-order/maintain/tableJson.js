import { plantDictListAll } from '@/api/warehouse/plantDict'

// 供货单状态
export const statusOptions = [
  { label: '未提交', value: '1' },
  { label: '已提交', value: '2' },
  { label: '已审批', value: '3' },
  { label: '已驳回', value: '4' },
  { label: '已终止', value: '5' },
  { label: '处理中', value: '6' },
  { label: '已处理', value: '7' },
  { label: '已推送', value: '8' },
]

// 是否含税
export const taxFlagOptions = [
  { label: '不含税', value: '0' },
  { label: '含税', value: '1' },
]

// 采购方式（TODO：目标系统对应字典待确认，此处静态占位，后续可改 useDict('purc_type')）
export const purcTypeOptions = [
  { label: '自采', value: '1' },
  { label: '集采', value: '2' },
  { label: '联采', value: '3' },
]

// 计划周期（TODO：目标系统暂无计划周期接口，此处静态占位，后续接 /warehouse/planCycle/list）
export const planCycleOptions = [
  { label: '月度计划', value: '1' },
  { label: '季度计划', value: '2' },
  { label: '年度计划', value: '3' },
]

async function createRichColumns() {
  // 用料地区
  let plantArr = []
  try {
    const res = await plantDictListAll()
    plantArr = (res.data || []).map(item => ({ ...item, label: item.plantName, value: item.plantCode }))
  } catch (e) {
    plantArr = []
  }
  return [
    {
      field: 'spdCode',
      title: '采购订单号',
      showOverflowTooltip: true,
      searchable: true,
      searchType: 'input',
      type: 'link',
    },
    {
      field: 'suName',
      title: '供应商',
      showOverflowTooltip: true,
      searchable: false,
      searchType: 'input',
    },
    {
      field: 'smatlCode',
      title: '物资编号',
      showOverflowTooltip: true,
      hideInTable: true,
      searchable: true,
      searchType: 'input',
    },
    {
      field: 'purcTypeCode',
      title: '采购方式',
      showOverflowTooltip: true,
      hideInTable: true,
      searchable: true,
      searchType: 'select',
      searchProps: { options: purcTypeOptions, clearable: true },
    },
    {
      field: 'purcTypeName',
      title: '采购方式',
      showOverflowTooltip: true,
      searchable: false,
      searchType: 'input',
    },
    {
      field: 'plantCode',
      title: '用料地区',
      showOverflowTooltip: true,
      hideInTable: true,
      searchable: true,
      searchType: 'select',
      searchProps: { options: plantArr, clearable: true },
    },
    {
      field: 'plantName',
      title: '用料地区',
      showOverflowTooltip: true,
      searchable: false,
      searchType: 'input',
    },
    {
      field: 'rptAccptdtCode',
      title: '计划周期',
      showOverflowTooltip: true,
      hideInTable: true,
      searchable: true,
      searchType: 'select',
      searchProps: { options: planCycleOptions, clearable: true },
    },
    {
      field: 'rptAccptdtName',
      title: '计划周期',
      showOverflowTooltip: true,
      searchable: false,
      searchType: 'input',
    },
    {
      field: 'taxFlagName',
      title: '是否应税',
      showOverflowTooltip: true,
      searchable: false,
      searchType: 'input',
    },
    {
      field: 'taxFlag',
      title: '是否含税',
      showOverflowTooltip: true,
      type: 'dict',
      searchable: false,
      searchType: 'select',
      searchProps: { options: taxFlagOptions },
    },
    {
      field: 'consAmount',
      title: '采购总金额(元)',
      showOverflowTooltip: true,
      align: 'right',
      searchable: false,
      searchType: 'input',
    },
    {
      field: 'status',
      title: '状态',
      showOverflowTooltip: true,
      type: 'dict',
      searchable: true,
      searchType: 'select',
      // 多选（原系统默认 1,2；后端 status 接收逗号分隔字符串，onSearch 时 join 后传入）
      multiple: true,
      searchProps: { options: statusOptions, clearable: true },
    },
    {
      field: 'makeDate',
      title: '制定日期',
      showOverflowTooltip: true,
      type: 'date',
      timeFormat: '{y}-{m}-{d}',
      searchable: true,
      searchType: 'dateRange',
    },
    {
      field: 'subDate',
      title: '提交时间',
      showOverflowTooltip: true,
      type: 'date',
      timeFormat: '{y}-{m}-{d} {h}:{i}:{s}',
      searchable: true,
      searchType: 'dateRange',
    },
    {
      field: 'auditDate',
      title: '审核时间',
      showOverflowTooltip: true,
      type: 'date',
      timeFormat: '{y}-{m}-{d} {h}:{i}:{s}',
      searchable: true,
      searchType: 'dateRange',
    },
    {
      field: 'comments',
      title: '备注',
      showOverflowTooltip: true,
      searchable: false,
      searchType: 'input',
    },
  ]
}

// 懒导出：模块顶层不执行请求，进入页面调用 columns() 时才发请求（避免打包后未登录即触发 401）
export const columns = createRichColumns
