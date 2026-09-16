import { dateTypeArr, ibSourceArr } from '@/utils/dictionary'
import { selectPlantDict } from '@/api/warehouse/plantDict'
import { getwarehouseByUserAndPlant } from '@/api/warehouse/warehouseDict'
import { getWarehousePartition } from '@/api/warehouse/partition'
import { useDictData } from "@/utils/Dict"
import { equipPartListAll, equipPartList } from '@/api/rmstor/outbound-maintenance'
const plantData = async () => {
  try {
    const res = await selectPlantDict()
    return (res.data || []).map(item => {
      return { ...item, label: item.plantName, value: item.plantCode }
    })
  } catch (e) {
    console.warn('selectPlantDict 接口调用失败:', e)
    return []
  }
}
const warehouseList = async () => {
  try {
    const { data } = await equipPartListAll()
    return (data || []).map(item => {
      return { ...item, label: item.equipName, value: item.equipCode }
    })
  } catch (e) {
    console.warn('equipPartListAll 接口调用失败:', e)
    return []
  }
}



export const columns = async () => {
  const plantArr = await plantData()
  const warehouseListArr = await warehouseList()
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
      async onDependencyChange({ form, changedField, setFieldValue, setFieldProps }) {
        if (changedField !== 'plantCode') return
        setFieldValue('depotCode', undefined)
        setFieldProps('depotCode', { options: [] })
        if (!form.plantCode) return
        const plantCodeObj = plantArr.find(a => a.plantCode === form.plantCode)
        if (!plantCodeObj) return
        try {
          const res = await getwarehouseByUserAndPlant({ plantId: plantCodeObj.id })
          whArr = (res.data || []).map(r => {
            return { ...r, label: r.whName, value: r.whCode }
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
      dependsOn: ['plantCode', 'depotCode'],
      async onDependencyChange({ form, changedField, setFieldValue, setFieldProps }) {
        if (changedField !== 'depotCode' && changedField !== 'plantCode') return
        setFieldValue('partitionCode', undefined)
        setFieldProps('partitionCode', { options: [] })
        if (!form.depotCode) return
        const whCodeObj = whArr.find(a => a.whCode === form.depotCode)
        if (!whCodeObj) return
        try {
          const res = await getWarehousePartition({ whId: whCodeObj.id })
          const options = (res.data || []).map(r => {
            return { ...r, label: r.partitionName, value: r.partitionCode }
          })
          setFieldProps('partitionCode', { options })
        } catch (e) {
          console.warn('getWarehousePartition 接口调用失败:', e)
        }
      },
      searchSort: 3
    },
    {
      field: "deptName",
      title: "车间",
      minWidth: 160,
    },
    {
      field: "teamName",
      title: "班组",
      minWidth: 160,
      searchable: true,
      searchType: "input",
      align: 'center',
      searchSort: 10
    },
    {
      field: "natureValueName",
      title: "支出项目",
      minWidth: 160,
    },
    {
      field: "makerName",
      title: "下单人",
      minWidth: 160,
      searchable: true,
      searchType: 'tableSelect',
      searchProps: {
        popupType: 'custom',
        width: 160,
        align: 'center',
        placeholder: '请选择下单人'
      },
      width: 160,
      searchSort: 4
    },
    {
      field: "orderDate",
      title: "下单日期",
      minWidth: 160,
    },
    {
      field: "noteName",
      title: "登卡人",
      minWidth: 160,
      searchable: true,
      searchType: "input",
      searchType: 'tableSelect',
      searchProps: {
        popupType: 'custom',
        clearable: true,
        placeholder: '请选择登卡人'
      },
      searchSort: 13
    },

    {
      field: "planCode",
      title: "电子请领单号",
      minWidth: 160,
      searchable: true,
      searchType: "input",
      align: 'center',
      searchSort: 15
    },
    {
      field: "obCode",
      title: "出库单号",
      minWidth: 160,
      searchable: true,
      searchType: "input",
      align: 'center',
      searchSort: 14,
      type:'link'
    },

    {
      field: "matlCode",
      title: "物资编号",
      minWidth: 160,
      searchable: true,
      searchType: 'input',
      align: 'center',
      searchSort: 5
    },

    {
      field: "matlName",
      title: "物资名称",
      minWidth: 160,
      searchable: true,
      searchType: 'input',
      align: 'center',
      searchSort: 6
    },

    {
      field: "matlType",
      title: "规格型号/图号/材质",
      minWidth: 160,
      searchable: true,
      searchType: 'input',
      align: 'center',
      searchSort: 7
    },
    {
      field: "flag",
      title: "单据状态",
      minWidth: 140,
      type: 'dict',
      dict: [{ label: '未登卡', value: '0,1' }, { label: '已登卡', value: '2' }],
      hideInTable: true,
      searchable: true,
      searchType: 'select',
      searchSort: 8
    },
    {
      field: "obSource",
      title: "出库单来源",
      minWidth: 140,
      type: 'dict',
      dict: [{ label: '手工录入', value: '0' }, { label: '需求计划', value: '1' }, { label: '领料计划', value: '2' }],
      hideInTable: false,
      searchable: false,
      searchType: 'select',
      searchSort: 9
    },
    {
      field: "idsCode",
      title: "设备",
      minWidth: 160,
      type: 'dict',
      dict: warehouseListArr,
      hideInTable: true,
      searchable: true,
      searchType: 'select',
      searchSort: 11
    },
    {
      field: "iddCode",
      title: "设备部件",
      minWidth: 160,
      dependsOn: ['idsCode',],
      hideInTable: true,
      searchable: true,
      searchType: 'select',
      searchSort: 12,
      async onDependencyChange({ form, changedField, setFieldValue, setFieldProps }) {
        if (changedField !== 'idsCode') return
        setFieldValue('iddCode', undefined)
        setFieldProps('iddCode', { options: [] })
        if (!form.idsCode) return
        try {
          const { data } = await equipPartList({ equipCode: form.idsCode })
          const list = data?.list || data || []
          const options = list.map(r => {
            return { ...r, label: r.epPartName, value: r.epPartCode }
          })
          setFieldProps('iddCode', { options })
        } catch (e) {
          console.warn('equipPartList 接口调用失败:', e)
        }
      },
    },
    {
      field: "matlUnit",
      title: "计量单位",
      minWidth: 160,
    },

    {
      field: "outNum",
      title: "数量",
      minWidth: 160,
    },
    {
      field: "price",
      title: "库存单价",
      minWidth: 160,
    },
    {
      field: "amount",
      title: "金额",
      minWidth: 160,
    },

    {
      field: "credCode",
      title: "技证号",
      minWidth: 160,
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
          const { dictList } = await useDictData('stock_attr')
          return dictList || []
        } catch (e) {
          console.warn('useDictData(stock_attr) 调用失败:', e)
          return []
        }
      },
      optionsCacheKey: 'inbound-query:v5:stockAttr',
      searchSort: 23
    },
     {
      field: "jf",
      title: "借方",
       searchable: true,
       searchSort: 24,
    },
    {
      field: "dfkmcode",
      title: "贷方科目编号",
      searchSort: 25,
    },

    {
      field: "subordinateSeqid",
      title: "成本预算项目",
      minWidth: 160,
      searchable: true,
      searchType: "input",
      align: 'center',
      searchSort: 16
    },

    {
      field: "templateName",
      title: "报账模板名称",
      minWidth: 160,
      searchable: true,
      searchType: "input",
      align: 'center',
      searchSort: 17
    },

    {
      field: "pleaseLeaduser",
      title: "请领人",
      minWidth: 160,
      searchable: true,
      searchType: "input",
      align: 'center',
      searchSort: 18
    },

    {
      field: "pickmatlName",
      title: "领料人",
      minWidth: 160,
      searchable: true,
      searchType: "input",
      align: 'center',
      searchSort: 19
    },

    {
      field: "carType",
      title: "车型",
      minWidth: 160,
      searchable: true,
      searchType: "input",
      align: 'center',
      searchSort: 20
    },

    {
      field: "trainsetName",
      title: "车组号",
      minWidth: 160,
      searchable: true,
      searchType: "input",
      align: 'center',
      searchSort: 21
    },
    {
      field: "trainNo",
      title: "车号",
      minWidth: 160,
      searchable: true,
      searchType: "input",
      align: 'center',
      searchSort: 22
    },
     {
      field: "xc",
      title: "修程名称",
      searchSort: 26,
    },


    {
      field: "comments",
      title: "备注",
      minWidth: 160,
    },


    {
      field: "supUnitName",
      title: "报账信息",
      minWidth: 160,
    },
    {
      field: "groupBy",
      title: "分组汇总",
      minWidth: 140,
      hideInTable: true,
      searchable: true,
      searchFullRow: true,
      searchType: 'checkbox',
      searchProps: {
        options: [
          { value: "outBoundPlant", label: "用料地区" },
          { value: "outBoundDepot", label: "仓库" },
          { value: "outBoundDept", label: "车间" },
          { value: "outBoundTeam", label: "班组" },
          { value: "matl", label: "物资" },
          { value: "outBoundCode", label: "出库单号" },
          { value: "outBoundIds", label: "单台设备" },
          { value: "outBoundIdd", label: "设备部件" },
        ]
      }
    }
  ]
}


export const toolbarConfig = {
  buttons: [
    { code: 'export', name: '导出', type: 'primary' },
  ]
}



