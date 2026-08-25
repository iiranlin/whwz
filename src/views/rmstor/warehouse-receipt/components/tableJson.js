export const supplierDialogTableJson = [
  { isShow: true, fixed: false, key: "unitCode", prop: "unitCode", label: "往来单位编码", align: "center" },
  { isShow: true, fixed: false, key: "unitName", prop: "unitName", label: "往来单位名称", align: "center" },
  { isShow: true, fixed: false, key: "type", prop: "type", label: "往来单位类型", align: "center" },
];

export const pictureListTableJson = [
  { isShow: true, fixed: false, key: "type", prop: "type", label: "文件类型", align: "center", width: 100, type: "slot"},
  { isShow: true, fixed: false, key: "fileName", prop: "fileName", label: "文件名称", align: "center", width: 180,},
  { isShow: true, fixed: false, key: "uploadDate", prop: "uploadDate", label: "上传时间", align: "center", width: 180, type: "slot"},
  { isShow: true, fixed: false, key: "makerName", prop: "makerName", label: "上传人", align: "center", width: 120,},
];

export const pictrueListTableButtonJson = [
   { code: "download", name: "下载", type: "inline" },
   { code: "preview", name: "预览", type: "inline" },
]