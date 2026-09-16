import {
  plantDictList,
  warehouseDict,
  warehouseplantDictList,
} from "@/api/rmstor/price-adjustment";
import { useDictData } from "@/utils/Dict";

 const columns = async (ctx) => {
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
      title: "地区",
      searchable: true,
      hideInTable: true,
      searchSort: 1,
      searchType: "select",
      labelKey: "plantName",
      valueKey: "plantCode",
      searchProps: {
        options: async () => {
          try {
            const { data } = await plantDictList();
            return data || [];
          } catch (e) {
            console.warn('plantDictList 接口调用失败:', e);
            return [];
          }
        },
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
      async onDependencyChange({
        form,
        changedField,
        setFieldValue,
        setFieldProps,
        selectedRecords,
      }) {
        setFieldValue("depotCode", undefined);
        setFieldProps("depotCode", { options: [] });
        if (!selectedRecords["plantCode"]) return;
        try {
          const { data } = await warehouseDict({
            plantId: selectedRecords["plantCode"].id,
          });
          setFieldProps("depotCode", { options: data || [] });
        } catch (e) {
          console.warn('warehouseDict 接口调用失败:', e);
        }
      },
    },
    {
      field: "depot",
      title: "仓库",
    },
    {
      field: "partitionCode",
      title: "仓库分区",
      searchable: true,
      hideInTable: true,
      searchSort: 3,
      searchType: "select",
      dependsOn: ["depotCode"],
      labelKey: "partitionName",
      valueKey: "partitionCode",
      async onDependencyChange({
        form,
        changedField,
        setFieldValue,
        setFieldProps,
        selectedRecords,
      }) {
        setFieldValue("partitionCode", undefined);
        setFieldProps("partitionCode", { options: [] });
        if (!selectedRecords["depotCode"]) return;
        try {
          const { data } = await warehouseplantDictList({
            whId: selectedRecords["depotCode"].id,
          });
          setFieldProps("partitionCode", { options: data || [] });
        } catch (e) {
          console.warn('warehouseplantDictList 接口调用失败:', e);
        }
      },
    },
    {
      field: "partitionName",
      title: "仓库分区",
    },
    {
      field: "stockAttr",
      title: "库存属性",
      minWidth: 160,
      type: "dict",
      searchable: true,
      searchSort: 4,
      searchType: "select",
      optionsCacheKey: "stock-query-partitionDetail:stockAttr",
      requestOptions: async () => {
        try {
          const { dictList } = await useDictData("stock_attr");
          return dictList || [];
        } catch (e) {
          console.warn('useDictData(stock_attr) 接口调用失败:', e);
          return [];
        }
      },
    },
   
    {
      field: "initialAmount",
      title: "期初金额",
      type: "amount",
    },
    {
      field: "totalInBoundAmount",
      title: "收入总金额",
      type: "amount",
    },
    {
      field: "inBoundAmount",
      title: "入库金额",
      type: "amount",
    },
    {
      field: "returnAmount",
      title: "退料金额",
      type: "amount",
    },
    {
      field: "totalOutBoundAmount",
      title: "支出总金额",
      type: "amount",
    },
    {
      field: "outBoundAmount",
      title: "出库金额",
      type: "amount",
    },
    {
      field: "allocateAmount",
      title: "调拨单金额",
      type: "amount",
    },
    {
      field: "profitLoseAmount",
      title: "调整金额",
      type: "amount",
    },
    {
      field: "internalInAmount",
      title: "移库移入金额",
      type: "amount",
    },
    {
      field: "internalOutAmount",
      title: "移库移出金额",
      type: "amount",
    },
     {
      field: "profitAmount",
      title: "调整单金额",
      type: "amount",
    },
     {
      field: "tjlc",
      title: "调价料差",
      type: "amount",
    },
     {
      field: "nowAmount",
      title: "期末金额",
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
  { label: "调价料差", value: "0元", field: "totalTjlc" },
]
export default {
  columns,
  toolbarConfig,
  summaryField
}