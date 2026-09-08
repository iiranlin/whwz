import { plantDictList, warehouseDict, warehouseplantDictList, } from '@/api/rmstor/price-adjustment'


export const auditFlagObj = { '0': '未登卡', '2': '已登卡' }
export const tableJson = [
  { isShow: true, fixed: false, type: 'dict', key: 'flag', prop: 'flag', label: '状态', align: 'center', width: 120, stats: auditFlagObj },
  { isShow: true, fixed: false, type: 'link', key: 'obCode', prop: 'obCode', label: '出库单号', align: 'center', width: 220 },
  { isShow: true, fixed: false, type: '', key: 'planCode', prop: 'planCode', label: '请领单编号', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'plantName', prop: 'plantName', label: '用料地区', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'depotName', prop: 'depotName', label: '仓库', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'partitionName', prop: 'partitionName', label: '仓库分区', align: 'center', width: 160, },
  { isShow: true, fixed: false, type: '', key: 'taxFlagName', prop: 'taxFlagName', label: '应税用途', align: 'center', width: 160, },
  { isShow: true, fixed: false, type: '', key: 'deptName', prop: 'deptName', label: '请领车间', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'teamName', prop: 'teamName', label: '请领班组', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'pickmatlName', prop: 'pickmatlName', label: '请领人', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'natureValueName', prop: 'natureValueName', label: '成本预算项目', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'carType', prop: 'carType', label: '车型', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'trainsetName', prop: 'trainsetName', label: '车组号', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'trainNo', prop: 'trainNo', label: '车号', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'templateName', prop: 'templateName', label: '报账模板', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: 'date', key: 'orderDateStr', prop: 'orderDateStr', label: '下单日期', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: 'date', key: 'noteDateStr', prop: 'noteDateStr', label: '登卡日期', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'amount', prop: 'amount', label: '单据总金额（元）', align: 'center', width: 160 },
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
  { isShow: true, fixed: false, type: '', key: 'matlCode', prop: 'matlCode', label: '物资编号', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'matlName', prop: 'matlName', label: '物资名称', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'matlType', prop: 'matlType', label: '规格型号/材质/图号', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'matlUnit', prop: 'matlUnit', label: '计量单位', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: 'slot', key: 'credCode', prop: 'credCode', label: '技证号', align: 'center', width: 160, },
  { isShow: true, fixed: false, type: '', key: 'batchNo', prop: 'batchNo', label: '批次号', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: 'date', key: 'productionDate', prop: 'productionDate', label: '生产日期', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: 'date', key: 'expirationDate', prop: 'expirationDate', label: '到期日期', align: 'center', width: 160, },
  { isShow: true, fixed: false, type: 'slot', key: 'outNum', prop: 'outNum', label: '出库数量', align: 'center', width: 160, required: true, formatter: (val) => val != null ? Number(val).toFixed(4) : '' },
  { isShow: true, fixed: false, type: '', key: 'price', prop: 'price', label: '库存单价（元）', align: 'center', width: 160, formatter: (val) => val != null ? Number(val).toFixed(2) : '' },
  { isShow: true, fixed: false, type: '', key: 'outAmount', prop: 'outAmount', label: '出库金额（元）', align: 'center', width: 160, formatter: (val) => val != null ? Number(val).toFixed(2) : '' },
  { isShow: true, fixed: false, type: '', key: 'noOutNum', prop: 'noOutNum', label: '未登卡数量', align: 'center', width: 160, formatter: (val) => val != null ? Number(val).toFixed(4) : '' },
  { isShow: true, fixed: false, type: '', key: 'nowNum', prop: 'nowNum', label: '结存数量', align: 'center', width: 160, formatter: (val) => val != null ? Number(val).toFixed(4) : '' },
  // { isShow: true, fixed: false, type: '', key: 'templateName', prop: 'templateName', label: '报账模板', align: 'center', width: 160 },
]

export const matlTableButtonJson = [
  // { code: 'choiceMatl', name: '添加物资' },
  { code: 'delete', name: '删除', type: 'inline' },
]

// 打印字段
export const printMatlTableJson = [
  { isShow: true, fixed: false, type: '', key: 'typeIndex', prop: 'typeIndex', label: '序号', align: 'center', width: 50 },
  { isShow: true, fixed: false, type: '', key: 'matlCode', prop: 'matlCode', label: '物资编号', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'matlName', prop: 'matlName', label: '物资名称/规格型号', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'matlUnit', prop: 'matlUnit', label: '单位', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'outNum', prop: 'outNum', label: '数量', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'price', prop: 'price', label: '库存单价', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'outAmount', prop: 'outAmount', label: '金额', align: 'center', width: 160 },
]



// 资源池发料单
export const rmstorMatlTableJson = [
  { isShow: true, fixed: false, type: '', key: 'planCode', prop: 'planCode', label: '请领单编号', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'plantName', prop: 'plantName', label: '用料地区', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'depotName', prop: 'depotName', label: '仓库', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'partitionName', prop: 'partitionName', label: '仓库分区', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'deptName', prop: 'deptName', label: '请领车间', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'teamName', prop: 'teamName', label: '请领班组', align: 'center', width: 160, },
  { isShow: true, fixed: false, type: '', key: 'pickmatlName', prop: 'pickmatlName', label: '请领人', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'natureValueName', prop: 'natureValueName', label: '成本预算项目', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'matlCode', prop: 'matlCode', label: '物资编号', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'matlName', prop: 'matlName', label: '物资名称', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'matlType', prop: 'matlType', label: '规格型号/材质/图号', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'matlUnit', prop: 'matlUnit', label: '计量单位', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'carType', prop: 'carType', label: '车型', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'trainNo', prop: 'trainNo', label: '车号', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'outNum', prop: 'outNum', label: '领料数量', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'completeNum', prop: 'completeNum', label: '完成数量', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'templateName', prop: 'templateName', label: '报账模板', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'bizStatus', prop: 'bizStatus', label: '引用状态', align: 'center', width: 160 },
]

// 生产系统领用料申请单
export const rmstorProduceTableJson = [
  { isShow: true, fixed: false, type: '', key: 'planCode', prop: 'planCode', label: '请领单编号', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'plantName', prop: 'plantName', label: '用料地区', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'depotName', prop: 'depotName', label: '仓库', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'partitionName', prop: 'partitionName', label: '仓库分区', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'deptName', prop: 'deptName', label: '请领车间', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'teamName', prop: 'teamName', label: '请领班组', align: 'center', width: 160, },
  { isShow: true, fixed: false, type: '', key: 'pickmatlName', prop: 'pickmatlName', label: '请领人', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'natureValueName', prop: 'natureValueName', label: '成本预算项目', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'matlCode', prop: 'matlCode', label: '物资编号', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'matlName', prop: 'matlName', label: '物资名称', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'matlType', prop: 'matlType', label: '规格型号/材质/图号', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'matlUnit', prop: 'matlUnit', label: '计量单位', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'carType', prop: 'carType', label: '车型', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'trainNo', prop: 'trainNo', label: '车号', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'outNum', prop: 'outNum', label: '领料数量', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'nowNum', prop: 'nowNum', label: '库存数量', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'templateName', prop: 'templateName', label: '报账模板', align: 'center', width: 160 },
]
//红冲
export const rmstorRedReversalTableJson = [
  { isShow: true, fixed: false, type: '', key: 'matlCode', prop: 'matlCode', label: '物资编号', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'matlName', prop: 'matlName', label: '物资名称', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'matlType', prop: 'matlType', label: '规格型号/材质/图号', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'matlUnit', prop: 'matlUnit', label: '计量单位', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'cardPrice', prop: 'cardPrice', label: '技证号', align: 'center', width: 160, },
  { isShow: true, fixed: false, type: '', key: 'batchNo', prop: 'batchNo', label: '批次号', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: 'date', key: 'productionDate', prop: 'productionDate', label: '生产日期', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: 'date', key: 'expirationDate', prop: 'expirationDate', label: '到期日期', align: 'center', width: 160, },
  { isShow: true, fixed: false, type: '', key: 'outNum', prop: 'outNum', label: '出库数量', align: 'center', width: 160, },
  { isShow: true, fixed: false, type: 'slot', key: 'redNum', prop: 'redNum', label: '红冲数量', align: 'center', width: 160, },
  { isShow: true, fixed: false, type: '', key: 'price', prop: 'price', label: '库存单价（元）', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'outAmount', prop: 'outAmount', label: '出库金额（元）', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: 'slot', key: 'redAmount', prop: 'redAmount', label: '红冲金额（元）', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'nowNum', prop: 'nowNum', label: '结存数量', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'templateName', prop: 'templateName', label: '报账模板', align: 'center', width: 160 },
]


const plantData = async () => {
  try {
    await plantDictList().then(res => {
    if (res.code === 200) {
      return res.data.map(item => {
        return { ...item, label: item.plantName, value: item.plantCode }
      })
    } else {
      return []
    }
  }) 
  } catch (error) {
    return []
  }
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
        { label: '未登卡', value: '0' },
        { label: '已登卡', value: '2' },
      ],
    },
    {
      field: 'obCode',
      title: '出库单号',
      showOverflowTooltip: true,
      searchable: true,
      searchType: 'input',
      type: 'link',
    },
    // {
    //   field: 'planCode',
    //   title: '请领单编号',
    //   showOverflowTooltip: true,
    //   searchType: 'input',
    //   searchable: true,
    // },
    // {
    //   field: 'deptName',
    //   title: '请领车间',
    //   showOverflowTooltip: true,
    //   searchable: true,
    //   searchType: 'input',
    // },
    // {
    //   field: 'teamName',
    //   title: '请领班组',
    //   showOverflowTooltip: true,
    //   searchable: true,
    //   searchType: 'input',
    // },
    {
      field: 'deptName',
      title: '领料部门',
      showOverflowTooltip: true,
      searchable: true,
      searchType: 'input',
      hideInTable: true,
    },
    {
      field: 'pickmatlName',
      title: '领料人',
      showOverflowTooltip: true,
      searchable: true,
      searchType: 'input',
      hideInTable: true,
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
      align: 'center',
    },
    {
      field: 'deptName',
      title: '领料部门',
      showOverflowTooltip: true,
      align: 'center',
    },
    {
      field: 'receiveName',
      title: '收料人',
      showOverflowTooltip: true,
      align: 'center',
    },
    {
      field: 'idsCode',
      title: '单台设备',
      showOverflowTooltip: true,
      searchable: true,
      searchType: 'input',
      align: 'center',
    },
    {
      field: 'iddCode',
      title: '设备部件',
      showOverflowTooltip: true,
      align: 'center',
    },
    {
      field: 'matlCode',
      title: '物资编号',
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
    // {
    //   field: 'pickmatlName',
    //   title: '请领人',
    //   showOverflowTooltip: true,
    //   searchable: true,
    //   searchType: 'input',
    // },

    // {
    //   field: 'natureValueName',
    //   title: '成本预算项目',
    //   showOverflowTooltip: true,
    // },

    // {
    //   field: 'carType',
    //   title: '车型',
    //   showOverflowTooltip: true,
    // },

    // {
    //   field: 'trainsetName',
    //   title: '车组号',
    //   showOverflowTooltip: true,
    // },
    // {
    //   field: 'trainNo',
    //   title: '车号',
    //   showOverflowTooltip: true,
    // },
    // {
    //   field: 'templateName',
    //   title: '报账模板',
    //   showOverflowTooltip: true,
    // },
    {
      field: 'orderDateStr',
      title: '下单日期',
      showOverflowTooltip: true,
      align: 'center',
    },
    {
      field: 'noteDateStr',
      title: '登卡日期',
      showOverflowTooltip: true,
      align: 'center',
    },
    {
      field: 'orderDate',
      title: '下单日期',
      showOverflowTooltip: true,
      hideInTable: true,
      type: 'date',
      dateFormat: 'YYYY-MM-DD',
      searchable: false,
      searchType: 'dateRange',
      align: 'center',
    },
    {
      field: 'amount',
      title: '单据总金额（元）',
      showOverflowTooltip: true,
      searchable: false,
      searchType: 'input',
      minWidth: 140,
      align: 'center',
    },
  ]

}
// 懒导出：模块顶层不执行请求，进入页面调用 columns() 时才发请求（避免打包后未登录即触发 401）
export const columns = createRichColumns


