<template>
  <el-form class="form-data" :model="formData" ref="queryRef" v-show="showSearch" :inline="true"
    :label-width="labelWidth + 'px'" :style="{ 'max-height': height }">
    <el-scrollbar ref="elScrollbar" max-height="200px" :class="{'no-scroll': height == '100px', 'flex1': true}">
      <div class="ep-form-search" ref="elFormSearch">
        <el-form-item v-for="item in formJsonData" :key="item.prop" :prop="item.prop" :label="item.label+'：'" l
          :label-width="item.labelWidth ? item.labelWidth + 'px' : ''">
          <el-input v-if="item.type === 'input'" v-model="formData[item.prop]" placeholder="请输入" :clearable="!item.clearable"
            style="width: 220px" @keyup.enter="handleQuery" />
          <el-select v-else-if="item.type === 'select'" v-model="formData[item.prop]" placeholder="请选择" :clearable="!item.clearable" :empty-values="[undefined, null, '']" @change="(val) => handleSelectChange(item.prop, val)"
            :filterable="item.filterable || false" :multiple="item.multiple" :collapse-tags="item.multiple" :collapse-tags-tooltip="item.multiple" style="width: 220px">
            <el-option v-for="dict in item.selectData || formSelectData[item.prop]" :key="dict.value" :label="dict.label"
              :value="dict.value" />
          </el-select>
          <el-date-picker v-else-if="item.type === 'date'" v-model="formData[item.prop]"
            :format="item.dateType ? 'YYYYMM' : 'YYYYMMDD'"
            :value-format="item.dateType ? 'YYYYMM' : 'YYYYMMDD'"
            :type="item.dateType ? item.dateType : 'daterange'"
            placeholder="请选择"
            style="width: 220px">
          </el-date-picker>
          <el-radio-group v-model="formData[item.prop]" v-else-if="item.type === 'radio'">
            <el-radio v-for="item in item.selectData" :value="item.value" :key="item.value">{{ item.label }}</el-radio>
          </el-radio-group>
          <el-input v-else v-model="formData[item.prop]" placeholder="请输入" :clearable="!item.clearable" style="width: 220px"
            @keyup.enter="handleQuery" />
        </el-form-item>
      </div>
    </el-scrollbar>
    <div class="form-right-show" v-show="isMore && isShowMore">
        <span @click="showFormClick">{{ height === '200px' ? '收起' : '展开更多' }}</span>
        <span @click="showFormClick"><svg-icon icon-class="open" /></span>
        <div class="form-right-show-y"></div>
    </div>
    <!-- <div class="form-right" :class="isMore && isShowMore ? '' : 'form-rights'">
        <el-button type="primary" @click="handleQuery" class="search-btn"><svg-icon icon-class="search" />&nbsp;查询</el-button>
        <el-button type="default" @click="resetQuery" class="reset-btn"><svg-icon icon-class="Line-Refresh" />&nbsp;重置</el-button>
    </div> -->
  </el-form>
</template>

<script setup>
import { getYearMonth } from '../../tool';
const { proxy } = getCurrentInstance();

// 接收参数并指定类型（可选）
const props = defineProps({
  showSearch: Boolean,
  labelWidth: {
    type: String,
    default: '70'
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
  }
})

const height = ref('100px')
const isMore = ref(false);
const queryRef = ref(null);

const formJsonData = ref(props.formJson)

const formObj = new Object()
formJsonData.value.map(item => {
  formObj[item.prop] = '';
})

const data = reactive({
  formData: {...formObj} || {}
})

const { formData } = toRefs(data);

/** 根据名称筛选部门树 */
watch(() => props.resizeSplitData, val => {
  proxy.$nextTick( () => {
    const divH = document.querySelector('.ep-form-search') && document.querySelector('.ep-form-search').clientHeight
    isMore.value = divH > 100
  })
})

onMounted(() => {
  proxy.$nextTick( () => {
    const divH = document.querySelector('.ep-form-search') && document.querySelector('.ep-form-search').clientHeight
    isMore.value = divH > 100
  })
})

const showFormClick = () => {
  height.value = height.value === '200px' ? '100px' : '200px'
  if (proxy.$refs.elScrollbar) {
    const wrapper = proxy.$refs.elScrollbar.$el.querySelector('.ep-scrollbar__wrap')
    wrapper.scrollTop = 0 // 直接设置 scrollTop 属性到 0
  }
}

// 声明触发的事件（可选，增强类型校验）
const emit = defineEmits(['handleQuery', 'resetQuery', 'handleSelectChange'])

// 下拉框选择改变
const handleSelectChange = (code, value) => {
  emit('handleSelectChange', code, value)
}

const handleQuery = () => {
  emit('handleQuery')
}

watch(() => formData.value.csCode, (nval) => {
  if (!!nval) {
    handleQuery();
  } else {
    emit("resetQuery");
  }
})

const resetQuery = () => {
  queryRef.value.resetFields();
  emit('resetQuery')
}

defineExpose({ formData })
</script>
<style lang="scss" scoped>
.form-data {
  overflow: hidden;
  display: flex;
  justify-content: space-between;
  // border-bottom: 1px solid #d2d2d2;

  :deep(.el-form-item__label) {
    align-items: center;
    line-height: 16px;
  }
  :deep(.ep-form-item--default) {
    margin-bottom: 0px !important;
  }

  .ep-form-item{
    margin-right: 24px;
  }
  
  .ep-form-search{
    flex: 1;
    // margin-top: 10px;
  }
  .ep-button{
    width: 74px;
    height: 28px;
    padding: 0;
    border-radius: 3px;
    text-align: center;
    margin-left: 0;
    font-size: 12px;
  }
  :deep(.no-scroll){
    .ep-scrollbar__wrap {
      overflow: hidden; /* 隐藏滚动条 */
    }
    .ep-scrollbar__bar.is-vertical{
      display: none;
    }
  }
  
  .form-right-show{
    position: relative;
    width: 100px;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    span{
      font-size: 14px;
      cursor: pointer;
    }
    .form-right-show-y{
      position: absolute;
      width: 1px;
      height: 90%;
      background-color: #d2d2d2;
      top: 5%;
      right: 0px;
    }
  }
  
  .form-right{
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
      &:nth-child(2){
        margin-bottom: 10px;
      }
    }
    .reset-btn{
      background-color: #e6e6e6;
      border-color: #64a1ff;
      &:hover{
        color: #64a1ff;
      }
    }
    .search-btn{
      background-color: #64a1ff;
      border-color: #64a1ff;
    }
  }
  .form-rights{
    flex-direction: row;
    align-items: baseline;
    width: 168px;
    .ep-button {
      margin-top: 13px;
      &:nth-child(2){
        margin: 0;
        margin-left: 10px;
      }
    }
  }
}
</style>