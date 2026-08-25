<template>
  <el-form class="form-data" :model="formData" ref="queryRef" v-show="showSearch" :inline="true"
    :label-width="labelWidth + 'px'" :style="{ 'max-height': height }" require-asterisk-position="left" :rules="rules">
    <el-scrollbar ref="elScrollbar" max-height="168px" :class="{'flex1': true}">
      <div class="ep-form-search" ref="elFormSearch" style="margin-top: 0; padding-top: 14px;">
        <el-form-item v-for="item in formJsonData" :key="item.prop" :prop="item.prop" :label="item.label ? item.label+'：': ''"
          :label-width="item.labelWidth ? item.labelWidth + 'px' : ''">
          <el-input v-if="item.type === 'input'" v-model="formData[item.prop]" placeholder="请输入" :clearable="!item.clearable"
            style="width: 220px" @keyup.enter="handleQuery" />
          <el-select v-else-if="item.type === 'select'" v-model="formData[item.prop]" placeholder="请选择" :clearable="!item.clearable" :empty-values="[undefined, null, '']" @change="(val) => handleSelectChange(item.prop, val, item)"
            :filterable="item.filterable || false" :multiple="item.multiple" :collapse-tags="item.multiple" :collapse-tags-tooltip="item.multiple" style="width: 220px" @clear="clearSelect(item)">
            <el-option v-for="dict in item.selectData || formSelectData[item.prop]" :key="dict.value" :label="dict.label"
              :value="dict.value" />
          </el-select>
          <el-date-picker v-else-if="item.type === 'date'" v-model="formData[item.prop]" :value-format="item.dateType?'YYYY-MM':'YYYY-MM-DD'"
            :type="item.dateType?item.dateType:'daterange'" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"
            style="width: 220px"></el-date-picker>
          <el-radio-group v-model="formData[item.prop]" v-else-if="item.type === 'radio'">
            <el-radio v-for="item in item.selectData" :value="item.value" :key="item.value">{{ item.label }}</el-radio>
          </el-radio-group>
          <el-checkbox-group v-model="formData[item.prop]" v-else-if="item.type === 'checkbox'" style="width: 340px; padding-left: 30px;" @change="(val) => checkboxChange(item.prop, val)">
            <el-checkbox v-for="_item in item.selectData" :value="_item.value" :key="_item.value" :label="_item.label"></el-checkbox>
          </el-checkbox-group>
          <div style="width: 220px;" v-else-if="item.type === 'text'">{{ formData[item.prop] || 0 }}</div style="width: 220px;">
          <el-input v-else v-model="formData[item.prop]" placeholder="请输入" :clearable="!item.clearable" style="width: 220px"
            @keyup.enter="handleQuery" />
        </el-form-item>
      </div>
    </el-scrollbar>
    <div class="form-right" :class="'form-rights'">
        <el-button type="primary" @click="handleQuery" class="search-btn"><svg-icon icon-class="search" />&nbsp;查询</el-button>
        <el-button type="default" @click="resetQuery" class="reset-btn"><svg-icon icon-class="Line-Refresh" />&nbsp;重置</el-button>
    </div>
  </el-form>
</template>

<script setup>
import { selectPlantDict } from "@/api/warehouse/plantDict.js";
import { getwarehouseByUserAndPlant } from "@/api/warehouse/warehouseDict.js"; // {plantId: xx}
import { getWarehousePartition } from "@/api/warehouse/partition.js"; // {whId: xx}
import { selectStockCount, resetStockFlag } from "@/api/warehouse/inventory";
import { getCookie } from "@/utils/auth";
import { ElMessageBox, ElMessage } from 'element-plus';

// const { proxy } = getCurrentInstance()

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
  },
  rules: {
    type: Object,
    default: () => ({})
  }
})

const height = ref('168px');
const queryRef = ref(null);
const areaArr = ref([]);
const warehouseArr = ref([]);
const partitionArr = ref([]);
const plantId = ref("");
const whId = ref("");
const partitionId = ref("");

const formJsonData = ref(props.formJson)
const formObj = new Object()
formJsonData.value.map(item => {
  if (item.prop === 'numIsNotZero') {
    formObj[item.prop] = [];
  } else {
    formObj[item.prop] = '';
  }
});

const data = reactive({
  formData: {...formObj, totalStock: 0, countedStock: 0, countedTimes: 0} || {}
});

const { formData } = toRefs(data);

watch(() => [formData.value.totalStock, formData.value.countedStock], (nval, oval) => {
  formData.value.currentCount = formData.value.totalStock - formData.value.countedStock;
  // if (!!nval[0]) {
  // }
}, {immediate: true});

formJsonData.value.forEach(async item => {
  // if (item.dict) {
  //   const dictData = proxy.useDict(item.dict)
  //   item.selectData = dictData[item.dict]
  // }
  if (item.prop === 'plantCode') {
    const dictData = await selectPlantDict();
    areaArr.value = dictData.data || [];
    item.selectData = dictData.data?.map(item => ({ ...item, label: `${item.plantName}`, value: item.plantCode })) || [];
  }
});

const getStatistic = async () => {
  try {
    const res = await selectStockCount({
      numIsNotZero: formData.value.numIsNotZero.length ? true : false,
      plantCode: formData.value.plantCode,
      depotCode: formData.value.depotCode,
      partitionCode: formData.value.partitionCode,
      // "yearMonth": "202605",
    });
    
    formData.value.countedStock = res.data?.countedStock || 0;
    formData.value.countedTimes = res.data?.countedTimes || 0;
    formData.value.totalStock = res.data?.totalStock || 0;
  } catch (error) {
    
  }
}

// 声明触发的事件（可选，增强类型校验）
const emit = defineEmits(['handleQuery', 'resetQuery', 'handleSelectChange'])

const handleSelectChange = async (code, value, data) => {
  emit('handleSelectChange', code, value)
  if (code === 'plantCode') {
    // plantId.value = data.id;
    formData.value.depotCode = "";
    whId.value = "";
    if (!!value) {
      const _res = areaArr.value.find(item => item.plantCode === value);
      plantId.value = _res.id;
      const dictData = await getwarehouseByUserAndPlant({ plantId: plantId.value });
      warehouseArr.value = dictData?.data || [];
      formJsonData.value.find(item => item.prop === 'depotCode').selectData = dictData.data?.map(item => ({ ...item, label: `${item.whName}`, value: item.whCode })) || [];
    }
    formData.value.countedStock = 0;
    formData.value.countedTimes = 0;
    formData.value.totalStock = 0;
  }
  if (code === 'depotCode') {
    // whId.value = data.id;
    formData.value.partitionCode = "";
    partitionId.value = "";
    if (!!value) {
      const _res = warehouseArr.value.find(item => item.whCode === value);
      whId.value = _res.id;
      const dictData = await getWarehousePartition({ whId: whId.value });
      partitionArr.value = dictData?.data || [];
      formJsonData.value.find(item => item.prop === "partitionCode").selectData = dictData?.data.map(item => ({...item, label: `${item.partitionName}`, value: item.partitionCode})) || [];
    }
    formData.value.countedStock = 0;
    formData.value.countedTimes = 0;
    formData.value.totalStock = 0;
  }
  if (code === "partitionCode") {
    // partitionId.value = data.id;
    if (!!value) {
      getStatistic();
    } else {
      formData.value.countedStock = 0;
      formData.value.countedTimes = 0;
      formData.value.totalStock = 0;
    }
  }
  emit("resetQuery");
}

watch(() => formData.value.plantCode, (nval) => {
  if (!!!nval) {
    formJsonData.value.find(item => item.prop === 'depotCode').selectData = [];
  }
});

watch(() => formData.value.depotCode, (nval) => {
  if(!!!nval) {
    formJsonData.value.find(item => item.prop === 'partitionCode').selectData = [];
  }
})

const checkboxChange = async (code, value) => {
   if (code === "numIsNotZero" && !!formData.value['depotCode']) {
    getStatistic();
  }
}
const handleQuery = (pageNumOne = true) => {
  queryRef.value.validate(valid => {
    if (valid) {
      if (formData.value.totalStock == 0) {
        ElMessage.error('当前库存总笔数为0！');
        return;
      }
      if (formData.value.currentCount > formData.value.totalStock - formData.value.countedStock || formData.value.currentCount == 0) {
        ElMessageBox.confirm(
          formData.value.totalStock - formData.value.countedStock == 0 ? "可盘点数量为零，需点击重新盘点按钮方可继续对该仓库进行盘点。" : `本仓库可盘点的数量为1 - ${formData.value.totalStock - formData.value.countedStock}`,
          "提示",
          {
            confirmButtonText: "确定",
            type: 'warning',
            showCancelButton: false,
          }
        ).then(() => {}).catch(() => {});
        return;
      }
      emit('handleQuery', pageNumOne);
    }
  });
}

const resetQuery = () => {
  queryRef.value.resetFields();
  formJsonData.value.map(item => {
    if (item.prop === 'numIsNotZero') {
      formObj[item.prop] = [];
    } else {
      formObj[item.prop] = '';
    }
  });
  data.formData = {...formObj, totalStock: 0, countedStock: 0, countedTimes: 0} || {};
  emit('resetQuery');
}

const clearSelect = (data) => {
  if (!!data.associateItem) {
    formData.value[data.associateItem] = "";
  }
}

const handleReplay = async () => {
 
  try {
    const res = await resetStockFlag({
      plantCode: formData.value.plantCode,
      depotCode: formData.value.depotCode,
      // "yearMonth": "202605",
    });

    ElMessageBox.confirm(
      "重新盘点成功！",
      "提示",
      {
        type: "warning",
        confirmButtonText: "确定",
        showCancelButton: false,
      }
    ).then(() => {}).catch(() => {});

    getStatistic();
  } catch (error) {
  }
    
}

defineExpose({resetQuery, handleReplay, formData, handleQuery, areaArr, warehouseArr, getStatistic, partitionArr});

onMounted(() => {
})
</script>
<style lang="scss" scoped>
.form-data {
  overflow: hidden;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #d2d2d2;

  :deep(.el-form-item__label) {
    align-items: center;
    line-height: 16px;
  }

  .ep-form-item{
    margin-right: 24px;
  }
  
  .ep-form-search{
    flex: 1;
    margin-top: 10px;
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