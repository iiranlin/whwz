
import { plantDictList, warehouseDict } from '@/api/reserve-quote/section'

export const tableJson = [
  { isShow: true, fixed: false, type: '', key: 'year', prop: 'year', label: '年度', align: 'center' },
  { isShow: true, fixed: false, type: '', key: 'plantCode', prop: 'plantCode', label: '地区编号', align: 'center' },
  { isShow: true, fixed: false, type: '', key: 'plantName', prop: 'plantName', label: '地区名称', align: 'center', },
  { isShow: true, fixed: false, type: '', key: 'depotCode', prop: 'depotCode', label: '仓库编号', align: 'center' },
  { isShow: true, fixed: false, type: '', key: 'depotName', prop: 'depotName', label: '仓库名称', align: 'center', },
  { isShow: true, fixed: false, type: 'slot', key: 'rationAmount', prop: 'rationAmount', label: '定额（元）', align: 'center', },
  { isShow: true, fixed: false, type: 'slot', key: 'nowAmount', prop: 'nowAmount', label: '库存总金额（元）', align: 'center', },

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
      field: 'year',
      title: '年份',
      searchable: true,
      searchType: 'date',
      searchProps: { type: 'year', valueFormat: 'YYYY' },
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
      field: 'plantCode',
      title: '地区编号',
      showOverflowTooltip: true,
      searchable: false,
    },
    {
      field: 'plantName',
      title: '地区名称',
      showOverflowTooltip: true,
      searchable: false,
    },
    {
      field: 'depotCode',
      title: '仓库编号',
      showOverflowTooltip: true,
      searchable: false,
      searchType: 'input',
    },
    {
      field: 'depotName',
      title: '仓库名称',
      showOverflowTooltip: true,
      searchable: false,
      searchType: 'input',
    },
    {
      field: 'rationAmount',
      title: '定额（元）',
      showOverflowTooltip: true,
      searchable: false,
      searchType: 'input',
    },
    {
      field: 'nowAmount',
      title: '库存总金额（元）',
      showOverflowTooltip: true,
      searchable: false,
      searchType: 'input',
    },
    {
      field: 'isExceedRation',
      title: '超定额：',
      showOverflowTooltip: true,
      searchable: true,
      hideInTable: true,
      searchType: 'select',
      options: [
        { value: '1', label: '是' },
        { value: '0', label: '否' }
      ],
    },
  ]
}
// 懒导出：模块顶层不执行请求，进入页面调用 columns() 时才发请求（避免打包后未登录即触发 401）
export const columns = createRichColumns