import { dateTypeArr, inboundHasArr, ibSourceArr } from '@/utils/dictionary'
import { selectPlantDict } from '@/api/warehouse/plantDict'
import { getwarehouseByUserAndPlant } from '@/api/warehouse/warehouseDict'
import { getWarehousePartition } from '@/api/warehouse/partition'
import { useDictDataQuery } from "@/utils/Dict"

const plantData = async () => {
  try {
    const res = await selectPlantDict()
    return (res.data || []).map(item => {
      return {...item, label: item.plantName, value: item.plantCode}
    })
  } catch (e) {
    console.warn('selectPlantDict 接口调用失败:', e)
    return []
  }
}

export const columns = async () => {
  const plantArr = await plantData()
  let whArr = []
  return [
    {
      field: "orderDate",
      title: "日期",
      minWidth: 160,
      hideInTable: true,
      searchable: true,
      searchType: 'dateRange',
      searchProps: { clearable: false },
      searchPrefix: {
        field: 'dateType',
        searchType: 'select',
        dict: dateTypeArr,
        searchProps: { clearable: false },
      },
      searchSort: 0
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
      searchSort: 1
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
        if(!plantCodeObj) return
        try {
          const res = await getwarehouseByUserAndPlant({plantId: plantCodeObj.id})
          whArr = (res.data || []).map(r => {
            return {...r, label: r.whName, value: r.whCode}
          })
          setFieldProps('depotCode', { options: whArr })
        } catch (e) {
          console.warn('getwarehouseByUserAndPlant 接口调用失败:', e)
        }
      },
      searchSort: 2
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
        if(!whCodeObj) return
        try {
          const res = await getWarehousePartition({whId: whCodeObj.id})
          const options = (res.data || []).map(r => {
            return {...r, label: r.partitionName, value: r.partitionCode}
          })
          setFieldProps('partitionCode', { options })
        } catch (e) {
          console.warn('getWarehousePartition 接口调用失败:', e)
        }
      },
      searchSort: 3
    },
    {
      field: "stockAttr",
      title: "存货属性",
      minWidth: 160,
      type: "dict",
      searchable: true,
      searchType: "select",
      requestOptions: async () => {
        try {
          const { dictList } = await useDictDataQuery('stock_attr')
          return dictList || []
        } catch (e) {
          console.warn('useDictDataQuery(stock_attr) 调用失败:', e)
          return []
        }
      },
      optionsCacheKey: 'inbound-query:v5:stockAttr',
      searchSort: 22,
    },
    {
      field: "supUnitName",
      title: "自制项目/供货单位",
      minWidth: 160,
    },
    {
      field: "supplierName",
      title: "供应商",
      minWidth: 160,
      searchable: true,
      searchType: 'input',
      searchSort: 23,
    },
    {
      field: "ibSource",
      title: "来源",
      minWidth: 160,
      type: 'dict',
      dict: ibSourceArr,
      searchable: true,
      searchType: "select",
      searchSort: 16
    },
    {
      field: "buyTypeName",
      title: "采购方式",
      minWidth: 160,
    },
    {
      field: "refBillCode",
      title: "供货单号/采购订单号",
      minWidth: 160,
      hideInTable: true,
      searchable: true,
      searchType: 'input',
      searchSort: 17
    },
    // {
    //   field: "refBillCode",
    //   title: "供货单号/采购订单号",
    //   minWidth: 160,
    //   align: 'center',
    // },
    {
      field: "invoiceCode",
      title: "发票号",
      minWidth: 160,
      searchable: true,
      searchType: "input",
      searchSort: 15
    },
    {
      field: "bmName",
      title: "下单人",
      minWidth: 160,
      searchable: true,
      searchType: "input",
      // searchType: 'tableSelect',
      // searchProps: {
      //   popupType: 'custom',
      //   clearable: true,
      //   placeholder: '请选择下单人'
      // },
      searchSort: 4
    },
    {
      field: "orderDate",
      title: "下单日期",
      minWidth: 160,
      type: 'date'
    },
    {
      field: "orderStDate",
      title: "单据录入日期",
      minWidth: 160,
      type: 'date'
    },
    {
      field: "makerName",
      title: "登卡人",
      minWidth: 160,
      searchable: true,
      searchType: "input",
      // searchType: 'tableSelect',
      // searchProps: {
      //   popupType: 'custom',
      //   clearable: true,
      //   placeholder: '请选择登卡人'
      // },
      searchSort: 9
    },
    {
      field: "noteDate",
      title: "登卡日期",
      minWidth: 160,
      type: 'date'
    },
    // {
    //   field: "credCode",
    //   title: "审核人",
    //   minWidth: 160,
    // },
    // {
    //   field: "price",
    //   title: "核对人",
    //   minWidth: 160,
    // },
    // {
    //   field: "outNum",
    //   title: "核对日期",
    //   minWidth: 140,
    //   type: 'date',
    //   // searchable: true,
    //   // searchType: 'dateRange',
    //   // searchSort: 19,
    // },
    {
      field: "incotaxAmount",
      title: "税额",
      minWidth: 140,
      type: 'number',
    },
    {
      field: "taxMatlAmount",
      title: "含税料款",
      minWidth: 140,
      type: 'number',
    },
    {
      field: "ibBillCode",
      title: "入库单号",
      minWidth: 180,
      align: 'center',
      type: 'link',
      searchable: true,
      searchType: "input",
      searchSort: 5
    },
    {
      field: "matlCode",
      title: "物资编码",
      minWidth: 160,
      align: "center",
      searchable: true,
      searchType: "input",
      searchSort: 6
    },
    {
      field: "matlName",
      title: "物资名称",
      minWidth: 160,
      searchable: true,
      searchType: "input",
      searchSort: 7
    },
    {
      field: "matlType",
      title: "规格型号",
      minWidth: 160,
      hideInTable: true,
      searchable: true,
      searchType: "input",
      searchSort: 8
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
      field: "paNum",
      title: "入库数量",
      minWidth: 140,
      type: 'number',
    },
    {
      field: "stkPrice",
      title: "采购单价",
      minWidth: 140,
      type: 'number',
      searchable: true,
      searchType: 'number',
      searchProps: { controlsPosition: 'right', precision: 2 },
      searchSort: 10
    },
    {
      field: "stkAmount",
      title: "采购金额",
      minWidth: 140,
      type: 'number',
      searchable: true,
      searchType: 'number',
      searchProps: { controlsPosition: 'right', precision: 2 },
      searchSort: 11
    },
    {
      field: "flag",
      title: "单据状态",
      minWidth: 140,
      type: 'dict',
      dict: [{label: '未登卡', value: '0,1'}, {label: '已登卡', value: '2'}],
      hideInTable: true,
      searchable: true,
      searchType: 'select',
      searchSort: 12
    },
    // {
    //   field: "totalOutNum",
    //   title: "核对状态",
    //   minWidth: 140,
    //   type: 'dict',
    //   dict: [],
    //   hideInTable: true,
    //   searchable: true,
    //   searchType: 'select',
    //   searchSort: 13
    // },
    // {
    //   field: 'financeDate',
    //   title: '财务日期',
    //   hideInTable: true,
    //   searchable: true,
    //   searchType: 'dateRange',
    //   searchSort: 14,
    // },
    {
      field: "cardPrice",
      title: "库存单价",
      minWidth: 140,
      type: 'number',
    },
    {
      field: "standardAmount",
      title: "入库金额",
      minWidth: 140,
      type: 'number',
    },
    // {
    //   field: "totalOutNum",
    //   title: "料差",
    //   minWidth: 140,
    //   type: 'number',
    // },
    {
      field: "freightAmount",
      title: "运费",
      minWidth: 140,
      type: 'number',
    },
    {
      field: "extrasAmount",
      title: "杂费",
      minWidth: 140,
      type: 'number',
    },
    {
      field: "credCode",
      title: "技证号",
      minWidth: 140,
      align: "center",
    },
    // {
    //   field: "totalOutNum",
    //   title: "附属计量单位",
    //   minWidth: 140,
    //   align: "center",
    // },
    // {
    //   field: "totalOutNum",
    //   title: "附属入库数量",
    //   minWidth: 140,
    //   type: 'number',
    // },
    // {
    //   field: "totalOutNum",
    //   title: "采购种类",
    //   minWidth: 140,
    //   type: 'dict',
    //   dict: [],
    //   searchable: true,
    //   searchType: 'select',
    //   searchSort: 18,
    // },
    {
      field: "comments",
      title: "备注",
      minWidth: 160,
    },
    {
      field: "groupByField",
      title: "分组汇总",
      minWidth: 140,
      hideInTable: true,
      searchable: true,
      searchFullRow: true,
      searchType: 'checkbox',
      searchProps: {
        options: inboundHasArr,
        // 自制项目/供货单位 用料地区 仓库 入库单号 物资编号 
      }
    }
  ]
}

export const toolbarConfig = {
  buttons: [
    { code: 'export', name: '导出', type: 'primary' },
  ]
}