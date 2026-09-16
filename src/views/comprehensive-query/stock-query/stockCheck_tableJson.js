import {
  plantDictList,
  warehouseDict,
  warehouseplantDictList,
} from "@/api/rmstor/price-adjustment";
import { useDictDataQuery } from "@/utils/Dict";

 const columns = async (ctx) => {
  return [
     {
      field: "dateRange",
      title: "财务日期",
      searchable: true,
      hideInTable: true,
      searchSort: 0,
      searchType: "monthRange",
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
      field: "stockAttr",
      title: "库存属性",
      minWidth: 160,
      type: "dict",
       hideInTable: true,
      searchable: true,
      searchSort: 4,
      searchType: "select",
      optionsCacheKey: "stock-query-stockCheck:stockAttr",
      requestOptions: async () => {
        try {
          const { dictList } = await useDictDataQuery("stock_attr");
          return dictList || [];
        } catch (e) {
          console.warn('useDictDataQuery(stock_attr) 接口调用失败:', e);
          return [];
        }
      },
    },
    {
      field: "yearMonth",
      title: "年月",
    },
    {
      field: "lastMonthAmount",
      title: "上月期末金额",
       type: "amount",
    },
    {
      field: "initialAmountTotal",
      title: "期初金额合计",
       type: "amount",
    },
    {
      field: "tjlcAmount",
      title: "调价料差",
       type: "amount",
    },
    {
      field: "initialAmount",
      title: "期初金额",
      type: "amount",
    },
   
    {
      field: "nowInAmount",
      title: "收入金额",
      type: "amount",
    },
    {
      field: "nowOutAmount",
      title: "支出金额",
      type: "amount",
    },
    {
      field: "profitLoseAmount",
      title: "调整金额",
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


export default {
  columns,
  toolbarConfig,
}