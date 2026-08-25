<template>
    <ep-dialog :title="title" iconTitle="form" v-model="visible" width="900px" top="8vh" append-to-body>
        <div class="sso-front-table-centainer2">
            <el-form :model="formData" ref="elForm" :inline="true" :rules="rules" label-width="110px">
                <el-row :gutter="20">
                    <el-col :span="10">
                        <el-form-item label="年度：" prop="year">
                            <el-date-picker v-model.trim="formData.year" type="year" placeholder="请输入"
                                value-format="YYYY"  :disabled="isShowyear" style="width: 220px" @change="handleChangePicker"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="14">
                        <el-form-item label="本单位定额：">
                            {{ unitMoney }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="地区：" prop="plantCode">
                            <el-select v-model="formData.plantCode" placeholder="请选择" clearable style="width: 220px"
                                :disabled="isShow" @change="plantChange">
                                <el-option v-for="dict in plantLists" :key="dict.plantCode"
                                    :label="`${dict.plantName}`" :value="dict.plantCode" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="14">
                        <el-form-item label="仓库：" prop="depotCode">
                            <el-select v-model="formData.depotCode" placeholder="请选择" clearable style="width: 220px"
                                :disabled="isShow" @change="depotChange">
                                <el-option v-for="dict in warehouseLists" :key="dict.whCode"
                                    :label="`${dict.whName}`" :value="dict.whCode" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="定额（元）：" prop="rationAmount">
                            <el-input-number v-model.trim="formData.rationAmount" :min="1" :controls="false" :disabled="isstation" :precision="2"
                                placeholder="请输入" style="width: 220px" />
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="visible = false" class="cancel-btn"><svg-icon
                        icon-class="cancel" />&nbsp;关闭</el-button>
                <el-button type="primary" class="determine-btn" @click="saveBtn" :disabled="isstation"><svg-icon
                        icon-class="determine" />&nbsp;确定</el-button>
            </div>
        </template>
    </ep-dialog>
</template>
<script setup>
import { normListCreateModify, normListEditModify, plantDictList, warehouseDict, sumAmount } from '@/api/reserve-quote/section'
import { getCurrentInstance, reactive, toRefs } from 'vue';
const { proxy } = getCurrentInstance()
import { getCookie } from '@/utils/auth'
const props = defineProps({
    rowData: {
        type: Object,
        default: () => { }
    }
})

const isstation = ref(false)
const isShowyear = ref(false)
const visible = defineModel({ default: false })
const isShow = ref(false)
const emit = defineEmits(['createSuccess']);
const title = ref('')
watch(visible, async (newVal) => {
    if (newVal) {
         formData.value.year = String(new Date().getFullYear())
           await qyerysumAmount( formData.value.year)
           await plantList()
        if (Object.keys(props.rowData).length === 0) {
            title.value = "新增储备定额维护"
            isShow.value = false
            isShowyear.value = false
        } else {
            title.value = "编辑储备定额维护"
            isShow.value = true
            isShowyear.value = true
            formData.value = JSON.parse(JSON.stringify(props.rowData))
            let plantArr = plantLists.value.filter((item) => {
                return item.plantCode === formData.value.plantCode
            })
            warehouseList(plantArr[0]?.id)
        }
      
    } else {
        formData.value = Object.assign({})
        proxy.$refs.elForm && proxy.$refs.elForm.resetFields()
    }
})

const unitMoney = ref('')
const qyerysumAmount = async (val) => {
    const { data } = await sumAmount({ year: val })
    unitMoney.value = `总定额${data.road}元，已制定${data.station ?? '0'}元`
    if(data.road === 0){
        isstation.value = true
        isShow.value = true
        formData.value.plantCode = ''
        formData.value.depotCode = ''
        formData.value.rationAmount = null
        proxy.$refs.elForm && proxy.$refs.elForm.resetFields('plantCode')
        proxy.$refs.elForm && proxy.$refs.elForm.resetFields('depotCode')
        proxy.$refs.elForm && proxy.$refs.elForm.resetFields('rationAmount')
    }else{
        isstation.value = false
        isShow.value = false
    }
}

const formData = ref({})
const rules = reactive({
    year: [{ required: true, message: '请选择年度', trigger: ['blur', 'change'] }],
    plantCode: [{ required: true, message: '请选择地区', trigger: ['blur', 'change'] }],
    depotCode: [{ required: true, message: '请选择仓库', trigger: ['blur', 'change'] }],
    rationAmount: [{ required: true, message: '请输入定额', trigger: ['blur', 'change'] }],
})

const saveBtn = () => {
    proxy.$refs.elForm.validate(valid => {
        if (!valid) {
            return
        } else {
            proxy.$modal.loading()
            saveData()
        }

    })
}
const plantLists = ref([])
// 获取地区列表
const plantList = async () => {
    const { data } = await plantDictList()
    plantLists.value = data
}
const warehouseLists = ref([])
// 获取仓库列表
const warehouseList = async (val) => {
    const { data } = await warehouseDict({ plantId: val })
    warehouseLists.value = data
}

// 地区选中后逻辑
const plantChange = (value) => {
    formData.value.depotCode = ''
    let plantArr = plantLists.value.filter((item) => {
        return item.plantCode === value
    })
    formData.value.plantCode = plantArr[0]?.plantCode;
    formData.value.plantName = plantArr[0]?.plantName;
    warehouseList(plantArr.length > 0 ? plantArr[0].id : 'xx')
}
const depotChange = (val) => {
    formData.value.depotName = warehouseLists.value.find(item => val === item.whCode).whName
}

const saveData = () => {
    if (Object.keys(props.rowData).length === 0) {
        normListCreateModify({ ...formData.value, flag: '1' }).then(({ message }) => {
            proxy.$modal.msgSuccess(message)
            visible.value = false
            emit('createSuccess')
        }).finally(() => {
            proxy.$modal.closeLoading()
        })
    } else {
        normListEditModify({ ...formData.value }).then(({ message }) => {
            proxy.$modal.msgSuccess(message)
            visible.value = false
            emit('createSuccess')
        }).finally(() => {
            proxy.$modal.closeLoading()
        })
    }
}
const handleChangePicker = (val) =>{
    formData.value.year = val
    qyerysumAmount(val)
}

</script>
<style lang="scss" scoped>
.sso-front-table-centainer2 {
    padding: 20px;
}

:deep(.ep-input-number.is-center .ep-input__inner) {
    text-align: left;
}
</style>