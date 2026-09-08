export const columns = [
  {
    field: "roleCode",
    title: "角色编号",
    minWidth: 160,
    searchable: true,
    searchType: "input"
  },
  {
    field: "roleName",
    title: "角色名称",
    minWidth: 160,
    searchable: true,
    searchType: "input"
  },
  // 所属单位：当前仅一个单位，暂隐藏该列；如需恢复请取消注释
  // {
  //   field: "unitName",
  //   title: "所属单位",
  //   minWidth: 160
  // },
  {
    field: "status",
    title: "状态",
    minWidth: 90,
    type: "dict",
    requestOptions: async () => [
      { value: "0", label: "启用" },
      { value: "1", label: "停用" }
    ],
    optionsCacheKey: "system-role:status"
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
      code: 'authUser', name: '分配用户', showInTop: false, showInRow: true,
      disabled: (selectedRows) => {
        const row = selectedRows[0] || {}
        return !row.id
      }
    },
    {
      code: 'bindMenu', name: '菜单权限', showInTop: false, showInRow: true,
      disabled: (selectedRows) => {
        const row = selectedRows[0] || {}
        return !row.id
      }
    }
  ]
}
