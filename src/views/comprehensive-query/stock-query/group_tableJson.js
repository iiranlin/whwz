import {
  plantDictList,
  warehouseDict,
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
 const columns = async (ctx) => {
  const plantArr = await plantData()
  let whArr = []
  return [
    {
      field: "dateRange",
      title: "财务日期",
      hideInTable: true,
      searchable: true,
      searchType: "dateRange",
      searchProps: {
        type: "monthrange",
        valueFormat: "YYYY-MM",
        clearable: false,
        startPlaceholder: "开始日期",
        endPlaceholder: "结束日期",
      },
      searchSort: 0,
    },
    {
      field: "plantCode",
      title: "用料地区",
      searchable: true,
      hideInTable: true,
      searchSort: 1,
      searchType: "select",
      labelKey: "plantName",
      valueKey: "plantCode",
      searchProps: {
        options: plantArr,
        clearable: true,
      },
    },
    {
      field: "plantArea",
      title: "地区",
    },
    {
      field: "depotCode",
      title: "仓库",
      searchable: true,
      hideInTable: true,
      searchType: "select",
      searchSort: 2,
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
      field: "depot",
      title: "仓库",
    },
    {
      field: "initialAmount",
      title: "期初金额",
      type: "amount",
    },
    {
      field: "nowInAmount",
      title: "收入金额(元)",
      type: "amount",
    },
    {
      field: "nowOutAmount",
      title: "支出金额(元)",
      type: "amount",
    },
    {
      field: "profitLoseAmount",
      title: "调整金额(元)",
      type: "amount",
    },
    {
      field: "nowAmount",
      title: "期末金额(元)",
      type: "amount",
    },
   
  ];
};

 const toolbarConfig = {
  buttons: [
    { code: "export", name: "导出", type: "primary" },
    { code: "docs", name: "查看计算公式" },
    
  ],
};

const summaryField = [
  { label: "期初金额：", value: "0元", field: "totalInitialAmount" },
  { label: "收入金额：", value: "0元", field: "totalNowInAmount" },
  { label: "支出金额：", value: "0元", field: "totalNowOutAmount" },
  { label: "调整金额：", value: "0元", field: "totalProfitLoseAmount" },
  { label: "期末金额：", value: "0元", field: "totalNowAmount" },
]
export default {
  columns,
  toolbarConfig,
  summaryField
}