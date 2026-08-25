export const publishStatusObj={
    '1':'未发布',
    '2':'已发布'
}
export const tableJson=[
  {isShow: true, fixed: false, type: '', key: 'year', prop: 'year', label: '年度', align: 'center'},
  {isShow: true, fixed: false, type: '', key: 'unitCode', prop: 'unitCode', label: '单位编号', align: 'center'},
  {isShow: true, fixed: false, type: '', key: 'unitName', prop: 'unitName', label: '单位名称', align: 'center',},
  {isShow: true, fixed: false, type: 'slot', key: 'rationAmount', prop: 'rationAmount', label: '定额（元）', align: 'center',},
  {isShow: true, fixed: false, type: 'dict', key: 'flag', prop: 'flag', label: '状态', align: 'center',stats: publishStatusObj},
  {isShow: true, type: 'slot', key: 'operate', prop: 'operate', label: '操作', align: 'center', fixed: 'right'},
]
