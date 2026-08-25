import { sfiniFlagArr, otherFlagObj, statusArr } from '@/utils/dictionary'
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
  return [
    {
      field: "orderNo",
      title: "商城订单号",
      minWidth: 160,
      align: "center",
      searchable: true,
      searchType: "input",
    },
    {
      field: "supplierOrgName",
      title: "供应商",
      minWidth: 160,
      searchable: true,
      searchType: "input",
    },
    {
      field: "area",
      title: "用料地区",
      minWidth: 160,
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
      field: "taxablePurpose",
      title: "应税用途",
      minWidth: 160,
      type: "dict",
      requestOptions: async () => {
        const { dictList } = await useDictData('tax_flag')
        return dictList
      },
      optionsCacheKey: "mall-order-modify:taxablePurpose",
    },
    {
      field: "incloudTax",
      title: "是否含税",
      minWidth: 160,
      type: 'dict',
      dict: statusArr,
    },
    {
      field: "fundSource",
      title: "款源",
      minWidth: 160,
      type: "dict",
      searchable: true,
      searchType: "select",
      requestOptions: async () => {
        const { dictList } = await useDictData('matl_use')
        return dictList
      },
      optionsCacheKey: "mall-order-modify:fundSource",
    },
    {
      field: "matlCode",
      title: "物资编码",
      minWidth: 160,
      align: "center",
      hideInTable: true,
      searchable: true,
      searchType: "input",
    },
    {
      field: "matlName",
      title: "物资名称",
      minWidth: 160,
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
      type: 'date',
    },
    {
      field: "finishTime",
      title: "到货日期",
      minWidth: 140,
      type: 'date',
      searchable: true,
      searchType: "dateRange",
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
      title: "收货人联系电话",
      minWidth: 140,
    },
    {
      field: "sfiniFlag",
      title: "入库状态",
      minWidth: 140,
      type: 'dict',
      dict: sfiniFlagArr,
    }
  ];
}

export const toolbarConfig = {
  buttons: [
    { code: 'modify', name: '修改', showInTop: false, showInRow: true,
      disabled: (selectedRows) => {
        const {sfiniFlag} = selectedRows[0] || {}
        if(sfiniFlag == '2'){
          return true
        }
        return false
      }
    },
    {code: 'checkDetails', name: '查看明细', showInTop: false, showInRow: true},
  ]
}

export const checkDetailsTableJson = [
  {isShow: true, fixed: false, type: '', key: 'matlCode', prop: 'matlCode', label: '物资编码', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'skuName', prop: 'skuName', label: '物资名称', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'matlType', prop: 'matlType', label: '规格型号', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'matlUnit', prop: 'matlUnit', label: '计量单位', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'skuId', prop: 'skuId', label: '商品SKU编码', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'brandName', prop: 'brandName', label: '品牌名称', align: 'center', width: 200},
  {isShow: true, fixed: false, type: '', key: 'sellPrice', prop: 'sellPrice', label: '销售单价(元)', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'skuNum', prop: 'skuNum', label: '商品数量', align: 'center', width: 160},
  {isShow: true, fixed: false, type: '', key: 'money', prop: 'money', label: '金额(元)', align: 'center', width: 160},
  {isShow: true, fixed: false, type: 'slot', key: 'taxRate', prop: 'taxRate', label: '税率(%)', align: 'center', width: 160},
  {isShow: true, fixed: false, type: 'dict', key: 'flag', prop: 'flag', label: '状态', align: 'center', width: 160, stats: otherFlagObj},
  {isShow: true, fixed: false, type: '', key: 'otherInfo', prop: 'otherInfo', label: '商品其他信息', align: 'center', width: 160},
]
