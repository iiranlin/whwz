export const columns = [
  {
    field: "matlCode",
    title: "物资编号",
    minWidth: 140,
    searchable: true,
    searchType: "input"
  },
  {
    field: "matlName",
    title: "物资名称",
    minWidth: 200,
    searchable: true,
    searchType: "input"
  },
  {
    field: "matlType",
    title: "规格型号",
    minWidth: 140,
    searchable: true,
    searchType: "input"
  },
  {
    field: "matlRaw",
    title: "材质",
    minWidth: 120,
    searchable: true,
    searchType: "input"
  },
  {
    field: "matlUnit",
    title: "计量单位",
    minWidth: 100,
    align: "center",
    searchable: true,
    searchType: "input"
  },
  {
    field: "matlPcode",
    title: "图号",
    minWidth: 140,
    searchable: true,
    searchType: "input"
  },
  {
    field: "unitWeight",
    title: "物资单重",
    minWidth: 100,
    align: "center"
  },
  {
    field: "trainTypeName",
    title: "车型",
    minWidth: 140
  },
  {
    field: "exStandard",
    title: "执行标准名称",
    minWidth: 160
  },
  {
    field: "materialCode",
    title: "物料编号",
    minWidth: 120
  },
  {
    field: "standByattr5",
    title: "技术平台",
    minWidth: 100,
    align: "center"
  },
  {
    field: "standByattr3",
    title: "是否集中编制",
    minWidth: 120,
    align: "center",
    type: "dict",
    requestOptions: async () => [
      { value: "0", label: "否" },
      { value: "1", label: "是" }
    ],
    optionsCacheKey: "material-matl:standbyattr3"
  },
  {
    field: "auditDate",
    title: "发布日期",
    minWidth: 130,
    type: "date"
  },
  {
    field: "enableState",
    title: "目录状态",
    minWidth: 90,
    align: "center",
    searchable: true,
    searchType: "select",
    type: "dict",
    requestOptions: async () => [
      { value: "1", label: "启用" },
      { value: "0", label: "停用" }
    ],
    optionsCacheKey: "material-matl:status"
  },
  {
    field: "stopReason",
    title: "停用原因",
    minWidth: 120
  },
  {
    field: "comments",
    title: "申请备注",
    minWidth: 140
  }
]

export const toolbarConfig = {
  buttons: [
    { code: 'create', name: '新增', type: 'primary' },
    {
      code: 'update', name: '修改', showInTop: false, showInRow: true,
      disabled: (selectedRows) => {
        const row = selectedRows[0] || {}
        return !row.matlCode
      }
    },
    { code: 'delete', name: '删除', type: 'primary' },
    { code: 'download', name: '下载模板', type: 'primary' },
    { code: 'upload', name: '模板导入', type: 'primary', upload: { multiple: false } }
  ]
}
