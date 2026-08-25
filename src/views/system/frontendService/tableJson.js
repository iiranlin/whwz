export const columns = [
  {
    field: "serviceCode",
    title: "服务编码",
    minWidth: 140,
    searchable: true,
    searchType: "input"
  },
  {
    field: "serviceName",
    title: "服务名称",
    minWidth: 160,
    searchable: true,
    searchType: "input"
  },
  {
    field: "serviceUrl",
    title: "服务地址",
    minWidth: 200
  },
  {
    field: "serviceType",
    title: "服务类型",
    minWidth: 100
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
    optionsCacheKey: "frontend-service:status"
  },
  {
    field: "description",
    title: "服务说明",
    minWidth: 180
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
    { code: 'delete', name: '删除', type: 'primary' }
  ]
}
