import { statusArr } from '@/utils/dictionary'

export const columns = [
  {
    field: "yearCode",
    title: "年度",
    minWidth: 100,
    align: "center",
  },
  {
    field: "equipCode",
    title: "设备编码",
    minWidth: 160,
    align: "center",
    searchable: true,
    searchType: "input",
  },
  {
    field: "equipName",
    title: "设备名称",
    minWidth: 160,
    searchable: true,
    searchType: "input",
  },
  {
    field: "quota",
    title: "定额（元）",
    minWidth: 140,
    align: "center",
  },
  {
    field: "equipType",
    title: "设备类型",
    minWidth: 160,
    searchable: true,
    searchType: "input",
  },
  // 【2026-09 设备字典改造停用，如需恢复放开注释即可】简拼
  // {
  //   field: "equipSpell",
  //   title: "简拼",
  //   minWidth: 160,
  // },
  // 【2026-09 设备字典改造停用，如需恢复放开注释即可】配属部门
  // {
  //   field: "deptName",
  //   title: "配属部门",
  //   minWidth: 160,
  // },
  // 【2026-09 设备字典改造停用，如需恢复放开注释即可】生产日期
  // {
  //   field: "makeDate",
  //   title: "生产日期",
  //   minWidth: 160,
  //   type: "date",
  // },
  // 【2026-09 设备字典改造停用，如需恢复放开注释即可】使用日期
  // {
  //   field: "useDate",
  //   title: "使用日期",
  //   minWidth: 160,
  //   type: "date",
  // },
  // 【2026-09 设备字典改造停用，如需恢复放开注释即可】原始价值
  // {
  //   field: "originalValue",
  //   title: "原始价值",
  //   minWidth: 160,
  // },
  // 【2026-09 设备字典改造停用，如需恢复放开注释即可】生产厂家
  // {
  //   field: "maker",
  //   title: "生产厂家",
  //   minWidth: 160,
  // },
  {
    field: "comments",
    title: "备注",
    minWidth: 160,
  },
  {
    field: "status",
    title: "是否有效",
    minWidth: 160,
    type: "dict",
    searchable: true,
    searchType: "select",
    requestOptions: async () => statusArr,
    optionsCacheKey: "equip-dict:isDistribute",
  },
]

export const toolbarConfig = {
  buttons: [
    {code: 'create', name: '新增', type: 'primary'},
    {code: 'modify', name: '修改', showInTop: false, showInRow: true},
    {code: 'delete', name: '删除', type: 'primary'},
  ]
}
