<template>
  <div class="picture-list-dialog-box">
    <el-dialog class="dialog picture-list-dialog" :model-value="visible" :width="width" top="5vh" draggable @close="dialogClose" @open="dialogOpen" :destroy-on-close="true">
      <template #header>
        <span><svg-icon :icon-class="iconTitle" v-if="iconTitle" /> {{ title }}</span>
      </template>
      <template #footer>
        <el-button @click="dialogClose">关闭</el-button>
      </template>
      <div class="app-container app-container-splitpanes">
        <el-row :gutter="20" class="app-container-row integrated-manage-pane-form integrated-manage-pane-form-a">
            <receipt-table
              class="table-index"
              :loading="loading"
              idName="fileId"
              :tableJson="tableJsonArr"
              :tableData="tableData"
              :table-button-json="pictrueListTableButtonJson"
              @handle-button-click="handleButtonClick"
              ref="tableRef"
              :selection-show="false"
            >
              <template #type="{name, scope}">
                {{  documentTypeObj[scope.row.type] || "--"  }}
              </template>
              <template #uploadDate="{name, scope}">
                {{ parseTime(scope.row.uploadDate, '{y}-{m}-{d}') }}
              </template>
            </receipt-table>
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { pictureListTableJson, pictrueListTableButtonJson } from './tableJson';
import receiptTable from './receiptTable.vue';
import { getAcceptanceFiles } from '@/api/materialAccept/purchaseOrder';
import { documentTypeObj } from '@/utils/dictionary';
import { getFile } from '@/api/rmstor/inbound';

const { proxy } = getCurrentInstance();
const tableJsonArr = ref(pictureListTableJson);

// 接收参数并指定类型（可选）
const props = defineProps({
  iconTitle: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: '新增'
  },
  width: {
    type: String,
    default: '800px'
  },
  visible: {
    type: Boolean,
    default: false
  },
  commonDialogFormJson: {
    type: Array,
    default: () => []
  },
  commonDialogTableJson: {
    type: Array,
    default: () => [],
  },
  pdbId: {
    type: String,
    default: "",
  }
});

const loading = ref(false);
const tableData = ref([]);
const tableRef = ref(null);

const getPicList = async () => {
  loading.value = true;

  try {
    const res = await getAcceptanceFiles(props.pdbId);
    console.log(res);
    tableData.value = res?.data || [];
  } catch (error) {
    
  }

  loading.value = false;
}

const emit = defineEmits(['dialogClose'])

const dialogOpen = () => {
  getPicList();
}

const handleButtonClick = async (prop, scope) => {
  if (prop === "preview") {
    try {
      const res = await getFile({
        fileName: scope.row.fileFormerName,
      });

      const correctBlob = new Blob([res.data], { type: 'image/png' });

      const blobUrl = URL.createObjectURL(correctBlob);

      const newTab = window.open(blobUrl, '_blank');

      setTimeout(() => {
        URL.revokeObjectURL(blobUrl);
      }, 5000);
    } catch (error) {
      console.log(error);
    }
  }

  if (prop === "download") {
    try {
      const res = await getFile({
        fileName: scope.row.fileFormerName,
      });

      const correctBlob = new Blob([res.data], { type: 'image/png' });

      const blobUrl = URL.createObjectURL(correctBlob);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = scope.row.fileName || "未命名图片.png";
      document.body.appendChild(link);
      link.click();
      document.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      
    }
  }
}

const dialogClose = () => {
  emit('dialogClose');
}

</script>

<style lang="scss" scoped>
.picture-list-dialog-box {
   :deep(.picture-list-dialog) {
    height: 80vh;
    .ep-dialog__body {
        padding: 12px;
        overflow-y: auto;
        overflow-x: hidden;
        height: calc(100% - 93px);
    }
  }
}
</style>