<template>
  <el-form class="form-data" :model="formData" ref="queryRef" v-show="showSearch" :inline="true"
    :label-width="labelWidth + 'px'" :style="{ 'max-height': height }">
    <el-scrollbar ref="elScrollbar" max-height="200px" :class="{ 'no-scroll': height == '100px', 'flex1': true }">
      <div class="ep-form-search" ref="elFormSearch" :style="gridColStyle">
        <el-form-item v-for="item in formJsonData" :key="item.prop" :prop="item.prop"
          :label="item.label ? item.label + '：' : ''" l :label-width="item.labelWidth ? item.labelWidth + 'px' : ''">
          <slot v-if="item.type === 'slot'" :name="item.prop" :scope="{ item }"></slot>
          <el-input v-else-if="item.type === 'input'" v-model="formData[item.prop]" placeholder="请输入"
            :clearable="!item.clearable" :style="{ 'width': inputWidth + 'px' }" @keyup.enter="handleQuery"
            :disabled="item.disabled" v-limit-text-len="50" />
          <el-select v-else-if="item.type === 'select'" v-model="formData[item.prop]" placeholder="请选择"
            :clearable="!item.clearable" :empty-values="[undefined, null, '']"
            @change="(val) => handleSelectChange(item.prop, val)" :filterable="item.filterable || false"
            :multiple="item.multiple" :collapse-tags="item.multiple" :collapse-tags-tooltip="item.multiple"
            :style="{ 'width': inputWidth + 'px' }" :disabled="item.disabled">
            <!-- <el-option v-for="dict in item.selectData || formSelectData[item.prop]" :key="dict.value" :label="item.isSelectCode?`【${dict.value}】${dict.label}`:dict.label"
              :value="dict.value" /> -->
            <el-option v-for="dict in item.selectData || formSelectData[item.prop]" :key="dict.value"
              :label="dict.label" :value="dict.value" />
          </el-select>
          <el-date-picker v-else-if="item.type === 'date'" v-model="formData[item.prop]"
            :value-format="item.valueFormat || (item.dateType ? 'YYYY-MM' : 'YYYY-MM-DD')"
            :type="item.dateType ? item.dateType : 'daterange'" range-separator="-" start-placeholder="开始日期"
            end-placeholder="结束日期" :style="{ 'width': inputWidth + 'px' }" :disabled="item.disabled"
            :clearable="!item.clearable"></el-date-picker>
          <el-radio-group v-model="formData[item.prop]" v-else-if="item.type === 'radio'" :disabled="item.disabled">
            <el-radio v-for="dict in item.selectData" :value="dict.value" :key="dict.value">{{ dict.label }}</el-radio>
          </el-radio-group>
          <el-input v-else-if="item.type === 'search'" v-model="formData[item.prop]" placeholder="请输入" :readonly="item.readonly === false ? false :true"
            :clearable="!item.clearable" :style="{ 'width': inputWidth + 'px' }" @mouseenter="handleMouseenter(item.prop)"
            @mouseleave="handleMouseleave">
            <template #suffix>
              <el-icon v-show="suffixClose" class="ep-icon-circle-close" @click="closeSearchClick(item.prop)">
                <CircleClose />
              </el-icon>
            </template>
            <template #append>
              <el-button :icon="Search" style="height: 28px;width: 0;line-height: 28px;margin-left: -20px;"
                @click="handleSearch(item.prop)"></el-button>
            </template>
          </el-input>
          <el-input v-else v-model="formData[item.prop]" placeholder="请输入" :clearable="!item.clearable"
            :style="{ 'width': inputWidth + 'px' }" @keyup.enter="handleQuery" :disabled="item.disabled"
            v-limit-text-len="50" />
        </el-form-item>
      </div>
    </el-scrollbar>
    <div class="form-right-show" v-show="isMore && isShowMore">
      <span @click="showFormClick">{{ height === '200px' ? '收起' : '展开更多' }}</span>
      <span @click="showFormClick"><svg-icon icon-class="open" /></span>
      <div class="form-right-show-y"></div>
    </div>
    <div class="form-right" :class="isMore && isShowMore ? '' : buttonClass ? 'form-rights' : ''">
      <el-button type="primary" @click="handleQuery" class="search-btn"><svg-icon
          icon-class="search" />&nbsp;查询</el-button>
      <el-button type="default" @click="resetQuery" class="reset-btn"><svg-icon
          icon-class="Line-Refresh" />&nbsp;重置</el-button>
    </div>
  </el-form>
</template>

<script setup>
const { proxy } = getCurrentInstance()
import { getCookie } from "@/utils/auth";
import { Search } from '@element-plus/icons-vue'
// 接收参数并指定类型（可选）
const props = defineProps({
  showSearch: Boolean,
  labelWidth: {
    type: String,
    default: '70'
  },
  inputWidth: {
    type: String,
    default: '220'
  },
  queryParams: {
    type: Object,
    default: () => {
      return {}
    }
  },
  formJson: {
    type: Array,
    default: []
  },
  formSelectData: {
    type: Object,
    default: {}
  },
  resizeSplitData: {
    type: Number,
    default: 0
  },
  isShowMore: {
    type: Boolean,
    default: true
  },
  buttonClass: {
    type: Boolean,
    default: true
  },
  defaultExpand: {
    type: Boolean,
    default: false
  },
  gridColCount: {
    type: [Number, String],
    default: 0
  },
})

const height = ref(props.defaultExpand ? '200px' : '100px')
const isMore = ref(false)
const suffixClose = ref(false)
const gridColStyle = computed(() => {
  const n = Number(props.gridColCount)
  if (!n) return {}
  return {
    display: 'grid',
    gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))`,
    columnGap: '10px',
    alignItems: 'center'
  }
})

const formJsonData = ref(props.formJson)

const formObj = new Object()
formJsonData.value.map(item => {
  formObj[item.prop] = ''
})

const data = reactive({
  formData: { ...formObj, ...props.queryParams } || {}
})

const { formData } = toRefs(data)

watch(() => props.queryParams, val => {
  formData.value = { ...formData.value, ...val }
}, { deep: true })

watch(() => props.resizeSplitData, val => {
  proxy.$nextTick(() => {
    const divH = document.querySelector('.ep-form-search') && document.querySelector('.ep-form-search').clientHeight
    isMore.value = divH > 100
  })
})

onMounted(() => {
  proxy.$nextTick(() => {
    const divH = document.querySelector('.ep-form-search') && document.querySelector('.ep-form-search').clientHeight
    isMore.value = divH > 100
  })
})

formJsonData.value.forEach(item => {
  if (item.dict) {
    const dictData = proxy.useDict(item.dict)
    item.selectData = dictData[item.dict]
  }
  // autoMonth true 表示默认 当前第一天---最后一天
  if (item.type === 'date' && item.autoMonth) {
    const date = new Date(getCookie("warehouseYearMonth"));
    // 当月第一天
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    // 当月最后一天
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    // yyyy-MM-dd
    const formatDate = (date) => {
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, "0");
      const d = String(date.getDate()).padStart(2, "0");
      return `${y}-${m}-${d}`;
    };
    formData.value[item.prop] = [formatDate(firstDay), formatDate(lastDay)]
  }


})

const showFormClick = () => {
  height.value = height.value === '200px' ? '100px' : '200px'
  if (proxy.$refs.elScrollbar) {
    const wrapper = proxy.$refs.elScrollbar.$el.querySelector('.ep-scrollbar__wrap')
    wrapper.scrollTop = 0 // 直接设置 scrollTop 属性到 0
  }
}

// 声明触发的事件（可选，增强类型校验）
const emit = defineEmits(['handleQuery', 'resetQuery', 'handleSelectChange', 'handleSearch', 'closeSearchClick'])

const handleSelectChange = (code, value) => {
  emit('handleSelectChange', code, value)
}

const handleQuery = () => {
  emit('handleQuery', formData.value)
}
const handleSearch = (code) => {
  emit('handleSearch', code, formData.value)
}


const resetQuery = () => {
  proxy.resetForm("queryRef")
  emit('resetQuery', formData.value)
}

const closeSearchClick = (code) => {
  formData.value[code] = ''
  emit('closeSearchClick', code, formData.value)
}

const handleMouseenter = (code) => {
  if (formData.value[code]) {
    suffixClose.value = true
  }
}

const handleMouseleave = () => {
  suffixClose.value = false
}

defineExpose({
  formData,
  resetQuery
})
</script>
<style lang="scss" scoped>
.ep-icon-circle-close {
  cursor: pointer;
}

.form-data {
  overflow: hidden;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #d2d2d2;

  :deep(.el-form-item__label) {
    align-items: center;
    line-height: 16px;
  }

  .ep-form-item {
    margin-right: 10px;
  }

  .ep-form-search {
    flex: 1;
    margin-top: 10px;
  }

  .ep-button {
    width: 74px;
    height: 28px;
    padding: 0;
    border-radius: 3px;
    text-align: center;
    margin-left: 0;
    font-size: 12px;
  }

  :deep(.no-scroll) {
    .ep-scrollbar__wrap {
      overflow: hidden;
      /* 隐藏滚动条 */
    }

    .ep-scrollbar__bar.is-vertical {
      display: none;
    }
  }

  .form-right-show {
    position: relative;
    width: 100px;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    span {
      font-size: 14px;
      cursor: pointer;
    }

    .form-right-show-y {
      position: absolute;
      width: 1px;
      height: 90%;
      background-color: #d2d2d2;
      top: 5%;
      right: 0px;
    }
  }

  .form-right {
    width: 100px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .ep-button {
      width: 74px;
      height: 28px;
      padding: 0;
      border-radius: 3px;
      text-align: center;
      margin-left: 0;
      margin-top: 10px;

      &:nth-child(2) {
        margin-bottom: 10px;
      }
    }

    .reset-btn {
      background-color: #e6e6e6;
      border-color: #64a1ff;

      &:hover {
        color: #64a1ff;
      }
    }

    .search-btn {
      background-color: #64a1ff;
      border-color: #64a1ff;
    }
  }

  .form-rights {
    flex-direction: row;
    align-items: baseline;
    width: 168px;

    .ep-button {
      margin-top: 13px;

      &:nth-child(2) {
        margin: 0;
        margin-left: 10px;
      }
    }
  }
}
</style>