export const columns = [
  {
    field: "username",
    title: "用户账号",
    minWidth: 140,
    searchable: true,
    searchType: "input"
  },
  {
    field: "nickName",
    title: "用户名称",
    minWidth: 140,
    searchable: true,
    searchType: "input"
  },
  {
    field: "deptName",
    title: "所属部门",
    minWidth: 160
  },
  {
    field: "phone",
    title: "联系方式",
    minWidth: 130
  },
  {
    field: "email",
    title: "电子邮箱",
    minWidth: 160
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
    optionsCacheKey: "system-user:status"
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
    { code: 'create', name: '新增', type: 'primary' },
    {
      code: 'update', name: '修改', showInTop: false, showInRow: true,
      disabled: (selectedRows) => {
        const row = selectedRows[0] || {}
        return !row.id
      }
    },
    { code: 'delete', name: '删除', type: 'primary' },
    {
      code: 'resetPwd', name: '重置密码', showInTop: false, showInRow: true,
      disabled: (selectedRows) => {
        const row = selectedRows[0] || {}
        return !row.id
      }
    },
    {
      code: 'role', name: '分配角色', showInTop: false, showInRow: true,
      disabled: (selectedRows) => {
        const row = selectedRows[0] || {}
        return !row.id
      }
    },
    {
      code: 'unlock', name: '解锁', showInTop: false, showInRow: true,
      disabled: (selectedRows) => {
        const row = selectedRows[0] || {}
        return row.status !== '1'
      }
    }
  ]
}
