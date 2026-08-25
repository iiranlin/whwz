export const columns = [
  {
    field: "deptName",
    title: "部门名称",
    minWidth: 200,
    searchable: true,
    searchType: "input"
  },
  {
    field: "deptCode",
    title: "部门编码",
    minWidth: 140,
    searchable: true,
    searchType: "input"
  },
  {
    field: "parentName",
    title: "上级部门",
    minWidth: 160
  },
  {
    field: "sort",
    title: "排序",
    minWidth: 80,
    align: "center"
  },
  {
    field: "status",
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
    optionsCacheKey: "system-dept:status"
  },
  {
    field: "createTime",
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
        return !row.id
      }
    },
    {
      code: 'update', name: '修改', showInTop: false, showInRow: true,
      disabled: (selectedRows) => {
        const row = selectedRows[0] || {}
        return !row.id
      }
    },
    {
      code: 'batchModify', name: '批量修改', showInRow: false,
      disabled: (selectedRows) => !selectedRows.length
    },
    { code: 'delete', name: '删除', type: 'primary' }
  ]
}
