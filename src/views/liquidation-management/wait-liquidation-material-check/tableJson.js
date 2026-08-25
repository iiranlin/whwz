import { checkStatusArr, statusObj, documentStatusArr } from '@/utils/dictionary'

export const columns = [
  {
    field: "status",
    title: "单据状态",
    minWidth: 100,
    type: "dict",
    dict: documentStatusArr,
  },
  {
    field: "checkStatus",
    title: "核对状态",
    minWidth: 100,
    type: "dict",
    dict: checkStatusArr,
    searchable: true,
    searchType: "select",
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
    field: "ibBillCode",
    title: "入库单号",
    minWidth: 160,
    type: "date",
    hideInTable: true,
    searchable: true,
    searchType: "input",
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
]

export const toolbarConfig = {
  buttons: [
    {code: 'back', name: '回退', type: 'primary'},
    {code: 'printMtWithDt', name: '打印结算物资明细', type: 'primary'},
    {code: 'submit', name: '提交', type: 'primary'},
    {code: 'check', name: '核对', showInTop: false, showInRow: true,
      disabled: (selectedRows) => {
        const {checkStatus} = selectedRows[0] || {}
        if(checkStatus == '1'){
          return true
        }
        return false
      }
    },
  ]
}

// 清算核对明细字段
export const matlTableJson = [
  {isShow: true, fixed: false, type: '', key: 'ibBillCode', prop: 'ibBillCode', label: '入库单号', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'spdCode', prop: 'spdCode', label: '采购单号', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'scontCode', prop: 'scontCode', label: '合同号', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'plantName', prop: 'plantName', label: '用料地区', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'taxFlagName', prop: 'taxFlagName', label: '应税用途', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'matlCode', prop: 'matlCode', label: '物资编码', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'matlName', prop: 'matlName', label: '物资名称', align: 'center', width: 160},
  {isShow: true, fixed: false, type: 'slot', key: 'matlType', prop: 'matlType', label: '规格型号/材质/图号', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'matlUnit', prop: 'matlUnit', label: '计量单位', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'purNum', prop: 'purNum', label: '采购订单数量', align: 'right', width: 160},
  {isShow: true, fixed: false, type: '', key: 'paNum', prop: 'paNum', label: '入库数量', align: 'right', width: 160},
  {isShow: true, fixed: false, type: '', key: 'stkPrice', prop: 'stkPrice', label: '采购单价(元)', align: 'right', width: 160},
  {isShow: true, fixed: false, type: 'dict', key: 'taxFlag', prop: 'taxFlag', label: '单价是否含税价', align: 'center', width: 160, stats: statusObj},
  {isShow: true, fixed: false, type: '', key: 'taxRate', prop: 'taxRate', label: '税率', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'taxAmount', prop: 'taxAmount', label: '采购金额(含税)', align: 'right', width: 160},
  {isShow: true, fixed: false, type: '', key: 'invoiceCodeList', prop: 'invoiceCodeList', label: '关联发票号', align: 'center', width: 160},
  {isShow: true, fixed: false, type: 'dict', key: 'checkStatus', prop: 'checkStatus', label: '是否核对', align: 'center', width: 160, stats: statusObj},
  {isShow: true, fixed: false, type: 'date', key: 'checkDate', prop: 'checkDate', label: '核对日期', align: 'center', width: 160},
]

export const matlTableButtonJson = [
  {code: 'invoiceUpload', name: '发票附件补传'},
  {code: 'check', name: '确认核对'},
  {code: 'viewInvoice', name: '查看发票附件', type: 'inline'},
]

// 发票附件补传
export const invoiceTableJson = [
  {isShow: true, fixed: false, type: 'slot', key: 'invoiceCode', prop: 'invoiceCode', label: '发票号码', align: 'center'},
  {isShow: true, fixed: false, type: 'link', key: 'originFileName', prop: 'originFileName', label: '发票附件', align: 'center'},
]

export const invoiceTableButtonJson = [
  {code: 'create', name: '新增'},
  {code: 'upload', name: '点击上传附件', type: 'inline', slot: true},
  {code: 'delete', name: '删除', type: 'inline'},
]

// 打印
export const printMatlTableJson = [
  {isShow: true, fixed: false, type: '', key: 'ibBillCode', prop: 'ibBillCode', label: '入库单号', align: 'center'},
  {isShow: true, fixed: false, type: '', key: 'spdCode', prop: 'spdCode', label: '采购订单号', align: 'center'},
  {isShow: true, fixed: false, type: '', key: 'useUnitName', prop: 'useUnitName', label: '用料单位名称', align: 'center'},
  {isShow: true, fixed: false, type: '', key: 'plantName', prop: 'plantName', label: '用料地区', align: 'center'},
  {isShow: true, fixed: false, type: '', key: 'matlCode', prop: 'matlCode', label: '物资编码', align: 'center'},
  {isShow: true, fixed: false, type: '', key: 'matlName', prop: 'matlName', label: '物资名称', align: 'center'},
  {isShow: true, fixed: false, type: '', key: 'matlType', prop: 'matlType', label: '规格型号', align: 'center'},
  {isShow: true, fixed: false, type: '', key: 'matlUnit', prop: 'matlUnit', label: '计量单位', align: 'center'},
  {isShow: true, fixed: false, type: '', key: 'purNum', prop: 'purNum', label: '订单数量', align: 'center'},
  {isShow: true, fixed: false, type: '', key: 'paNum', prop: 'paNum', label: '入库数', align: 'center'},
  {isShow: true, fixed: false, type: '', key: 'stkPrice', prop: 'stkPrice', label: '采购单价', align: 'center'},
  {isShow: true, fixed: false, type: '', key: 'taxAmount', prop: 'taxAmount', label: '结算金额', align: 'center'},
]