<template>
    <ep-dialog :title="title" iconTitle="form" v-model="visible" width="800px" top="8vh" append-to-body>
        <div class="sso-front-table-centainer2">
            <el-form :model="formData" ref="elForm" :inline="true" :rules="rules">
                <el-row :gutter="20">
                    <el-col :span="9">
                        <el-form-item label="年度：" prop="year">
                            <el-date-picker v-model.trim="formData.year" type="year" placeholder="请输入"
                                value-format="YYYY" :disabled="isShow" style="width: 220px"
                                @change="handleChangePicker" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="14">
                        <el-form-item label="库存管理目标：">
                            {{ unitMoney }}（元）
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-divider style="margin-top: 10px;"></el-divider>
                <template v-if="!isShow">
                    <el-row :gutter="20" v-for="(item, index) in formData.rationMtDTOList" :key="index">
                        <el-col :span="9">
                            <el-form-item :prop="`rationMtDTOList[${index}].unitCode`" label="单位："
                                :rules="unitRules(index)">
                                <el-select v-model.trim="item.unitCode" placeholder="请选择" clearable style="width: 220px"
                                    @change="checkUnitCode(index, $event)">
                                    <el-option v-for="dict in selectData" :key="dict.unitCode" :label="dict.unitName"
                                        :value="dict.unitCode" />
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="9">
                            <el-form-item :prop="`rationMtDTOList[${index}].rationAmount`" label="定额（元）："
                                :rules="amountRules">
                                <el-input-number v-model.trim="item.rationAmount" :min="1" :controls="false"
                                    :precision="2" placeholder="请输入" clearable style="width: 220px" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <div style="display: flex;">
                                <el-button @click="addRow(index)" type="primary">添加</el-button>
                                <el-button v-if="formData.rationMtDTOList.length > 1" type="danger"
                                    @click="deleteRow(index)">删除</el-button>
                            </div>
                        </el-col>
                    </el-row>
                </template>
                <el-row :gutter="20" v-if="isShow">
                    <el-col :span="9">
                        <el-form-item label="单位：" prop="unitCode">
                            <el-select v-model.trim="formData.unitCode" placeholder="请选择" clearable style="width: 220px"
                                disabled>
                                <el-option v-for="dict in selectData" :key="dict.unitCode" :label="dict.unitName"
                                    :value="dict.unitCode" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="9">
                        <el-form-item label="定额（元）：" prop="rationAmount">
                            <el-input-number v-model.trim="formData.rationAmount" :min="1" :controls="false"
                                :precision="2" placeholder="请输入" clearable style="width: 220px" />
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
</template>
<script setup>
import { normListCreateModify, normListEditModify, getUnitList, sumAmount } from '@/api/reserve-quote/maintenance'
import { getCurrentInstance, reactive, toRefs } from 'vue';
const { proxy } = getCurrentInstance()
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
        formData.value.year = String(new Date().getFullYear())
        qyerysumAmount(formData.value.year)
        if (Object.keys(props.rowData).length === 0) {
            title.value = "新增路局储备定额"
            isShow.value = false

        } else {
            title.value = "编辑路局储备定额"
            isShow.value = true
            formData.value = JSON.parse(JSON.stringify(props.rowData))
        }
        getUnitListData()
    } else {
        proxy.$refs.elForm && proxy.$refs.elForm.resetFields()
        formData.value = Object.assign({})
        formData.value.rationMtDTOList = [
            {
                unitCode: "",
                rationAmount: null,
                unitName: ""
            }
        ]
    }
})

const formData = ref({
    year: '',
    rationMtDTOList: [
        {
            unitCode: "",
            rationAmount: null,
            unitName: ""
        }

    ]
})

const rules = reactive({
    year: [{ required: true, message: '请选择年度', trigger: ['blur', 'change'] }],
    unitCode: [{ required: true, message: '请选择单位', trigger: ['blur', 'change'] }],
    rationAmount: [{ required: true, message: '请输入定额', trigger: ['blur', 'change'] }],
})

const selectData = ref([])
const getUnitListData = async () => {
    let { data } = await getUnitList()
    selectData.value = data
}

const addRow = (index) => {
    formData.value.rationMtDTOList.splice(index + 1, 0, { unitCode: "", rationAmount: null, unitName: "" })
}
const deleteRow = (index) => {
    if (formData.value.rationMtDTOList.length > 1) {
        formData.value.rationMtDTOList.splice(index, 1)
    }
}

const checkUnitCode = (index, value) => {
    formData.value.rationMtDTOList[index].unitName = selectData.value.find((item) => item.unitCode === value).unitName
    if (!value) return
    const isDupLicate = formData.value.rationMtDTOList.some((item, i) => {
        return i !== index && item.unitCode === value
    })
    if (isDupLicate) {
        proxy.$modal.msgWarning(`${formData.value.rationMtDTOList[index].unitName}在该年度下已维护定额，不能重复添加！`)
        setTimeout(() => {
            formData.value.rationMtDTOList[index].unitCode = ''
        }, 0)
        return false
    }
    return
}

const unitRules = (index) => [
    { required: true, message: '请选择单位', trigger: ['blur', 'change'] },
    {
        validator: (rule, value, callback) => {
            if (!value) {
                callback()
                return
            } else {
                callback()
            }
        },
        trigger: 'change'
    }
]
const amountRules = [
    { required: true, message: '请选择定额', trigger: ['blur', 'change'] },
    {
        validator: (rule, value, callback) => {
            if (!value) {
                callback()
                return
            } else {
                callback()
            }
        },
        trigger: ['blur', 'change']
    }
]

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

const saveData = () => {
    const newMatlAmount = Number(formData.value.rationMtDTOList?.reduce((sum, item) => sum + Number(item.rationAmount || 0), 0))
    if (Object.keys(props.rowData).length === 0) {
        if (Number(newMatlAmount) > Number(unitMoney.value)) {
            proxy.$modal.confirm('路局总定额已超出库存管理目标，是否继续？').then(() => {
                handleAdd()
            }).catch(() => {
                proxy.$modal.closeLoading()
            })
        } else {
            handleAdd()
        }
    } else {
        if (Number(formData.value.rationAmount) > Number(unitMoney.value)) {
            proxy.$modal.confirm('路局总定额已超出库存管理目标，是否继续？').then(() => {
                handleEdit()
            }).catch(() => {
                proxy.$modal.closeLoading()
            })
        } else {
            handleEdit()
        }
    }
}


const handleAdd = () => {
    normListCreateModify({ ...formData.value}).then(({ message }) => {
        proxy.$modal.msgSuccess(message)
        visible.value = false
        emit('createSuccess')
    }).finally(() => {
        proxy.$modal.closeLoading()
    })
}
const handleEdit = () => {
    normListEditModify({ ...formData.value }).then(({ message }) => {
        proxy.$modal.msgSuccess(message)
        visible.value = false
        emit('createSuccess')
    }).finally(() => {
        proxy.$modal.closeLoading()
    })
}

const unitMoney = ref('')
const qyerysumAmount = async (val) => {
    const { data } = await sumAmount({ year: val })
    unitMoney.value = data?.amount || 0
}
const handleChangePicker = (val) => {
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