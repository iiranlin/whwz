export const columns = [
  {
    field: "noticeTitle",
    title: "通知标题",
    minWidth: 200,
    searchable: true,
    searchType: "input"
  },
  {
    field: "noticeType",
    title: "通知类型",
    minWidth: 120,
    searchable: true,
    searchType: "select",
    requestOptions: async () => [
      { value: "0", label: "通知" },
      { value: "1", label: "公告" }
    ],
    optionsCacheKey: "system-notice:type"
  },
  {
    field: "publish",
    title: "发布状态",
    minWidth: 100,
    type: "dict",
    requestOptions: async () => [
      { value: "1", label: "已发布" },
      { value: "0", label: "未发布" }
    ],
    optionsCacheKey: "system-notice:publish"
  },
  {
    field: "createBy",
    title: "创建人",
    minWidth: 120
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
      code: 'publish', name: '发布', showInTop: false, showInRow: true,
      disabled: (selectedRows) => {
        const row = selectedRows[0] || {}
        return row.publish === '1'
      }
    },
    {
      code: 'unPublish', name: '撤回', showInTop: false, showInRow: true,
      disabled: (selectedRows) => {
        const row = selectedRows[0] || {}
        return row.publish !== '1'
      }
    },
    {
      code: 'view', name: '查看', showInTop: false, showInRow: true,
      disabled: (selectedRows) => {
        const row = selectedRows[0] || {}
        return !row.noticeMessage
      }
    }
  ]
}
