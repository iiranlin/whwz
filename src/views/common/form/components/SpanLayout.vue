<template>
  <div>
    <div v-if="mode === 'DESIGN'">
      <draggable class="l-drag-from" :list="_items" group="form"
                 :options="{animation: 300, chosenClass:'choose', sort:true}"
                 @start="drag = true; selectFormItem = null" @end="drag = false">
        <div v-for="(cp, id) in _items" :key="id" class="l-form-item" @click.stop="selectItem(cp)"
             :style="getSelectedClass(cp)">
          <div class="l-form-header">
            <p><span v-if="cp.props.required">*</span>{{ cp.title }}</p>
            <div class="l-option">
              <!--<i class="el-icon-copy-document" @click="copy"></i>-->
              <i class="el-icon-close" @click="delItem(id)"></i>
            </div>
            <form-design-render :config="cp"/>
          </div>
        </div>
      </draggable>
      <div style="color: #c0bebe;text-align: center; width: 90%; padding: 5px;">☝ 拖拽控件到布局容器内部</div>
    </div>
    <div v-else>
      <el-row :gutter="20" v-for="(rows, rsi) in __items" :key="rsi + '_rows'">
        <el-col :span="24 / rows.length" v-for="(item, ri) in rows" :key="ri + '_row'">
          <el-form-item v-if="item.name !== 'SpanLayout' && item.name !== 'Description'" :prop="item.id"
                        :label="item.title" :key="item.name + ri">
            <form-design-render v-model="_value[item.id]" :mode="mode" :config="item"/>
          </el-form-item>
          <form-design-render v-else v-model="_value" :mode="mode" :config="item"/>
        </el-col>
      </el-row>

    </div>

  </div>

</template>

<script setup name="SpanLayout">
import { computed, reactive, ref } from 'vue'
import { ElMessageBox } from 'element-plus'
import draggable from "vuedraggable";
import FormDesignRender from '@/views/admin/layout/form/FormDesignRender'
import { useProcessStore } from '@/store/modules/process'

const props = defineProps({
  value: {
    default: null
  },
  items: {
    type: Array,
    default: () => {
      return []
    }
  },
  mode: {
    type: String,
    default: 'DESIGN'
  },
  required: {
    type: Boolean,
    default: false
  },
})
const emit = defineEmits(['input'])

const processStore = useProcessStore()

const _value = computed({
  get() { return props.value },
  set(v) { emit('input', v) }
})

const _items = computed({
  get() {
    return props.items;
  },
  set(val) {
    // items 是 prop，保持与原 computed setter 行为一致
  }
})

const __items = computed(() => {
  let result = []
  for (let i = 0; i < props.items.length; i++) {
    if (i > 0 && i % 2 > 0) {
      result.push([props.items[i - 1], props.items[i]])
    }
  }
  if (result.length * 2 < props.items.length) {
    result.push([props.items[props.items.length - 1]])
  }
  return result
})

const selectFormItem = computed({
  get() {
    return processStore.selectFormItem
  },
  set(val) {
    processStore.setSelectFormItem(val)
  },
})

const nodeMap = computed(() => {
  return processStore.nodeMap
})

const select = ref(null)
const drag = ref(false)
const formConfig = reactive({
  data: {},
  rules: {}
})
const form = reactive({
  formId: '',
  formName: "",
  logo: {},
  formItems: [],
  process: {},
  remark: ""
})

function selectItem(cp) {
  selectFormItem.value = cp
}
function getSelectedClass(cp) {
  return selectFormItem.value && selectFormItem.value.id === cp.id ?
      'border-left: 4px solid #f56c6c' : ''
}
function delItem(index) {
  ElMessageBox.confirm('删除组件将会连带删除包含该组件的条件以及相关设置，是否继续?', '提示', {
    confirmButtonText: '确 定',
    cancelButtonText: '取 消',
    type: 'warning'
  }).then(() => {
    if (_items.value[index].name === 'SpanLayout') {
      //删除的是分栏则遍历删除分栏内所有子组件
      _items.value[index].props.items.forEach(item => {
        removeFormItemAbout(item)
      })
      _items.value[index].props.items.length = 0
    } else {
      removeFormItemAbout(_items.value[index])
    }
    _items.value.splice(index, 1)
  })
}
async function removeFormItemAbout(item) {
  nodeMap.value.forEach(node => {
    //搜寻条件，进行移除
    if (node.type === 'CONDITION') {
      node.props.groups.forEach(group => {
        let i = group.cids.remove(item.id)
        if (i > -1) {
          //从子条件移除
          group.conditions.splice(i, 1)
        }
      })
    }
    //搜寻权限，进行移除
    if (node.type === 'ROOT' || node.type === 'APPROVAL' || node.type === 'CC') {
      node.props.formPerms.removeByKey('id', item.id)
    }
  })
}
</script>

<style lang="scss" scoped>


.choose {
  border: 1px dashed #1890FF !important;
}

.l-drag-from {
  min-height: 50px;
  background-color: rgb(245, 246, 246);

  .l-form-item, li {
    cursor: grab;
    background: #ffffff;
    padding: 10px;
    border: 1px solid #ebecee;
    margin: 5px 0;
  }
}

.l-form-header {
  font-size: small;
  color: #818181;
  text-align: left;
  position: relative;
  background-color: #fff;

  p {
    position: relative;
    margin: 0 0 10px 0;

    span {
      position: absolute;
      left: -8px;
      top: 3px;
      color: rgb(217, 0, 19);
    }
  }

  .l-option {
    position: absolute;
    top: -10px;
    right: -10px;

    i {
      font-size: large;
      cursor: pointer;
      color: #8c8c8c;
      padding: 5px;

      &:hover {
        color: #1890FF;
      }
    }
  }
}

</style>
