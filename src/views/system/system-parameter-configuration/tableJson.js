import { statusArr, manageLevelArr } from '@/utils/dictionary'

export const columns = [
  {
    field: "paramCode",
    title: "参数号",
    minWidth: 160,
    align: 'center',
    searchable: true,
    searchType: "input",
  },
  {
    field: "paramName",
    title: "参数名称",
    minWidth: 140,
    searchable: true,
    searchType: "input",
  },
  {
    field: "comments",
    title: "说明",
    minWidth: 140,
  },
  {
    field: "paramValue",
    title: "参数值",
    minWidth: 140,
  },
  {
    field: "maintainLevel",
    title: "维护层级",
    minWidth: 140,
    type: 'dict',
    requestOptions: async () => manageLevelArr,
    optionsCacheKey: "system-parameter-configuration:maintainLevel",
  },
  {
    field: "enableStatus",
    title: "是否启用",
    minWidth: 140,
    type: 'dict',
    requestOptions: async () => statusArr,
    optionsCacheKey: "system-parameter-configuration:enableStatus",
  },
  {
    field: "createTime",
    title: "创建时间",
    minWidth: 140,
    type: 'date'
  }
];

export const toolbarConfig = {
  buttons: [
    {code: 'modify', name: '修改', showInTop: false, showInRow: true},
  ]
}