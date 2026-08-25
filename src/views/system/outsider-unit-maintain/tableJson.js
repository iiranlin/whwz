import { unitTypeArr, enableFlagArr } from '@/utils/dictionary'

export const columns = [
  {
    field: "unitCode",
    title: "单位编号",
    minWidth: 160,
    align: "center",
    searchable: true,
    searchType: "input",
  },
  {
    field: "unitName",
    title: "单位名称",
    minWidth: 160,
    searchable: true,
    searchType: "input",
  },
  {
    field: "unitType",
    title: "单位类型",
    minWidth: 160,
    type: "dict",
    searchable: true,
    searchType: "select",
    requestOptions: async () => unitTypeArr,
    optionsCacheKey: "outsider-unit-maintain:unitType",
  },
  {
    field: "unitShortName",
    title: "单位简称",
    minWidth: 160,
  },
  {
    field: "contact",
    title: "联系人",
    minWidth: 140,
  },
  {
    field: "contactPosition",
    title: "联系人职务",
    minWidth: 140,
  },
  {
    field: "contactPhone",
    title: "联系人电话",
    minWidth: 140,
    align: "center",
  },
  {
    field: "createDate",
    title: "创建时间",
    minWidth: 140,
    type: "date",
  },
  {
    field: "flag",
    title: "状态",
    minWidth: 160,
    type: "dict",
    searchable: true,
    searchType: "select",
    requestOptions: async () => enableFlagArr,
    optionsCacheKey: "outsider-unit-maintain:flag",
  },
];

export const toolbarConfig = {
  buttons: [
    {code: 'create', name: '新增', type: 'primary'},
    {code: 'modify', name: '修改', showInTop: false, showInRow: true},
    {code: 'delete', name: '删除', type: 'primary'},
    {code: 'enable', name: '启用', type: 'primary'},
    {code: 'disable', name: '停用', type: 'primary'},
  ]
}