export const columns = [
  {
    field: "code",
    title: "字典编号",
    minWidth: 160,
    searchable: true,
    searchType: "input"
  },
  {
    field: "name",
    title: "字典名称",
    minWidth: 160,
    searchable: true,
    searchType: "input"
  },
  {
    field: "seq",
    title: "排序",
    minWidth: 80
  },
  {
    field: "status",
    title: "状态",
    minWidth: 90,
    type: "dict",
    requestOptions: async () => [
      { value: "0", label: "启用" },
      { value: "1", label: "停用" }
    ],
    optionsCacheKey: "system-dict:status"
  },
  {
    field: "remark",
    title: "备注",
    minWidth: 160
  }
]

export const toolbarConfig = {
  buttons: [
    { code: 'create', name: '新增', type: 'primary' },
    {
      code: 'update', name: '修改', showInTop: false, showInRow: true,
      disabled: (selectedRows) => {
        const row = selectedRows[0] || {}
        return !row.id
      }
    },
    { code: 'delete', name: '删除', type: 'primary' },
    { code: 'refresh', name: '刷新缓存' }
  ]
}
