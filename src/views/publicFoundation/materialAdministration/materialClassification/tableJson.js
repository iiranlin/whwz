export const columns = [
  {
    field: "matlCateName",
    title: "分类名称",
    minWidth: 200,
    searchable: true,
    searchType: "input"
  },
  {
    field: "matlCateCode",
    title: "分类编码",
    minWidth: 140,
    searchable: true,
    searchType: "input"
  },
  {
    field: "supCateName",
    title: "上级分类",
    minWidth: 160
  },
  {
    field: "effectFlag",
    title: "状态",
    minWidth: 90,
    align: "center",
    searchable: true,
    searchType: "select",
    type: "dict",
    requestOptions: async () => [
      { value: "0", label: "启用" },
      { value: "1", label: "停用" }
    ],
    optionsCacheKey: "material-classify:status"
  }
]

export const toolbarConfig = {
  buttons: [
    { code: 'create', name: '新增', type: 'primary' },
    {
      code: 'addChild', name: '新增下级', showInTop: false, showInRow: true,
      disabled: (selectedRows) => {
        const row = selectedRows[0] || {}
        return !row.matlCateCode
      }
    },
    {
      code: 'update', name: '修改', showInTop: false, showInRow: true,
      disabled: (selectedRows) => {
        const row = selectedRows[0] || {}
        return !row.matlCateCode
      }
    },
    { code: 'delete', name: '删除', type: 'primary' }
  ]
}
