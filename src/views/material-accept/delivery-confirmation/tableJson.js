import { confirmFlagArr, noticedFlagArr, flagArr, includeTaxArr, documentTypeObj } from '@/utils/dictionary'
import { selectPlantDict } from '@/api/warehouse/plantDict'
import { useDictData } from "@/utils/Dict"

const getselectPlantDict = async () => {
  const res = await selectPlantDict()
  return res.data.map(item => {
    return {...item, label: item.plantName, value: item.plantCode}
  })
}

export const columnsFun = async () => {
  const plantArr = await getselectPlantDict()
  return {
    // 采购订单
    columns: [
      {
        field: "confirmFlag",
        title: "状态",
        minWidth: 100,
        type: "dict",
        searchable: true,
        searchType: "select",
        requestOptions: async () => confirmFlagArr,
        optionsCacheKey: "delivery-confirmation:confirmFlag",
      },
      {
        field: "spdCode",
        title: "采购订单号",
        minWidth: 160,
        align: 'center',
        searchable: true,
        searchType: "input",
      },
      {
        field: "bmName",
        title: "制单人",
        minWidth: 140,
        searchable: true,
        searchType: "input",
      },
      {
        field: "plantName",
        title: "用料地区",
        minWidth: 140,
      },
      {
        field: "plantCode",
        title: "用料地区",
        minWidth: 140,
        type: "dict",
        hideInTable: true,
        searchable: true,
        searchType: "select",
        requestOptions: async () => plantArr,
        optionsCacheKey: "delivery-confirmation:plantCode",
      },
      {
        field: "suName",
        title: "供应商",
        minWidth: 140,
        searchable: true,
        searchType: "input",
      },
      {
        field: "logCode",
        title: "物流单号",
        minWidth: 140,
        align: 'center',
      },
      {
        field: "matlCode",
        title: "物资编码",
        minWidth: 140,
        align: 'center',
        searchable: true,
        searchType: "input",
      },
      {
        field: "matlName",
        title: "物资名称",
        minWidth: 140,
        searchable: true,
        searchType: "input",
      },
      {
        field: "matlTypeSlot",
        title: "规格型号/材质/图号",
        minWidth: 140,
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
        minWidth: 140,
        align: 'center',
      },
      {
        field: "contPrice",
        title: "采购单价",
        minWidth: 140,
        type: 'number'
      },
      {
        field: "purNum",
        title: "采购数量",
        minWidth: 140,
        type: 'number'
      },
      {
        field: "deliverNum",
        title: "发货数量",
        minWidth: 140,
        type: 'number'
      },
      {
        field: "arrivalNum",
        title: "到货数量",
        minWidth: 180,
        type: 'number',
        editProps: ({ column, props, row }) =>  ({
          ...props,
          min: 0.0001,
          max: row.deliverNum,
          precision: 4
        }),
        editRender: {name: 'el-input-number'}
      },
      {
        field: "batchNo",
        title: "发货批次号",
        minWidth: 140,
        align: 'center'
      },
      {
        field: "deliverDate",
        title: "发货日期",
        minWidth: 140,
        type: 'date',
        searchable: true,
        searchType: "dateRange",
      },
      {
        field: "arrName",
        title: "到货地点",
        minWidth: 140,
      },
      {
        field: "comments",
        title: "备注",
        minWidth: 140,
      },
      {
        field: "noticed",
        title: "补货状态",
        minWidth: 140,
        type: "dict",
        requestOptions: async () => noticedFlagArr,
        optionsCacheKey: "delivery-confirmation:noticed",
      }
    ],
    // 国铁商城妥投订单
    smOrderColumns: [
      {
        field: "flag",
        title: "状态",
        minWidth: 160,
        type: "dict",
        searchable: true,
        searchType: "select",
        requestOptions: async () => flagArr,
        optionsCacheKey: "delivery-confirmation:flag",
      },
      {
        field: "orderNo",
        title: "商城订单号",
        minWidth: 140,
        align: 'center',
        searchable: true,
        searchType: "input",
      },
      {
        field: "suName",
        title: "供应商名称",
        minWidth: 140,
        searchable: true,
        searchType: "input",
      },
      {
        field: "area",
        title: "用料地区",
        minWidth: 140,
      },
      {
        field: "areaCode",
        title: "用料地区",
        minWidth: 140,
        type: "dict",
        hideInTable: true,
        searchable: true,
        searchType: "select",
        requestOptions: async () => plantArr,
        optionsCacheKey: "delivery-confirmation:areaCode",
      },
      {
        field: "taxablePurpose",
        title: "应税用途",
        minWidth: 140,
        type: "dict",
        requestOptions: async () => {
          const { dictList } = await useDictData('tax_flag')
          return dictList
        },
        optionsCacheKey: "delivery-confirmation:taxablePurpose",
      },
      {
        field: "includeTax",
        title: "是否含税",
        minWidth: 140,
        type: "dict",
        requestOptions: async () => includeTaxArr,
        optionsCacheKey: "delivery-confirmation:includeTax",
      },
      {
        field: "fundSource",
        title: "款源",
        minWidth: 140,
        type: "dict",
        requestOptions: async () => {
          const { dictList } = await useDictData('matl_use')
          return dictList
        },
        optionsCacheKey: "delivery-confirmation:fundSource",
      },
      {
        field: "purchaserName",
        title: "下单人",
        minWidth: 140,
        searchable: true,
        searchType: "input",
      },
      {
        field: "orderTime",
        title: "下单日期",
        minWidth: 140,
        type: "date",
      },
      {
        field: "arrivalTime",
        title: "到货日期",
        minWidth: 140,
        type: 'date',
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
        searchable: true,
        searchType: "input",
      },
      {
        field: "matlUnit",
        title: "计量单位",
        minWidth: 140,
        align: 'center',
      },
      {
        field: "sellPrice",
        title: "销售单价(元)",
        minWidth: 140,
        type: 'number'
      },
      {
        field: "skuNum",
        title: "商品数量",
        minWidth: 140,
        type: 'number'
      },
      {
        field: "arrivalNum",
        title: "到货数量",
        minWidth: 180,
        type: 'number',
        editProps: ({ column, props, row }) =>  ({
          ...props,
          min: 0.0001,
          max: row.skuNum,
          precision: 4
        }),
        editRender: {
          name: 'el-input-number',
        },
      },
      {
        field: "amount",
        title: "金额(元)",
        minWidth: 140,
        type: 'number'
      },
      {
        field: "taxRate",
        title: "税率(%)",
        minWidth: 140,
        type: 'number'
      },
      {
        field: "receiverName",
        title: "收货人",
        minWidth: 140,
        searchable: true,
        searchType: "input",
      },
      {
        field: "receiverAddress",
        title: "收货地址",
        minWidth: 140,
        searchable: true,
        searchType: "input",
      },
      {
        field: "receiverMobile",
        title: "收货联系电话",
        minWidth: 140,
        align: 'center'
      },
      {
        field: "finishDate",
        title: "到货日期",
        minWidth: 140,
        type: 'date',
        searchable: true,
        searchType: "dateRange",
      },
    ]
  }
}

// 采购订单
export const toolbarConfig = {
  buttons: [
    {code: 'confirm', name: '确认', type: 'primary'},
    {code: 'revoke', name: '撤回', type: 'primary'},
    {code: 'noticeRestock', name: '通知补货', showInTop: false, showInRow: true, disabled: (selectedRows) => {
      const {arrivalNum, deliverNum, noticed, confirmFlag} = selectedRows[0] || {}
      if(arrivalNum >= deliverNum || noticed == '1' || confirmFlag == '0'){
        return true
      }
      return false
    }},
    {code: 'certificateView', name: '技术证书查看', showInTop: false, showInRow: true},
  ]
}

// 国铁商城妥投订单
export const smOrderToolbarConfig = {
  buttons: [
    {code: 'confirm', name: '确认', type: 'primary'},
    {code: 'deactivate', name: '停用', type: 'primary'},
    {code: 'export', name: '导出', type: 'primary'},
  ]
}



// 技术证书查看
export const certificateTableJson = [
  {isShow: true, fixed: false, type: 'dict', key: 'type', prop: 'type', label: '证件类型', align: 'center', width: 160, stats: documentTypeObj},
  {isShow: true, fixed: false, type: '', key: 'fileName', prop: 'fileName', label: '文件名称', align: 'center', width: 160},
  {isShow: true, fixed: false, type: 'date', key: 'uploadDate', prop: 'uploadDate', label: '上传时间', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'makerName', prop: 'makerName', label: '上传人', align: 'center', width: 160},
]

export const certificateTableButtonJson = [
  {code: 'download', name: '下载', type: 'inline'},
  {code: 'preview', name: '预览', type: 'inline'},
]