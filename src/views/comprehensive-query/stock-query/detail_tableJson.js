import {
  plantDictList,
  warehouseDict,
  warehouseplantDictList,
} from "@/api/rmstor/price-adjustment";
import { useDictDataQuery } from "@/utils/Dict";

export const columns = async (ctx) => {
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
      field: "plantArea",
      minWidth: 200,
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
      minWidth: 160,
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
      optionsCacheKey: "stock-query-detail:stockAttr",
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
      field: "matlCode",
      title: "物资编码",
      searchable: true,
      searchSort: 6,
      searchType: "input",
    },
    {
      field: "matlName",
      title: "物资名称",
      searchable: true,
      searchSort: 7,
      searchType: "input",
    },
    {
      field: "matlType",
      title: "规格型号",
      searchable: true,
      searchSort: 8,
      searchType: "input",
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
      searchSort: 5,
      searchType: "input",
    },
    {
      field: "productionDate",
      title: "生产日期",
      searchType: "date",
    },
    {
      field: "validityPeriod",
      type: "number",
      title: "有效期",
    },
    {
      field: "validityPeriodUnit",
      title: "有效期单位",
    },
    {
      field: "expirationDate",
      title: "到货日期",
      searchType: "date",
    },
    {
      field: "cardPrice",
      title: "库存单价(元)",
      type: "amount",
    },
    {
      field: "initialAmount",
      title: "期初金额(元)",
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
    {
      field: "initialNum",
      title: "期初数量",
      type: "amount",
    },
    {
      field: "nowInNum",
      title: "收入数量",
      type: "amount",
    },
    {
      field: "nowOutNum",
      title: "支出数量",
      type: "amount",
    },
    {
      field: "profitLoseNum",
      title: "调整数量",
      type: "amount",
    },
    {
      field: "nowNum",
      title: "期末数量",
      type: "amount",
    },

    {
      field: "effectFlag",
      title: "状态",
      type: "dict",
      searchType: "select",
      searchProps: {
        options: [
          { label: "无效", value: "0" },
          { label: "有效", value: "1" },
        ],
      },
    },
    {
      field: "fourLocCode",
      title: "四号定位",
    },
  ];
};

const summaryField = [
  { label: "期初金额：", value: "0元", field: "totalInitialAmount" },
  { label: "收入金额：", value: "0元", field: "totalNowInAmount" },
  { label: "支出金额：", value: "0元", field: "totalNowOutAmount" },
  { label: "调整金额：", value: "0元", field: "totalProfitLoseAmount" },
  { label: "期末金额：", value: "0元", field: "totalNowAmount" },
];

const toolbarConfig = {
  buttons: [
    { code: "export", name: "导出", type: "primary" },
    { code: "docs", name: "查看计算公式" },
  ],
};

export default {
  columns,
  toolbarConfig,
  summaryField,
};
