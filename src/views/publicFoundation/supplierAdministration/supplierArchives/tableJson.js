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
    field: "suUnicode",
    title: "统一社会信用代码",
    minWidth: 180,
    searchable: true,
    searchType: "input"
  },
  {
    field: "suSimpleName",
    title: "供应商简称",
    minWidth: 140
  },
  {
    field: "suType",
    title: "供应商类型",
    minWidth: 120,
    align: "center",
    searchable: true,
    searchType: "select",
    type: "dict",
    requestOptions: getSuTypeOptions,
    optionsCacheKey: "supplier:suType"
  },
  {
    field: "contactName",
    title: "联系人",
    minWidth: 100,
    align: "center"
  },
  {
    field: "contactPhone",
    title: "手机号",
    minWidth: 120,
    align: "center"
  },
  {
    field: "banned",
    title: "是否限制",
    minWidth: 90,
    align: "center",
    searchable: true,
    searchType: "select",
    type: "dict",
    requestOptions: async () => [
      { value: "0", label: "否" },
      { value: "1", label: "是" }
    ],
    optionsCacheKey: "supplier:banned"
  },
  {
    field: "status",
    title: "审核状态",
    minWidth: 100,
    align: "center",
    searchable: true,
    searchType: "select",
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
    field: "bizStatus",
    title: "业务状态",
    minWidth: 90,
    align: "center",
    searchable: true,
    searchType: "select",
    type: "dict",
    requestOptions: async () => [
      { value: "0", label: "启用" },
      { value: "1", label: "停用" }
    ],
    optionsCacheKey: "supplier:bizStatus"
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
    { code: 'create', name: '新增', type: 'primary' },
    {
      code: 'update', name: '修改', showInTop: false, showInRow: true,
      disabled: (selectedRows) => {
        const row = selectedRows[0] || {}
        return ['2', '3'].includes(row.status)
      }
    },
    {
      code: 'disableCooperate', name: '限制合作', showInTop: false, showInRow: true,
      disabled: (selectedRows) => {
        const row = selectedRows[0] || {}
        return ['2', '3'].includes(row.status)
      }
    },
    {
      code: 'withdraw', name: '撤回', showInTop: false, showInRow: true,
      disabled: (selectedRows) => {
        const row = selectedRows[0] || {}
        return !['2', '3'].includes(row.status)
      }
    },
    {
      code: 'delete', name: '删除', showInTop: false, showInRow: true,
      disabled: (selectedRows) => {
        const row = selectedRows[0] || {}
        return ['2', '3'].includes(row.status)
      }
    },
    { code: 'delete', name: '删除', type: 'primary' }
  ]
}
