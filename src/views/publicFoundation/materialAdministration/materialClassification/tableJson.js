export const columns = [
  {
    field: "matlClassifyName",
    title: "分类名称",
    minWidth: 200,
    searchable: true,
    searchType: "input"
  },
  {
    field: "matlClassifyCode",
    title: "分类编码",
    minWidth: 140,
    searchable: true,
    searchType: "input"
  },
  {
    field: "parentName",
    title: "上级分类",
    minWidth: 160
  },
  {
    field: "sort",
    title: "排序",
    minWidth: 80,
    align: "center"
  },
  {
    field: "bizStatus",
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
      code: 'addChild', name: '新增下级', showInTop: false, showInRow: true,
      disabled: (selectedRows) => {
        const row = selectedRows[0] || {}
        return !row.matlClassifyId
      }
    },
    {
      code: 'update', name: '修改', showInTop: false, showInRow: true,
      disabled: (selectedRows) => {
        const row = selectedRows[0] || {}
        return !row.matlClassifyId
      }
    },
    { code: 'delete', name: '删除', type: 'primary' }
  ]
}
