import { selectPlantDict } from '@/api/warehouse/plantDict'
import { deptTree } from '@/api/base/dept'
import { acceptanceLevelArr } from '@/utils/dictionary'

// 拍平部门树 → [{ label, value, ... }]
function flattenDeptTree(nodes = [], result = []) {
  nodes.forEach(node => {
    result.push({ label: node.deptName, value: node.deptCode, ...node })
    if (node.children && node.children.length) {
      flattenDeptTree(node.children, result)
    }
  })
  return result
}

const getDeptList = async () => {
  try {
    const { data } = await deptTree()
    return flattenDeptTree(data || [])
  } catch (e) {
    console.warn('deptTree 接口调用失败:', e)
    return []
  }
}

const plantData = async () => {
  try {
    const res = await selectPlantDict()
    return (res.data || []).map(item => {
      return {...item, label: item.plantName, value: item.plantCode}
    })
  } catch (e) {
    console.warn('selectPlantDict 接口调用失败:', e)
    return []
  }
}

export const columns = async () => {
  const deptArr = await getDeptList()
  const plantArr = await plantData()
  return {
    plantArr,
    columnsArr: [
      {
        field: "spdCode",
        title: "采购订单号",
        minWidth: 220,
        align: "center",
        searchable: true,
        searchType: "input",
        searchSort: 0
      },
      {
        field: "scontCode",
        title: "合同号",
        minWidth: 180,
        align: "center",
      },
      {
        field: "supplierName",
        title: "供应商",
        minWidth: 180,
        searchable: true,
        searchType: "input",
        searchSort: 1
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
        searchSort: 5
      },
      {
        field: "apunitCode",
        title: "申请单位",
        minWidth: 140,
        hideInTable: true,
        searchable: true,
        searchType: 'select',
        searchProps: {
          options: deptArr,
          clearable: true,
          filterable: true,
        },
        searchSort: 4
      },
      {
        field: "apunitName",
        title: "申请单位",
        minWidth: 140,
      },
      {
        field: "purcType",
        title: "采购方式",
        minWidth: 140,
      },
      {
        field: "matlCode",
        title: "物资编码",
        minWidth: 160,
        align: "center",
        searchable: true,
        searchType: "input",
        searchSort: 2
      },
      {
        field: "matlName",
        title: "物资名称",
        minWidth: 160,
        searchable: true,
        searchType: "input",
        searchSort: 3
      },
      {
        field: "matlTypeSlot",
        title: "规格型号/材质/图号",
        minWidth: 160,
        slotName: "matlTypeSlot",
      },
      {
        field: "matlUnit",
        title: "计量单位",
        minWidth: 160,
        align: "center",
      },
      {
        field: "madeBrand",
        title: "产地/品牌",
        minWidth: 160,
      },
      {
        field: "contPrice",
        title: "单价",
        minWidth: 160,
        type: 'number'
      },
      {
        field: "purAmount",
        title: "采购金额",
        minWidth: 160,
        type: 'number'
      },
      {
        field: "bmName",
        title: "制单人",
        minWidth: 160,
      },
      {
        field: "makerDate",
        title: "制单日期",
        minWidth: 160,
        type: 'date'
      },
      {
        field: "unitName",
        title: "操作单位",
        minWidth: 160,
      },
      {
        field: "userName",
        title: "操作人",
        minWidth: 160,
      },
      {
        field: "batchNo",
        title: "发货批次号",
        minWidth: 160,
        align: "center",
      },
      {
        field: "deliverNum",
        title: "发货数量",
        minWidth: 160,
        type: 'number'
      },
      {
        field: "arrivalNum",
        title: "到货确认数量",
        minWidth: 160,
        type: 'number'
      },
      {
        field: "acceptanceNum",
        title: "验收通过数量",
        minWidth: 160,
        type: 'number'
      },
      {
        field: "acceptanceCount",
        title: "验收次数",
        minWidth: 160,
        type: 'number'
      },
      {
        field: "deliverDate",
        title: "发货日期",
        minWidth: 160,
        type: 'date',
        searchable: true,
        searchType: 'dateRange',
        searchSort: 8
      },
      {
        field: "acceptanceLevel",
        title: "验收级别",
        minWidth: 100,
        type: "dict",
        hideInTable: true,
        searchable: true,
        searchType: "select",
        requestOptions: async () => acceptanceLevelArr,
        optionsCacheKey: "acceptance-record-maintain:acceptanceLevel",
        searchSort: 9
      },
      {
        field: "acceptanceFlag",
        title: "验收状态",
        minWidth: 160,
        type: 'dict',
        dict: {'5': '退货', '7': '换货'},
        searchable: true,
        searchType: 'select',
        searchProps: {
          options: [
            { label: '正常', value: '0' },
            { label: '退货', value: '5' },
            { label: '换货', value: '7' },
          ],
        },
        searchSort: 6,
        slotName: 'acceptanceFlag'
      },
      {
        field: 'deliverNumNeAcceptanceNum',
        title: '',
        hideInTable: true,
        searchable: true,
        searchType: 'checkbox',
        searchProps: {
          options: [
            {
              label: '发货数量与验收数量不一致',
              value: '1',
            },
          ],
        },
        searchSort: 7
      },
      {
        field: "slotCheck",
        title: "验收记录",
        minWidth: 90,
        align: "center",
        slotName: 'slotCheck',
        fixed: 'right'
      },
    ]
  }
}

export const toolbarConfig = {
  buttons: [
    { code: 'export', name: '导出', type: 'primary' },
  ]
}