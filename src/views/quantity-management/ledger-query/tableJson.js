
import { selectPlantDict } from '@/api/warehouse/plantDict'
import { getwarehouseByUserAndPlant } from '@/api/warehouse/warehouseDict'
import { getWarehousePartition } from '@/api/warehouse/partition'

const plantData = async () => {
  const res = await selectPlantDict({stockAttrs: '15'})
  return res.data.map(item => {
    return {...item, label: item.plantName, value: item.plantCode}
  })
}

export const columns = async () => {
  const plantArr = await plantData()
  let whArr = []
  return [
    {
      field: "yearMonth",
      title: "年月",
      minWidth: 160,
      hideInTable: true,
      searchable: true,
      searchType: 'dateRange',
      searchProps: { clearable: false, type: 'monthrange', valueFormat: 'YYYYMM' },
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
      minWidth: 140,
      align: "center",
    },
    {
      field: "initialNum",
      title: "期初数量",
      minWidth: 140,
      type: 'number'
    },
    {
      field: "nowInNum",
      title: "收入数量合计",
      minWidth: 140,
      type: 'number'
    },
    {
      field: "nowOutNum",
      title: "支出数量合计",
      minWidth: 140,
      type: 'number'
    },
    {
      field: "nowNum",
      title: "结存数量",
      minWidth: 140,
      type: 'number'
    },
    {
      field: "lastInDate",
      title: "最后入库日期",
      minWidth: 140,
      type: 'date',
    },
    {
      field: "lastOutDate",
      title: "最后出库日期",
      minWidth: 140,
      type: 'date',
    },
    {
      field: "isNotZeroArr",
      title: "库存",
      minWidth: 160,
      hideInTable: true,
      searchable: true,
      searchType: 'checkbox',
      searchProps: {
        options: [
          { label: '库存不为0', value: '1' },
        ],
      },
    }
  ]
}

export const toolbarConfig = {
  buttons: [
    { code: 'details', name: '详情', showInTop: false, showInRow: true },
    { code: 'export', name: '导出', type: 'primary' },
  ]
}

// 详情
export const matlTableJson = [
  {isShow: true, fixed: false, type: 'date', key: 'noteDate', prop: 'noteDate', label: '登卡日期', align: 'center', width: 160},
  {isShow: true, fixed: false, type: 'dict', key: 'billTypeCode', prop: 'billTypeCode', label: '单据类型', align: 'center', width: 160, stats: {'1': '入库', '2': '出库'}},
  {isShow: true, fixed: false, type: '', key: 'billCode', prop: 'billCode', label: '单据号', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'bmName', prop: 'bmName', label: '制单人', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'nowInNum', prop: 'nowInNum', label: '入库数量', align: 'right', width: 160},
  {isShow: true, fixed: false, type: '', key: 'nowOutNum', prop: 'nowOutNum', label: '出库数量', align: 'right', width: 160},
  {isShow: true, fixed: false, type: '', key: 'comments', prop: 'comments', label: '备注', align: 'left', width: 200},
]

export const matlTableButtonJson = [
  {code: 'export', name: '导出'},
]