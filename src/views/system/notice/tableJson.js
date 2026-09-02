export const columns = [
  {
    field: "noticeTitle",
    title: "通知标题",
    minWidth: 200,
    searchable: true,
    searchType: "input"
  },
  {
    field: "flag",
    title: "发布状态",
    minWidth: 100,
    searchable: true,
    searchType: "select",
    type: "dict",
    requestOptions: async () => [
      { value: "1", label: "已发布" },
      { value: "0", label: "未发布" }
    ],
    optionsCacheKey: "system-notice:publish"
  },
  {
    field: "createUser",
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
        // 已发布的通知不允许修改（与后端规则对齐）
        return !row.id || String(row.flag) === '1'
      }
    },
    { code: 'delete', name: '删除', type: 'primary' },
    {
      code: 'publish', name: '发布', showInTop: false, showInRow: true,
      disabled: (selectedRows) => {
        const row = selectedRows[0] || {}
        return String(row.flag) === '1'
      }
    },
    {
      code: 'unPublish', name: '撤回', showInTop: false, showInRow: true,
      disabled: (selectedRows) => {
        const row = selectedRows[0] || {}
        return String(row.flag) !== '1'
      }
    },
    {
      code: 'view', name: '查看', showInTop: false, showInRow: true,
      disabled: (selectedRows) => {
        const row = selectedRows[0] || {}
        // 列表不含 CLOB 正文，查看统一走详情接口，仅要求有 id
        return !row.id
      }
    }
  ]
}
