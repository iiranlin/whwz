import { plantDictList, warehouseDict, warehouseplantDictList, } from '@/api/rmstor/price-adjustment'

// 打印字段
export const printMatlTableJson = [
  { isShow: true, fixed: false, type: '', key: 'typeIndex', prop: 'typeIndex', label: '序号', align: 'center', width: 50 },
  { isShow: true, fixed: false, type: '', key: 'matlCode', prop: 'matlCode', label: '物资编码', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'matlName', prop: 'matlName', label: '物资名称/规格型号', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'matlUnit', prop: 'matlUnit', label: '单位', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'prNum', prop: 'prNum', label: '前数量', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'ptNum', prop: 'ptNum', label: '后数量', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'cardPrice', prop: 'cardPrice', label: '库存单价', align: 'right', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'profitAmount', prop: 'profitAmount', label: '盈亏金额', align: 'right', width: 160 },
]

//审批详情
export const tableJsonArrroval = [
  { isShow: true, fixed: false, type: '', key: 'matlCode', prop: 'matlCode', label: '发送人', align: 'center' },
  { isShow: true, fixed: false, type: '', key: 'matlName', prop: 'matlName', label: '接收人', align: 'center' },
  { isShow: true, fixed: false, type: '', key: 'matlType', prop: 'matlType', label: '发送日期', align: 'center', },
  { isShow: true, fixed: false, type: '', key: 'matlRaw', prop: 'matlRaw', label: '状态', align: 'center', },
  { isShow: true, fixed: false, type: '', key: 'matlUnit', prop: 'matlUnit', label: '审批意见', align: 'center', },
]

// 物资选择弹窗列配置（pro-table 格式：field/title/searchable/searchType）
export const rmstorMatlTableJson = [
  {
    field: 'matlCode',
    title: '物资编码',
    showOverflowTooltip: true,
    searchable: true,
    searchType: 'input',
  },
  {
    field: 'matlName',
    title: '物资名称',
    showOverflowTooltip: true,
    searchable: true,
    searchType: 'input',
  },
  {
    field: 'matlType',
    title: '规格型号',
    showOverflowTooltip: true,
    searchable: true,
    hideInTable: true,
    searchType: 'input',
  },
  {
    field: 'isRepertory',
    title: '库存是否为0',
    searchable: true,
    hideInTable: true,
    searchType: 'radio',
    searchProps: {
      options: [
        { label: '是', value: '1' },
        { label: '否', value: '0' },
      ],
    },
  },
  {
    field: 'matlType',
    title: '规格型号/材质/图号',
    showOverflowTooltip: true,
    searchable: false,
    searchType: 'input',
  },
  {
    field: 'batchNo',
    title: '批次号',
    showOverflowTooltip: true,
    searchable: false,
    searchType: 'input',
  },
  {
    field: 'matlUnit',
    title: '计量单位',
    showOverflowTooltip: true,
    searchable: false,
    searchType: 'input',
  },
  {
    field: 'nowNum',
    title: '库存数量',
    showOverflowTooltip: true,
    searchable: false,
    searchType: 'input',
  },
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
        // { label: '未提交', value: '0' },
        { label: '未登卡', value: '1' },
        { label: '已登卡', value: '2' },
      ],
    },
    {
      field: 'adjustCode',
      title: '调整单号',
      showOverflowTooltip: true,
      searchable: true,
      searchType: 'input',
      type: 'link',
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
      field: 'orderDate',
      title: '下单日期',
      showOverflowTooltip: true,
      type: 'date',
      dateFormat: 'YYYY-MM-DD',
      searchable: true,
      searchType: 'dateRange',
    },
    // 调整单不走提交审核：隐藏"审核状态"列（保存即已审核），将来恢复审核时放开
    // {
    //   field: 'auditFlag',
    //   title: '审核状态',
    //   showOverflowTooltip: true,
    //   searchable: false,
    //   searchType: 'select',
    //   options: [
    //     { label: '未审批', value: '0' },
    //     { label: '审批中', value: '1' },
    //     { label: '已审批', value: '2' },
    //   ],
    // },
    {
      field: 'comments',
      title: '备注',
      showOverflowTooltip: true,
      searchable: false,
      searchType: 'input',
    },
  ]

}
// 懒导出：模块顶层不执行请求，进入页面调用 columns() 时才发请求（避免打包后未登录即触发 401）
export const columns = createRichColumns
// 新增弹框明细字段
export const matlTableJson = [
  {
    field: 'matlCode',
    title: '物资编码',
    showOverflowTooltip: true,
    searchable: false,

  },
  {
    field: 'matlName',
    title: '物资名称',
    showOverflowTooltip: true,
    searchable: false,

  },
  {
    field: 'matlType',
    title: '规格型号/材质/图号',
    showOverflowTooltip: true,
    searchable: false,

  },
  {
    field: 'matlUnit',
    title: '计量单位',
    showOverflowTooltip: true,
    searchable: false,

  },
  {
    field: 'batchNo',
    title: '批次号',
    showOverflowTooltip: true,
    searchable: false,

  },
  {
    field: 'productionDate',
    title: '生产日期',
    showOverflowTooltip: true,
    searchable: false,

  },
  {
    field: 'validityPeriod',
    title: '有效期',
    showOverflowTooltip: true,
    searchable: false,

  },
  {
    field: 'validityPeriodUnit',
    title: '有效期单位',
    showOverflowTooltip: true,
    searchable: false,

  },
  {
    field: 'expirationDate',
    title: '到期日期',
    showOverflowTooltip: true,
    searchable: false,

  },
  {
    field: 'cardPrice',
    title: '库存单价（元）',
    showOverflowTooltip: true,
    searchable: false,
    render: (row) => row.cardPrice != null && row.cardPrice !== '' ? Number(row.cardPrice).toFixed(2) : '',
  },
  {
    field: 'prNum',
    title: '调整前数量',
    showOverflowTooltip: true,
    searchable: false,
    render: (row) => row.prNum != null && row.prNum !== '' ? Number(row.prNum).toFixed(4) : '',
  },
  {
    field: 'prAmount',
    title: '调整前金额',
    showOverflowTooltip: true,
    searchable: false,
    render: (row) => row.prAmount != null && row.prAmount !== '' ? Number(row.prAmount).toFixed(2) : '',
  },
  {
    field: 'ptNum',
    title: '调整后数量',
    showOverflowTooltip: true,
    searchable: false,
    slotName: 'ptNum',
    render: (row) => row.ptNum != null && row.ptNum !== '' ? Number(row.ptNum).toFixed(4) : '',
  },
  {
    field: 'ptAmount',
    title: '调整后金额',
    showOverflowTooltip: true,
    searchable: false,
    render: (row) => row.ptAmount != null && row.ptAmount !== '' ? Number(row.ptAmount).toFixed(2) : '',
  },
  {
    field: 'profitAmount',
    title: '盈亏金额（元）',
    showOverflowTooltip: true,
    searchable: false,
    render: (row) => row.profitAmount != null && row.profitAmount !== '' ? Number(row.profitAmount).toFixed(2) : '',
  },
]

