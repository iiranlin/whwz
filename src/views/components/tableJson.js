export const teamTableJson = [
  {isShow: true, fixed: false, type: '', key: 'pdeptName', prop: 'pdeptName', label: '车间', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'deptName', prop: 'deptName', label: '班组', align: 'center', width: 160},
]

// 选择审批人弹框字段
export const userTableJson = [
  {
    field: 'userCode',
    title: '用户编号',
    showOverflowTooltip: true,
    searchable: true,
    searchType: 'input',
  },
  {
    field: 'userName',
    title: '姓名',
    showOverflowTooltip: true,
    searchable: true,
    searchType: 'input',
  },
  {
    field: 'deptName',
    title: '部门名称',
    showOverflowTooltip: true,
    searchable: false,
    searchType: 'input',
  },
  {
    field: 'phone',
    title: '联系方式',
    showOverflowTooltip: true,
    searchable: false,
    searchType: 'input',
  },
]

