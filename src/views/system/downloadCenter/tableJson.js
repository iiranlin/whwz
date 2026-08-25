export const columns = [
  {
    field: "menuName",
    title: "任务名称",
    minWidth: 200
  },
  {
    field: "status",
    title: "状态",
    minWidth: 100,
    type: "dict",
    requestOptions: async () => [
      { value: "1", label: "成功" },
      { value: "2", label: "失败" },
      { value: "0", label: "处理中" }
    ],
    optionsCacheKey: "download-center:status"
  },
  {
    field: "fileName",
    title: "文件名",
    minWidth: 200
  },
  {
    field: "createDate",
    title: "创建时间",
    minWidth: 170,
    type: "date"
  },
  {
    field: "finishDate",
    title: "完成时间",
    minWidth: 170,
    type: "date"
  },
  {
    field: "errorMsg",
    title: "失败原因",
    minWidth: 180
  }
]

export const toolbarConfig = {
  buttons: [
    { code: 'refresh', name: '刷新', type: 'primary' },
    {
      code: 'download', name: '下载', showInTop: false, showInRow: true,
      disabled: (selectedRows) => {
        const row = selectedRows[0] || {}
        return row.status !== '1'
      }
    }
  ]
}
