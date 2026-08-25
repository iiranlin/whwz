export const columns = [
  {
    field: 'unitCode',
    title: '单位编号',
    showOverflowTooltip: true,
    searchable: false,
    searchType: 'input',
  },
  {
    field: 'unitName',
    title: '单位名称',
    showOverflowTooltip: true,
    searchable: false,
    searchType: 'input',
  },
  {
    field: 'matlCode',
    title: '物资分类编号',
    showOverflowTooltip: true,
    searchable: true,
    searchType: 'input',
  },
  {
    field: 'matlName',
    title: '物资分类名称',
    showOverflowTooltip: true,
    searchable: true,
    searchType: 'input',
  },
  {
    field: 'allGroupName',
    title: '验收分组名称',
    showOverflowTooltip: true,
    searchable: false,
    searchType: 'input',
  },
]

//弹框 Group
export const groupColumns = [
  {
    field: 'matlCode',
    title: '物资编码',
    showOverflowTooltip: true,
    searchable: true,
    searchType: 'input',
  },
  {
    field: 'matlName',
    title: '物资名称',
    showOverflowTooltip: true,
    searchable: true,
    searchType: 'input',
  },

  {
    field: 'matlType',
    title: '来源',
    width: 140,
    searchable: true,
    hideInTable: true,
    searchType: 'radio',
    searchProps: {
      options: [
        { label: '物资分类', value: '1' },
        { label: '物资目录', value: '2' },
      ],
    },
  },
  {
    field: 'matlType',
    title: '规格型号',
    showOverflowTooltip: true,
    searchable: false,
    searchType: 'input',
  },
  {
    field: 'matlRaw',
    title: '材质',
    showOverflowTooltip: true,
    searchable: false,
    searchType: 'input',
  },
  {
    field: 'matlUnit',
    title: '计量单位',
    showOverflowTooltip: true,
    searchable: false,
    searchType: 'input',
  },
  {
    field: 'matlPcode',
    title: '图号',
    showOverflowTooltip: true,
    searchable: false,
    searchType: 'input',
  },

]














