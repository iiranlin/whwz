export const columns = [
  {
    field: "epPartCode",
    title: "部件编码",
    minWidth: 160,
    align: 'center',
    searchable: true,
    searchType: "input",
  },
  {
    field: "epPartName",
    title: "部件名称",
    minWidth: 140,
    searchable: true,
    searchType: "input",
  },
  {
    field: "equipName",
    title: "所属设备",
    minWidth: 140,
  },
  {
    field: "equipType",
    title: "设备类型",
    minWidth: 140,
    searchable: true,
    searchType: "input",
  },
  {
    field: "pcode",
    title: "图号",
    minWidth: 140,
  },
  {
    field: "proline",
    title: "生产线",
    minWidth: 140,
  }
];

export const toolbarConfig = {
  buttons: [
    {code: 'create', name: '新增', type: 'primary'},
    {code: 'modify', name: '修改', showInTop: false, showInRow: true},
    {code: 'delete', name: '删除', type: 'primary'},
  ]
}