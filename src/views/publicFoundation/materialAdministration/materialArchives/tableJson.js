export const columns = [
  {
    field: "matlCode",
    title: "物料编码",
    minWidth: 140,
    searchable: true,
    searchType: "input"
  },
  {
    field: "matlName",
    title: "物料名称",
    minWidth: 200,
    searchable: true,
    searchType: "input"
  },
  {
    field: "matlCateName",
    title: "物料分类",
    minWidth: 160
  },
  {
    field: "matlType",
    title: "规格型号",
    minWidth: 140,
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
    field: "enableState",
    title: "状态",
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
    field: "createDate",
    title: "创建时间",
    minWidth: 170,
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
        return !row.matlCode
      }
    },
    { code: 'delete', name: '删除', type: 'primary' }
  ]
}
