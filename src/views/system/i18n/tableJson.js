export const columns = [
  {
    field: "i18nCode",
    title: "词条编码",
    minWidth: 180,
    searchable: true,
    searchType: "input"
  },
  {
    field: "i18nKey",
    title: "词条KEY",
    minWidth: 160,
    searchable: true,
    searchType: "input"
  },
  {
    field: "i18nValue",
    title: "词条值",
    minWidth: 200
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
    { code: 'delete', name: '删除', type: 'primary' }
  ]
}
