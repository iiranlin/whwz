import { plantDictList, warehouseDict } from '@/api/reserve-quote/materiel-maintenance'


export const tableJson = [
  { isShow: true, fixed: false, type: 'slot', key: 'plantName', prop: 'plantName', label: '地区', align: 'center' },
  { isShow: true, fixed: false, type: 'slot', key: 'depotName', prop: 'depotName', label: '仓库', align: 'center', },
  { isShow: true, fixed: false, type: '', key: 'matlCode', prop: 'matlCode', label: '物资编码', align: 'center' },
  { isShow: true, fixed: false, type: '', key: 'matlName', prop: 'matlName', label: '物资名称', align: 'center', },
  { isShow: true, fixed: false, type: '', key: 'matlType', prop: 'matlType', label: '规格型号', align: 'center', },
  { isShow: true, fixed: false, type: '', key: 'matlUnit', prop: 'matlUnit', label: '计量单位', align: 'center', },
  { isShow: true, fixed: false, type: '', key: 'matlRaw', prop: 'matlRaw', label: '材质', align: 'center', },
  { isShow: true, fixed: false, type: '', key: 'matlpCode', prop: 'matlpCode', label: '图号', align: 'center', },
  { isShow: true, fixed: false, type: '', key: 'nowNum', prop: 'nowNum', label: '库存数量', align: 'center', },
  { isShow: true, fixed: false, type: '', key: 'highNum', prop: 'highNum', label: '高储', align: 'center', },
  { isShow: true, fixed: false, type: '', key: 'lowNum', prop: 'lowNum', label: '低储', align: 'center', },
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
      field: "plantName",
      title: "地区",
      minWidth: 160,
    },
    {
      field: "depotName",
      title: "仓库",
      minWidth: 160,
    },
    {
      field: "plantCode",
      title: "地区",
      minWidth: 160,
      hideInTable: true,
      searchable: true,
      searchType: 'select',
      searchProps: {
        options: plantArr,
        clearable: true,
      },
    },
    {
      field: "depotCode",
      title: "仓库",
      minWidth: 160,
      hideInTable: true,
      searchable: true,
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
      field: 'matlRaw',
      title: '材质',
      showOverflowTooltip: true,
      searchable: false,
      searchType: 'input',
    },
    {
      field: 'matlpCode',
      title: '图号',
      showOverflowTooltip: true,
      searchable: true,
      searchType: 'input',
    },
    {
      field: 'nowNum',
      title: '库存数量',
      showOverflowTooltip: true,
      searchable: false,
      searchType: 'input',
    },
    {
      field: 'highNum',
      title: '高储',
      showOverflowTooltip: true,
      searchable: false,
      searchType: 'input',
    },
    {
      field: 'lowNum',
      title: '低储',
      showOverflowTooltip: true,
      searchable: false,
      searchType: 'input',
    },
    {
      field: 'warningHighNum',
      title: '是否高于高储',
      width: 140,
      searchable: true,
      searchType: 'radio',
      searchProps: {
        options: [
          { label: '是', value: '1' },
          { label: '否', value: '0' },
        ],
      },
    },
    {
      field: 'warningLowNum',
      title: '是否低于低储',
      width: 140,
      searchable: true,
      searchType: 'radio',
      searchProps: {
        options: [
          { label: '是', value: '1' },
          { label: '否', value: '0' },
        ],
      },
    },


  ]
}
// 懒导出：模块顶层不执行请求，进入页面调用 columns() 时才发请求（避免打包后未登录即触发 401）
export const columns = createRichColumns