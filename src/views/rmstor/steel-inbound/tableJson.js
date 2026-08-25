import { plantDictList, warehouseDict, warehouseplantDictList, } from '@/api/rmstor/price-adjustment'



export const auditFlagObj = { '1': '未登卡', '2': '已登卡' }
export const tableJson = [
  { isShow: true, fixed: false, type: 'dict', key: 'flag', prop: 'flag', label: '状态', align: 'center', width: 120, stats: auditFlagObj },
  { isShow: true, fixed: false, type: 'link', key: 'ibBillCode', prop: 'ibBillCode', label: '入库单号', align: 'center', width: 220 },
  { isShow: true, fixed: false, type: '', key: 'supUnitName', prop: 'supUnitName', label: '供货单位', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'plantName', prop: 'plantName', label: '用料地区', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'depotName', prop: 'depotName', label: '仓库', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'taxFlagName', prop: 'taxFlagName', label: '应税用途', align: 'center', width: 160, },
  { isShow: true, fixed: false, type: '', key: 'bmName', prop: 'bmName', label: '业务员', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: 'date', key: 'orderDate', prop: 'orderDate', label: '下单日期', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: 'date', key: 'noteDate', prop: 'noteDate', label: '登卡日期', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'matlAmount', prop: 'matlAmount', label: '料款（元）', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'incotaxAmount', prop: 'incotaxAmount', label: '税额（元）', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'taxMatlAmount', prop: 'taxMatlAmount', label: '含税料款（元）', align: 'center', width: 160 },
]

export const tableButtonJson = [
  { code: 'create', name: '新增' },
  { code: 'modify', name: '修改', type: 'inline' },
  { code: 'delete', name: '删除' },
  { code: 'report', name: '红冲', type: 'inline' },
  { code: 'publish', name: '登卡' },
  { code: 'cancelPublish', name: '撤销登卡' },
  { code: 'print', name: '打印' },
  { code: 'export', name: '导出' },
]

// 新增弹框明细字段
export const matlTableJson = [
  { isShow: true, fixed: false, type: '', key: 'matlCode', prop: 'matlCode', label: '物资编码', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'matlName', prop: 'matlName', label: '物资名称', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'matlType', prop: 'matlType', label: '规格型号/材质/图号', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'matlUnit', prop: 'matlUnit', label: '计量单位', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: 'slot', key: 'credCode', prop: 'credCode', label: '技证号', align: 'center', width: 160, },
  { isShow: true, fixed: false, type: 'slot', key: 'paNum', prop: 'paNum', label: '入库数量', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: 'slot', key: 'stkPrice', prop: 'stkPrice', label: '采购单价', align: 'center', width: 160, },
  { isShow: true, fixed: false, type: 'slot', key: 'stkAmount', prop: 'stkAmount', label: '采购金额', align: 'center', width: 160, },
  { isShow: true, fixed: false, type: '', key: 'cardPrice', prop: 'cardPrice', label: '库存单价', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'standardAmount', prop: 'standardAmount', label: '入库金额', align: 'center', width: 160 },
]

export const matlTableButtonJson = [
  // { code: 'choiceMatl', name: '添加物资' },
  { code: 'delete', name: '删除', type: 'inline' },
]

// 打印字段
export const printMatlTableJson = [
  { isShow: true, fixed: false, type: '', key: 'typeIndex', prop: 'typeIndex', label: '序号', align: 'center', width: 50 },
  { isShow: true, fixed: false, type: '', key: 'matlCode', prop: 'matlCode', label: '物资编码', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'matlName', prop: 'matlName', label: '物资名称/规格型号', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'matlUnit', prop: 'matlUnit', label: '单位', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'paNum', prop: 'paNum', label: '数量', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'stkPrice', prop: 'stkPrice', label: '采购单价', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'stkAmount', prop: 'stkAmount', label: '采购金额', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'cardPrice', prop: 'cardPrice', label: '库存单价', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'standardAmount', prop: 'standardAmount', label: '入库金额', align: 'center', width: 160 },
]

// 选择供货单位弹框字段
export const rluTableJson = [
  { isShow: true, fixed: false, type: '', key: 'unitCode', prop: 'unitCode', label: '往来单位编号', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'unitName', prop: 'unitName', label: '往来单位名称', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'type', prop: 'type', label: '往来单位类型', align: 'center', width: 160 },
]

// 调拨单字段
export const rmstorMatlTableJson = [
  { isShow: true, fixed: false, type: '', key: 'matlCode', prop: 'matlCode', label: '物资编码', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'matlName', prop: 'matlName', label: '物资名称', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'matlType', prop: 'matlType', label: '规格型号', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'matlUnit', prop: 'matlUnit', label: '计量单位', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'cardPrice', prop: 'cardPrice', label: '库存单价', align: 'center', width: 160, },
  { isShow: true, fixed: false, type: '', key: 'outsalePrice', prop: 'outsalePrice', label: '调拨销售单价', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'outsaleNum', prop: 'outsaleNum', label: '调拨数量', align: 'center', width: 160, },
  { isShow: true, fixed: false, type: '', key: 'outsaleAmount', prop: 'outsaleAmount', label: '调拨销售金额（元）', align: 'center', width: 160 },
]

//红冲
export const rmstorRedReversalTableJson = [
  { isShow: true, fixed: false, type: '', key: 'matlCode', prop: 'matlCode', label: '物资编码', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'matlName', prop: 'matlName', label: '物资名称', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'matlType', prop: 'matlType', label: '规格型号/材质/图号', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'matlUnit', prop: 'matlUnit', label: '计量单位', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'credCode', prop: 'credCode', label: '技证号', align: 'center', width: 160, },
  { isShow: true, fixed: false, type: '', key: 'paNum', prop: 'paNum', label: '入库数量', align: 'center', width: 160, },
  { isShow: true, fixed: false, type: 'slot', key: 'RpaNum', prop: 'RpaNum', label: '红冲数量', align: 'center', width: 160, },
  { isShow: true, fixed: false, type: '', key: 'stkPrice', prop: 'stkPrice', label: '采购单价', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'stkAmount', prop: 'stkAmount', label: '采购金额（元）', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: 'slot', key: 'RstkAmount', prop: 'RstkAmount', label: '红冲采购金额（元）', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'cardPrice', prop: 'cardPrice', label: '库存单价', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'standardAmount', prop: 'standardAmount', label: '入库金额（元）', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: 'slot', key: 'RstandardAmount', prop: 'RstandardAmount', label: '红冲入库金额（元）', align: 'center', width: 160 },
]

// 选择物资
export const tableJsonCheckMaterial = [
  { isShow: true, fixed: false, type: '', key: 'matlCode', prop: 'matlCode', label: '物资编码', align: 'center' },
  { isShow: true, fixed: false, type: '', key: 'matlName', prop: 'matlName', label: '物资名称', align: 'center' },
  { isShow: true, fixed: false, type: '', key: 'matlType', prop: 'matlType', label: '规格型号/图号/材质', align: 'center', },
  { isShow: true, fixed: false, type: '', key: 'matlUnit', prop: 'matlUnit', label: '计量单位', align: 'center', },
]



const plantData = async () => {
  const res = await plantDictList()
  return res.data.map(item => {
    return { ...item, label: item.plantName, value: item.plantCode }
  })
}

async function createRichColumns() {
  const plantArr = await plantData()
  let whArr = []
  return [
    {
      field: 'flag',
      title: '单据状态',
      showOverflowTooltip: true,
      searchable: true,
      searchType: 'select',
      options: [
        { label: '未登卡', value: '1' },
        { label: '已登卡', value: '2' },
      ],
    },
    {
      field: 'ibBillCode',
      title: '入库单号',
      showOverflowTooltip: true,
      searchType: 'input',
      searchable: true,
      type: 'link',
    },
    {
      field: 'supUnitName',
      title: '供货单位',
      showOverflowTooltip: true,
      searchable: true,
      searchType: 'tableSelect',
          searchProps: {
      popupType: 'custom',
    },
    },
    {
      field: "plantName",
      title: "用料地区",
      showOverflowTooltip: true,
    },
    {
      field: "depotName",
      title: "仓库",
      showOverflowTooltip: true,
    },
    {
      field: "partitionName",
      title: "仓库分区",
      showOverflowTooltip: true,
    },
    {
      field: "plantCode",
      title: "用料地区",
      searchable: true,
      hideInTable: true,
      searchType: 'select',
      searchProps: {
        options: plantArr,
        clearable: true,
      },
    },
    {
      field: "depotCode",
      title: "仓库",
      searchable: true,
      hideInTable: true,
      searchType: 'select',
      searchProps: { options: [], clearable: true },
      dependsOn: ['plantCode'],
      async onDependencyChange({ form, changedField, setFieldValue, setFieldProps }) {
        if (changedField !== 'plantCode') return
        setFieldValue('depotCode', undefined)
        setFieldProps('depotCode', { options: [] })
        if (!form.plantCode) return
        const plantCodeObj = plantArr.find(a => a.plantCode === form.plantCode)
        const res = await warehouseDict({ plantId: plantCodeObj.id })
        whArr = res.data.map(r => {
          return { ...r, label: r.whName, value: r.whCode }
        })
        setFieldProps('depotCode', { options: whArr })
      },
    },
    {
      field: "partitionCode",
      title: "仓库分区",
      searchable: true,
      hideInTable: true,
      searchType: 'select',
      searchProps: { options: [], clearable: true },
      dependsOn: ['plantCode', 'depotCode'],
      async onDependencyChange({ form, changedField, setFieldValue, setFieldProps }) {
        if (changedField !== 'depotCode' && changedField !== 'plantCode') return
        setFieldValue('partitionCode', undefined)
        setFieldProps('partitionCode', { options: [] })
        if (!form.depotCode) return
        const whCodeObj = whArr.find(a => a.whCode === form.depotCode)
        const res = await warehouseplantDictList({ whId: whCodeObj.id })
        const options = res.data.map(r => {
          return { ...r, label: r.partitionName, value: r.partitionCode }
        })
        setFieldProps('partitionCode', { options })
      },
    },
    {
      field: 'taxFlagName',
      title: '应税用途',
      showOverflowTooltip: true,
      searchable: false,
      searchType: 'input',
    },
    {
      field: 'matlCode',
      title: '物资编码',
      showOverflowTooltip: true,
      searchable: true,
      hideInTable: true,
      searchType: 'input',
    },
    {
      field: 'matlName',
      title: '物资名称',
      showOverflowTooltip: true,
      searchable: true,
      hideInTable: true,
      searchType: 'input',
    },
    {
      field: 'matlType',
      title: '规格型号',
      showOverflowTooltip: true,
      hideInTable: true,
      searchable: true,
      searchType: 'input',
    },
    {
      field: 'bmName',
      title: '业务员',
      showOverflowTooltip: true,
      searchable: false,
      searchType: 'input',
    },
    {
      field: 'orderDate',
      title: '下单日期',
      showOverflowTooltip: true,
      searchable: false,
      searchType: 'input',
      type: 'date',
      dateFormat: 'YYYY-MM-DD',
    },
    {
      field: 'noteDate',
      title: '登卡日期',
      showOverflowTooltip: true,
      searchable: false,
      searchType: 'input',
      type: 'date',
      dateFormat: 'YYYY-MM-DD',
    },
    {
      field: 'matlAmount',
      title: '料款（元）',
      showOverflowTooltip: true,
      searchable: false,
      searchType: 'input',
    },

    {
      field: 'incotaxAmount',
      title: '税额（元）',
      showOverflowTooltip: true,
    },

    {
      field: 'taxMatlAmount',
      title: '含税料款（元）',
      showOverflowTooltip: true,
    },
    {
      field: 'orderDate',
      title: '下单日期',
      showOverflowTooltip: true,
      hideInTable: true,
      type: 'date',
      dateFormat: 'YYYY-MM-DD',
      searchable: true,
      searchType: 'dateRange',
    },
  ]

}
export const columns = createRichColumns()


