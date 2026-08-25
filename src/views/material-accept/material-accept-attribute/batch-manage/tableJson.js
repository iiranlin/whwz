export const tableJson = [
  {isShow: true, fixed: false, type: '', key: 'matlCode', prop: 'matlCode', label: '物资编码', align: 'center'},
  {isShow: true, fixed: false, type: '', key: 'matlName', prop: 'matlName', label: '物资名称', align: 'center'},
  {isShow: true, fixed: false, type: '', key: 'matlType', prop: 'matlType', label: '规格型号', align: 'center'},
  {isShow: true, fixed: false, type: '', key: 'matlUnit', prop: 'matlUnit', label: '计量单位', align: 'center'},
  {isShow: true, fixed: false, key: 'matlBatchStatus', prop: 'matlBatchStatus', label: '批次管理', align: 'center', type: "slot"},
  {isShow: true, fixed: false, key: 'periodManage', prop: 'periodManage', label: '效期管理', align: 'center', type: "slot"},
  {isShow: true, fixed: false, key: 'validityPeriodUnit', prop: 'validityPeriodUnit', label: '有效期单位', align: 'center', type: "slot"},
  {isShow: true, fixed: false, type: '', key: 'validityPeriod', prop: 'validityPeriod', label: '有效期', align: 'center',},

];

export const tableButtonJson = [
   {code: 'edit', name: "编辑", type: "inline", disabled: false},
   {code: 'del', name: "删除", type: "inline", disabled: false},
]


export const selectedTableJson = [
  {isShow: true, fixed: false, type: '', key: 'matlCode', prop: 'matlCode', label: '物资编码', align: 'center'},
  {isShow: true, fixed: false, type: '', key: 'matlName', prop: 'matlName', label: '物资名称', align: 'center'},
  {isShow: true, fixed: false, type: '', key: 'matlType', prop: 'matlType', label: '规格型号', align: 'center'},
  {isShow: true, fixed: false, type: '', key: 'matlUnit', prop: 'matlUnit', label: '计量单位', align: 'center'},
  {isShow: false, fixed: false, key: 'validityPeriodUnit', prop: 'validityPeriodUnit', label: '有效期单位', required: true, align: 'center', type: "slot",},
  {isShow: false, fixed: false, key: 'validityPeriod', prop: 'validityPeriod', label: '有效期', required: true, align: 'center', type: "slot",},
]

export const selectedTableButtonJson = [
  {code: 'del', name: "删除", type: "inline", disabled: false},
]

export const matlTableJson = [
  {isShow: true, fixed: false, type: '', key: 'matlCode', prop: 'matlCode', label: '物资编码', align: 'center'},
  {isShow: true, fixed: false, type: '', key: 'matlName', prop: 'matlName', label: '物资名称', align: 'center'},
  {isShow: true, fixed: false, type: '', key: 'matlType', prop: 'matlType', label: '规格型号', align: 'center'},
  {isShow: true, fixed: false, type: '', key: 'matlUnit', prop: 'matlUnit', label: '计量单位', align: 'center'},
]