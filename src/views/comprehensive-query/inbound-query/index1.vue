<template>
   <div class="app-container">
   <el-pro-table
      ref="proTableRef"
      :columns="columns"
      :request="fetchList"
      :params="requestParams"
      :before-search-submit="beforeSearchSubmit"
      :page-size="PAGE_SIZE"
      :pager-config="pagerConfig"
      :summary-data="summaryData"
      :sort-remote="false"
      :editable="false"
      :show-action="false"
      row-key="receipt-query"
      border
      @reset="handleTableReset"
    />
   </div>
 
</template>

<script setup lang="ts">
import { nextTick, ref } from 'vue'
import type { ProTableColumn } from 'trek-ai-ui'

defineOptions({ name: 'ReceiptQuery' })

const PAGE_SIZE = 30

const pagerConfig = {
  pageSizes: [30, 60, 120],
}

/** 表格实例：分组切换后调用 reload 重新加载数据 */
const proTableRef = ref<any>(null)

/**
 * 请求附加2参数：分组字段走 params 而非搜索表单。
 * 原因：columns 替换会触发组件内部 columnsSearchSignature 变化 →
 * initSearchItems 将 searchForm 重置为默认值（不含 group），勾选值会丢；
 * params 与 searchForm 合并下发（searchForm 优先），不受表单重置影响。
 */
const requestParams = ref<Record<string, any>>({})

// 明细模式列（静态常量，分组切换时整体替换 columns 引用）：
// treeSelect 树数据在挂载后异步写入列的 searchProps.data，切换不丢引用
const tableColumns: ProTableColumn[] = [
  // ==================== 表格列（数组顺序即表格列顺序，序号列由 showSeq 内置渲染） ====================
  {
    field: 'useArea',
    title: '用料地区',
    searchable: true,
    searchType: 'select',
    searchSort: 1,
    // 地区选项挂载后异步加载，结果写入 searchProps.options
    requestOptions: () => fetchOptions('useArea'),
    optionsCacheKey: 'receipt-query:v5:useArea',
  },
  {
    field: 'warehouse',
    title: '仓库',
    searchable: true,
    searchType: 'select',
    searchSort: 2,
    searchProps: { options: [] },
    // 仓库依赖地区：地区变化时清空仓库值并按地区异步拉取仓库列表
    dependsOn: ['useArea'],
    async onDependencyChange({
      form,
      changedField,
      setFieldValue,
      setFieldProps,
    }) {
      if (changedField !== 'useArea') return
      setFieldValue('warehouse', undefined)
      const options = form.useArea
        ? await fetchOptions('warehouse', form.useArea)
        : []
      setFieldProps('warehouse', { options })
    },
  },
  {
    field: 'stockAttr',
    title: '存货属性',
    type: 'tag',
    searchable: true,
    searchType: 'select',
    searchSort: 23,
    requestOptions: () => fetchOptions('stockAttr'),
    optionsCacheKey: 'receipt-query:v5:stockAttr',
  },
  {
    field: 'project',
    title: '项目',
  },
  {
    field: 'supplyUnit',
    title: '供货单位',
  },
  {
    field: 'supplier',
    title: '供应商',
  },
  {
    field: 'source',
    title: '来源',
    searchable: true,
    searchType: 'select',
    searchSort: 15,
    requestOptions: () => fetchOptions('source'),
    optionsCacheKey: 'receipt-query:v5:source',
  },
  {
    field: 'purchaseMode',
    title: '采购方式',
    searchable: true,
    searchType: 'select',
    searchSort: 22,
    requestOptions: () => fetchOptions('purchaseMode'),
    optionsCacheKey: 'receipt-query:v5:purchaseMode',
  },
  {
    field: 'sku',
    title: 'SKU码',
    searchable: true,
    searchType: 'input',
    hideInTable: true,
    searchSort: 23,
  },
  {
    field: 'supplyOrderNo',
    title: '供货单号/采购订单号',
    type: 'link',
  },
  {
    field: 'invoiceNo',
    title: '发票号',
    searchable: true,
    searchType: 'input',
    searchSort: 14,
  },
  {
    field: 'orderUser',
    title: '下单人',
    searchable: true,
    searchType: 'treeSelect',
    searchSort: 3,
    // treeSelect 底层 el-tree-select 选项挂 data prop（requestOptions 管线只写 options），
    // 树数据由 loadTreeSelectData 在挂载后异步写入 searchProps.data（模拟接口返回 tree）。
    // 不设 checkStrictly：单选模式下仅叶子节点（人员）可选，点击部门节点为展开
  },
  {
    field: 'orderDate',
    title: '下单日期',
    type: 'date',
  },
  {
    field: 'entryDate',
    title: '单据录入日期',
    type: 'date',
  },
  {
    field: 'registerUser',
    title: '登卡人',
    searchable: true,
    searchType: 'treeSelect',
    searchSort: 8,
    // 同下单人：树数据由 loadTreeSelectData 异步写入 searchProps.data；仅叶子节点可选
  },
  {
    field: 'registerDate',
    title: '登卡日期',
    type: 'date',
  },
  {
    field: 'auditUser',
    title: '审核人',
  },
  {
    field: 'recheckUser',
    title: '核对人',
  },
  {
    field: 'recheckDate',
    title: '核对日期',
    type: 'date',
    searchable: true,
    searchType: 'date',
    searchSort: 20,
  },
  {
    field: 'voucherNo',
    title: '凭证号',
    searchable: true,
    searchType: 'input',
    searchSort: 18,
  },
  {
    field: 'amount',
    title: '金额',
    type: 'amount',
    searchable: true,
    searchType: 'number',
    searchSort: 10,
    searchProps: { controlsPosition: 'right', precision: 2 },
  },
  {
    field: 'price',
    title: '单价',
    type: 'amount',
    searchable: true,
    searchType: 'number',
    searchSort: 9,
    searchProps: { controlsPosition: 'right', precision: 2 },
  },
  {
    field: 'purchasePrice',
    title: '采购单价',
    type: 'amount',
  },
  {
    field: 'purchaseAmount',
    title: '采购金额',
    type: 'amount',
  },
  {
    field: 'stockPrice',
    title: '库存单价',
    type: 'amount',
  },
  {
    field: 'inAmount',
    title: '入库金额',
    type: 'amount',
  },
  {
    field: 'stockAmount',
    title: '库存金额',
    type: 'amount',
  },
  {
    field: 'priceDiff',
    title: '差异',
    type: 'amount',
  },
  // 设计图中右侧区块重复出现的列
  {
    field: 'invoiceNo',
    title: '发票号',
  },
  {
    field: 'recheckDate',
    title: '核对日期',
    type: 'date',
  },
  {
    field: 'voucherNo',
    title: '凭证号',
  },
  {
    field: 'supplierKind',
    title: '采购种类',
    type: 'dict',
    searchable: true,
    searchType: 'select',
    searchSort: 19,
    requestOptions: () => fetchOptions('supplierKind'),
    optionsCacheKey: 'receipt-query:v5:supplierKind',
  },
  {
    field: 'unit',
    title: '单位',
  },
  {
    field: 'inQty',
    title: '入库数量',
    type: 'amount',
  },
  {
    field: 'purchaseQty',
    title: '采购数量',
    type: 'amount',
  },
  {
    field: 'remark',
    title: '备注',
  },

  // ==================== 仅搜索字段（不显示在表格） ====================
  {
    field: 'queryDate',
    title: '日期',
    hideInTable: true,
    searchable: true,
    searchType: 'dateRange',
    searchSort: 0,
    searchPrefix: {
      field: 'queryType',
      searchType: 'select',
      dict: [
        { label: '下单日期', value: 'xiadan' },
        { label: '出库日期', value: 'chuku' },
      ],
      searchDefaultValue: 'xiadan',
      searchProps: { clearable: false },
    },
  },
  {
    field: 'inOrderCode',
    title: '入库单号',
    hideInTable: true,
    searchable: true,
    searchType: 'input',
    searchSort: 4,
  },
  {
    field: 'materialCode',
    title: '物资编码',
    hideInTable: true,
    searchable: true,
    searchType: 'input',
    searchSort: 5,
  },
  {
    field: 'materialName',
    title: '物资名称',
    hideInTable: true,
    searchable: true,
    searchType: 'input',
    searchSort: 6,
  },
  {
    field: 'specModel',
    title: '规格型号',
    hideInTable: true,
    searchable: true,
    searchType: 'input',
    searchSort: 7,
  },
  {
    field: 'orderStatus',
    title: '单据状态',
    type: 'dict',
    hideInTable: true,
    searchable: true,
    searchType: 'select',
    searchSort: 11,
    requestOptions: () => fetchOptions('orderStatus'),
    optionsCacheKey: 'receipt-query:v5:orderStatus',
  },
  {
    field: 'order2Status',
    title: '核对状态',
    type: 'dict',
    hideInTable: true,
    searchable: true,
    searchType: 'select',
    searchSort: 12,
    requestOptions: () => fetchOptions('order2Status'),
    optionsCacheKey: 'receipt-query:v5:order2Status',
  },
  {
    field: 'financeDate',
    title: '财务日期',
    hideInTable: true,
    searchable: true,
    searchType: 'date',
    searchSort: 13,
    // 初始为年选择器（与前缀 searchDefaultValue: 'year' 匹配）
    searchProps: { type: 'year', valueFormat: 'YYYY' },
    // 前缀切换年/月时动态更换选择器粒度；两种粒度值格式不同（YYYY / YYYY-MM），切换时清空已选值
    dependsOn: ['financeDateType'],
    onDependencyChange({ form, changedField, setFieldValue, setFieldProps }) {
      if (changedField !== 'financeDateType') return
      setFieldValue('financeDate', undefined)
      const isYear = form.financeDateType === 'year'
      setFieldProps('financeDate', {
        type: isYear ? 'year' : 'month',
        valueFormat: isYear ? 'YYYY' : 'YYYY-MM',
      })
    },
    searchPrefix: {
      field: 'financeDateType',
      searchType: 'select',
      dict: [
        { label: '年', value: 'year' },
        { label: '月', value: 'month' },
      ],
      searchDefaultValue: 'year',
      searchProps: { clearable: false },
    },
  },
  {
    field: 'sourceType',
    title: '来源方式',
    type: 'dict',
    hideInTable: true,
    searchable: true,
    searchType: 'select',
    searchSort: 16,
    requestOptions: () => fetchOptions('sourceType'),
    optionsCacheKey: 'receipt-query:v5:sourceType',
  },
  {
    field: 'refOrder',
    title: '引用单据',
    hideInTable: true,
    searchable: true,
    searchType: 'select',
    searchSort: 17,
    requestOptions: () => fetchOptions('refOrder'),
    optionsCacheKey: 'receipt-query:v5:refOrder',
  },
  {
    field: 'docDate',
    title: '单据日期',
  },
  {
    field: 'supplierName',
    title: '供应商名称',
    hideInTable: true,
    searchable: true,
    searchType: 'input',
    searchSort: 26,
  },
  {
    field: 'group',
    title: '分组汇总',
    hideInTable: true,
    searchable: true,
    searchType: 'checkbox',
    searchSort: 24,
    // 勾选变化即切换视图：明细 ⇄ 分组聚合（表格列重建 + 重置第一页重新加载）
    searchProps: {
      onChange: (val: unknown) =>
        handleGroupChange(Array.isArray(val) ? val : []),
      options: [
        { label: '自制品/供货单位', value: 'selfSupplyUnit' },
        { label: '用料地区', value: 'useArea' },
        { label: '仓库', value: 'warehouse' },
        { label: '入库单号', value: 'inOrderCode' },
        { label: '货品编号', value: 'goodsCode' },
        { label: '供应商名称', value: 'supplierName' },
        { label: '供应商简称', value: 'supplierShortName' },
      ],
    },
  },
]

/** 响应式列：分组汇总勾选变化时整体替换（明细 ⇄ 分组聚合） */
const columns = ref<ProTableColumn[]>(tableColumns)

// ==================== 分组汇总：动态列构建 ====================

/** 分组字段 → 表格列（勾选顺序即列顺序） */
const GROUP_COLUMNS: Record<string, ProTableColumn> = {
  selfSupplyUnit: { field: 'selfSupplyUnit', title: '自制品/供货单位' },
  useArea: { field: 'useArea', title: '用料地区' },
  warehouse: { field: 'warehouse', title: '仓库' },
  inOrderCode: { field: 'inOrderCode', title: '入库单号' },
  goodsCode: { field: 'goodsCode', title: '货品编号' },
  supplierName: { field: 'supplierName', title: '供应商名称' },
  supplierShortName: { field: 'supplierShortName', title: '供应商简称' },
}

/** 聚合列：分组模式下展示的数量/金额合计（复用明细列定义，格式化一致） */
const AGG_FIELDS = [
  'inQty',
  'purchaseQty',
  'amount',
  'purchaseAmount',
  'inAmount',
]

/**
 * 分组汇总勾选变化：
 * - 有勾选 → 表格列 = 勾选分组列（按勾选顺序）+ 聚合列，搜索字段全量保留
 *   （表格可见的搜索列克隆为 hideInTable，searchProps 引用共享不丢树/级联配置）
 * - 取消全部勾选 → 恢复明细列
 * 列重建后重置到第一页并 reload（searchForm 已随勾选同步，group 参数随请求下发）
 */
function handleGroupChange(groups: string[]) {
  // 分组字段随 params 下发（见 requestParams 注释）
  requestParams.value = groups.length ? { group: groups } : {}
  if (groups.length) {
    const aggColumns = AGG_FIELDS.map(
      (f) =>
        tableColumns.find((c) => c.field === f) ?? {
          field: f,
          title: f,
          type: 'amount',
        }
    )
    // 搜索字段视图：所有 searchable 列保留在搜索区；表格可见的克隆为 hideInTable
    const searchColumns = tableColumns
      .filter((c) => c.searchable)
      .map((c) =>
        c.hideInTable ? c : ({ ...c, hideInTable: true } as ProTableColumn)
      )
    columns.value = [
      ...groups.map((f) => GROUP_COLUMNS[f]).filter(Boolean),
      ...aggColumns,
      ...searchColumns,
    ]
  } else {
    columns.value = tableColumns
  }
  nextTick(() => {
    proTableRef.value?.setPageInfo?.({ pageNum: 1 })
    proTableRef.value?.reload?.()
  })
}

/** 重置：清除分组参数并恢复明细列（与搜索区勾选清空保持一致） */
function handleTableReset() {
  requestParams.value = {}
  columns.value = tableColumns
}

const summaryData = ref<Array<{ label: string; value: string | number }>>([])

/**
 * 下拉/字典选项 mock 数据：模拟接口返回的对象数组 { label, value }
 * value 与展示标签一致（label 即 value），与服务端 mock 行数据对齐，
 * 搜索提交的值可直接命中行数据；warehouse 通过 parent 字段与用料地区级联
 */
/** mock 选项节点：select 用扁平 { label, value }，treeSelect 用 children 嵌套 */
interface MockOption {
  label: string
  value: string
  /** 仓库选项的级联父级（用料地区） */
  parent?: string
  /** treeSelect 树形子节点 */
  children?: MockOption[]
}

const MOCK_OPTIONS: Record<string, MockOption[]> = {
  useArea: [
    { label: '华北地区', value: '华北地区' },
    { label: '华东地区', value: '华东地区' },
    { label: '华南地区', value: '华南地区' },
    { label: '西南地区', value: '西南地区' },
    { label: '西北地区', value: '西北地区' },
    { label: '东北地区', value: '东北地区' },
  ],
  warehouse: [
    { label: '北京中心仓', value: '北京中心仓', parent: '华北地区' },
    { label: '天津备件仓', value: '天津备件仓', parent: '华北地区' },
    { label: '上海中心仓', value: '上海中心仓', parent: '华东地区' },
    { label: '杭州备件仓', value: '杭州备件仓', parent: '华东地区' },
    { label: '广州中心仓', value: '广州中心仓', parent: '华南地区' },
    { label: '深圳备件仓', value: '深圳备件仓', parent: '华南地区' },
    { label: '成都中心仓', value: '成都中心仓', parent: '西南地区' },
    { label: '西安中心仓', value: '西安中心仓', parent: '西北地区' },
    { label: '沈阳中心仓', value: '沈阳中心仓', parent: '东北地区' },
  ],
  // 模拟接口返回的组织树：部门 → 人员（treeSelect 用 children 嵌套）
  // 部门节点仅作分组（叶子模式不可选），叶子 value 为人员姓名，与行数据对齐
  orderUser: [
    {
      label: '采购部',
      value: 'dept-purchase',
      children: [
        { label: '张伟', value: '张伟' },
        { label: '李娜', value: '李娜' },
        { label: '王强', value: '王强' },
      ],
    },
    {
      label: '物资部',
      value: 'dept-material',
      children: [
        { label: '赵敏', value: '赵敏' },
        { label: '刘洋', value: '刘洋' },
      ],
    },
    {
      label: '工程部',
      value: 'dept-engineering',
      children: [
        { label: '孙浩', value: '孙浩' },
        { label: '马云飞', value: '马云飞' },
      ],
    },
  ],
  registerUser: [
    {
      label: '仓储一组',
      value: 'wh-group1',
      children: [
        { label: '陈静', value: '陈静' },
        { label: '杨帆', value: '杨帆' },
      ],
    },
    {
      label: '仓储二组',
      value: 'wh-group2',
      children: [
        { label: '周杰', value: '周杰' },
        { label: '吴丹', value: '吴丹' },
      ],
    },
  ],
  stockAttr: [
    { label: '原材料', value: '原材料' },
    { label: '半成品', value: '半成品' },
    { label: '成品', value: '成品' },
    { label: '低值易耗品', value: '低值易耗品' },
  ],
  source: [
    { label: '采购入库', value: '采购入库' },
    { label: '生产入库', value: '生产入库' },
    { label: '退货入库', value: '退货入库' },
    { label: '调拨入库', value: '调拨入库' },
    { label: '盘盈入库', value: '盘盈入库' },
  ],
  sourceType: [
    { label: '手工录入', value: '手工录入' },
    { label: '批量导入', value: '批量导入' },
    { label: '系统接口', value: '系统接口' },
    { label: '扫码入库', value: '扫码入库' },
  ],
  refOrder: [
    { label: '销售单', value: '销售单' },
    { label: '采购单', value: '采购单' },
    { label: '退货单', value: '退货单' },
    { label: '调拨单', value: '调拨单' },
  ],
  supplierKind: [
    { label: '集中采购', value: '集中采购' },
    { label: '分散采购', value: '分散采购' },
    { label: '框架协议', value: '框架协议' },
    { label: '紧急采购', value: '紧急采购' },
  ],
  purchaseMode: [
    { label: '自制', value: '自制' },
    { label: '外购', value: '外购' },
    { label: '委外加工', value: '委外加工' },
  ],
  orderStatus: [
    { label: '待审核', value: '待审核' },
    { label: '已审核', value: '已审核' },
    { label: '已核对', value: '已核对' },
    { label: '已关闭', value: '已关闭' },
    { label: '已作废', value: '已作废' },
  ],
  order2Status: [
    { label: '未核对', value: '未核对' },
    { label: '核对中', value: '核对中' },
    { label: '已核对', value: '已核对' },
    { label: '核对异常', value: '核对异常' },
  ],
}

/** 模拟异步拉取下拉选项（延迟 200ms）：返回对象数组；parent 用于级联（仓库按地区过滤） */
async function fetchOptions(field: string, parent?: string) {
  await new Promise((resolve) => setTimeout(resolve, 200))
  const list = MOCK_OPTIONS[field] ?? []
  return parent ? list.filter((item) => item.parent === parent) : list
}

/**
 * treeSelect 字段树数据异步加载：el-tree-select 选项挂 data prop，
 * requestOptions 管线只写 options，故挂载后手动把树写入 searchProps.data
 * （columns 为 ref，赋值经响应式代理触发搜索区重渲染，与 requestOptions 同机制）
 */
async function loadTreeSelectData() {
  const [orderUserTree, registerUserTree] = await Promise.all([
    fetchOptions('orderUser'),
    fetchOptions('registerUser'),
  ])
  const treeFields: Array<[string, MockOption[]]> = [
    ['orderUser', orderUserTree],
    ['registerUser', registerUserTree],
  ]
  treeFields.forEach(([field, tree]) => {
    const col = tableColumns.find((item) => item.field === field)
    if (col) col.searchProps = { ...(col.searchProps || {}), data: tree }
  })
}
loadTreeSelectData()

/**
 * 提交前参数变换：前缀选择器决定日期值落到哪个查询字段
 * - 日期（queryDate，dateRange）+ queryType：下单日期 → orderDate，出库日期 → outDate
 * - 财务日期（financeDate，date）+ financeDateType：日期 → financeDate，年月 → financeMonth
 * 前缀字段本身的值（queryType / financeDateType）不再作为查询参数下发
 */
function beforeSearchSubmit(values: Record<string, any>) {
  const params: Record<string, any> = { ...values }

  // 日期：按 queryType 选中的类型赋给对应字段
  if ('queryDate' in params) {
    if (params.queryDate) {
      const target = params.queryType === 'chuku' ? 'outDate' : 'orderDate'
      params[target] = params.queryDate
    }
    delete params.queryDate
  }
  delete params.queryType

  // 财务日期：按 financeDateType 选中的粒度赋给对应字段（年 → financeYear，月 → financeMonth）
  if ('financeDate' in params) {
    if (params.financeDate) {
      const target =
        params.financeDateType === 'year' ? 'financeYear' : 'financeMonth'
      params[target] = params.financeDate
    }
    delete params.financeDate
  }
  delete params.financeDateType

  return params
}

const fetchList = async (params: Record<string, any>) => {
  const res = await fetch('/api/receipt-query/list', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  })
  const json = await res.json()
  summaryData.value = json.summary || []
  return {
    data: json.data || [],
    total: json.total || 0,
    success: json.success !== false,
  }
}
</script>
