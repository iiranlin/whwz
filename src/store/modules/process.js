import { defineStore } from 'pinia'

export const useProcessStore = defineStore('process', {
  state: () => ({
    nodeMap: new Map(),
    isEdit: null,
    selectedNode: {},
    selectFormItem: null,
    design: {},
    runningList: [],
    noTakeList: [],
    endList: [],
    diagramMode: 'design',
    groupId: null,
  }),

  actions: {
    setSelectedNode(val) {
      this.selectedNode = val
    },
    loadForm(val) {
      this.design = val
    },
    setIsEdit(val) {
      this.isEdit = val
    },
    setDiagramMode(mode) {
      this.diagramMode = mode
    },
    setSelectFormItem(item) {
      this.selectFormItem = item
    },
    updateNodeMap(map) {
      // 替换整个引用，避免在 reactive Map 上 clear/set/delete 触发递归 effect
      this.nodeMap = map
    },
  },
})
export default useProcessStore