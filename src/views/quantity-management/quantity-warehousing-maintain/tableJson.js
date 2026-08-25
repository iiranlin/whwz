import { ibmtFlagArr } from '@/utils/dictionary'
import { selectPlantDict } from '@/api/warehouse/plantDict'
import { getwarehouseByUserAndPlant } from '@/api/warehouse/warehouseDict'
import { getWarehousePartition } from '@/api/warehouse/partition'
import { mtVerifyButtonStatus } from '@/api/warehouse/mt'
import { getCookie } from '@/utils/auth'

const plantData = async () => {
  const res = await selectPlantDict({stockAttrs: '15'})
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
        title: "状态",
        minWidth: 100,
        type: "dict",
        searchable: true,
        searchType: "select",
        requestOptions: async () => ibmtFlagArr,
        optionsCacheKey: "quantity-warehousing-maintain:flag",
      },
      {
        field: "ibBillCode",
        title: "入库单号",
        minWidth: 220,
        align: "center",
        type: 'link',
        searchable: true,
        searchType: "input",
      },
      {
        field: "supUnitName",
        title: "供货单位",
        minWidth: 160,
        searchable: true,
        searchType: "input",
      },
      {
        field: "plantName",
        title: "用料地区",
        minWidth: 160,
      },
      {
        field: "plantCode",
        title: "用料地区",
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
        field: "depotName",
        title: "仓库",
        minWidth: 160,
      },
      {
        field: "depotCode",
        title: "仓库",
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
          const res = await getwarehouseByUserAndPlant({plantId: plantCodeObj.id, stockAttrs: '15'})
          whArr = res.data.map(r => {
            return {...r, label: r.whName, value: r.whCode}
          })
          setFieldProps('depotCode', { options: whArr })
        },
      },
      {
        field: "partitionName",
        title: "仓库分区",
        minWidth: 140,
      },
      {
        field: "partitionCode",
        title: "仓库分区",
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
          const res = await getWarehousePartition({whId: whCodeObj.id, stockAttrs: '15'})
          const options = res.data.map(r => {
            return {...r, label: r.partitionName, value: r.partitionCode}
          })
          setFieldProps('partitionCode', { options })
        },
      },
      {
        field: "bmName",
        title: "制单人",
        minWidth: 140,
      },
      {
        field: "orderDate",
        title: "制单日期",
        minWidth: 140,
        type: 'date',
      },
      {
        field: "noteDate",
        title: "登卡日期",
        minWidth: 140,
        type: 'date',
      },
      {
        field: "comments",
        title: "备注",
        minWidth: 200,
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
      }
    ]
  }
}

//按钮权限
const getbtnShow = async () =>{
  const { data } = await mtVerifyButtonStatus({unitCode: getCookie('unitCode')})
  return data
}

export const toolbarConfig = async () => {
  const {closeFlag, stopnoteFlag} = await getbtnShow()
  return {
    buttons: [
      { code: 'create', name: '新增', type: 'primary',
         disabled: () => {
          if(closeFlag == '1'){
            return true
          }
          return false
        }
      },
      { code: 'modify', name: '修改', showInTop: false, showInRow: true,
        disabled: (selectedRows) => {
          const {flag} = selectedRows[0] || {}
          if(closeFlag == '1' || !['0'].includes(flag)){
            return true
          }
          return false
        }
      },
      { code: 'delete', name: '删除', type: 'primary',
         disabled: () => {
          if(closeFlag == '1'){
            return true
          }
          return false
        }
      },
      { code: 'denka', name: '登卡', type: 'primary',
         disabled: () => {
          if(closeFlag.value == '1' || stopnoteFlag.value == '1'){
            return true
          }
          return false
        }
      },
      { code: 'revokeDenka', name: '撤销登卡', type: 'primary',
         disabled: () => {
          if(closeFlag.value == '1' || stopnoteFlag.value == '1'){
            return true
          }
          return false
        }
      },
      { code: 'print', name: '打印', showInTop: false, showInRow: true },
      { code: 'export', name: '导出', type: 'primary' },
    ]
  }
}

// 新增弹框明细字段
export const matlTableJson = [
  {isShow: true, fixed: false, type: '', key: 'matlCode', prop: 'matlCode', label: '物资编码', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'matlName', prop: 'matlName', label: '物资名称', align: 'center', width: 160},
  {isShow: true, fixed: false, type: 'slot', key: 'matlType', prop: 'matlType', label: '规格型号/材质/图号', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'matlUnit', prop: 'matlUnit', label: '计量单位', align: 'center', width: 160},
  {isShow: true, fixed: false, type: 'slot', key: 'credCode', prop: 'credCode', label: '技证号', align: 'center', width: 160},
  {isShow: true, fixed: false, type: 'slot', key: 'num', prop: 'num', label: '入库数量', align: 'right', width: 160, required: true},
  {isShow: true, fixed: false, type: 'slot', key: 'cardPrice', prop: 'cardPrice', label: '单价', align: 'right', width: 200, required: true},
]

export const matlTableButtonJson = [
  {code: 'choiceMatl', name: '选择物资'},
  {code: 'delete', name: '删除', type: 'inline'},
]

// 打印字段
export const printMatlTableJson = [
  {isShow: true, fixed: false, type: '', key: 'matlCode', prop: 'matlCode', label: '物资编码', align: 'center', width: 10},
  {isShow: true, fixed: false, type: '', key: 'matlName', prop: 'matlName', label: '物资名称/规格型号', align: 'center', width: 15},
  {isShow: true, fixed: false, type: '', key: 'matlUnit', prop: 'matlUnit', label: '单位', align: 'center', width: 6},
  {isShow: true, fixed: false, type: '', key: 'num', prop: 'num', label: '数量', align: 'center', width: 6},
  {isShow: true, fixed: false, type: '', key: 'cardPrice', prop: 'cardPrice', label: '采购单价', align: 'right', width: 10},
  {isShow: true, fixed: false, type: '', key: 'ibAmount', prop: 'ibAmount', label: '采购金额', align: 'right', width: 10},
  {isShow: true, fixed: false, type: '', key: 'cardPrice', prop: 'cardPrice', label: '库存单价', align: 'right', width: 10},
  {isShow: true, fixed: false, type: '', key: 'ibAmount', prop: 'ibAmount', label: '入库金额', align: 'right', width: 10},
]

// 选择物资弹框字段
export const rmstorMatlTableJson = [
  {isShow: true, fixed: false, type: '', key: 'matlCode', prop: 'matlCode', label: '物资编码', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'matlName', prop: 'matlName', label: '物资名称', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'matlType', prop: 'matlType', label: '规格型号', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'matlRaw', prop: 'matlRaw', label: '材质', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'matlpCode', prop: 'matlpCode', label: '图号', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'matlUnit', prop: 'matlUnit', label: '计量单位', align: 'center', width: 160},
]
