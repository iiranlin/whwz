<template>
  <div>
    <el-form-item label="提示文字">
      <el-input size="small" v-model="value.placeholder" placeholder="请设置提示语"/>
    </el-form-item>
    <el-form label-position="top">
      <el-form-item label="选项设置" class="options">
        <template #label>
          <div class="option-item-label">
            <span>选项设置</span>
            <el-button icon="Plus" type="text" size="mini"
                       @click="value.options.push('新选项')">新增选项</el-button>
          </div>
        </template>
        <draggable :list="value.options" group="option" handle=".el-icon-rank"
                   :animation="300" :sort="true" :item-key="option => option">
          <template #item="{ index }">
            <div class="option-item">
              <el-icon class="el-icon-rank"><Rank /></el-icon>
              <el-input v-model="value.options[index]" size="medium" placeholder="请设置选项值" clearable>
                <el-button icon="Delete" #append type="danger" size="medium"
                           @click="value.options.splice(index, 1)"></el-button>
              </el-input>
            </div>
          </template>
        </draggable>

      </el-form-item>
    </el-form>
    <el-form-item label="选项展开">
      <el-switch v-model="value.expanding"></el-switch>
    </el-form-item>

  </div>
</template>

<script setup name="SelectInputConfig">
import draggable from "vuedraggable";
import { Rank } from '@element-plus/icons-vue'

defineProps({
  value: {
    type: Object,
    default: () => {
      return {}
    }
  }
})
</script>

<style lang="scss" scoped>
:deep(.options){
  .el-form-item__label{
    display: block;
    width: 100%;
    text-align: left;
  }
  .el-icon-rank{
    margin-right: 5px;
    cursor: move;
  }
  .option-item{
    .el-input{
      width: 250px;
      float:right;
    }
  }
}

.option-item-label{
  height: 30px;
  line-height: 30px;
  button{
    float:right;
  }
}

/*::v-deep .el-form-item {
  margin-bottom: 10px;

  .el-form-item__label {
    padding: 0;
  }
  .options{
    .el-icon-rank{
      cursor: move;
    }
  }
}*/
</style>
