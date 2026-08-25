import { useDictData } from "@/utils/Dict"

export const columns = [
  {
    field: "whCode",
    title: "仓库编码",
    minWidth: 160,
    align: "center",
  },
  {
    field: "whName",
    title: "仓库名称",
    minWidth: 160,
  },
  {
    field: "partitionCode",
    title: "仓库分区编号",
    minWidth: 160,
    align: "center",
    searchable: true,
    searchType: "input",
  },
  {
    field: "partitionName",
    title: "仓库分区",
    minWidth: 160,
    searchable: true,
    searchType: "input",
  },
  {
    field: "stockattr",
    title: "库存属性",
    minWidth: 160,
    type: "dict",
    searchable: true,
    searchType: "select",
    requestOptions: async () => {
      const { dictList } = await useDictData('stock_attr')
      return dictList
    },
    optionsCacheKey: "warehouse-partition:stockattr",
  },
  {
    field: "taxFlagName",
    title: "应税用途",
    minWidth: 140,
    align: "center",
  },
  {
    field: "firMatlCode",
    title: "前物资范围",
    minWidth: 140,
  },
  {
    field: "endMatlCode",
    title: "后物资范围",
    minWidth: 140,
  },
];

export const toolbarConfig = {
  buttons: [
    {code: 'create', name: '新增', type: 'primary'},
    {code: 'modify', name: '修改', showInTop: false, showInRow: true},
    {code: 'delete', name: '删除', type: 'primary'},
  ]
}