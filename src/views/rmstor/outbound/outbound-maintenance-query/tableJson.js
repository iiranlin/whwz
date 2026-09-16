import { plantDictList, warehouseDict, warehouseplantDictList, } from '@/api/rmstor/price-adjustment'

// 新增弹框明细字段
export const matlTableJson = [
  { showOverflowTooltip: true, searchable: false, field: 'matlCode', title: '物资编码', width: 160, align: 'center', },
  { showOverflowTooltip: true, searchable: false, field: 'matlName', title: '物资名称', width: 160, align: 'center', },
  { showOverflowTooltip: true, searchable: false, field: 'matlType', title: '规格型号/材质/图号', width: 160, align: 'left', },
  { showOverflowTooltip: true, searchable: false, field: 'matlUnit', title: '计量单位', width: 160, align: 'center', },
  { showOverflowTooltip: true, searchable: false, field: 'credCode', title: '技证号', slotName: 'credCode', width: 160, align: 'center', },
  { showOverflowTooltip: true, searchable: false, field: 'batchNo', title: '批次号', width: 160, align: 'center', },
  { showOverflowTooltip: true, searchable: false, field: 'productionDate', title: '生产日期', width: 160, align: 'center', },
  { showOverflowTooltip: true, searchable: false, field: 'expirationDate', title: '到期日期', width: 160, align: 'center', },
  { showOverflowTooltip: true, searchable: false, field: 'outNum', title: '出库数量', width: 160, align: 'center', },
  { showOverflowTooltip: true, searchable: false, field: 'price', title: '库存单价（元）', width: 160, align: 'right', },
  { showOverflowTooltip: true, searchable: false, field: 'outAmount', title: '出库金额（元）', width: 160, align: 'right', },
  { showOverflowTooltip: true, searchable: false, field: 'noOutNum', title: '未登卡数量', width: 160, align: 'center', },
  { showOverflowTooltip: true, searchable: false, field: 'nowNum', title: '结存数量', width: 160, align: 'center', },
  { showOverflowTooltip: true, searchable: false, field: 'templateName', title: '报账模板', width: 160, align: 'center', },
]
// 打印字段
export const printMatlTableJson = [
  { isShow: true, fixed: false, type: '', key: 'typeIndex', prop: 'typeIndex', label: '序号', align: 'center', width: 50 },
  { isShow: true, fixed: false, type: '', key: 'matlCode', prop: 'matlCode', label: '物资编码', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'matlName', prop: 'matlName', label: '物资名称/规格型号', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'matlUnit', prop: 'matlUnit', label: '单位', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'outNum', prop: 'outNum', label: '数量', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'price', prop: 'price', label: '库存单价', align: 'center', width: 160 },
  { isShow: true, fixed: false, type: '', key: 'outAmount', prop: 'outAmount', label: '金额', align: 'center', width: 160 },
]



// 资源池发料单
export const rmstorMatlTableJson = [
  { showOverflowTooltip: true, searchable: false, field: 'planCode', title: '请领单编号', width: 160, align: 'center', },
  { showOverflowTooltip: true, searchable: false, field: 'plantName', title: '用料地区', width: 160, align: 'center', },
  { showOverflowTooltip: true, searchable: false, field: 'depotName', title: '仓库', width: 160, align: 'center', },
  { showOverflowTooltip: true, searchable: false, field: 'partitionName', title: '仓库分区', width: 160, align: 'center', },
  { showOverflowTooltip: true, searchable: false, field: 'deptName', title: '请领车间', width: 160, align: 'center', },
  { showOverflowTooltip: true, searchable: false, field: 'teamName', title: '请领班组', width: 160, align: 'center', },
  { showOverflowTooltip: true, searchable: false, field: 'pickmatlName', title: '请领人', width: 160  ,align: 'center',},
  { showOverflowTooltip: true, searchable: false, field: 'natureValueName', title: '成本预算项目', width: 160, align: 'center', },
  { showOverflowTooltip: true, searchable: false, field: 'matlCode', title: '物资编码', width: 160, align: 'center', },
  { showOverflowTooltip: true, searchable: false, field: 'matlName', title: '物资名称', width: 160, align: 'center', },
  { showOverflowTooltip: true, searchable: false, field: 'matlType', title: '规格型号/材质/图号', width: 160, align: 'left', },
  { showOverflowTooltip: true, searchable: false, field: 'matlUnit', title: '计量单位', width: 160, align: 'center', },
  { showOverflowTooltip: true, searchable: false, field: 'carType', title: '车型', width: 160, align: 'center', },
  { showOverflowTooltip: true, searchable: false, field: 'trainNo', title: '车号', width: 160, align: 'center', },
  { showOverflowTooltip: true, searchable: false, field: 'outNum', title: '领料数量', width: 160, align: 'center', },
  { showOverflowTooltip: true, searchable: false, field: 'completeNum', title: '完成数量', width: 160, align: 'center', },
  { showOverflowTooltip: true, searchable: false, field: 'templateName', title: '报账模板', width: 160, align: 'center', },
  { showOverflowTooltip: true, searchable: false, field: 'bizStatus', title: '引用状态', width: 160, align: 'center', },
]

// 生产系统领用料申请单
export const rmstorProduceTableJson = [
  { showOverflowTooltip: true, searchable: false, field: 'planCode', title: '请领单编号', width: 160, align: 'center', },
  { showOverflowTooltip: true, searchable: false, field: 'plantName', title: '用料地区', width: 160, align: 'center', },
  { showOverflowTooltip: true, searchable: false, field: 'depotName', title: '仓库', width: 160, align: 'center', },
  { showOverflowTooltip: true, searchable: false, field: 'partitionName', title: '仓库分区', width: 160, align: 'center', },
  { showOverflowTooltip: true, searchable: false, field: 'deptName', title: '请领车间', width: 160, align: 'center', },
  { showOverflowTooltip: true, searchable: false, field: 'teamName', title: '请领班组', width: 160, align: 'center', },
  { showOverflowTooltip: true, searchable: false, field: 'pickmatlName', title: '请领人', width: 160, align: 'center', },
  { showOverflowTooltip: true, searchable: false, field: 'natureValueName', title: '成本预算项目', width: 160, align: 'center', },
  { showOverflowTooltip: true, searchable: false, field: 'matlCode', title: '物资编码', width: 160, align: 'center', },
  { showOverflowTooltip: true, searchable: false, field: 'matlName', title: '物资名称', width: 160, align: 'center', },
  { showOverflowTooltip: true, searchable: false, field: 'matlType', title: '规格型号/材质/图号', width: 160, align: 'center', },
  { showOverflowTooltip: true, searchable: false, field: 'matlUnit', title: '计量单位', width: 160, align: 'center', },
  { showOverflowTooltip: true, searchable: false, field: 'carType', title: '车型', width: 160, align: 'center', },
  { showOverflowTooltip: true, searchable: false, field: 'trainNo', title: '车号', width: 160, align: 'center', },
  { showOverflowTooltip: true, searchable: false, field: 'outNum', title: '领料数量', width: 160, align: 'center', },
  { showOverflowTooltip: true, searchable: false, field: 'nowNum', title: '库存数量', width: 160, align: 'center', },
  { showOverflowTooltip: true, searchable: false, field: 'templateName', title: '报账模板', width: 160, align: 'center', },
]
//红冲
export const rmstorRedReversalTableJson = [
  { showOverflowTooltip: true, searchable: false, field: 'matlCode', title: '物资编码', width: 160 , align: 'center',},
  { showOverflowTooltip: true, searchable: false, field: 'matlName', title: '物资名称', width: 160, align: 'center', },
  { showOverflowTooltip: true, searchable: false, field: 'matlType', title: '规格型号/材质/图号', width: 160 , align: 'left',},
  { showOverflowTooltip: true, searchable: false, field: 'matlUnit', title: '计量单位', width: 160 , align: 'center',},
  { showOverflowTooltip: true, searchable: false, field: 'cardPrice', title: '技证号', width: 160 , align: 'center',},
  { showOverflowTooltip: true, searchable: false, field: 'batchNo', title: '批次号', width: 160 , align: 'center',},
  { showOverflowTooltip: true, searchable: false, field: 'productionDate', title: '生产日期', width: 160, align: 'center', },
  { showOverflowTooltip: true, searchable: false, field: 'expirationDate', title: '到期日期', width: 160 , align: 'center',},
  { showOverflowTooltip: true, searchable: false, field: 'outNum', title: '出库数量', width: 160 , align: 'center',},
  { showOverflowTooltip: true, searchable: false, field: 'redNum', title: '红冲数量', slotName: 'redNum', width: 160 , align: 'center',},
  { showOverflowTooltip: true, searchable: false, field: 'price', title: '库存单价（元）', width: 160 , align: 'right',},
  { showOverflowTooltip: true, searchable: false, field: 'outAmount', title: '出库金额（元）', width: 160 , align: 'right',},
  { showOverflowTooltip: true, searchable: false, field: 'redAmount', title: '红冲金额（元）', slotName: 'redAmount', width: 160 , align: 'right',},
  { showOverflowTooltip: true, searchable: false, field: 'nowNum', title: '结存数量', width: 160 , align: 'center',},
  { showOverflowTooltip: true, searchable: false, field: 'templateName', title: '报账模板', width: 160 , align: 'center',},
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
        { label: '未登卡', value: '0' },
        { label: '已登卡', value: '2' },
      ],
      width: 160,
      align: 'center',
    },
    {
      field: 'obCode',
      title: '出库单号',
      showOverflowTooltip: true,
      searchable: true,
      searchType: 'input',
      type: 'link',
      width: 160,
      align: 'center',
    },
    {
      field: 'planCode',
      title: '请领单编号',
      showOverflowTooltip: true,
      searchType: 'input',
      searchable: true,
      width: 160,
      align: 'center',
    },
    {
      field: 'deptName',
      title: '请领车间',
      showOverflowTooltip: true,
      searchable: true,
      searchType: 'input',
      width: 160,
      align: 'center',
    },
    {
      field: 'teamName',
      title: '请领班组',
      showOverflowTooltip: true,
      searchable: true,
      searchType: 'input',
      width: 160,
      align: 'center',
    },
    {
      field: "plantName",
      title: "用料地区",
      showOverflowTooltip: true,
      width: 160,
      align: 'center',
    },
    {
      field: "depotName",
      title: "仓库",
      showOverflowTooltip: true,
      width: 160,
      align: 'center',
    },
    {
      field: "partitionName",
      title: "仓库分区",
      showOverflowTooltip: true,
      width: 160,
      align: 'center',
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
      width: 160,
      align: 'center',
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
      field: 'pickmatlName',
      title: '请领人',
      showOverflowTooltip: true,
      searchable: true,
      searchType: 'input',
      width: 160,
      align: 'center',
    },

    {
      field: 'natureValueName',
      title: '成本预算项目',
      showOverflowTooltip: true,
      width: 160,
      align: 'center',
    },

    {
      field: 'carType',
      title: '车型',
      showOverflowTooltip: true,
      width: 160,
      align: 'center',
    },

    {
      field: 'trainsetName',
      title: '车组号',
      showOverflowTooltip: true,
      width: 160,
      align: 'center',
    },
    {
      field: 'trainNo',
      title: '车号',
      showOverflowTooltip: true,
      width: 160,
      align: 'center',
    },
    {
      field: 'templateName',
      title: '报账模板',
      showOverflowTooltip: true,
      width: 160,
      align: 'center',
    },
    {
      field: 'orderDateStr',
      title: '下单日期',
      showOverflowTooltip: true,
      width: 160,
      align: 'center',
    },
    {
      field: 'noteDateStr',
      title: '登卡日期',
      showOverflowTooltip: true,
      width: 160,
      align: 'center',
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
    {
      field: 'amount',
      title: '单据总金额（元）',
      showOverflowTooltip: true,
      searchable: false,
      searchType: 'input',
      width: 160,
      align: 'right',
    },
  ]

}
export const columns = createRichColumns()


