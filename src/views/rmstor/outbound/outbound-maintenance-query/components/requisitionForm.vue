<template>
  <ep-dialog class="ep-dialog-list" :title="title" iconTitle="form" v-model="pubmedVisible" width="85vw" top="5vh"
    append-to-body height="60vh" :close-on-press-escape="false" :close-on-click-model="false">
    <div class="app-container app-container-splitpanes">
      <el-row :gutter="20" class="app-container-row integrated-manage-pane-form integrated-manage-pane-form-a">
        <el-col class="app-container-col">
          <div style="height: 260px;">
            <el-form class="form-wrapper" :model="formData" ref="elForm" :inline="true" label-width="120px"
              style="margin-top: 10px;">
              <el-row class="form-left flex1">
                <el-col :span="6">
                  <el-form-item label="请领单编号：" prop="planCode">
                    <el-input v-model.trim="formData.planCode" placeholder="请输入">
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="请领车间：" prop="deptCode">
                    <el-input v-model.trim="formData.deptCode" placeholder="请输入" />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="请领班组：" prop="teamCode">
                    <el-input v-model.trim="formData.teamCode" placeholder="请输入" />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="用料地区：" prop="plantCode">
                    <el-select v-model="formData.plantCode" placeholder="请选择" clearable @change="plantChange">
                      <el-option v-for="dict in plantLists" :key="dict.plantCode"
                        :label="`【${dict.plantCode}】${dict.plantName}`" :value="dict.plantCode" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="仓库：" prop="depotCode">
                    <el-select v-model="formData.depotCode" placeholder="请选择" clearable @change="depotChange">
                      <el-option v-for="dict in warehouseLists" :key="dict.whCode"
                        :label="`【${dict.whCode}】${dict.whName}`" :value="dict.whCode" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="仓库分区：" prop="partitionCode">
                    <el-select v-model="formData.partitionCode" placeholder="请选择" clearable @change="handlepartition">
                      <el-option v-for="dict in partitionLists" :key="dict.whCode"
                        :label="`【${dict.partitionCode}】${dict.partitionName}`" :value="dict.partitionCode" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="领料人：" prop="pickmatlName">
                    <el-input v-model.trim="formData.pickmatlName" placeholder="请输入" />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="物资编码：" prop="matlCode">
                    <el-input v-model.trim="formData.matlCode" placeholder="请输入" />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="物资名称：" prop="matlName">
                    <el-input v-model.trim="formData.matlName" placeholder="请输入" />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="规格型号：" prop="matlType">
                    <el-input v-model.trim="formData.matlType" placeholder="请输入" />
                  </el-form-item>
                </el-col>
                <el-col :span="1"></el-col>
                <el-col :span="6">
                  <el-button class="cancel-btn" type="primary" @click="getList">查询</el-button>
                  <el-button class="cancel-btn" @click="resetQuery">重置</el-button>
                </el-col>
                <el-divider style="margin-bottom: -1px;margin-top: 0px;"></el-divider>
                <el-col :span="24">
                  <el-tabs v-model="formData.listType" @tab-click="handleChangeRadio" type="card">
                    <el-tab-pane label="资源池发（领）料单" name="1"></el-tab-pane>
                    <el-tab-pane label="生产系统领用料申请单" name="2"></el-tab-pane>
                  </el-tabs>
                </el-col>
                <el-divider style="margin-bottom: 5px;margin-top: -15px;"></el-divider>
                <el-col :span="12">
                  <el-form-item label="请选择电子请领单：" prop="planCode" label-width="150px">
                    <el-select v-model="formData.invoiceRequist" placeholder="请选择" clearable style="width:400px;"
                      @change="handleinvoiceRequist">
                      <el-option v-for="dict in invoiceRequistList" :key="dict.planCode" :label="dict.planName"
                        :value="dict.planCode" />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
          <div style="height:calc(100% - 280px)">
            <!-- 表格数据 -->
            <!-- <table-index class="table-index" :loading="loading" :idName="idName" :tableJson="tableJsonArr"
              :tableData="tableData" @handleSelectionChange="handleSelectionChange" operationWidth="150"
              :selectable="handleSelectable">
            </table-index> -->
            <el-pro-table ref="proTableRef" :columns="tableJsonArr" :show-pagination="false"
              :data="tableData" :show-checkbox="true" :table-alert-render="false"
              @selection-change="handleSelectionChange" :grid-options="{ rowId: 'matlCode' }" :show-action="false" :show-refresh="false" :show-setting="false">
            </el-pro-table>
          </div>
        </el-col>
      </el-row>
    </div>
    <template #footer>
      <div class="dialog-footer">
             <el-button type="primary" class="determine-btn" @click="saveBtn"><svg-icon
            icon-class="determine" />&nbsp;保存</el-button>   
        <el-button @click="pubmedVisible = false" class="cancel-btn"><svg-icon
            icon-class="cancel" />&nbsp;关闭</el-button>

      </div>
    </template>
  </ep-dialog>
</template>

<script setup>
import { rmstorgetApplyRecvListCodes, rmstorgetRecvMatlList, rmstorsubmitRecvMatlList, plantDictList, warehouseDict, warehouseplantDictList, } from '@/api/rmstor/outbound-maintenance'
import { rmstorMatlTableJson, rmstorProduceTableJson } from "../tableJson"
import { getLocalStorage } from '@/utils/auth'
const { proxy } = getCurrentInstance()
const tableJsonArr = ref(JSON.parse(getLocalStorage(proxy.$route.meta?.menuId)) || rmstorMatlTableJson)
const props = defineProps({
  obCode:{
    type:String,
    default:''
  }
})
import { getCookie } from '@/utils/auth'
const warehouseGetYear = getCookie('warehouseGetYear') && JSON.parse(getCookie('warehouseGetYear'))

const pubmedVisible = defineModel({ default: false })
const idName = ref('matlCode')
const single = ref(true)
const multiple = ref(true)
const ids = ref([])
const selectionData = ref([])
const proTableRef = ref(null)

watch(pubmedVisible, (newVal) => {
  if (newVal) {
    plantList()
    getList()
  } else {
    formData.value = Object.assign({})
    invoiceRequistList.value = []
    formData.value.listType = '1'
    warehouseLists.value = []
    partitionLists.value = []
    tableData.value = []
  }
})
const tableData = ref([])
const loading = ref(false)
const title = ref('电子请领单')

const formData = ref({
  listType: '1'
})
const emit = defineEmits(['createSuccess', 'selectData']);
const plantLists = ref([])
// 获取地区列表
const plantList = async () => {
  const { data } = await plantDictList()
  plantLists.value = data || []
}
const warehouseLists = ref([])
// 获取仓库列表
const warehouseList = async (val) => {
  const { data } = await warehouseDict({ plantId: val })
  warehouseLists.value = data || []
}
const partitionLists = ref([])
//仓库分区
const getwarehouseplantDictList = async (val) => {
  const { data } = await warehouseplantDictList({ whId: val })
  partitionLists.value = data || []
}
const plantChange = (value) => {
  formData.value.depotCode = ''
  formData.value.partitionCode = ''
  partitionLists.value = []
  let plantArr = plantLists.value.filter((item) => {
    return item.plantCode === value
  })
  formData.value.plantCode = value;
  formData.value.plantName = plantArr[0]?.plantName;
  warehouseList(plantArr.length > 0 ? plantArr[0].id : 'xx')
}
const depotChange = (value) => {
  formData.value.partitionCode = ''
  let plantArr = warehouseLists.value.filter((item) => {
    return item.whCode === value
  })
  formData.value.depotCode = value
  formData.value.depotName = plantArr[0]?.whName;
  getwarehouseplantDictList(plantArr.length > 0 ? plantArr[0].id : 'xx')
}
const handlepartition = (value) => {
  let plantArr = partitionLists.value.filter((item) => {
    return item.partitionCode === value
  })
  formData.value.partitionCode = value
  formData.value.partitionName = plantArr[0]?.partitionName;
  //应税用途
  formData.value.taxFlagName = plantArr[0]?.taxFlagName;
  formData.value.taxFlagCode = plantArr[0]?.taxFlagCode;
}
const invoiceRequistList = ref([])
const getList = async () => {
  const { data } = await rmstorgetApplyRecvListCodes({ ...formData.value, })
  invoiceRequistList.value = data
}
/** 重置按钮操作 */
function resetQuery() {
  formData.value = Object.assign({})
  formData.value.listType = '1'
  getList()
}

const selectedrecvMatl = ref({})
const handleinvoiceRequist = async (val) => {
  formData.value.invoiceRequist = val
  const { data } = await rmstorgetRecvMatlList(val, warehouseGetYear?.yearMonth)
  selectedrecvMatl.value = data
  tableData.value = data.recvMatlApplyListDTOList
}
const handleSelectionChange = (selection) => {
  selectionData.value = selection
  // ids.value = selection.map(item => item['pdmId'])
  // single.value = selection.length != 1
  // multiple.value = !selection.length
}
const saveBtn = async () => {
  let params = {
    invoiceRequist: formData.value.invoiceRequist,
    ...selectedrecvMatl.value,
    recvMatlApplyListDTOList: selectionData.value
  }
  const { data, message } = await rmstorsubmitRecvMatlList(params)
  //proxy.$modal.msgSuccess(message)
  pubmedVisible.value = false
  emit('selectData', data,props.obCode)
}
const handleChangeRadio = (val) => {
  if (val.props.name === '1') {
    tableJsonArr.value = rmstorMatlTableJson
  } else {
    tableJsonArr.value = rmstorProduceTableJson
  }
}
const handleSelectable = (row) => {
  if (row.outNum > row.nowNum) {
    return false
  }
  return true
}
</script>
<style lang="scss" scoped>
:deep(.ep-select, .ep-input) {
  width: 200px;

  .ep-input__inner {
    border-color: #d2d2d2;

    &:focus {
      border-color: #1890ff;
    }

    &:hover {
      border-color: #1890ff;
    }
  }
}

:deep(.ep-input) {
  width: 200px;
}
</style>