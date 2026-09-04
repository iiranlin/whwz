import { statusObj } from '@/utils/dictionary'
import {
  plantDictList,
  warehouseDict,
  warehouseplantDictList,
} from "@/api/materialMaintain/materialGroup";

// 退料来源
const rtmtSource_code = {'0': '正常退料', '1': '废料回收'}
// 登卡状态
const flag_code = {'0': '未登卡', '1': '已登卡'}

// 81-退料单改造：检索联动缓存（地区/仓库列表，供 地区→仓库→分区 三级联动取 id 用）
export const searchCache = { plantList: [], whList: [] }

export const tableJson = [
  // 81-退料单改造：按需求图隐藏"财务年月"列，如需恢复取消注释
  // {searchType: '', field: 'yearMonth', title: '财务年月', align: 'center'},
  // 81-退料单改造：按需求图列名调整为"状态"并提前至首列
  {searchType: 'select', field: 'flag', title: '状态', align: 'center',searchProps:{
    options:[
    {value: 0, label: "未登卡"},
    {value: 1, label: "已登卡"},
    ]
  }},
  {searchType: 'link', field: 'returnCode',  title: '退料单号', align: 'center',slotName:'code-cell'},
  // 81-退料单改造：按需求图新增"出库单号"列
  {searchType: '', field: 'obCode', title: '出库单号', align: 'center',},
  {searchType: '', field: 'deptName', title: '领料部门', align: 'center',},
  {searchType: '', field: 'plantName', title: '用料地区', align: 'center',},
  {searchType: '', field: 'depotName', title: '仓库', align: 'center',},
  {searchType: '', field: 'partitionName', title: '仓库分区', align: 'center',},
  // 81-退料单改造：按需求图隐藏"单据总金额"列，如需恢复取消注释
  // {searchType: '', field: 'amount', title: '单据总金额', align: 'center',},
  {searchType: 'date', field: 'orderDate', title: '下单日期', align: 'center',},
  {searchType: '', field: 'comments', title: '备注', align: 'center',},

  {field: 'flag', title: '单据状态', searchType: 'select',searchable: true,hideInTable:true,searchProps: {
    options:[
    {value: 0, label: "未登卡"},
    {value: 1, label: "已登卡"},
  ],
    clearable: true,
  }},
  {field: 'returnCode', title: '退料单号', searchType: 'input',searchable: true,hideInTable:true},
  // 81-退料单改造：按需求图新增"出库单号"检索项
  {field: 'obCode', title: '出库单号', searchType: 'input',searchable: true,hideInTable:true},
  // 81-退料单改造：用料地区/仓库/仓库分区恢复为下拉联动形式（options 由 index.vue getPlantList 填充）
  {field: 'plantCode', title: '用料地区', searchType: 'select',searchable: true,hideInTable:true,searchProps:{
    options:[],
    clearable: true,
  }},
  {field: 'depotCode', title: '仓库', searchType: 'select',searchable: true,hideInTable:true,dependsOn: ['plantCode'],searchProps:{
    options:[],
    clearable: true,
  }, async onDependencyChange({
    form,
    changedField,
    setFieldValue,
    setFieldProps,
  }) {
    if (changedField !== 'plantCode') return;
    setFieldProps('depotCode',{options:[]})
    setFieldValue('depotCode','')
    if (!form.plantCode) return
    // 联动需地区 id 调仓库接口（选项 value 为 plantCode，从缓存取 id）
    const plantObj = searchCache.plantList.find(p => p.plantCode === form.plantCode)
    if (!plantObj) return
    const {data} = await warehouseDict(plantObj.id)
    searchCache.whList = data || []
    const depotOptions = searchCache.whList.map(item => ({
      label:item.whName,
      value:item.whCode
    }))
    setFieldProps('depotCode',{options:depotOptions})
  }},
  {field: 'partitionCode', title: '仓库分区', searchType: 'select',searchable: true,hideInTable:true,dependsOn: ['depotCode'],searchProps:{
    options:[],
    clearable: true,
  }, async onDependencyChange({
    form,
    changedField,
    setFieldValue,
    setFieldProps,
  }) {
    if (changedField !== 'depotCode') return;
    setFieldProps('partitionCode',{options:[]})
    setFieldValue('partitionCode','')
    if (!form.depotCode) return
    // 联动需仓库 id 调分区接口（选项 value 为 whCode，从缓存取 id）
    const whObj = searchCache.whList.find(w => w.whCode === form.depotCode)
    if (!whObj) return
    const {data} = await warehouseplantDictList({whId: whObj.id})
    const partitionOptions = (data || []).map(item => ({
      label:item.partitionName,
      value:item.partitionCode
    }))
    setFieldProps('partitionCode',{options:partitionOptions})
  }},
  // 81-退料单改造：仓库/仓库分区输入框模糊查询配置（已切换回下拉联动，保留备恢复）
  // {field: 'depotName', title: '仓库', searchType: 'input',searchable: true,hideInTable:true},
  // {field: 'partitionName', title: '仓库分区', searchType: 'input',searchable: true,hideInTable:true},
  {field: 'deptName', title: '领料部门', searchType: 'input',searchable: true,hideInTable:true},
  {field: 'matlCode', title: '物资编码', searchType: 'input',searchable: true,hideInTable:true},
  {field: 'matlName', title: '物资名称', searchType: 'input',searchable: true,hideInTable:true},
  // 81-退料单改造：按需求图隐藏"规格型号"检索项，如需恢复取消注释
  // {field: 'matlType', title: '规格型号', searchType: 'input',searchable: true,hideInTable:true},
  {field: 'orderDate', title: '下单日期', searchType: 'date',searchable: true,hideInTable:true},
]

export const tableButtonJson = [
  {code: 'create', name: '新增'},
  {code: 'edit', name: '编辑',type: 'inline'},
  {code: 'delete', name: '删除'},
  {code: 'print', name: '打印'},
  {code: 'export', name: '导出'},
  {code: 'denka', name: '登卡'},
  {code: 'revokeDenka', name: '撤销登卡'},
]

// 新增弹框明细字段
export const matlTableJson = [
  {isShow: true, fixed: false, type: '', key: 'matlCode', prop: 'matlCode', label: '物资编码', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'matlName', prop: 'matlName', label: '物资名称', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'matlType', prop: 'matlType', label: '规格型号/材质/图号', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'matlUnit', prop: 'matlUnit', label: '计量单位', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'batchNo', prop: 'batchNo', label: '批次号', align: 'center', width: 160},
  {isShow: true, fixed: false, type: 'slot', key: 'rmNum', prop: 'rmNum', label: '退料数量', align: 'right', width: 160, required: true},
  {isShow: true, fixed: false, type: '', key: 'price', prop: 'price', label: '库存单价（元）', align: 'right', width: 160},
  {isShow: true, fixed: false, type: '', key: 'rmAmount', prop: 'rmAmount', label: '退料金额（元）', align: 'right', width: 160},
  // {isShow: true, fixed: false, type: '', key: 'stockNum', prop: 'stockNum', label: '出库数量', align: 'right', width: 160},
]

export const matlTableButtonJson = [
  {code: 'delete', name: '删除', type: 'inline'},
]

// 打印字段
export const printMatlTableJson = [
  {isShow: true, fixed: false, type: '', key: 'matlCode', prop: 'matlCode', label: '物资编码', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'matlName', prop: 'matlName', label: '物资名称/规格型号', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'matlUnit', prop: 'matlUnit', label: '单位', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'rmNum', prop: 'rmNum', label: '退料数量', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'price', prop: 'price', label: '库存单价(元)', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'rmAmount', prop: 'rmAmount', label: '退料金额', align: 'right', width: 160},
]

// 详情
export const tableJsonDetail = [
  {isShow: true, fixed: false, type: '', key: 'matlCode', prop: 'matlCode', label: '物资编码', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'matlName', prop: 'matlName', label: '物资名称', align: 'center', width: 160},
  {isShow: true, fixed: false, type: 'slot', key: 'matlType', prop: 'matlType', label: '规格型号/材质/图号', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'matlUnit', prop: 'matlUnit', label: '计量单位', align: 'center', width: 160},
  {isShow: true, fixed: false, type: 'slot', key: 'rmNum', prop: 'rmNum', label: '退料数量', align: 'right', width: 160, required: true},
  {isShow: true, fixed: false, type: '', key: 'price', prop: 'price', label: '库存单价（元）', align: 'right', width: 160},
  {isShow: true, fixed: false, type: '', key: 'rmAmount', prop: 'rmAmount', label: '退料金额（元）', align: 'right', width: 160},
  // {isShow: true, fixed: false, type: '', key: 'stockNum', prop: 'stockNum', label: '出库数量', align: 'right', width: 160},
]

// 出库单
// 81-退料单改造：按需求图调整出库单弹窗明细列（新增仓库分区/批次号/生产日期/到期日期/库存单价，支出数量→出库数量、支出仓库→仓库）
export const tableJsonOrder = [
  {isShow: true, fixed: false, type: '', key: 'obCode', prop: 'obCode', label: '出库单号', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'depotName', prop: 'depotName', label: '仓库', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'partitionName', prop: 'partitionName', label: '仓库分区', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'matlCode', prop: 'matlCode', label: '物资编码', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'matlName', prop: 'matlName', label: '物资名称', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'matlType', prop: 'matlType', label: '规格型号/材质/图号', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'matlUnit', prop: 'matlUnit', label: '计量单位', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'batchNo', prop: 'batchNo', label: '批次号', align: 'center', width: 160},
  {isShow: true, fixed: false, type: 'date', key: 'productionDate', prop: 'productionDate', label: '生产日期', align: 'center', width: 160},
  {isShow: true, fixed: false, type: 'date', key: 'expirationDate', prop: 'expirationDate', label: '到期日期', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'price', prop: 'price', label: '库存单价（元）', align: 'right', width: 160},
  {isShow: true, fixed: false, type: '', key: 'outNum', prop: 'outNum', label: '出库数量', align: 'right', width: 160},
]
// 81-退料单改造：原出库单弹窗明细列配置保留备恢复
// export const tableJsonOrder = [
//   {isShow: true, fixed: false, type: '', key: 'obCode', prop: 'obCode', label: '出库单号', align: 'center', width: 160},
//   {isShow: true, fixed: false, type: '', key: 'matlCode', prop: 'matlCode', label: '物资编码', align: 'center', width: 160},
//   {isShow: true, fixed: false, type: '', key: 'matlName', prop: 'matlName', label: '物资名称', align: 'center', width: 160},
//   {isShow: true, fixed: false, type: '', key: 'matlType', prop: 'matlType', label: '规格型号/材质/图号', align: 'right', width: 160},
//   {isShow: true, fixed: false, type: '', key: 'matlUnit', prop: 'matlUnit', label: '计量单位', align: 'right', width: 160},
//   {isShow: true, fixed: false, type: '', key: 'outNum', prop: 'outNum', label: '支出数量', align: 'right', width: 160},
//   {isShow: true, fixed: false, type: '', key: 'depotName', prop: 'depotName', label: '支出仓库', align: 'right', width: 160},
// ]

// 退料人
export const userTableJson = [
  {isShow: true, fixed: false, type: '', key: 'userCode', prop: 'userCode', label: '用户编号', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'userName', prop: 'userName', label: '姓名', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'deptName', prop: 'deptName', label: '部门名称', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'phone', prop: 'phone', label: '联系方式', align: 'center', width: 160},
]