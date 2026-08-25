import { statusArr } from '@/utils/dictionary'

export const columns = [
  {
    field: "unitName",
    title: "所属单位",
    minWidth: 160,
  },
  {
    field: "plantName",
    title: "所属供应地区",
    minWidth: 160,
  },
  {
    field: "areaCode",
    title: "区域编码",
    minWidth: 160,
    align: "center",
    searchable: true,
    searchType: "input",
  },
  {
    field: "areaName",
    title: "区域名称",
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
    optionsCacheKey: "supply-area:status",
  },
];

export const toolbarConfig = {
  buttons: [
    {code: 'create', name: '新增', type: 'primary'},
    {code: 'modify', name: '修改', showInTop: false, showInRow: true},
  ]
}