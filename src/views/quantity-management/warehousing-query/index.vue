<template>
  <div class="app-container app-container-splitpanes">
    <el-row :gutter="20" class="app-container-row integrated-manage-pane-form integrated-manage-pane-form-a">
      <el-col class="app-container-col">
        <form-data ref="formDataRef" :queryParams="queryParams" :showSearch="showSearch" :formJson="formJson" @handleQuery="handleQuery" @handleSelectChange="handleSelectChange" :formSelectData="formSelectData"
          @resetQuery="resetQuery" @handleSearch="handleSearch" @closeSearchClick="handleCloseSearchClick" labelWidth="100">
          <template #has="{ scope }">
            <el-checkbox-group v-model="queryParams[scope.item.prop]" @change="hasChange(scope.item.prop)">
              <el-checkbox v-for="item in scope.item.selectData" :label="item.label" :value="item.value" :key="item.value"></el-checkbox>
            </el-checkbox-group>
          </template>
        </form-data>
        <button-top :buttonJson="tableButtonJson" @handleButton="handleButtonClick">
          <right-toolbar v-model:showSearch="showSearch" :tableJson="tableJsonArr" @queryTable="getList" @tabConfigSuccess="tabConfigSuccess"></right-toolbar>
        </button-top>
        <!-- 表格数据 -->
        <table-index class="table-index" :loading="loading" :selectionShow="false" :idName="idName" :queryParams="queryParams" :tableJson="tableJsonArr" :tableButtonJson="tableButtonJson"
          :tableData="tableData" @handleSelectionChange="handleSelectionChange" operationWidth="160" :tableDataDict="tableDataDict"
          @handleButtonClick="handleButtonClick">
        </table-index>

        <div class="total-bottom">
          <p>当前页入库数量小计，{{tableData[0]?.currentNum || 0}}；所有页入库数量合计，{{tableData[0]?.totalCurrentNum || 0}}</p>
        </div>

        <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
          v-model:limit="queryParams.pageSize" @pagination="getList" />

      </el-col>
    </el-row>
    <rlu-dialog ref="rluDialog" @selectChange="rluSelectChange" />
  </div>
</template>

<script setup name="warehousing-query">
import { formJson } from "./formJson"
import { tableJson, tableButtonJson } from "./tableJson"
import { getLocalStorage, getCookie } from '@/utils/auth'
import { ibdtLedgerList, ibdtLedgerListExport } from '@/api/warehouse/ibdt'
import { selectPlantDict } from '@/api/warehouse/plantDict'
import { getwarehouseByUserAndPlant } from '@/api/warehouse/warehouseDict'
import { getWarehousePartition } from '@/api/warehouse/partition'
import { ibdtHasArr } from '@/utils/dictionary'
import RluDialog from "@/views/transfer-management/components/rluDialog"
import { getDateFirstDayLastDay } from '@/utils'

const { proxy } = getCurrentInstance()

const tableJsonArr = ref(JSON.parse(getLocalStorage(proxy.$route.meta?.menuId)) || tableJson)
const tableData = ref([])
const loading = ref(false)
const showSearch = ref(true)
const idName = ref('id')
const ids = ref([])
const selectionData = ref([])
const single = ref(true)
const multiple = ref(true)
const total = ref(0)

const dateStr = getCookie("warehouseYearMonth")

const data = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 30,
    dateType: '1',
    date: [proxy.parseTime(getDateFirstDayLastDay(dateStr, 'firstDay'), "{y}-{m}-{d}"), proxy.parseTime(getDateFirstDayLastDay(dateStr, 'lastDay'), "{y}-{m}-{d}")],
    has: []
  },
  formSelectData: {
    plantCode: [],
    depotCode: [],
    partitionCode: []
  },
  tableDataDict: {},
  plantList: []
})

const { queryParams, formSelectData, tableDataDict } = toRefs(data)

const tabConfigSuccess = (data) => {
  tableJsonArr.value = data
}

const getselectPlantDict = () => {
  selectPlantDict({stockAttrs: '15'}).then( ({data}) => {
    formSelectData.value.plantCode = data.map(item => {
      return {...item, label: item.plantName, value: item.plantCode}
    })
  })
}

const getwarehouseByUserAndPlantAll = (plantId) => {
  getwarehouseByUserAndPlant({plantId, stockAttrs: '15'}).then( ({data}) => {
    formSelectData.value.depotCode = data.map(item => {
      return {...item, label: item.whName, value: item.whCode}
    })
  })
}

const getWarehousePartitionAll = (whId) => {
  getWarehousePartition({whId, stockAttrs: '15'}).then( ({data}) => {
    formSelectData.value.partitionCode = data.map(item => {
      return {...item, label: item.partitionName, value: item.partitionCode}
    })
  })
}

const handleSelectChange = (code, value) => {
  const eventObj = {
    plantCode: () => {
      proxy.$refs.formDataRef.formData.depotCode = ''
      formSelectData.value.depotCode = []
      proxy.$refs.formDataRef.formData.partitionCode = ''
      formSelectData.value.partitionCode = []
      if(value){
        const plantCodeObj = formSelectData.value.plantCode.find(a => a.plantCode === value)
        getwarehouseByUserAndPlantAll(plantCodeObj.id)
      }
    },
    depotCode: () => {
      proxy.$refs.formDataRef.formData.partitionCode = ''
      formSelectData.value.partitionCode = []
      if(value){
        const depotCodeObj = formSelectData.value.depotCode.find(a => a.whCode === value)
        getWarehousePartitionAll(depotCodeObj.id)
      }
    },
  }
  eventObj[code] && eventObj[code]()
}

/** 查询列表 */
function getList() {
  loading.value = true
  const params = {...proxy.addDateRange(queryParams.value, queryParams.value.date, 'date')}
  delete params.date
  ibdtLedgerList(params).then(({ data }) => {
    tableData.value = data.list || []
    total.value = data.total
  }).finally(() => {
    loading.value = false
  })
}

/** 搜索按钮操作 */
function handleQuery(data) {
  queryParams.value.pageNum = 1
  queryParams.value = Object.assign({}, queryParams.value, data)
  const hasList = queryParams.value.has
  let tableJsonList = [...tableJsonArr.value]
  if(!hasList.length){
    tableJsonArr.value = 
    (JSON.parse(getLocalStorage(proxy.$route.meta?.menuId)) || tableJson).map( item => {
      if(item.prop === 'totalNum'){
        item.isShow = false
      }else{
        item.isShow = true
      }
      return item
    })
  }else{
    let isTrue = true
    hasList.forEach( (val) => {
      if(isTrue){
        tableJsonList.map(item => {
          if(item.prop == 'totalNum'){
            item.isShow = true
          }else{
            item.isShow = false
          }
          return item
        })
        isTrue = false
      }
      tableJsonList.map( item => {
        if(val.toLowerCase() === item.prop.toLowerCase()){
          item.isShow = true
        }
        return item
      })
    })
    tableJsonArr.value = tableJsonList
  }
  getList()
}

const initIbdtHasArr = () => {
  const obj = ibdtHasArr.reduce( (acc, curr, index) => {
    acc[`has${curr.value}`] = false
    return acc
  },{})
  return obj
}

/** 重置按钮操作 */
function resetQuery(data) {
  data.supUnitCode = ''
  handleQuery({...data, ...initIbdtHasArr()})
}

/** 多选框选中数据 */
function handleSelectionChange(selection) {
  selectionData.value = selection
  ids.value = selection.map(item => item[idName.value])
  single.value = selection.length != 1
  multiple.value = !selection.length
}

const handleButtonClick = (code, data) => {
  const eventObj = {
    // 导出
    export: () => {
      const params = {...proxy.addDateRange(queryParams.value, queryParams.value.date, 'date')}
      delete params.date
      proxy.$download.name(ibdtLedgerListExport, params)
    }
  }
  eventObj[code] && eventObj[code]()
}

const hasChange = (name) => {
  const obj = queryParams.value[name].reduce( (acc, curr, index) => {
    acc[`${name}${curr}`] = true
    return acc
  },{})
  queryParams.value = {...queryParams.value, ...initIbdtHasArr(), ...obj}
}

const handleSearch = (code) => {
  const eventObj = {
    supUnitName: () => {
      proxy.$refs.rluDialog.show()
    }
  }
  eventObj[code] && eventObj[code]()
}

const rluSelectChange = (data) => {
  queryParams.value.supUnitCode = data[0].unitCode
  queryParams.value.supUnitName = data[0].unitName
}

const handleCloseSearchClick = (code) => {
  const eventObj = {
    supUnitName: () => {
      queryParams.value.supUnitCode = ''
      queryParams.value.supUnitName = ''
    }
  }
  eventObj[code] && eventObj[code]()
}

getList()
getselectPlantDict()
</script>