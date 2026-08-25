//附件能在线预览类型
export const uploadTypeArr = ['pdf', 'xlsx', 'docx', 'jpg', 'gif', 'png', 'bmp', 'jpeg', 'xml']

//税率
export const taxRateArr = [0, 3, 6, 9, 10, 13]

//是否
export const statusObj = {'0': '否', '1': '是'}
export const statusArr = [{ value: '0', label: '否' }, { value: '1', label: '是' }]

//是否
export const generateStatusObj = {'2': '否', '3': '是'}
export const generateStatusArr = [{ value: '2', label: '否' }, { value: '3', label: '是' }]

//是否含税
export const includeTaxObj = {'0': '不含税', '1': '含税'}
export const includeTaxArr = [{ value: '0', label: '不含税' }, { value: '1', label: '含税' }]

//启用停用
export const enableFlagObj = {'0': '停用', '1': '启用'}
export const enableFlagArr = [{ value: '0', label: '停用' }, { value: '1', label: '启用' }]

//管理权限
export const manageRuleObj = {'0': '路局', '1': '站段'}
export const manageRuleArr = [{ value: '0', label: '路局' }, { value: '1', label: '站段' }]

//管理权限
export const manageLevelObj = {'1': '国铁集团', '2': '铁路局', '3': '站段'}
export const manageLevelArr = [{ value: '1', label: '国铁集团' }, { value: '2', label: '铁路局' }, { value: '3', label: '站段' }]


//地区类型
export const plantTypeObj = {'0': '用料(站段)', '1': '供应(采供所)'}
export const plantTypeArr = [{ value: '0', label: '用料(站段)' }, { value: '1', label: '供应(采供所)' }]

//到货确认状态
export const confirmFlagObj = {'0': '未确认', '1': '已确认'}
export const confirmFlagArr = [{ value: '0', label: '未确认' }, { value: '1', label: '已确认' }]

//验收级别
export const acceptanceLevelObj = {'1': '一级验收', '2': '多级验收'}
export const acceptanceLevelArr = [{ value: '1', label: '一级验收' }, { value: '2', label: '多级验收' }]

//验收级别
export const facadeFlagObj = {'0': '完好', '1': '破损'}
export const facadeFlagArr = [{ value: '0', label: '完好' }, { value: '1', label: '破损' }]

//是否通过验收
export const acceptanceFlagObj = {'0': '不通过', '1': '通过'}
export const acceptanceFlagArr = [{ value: '0', label: '不通过' }, { value: '1', label: '通过' }]

//外观标志
export const brandFlagObj = {'0': '相符', '1': '不相符'}
export const brandFlagArr = [{ value: '0', label: '相符' }, { value: '1', label: '不相符' }]

//图片类型
export const documentTypeObj = {'1': '技术证件', '2': '产品图片', '3': '验收过程', '4': '其他'}

//商城订单状态
export const flagObj = {'1': '未确认', '2': '已确认', '4': '已停用'}
export const flagArr = [{ value: '1', label: '未确认' }, { value: '2', label: '已确认' }, { value: '4', label: '已停用' }]

//退换货业务类型
export const operationTypeObj = {'exchange': '待退换货', 'replenish': '待补货'}
export const operationTypeArr = [{ value: 'exchange', label: '待退换货' }, { value: 'replenish', label: '待补货' }]

//商品修改明细状态
export const otherFlagObj = {'1': '未引用', '2': '已引用', '3': '非物资系统核算', '4': '停用'}
export const otherFlagflagArr = [{ value: '1', label: '未引用' }, { value: '2', label: '已引用' }, { value: '3', label: '非物资系统核算' }, { value: '4', label: '停用' }]

//商城订单修改入库状态
export const sfiniFlagObj = {'0': '未入库', '1': '未入库', '2': '已入库'}
export const sfiniFlagArr = [{ value: '0', label: '未入库' }, { value: '1', label: '未全部入库' }, { value: '2', label: '已入库' }]

//移库管理--移库移出状态
export const rmstorInternalExitFlagObj = {'0': '移出未提交', '1': '移出已提交', '4': '移入已登卡'}
export const rmstorInternalExitFlagArr = [{ value: '0', label: '移出未提交' }, { value: '1', label: '移出已提交' },{ value: '4', label: '移入已登卡' }]

//移库管理--移库移入状态
export const rmstorInternalEnterFlagObj = {'1': '移入未登卡', '4': '移入已登卡'}
export const rmstorInternalEnterFlagArr = [{ value: '1', label: '移入未登卡' },{ value: '4', label: '移入已登卡' }]

//移库类型1-闲置调剂 2-随车配件调剂 0-其他（3.1其他移库单）
export const adjTypeCodeObj = {'5': '日常调拨', '6': '对外销售', '3': '捐赠', '4': '置换', '0': '其他'}
export const adjTypeCodeArr = [{ value: '5', label: '日常调拨' }, { value: '6', label: '对外销售' }, { value: '3', label: '捐赠' }, { value: '4', label: '置换' },{ value: '0', label: '其他' }]

//调拨(销售)单--单据状态
export const saleFlagObj = {'0': '未登卡', '1': '已登卡'}
export const saleFlagArr = [{ value: '0', label: '未登卡' },{ value: '1', label: '已登卡' }]

//调拨(销售)单--审批状态
export const permFlagObj = {'0': '未提交', '1': '审批中', '2': '审批通过', '4': '审批驳回'}
export const permFlagArr = [{ value: '0', label: '未提交' },{ value: '1', label: '审批中' },{ value: '2', label: '审批通过' },{ value: '4', label: '审批驳回' }]

//调拨(销售)单--审批状态
export const handleAdviseTypeObj = {'1': '本单位留用', '2': '局内调剂', '3': '自主组织跨局调剂', '4': '国铁集团组织跨局调剂', '5': '报废', '6': '返主机厂', '0': '其他（3.1其他调拨单）'}
export const handleAdviseTypeArr = [{ value: '1', label: '本单位留用' },{ value: '2', label: '局内调剂' },{ value: '3', label: '自主组织跨局调剂' },{ value: '4', label: '国铁集团组织跨局调剂' },
    { value: '5', label: '报废' },{ value: '6', label: '返主机厂' },{ value: '0', label: '其他（3.1其他调拨单）' }
]

//调整单状态  
export const approvalObj = [{ value: '0', label: '全部' },{ value: '1', label: '未提交' },{ value: '2', label: '审核中' },{ value: '3', label: '已审核' },{ value: '4', label: '未登卡' },{ value: '5', label: '已登卡' },{ value: '6', label: '未审核' },]

//仓库级别
export const whLevelObj = {'01': '段级', '02': '车间级', '03': '工区(班组)级', '04': '其他'}
export const whLevelArr = [{ value: '01', label: '段级' },{ value: '02', label: '车间级' },{ value: '03', label: '工区(班组)级' },{ value: '04', label: '其他' }]

//仓库场所类型
export const venueTypeObj = {'01': '库房', '02': '料棚', '03': '露天料场'}
export const venueTypeArr = [{ value: '01', label: '库房' }, { value: '02', label: '料棚' }, { value: '03', label: '露天料场' }]

// 有效期单位
export const validityPeriodUnitObj = {'天': '天', '周': '周', '月': '月', '年': '年'}
export const validityPeriodUnitArr = [{ value: '天', label: '天' }, { value: '周', label: '周' }, { value: '月', label: '月' }, { value: '年', label: '年' }]

// 单位类型
export const unitTypeObj = {'01': '路内局外单位', '02': '路外单位'}
export const unitTypeArr = [{ value: '01', label: '路内局外单位' }, { value: '02', label: '路外单位' }]

// 入库单来源
export const whReceiptSourceObj = {'0': "外购", "1": "自制", "2": "调拨", "3": "柴油", "4": "旧品", "6": "钢轨", "7": "委外修/返厂修", "8": "其他来源", "9": "修旧利废"};
export const whReceiptSourceArr = [
    { label: "外购", value: "0" },
    { label: "自制", value: "1" },
    { label: "调拨", value: "2" },
    { label: "旧品", value: "4" },
    // { label: "报废", value: "5" },
    { label: "委外修/返厂修", value: "7" },
    { label: "修旧利废", value: "9" },
    { label: "其他来源", value: "8" },
    { label: "柴油", value: "3" },
    { label: "钢轨", value: "6" },
];

// 入库单状态
export const whReceiptStatusObj = { "0": "未登卡", "1": "已登卡" };
export const whReceiptStatusArr = [{ label: "未登卡", value: "0,1" }, { label: "已登卡", value: "2" }];


// 入库单来源类别
export const whReceiptSourceTypeObj = {"1": "索赔", "2": "受赠", "3": "置换",};
export const whReceiptSourceTypeArr = [ { label: "索赔", value: "1" }, { label: "受赠", value: "2"}, { label: "置换", value: "3" },];

//数量管理入库单主管理--单据状态
export const ibmtFlagObj = {'0': '未登卡', '1': '已登卡'}
export const ibmtFlagArr = [{ value: '0', label: '未登卡' },{ value: '1', label: '已登卡' }]

//数量管理入库单综合查询--日期类型
export const dateTypeObj = {'1': '下单日期', '2': '登卡日期'}
export const dateTypeArr = [{ value: '1', label: '下单日期' },{ value: '2', label: '登卡日期' }]

//数量管理入库单综合查询--分组汇总
export const ibdtHasArr = [{value: 'SupUnitName', label: '供货单位'}, {value: 'PlantName', label: '地区'}, {value: 'DepotName', label: '仓库'}, {value: 'PartitionName', label: '仓库分区'}, {value: 'MatlCode', label: '物资编码'}]

//数量管理出库单综合查询--分组汇总
export const obdtHasArr = [{value: 'TeamName', label: '领料班组'}, {value: 'PlantName', label: '地区'}, {value: 'DepotName', label: '仓库'}, {value: 'PartitionName', label: '仓库分区'}, {value: 'MatlCode', label: '物资编码'}]



//待清算物资生成--单据状态
export const prePayStatusObj = {'0': '草稿', '1': '已提交', '2': '已提交', '3': '已提交'}
export const prePayStatusArr = [{value: '0', label: '草稿'}, {value: '1', label: '已提交'}, {value: '2', label: '已提交'}, {value: '3', label: '已提交'}]

//待清算物资核对--单据状态
export const documentStatusObj = {'0': '未提交', '1': '未提交', '2': '已提交'}
export const documentStatusArr = [{value: '0', label: '未提交'}, {value: '1', label: '未提交'}, {value: '2', label: '已提交'}]

//四号定位维护--货位类型
export const positionTypeObj = {'0': '固定货位', '1': '随机货位'}
export const positionTypeArr = [{ value: '0', label: '固定货位' }, { value: '1', label: '随机货位' }]

//待清算物资核对--核对状态
export const checkStatusObj = {'0': '未核对', '1': '已核对', '2': '部分核对'}
export const checkStatusArr = [{ value: '0', label: '未核对' }, { value: '1', label: '已核对' }, { value: '2', label: '部分核对' }]

// 是否上传发票
export const isUploadInvoiceObj = {'0': '未上传发票', '1': '已上传发票'}
export const isUploadInvoiceArr = [{ value: '0', label: '未上传发票' }, { value: '1', label: '已上传发票' }]

// 清算通知单报账状态
export const notificationStatusObj = {'0': '未入账', '1': '已入账', '2': '已生成待付款计划'}
export const notificationStatusArr = [{ value: '0', label: '未入账' }, { value: '1', label: '已入账' }, { value: '2', label: '已生成待付款计划' }]

// 到货确认-补货状态
export const noticedFlagObj = {'0': '未通知', '1': '已通知'}
export const noticedFlagArr = [{ value: '0', label: '未通知' }, { value: '1', label: '已通知' }]


//待付款计划生成--单据状态
export const prePayPlanStatusObj = {'0': '未提交', '1': '已提交'}

//付款计划维护--单据状态
export const prePayPlanDtStatusObj = {'0': '草稿', '1': '已提交未支付', '2': '已支付'}

//付款计划维护--采购组织形式
export const spurcTypeObj = {'集采': '集采', '联采': '联采'}
export const spurcTypeArr = [{ value: '集采', label: '集采' }, { value: '联采', label: '联采' }]

//付款计划确认--审批状态
export const paymentStatusObj = {'1': '待支付', '2': '已支付'}
export const paymentStatusArr = [{ value: '1', label: '待支付' }, { value: '2', label: '已支付' }]
//付款计划确认--审批状态
export const auditStatusObj = {'0': '待审批', '1': '审批中', '2': '审批驳回', '3': '审批通过'}
export const auditStatusArr = [{ value: '0', label: '待审批' }, { value: '1', label: '审批中' }, { value: '2', label: '审批驳回' }, { value: '3', label: '审批通过' }]
// 报账信息查询-报账状态
export const shareStatusObj = {'0': '待入账', '1': '已入账'}
export const shareStatusArr = [{ value: '0', label: '待入账' }, { value: '1', label: '已入账' }]
// 发票查询-付款状态
export const payStatusObj = {'0': '待付款', '1': '部分付款', '2': '已付款'}
export const payStatusArr = [{ value: '0', label: '待付款' }, { value: '1', label: '部分付款' }, { value: '2', label: '已付款' }]

// 月结转采供所-封账状态
export const closeFlagObj = {'0': '开账', '1': '封账'}
export const closeFlagArr = [{ value: '0', label: '开账' }, { value: '1', label: '封账' }]