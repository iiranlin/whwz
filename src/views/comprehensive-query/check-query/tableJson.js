import {
  plantDictList,
  warehouseDict,
  warehouseplantDictList,
} from "@/api/rmstor/price-adjustment";

const plantData = async () => {
  try {
    const res = await plantDictList()
    return (res.data || []).map(item => {
      return {...item, label: item.plantName, value: item.plantCode}
    })
  } catch (e) {
    console.warn('selectPlantDict 接口调用失败:', e)
    return []
  }
}

export const columns = async (ctx) => {
  const plantArr = await plantData()
  let whArr = []
  return [
    {
      field: "csCode",
      title: "盘点单号",
      searchable: true,
       searchSort: 7,
      searchType: "input",
      minWidth: 160,
    },
   {
      field: "yearMonth",
      title: "盘点周期",
      searchType: "date",
       searchProps: {type: 'month', valueFormat: 'YYYY-MM'}
    },
    {
      field: "plantCode",
      title: "用料地区",
      searchable: true,
      hideInTable: true,
       searchSort: 3,
      searchType: "select",
      labelKey: "plantName",
      valueKey: "plantCode",
      searchProps: {
        options: plantArr,
        clearable: true,
      },
    },
    {
      field: "plantName",
      title: "用料地区",
    },
    {
      field: "depotCode",
      title: "仓库",
      searchable: true,
      hideInTable: true,
      searchType: "select",
       searchSort: 4,
      searchProps: { options: [], clearable: true },
      dependsOn: ["plantCode"],
      labelKey: "whName",
      valueKey: "whCode",
      async onDependencyChange({form, changedField, setFieldValue, setFieldProps}) {
        if (changedField !== 'plantCode') return
        setFieldValue('depotCode', undefined)
        setFieldProps('depotCode', { options: [] })
        if(!form.plantCode) return
        const plantCodeObj = plantArr.find(a => a.plantCode === form.plantCode)
        if(!plantCodeObj) return
        try {
          const res = await warehouseDict({plantId: plantCodeObj.id})
          whArr = (res.data || []).map(r => {
            return {...r, label: r.whName, value: r.whCode}
          })
          setFieldProps('depotCode', { options: whArr })
        } catch (e) {
          console.warn('getwarehouseByUserAndPlant 接口调用失败:', e)
        }
      },
    },
    {
      field: "depotName",
      title: "仓库",
    },
    {
      field: "partitionCode",
      title: "仓库分区",
      searchable: true,
      hideInTable: true,
       searchSort: 5,
      searchType: "select",
      searchProps: { options: [], clearable: true },
      dependsOn: ["depotCode"],
      labelKey: "partitionName",
      valueKey: "partitionCode",
      async onDependencyChange({form, changedField, setFieldValue, setFieldProps}) {
        if (changedField !== 'depotCode' && changedField !== 'plantCode') return
        setFieldValue('partitionCode', undefined)
        setFieldProps('partitionCode', { options: [] })
        if(!form.depotCode) return
        const whCodeObj = whArr.find(a => a.whCode === form.depotCode)
        if(!whCodeObj) return
        try {
          const res = await warehouseplantDictList({whId: whCodeObj.id})
          const options = (res.data || []).map(r => {
            return {...r, label: r.partitionName, value: r.partitionCode}
          })
          setFieldProps('partitionCode', { options })
        } catch (e) {
          console.warn('getWarehousePartition 接口调用失败:', e)
        }
      },
    },
        {
      field: "partitionName",
      title: "仓库分区",
    },
    {
      field: "cardCount",
      title: "库存卡片数",
      type: "amount",
    },
    {
      field: "csCount",
      title: "盘点卡片数",
      type: "amount",
    },
    {
      field: "matlCode",
      title: "物资编码",
      searchable: true,
       searchSort: 1,
      searchType: "input",
    },
    {
      field: "matlName",
      title: "物资名称",
      searchable: true,
       searchSort: 2,
      searchType: "input",
    },
    {
      field: "matlType",
      title: "规格型号/材质/图号",
    },
    {
      field: "matlUnit",
      title: "计量单位",
    },
    {
      field: "batchNo",
      title: "批次号",
      searchable: true,
      minWidth: 160,
      searchType: "input",
    },
    {
      field: "cardPrice",
      title: "库存单价（元）",
      type: "amount",
    },
    {
      field: "accStock",
      title: "库存数量",
      type: "amount",
    },
    {
      field: "realStock",
      title: "盘点数量",
      type: "amount",
    },
    {
      field: "diffNum",
      title: "盈亏数量",
      type: "amount",
    },
    {
      field: "diffInfo",
      title: "盈亏原因",
    },
    {
      field: "operator",
      title: "盘点人",
    },
    {
      field: "operDate",
      title: "盘点时间",
      type: "date",
      searchable: true,
       searchSort: 6,
      searchType: "dateRange",
    },
    {
      field: "permFlag",
      title: "单据状态",
      type: "dict",
      searchable: true,
      searchType: "select",
      searchProps: {
        options: [
          { label: "未提交", value: "0" },
          { label: "未审核", value: "1" },
          { label: "已审核", value: "2" },
          { label: "已生成调整单", value: "3" },
        ],
      },
    },
  ];
};

export const toolbarConfig = {
  buttons: [{ code: "export", name: "导出", type: "primary" }],
};
