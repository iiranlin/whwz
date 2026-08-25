import { statusObj } from '@/utils/dictionary'
// 登卡状态
const flag_code = {'0': '未发布', '1': '已发布', '3': '已失效'}

export const tableJson = [
  {searchType: '', field: 'status', title: '状态', align: 'center',searchProps:{
    options:[
      {value:0, label: '未发布'},
      {value:1, label: '已发布'},
      {value:3, label: '已失效'}
    ]
  }},
  {searchType: '', field: 'code', title: '发布单号', align: 'center',},
  {searchType: '', field: 'createUserName', title: '创建人', align: 'center',},
  {searchType: 'date', field: 'createDate', title: '创建日期', align: 'center',},
  {searchType: 'date', field: 'releaseDate', title: '发布日期', align: 'center',},

  {field: 'status', title: '单据状态', searchType: 'select',searchable: true,hideInTable:true,searchProps: {
    options:[
    {value: 0, label: "未发布"},
    {value: 1, label: "已发布"},
    {value: 2, label: "已失效"},
  ],
    clearable:true,
  }},
  {field: 'code', title: '发布单号', searchType: 'input',searchable: true,hideInTable:true},
]

//按钮配置项
export const toolbarConfig = {
  buttons: [
    {
      code: "create",
      name: "新增",
      type: "primary",
      showInTop: true,
      tooltip: "新增",
    },
    {
      code: "pricePush",
      name: "发布",
      type: "primary",
      showInTop: true,
      tooltip: "发布",
    },
    {
      code: "detail",
      name: "详情",
      type: "primary",
      showInTop: false,
      showInRow: true,
      tooltip: "详情",
    },
    {
      code: "edit",
      name: "编辑",
      type: "primary",
      showInTop: false,
      showInRow: true,
      tooltip: "编辑",
    },
    {
      code: "delete",
      name: "删除",
      type: "primary",
      showInTop: false,
      showInRow: true,
      tooltip: "删除",
    },
  ],
};

 // 新增明细
 export const materialTableJson = [
  { isShow: true, fixed: false, type: '', key: 'specification', prop: 'specification', label: '柴油规格', align: 'center' },
  { isShow: true, fixed: false, type: 'slot', key: 'price', prop: 'price', label: '预发布价格', align: 'center',required: true},
  { isShow: true, fixed: false, type: 'slot', key: 'effectDate', prop: 'effectDate', label: '生效时间', align: 'center', required: true },
 ]