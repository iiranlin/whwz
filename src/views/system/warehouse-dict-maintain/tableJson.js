import { whLevelArr, venueTypeArr } from '@/utils/dictionary'

export const columns = [
  {
    field: "whCode",
    title: "仓库编码",
    minWidth: 160,
    align: "center",
    searchable: true,
    searchType: "input",
  },
  {
    field: "whName",
    title: "仓库名称",
    minWidth: 160,
    searchable: true,
    searchType: "input",
  },
  {
    field: "whLevel",
    title: "仓库级别",
    minWidth: 160,
    align: "center",
    type: "dict",
    searchable: true,
    searchType: "select",
    requestOptions: async () => whLevelArr,
    optionsCacheKey: "warehouse-dict-maintain:whLevel",
  },
  {
    field: "venueType",
    title: "仓库场所类型",
    minWidth: 160,
    align: "center",
    type: "dict",
    searchable: true,
    searchType: "select",
    requestOptions: async () => venueTypeArr,
    optionsCacheKey: "warehouse-dict-maintain:venueType",
  },
  {
    field: "whAddress",
    title: "仓库地址",
    minWidth: 160,
    align: "center",
  },
  {
    field: "longitude",
    title: "仓库定位-经度",
    minWidth: 160,
    align: "center",
  },
  {
    field: "latitude",
    title: "仓库定位-纬度",
    minWidth: 160,
    align: "center",
  },
  {
    field: "whSize",
    title: "仓库面积（平方米）",
    minWidth: 160,
    align: "center",
  },
  {
    field: "whDirector",
    title: "仓库负责人",
    minWidth: 160,
    align: "center",
  },
  {
    field: "direcotrPhone",
    title: "负责人电话",
    minWidth: 160,
    align: "center",
  }
];

export const toolbarConfig = {
  buttons: [
    {code: 'create', name: '新增', type: 'primary'},
    {code: 'modify', name: '修改', showInTop: false, showInRow: true},
    {code: 'delete', name: '删除', type: 'primary'},
  ]
}