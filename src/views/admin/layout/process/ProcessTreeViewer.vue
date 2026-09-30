<script>
import { defineComponent, ref, computed, h, getCurrentInstance } from 'vue'
import { ElMessage } from 'element-plus'
import { useProcessStore } from '@/store/modules/process'
import { deepClone } from '@/utils/process'

//导入所有节点组件
import Approval from '@/views/common/process/nodes/ApprovalNode.vue'
import Cc from '@/views/common/process/nodes/CcNode.vue'
import Concurrent from '@/views/common/process/nodes/ConcurrentNode.vue'
import Condition from '@/views/common/process/nodes/ConditionNode.vue'
import Trigger from '@/views/common/process/nodes/TriggerNode.vue'
import Delay from '@/views/common/process/nodes/DelayNode.vue'
import Empty from '@/views/common/process/nodes/EmptyNode.vue'
import Root from '@/views/common/process/nodes/RootNode.vue'
import Node from '@/views/common/process/nodes/Node.vue'

import DefaultProps from "./DefaultNodeProps"

// 节点类型 → 组件映射（Vue3 h 组件必须传组件对象而非字符串）
const NODE_COMPONENTS = {
  approval: Approval,
  cc: Cc,
  concurrent: Concurrent,
  condition: Condition,
  trigger: Trigger,
  delay: Delay,
  empty: Empty,
  root: Root,
  node: Node,
}

export default defineComponent({
  name: "ProcessTreeViewer",
  components: {Node, Root, Approval, Cc, Trigger, Concurrent, Condition, Delay, Empty},
  setup(props, { emit }) {
    const proxy = getCurrentInstance().proxy
    const processStore = useProcessStore()

    const valid = ref(true)
    // 替代 this.$refs：存放节点组件实例，ref callback 模式赋值
    const refsMap = ref({})

    // 本地维护 nodeMap（ref 非 reactive），render 里 .set() 不触发 effect
    const nodeMap = ref(new Map())
    const dom = computed(() => processStore.design)
    const runningList = computed(() => processStore.runningList)
    const endList = computed(() => processStore.endList)
    const noTakeList = computed(() => processStore.noTakeList)

    // dom 变化后重建 nodeMap 并同步到 store（flush:'post' 确保在 DOM patch 之后）
    function _collectNodeMap(node) {
      if (node && node.id) nodeMap.value.set(node.id, node)
      if (node.children && node.children.id) _collectNodeMap(node.children)
      if (node.branchs && node.branchs.length) {
        node.branchs.forEach(b => {
          _collectNodeMap(b)
          if (b.children && b.children.id) _collectNodeMap(b.children)
        })
      }
    }
    watch(dom, () => {
      nodeMap.value = new Map()
      _collectNodeMap(dom.value)
      processStore.updateNodeMap(nodeMap.value)
      // headerBgc 批量同步（render 里禁止修改 store.design 属性）
      _syncHeaderBgc()
    }, { deep: true, flush: 'post' })

    // 遍历节点树，根据 runningList/endList/noTakeList 一次性更新所有节点 headerBgc
    function _syncHeaderBgc() {
      function walk(node) {
        if (!node) return
        if (node.type === 'ROOT' || node.type === 'APPROVAL' || node.type === 'CC' || node.type === 'DELAY' || node.type === 'TRIGGER') {
          let bgc = '#ff943e'
          if (runningList.value.includes(node.id)) bgc = '#1e90ff'
          else if (endList.value.includes(node.id)) bgc = '#20b2aa'
          else if (noTakeList.value.includes(node.id)) bgc = '#909399'
          node.props.headerBgc = bgc
        }
        if (node.children && node.children.id) walk(node.children)
        if (node.branchs && node.branchs.length) node.branchs.forEach(b => walk(b))
      }
      walk(dom.value)
    }

    // ============ 以下为原 methods 中的所有方法 ============

    //判断是否为主要业务节点
    function isPrimaryNode(node) {
      return node &&
          (node.type === 'ROOT' || node.type === 'APPROVAL'
          || node.type === 'CC' || node.type === 'DELAY'
              || node.type === 'TRIGGER');
    }
    function isBranchNode(node) {
      return node && (node.type === 'CONDITIONS' || node.type === 'CONCURRENTS');
    }
    function isEmptyNode(node) {
      return node && (node.type === 'EMPTY')
    }
    //是分支节点
    function isConditionNode(node) {
      return node.type === 'CONDITIONS';
    }
    //是分支节点
    function isBranchSubNode(node) {
      return node && (node.type === 'CONDITION' || node.type === 'CONCURRENT');
    }
    function isConcurrentNode(node) {
      return node.type === 'CONCURRENTS'
    }
    function getRandomId() {
      return `node_${new Date().getTime().toString().substring(5)}${Math.round(Math.random()*9000+1000)}`
    }
    //id映射到map，用来向上遍历
    function toMapping(node) {
      if (node && node.id) {
        //console.log("node=> " + node.id + " name:" + node.name + " type:" + node.type)
        nodeMap.value.set(node.id, node)
      }
    }
    //解码渲染的时候插入dom到同级
    function decodeAppendDom(hFn, node, dom, props = {}) {
      props.config = node
      const Comp = NODE_COMPONENTS[node.type.toLowerCase()]
      dom.unshift(hFn(Comp, {
        ref: el => { if (el) refsMap.value[node.id] = el },
        key: node.id,
        ...props,
      }, []))
    }
    function insertCoverLine(hFn, index, doms, branchs) {
      if (index === 0) {
        //最左侧分支
        doms.unshift(hFn('div', {'class': {'line-top-left': true}}, []))
        doms.unshift(hFn('div', {'class': {'line-bot-left': true}}, []))
      }
      else if (index === branchs.length - 1) {
        //最右侧分支
        doms.unshift(hFn('div', {'class': {'line-top-right': true}}, []))
        doms.unshift(hFn('div', {'class': {'line-bot-right': true}}, []))
      }
    }
    //处理节点插入逻辑
    function copyBranch(node) {
      let parentNode = nodeMap.value.get(node.parentId)
      let branchNode = deepClone(node)
      branchNode.name = branchNode.name + '-copy'
      forEachNode(parentNode, branchNode, (parent, nodeItem) => {
        let id = getRandomId()
        console.log(nodeItem, '新id =>' + id, '老nodeId:' + nodeItem.id)
        nodeItem.id = id
        nodeItem.parentId = parent.id
      })
      parentNode.branchs.splice(parentNode.branchs.indexOf(node), 0, branchNode)
      proxy.$forceUpdate()
    }
    function branchMove(node, offset) {
      let parentNode = nodeMap.value.get(node.parentId)
      let index = parentNode.branchs.indexOf(node)
      let branch = parentNode.branchs[index + offset]
      parentNode.branchs[index + offset] = parentNode.branchs[index]
      parentNode.branchs[index] = branch
      proxy.$forceUpdate()
    }
    //选中一个节点
    function selectNode(node) {
      processStore.setSelectedNode(node)
      emit('selectedNode', node)
    }
    function insertApprovalNode(parentNode) {
      parentNode.children.name = "审批人"
      parentNode.children.props = deepClone(DefaultProps.APPROVAL_PROPS)
    }
    function insertCcNode(parentNode) {
      parentNode.children.name = "抄送人"
      parentNode.children.props = deepClone(DefaultProps.CC_PROPS)
    }
    function insertDelayNode(parentNode) {
      parentNode.children.name = "延时处理"
      parentNode.children.props = deepClone(DefaultProps.DELAY_PROPS)
    }
    function insertTriggerNode(parentNode) {
      parentNode.children.name = "触发器"
      parentNode.children.props = deepClone(DefaultProps.TRIGGER_PROPS)
    }
    function insertConditionsNode(parentNode) {
      parentNode.children.name = "条件分支"
      parentNode.children.children = {
        id: getRandomId(),
        parentId: parentNode.children.id,
        type: "EMPTY"
      }
      parentNode.children.branchs = [
        {
          id: getRandomId(),
          parentId: parentNode.children.id,
          type: "CONDITION",
          props: deepClone(DefaultProps.CONDITION_PROPS),
          name: "条件1",
          children: {}
        }, {
          id: getRandomId(),
          parentId: parentNode.children.id,
          type: "CONDITION",
          props: deepClone(DefaultProps.CONDITION_PROPS),
          name: "条件2",
          children: {}
        }
      ]
    }
    function insertConcurrentsNode(parentNode) {
      parentNode.children.name = "并行分支"
      parentNode.children.children = {
        id: getRandomId(),
        parentId: parentNode.children.id,
        type: "EMPTY"
      }
      parentNode.children.branchs = [
        {
          id: getRandomId(),
          name: "分支1",
          parentId: parentNode.children.id,
          type: "CONCURRENT",
          props: {},
          children: {}
        }, {
          id: getRandomId(),
          name: "分支2",
          parentId: parentNode.children.id,
          type: "CONCURRENT",
          props: {},
          children: {}
        }
      ]
    }
    function getBranchEndNode(conditionNode) {
      if (!conditionNode.children || !conditionNode.children.id) {
        return conditionNode;
      }
      return getBranchEndNode(conditionNode.children);
    }
    function addBranchNode(node) {
      // if (node.branchs.length < 8){
        node.branchs.push({
          id: getRandomId(),
          parentId: node.id,
          name: (isConditionNode(node) ? '条件' : '分支') + (node.branchs.length + 1),
          props: isConditionNode(node) ? deepClone(DefaultProps.CONDITION_PROPS) : {},
          type: isConditionNode(node) ? "CONDITION" : "CONCURRENT",
          children: {}
        })
      // }else {
      //   ElMessage.warning("最多只能添加 8 项😥")
      // }
    }
    //删除当前节点
    function delNode(node) {
      console.log("删除节点", node)
      //获取该节点的父节点
      let parentNode = nodeMap.value.get(node.parentId)
      if (parentNode) {
        //判断该节点的父节点是不是分支节点
        if (isBranchNode(parentNode)) {
          //移除该分支
          parentNode.branchs.splice(parentNode.branchs.indexOf(node), 1)
          //处理只剩1个分支的情况
          if (parentNode.branchs.length < 2) {
            //获取条件组的父节点
            let ppNode = nodeMap.value.get(parentNode.parentId)
            //判断唯一分支是否存在业务节点
            if (parentNode.branchs[0].children && parentNode.branchs[0].children.id) {
              //将剩下的唯一分支头部合并到主干
              ppNode.children = parentNode.branchs[0].children
              ppNode.children.parentId = ppNode.id
              //搜索唯一分支末端最后一个节点
              let endNode = getBranchEndNode(parentNode.branchs[0])
              //后续节点进行拼接, 这里要取EMPTY后的节点
              endNode.children = parentNode.children.children
              if (endNode.children && endNode.children.id) {
                endNode.children.parentId = endNode.id
              }
            } else {
              //直接合并分支后面的节点，这里要取EMPTY后的节点
              ppNode.children = parentNode.children.children
              if (ppNode.children && ppNode.children.id) {
                ppNode.children.parentId = ppNode.id
              }
            }
          }
        } else {
          //不是的话就直接删除
          if (node.children && node.children.id) {
            node.children.parentId = parentNode.id
          }
          parentNode.children = node.children
        }
        proxy.$forceUpdate()
      } else {
        ElMessage.warning("出现错误，找不到上级节点😥")
      }
    }
    function validateProcess() {
      valid.value = true
      let err = []
      validate(err, dom.value)
      return err
    }
    function validateNode(err, node) {
      const refItem = refsMap.value[node.id]
      if (refItem && refItem.validate) {
        valid.value = refItem.validate(err)
      }
    }
    //更新指定节点的dom
    function nodeDomUpdate(node) {
      const refItem = refsMap.value[node.id]
      if (refItem && refItem.$forceUpdate) {
        refItem.$forceUpdate()
      }
    }
    //给定一个起始节点，遍历内部所有节点
    function forEachNode(parent, node, callback) {
      if (isBranchNode(node)) {
        callback(parent, node)
        forEachNode(node, node.children, callback)
        node.branchs.map(branchNode => {
          callback(node, branchNode)
          forEachNode(branchNode, branchNode.children, callback)
        })
      } else if (isPrimaryNode(node) || isEmptyNode(node) || isBranchSubNode(node)) {
        callback(parent, node)
        forEachNode(node, node.children, callback)
      }
    }
    //校验所有节点设置
    function validate(err, node) {
      if (isPrimaryNode(node)) {
        validateNode(err, node)
        validate(err, node.children)
      } else if (isBranchNode(node)) {
        //校验每个分支
        node.branchs.map(branchNode => {
          //校验条件节点
          validateNode(err, branchNode)
          //校验条件节点后面的节点
          validate(err, branchNode.children)
        })
        validate(err, node.children)
      } else if (isEmptyNode(node)) {
        validate(err, node.children)
      }
    }

    // getDomTree 也给 render 调用，return 出去
    function getDomTree(hFn, node) {
      console.log(66666666666)
      toMapping(node);
      if (isPrimaryNode(node)) {
        //普通业务节点
        let childDoms = getDomTree(hFn, node.children)
        decodeAppendDom(hFn, node, childDoms)
        return [hFn('div', {'class': {'primary-node': true}}, childDoms)];
      }
      else if (isBranchNode(node)) {
        let index = 0;
        //遍历分支节点，包含并行及条件节点
        let branchItems = node.branchs.map(branchNode => {
          //处理每个分支内子节点
          toMapping(branchNode);
          let childDoms = getDomTree(hFn, branchNode.children)
          decodeAppendDom(hFn, branchNode, childDoms, {level: index + 1, size: node.branchs.length})
          //插入4条横线，遮挡掉条件节点左右半边线条
          insertCoverLine(hFn, index, childDoms, node.branchs)
          //遍历子分支尾部分支
          index++;
          return hFn('div', {'class': {'branch-node-item': true}}, childDoms);
        })

        let bchDom = [hFn('div', {'class': {'branch-node': true}}, branchItems)]
        //继续遍历分支后的节点
        let afterChildDoms = getDomTree(hFn, node.children)
        return [hFn('div', {}, [bchDom, afterChildDoms])]
      }
      else if (isEmptyNode(node)) {
        //空节点，存在于分支尾部
        let childDoms = getDomTree(hFn, node.children)
        decodeAppendDom(hFn, node, childDoms)
        return [hFn('div', {'class': {'empty-node': true}}, childDoms)];
      }
      else {
        //遍历到了末端，无子节点
        return [];
      }
    }

    // 暴露给 render 函数使用的变量和方法
    return {
      proxy,
      processStore,
      valid,
      refsMap,
      nodeMap,
      dom,
      runningList,
      endList,
      noTakeList,
      getDomTree,
      isPrimaryNode,
      isBranchNode,
      isEmptyNode,
      isConditionNode,
      isBranchSubNode,
      isConcurrentNode,
      getRandomId,
      toMapping,
      decodeAppendDom,
      insertCoverLine,
      copyBranch,
      branchMove,
      selectNode,
      insertApprovalNode,
      insertCcNode,
      insertDelayNode,
      insertTriggerNode,
      insertConditionsNode,
      insertConcurrentsNode,
      getBranchEndNode,
      addBranchNode,
      delNode,
      validateProcess,
      validateNode,
      nodeDomUpdate,
      forEachNode,
      validate,
    }
  },
  render() {
    console.log("渲染流程树")
    // render 内用本地 ref Map 构建（非 reactive，内部操作不触发 effect）
    this.nodeMap = new Map()
    let processTrees = this.getDomTree(h, this.dom)
    //插入末端节点
    processTrees.push(h('div', {style: {'text-align': 'center'}}, [
      h('div', {class: {'process-end': true}, innerHTML: '流程结束'})
    ]))
    // render 纯净：不做任何 store mutation（nodeMap 同步和 headerBgc 更新在 watch dom flush:'post' 里）
    return h('div', {class: {'_root': true}, ref: '_root'}, processTrees)
  },
  watch: {

  }
})
</script>

<style lang="scss" scoped>
._root{
 margin: 0 auto;
}
.process-end{
  width: 60px;
  margin: 0 auto;
  margin-bottom: 20px;
  border-radius: 15px;
  padding: 5px 10px;
  font-size: small;
  color: #747474;
  background-color: #f2f2f2;
  box-shadow: 0 0 10px 0 #bcbcbc;
}
.primary-node{
  display: flex;
  align-items: center;
  flex-direction: column;
}
.branch-node{
  display: flex;
  justify-content: center;
  /*border-top: 2px solid #cccccc;
  border-bottom: 2px solid #cccccc;*/
}
.branch-node-item{
  position: relative;
  display: flex;
  background: #f5f6f6;
  flex-direction: column;
  align-items: center;
  border-top: 2px solid #cccccc;
  border-bottom: 2px solid #cccccc;
  &:before{
    content: "";
    position: absolute;
    top: 0;
    left: calc(50% - 1px);
    margin: auto;
    width: 2px;
    height: 100%;
    background-color: #CACACA;
  }
  .line-top-left, .line-top-right, .line-bot-left, .line-bot-right{
    position: absolute;
    width: 50%;
    height: 4px;
    background-color: #f5f6f6;
  }
  .line-top-left{
    top: -2px;
    left: -1px;
  }
  .line-top-right{
    top: -2px;
    right: -1px;
  }
  .line-bot-left{
    bottom: -2px;
    left: -1px;
  }
  .line-bot-right{
    bottom: -2px;
    right: -1px;
  }
}
.add-branch-btn{
  position: absolute;
  width: 80px;
  .add-branch-btn-el{
    z-index: 999;
    position: absolute;
    top: -15px;
  }
}

.empty-node{
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}
</style>
