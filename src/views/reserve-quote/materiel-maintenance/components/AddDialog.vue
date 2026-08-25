<template>
    <ep-dialog :title="title" iconTitle="form" v-model="visible" width="900px" top="8vh" append-to-body>
        <div class="sso-front-table-centainer2">
            <el-form :model="formData" ref="elForm" :inline="true" :rules="rules" label-width="110px">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="地区：" prop="plantCode">
                            <el-select v-model="formData.plantCode" placeholder="请选择" clearable style="width: 220px"
                                :disabled="isShow" @change="plantChange">
                                <el-option v-for="dict in plantLists" :key="dict.plantCode" :label="`${dict.plantName}`"
                                    :value="dict.plantCode" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="仓库：" prop="depotCode">
                            <el-select v-model="formData.depotCode" placeholder="请选择" clearable style="width: 220px"
                                :disabled="isShow" @change="depotChange">
                                <el-option v-for="dict in warehouseLists" :key="dict.whCode" :label="`${dict.whName}`"
                                    :value="dict.whCode" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="物资编码：" prop="matlCode">
                            <el-input v-model.trim="formData.matlCode" placeholder="请选择" disabled>
                                <template #append>
                                    <el-button :icon="Search" style="height: 28px;" @click="handleGroupCode"
                                        :disabled="isShow"></el-button>
                                </template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="物资名称：" prop="matlName">
                            <el-input v-model.trim="formData.matlName" placeholder="请输入" style="width: 220px"
                                readonly>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="规格型号：" prop="matlType">
                            <el-input v-model.trim="formData.matlType" placeholder="请输入" style="width: 220px"
                                readonly>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="计量单位：" prop="matlUnit">
                            <el-input v-model.trim="formData.matlUnit" placeholder="请输入" style="width: 220px"
                                readonly>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="图号：" prop="matlpCode">
                            <el-input v-model.trim="formData.matlpCode" placeholder="请输入" style="width: 220px"
                                readonly>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="材质：" prop="matlRaw">
                            <el-input v-model.trim="formData.matlRaw" placeholder="请输入" style="width: 220px"
                                readonly>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="高储：" prop="highNum">
                            <el-input v-model.trim="formData.highNum" v-number-input.float="4" clearable
                                placeholder="请输入" style="width: 220px">
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="低储：" prop="lowNum">
                            <el-input v-model.trim="formData.lowNum" v-number-input.float="4" clearable
                                placeholder="请输入" style="width: 220px">
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="visible = false" class="cancel-btn"><svg-icon
                        icon-class="cancel" />&nbsp;关闭</el-button>
                <el-button type="primary" class="determine-btn" @click="saveBtn"><svg-icon
                        icon-class="determine" />&nbsp;确定</el-button>
            </div>
        </template>
    </ep-dialog>
    <Group v-model="groupVisible" @selectData="selectData" />
</template>
<script setup>
import { normListCreateModify, normListEditModify, plantDictList, warehouseDict } from '@/api/reserve-quote/materiel-maintenance'
import { getCurrentInstance, reactive, toRefs } from 'vue';
import { Search } from '@element-plus/icons-vue'
import Group from './Group.vue'
const { proxy } = getCurrentInstance()
import { getCookie } from '@/utils/auth'
const props = defineProps({
    rowData: {
        type: Object,
        default: () => { }
    }
})
const visible = defineModel({ default: false })
const isShow = ref(false)
const emit = defineEmits(['createSuccess']);
const title = ref('')
watch(visible, async (newVal) => {
    if (newVal) {
        await plantList()
        if (Object.keys(props.rowData).length === 0) {
            title.value = "新增物资高低储维护"
            isShow.value = false
            // formData.value.year = String(new Date().getFullYear())

        } else {
            title.value = "编辑物资高低储维护"
            isShow.value = true
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


const formData = ref({})

const rules = reactive({
    plantCode: [{ required: true, message: '请选择地区', trigger: ['blur', 'change'] }],
    depotCode: [{ required: true, message: '请选择仓库', trigger: ['blur', 'change'] }],
    matlCode: [{ required: true, message: '请选择物资编码', trigger: ['blur', 'change'] }],
    highNum: [{ required: true, message: '请输入高储', trigger: ['blur', 'change'] }],
    lowNum: [{ required: true, message: '请输入低储', trigger: ['blur', 'change'], },
    {
        validator: (rule, value, callback) => {
            if (Number(value) > Number(formData.value.highNum)) {
                callback('低储值须低于高储值')
            } else {
                callback()
            }
        }
    }
    ],
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
    plantLists.value = data || []
}
const warehouseLists = ref([])
// 获取仓库列表
const warehouseList = async (val) => {
    const { data } = await warehouseDict({ plantId: val })
    warehouseLists.value = data || []
}

const groupVisible = ref(false)
const handleGroupCode = () => {
    groupVisible.value = true

}
const selectData = (row) => {
    formData.value.matlCode = row.matlCode
    formData.value.matlName = row.matlName
    formData.value.matlType = row.matlType
    formData.value.matlUnit = row.matlUnit
    formData.value.matlpCode = row.matlPcode
    formData.value.matlRaw = row.matlRaw
}

// 地区选中后逻辑
const plantChange = (value) => {
    formData.value.depotCode = ''
    let plantArr = plantLists.value.filter((item) => {
        return item.plantCode === value
    })
    formData.value.plantCode = value;
    formData.value.plantName = plantArr[0]?.plantName;
    warehouseList(plantArr.length > 0 ? plantArr[0].id : 'xx')
}
const depotChange = (val) => {
    formData.value.depotCode = val;
    formData.value.depotName = warehouseLists.value.find(item => val === item.whCode).whName
}

const saveData = () => {
    if (Object.keys(props.rowData).length === 0) {
        normListCreateModify({ ...formData.value }).then(({ message }) => {
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


</script>
<style lang="scss" scoped>
.sso-front-table-centainer2 {
    padding: 20px;
}

:deep(.ep-input-number.is-center .ep-input__inner) {
    text-align: left;
}
</style>