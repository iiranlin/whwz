import { statusObj, prePayStatusArr } from '@/utils/dictionary'

export const columns = [
  {
    field: "status",
    title: "单据状态",
    minWidth: 100,
    type: "dict",
    dict: prePayStatusArr,
  },
  {
    field: "prePayNo",
    title: "待清算物资明细单号",
    minWidth: 220,
    type: 'link',
    align: "center",
    searchable: true,
    searchType: "input",
  },
  {
    field: "supplierName",
    title: "供应商名称",
    minWidth: 160,
    searchable: true,
    searchType: "input",
  },
  {
    field: "useUnitName",
    title: "用料单位名称",
    minWidth: 160,
    searchable: true,
    searchType: "input",
  },
  {
    field: "sumAmount",
    title: "单据总金额(元)",
    minWidth: 160,
    type: 'number'
  },
  {
    field: "createUserName",
    title: "制单人",
    minWidth: 160,
  },
  {
    field: "createDate",
    title: "制单日期",
    minWidth: 160,
    type: "date",
    searchable: true,
    searchType: "dateRange",
  },
  {
    field: "spdCode",
    title: "采购订单号",
    minWidth: 160,
    type: "date",
    hideInTable: true,
    searchable: true,
    searchType: "input",
  },
  {
    field: "matlCode",
    title: "物资编码",
    minWidth: 160,
    type: "date",
    hideInTable: true,
    searchable: true,
    searchType: "input",
  },
  {
    field: "matlName",
    title: "物资名称",
    minWidth: 160,
    type: "date",
    hideInTable: true,
    searchable: true,
    searchType: "input",
  },
  {
    field: "matlType",
    title: "规格型号",
    minWidth: 160,
    type: "date",
    hideInTable: true,
    searchable: true,
    searchType: "input",
  },
  {
    field: "ibBillCode",
    title: "入库单号",
    minWidth: 160,
    type: "date",
    hideInTable: true,
    searchable: true,
    searchType: "input",
  },
]

export const toolbarConfig = {
  buttons: [
    { code: 'create', name: '新增', type: 'primary' },
    { code: 'modify', name: '编辑', showInTop: false, showInRow: true,
      disabled: (selectedRows) => {
        const {status} = selectedRows[0] || {}
        if(status != '0'){
          return true
        }
        return false
      }
    },
    { code: 'delete', name: '删除', type: 'primary' },
    { code: 'submit', name: '提交', type: 'primary' },
    { code: 'export', name: '导出', type: 'primary' },
  ]
}

// 新增弹框明细字段
export const matlTableJson = [
  {isShow: true, fixed: false, type: '', key: 'spdCode', prop: 'spdCode', label: '采购单号', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'ibBillCode', prop: 'ibBillCode', label: '入库单号', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'scontCode', prop: 'scontCode', label: '合同号', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'plantName', prop: 'plantName', label: '用料地区', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'taxFlagName', prop: 'taxFlagName', label: '应税用途', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'matlCode', prop: 'matlCode', label: '物资编码', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'matlName', prop: 'matlName', label: '物资名称', align: 'center', width: 160},
  {isShow: true, fixed: false, type: 'slot', key: 'matlType', prop: 'matlType', label: '规格型号/材质/图号', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'matlUnit', prop: 'matlUnit', label: '计量单位', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'purNum', prop: 'purNum', label: '采购订单数量', align: 'right', width: 160},
  {isShow: true, fixed: false, type: '', key: 'paNum', prop: 'paNum', label: '入库数量', align: 'right', width: 160},
  {isShow: true, fixed: false, type: '', key: 'taxFlag', prop: 'taxFlag', label: '单价是否含税', align: 'center', width: 160, stats: statusObj},
  {isShow: true, fixed: false, type: '', key: 'stkPrice', prop: 'stkPrice', label: '采购订单单价', align: 'right', width: 160},
  {isShow: true, fixed: false, type: '', key: 'taxRate', prop: 'taxRate', label: '税率', align: 'right', width: 160},
  {isShow: true, fixed: false, type: '', key: 'taxAmount', prop: 'taxAmount', label: '采购金额(含税)(元)', align: 'right', width: 160},
  {isShow: true, fixed: false, type: '', key: 'noTaxAmount', prop: 'noTaxAmount', label: '采购金额(不含税)(元)', align: 'right', width: 160},
  {isShow: true, fixed: false, type: 'slot', key: 'onlyTaxAmount', prop: 'onlyTaxAmount', label: '采购税额(元)', align: 'right', width: 160},
]

// 选择供应商弹框字段
export const supplierTableJson = [
  {isShow: true, fixed: false, type: '', key: 'orgCode', prop: 'orgCode', label: '供应商编号', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'caName', prop: 'caName', label: '供应商名称', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'socialCode', prop: 'socialCode', label: '社会统一信用代码', align: 'center', width: 160},
]