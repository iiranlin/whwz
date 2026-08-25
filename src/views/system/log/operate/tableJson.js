export const columns = [
  {
    field: "username",
    title: "操作人",
    minWidth: 140,
    searchable: true,
    searchType: "input"
  },
  {
    field: "module",
    title: "执行模块",
    minWidth: 140,
    searchable: true,
    searchType: "input"
  },
  {
    field: "method",
    title: "执行方法",
    minWidth: 180
  },
  {
    field: "clientIp",
    title: "IP地址",
    minWidth: 140
  },
  {
    field: "flag",
    title: "执行描述",
    minWidth: 100,
    type: "dict",
    requestOptions: async () => [
      { value: "0", label: "执行成功" },
      { value: "1", label: "执行失败" },
      { value: "2", label: "系统异常" }
    ],
    optionsCacheKey: "log-operate:flag"
  },
  {
    field: "createDate",
    title: "创建时间",
    minWidth: 170,
    type: "date",
    searchable: true,
    searchType: "dateRange"
  }
]

export const toolbarConfig = {
  buttons: [
    { code: 'delete', name: '删除', type: 'primary', showInRow: true },
    {
      code: 'detail', name: '详情', showInTop: false, showInRow: true,
      disabled: (selectedRows) => {
        const row = selectedRows[0] || {}
        return !row.id
      }
    }
  ]
}
