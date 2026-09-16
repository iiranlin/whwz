<template>
  <div class="app-container">
  <el-pro-table
      ref="proTableRef"
      :columns="columns"
      :request="fetchList"
      :params="requestParams"
      :page-size="PAGE_SIZE"
      :pager-config="pagerConfig"
      :summary-data="summaryData"
      :sort-remote="false"
      :editable="false"
      :show-action="false"
      row-key="acceptance-query"
      border
      @reset="handleTableReset"
    />
  </div>
  
</template>

<script setup lang="ts">
import { nextTick, ref } from 'vue'
import type { ProTableColumn } from 'trek-ai-ui'

defineOptions({ name: 'AcceptanceQuery' })

const PAGE_SIZE = 30

const pagerConfig = {
  pageSizes: [30, 60, 120],
}

/** 表格实例：分组切换后调用 reload 重新加载1数据 */
const proTableRef = ref<any>(null)

/**
 * 请求附加参数：分组字段走 params 而非搜索表单。
 * 原因：columns 替换会触发组件内部 columnsSearchSignature 变化 →
 * initSearchItems 将 searchForm 重置为默认值（不含 group），勾选值会丢；
 * params 与 searchForm 合并下发（searchForm 优先），不受表单重置影响。
 */
const requestParams = ref<Record<string, any>>({})

// 明细模式列（静态常量，分组切换时整体替换 columns 引用）
const tableColumns: ProTableColumn[] = [
  {
    field: 'purchaseOrderNo',
    title: '采购订单号',
    type: 'link',
    searchable: true,
    searchType: 'input',
  },
  {
    field: 'contractNo',
    title: '合同号',
  },
  {
    field: 'supplier',
    title: '供应商',
    searchable: true,
    searchType: 'input',
  },
  {
    field: 'useArea',
    title: '用料地区',
    searchable: true,
    searchType: 'select',
    searchProps: {
      options: [
        { label: '华东地区', value: '华东地区' },
        { label: '华南地区', value: '华南地区' },
        { label: '华北地区', value: '华北地区' },
        { label: '西南地区', value: '西南地区' },
        { label: '东北地区', value: '东北地区' },
      ],
    },
  },
  {
    field: 'applyUnit',
    title: '申请单位',
    searchable: true,
    searchType: 'select',
    searchProps: {
      options: [
        { label: '北京动车段', value: '北京动车段' },
        { label: '丰台机务段', value: '丰台机务段' },
        { label: '北京车辆段', value: '北京车辆段' },
        { label: '天津机务段', value: '天津机务段' },
      ],
    },
  },
  {
    field: 'purchaseMode',
    title: '采购方式',
  },
  {
    field: 'materialCode',
    title: '物资编号',
    searchable: true,
    searchType: 'input',
  },
  {
    field: 'materialName',
    title: '物资名称',
    searchable: true,
    searchType: 'input',
  },
  {
    field: 'specModel',
    title: '规格型号/材质/图号',
  },
  {
    field: 'unit',
    title: '计量单位',
  },
  {
    field: 'originBrand',
    title: '产地/品牌',
  },
  {
    field: 'price',
    title: '单价',
    type: 'amount',
  },
  {
    field: 'deliverQty',
    title: '发货数量',
    type: 'amount',
  },
  {
    field: 'arriveQty',
    title: '到货确认数量',
    type: 'amount',
  },
  {
    field: 'acceptQty',
    title: '验收通过数量',
    type: 'amount',
  },
  {
    field: 'purchaseAmount',
    title: '采购金额',
    type: 'amount',
  },
  {
    field: 'makeUser',
    title: '制单人',
  },
  {
    field: 'makeDate',
    title: '制单日期',
    type: 'date',
  },
  {
    field: 'operateUnit',
    title: '操作单位',
  },
  {
    field: 'operateUser',
    title: '操作人',
  },
  {
    field: 'deliverBatchNo',
    title: '发货批次号',
  },
  {
    field: 'acceptCount',
    title: '验收次数',
    type: 'number',
  },
  {
    field: 'deliverDate',
    title: '发货日期',
    type: 'date',
    searchable: true,
    searchType: 'dateRange',
  },
  {
    field: 'acceptStatus',
    title: '验收状态',
    type: 'tag',
    searchable: true,
    searchType: 'select',
    searchProps: {
      options: [
        { label: '通过', value: '通过' },
        { label: '不通过', value: '不通过' },
        { label: '待退换货', value: '待退换货' },
        { label: '已退货', value: '已退货' },
        { label: '已换货', value: '已换货' },
      ],
    },
  },
  {
    field: 'acceptRecord',
    title: '验收记录',
    type: 'link',
  },
  {
    field: 'qtyMismatch',
    title: '发货数量与验收数量不一致',
    hideInTable: true,
    searchable: true,
    searchType: 'checkbox',
    searchProps: {
      options: [
        {
          label: '发货数量与验收数量不一致',
          value: '发货数量与验收数量不一致',
        },
      ],
    },
  },
  {
    field: 'acceptLevel',
    title: '验收级别',
    hideInTable: true,
    searchable: true,
    searchType: 'select',
    searchProps: {
      options: [
        { label: '一级验收', value: '一级验收' },
        { label: '多级验收', value: '多级验收' },
      ],
    },
  },

  // ==================== 仅搜索字段（不显示在表格） ====================
  {
    field: 'group',
    title: '分组汇总',
    hideInTable: true,
    searchable: true,
    searchType: 'checkbox',
    // 勾选变化即切换视图：明细 ⇄ 分组聚合（表格列重建 + 重置第一页重新加载）
    searchProps: {
      onChange: (val: unknown) =>
        handleGroupChange(Array.isArray(val) ? val : []),
      options: [
        { label: '用料地区', value: 'useArea' },
        { label: '申请单位', value: 'applyUnit' },
        { label: '采购方式', value: 'purchaseMode' },
        { label: '供应商', value: 'supplier' },
        { label: '采购订单', value: 'purchaseOrderNo' },
        { label: '物资', value: 'materialCode' },
        { label: '验收状态', value: 'acceptStatus' },
      ],
    },
  },
]

/** 响应式列：分组汇总勾选变化时整体替换（明细 ⇄ 分组聚合） */
const columns = ref<ProTableColumn[]>(tableColumns)

// ==================== 分组汇总：动态列构建 ====================

/**
 * 聚合列：分组模式下求和的数量/金额（复用明细列定义，格式化一致；
 * 单价为单价，不参与求和）
 */
const AGG_FIELDS = [
  'deliverQty',
  'arriveQty',
  'acceptQty',
  'purchaseAmount',
  'acceptCount',
]

/**
 * 分组汇总勾选变化：
 * - 有勾选 → 表格列 = 勾选分组列（按勾选顺序，复用明细列定义）+ 聚合列，
 *   搜索字段全量保留（表格可见的搜索列克隆为 hideInTable，searchProps 引用共享不丢下拉配置）
 * - 取消全部勾选 → 恢复明细列
 * 列重建后重置到第一页并 reload（group 参数随 params 下发）
 */
function handleGroupChange(groups: string[]) {
  // 分组字段随 params 下发（见 requestParams 注释）
  requestParams.value = groups.length ? { group: groups } : {}
  if (groups.length) {
    // 分组列用纯展示定义（不带 searchable/searchProps）：搜索区由下方克隆列
    // 提供同字段搜索能力，避免同字段重复进入搜索区导致字段重挂载丢状态
    const groupColumns = groups
      .map((f) => {
        const col = tableColumns.find((c) => c.field === f)
        return col
          ? ({ field: col.field, title: col.title } as ProTableColumn)
          : undefined
      })
      .filter(Boolean) as ProTableColumn[]
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
    columns.value = [...groupColumns, ...aggColumns, ...searchColumns]
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
  // 列重建会把分组字段组件的受控值“钉”在 undefined，重置自身不再产生
  // 值变化；先写 [] 再清空制造一次变化，让勾选显示同步清空后回到钉住值
  nextTick(() => {
    proTableRef.value?.setSearchForm?.({ group: [] }, { silent: true })
    nextTick(() => {
      proTableRef.value?.setSearchForm?.({ group: undefined }, { silent: true })
    })
  })
}

const summaryData = ref<Array<{ label: string; value: string | number }>>([])

const fetchList = async (params: Record<string, any>) => {
  const res = await fetch('/api/acceptance-query/list', {
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
