import { statusArr } from '@/utils/dictionary'

export const columns = [
  {
    field: "unitCode",
    title: "所属单位编号",
    minWidth: 160,
    align: "center",
  },
  {
    field: "unitName",
    title: "所属单位名称",
    minWidth: 160,
  },
  {
    field: "plantCode",
    title: "地区编码",
    minWidth: 160,
    align: "center",
    searchable: true,
    searchType: "input",
  },
  {
    field: "plantName",
    title: "地区名称",
    minWidth: 160,
    searchable: true,
    searchType: "input",
  },
  {
    field: "status",
    title: "是否有效",
    minWidth: 160,
    type: "dict",
    searchable: true,
    searchType: "select",
    requestOptions: async () => statusArr,
    optionsCacheKey: "supplier-region-dict:status",
  },
];

export const toolbarConfig = {
  buttons: [
    {code: 'create', name: '新增', type: 'primary'},
    {code: 'modify', name: '修改', showInTop: false, showInRow: true},
  ]
}