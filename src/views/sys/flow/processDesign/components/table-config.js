export const columns = [
  {
    field: 'processName',
    title: '流程名称',
    minWidth: 180,
    type: 'link',
    searchable: true,
    searchType: 'input'
  },
  {
    field: 'billTypeName',
    title: '关联业务',
    minWidth: 150
  },
  {
    field: 'useOrgName',
    title: '适用单位',
    minWidth: 160,
    searchable: true,
    searchType: 'input'
  },
  {
    field: 'version',
    title: '版本号',
    minWidth: 100
  },
  {
    field: 'updateUserName',
    title: '最后修改人',
    minWidth: 130
  },
  {
    field: 'updateDate',
    title: '最后修改时间',
    minWidth: 170,
    type: 'date'
  },
  {
    field: 'status',
    title: '状态',
    minWidth: 90,
    type: 'dict',
    requestOptions: async () => [
      { value: '0', label: '启用' },
      { value: '1', label: '停用' }
    ],
    optionsCacheKey: 'sys-flow-processDesign:status',
    searchable: true,
    searchType: 'select'
  }
]

export const toolbarConfig = {
  buttons: [
    // 顶部按钮
    { code: 'create', name: '新增', type: 'primary' },
    {
      code: 'delete', name: '删除', type: 'primary',
      // disabled: (selectedRows) => !selectedRows.length
      // 已经启用的不能删除
      disabled: (selectedRows) => !selectedRows.length || selectedRows.some(r => r.status === '0')
    },
    {
      code: 'start', name: '启用', type: 'primary',
      disabled: (selectedRows) => !selectedRows.length || selectedRows.some(r => r.status === '0')
    },
    {
      code: 'stop', name: '停用', type: 'primary',
      disabled: (selectedRows) => !selectedRows.length || selectedRows.some(r => r.status === '1')
    },
    // 行内按钮
    {
      code: 'update', name: '修改', showInTop: false, showInRow: true,
      disabled: (selectedRows) => {
        const row = selectedRows[0] || {}
        return row.status === '1'
      }
    },
    {
      code: 'design', name: '流程设计', showInTop: false, showInRow: true,
      disabled: (selectedRows) => {
        const row = selectedRows[0] || {}
        return row.status === '1'
      }
    },
    { code: 'version', name: '版本记录', showInTop: false, showInRow: true }
  ]
}
