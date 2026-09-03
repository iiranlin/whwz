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
    field: "suBizCodeExpire",
    title: "营业执照有效期",
    minWidth: 120,
    align: "center",
    type: "date",
    timeFormat: "{y}-{m}-{d}"
  },
  // 供应商类型列（已隐藏，需要时放开注释）
  // {
  //   field: "suType",
  //   title: "供应商类型",
  //   minWidth: 120,
  //   align: "center",
  //   searchable: true,
  //   searchType: "select",
  //   type: "dict",
  //   requestOptions: getSuTypeOptions,
  //   optionsCacheKey: "supplier:suType"
  // },
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
  // 审核状态列（已隐藏，需要时放开注释）
  // {
  //   field: "status",
  //   title: "审核状态",
  //   minWidth: 100,
  //   align: "center",
  //   searchable: true,
  //   searchType: "select",
  //   type: "dict",
  //   requestOptions: async () => [
  //     { value: "0", label: "审核失败" },
  //     { value: "1", label: "待审核" },
  //     { value: "2", label: "审核中" },
  //     { value: "3", label: "审核完成" }
  //   ],
  //   optionsCacheKey: "supplier:status"
  // },
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
    { code: 'download', name: '下载模板', type: 'primary' },
    { code: 'upload', name: '模板导入', type: 'primary', upload: { multiple: false } },
    {
      code: 'update', name: '修改', showInTop: false, showInRow: true
      // 保存即生效后不再按审核状态限制（需要时放开注释）
      // disabled: (selectedRows) => {
      //   const row = selectedRows[0] || {}
      //   return ['2', '3'].includes(row.status)
      // }
    },
    {
      code: 'disableCooperate', name: '限制合作', showInTop: false, showInRow: true
      // 保存即生效后不再按审核状态限制（需要时放开注释）
      // disabled: (selectedRows) => {
      //   const row = selectedRows[0] || {}
      //   return ['2', '3'].includes(row.status)
      // }
    },
    // 撤回按钮（保存即生效后不再使用，需要时放开注释）
    // {
    //   code: 'withdraw', name: '撤回', showInTop: false, showInRow: true,
    //   disabled: (selectedRows) => {
    //     const row = selectedRows[0] || {}
    //     return !['2', '3'].includes(row.status)
    //   }
    // },
    // 提交按钮（保存即生效后不再使用，需要时放开注释）
    // {
    //   code: 'submitAudit', name: '提交', showInTop: false, showInRow: true,
    //   disabled: (selectedRows) => {
    //     const row = selectedRows[0] || {}
    //     return row.status !== '1'
    //   }
    // },
    {
      code: 'delete', name: '删除', showInTop: false, showInRow: true
      // 保存即生效后不再按审核状态限制（需要时放开注释）
      // disabled: (selectedRows) => {
      //   const row = selectedRows[0] || {}
      //   return ['2', '3'].includes(row.status)
      // }
    },
    { code: 'delete', name: '删除', type: 'primary' }
  ]
}
