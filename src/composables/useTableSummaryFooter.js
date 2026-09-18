/**
 * useTableSummaryFooter
 * ────────────────────────────────────────────────────
 * 为 el-pro-table 开启原生 footer 行，并用 DOM 操作将所有 td 合并成
 * 一个 colspan=可见列数 的大单元格，展示自定义 summaryData。
 *
 * 内部统一处理：
 *   - footerConfig computed（enabled + method 返回占位空数组）
 *   - applySummaryFooter() DOM 合并函数（带 signature guard 避免重复重写）
 *   - watch(summaryData, deep, flush:'post')  内容变 → 重写 HTML
 *   - watch(columns, flush:'post')             数组引用变（groupBy/tab 切换）→ colspan 更新
 *   注意：watch(columns) 不加 deep —— 只追踪数组引用整体替换，
 *   避免深度递归列对象属性触发 pro-table 内部响应式循环（曾导致闪现 bug）。
 *
 * 参数:
 *   {Ref}   summaryData  - summary items ref，每项 { label, value }
 *   {Ref}   columns     - 列定义 ref（tableJsonList / columns / columnsData 均可）
 *   {Object} proTableRef - el-pro-table 组件 ref
 *
 * 返回:
 *   { footerConfig }     - 直接作为 pro-table 的 :footer-config 绑定值
 *
 * 使用示例:
 *   import { useTableSummaryFooter } from '@/composables/useTableSummaryFooter'
 *   const { footerConfig } = useTableSummaryFooter({
 *     summaryData, columns: tableJsonList, proTableRef,
 *   })
 *   // 模板: :footer-config="footerConfig"
 * ────────────────────────────────────────────────────
 */
import { computed, nextTick, watch } from 'vue'

export function useTableSummaryFooter({ summaryData, columns, proTableRef }) {
  const footerConfig = computed(() => ({
    enabled: true,
    method: () => Array(columns.value.length || 1).fill('')
  }))

  // 签名 guard：内容没变就跳过，避免不必要的 DOM 重写
  let _sig = ''
  function applySummaryFooter() {
    nextTick(() => {
      const proTableEl = proTableRef.value?.$el
      if (!proTableEl || !summaryData.value?.length) return
      const footerRow = proTableEl.querySelector('.ep-table__footer tr, .el-table__footer tr')
      if (!footerRow) return

      const visibleCols = columns.value.filter(c => !c.hideInTable).length
      const colSpan = visibleCols || footerRow.children.length

      const sig = JSON.stringify({
        colSpan,
        items: summaryData.value.map(s => `${s.label}=${s.value}`).join('|')
      })
      if (sig === _sig && footerRow.querySelector('.summary-footer-cell')) return
      _sig = sig

      footerRow.innerHTML = ''
      const td = document.createElement('td')
      td.colSpan = colSpan
      td.className = 'summary-footer-cell'
      td.innerHTML = summaryData.value
        .map(s => `<span class="sf-item"><span class="sf-label">${s.label}</span><span class="sf-value">${s.value}</span></span>`)
        .join('')
      footerRow.appendChild(td)
    })
  }

  // summaryData 内容深变（接口返回新值）→ 重写 HTML
  watch(summaryData, applySummaryFooter, { deep: true, flush: 'post' })

  // 列数组引用整体替换（groupBy .map() / tab 切换 .map()）→ colspan 更新
  // 不加 deep：只追踪数组引用，不递归列对象属性（避免和 pro-table 内部响应式耦合）
  watch(columns, applySummaryFooter, { flush: 'post' })

  return { footerConfig }
}
