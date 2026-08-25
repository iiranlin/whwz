export const columns = [
  {
    field: "username",
    title: "登录账号",
    minWidth: 140,
    searchable: true,
    searchType: "input"
  },
  {
    field: "type",
    title: "操作内容",
    minWidth: 100,
    type: "dict",
    requestOptions: async () => [
      { value: "1", label: "登录" },
      { value: "2", label: "退出" }
    ],
    optionsCacheKey: "log-login:type"
  },
  {
    field: "clientIp",
    title: "IP地址",
    minWidth: 140
  },
  {
    field: "clientBrowser",
    title: "登录浏览器",
    minWidth: 160
  },
  {
    field: "createTime",
    title: "创建时间",
    minWidth: 170,
    type: "date"
  }
]

export const toolbarConfig = {
  buttons: [
    { code: 'delete', name: '删除', type: 'primary', showInRow: true }
  ]
}
