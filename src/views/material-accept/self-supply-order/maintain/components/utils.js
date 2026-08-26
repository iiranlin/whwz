// 验收状态映射（供验收历史弹窗使用）
export const CheckStatusMap = {
  finish: '1',
  part: '0',
  refuse: '2',
  getIcon(code) {
    switch (code) {
      case this.finish: return 'icon_history_finish'
      case this.part: return 'icon_history_part'
      case this.refuse: return 'icon_history_refuse'
      default: return ''
    }
  },
  getName(code) {
    switch (code) {
      case this.finish: return '通过'
      case this.part: return '部分通过'
      case this.refuse: return '撤销验收'
      default: return ''
    }
  },
  getColor(code) {
    switch (code) {
      case this.finish: return '#56d436'
      case this.part: return '#ffbf44'
      case this.refuse: return '#fa4b30'
      default: return '#002748'
    }
  }
}
