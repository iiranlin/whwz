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

export const tableJson = [
  {searchType: '', field: 'yearMonth', title: '财务年月', align: 'center'},
  {searchType: 'link', field: 'returnCode',  title: '退料单号', align: 'center',slotName:'code-cell'},
  {searchType: 'select', field: 'flag', title: '登卡状态', align: 'center',searchProps:{
    options:[
    {value: 0, label: "未登卡"},
    {value: 1, label: "已登卡"},
    ]
  }},
  {searchType: '', field: 'deptName', title: '领料部门', align: 'center',},
  {searchType: '', field: 'plantName', title: '用料地区', align: 'center',},
  {searchType: '', field: 'depotName', title: '仓库', align: 'center',},
  {searchType: '', field: 'partitionName', title: '仓库分区', align: 'center',},
  {searchType: '', field: 'amount', title: '单据总金额', align: 'center',},
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
    if (!form.plantCode) {
      setFieldProps('depotCode',{options:[]})
      setFieldValue('depotCode','')
      return
    }
    const {data} = await warehouseDict(form.plantCode)
    const depotOptions = data.map(item => ({
      label:item.whName,
      value:item.whCode
    }))
    setFieldProps('depotCode',{options:depotOptions})
    setFieldValue('depotCode','')
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
    if (!form.plantCode) {
      setFieldProps('partitionCode',{options:[]})
      setFieldValue('partitionCode','')
      return
    }
    const {data} = await warehouseplantDictList(form.depotCode)
    const depotOptions = data.map(item => ({
      label:item.partitionName,
      value:item.partitionCode
    }))
    setFieldProps('partitionCode',{options:depotOptions})
    setFieldValue('partitionCode','')
  }},
  {field: 'deptName', title: '领料部门', searchType: 'input',searchable: true,hideInTable:true},
  {field: 'matlCode', title: '物资编码', searchType: 'input',searchable: true,hideInTable:true},
  {field: 'matlName', title: '物资名称', searchType: 'input',searchable: true,hideInTable:true},
  {field: 'matlType', title: '规格型号', searchType: 'input',searchable: true,hideInTable:true},
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
export const tableJsonOrder = [
  {isShow: true, fixed: false, type: '', key: 'obCode', prop: 'obCode', label: '出库单号', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'matlCode', prop: 'matlCode', label: '物资编码', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'matlName', prop: 'matlName', label: '物资名称', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'matlType', prop: 'matlType', label: '规格型号/材质/图号', align: 'right', width: 160},
  {isShow: true, fixed: false, type: '', key: 'matlUnit', prop: 'matlUnit', label: '计量单位', align: 'right', width: 160},
  {isShow: true, fixed: false, type: '', key: 'outNum', prop: 'outNum', label: '支出数量', align: 'right', width: 160},
  {isShow: true, fixed: false, type: '', key: 'depotName', prop: 'depotName', label: '支出仓库', align: 'right', width: 160},
]

// 退料人
export const userTableJson = [
  {isShow: true, fixed: false, type: '', key: 'userCode', prop: 'userCode', label: '用户编号', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'userName', prop: 'userName', label: '姓名', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'deptName', prop: 'deptName', label: '部门名称', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'phone', prop: 'phone', label: '联系方式', align: 'center', width: 160},
]