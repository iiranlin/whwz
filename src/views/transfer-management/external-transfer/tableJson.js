import { saleFlagArr, permFlagArr } from '@/utils/dictionary'
import { selectPlantDict } from '@/api/warehouse/plantDict'
import { getwarehouseByUserAndPlant } from '@/api/warehouse/warehouseDict'
import { getWarehousePartition } from '@/api/warehouse/partition'

const plantData = async () => {
  const res = await selectPlantDict()
  return res.data.map(item => {
    return {...item, label: item.plantName, value: item.plantCode}
  })
}

export const columns = async () => {
  const plantArr = await plantData()
  let whArr = []
  return {
    plantArr,
    columnsArr: [
      {
        field: "saleFlag",
        title: "单据状态",
        minWidth: 160,
        type: "dict",
        searchable: true,
        searchType: "select",
        requestOptions: async () => saleFlagArr,
        optionsCacheKey: "external-transfer:saleFlag",
      },
      {
        field: "permFlag",
        title: "审批状态",
        minWidth: 160,
        type: "dict",
        requestOptions: async () => permFlagArr,
        optionsCacheKey: "external-transfer:permFlag",
      },
      {
        field: "outsaleCode",
        title: "调拨(销售)单号",
        minWidth: 180,
        align: "center",
        type: 'link',
        searchable: true,
        searchType: "input",
      },
      {
        field: "plantName",
        title: "调出地区",
        minWidth: 160,
      },
      {
        field: "plantCode",
        title: "调出地区",
        minWidth: 160,
        hideInTable: true,
        searchable: true,
        searchType: 'select',
        searchProps: {
          options: plantArr,
          clearable: true,
        },
      },
      {
        field: "depotCode",
        title: "调出仓库",
        minWidth: 160,
        hideInTable: true,
        searchable: true,
        searchType: 'select',
        searchProps: { options: [], clearable: true },
        dependsOn: ['plantCode'],
        async onDependencyChange({form, changedField, setFieldValue, setFieldProps}) {
          if (changedField !== 'plantCode') return
          setFieldValue('depotCode', undefined)
          setFieldProps('depotCode', { options: [] })
          if(!form.plantCode) return
          const plantCodeObj = plantArr.find(a => a.plantCode === form.plantCode)
          const res = await getwarehouseByUserAndPlant({plantId: plantCodeObj.id})
          whArr = res.data.map(r => {
            return {...r, label: r.whName, value: r.whCode}
          })
          setFieldProps('depotCode', { options: whArr })
        },
      },
      {
        field: "partitionCode",
        title: "调出仓库分区",
        minWidth: 160,
        hideInTable: true,
        searchable: true,
        searchType: 'select',
        searchProps: { options: [], clearable: true },
        dependsOn: ['plantCode','depotCode'],
        async onDependencyChange({form, changedField, setFieldValue, setFieldProps}) {
          if (changedField !== 'depotCode' && changedField !== 'plantCode') return
          setFieldValue('partitionCode', undefined)
          setFieldProps('partitionCode', { options: [] })
          if(!form.depotCode) return
          const whCodeObj = whArr.find(a => a.whCode === form.depotCode)
          const res = await getWarehousePartition({whId: whCodeObj.id})
          const options = res.data.map(r => {
            return {...r, label: r.partitionName, value: r.partitionCode}
          })
          setFieldProps('partitionCode', { options })
        },
      },
      {
        field: "depotName",
        title: "调出仓库",
        minWidth: 160,
      },
      {
        field: "partitionName",
        title: "调出仓库分区",
        minWidth: 140,
      },
      {
        field: "rluName",
        title: "收料单位",
        minWidth: 140,
        searchable: true,
        searchType: "input",
      },
      {
        field: "orderDate",
        title: "下单日期",
        minWidth: 140,
        type: 'date',
        searchable: true,
        searchType: "dateRange",
      },
      {
        field: "outsaleTotalAmount",
        title: "调拨金额",
        minWidth: 140,
        type: 'number',
      },
      {
        field: "comments",
        title: "备注",
        minWidth: 160,
      },
      {
        field: "matlCode",
        title: "物资编码",
        minWidth: 160,
        hideInTable: true,
        searchable: true,
        searchType: "input",
      },
      {
        field: "matlName",
        title: "物资名称",
        minWidth: 160,
        hideInTable: true,
        searchable: true,
        searchType: "input",
      },
      {
        field: "matlType",
        title: "规格型号",
        minWidth: 160,
        hideInTable: true,
        searchable: true,
        searchType: "input",
      },
    ]
  }
}

export const toolbarConfig = {
    buttons: [
      {code: 'create', name: '新增', type: 'primary'},
      {code: 'modify', name: '修改', showInTop: false, showInRow: true,
        disabled: (selectedRows) => {
          const { permFlag } = selectedRows[0] || {}
          if(!['0'].includes(permFlag)){
            return true
          }
          return false
        }
      },
      // 无工作流：隐藏"审核历史"入口（$flow 流程轨迹），将来接入工作流放开
      // {code: 'history', name: '审核历史', showInTop: false, showInRow: true},
      {code: 'delete', name: '删除', type: 'primary'},
      {code: 'submit', name: '报批', type: 'primary'},
      {code: 'denka', name: '登卡', type: 'primary'},
      {code: 'revokeDenka', name: '撤销登卡', type: 'primary'},
      {code: 'print', name: '打印', type: 'primary'},
      {code: 'export', name: '导出', type: 'primary'},
    ]
  }

// 新增弹框明细字段
export const matlTableJson = [
  {isShow: true, fixed: false, type: '', key: 'matlCode', prop: 'matlCode', label: '物资编码', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'matlName', prop: 'matlName', label: '物资名称', align: 'center', width: 160},
  {isShow: true, fixed: false, type: 'slot', key: 'matlType', prop: 'matlType', label: '规格型号/材质/图号', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'matlUnit', prop: 'matlUnit', label: '计量单位', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'batchNo', prop: 'batchNo', label: '批次号', align: 'center', width: 160},
  {isShow: true, fixed: false, type: 'slot', key: 'outsaleNum', prop: 'outsaleNum', label: '调拨数量', align: 'right', width: 160, required: true},
  {isShow: true, fixed: false, type: '', key: 'cardPrice', prop: 'cardPrice', label: '库存单价(元)', align: 'right', width: 200},
  {isShow: true, fixed: false, type: 'slot', key: 'outsalePrice', prop: 'outsalePrice', label: '调拨单价(元)', align: 'right', width: 160, required: true},
  {isShow: true, fixed: false, type: '', key: 'outsaleAmount', prop: 'outsaleAmount', label: '调拨金额(元)', align: 'right', width: 160},
  {isShow: true, fixed: false, type: '', key: 'cardNum', prop: 'cardNum', label: '结存数量', align: 'right', width: 160},
]

export const matlTableButtonJson = [
  {code: 'choiceMatl', name: '添加明细'},
  {code: 'delete', name: '删除', type: 'inline'},
]

// 打印字段
export const printMatlTableJson = [
  {isShow: true, fixed: false, type: '', key: 'matlCode', prop: 'matlCode', label: '物资编码', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'matlName', prop: 'matlName', label: '物资名称/规格型号', align: 'left', width: 160},
  {isShow: true, fixed: false, type: '', key: 'matlUnit', prop: 'matlUnit', label: '单位', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'outsalePrice', prop: 'outsalePrice', label: '单价', align: 'right', width: 160},
  {isShow: true, fixed: false, type: '', key: 'cardPrice', prop: 'cardPrice', label: '库存单价', align: 'right', width: 200},
  {isShow: true, fixed: false, type: '', key: 'outsaleNum', prop: 'outsaleNum', label: '调拨数量', align: 'right', width: 160},
  {isShow: true, fixed: false, type: '', key: 'outsaleAmount', prop: 'outsaleAmount', label: '调拨金额', align: 'right', width: 160},
]

// 选择收料单位弹框字段
export const rluTableJson = [
  {isShow: true, fixed: false, type: '', key: 'unitCode', prop: 'unitCode', label: '单位编号', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'unitName', prop: 'unitName', label: '单位名称', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'type', prop: 'type', label: '单位类型', align: 'center', width: 160},
]

// 选择调剂申请单弹框字段
export const adjustTableJson = [
  {isShow: true, fixed: false, type: '', key: 'billCode', prop: 'billCode', label: '调剂单号', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'matlCode', prop: 'matlCode', label: '收科路局', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'matlCode', prop: 'matlCode', label: '收科单位编号', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'matlCode', prop: 'matlCode', label: '收科单位名称', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'matlCode', prop: 'matlCode', label: '物资编码', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'matlName', prop: 'matlName', label: '物资名称', align: 'center', width: 160},
  {isShow: true, fixed: false, type: 'slot', key: 'matlType', prop: 'matlType', label: '规格型号/材质/图号', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'matlUnit', prop: 'matlUnit', label: '计量单位', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'nowNum', prop: 'nowNum', label: '库存数量', align: 'right', width: 160},
]

// 选择审批人弹框字段
export const userTableJson = [
  {isShow: true, fixed: false, type: '', key: 'userCode', prop: 'userCode', label: '用户编号', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'userName', prop: 'userName', label: '姓名', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'deptName', prop: 'deptName', label: '部门名称', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'phone', prop: 'phone', label: '联系方式', align: 'center', width: 160},
]


// 选择物资弹框字段
export const rmstorMatlTableJson = [
  {isShow: true, fixed: false, type: '', key: 'matlCode', prop: 'matlCode', label: '物资编码', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'matlName', prop: 'matlName', label: '物资名称', align: 'center', width: 160},
  {isShow: true, fixed: false, type: 'slot', key: 'matlType', prop: 'matlType', label: '规格型号/材质/图号', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'matlUnit', prop: 'matlUnit', label: '计量单位', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'nowNum', prop: 'nowNum', label: '结存数量', align: 'right', width: 160},
  {isShow: true, fixed: false, type: '', key: 'cardPrice', prop: 'cardPrice', label: '库存单价', align: 'right', width: 200},
  {isShow: true, fixed: false, type: '', key: 'depotName', prop: 'depotName', label: '调出仓库', align: 'center', width: 160},
]
// 新增弹框明细字段
export const matlTableJsonFun = (type) => {
  return [
    {
      field: "matlCode",
      title: "物资编码",
      minWidth: 160,
      align: "center",
    },
    {
      field: "matlName",
      title: "物资名称",
      minWidth: 160,
    },
    {
      field: "matlTypeSlot",
      title: "规格型号/材质/图号",
      minWidth: 160,
      slotName: "matlTypeSlot",
    },
    {
      field: "matlUnit",
      title: "计量单位",
      minWidth: 160,
      align: "center",
    },
    {
      field: "batchNo",
      title: "批次号",
      minWidth: 160,
      align: "center",
    },
    {
      field: "outsaleNum",
      title: "调拨数量",
      minWidth: 160,
      type: "number",
      slotName: "outsaleNum",
      showRequiredMark: type != "details",
    },
    {
      field: "cardPrice",
      title: "库存单价(元)",
      minWidth: 160,
      type: "number",
    },
    {
      field: "outsalePrice",
      title: "调拨单价(元)",
      minWidth: 160,
      type: "number",
      slotName: "outsalePrice",
      showRequiredMark: type != "details",
    },
    {
      field: "outsaleAmount",
      title: "调拨金额(元)",
      minWidth: 160,
      type: "number",
    },
    {
      field: "cardNum",
      title: "结存数量",
      minWidth: 160,
      type: "number",
    },
  ];
};

export const adjustTableButtonJson = {
  buttons: [
    {
      code: "searchValue",
      name: "请选择调剂单",
      slotName: "searchValue",
    },
  ],
};
// 选择物资弹框字段
export const rmstorMatlTableJsonFun = (partitionData) => {
  return [
    {
      field: "partitionCode",
      title: "调出仓库分区",
      minWidth: 160,
      hideInTable: true,
      searchable: true,
      searchType: "select",
      searchProps: { options: partitionData, clearable: false, disabled: true },
    },
    {
      field: "matlCode",
      title: "物资编码",
      minWidth: 160,
      align: "center",
      searchable: true,
      searchType: "input",
    },
    {
      field: "matlName",
      title: "物资名称",
      minWidth: 160,
      searchable: true,
      searchType: "input",
    },
    {
      field: "matlTypeSlot",
      title: "规格型号/材质/图号",
      minWidth: 160,
      slotName: "matlTypeSlot",
    },
    {
      field: "matlUnit",
      title: "计量单位",
      minWidth: 160,
      align: "center",
    },
    {
      field: "nowNum",
      title: "结存数量",
      minWidth: 160,
      type: "number",
    },
    {
      field: "cardPrice",
      title: "库存单价",
      minWidth: 160,
      type: "number",
    },
    {
      field: "depotName",
      title: "调出仓库",
      minWidth: 160,
    },
  ];
};