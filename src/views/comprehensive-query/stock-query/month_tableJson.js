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
      field: "stockattr",
      title: "库存属性",
      minWidth: 160,
      type: "dict",
      searchable: true,
      searchSort: 4,
      searchType: "select",
      optionsCacheKey: "stock-query-month:stockAttr",
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
      field: "janAmt",
      title: "一月",
      type: "amount",
    },
   
    {
      field: "febAmt",
      title: "二月",
      type: "amount",
    },
    {
      field: "marAmt",
      title: "三月",
      type: "amount",
    },
    {
      field: "aprAmt",
      title: "四月",
      type: "amount",
    },
    {
      field: "mayAmt",
      title: "五月",
      type: "amount",
    },
    {
      field: "junAmt",
      title: "六月",
      type: "amount",
    },
    {
      field: "julAmt",
      title: "七月",
      type: "amount",
    },
    {
      field: "augAmt",
      title: "八月",
      type: "amount",
    },
    {
      field: "sepAmt",
      title: "九月",
      type: "amount",
    },
    {
      field: "octAmt",
      title: "十月",
      type: "amount",
    },
    {
      field: "novAmt",
      title: "十一月",
      type: "amount",
    },
    {
      field: "decAmt",
      title: "十二月",
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