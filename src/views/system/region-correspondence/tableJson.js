import { statusArr, manageLevelArr } from '@/utils/dictionary'

export const columns = [
  {
    field: "useUnitName",
    title: "用料单位",
    minWidth: 160,
  },
  {
    field: "usePlantName",
    title: "用料地区",
    minWidth: 160,
    searchable: true,
    searchType: "input",
  },
  {
    field: "supplyUnitName",
    title: "采供单位",
    minWidth: 160,
  },
  {
    field: "supplyPlantName",
    title: "供应地区",
    minWidth: 160,
    searchable: true,
    searchType: "input",
  },
  {
    field: "supplyAreaName",
    title: "供应区域",
    minWidth: 160,
  },
  {
    field: "manageLevel",
    title: "管理权限",
    minWidth: 160,
    type: "dict",
    requestOptions: async () => manageLevelArr,
    optionsCacheKey: "region-correspondence:manageLevel",
  },
  {
    field: "status",
    title: "是否有效",
    minWidth: 160,
    type: "dict",
    searchable: true,
    searchType: "select",
    requestOptions: async () => statusArr,
    optionsCacheKey: "region-correspondence:status",
  },
];

export const toolbarConfig = {
  buttons: [
    {code: 'create', name: '新增', type: 'primary'},
    {code: 'modify', name: '修改', showInTop: false, showInRow: true},
  ]
}