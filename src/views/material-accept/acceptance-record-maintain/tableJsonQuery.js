import { statusArr, acceptanceFlagArr, acceptanceLevelArr, facadeFlagArr, brandFlagArr, documentTypeArr, validityPeriodUnitArr } from '@/utils/dictionary'

export const columns = [
  {
    field: "spdCode",
    title: "采购订单号",
    minWidth: 120,
    align: "center",
    searchable: true,
    searchType: "input",
  },
  {
    field: "scontCode",
    title: "合同号",
    minWidth: 140,
    align: "center",
    type: 'link',
    searchable: true,
    searchType: "input",
  },
  {
    field: "matlPcodeImg",
    title: "合同图片",
    minWidth: 120,
    slotName: 'matlPcodeImg',
  },
  {
    field: "suName",
    title: "供应商",
    minWidth: 130,
    searchable: true,
    searchType: "input",
  },
  {
    field: "matlCode",
    title: "物资编码",
    minWidth: 120,
    align: "center",
    searchable: true,
    searchType: "input",
  },
  {
    field: "matlName",
    title: "物资名称",
    minWidth: 130,
    searchable: true,
    searchType: "input",
  },
  {
    field: "matlTypeSlot",
    title: "规格型号/材质/图号",
    minWidth: 130,
    slotName: 'matlTypeSlot',
  },
  {
    field: "matlType",
    title: "规格型号",
    minWidth: 140,
    hideInTable: true,
    searchable: true,
    searchType: "input",
  },
  {
    field: "matlUnit",
    title: "计量单位",
    minWidth: 74,
    align: "center",
  },
  {
    field: "contPrice",
    title: "采购单价",
    minWidth: 74,
    type: 'number'
  },
  {
    field: "purNum",
    title: "采购数量",
    minWidth: 74,
    type: 'number'
  },
  {
    field: "deliverNum",
    title: "发货数量",
    minWidth: 74,
    type: 'number'
  },
  {
    field: "batchNo",
    title: "发货批次号",
    minWidth: 86,
    align: "center",
  },
  {
    field: "arrivalNum",
    title: "到货确认数量",
    minWidth: 100,
    type: 'number'
  },
  {
    field: "acceptanceFlag",
    title: "是否通过验收",
    minWidth: 120,
    type: "dict",
    dict: acceptanceFlagArr,
    slotName: 'acceptanceFlag',
  },
  {
    field: "acceptanceNumber",
    title: "验收通过数量",
    minWidth: 120,
    type: 'number',
    slotName: 'acceptanceNumber',
  },
  {
    field: "comments",
    title: "验收说明",
    minWidth: 120,
    slotName: 'comments',
  },
  {
    field: "jointReceiver",
    title: "联合验收人员",
    minWidth: 160,
    slotName: 'jointReceiver',
  },
  {
    field: "productionDate",
    title: "生产日期",
    minWidth: 150,
    slotName: 'productionDate',
  },
  {
    field: "validityPeriod",
    title: "有效期",
    minWidth: 100,
    slotName: 'validityPeriod',
  },
  {
    field: "validityPeriodUnit",
    title: "有效期单位",
    minWidth: 90,
    type: "dict",
    dict: validityPeriodUnitArr,
    slotName: 'validityPeriodUnit',
  },
  {
    field: "expirationDate",
    title: "到期日期",
    minWidth: 150,
    slotName: 'expirationDate',
  },
  {
    field: "conversionBasis",
    title: "换算依据",
    minWidth: 120,
    slotName: 'conversionBasis',
  },
  {
    field: "facadeFlag",
    title: "外观标志",
    minWidth: 100,
    type: "dict",
    dict: facadeFlagArr,
    slotName: 'facadeFlag',
  },
  {
    field: "position",
    title: "产地/品牌",
    minWidth: 120,
  },
  {
    field: "brandFlag",
    title: "品牌是否相符",
    minWidth: 120,
    type: "dict",
    dict: brandFlagArr,
    slotName: 'brandFlag',
  },
  {
    field: "brandAccount",
    title: "品牌不符说明",
    minWidth: 120,
    slotName: 'brandAccount',
  },
  {
    field: "credCode",
    title: "技证号",
    minWidth: 120,
    slotName: 'credCode',
  },
  {
    field: "arrName",
    title: "到货地点",
    minWidth: 140,
    hideInTable: true,
    searchable: true,
    searchType: "input",
  },
  {
    field: "bmName",
    title: "制单人",
    minWidth: 100,
    searchable: true,
    searchType: "input",
  },
  {
    field: "createTime",
    title: "发货日期",
    minWidth: 160,
    type: 'date',
    hideInTable: true,
    searchable: true,
    searchType: "dateRange",
  },
  {
    field: "arrivalDate",
    title: "到货确认日期",
    minWidth: 100,
    type: 'date',
    searchable: true,
    searchType: "dateRange",
  },
  {
    field: "userName",
    title: "到货确认人",
    minWidth: 100,
  },
  {
    field: "acceptanceLevel",
    title: "验收级别",
    minWidth: 100,
    type: "dict",
    searchable: true,
    searchType: "select",
    requestOptions: async () => acceptanceLevelArr,
    optionsCacheKey: "acceptance-record-maintain:acceptanceLevel",
    slotName: 'acceptanceLevel',
  },
  {
    field: "mallOrder",
    title: "是否商城订单",
    minWidth: 100,
    type: "dict",
    searchable: true,
    searchType: "select",
    requestOptions: async () => statusArr,
    optionsCacheKey: "acceptance-record-maintain:mallOrder",
  },
]

export const toolbarConfig = {
  buttons: [
    { code: 'save', name: '保存', type: 'primary'},
    { code: 'upload', name: '上传验收附件', showInTop: false, showInRow: true},
    { code: 'adjust', name: '商城订单调整', showInTop: false, showInRow: true,
      disabled: (selectedRows) => {
        const {mallOrder} = selectedRows[0] || {}
        if(mallOrder == '0'){
          return true
        }
        return false
      }
    },
    { code: 'history', name: '验收历史', showInTop: false, showInRow: true},
  ]
}

export const fileTableJson = [
  {
    field: "type",
    title: "证件类型",
    minWidth: 130,
    type: 'dict',
    dict: documentTypeArr
  },
  {
    field: "fileName",
    title: "文件名称",
    minWidth: 200,
    type: 'link',
    align: 'center',
  },
  {
    field: "uploadDate",
    title: "上传时间",
    minWidth: 100,
    type: 'date',
  },
  {
    field: "makerName",
    title: "上传人",
    minWidth: 120,
  },
]

export const fileTableButtonJson = {
  buttons: [
    { code: 'delete', name: '删除', showInTop: false, showInRow: true},
  ]
}

export const historyTableJson = [
  {
    field: "userName",
    title: "验收人",
    minWidth: 160,
  },
  {
    field: "acceptanceLevel",
    title: "验收级别",
    minWidth: 160,
    align: 'center',
    slotName: 'acceptanceLevel'
  },
  {
    field: "acceptanceNumber",
    title: "验收通过数量",
    minWidth: 160,
    type: 'number'
  },
  {
    field: "acceptanceDate",
    title: "验收时间",
    minWidth: 160,
    type: 'date'
  },
  {
    field: "conversionBasis",
    title: "换算依据",
    minWidth: 160,
  },
  {
    field: "facadeFlag",
    title: "外观标志",
    minWidth: 150,
    type: 'dict',
    dict: facadeFlagArr
  },
  {
    field: "comments",
    title: "验收说明",
    minWidth: 160,
  },
  {
    field: "brandFlag",
    title: "品牌是否相符",
    minWidth: 160,
    type: 'dict',
    dict: brandFlagArr
  },
  {
    field: "brandAccount",
    title: "品牌不符说明",
    minWidth: 160,
  },
  {
    field: "credCode",
    title: "技证号",
    minWidth: 160,
  },
  {
    field: "productionDate",
    title: "生产日期",
    minWidth: 160,
    type: 'date'
  },
  {
    field: "validityPeriod",
    title: "有效期",
    minWidth: 160,
    type: 'number'
  },
  {
    field: "validityPeriodUnit",
    title: "有效单位",
    minWidth: 160,
    align: 'center',
  },
  {
    field: "expirationDate",
    title: "到期日期",
    minWidth: 160,
    type: 'date'
  },
  {
    field: "viewAttachment",
    title: "查看附件",
    minWidth: 100,
    align: 'center',
    fixed: 'right',
    slotName: 'viewAttachment'
  },
]

export const scontTableJson = [
  {
    field: "seffeFlag",
    title: "有效状态",
    minWidth: 160,
    align: 'center',
    slotName: 'seffeFlag'
  },
  {
    field: "smatlCode",
    title: "物资编码",
    minWidth: 160,
    align: 'center',
    searchable: true,
    searchType: "input",
  },
  {
    field: "smatlName",
    title: "物资名称",
    minWidth: 160,
    searchable: true,
    searchType: "input",
  },
  {
    field: "smatlType",
    title: "规格型号",
    minWidth: 160,
  },
  {
    field: "smatlUnit",
    title: "计量单位",
    minWidth: 160,
  },
  {
    field: "supplierType",
    title: "供应商类型",
    minWidth: 160,
  },
  {
    field: "smadeBrand",
    title: "产地/品牌",
    minWidth: 160,
  },
  {
    field: "ncontPrice",
    title: "采购单价(元)",
    minWidth: 160,
    type: 'number'
  },
  {
    field: "nexfPrice",
    title: "出厂价(元)",
    minWidth: 160,
    type: 'number'
  },
  {
    field: "ncontNum",
    title: "数量",
    minWidth: 160,
    type: 'number'
  },
  {
    field: "ncontMoney",
    title: "金额(元)",
    minWidth: 160,
    type: 'number'
  },
  {
    field: "singlePriceTax",
    title: "财务预算单价(含税)",
    minWidth: 160,
    type: 'number'
  },
  {
    field: "limitPriceTax",
    title: "采购最高限价(含税)",
    minWidth: 160,
    type: 'number'
  },
  {
    field: "budgetPriceTax",
    title: "采购方案估算单价(含税)",
    minWidth: 200,
    type: 'number'
  },
  {
    field: "averagePriceTax",
    title: "市场平均价或公允价格(含税)",
    minWidth: 200,
    type: 'number'
  },
  {
    field: "planSinglePriceTax",
    title: "投资计划或概预算单价(含税)",
    minWidth: 200,
    type: 'number'
  },
  {
    field: "planPriceTax",
    title: "投资计划或概预算总价(含税)",
    minWidth: 200,
    type: 'number'
  },
  {
    field: "planprojName",
    title: "投资计划或概预算文号",
    minWidth: 200,
  },
  {
    field: "nDeliveryDays",
    title: "供货期(天)",
    minWidth: 160,
    type: 'number'
  },
  {
    field: "scomments",
    title: "备注",
    minWidth: 160,
  },
]