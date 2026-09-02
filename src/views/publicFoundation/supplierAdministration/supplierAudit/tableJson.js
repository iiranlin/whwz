import { getListByParentCode } from '@/api/base/dict'

// 供应商类型字典（SYS_DICT 配置 supplierType）
const getSuTypeOptions = async () => {
  const { data } = await getListByParentCode('supplierType')
  return (data || []).map(item => ({ label: item.label || item.name, value: item.value || item.code }))
}

export const columns = [
  {
    field: "suCode",
    title: "供应商编号",
    minWidth: 140,
    searchable: true,
    searchType: "input"
  },
  {
    field: "suName",
    title: "供应商名称",
    minWidth: 200,
    searchable: true,
    searchType: "input"
  },
  {
    field: "suSimpleName",
    title: "供应商简称",
    minWidth: 140
  },
  {
    field: "suUnicode",
    title: "统一社会信用代码",
    minWidth: 180
  },
  {
    field: "suType",
    title: "供应商类型",
    minWidth: 120,
    align: "center",
    type: "dict",
    requestOptions: getSuTypeOptions,
    optionsCacheKey: "supplier:suType"
  },
  // 联系信息列表列（已隐藏，需要时放开注释）
  // {
  //   field: "contactName",
  //   title: "联系人",
  //   minWidth: 100,
  //   align: "center"
  // },
  // {
  //   field: "contactPhone",
  //   title: "手机号",
  //   minWidth: 120,
  //   align: "center"
  // },
  {
    field: "status",
    title: "审核状态",
    minWidth: 100,
    align: "center",
    type: "dict",
    requestOptions: async () => [
      { value: "0", label: "审核失败" },
      { value: "1", label: "待审核" },
      { value: "2", label: "审核中" },
      { value: "3", label: "审核完成" }
    ],
    optionsCacheKey: "supplier:status"
  },
  {
    field: "createDate",
    title: "创建时间",
    minWidth: 170,
    searchable: true,
    searchType: "dateRange",
    type: "date"
  }
]

export const toolbarConfig = {
  buttons: [
    { code: 'pass', name: '通过', type: 'success', showInTop: false, showInRow: true },
    { code: 'reject', name: '驳回', type: 'danger', showInTop: false, showInRow: true },
    { code: 'detail', name: '详情', showInTop: false, showInRow: true }
  ]
}
