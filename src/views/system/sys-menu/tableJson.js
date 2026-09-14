// sys-menu 菜单管理 - el-pro-table 列定义 + 工具栏配置

export const columns = [
  {
    field: "menuName",
    title: "菜单名称",
    minWidth: 180,
    searchable: true,
    searchType: "input",
  },
  {
    field: "menuCode",
    title: "菜单编码",
    minWidth: 130,
    searchable: true,
    searchType: "input",
  },
  {
    field: "parentName",
    title: "上级菜单",
    minWidth: 130,
  },
  {
    field: "menuIcon",
    title: "图标",
    width: 70,
    align: "center",
    slotName: "menuIcon",
  },
  {
    field: "menuUrl",
    title: "菜单URL",
    minWidth: 170,
    showOverflowTooltip: true,
  },
  {
    field: "component",
    title: "组件地址",
    minWidth: 150,
    showOverflowTooltip: true,
  },
  {
    field: "seq",
    title: "排序",
    width: 70,
    align: "center",
  },
  {
    field: "menuType",
    title: "菜单类型",
    width: 90,
    align: "center",
    slotName: "menuType",
  },
  {
    field: "status",
    title: "状态",
    width: 80,
    align: "center",
    searchable: true,
    searchType: "select",
    searchProps: { clearable: true },
    options: [
      { label: "启用", value: 0 },
      { label: "停用", value: 1 },
    ],
    slotName: "status",
  },
  {
    field: "isHide",
    title: "是否隐藏",
    width: 90,
    align: "center",
    slotName: "isHide",
  },
]

export const toolbarConfig = {
  buttons: [
    {
      code: "create",
      name: "新增",
      type: "primary",
      showInTop: true,
    },
    {
      code: "delete",
      name: "删除",
      type: "primary",
      showInTop: true,
    },
    {
      code: "update",
      name: "修改",
      type: "primary",
      showInTop: false,
      showInRow: true,
    },
    {
      code: "addChild",
      name: "新增下级",
      type: "primary",
      showInTop: false,
      showInRow: true,
    },
    {
      code: "copy",
      name: "复制",
      type: "primary",
      showInTop: false,
      showInRow: true,
    },
    {
      code: "deleteRow",
      name: "删除",
      type: "primary",
      showInTop: false,
      showInRow: true,
    },
  ],
}
