import { plantDictListAll } from '@/api/warehouse/plantDict'
import { dictCateList } from "@/api/system/common";
// 供货单状态
export const statusOptions = [
  { label: '未提交', value: '1' },
  // { label: '已提交', value: '2' },
  // { label: '已审批', value: '3' },
  // { label: '已驳回', value: '4' },
  // { label: '已终止', value: '5' },
  // { label: '处理中', value: '6' },
  // { label: '已处理', value: '7' },
  { label: '已提交', value: '8' },
]

// 是否含税
export const taxFlagOptions = [
  { label: '不含税', value: '0' },
  { label: '含税', value: '1' },
]

// 采购方式（TODO：目标系统对应字典待确认，此处静态占位，后续可改 useDict('purc_type')）
// export const purcTypeOptions = [
//   { label: '自采', value: '1' },
//   { label: '集采', value: '2' },
//   { label: '联采', value: '3' },
// ]

// 计划周期（TODO：目标系统暂无计划周期接口，此处静态占位，后续接 /warehouse/planCycle/list）
export const planCycleOptions = [
  { label: '月度计划', value: '1' },
  { label: '季度计划', value: '2' },
  { label: '年度计划', value: '3' },
]
export const purcTypeOptions = async () => {
  const res = await dictCateList({
    code: "pur_type"
  })
  return res.data.map(item => {
    return {...item, label: item.name, value: item.code}
  })
}

async function createRichColumns() {
  // 采购方式字典（异步获取）
  const purcTypeList = await purcTypeOptions()
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
      field: 'status',
      title: '状态',
      minWidth: 180,
      type: 'dict',
      hideInTable: true,
      searchable: true,
      searchType: 'select',
      // 多选（原系统默认 1,2；后端 status 接收逗号分隔字符串，onSearch 时 join 后传入）
      multiple: true,
      searchProps: { options: statusOptions, clearable: true },
    },
    {
      field: 'spdCode',
      title: '采购订单号',
      minWidth: 180,
      align: 'center',
      showOverflowTooltip: true,
      searchable: true,
      searchType: 'input',
      type: 'link',
    },
    {
      field: 'suName',
      title: '供应商',
      minWidth: 160,
      align: 'center',
      showOverflowTooltip: true,
      searchable: true,
      searchType: 'input',
    },
    {
      field: 'purcTypeCode',
      title: '采购方式',
      minWidth: 160,
      align: 'center',
      showOverflowTooltip: true,
      hideInTable: true,
      searchable: true,
      searchType: 'select',
      searchProps: { options: purcTypeList, clearable: true },
    },
    {
      field: 'purcTypeName',
      title: '采购方式',
      minWidth: 160,
      align: 'center',
      showOverflowTooltip: true,
      searchable: false,
      searchType: 'input',
    },
    {
      field: 'smatlCode',
      title: '物资编号',
      minWidth: 160,
      align: 'center',
      showOverflowTooltip: true,
      hideInTable: true,
      searchable: true,
      searchType: 'input',
    },
    {
      field: 'smatlName',
      title: '物资名称',
      minWidth: 160,
      align: 'center',
      showOverflowTooltip: true,
      hideInTable: true,
      searchable: true,
      searchType: 'input',
    },
    {
      field: 'plantCode',
      title: '用料地区',
      minWidth: 120,
      align: 'center',
      showOverflowTooltip: true,
      hideInTable: true,
      searchable: false,
      searchType: 'select',
      searchProps: { options: plantArr, clearable: true },
    },
    {
      field: 'plantName',
      title: '用料地区',
      minWidth: 120,
      align: 'center',
      showOverflowTooltip: true,
      searchable: false,
      searchType: 'input',
    },
    // {
    //   field: 'rptAccptdtCode',
    //   title: '计划周期',
    //   minWidth: 160,
    //   align: 'center',
    //   showOverflowTooltip: true,
    //   hideInTable: true,
    //   searchable: true,
    //   searchType: 'select',
    //   searchProps: { options: planCycleOptions, clearable: true },
    // },
    // {
    //   field: 'rptAccptdtName',
    //   title: '计划周期',
    //   minWidth: 160,
    //   align: 'center',
    //   showOverflowTooltip: true,
    //   searchable: false,
    //   searchType: 'input',
    // },
    {
      field: 'taxFlagName',
      title: '是否应税',
      minWidth: 100,
      align: 'center',
      showOverflowTooltip: false,
      searchable: false,
      hideInTable: true,
      searchType: 'input',
    },
    {
      field: 'taxFlag',
      title: '是否含税',
      minWidth: 100,
      align: 'center',
      showOverflowTooltip: true,
      type: 'slot',
      slotName: 'taxFlag',
      searchable: false,
      searchType: 'select',
      searchProps: { options: taxFlagOptions },
    },
    {
      field: 'consAmount',
      title: '采购总金额(元)',
      minWidth: 120,
      align: 'right',
      showOverflowTooltip: true,
      align: 'right',
      searchable: false,
      searchType: 'input',
    },
    {
      field: 'status',
      title: '状态',
      minWidth: 120,
      showOverflowTooltip: true,
      type: 'slot',
      slotName: 'status',
      align: 'center',
      searchable: false,
      searchType: 'select',
      // 多选（原系统默认 1,2；后端 status 接收逗号分隔字符串，onSearch 时 join 后传入）
      multiple: true,
      searchProps: { options: statusOptions, clearable: true },
    },
    {
      field: 'makeDate',
      title: '制单日期',
      minWidth: 140,
      align: 'center',
      showOverflowTooltip: true,
      type: 'date',
      timeFormat: '{y}-{m}-{d}',
      searchable: true,
      searchType: 'dateRange',
    },
    {
      field: 'subDate',
      title: '提交时间',
      minWidth: 140,
      align: 'center',
      showOverflowTooltip: true,
      type: 'date',
      timeFormat: '{y}-{m}-{d} {h}:{i}:{s}',
      searchable: false,
      searchType: 'dateRange',
    },
    // {
    //   field: 'auditDate',
    //   title: '审核时间',
    //   minWidth: 140,
    //   align: 'center',
    //   showOverflowTooltip: true,
    //   type: 'date',
    //   timeFormat: '{y}-{m}-{d} {h}:{i}:{s}',
    //   searchable: true,
    //   searchType: 'dateRange',
    // },
    {
      field: 'comments',
      title: '备注',
      minWidth: 140,
      align: 'center',
      showOverflowTooltip: true,
      searchable: false,
      searchType: 'input',
    },
  ]
}

// 懒导出：模块顶层不执行请求，进入页面调用 columns() 时才发请求（避免打包后未登录即触发 401）
export const columns = createRichColumns
