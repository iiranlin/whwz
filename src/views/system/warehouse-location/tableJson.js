import { statusArr, manageRuleObj, positionTypeArr } from '@/utils/dictionary'
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
      title: "仓库",
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
        const res = await warehouseDictListAll({plantId: plantCodeObj.id})
        whArr = res.data.map(r => {
          return {...r, label: r.whName, value: r.whCode}
        })
        setFieldProps('whCode', { options: whArr })
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
        const res = await partitionListAll({whId: whCodeObj.id})
        const options = res.data.map(r => {
          return {...r, label: r.partitionName, value: r.partitionCode}
        })
        setFieldProps('partitionCode', { options })
      },
    },
    {
      field: "frame",
      title: "架",
      minWidth: 140,
      searchable: true,
      searchType: "input",
    },
    {
      field: "layer",
      title: "层",
      minWidth: 140,
      searchable: true,
      searchType: "input",
    },
    {
      field: "position",
      title: "位",
      minWidth: 140,
      searchable: true,
      searchType: "input",
    },
    {
      field: "positionType",
      title: "货位类型",
      minWidth: 140,
      type: "dict",
      requestOptions: async () => positionTypeArr,
      optionsCacheKey: "warehouse-location:positionType",
    },
    {
      field: "status",
      title: "是否有效",
      minWidth: 140,
      type: "dict",
      requestOptions: async () => statusArr,
      optionsCacheKey: "warehouse-location:status",
    },
    {
      field: "isDistribute",
      title: "是否已分配",
      minWidth: 140,
      type: "dict",
      requestOptions: async () => statusArr,
      optionsCacheKey: "warehouse-location:isDistribute",
    },
    {
      field: "comments",
      title: "备注",
      minWidth: 200,
    },
    {
      field: "matlCode",
      title: "物资编码",
      minWidth: 140,
      hideInTable: true,
      searchable: true,
      searchType: "input",
    },
    {
      field: "matlName",
      title: "物资名称",
      minWidth: 140,
      hideInTable: true,
      searchable: true,
      searchType: "input",
    },
    {
      field: "matlType",
      title: "规格型号",
      minWidth: 140,
      hideInTable: true,
      searchable: true,
      searchType: "input",
    }
  ];
}

export const columns = columnsData()

export const toolbarConfig = {
  buttons: [
    {code: 'create', name: '新增', type: 'primary'},
    {code: 'modify', name: '修改', showInTop: false, showInRow: true},
    {code: 'delete', name: '删除', type: 'primary'},
    {code: 'allocateMatl', name: '分配物资', showInTop: false, showInRow: true},
    {code: 'download', name: '下载模板', type: 'primary'},
    {code: 'upload', name: '模板导入', type: 'primary', upload: {multiple: false}},
    {code: 'print', name: '打印', type: 'primary'}
  ]
}

export const allocateMatlTableJson = [
  {
    field: 'matlCode',
    title: '物资编码',
    minWidth: 140,
    align: 'center'
  },
  {
    field: 'matlName',
    title: '仓库名称',
    minWidth: 140,
  },
  {
    field: 'matlType',
    title: '规格型号',
    minWidth: 140,
  },
  {
    field: 'matlUnit',
    title: '计量单位',
    minWidth: 140,
  }
]

export const allocateMatlTableButtonJson = {
  buttons: [
    {code: 'selectMatl', name: '添加物资', type: 'primary'},
    {code: 'delete', name: '删除', type: 'primary', showInTop: false, showInRow: true}
  ]
}


export const selectMatlTableJson = [
  {isShow: true, fixed: false, type: '', key: 'matlCode', prop: 'matlCode', label: '物资编码', align: 'center'},
  {isShow: true, fixed: false, type: '', key: 'matlName', prop: 'matlName', label: '物资名称', align: 'center'},
  {isShow: true, fixed: false, type: '', key: 'matlType', prop: 'matlType', label: '规格型号', align: 'center'},
  {isShow: true, fixed: false, type: '', key: 'matlUnit', prop: 'matlUnit', label: '计量单位', align: 'center'},
  {isShow: true, fixed: false, type: '', key: 'matlRaw', prop: 'matlRaw', label: '材质', align: 'center'},
  {isShow: true, fixed: false, type: '', key: 'matlPcode', prop: 'matlPcode', label: '图号', align: 'center'},
  {isShow: true, fixed: false, type: 'dict', key: 'manageRule', prop: 'manageRule', label: '物资管理权限', align: 'center', stats: manageRuleObj},
]