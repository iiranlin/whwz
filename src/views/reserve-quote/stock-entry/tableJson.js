export const publishStatusObj = {
  '0': '未发布',
  '1': '已发布'
}
export const tableJson = [
  { isShow: true, fixed: false, type: '', key: 'version', prop: 'version', label: '版本号', align: 'center' },
  { isShow: true, fixed: false, type: '', key: 'year', prop: 'year', label: '年度', align: 'center' },
  { isShow: true, fixed: false, type: 'dict', key: 'flag', prop: 'flag', label: '状态', align: 'center', stats: publishStatusObj },
  { isShow: true, fixed: false, type: 'date', key: 'createDate', prop: 'createDate', label: '创建日期', align: 'center', },
  { isShow: true, fixed: false, type: 'date', key: 'releaseDate', prop: 'releaseDate', label: '发布日期', align: 'center', },
  { isShow: true, type: 'slot', key: 'operate', prop: 'operate', label: '操作', align: 'center', fixed: 'right', width: 60 },
]


export const columns = [
    {
      field: 'version',
      title: '版本号',
      showOverflowTooltip: true,
      searchable: false,
      searchType: 'input',
    },
    {
      field: 'year',
      title: '年份',
      searchable: true,
      searchType: 'date',
      searchProps: { type: 'year', valueFormat: 'YYYY' },
    },
    {
      field: 'flag',
      title: '状态',
      showOverflowTooltip: true,
      searchable: true,
      searchType: 'select',
      options: [
        { label: '未发布', value: '0' },
        { label: '已发布', value: '1' },
      ],
    },
    {
      field: 'createDate',
      title: '创建日期',
      showOverflowTooltip: true,
      searchable: false,
      searchType: 'input',
      type: 'date',
      dateFormat: 'YYYY-MM-DD',
    },
    {
      field: 'releaseDate',
      title: '发布日期',
      showOverflowTooltip: true,
      searchable: false,
      searchType: 'input',
      type: 'date',
      dateFormat: 'YYYY-MM-DD',
    },
  ]


export const matlTableJson = [
    {
    field: 'railwayName',
    title: '路局',
    showOverflowTooltip: true,
    searchable: false,

  },
    {
    field: 'amount',
    title: '物库存管理目标（元）资编码',
    showOverflowTooltip: true,
    searchable: false,
  slotName: 'amount'
  },
]