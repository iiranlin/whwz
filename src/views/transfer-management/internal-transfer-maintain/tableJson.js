import { rmstorInternalExitFlagArr } from '@/utils/dictionary'
import { selectPlantDict } from '@/api/warehouse/plantDict'
import { getwarehouseByUserAndPlant } from '@/api/warehouse/warehouseDict'
import { getWarehousePartition } from '@/api/warehouse/partition'
import { mtVerifyButtonStatus } from '@/api/warehouse/mt'
import { getCookie } from '@/utils/auth'

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
        field: "flag",
        title: "单据状态",
        minWidth: 160,
        type: "dict",
        searchable: true,
        searchType: "select",
        requestOptions: async () => rmstorInternalExitFlagArr,
        optionsCacheKey: "internal-transfer-maintain:flag",
      },
      {
        field: "billCode",
        title: "移库单号",
        minWidth: 180,
        align: "center",
        type: 'link',
        searchable: true,
        searchType: "input",
      },
      {
        field: "prePlantName",
        title: "移出地区",
        minWidth: 160,
      },
      {
        field: "prePlantCode",
        title: "移出地区",
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
        field: "preWhName",
        title: "移出仓库",
        minWidth: 160,
      },
      {
        field: "preWhCode",
        title: "移出仓库",
        minWidth: 160,
        hideInTable: true,
        searchable: true,
        searchType: 'select',
        searchProps: { options: [], clearable: true },
        dependsOn: ['prePlantCode'],
        async onDependencyChange({form, changedField, setFieldValue, setFieldProps}) {
          if (changedField !== 'prePlantCode') return
          setFieldValue('preWhCode', undefined)
          setFieldProps('preWhCode', { options: [] })
          if(!form.prePlantCode) return
          const plantCodeObj = plantArr.find(a => a.plantCode === form.prePlantCode)
          const res = await getwarehouseByUserAndPlant({plantId: plantCodeObj.id})
          whArr = res.data.map(r => {
            return {...r, label: r.whName, value: r.whCode}
          })
          setFieldProps('preWhCode', { options: whArr })
        },
      },
      {
        field: "prePartitionName",
        title: "移出仓库分区",
        minWidth: 140,
      },
      {
        field: "prePartitionCode",
        title: "移出仓库分区",
        minWidth: 160,
        hideInTable: true,
        searchable: true,
        searchType: 'select',
        searchProps: { options: [], clearable: true },
        dependsOn: ['prePlantCode','preWhCode'],
        async onDependencyChange({form, changedField, setFieldValue, setFieldProps}) {
          if (changedField !== 'preWhCode' && changedField !== 'prePlantCode') return
          setFieldValue('prePartitionCode', undefined)
          setFieldProps('prePartitionCode', { options: [] })
          if(!form.preWhCode) return
          const whCodeObj = whArr.find(a => a.whCode === form.preWhCode)
          const res = await getWarehousePartition({whId: whCodeObj.id})
          const options = res.data.map(r => {
            return {...r, label: r.partitionName, value: r.partitionCode}
          })
          setFieldProps('prePartitionCode', { options })
        },
      },
      {
        field: "ptPlantName",
        title: "移入地区",
        minWidth: 140,
      },
      {
        field: "ptWhName",
        title: "移入仓库",
        minWidth: 140,
      },
      {
        field: "ptPartitionName",
        title: "移入仓库分区",
        minWidth: 140,
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
      {
        field: "makeDate",
        title: "下单日期",
        minWidth: 140,
        type: 'date',
        searchable: true,
        searchType: "dateRange",
      },
      {
        field: "comments",
        title: "备注",
        minWidth: 160,
      }
    ]
  }
}

//按钮权限
const getbtnShow = async () =>{
  const { data } = await mtVerifyButtonStatus({unitCode: getCookie('unitCode')})
  return data.closeFlag
}


export const toolbarConfig = async () => {
  const isCloseFlag = await getbtnShow()
  return {
    buttons: [
      { code: 'create', name: '新增', type: 'primary',
        disabled: (selectedRows) => {
          if(isCloseFlag == '1'){
            return true
          }
          return false
        }
      },
      { code: 'modify', name: '编辑', showInTop: false, showInRow: true,
        disabled: (selectedRows) => {
          const { flag } = selectedRows[0] || {}
          if(!['0'].includes(flag) || isCloseFlag == '1'){
            return true
          }
          return false
        }
      },
      {code: 'delete', name: '删除', type: 'primary',
        disabled: (selectedRows) => {
          if(isCloseFlag == '1'){
            return true
          }
          return false
        }
      },
      {code: 'submit', name: '提交', type: 'primary',
        disabled: (selectedRows) => {
          if(isCloseFlag == '1'){
            return true
          }
          return false
        }
      },
      {code: 'print', name: '打印', type: 'primary'},
      {code: 'export', name: '导出', type: 'primary'},
    ]
  }
}

// 新增弹框明细字段
export const matlTableJson = [
  {isShow: true, fixed: false, type: '', key: 'matlCode', prop: 'matlCode', label: '物资编码', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'matlName', prop: 'matlName', label: '物资名称', align: 'center', width: 160},
  {isShow: true, fixed: false, type: 'slot', key: 'matlType', prop: 'matlType', label: '规格型号/材质/图号', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'matlUnit', prop: 'matlUnit', label: '计量单位', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'batchNo', prop: 'batchNo', label: '移出批次号', align: 'center', width: 160},
  {isShow: true, fixed: false, type: 'slot', key: 'tsNum', prop: 'tsNum', label: '移出数量', align: 'right', width: 160, required: true},
  {isShow: true, fixed: false, type: '', key: 'cardPrice', prop: 'cardPrice', label: '库存单价(元)', align: 'right', width: 200},
  {isShow: true, fixed: false, type: '', key: 'tsAmount', prop: 'tsAmount', label: '移出金额(元)', align: 'right', width: 160},
  {isShow: true, fixed: false, type: '', key: 'stockNum', prop: 'stockNum', label: '结存数量', align: 'right', width: 160},
  {isShow: true, fixed: false, type: '', key: 'noOutNum', prop: 'noOutNum', label: '未登卡数量', align: 'right', width: 160},
]

export const matlTableButtonJson = [
  {code: 'choiceMatl', name: '添加明细'},
  {code: 'delete', name: '删除', type: 'inline'},
]

// 打印字段
export const printMatlTableJson = [
  {isShow: true, fixed: false, type: '', key: 'matlCode', prop: 'matlCode', label: '物资编码', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'matlName', prop: 'matlName', label: '物资名称/规格型号', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'matlUnit', prop: 'matlUnit', label: '单位', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'tsNum', prop: 'tsNum', label: '移库数量', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'cardPrice', prop: 'cardPrice', label: '库存单价(元)', align: 'right', width: 200},
  {isShow: true, fixed: false, type: '', key: 'tsAmount', prop: 'tsAmount', label: '移库金额(元)', align: 'right', width: 160},
]

// 选择物资弹框字段
export const rmstorMatlTableJson = [
  {isShow: true, fixed: false, type: '', key: 'matlCode', prop: 'matlCode', label: '物资编码', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'matlName', prop: 'matlName', label: '物资名称', align: 'center', width: 160},
  {isShow: true, fixed: false, type: 'slot', key: 'matlType', prop: 'matlType', label: '规格型号/材质/图号', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'matlUnit', prop: 'matlUnit', label: '计量单位', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'batchNo', prop: 'batchNo', label: '批次号', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'nowNum', prop: 'nowNum', label: '结存数量', align: 'right', width: 160},
  {isShow: true, fixed: false, type: '', key: 'cardPrice', prop: 'cardPrice', label: '库存单价', align: 'right', width: 200},
  {isShow: true, fixed: false, type: '', key: 'depotName', prop: 'depotName', label: '移出仓库', align: 'center', width: 160},
]

// 选择物资弹框字段
export const rmstorMatlTableJsonFun = (partitionData) => {
  return [
    {
      field: "partitionCode",
      title: "移出仓库分区",
      minWidth: 160,
      hideInTable: true,
      searchable: true,
      searchType: 'select',
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
      slotName: 'matlTypeSlot'
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
      field: "nowNum",
      title: "结存数量",
      minWidth: 160,
      type: 'number',
    },
    {
      field: "cardPrice",
      title: "库存单价",
      minWidth: 160,
      type: 'number',
    },
    {
      field: "depotName",
      title: "移出仓库",
      minWidth: 160,
    }
  ]
}