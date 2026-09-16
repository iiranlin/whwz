
import { rmstorEnterFlagArr } from '@/utils/dictionary'
import { selectPlantDict } from '@/api/warehouse/plantDict'
import { getwarehouseByUserAndPlant } from '@/api/warehouse/warehouseDict'
import { getWarehousePartition } from '@/api/warehouse/partition'

export const columns = async (ctx) => {
  return [
    {
      field: "flag",
      title: "单据状态",
      minWidth: 160,
      type: "dict",
      searchable: true,
      searchType: "select",
      searchSort: 0,
      requestOptions: async () => rmstorEnterFlagArr,
      optionsCacheKey: "transfer-query:flag",
    },
    {
      field: "billCode",
      title: "移库单号",
      searchable: true,
      searchSort: 1,
      minWidth: 180,
      searchType: "input",
    },
    {
      field: "ptPlantCode",
      title: "移入地区",
      hideInTable: true,
      searchable: true,
      searchType: 'select',
      searchSort: 2,
      labelKey: "plantName",
      valueKey: "plantCode",
      searchProps: {
        options: async () => {
          try {
            const { data } = await selectPlantDict();
            return data || [];
          } catch (e) {
            console.warn('selectPlantDict 接口调用失败:', e);
            return [];
          }
        },
        clearable: true,
      },
    },
    {
      field: "ptPlantName",
      title: "移入地区",
    },
    {
      field: "ptWhCode",
      title: "移入仓库",
      searchable: true,
      hideInTable: true,
      searchType: "select",
      searchSort: 3,
      dependsOn: ["ptPlantCode"],
      labelKey: "whName",
      valueKey: "whCode",
      async onDependencyChange({
        form,
        changedField,
        setFieldValue,
        setFieldProps,
        selectedRecords,
      }) {
        setFieldValue("ptWhCode", undefined);
        setFieldProps("ptWhCode", { options: [] });
        if (!selectedRecords["ptPlantCode"]) return;
        try {
          const { data } = await getwarehouseByUserAndPlant({
            plantId: selectedRecords["ptPlantCode"].id,
          });
          setFieldProps("ptWhCode", { options: data || [] });
        } catch (e) {
          console.warn('getwarehouseByUserAndPlant 接口调用失败:', e);
        }
      },
    },
    {
      field: "ptWhName",
      title: "移入仓库",
    },
    {
      field: "ptPartitionCode",
      title: "移入仓库分区",
      searchable: true,
      hideInTable: true,
      searchSort: 4,
      searchType: "select",
      dependsOn: ["ptWhCode"],
      labelKey: "partitionName",
      valueKey: "partitionCode",
      async onDependencyChange({
        form,
        changedField,
        setFieldValue,
        setFieldProps,
        selectedRecords,
      }) {
        setFieldValue("ptPartitionCode", undefined);
        setFieldProps("ptPartitionCode", { options: [] });
        if (!selectedRecords["ptWhCode"]) return;
        try {
          const { data } = await getWarehousePartition({
            whId: selectedRecords["ptWhCode"].id,
          });
          setFieldProps("ptPartitionCode", { options: data || [] });
        } catch (e) {
          console.warn('getWarehousePartition 接口调用失败:', e);
        }
      },
    },
    {
      field: "ptPartitionName",
      title: "移入仓库分区",
    },
    {
      field: "prePlantName",
      title: "移出地区",
    },
    {
      field: "preWhName",
      title: "移出仓库",
    },
    {
      field: "prePartitionName",
      title: "移出仓库分区",
    },
    {
      field: "makeDate",
      title: "下单日期",
      type: 'date',
      searchable: true,
      searchSort: 8,
      searchType: "dateRange",
    },
    {
      field: "comments",
      title: "备注",
      minWidth: 160,
    },
    {
      field: "matlCode",
      searchSort: 5,
      searchable: true,
      title: "物资编码",
    },
    {
      field: "matlName",
      searchSort: 6,
      searchable: true,
      title: "物资名称",
    },
    {
      field: "matlType",
      title: "规格型号",
      searchable: true,
      searchSort: 7,
    },
    {
      field: "matlType",
      title: "规格型号/材质/图号",
      render: (row, column) => {
        if(!row.matlType) {
          return '/'
        }
        return `${row.matlType}${row.matlRaw ? '/' + row.matlRaw : ''}${row.matlpCode ? '/' + row.matlpCode : ''}`
      }
    },
    {
      field: "matlUnit",
      title: "计量单位",
    },
    {
      field: "batchNo",
      title: "移入批次号",
    },
    {
      field: "tsNum",
      title: "移入数量",
      type: 'number'
    },
    {
      field: 'cardPrice',
      title: '库存单价(元)',
      type: "amount",
    },
    {
      field: 'tsAmount',
      title: '移入金额(元)',
      type: "amount",
    },
  ];
};

export const toolbarConfig = {
  buttons: [{ code: "export", name: "导出", type: "primary" }],
};
