import { plantDictListAll } from '@/api/warehouse/plantDict'
import { warehouseDictListAll } from '@/api/warehouse/warehouseDict'
import { partitionListAll } from '@/api/warehouse/partition'

const plantData = async () => {
  const res = await plantDictListAll()
  return res.data.map(item => {
    return {...item, label: item.plantName, value: item.plantCode}
  })
}
const columnsData = async () => {
  const plantArr = await plantData()
  let whArr = []
  return [
    {
      field: "userCode",
      title: "职工编码",
      minWidth: 160,
      align: "center",
    },
    {
      field: "userName",
      title: "职工姓名",
      minWidth: 160,
      searchable: true,
      searchType: "input",
    },
    {
      field: "plantName",
      title: "用料地区",
      minWidth: 160,
    },
    {
      field: "plantCode",
      title: "用料地区",
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
      field: "whName",
      title: "仓库名称",
      minWidth: 160,
    },
    {
      field: "whCode",
      title: "仓库",
      minWidth: 160,
      hideInTable: true,
      searchable: true,
      searchType: 'select',
      searchProps: { options: [], clearable: true },
      dependsOn: ['plantCode'],
      async onDependencyChange({form, changedField, setFieldValue, setFieldProps}) {
        if (changedField !== 'plantCode') return
        setFieldValue('whCode', undefined)
        setFieldProps('whCode', { options: [] })
        if(!form.plantCode) return
        const plantCodeObj = plantArr.find(a => a.plantCode === form.plantCode)
        if(!plantCodeObj) return
        try {
          const res = await warehouseDictListAll({plantId: plantCodeObj.id})
          whArr = (res.data || []).map(r => {
            return {...r, label: r.whName, value: r.whCode}
          })
          setFieldProps('whCode', { options: whArr })
        } catch (e) {
          // 接口异常仅清空选项，不冒泡导致整页崩溃
        }
      },
    },
    {
      field: "partitionName",
      title: "仓库分区",
      minWidth: 140,
    },
    {
      field: "partitionCode",
      title: "仓库分区",
      minWidth: 160,
      hideInTable: true,
      searchable: true,
      searchType: 'select',
      searchProps: { options: [], clearable: true },
      dependsOn: ['plantCode','whCode'],
      async onDependencyChange({form, changedField, setFieldValue, setFieldProps}) {
        if (changedField !== 'whCode' && changedField !== 'plantCode') return
        setFieldValue('partitionCode', undefined)
        setFieldProps('partitionCode', { options: [] })
        if(!form.whCode) return
        const whCodeObj = whArr.find(a => a.whCode === form.whCode)
        if(!whCodeObj) return
        try {
          const res = await partitionListAll({whId: whCodeObj.id})
          const options = (res.data || []).map(r => {
            return {...r, label: r.partitionName, value: r.partitionCode}
          })
          setFieldProps('partitionCode', { options })
        } catch (e) {
          // 接口异常仅清空选项，不冒泡导致整页崩溃
        }
      },
    },
    {
      field: "firMatlcode",
      title: "开始物资编码",
      minWidth: 140,
    },
    {
      field: "endMatlcode",
      title: "结束物资编码",
      minWidth: 140,
    }
  ];
}

// 懒导出：模块顶层不执行请求，进入页面调用 columns() 时才发请求（避免打包后未登录即触发 401）
export const columns = columnsData

export const toolbarConfig = {
  buttons: [
    {code: 'create', name: '新增', type: 'primary'},
    {code: 'modify', name: '修改', showInTop: false, showInRow: true},
    {code: 'delete', name: '删除', type: 'primary'},
  ]
}