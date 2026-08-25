import { rmstorInternalEnterFlagArr } from '@/utils/dictionary'
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
        requestOptions: async () => rmstorInternalEnterFlagArr,
        optionsCacheKey: "internal-transferEnter-maintain:flag",
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
        field: "preWhName",
        title: "移出仓库",
        minWidth: 160,
      },
      {
        field: "prePartitionName",
        title: "移出仓库分区",
        minWidth: 140,
      },
      {
        field: "ptPlantName",
        title: "移入地区",
        minWidth: 140,
      },
      {
        field: "ptPlantCode",
        title: "移入地区",
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
        field: "ptWhName",
        title: "移入仓库",
        minWidth: 140,
      },
      {
        field: "ptWhCode",
        title: "移入仓库",
        minWidth: 160,
        hideInTable: true,
        searchable: true,
        searchType: 'select',
        searchProps: { options: [], clearable: true },
        dependsOn: ['ptPlantCode'],
        async onDependencyChange({form, changedField, setFieldValue, setFieldProps}) {
          if (changedField !== 'ptPlantCode') return
          setFieldValue('ptWhCode', undefined)
          setFieldProps('ptWhCode', { options: [] })
          if(!form.ptPlantCode) return
          const plantCodeObj = plantArr.find(a => a.plantCode === form.ptPlantCode)
          const res = await getwarehouseByUserAndPlant({plantId: plantCodeObj.id})
          whArr = res.data.map(r => {
            return {...r, label: r.whName, value: r.whCode}
          })
          setFieldProps('ptWhCode', { options: whArr })
        },
      },
      {
        field: "ptPartitionName",
        title: "移入仓库分区",
        minWidth: 140,
      },
      {
        field: "ptPartitionCode",
        title: "移入仓库分区",
        minWidth: 160,
        hideInTable: true,
        searchable: true,
        searchType: 'select',
        searchProps: { options: [], clearable: true },
        dependsOn: ['ptPlantCode','ptWhCode'],
        async onDependencyChange({form, changedField, setFieldValue, setFieldProps}) {
          if (changedField !== 'ptWhCode' && changedField !== 'ptPlantCode') return
          setFieldValue('ptPartitionCode', undefined)
          setFieldProps('ptPartitionCode', { options: [] })
          if(!form.ptWhCode) return
          const whCodeObj = whArr.find(a => a.whCode === form.ptWhCode)
          const res = await getWarehousePartition({whId: whCodeObj.id})
          const options = res.data.map(r => {
            return {...r, label: r.partitionName, value: r.partitionCode}
          })
          setFieldProps('ptPartitionCode', { options })
        },
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
  return data
}

export const toolbarConfig = async () => {
  const {closeFlag, stopnoteFlag} = await getbtnShow()
  return {
    buttons: [
      { code: 'denka', name: '登卡', type: 'primary',
        disabled: (selectedRows) => {
          if(closeFlag.value == '1' || stopnoteFlag.value == '1'){
            return true
          }
          return false
        }
      },
      { code: 'revokeDenka', name: '撤销登卡', type: 'primary',
        disabled: (selectedRows) => {
          if(closeFlag.value == '1' || stopnoteFlag.value == '1'){
            return true
          }
          return false
        }
      },
      { code: 'rollback', name: '回退', type: 'primary',
        disabled: (selectedRows) => {
          if(closeFlag.value == '1' || stopnoteFlag.value == '1'){
            return true
          }
          return false
        }
      },
      { code: 'print', name: '打印', type: 'primary'},
      { code: 'export', name: '导出', type: 'primary'},
    ]
  }
}

export const matlTableJson = [
  {isShow: true, fixed: false, type: '', key: 'matlCode', prop: 'matlCode', label: '物资编码', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'matlName', prop: 'matlName', label: '物资名称', align: 'center', width: 160},
  {isShow: true, fixed: false, type: 'slot', key: 'matlType', prop: 'matlType', label: '规格型号/材质/图号', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'matlUnit', prop: 'matlUnit', label: '计量单位', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'batchNo', prop: 'batchNo', label: '移入批次号', align: 'center', width: 160},
  {isShow: true, fixed: false, type: 'slot', key: 'tsNum', prop: 'tsNum', label: '移入数量', align: 'right', width: 160, required: true},
  {isShow: true, fixed: false, type: '', key: 'cardPrice', prop: 'cardPrice', label: '库存单价(元)', align: 'right', width: 200},
  {isShow: true, fixed: false, type: '', key: 'tsAmount', prop: 'tsAmount', label: '移入金额(元)', align: 'right', width: 160},
]