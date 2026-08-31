<template>
    <ep-dialog class="ep-dialog-list" :title="title" iconTitle="form" v-model="visible" width="50vw" top="5vh"
        append-to-body>
        <div class="sso-front-table-container app-container">
            <el-row :gutter="20" class="app-container-row integrated-manage-pane-form integrated-manage-pane-form-a">
                <el-col class="app-container-col">
                    <el-form :model="formData" ref="elForm" :inline="true" label-width="80px" class="form-data"
                        :rules="rules">
                        <el-row>
                            <el-col :span="9">
                                <el-form-item label="年度：" prop="year">
                                    <el-date-picker v-model.trim="formData.year" type="year" placeholder="请输入"
                                        value-format="YYYY" :disabled="props.rowType === 'detail'" style="width: 220px"
                                        @change="handleChangePicker" clearable />
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                    <el-divider style="margin-top: 0px"></el-divider>
                    <!-- 表格数据 -->
                    <div style="height:calc(100% - 80px)">
                        <el-pro-table ref="proTableRef" :columns="matlTableJson" :search-collapse-threshold="5"
                            :data="tableData" @search="onSearch" :show-pagination="false" :show-checkbox="false"
                            selection-mode="single" :grid-options="{ rowId: 'unitCode' }" :show-action="false"
                            :default-search-form="defaultSearchForm">
                            <template #amount="{ row, column, index }">
                                <el-input v-if="props.rowType !== 'detail'" v-model="row.amount"
                                    v-number-input.float="2" clearable />
                                <span v-else>{{ row.amount }}</span>
                            </template>
                        </el-pro-table>
                    </div>

                </el-col>
            </el-row>
        </div>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="visible = false" class="cancel-btn"><svg-icon
                        icon-class="cancel" />&nbsp;关闭</el-button>
                <el-button v-if="props.rowType !== 'detail'" type="primary" class="determine-btn"
                    @click="saveBtn"><svg-icon icon-class="determine" />&nbsp;保存</el-button>
            </div>
        </template>
    </ep-dialog>
</template>
<script setup>
import { normLgetUnitListWithout, normListCreateModify, normListEditModify, normListEditChange, normListDetail } from '@/api/reserve-quote/stock-entry'
import { getCurrentInstance, reactive, toRefs } from 'vue';
import { matlTableJson, } from "../tableJson"
const { proxy } = getCurrentInstance()
const props = defineProps({
    rowData: {
        type: Object,
        default: () => { }
    },
    rowType: {
        type: String,
        default: ''
    }
})
const visible = defineModel({ default: false })
const loading = ref(false)
const title = ref('')
const tableData = ref([])
const formData = ref({})
const proTableRef = shallowRef(null)
watch(visible, async (newVal) => {
    if (newVal) {
        switch (props.rowType) {
            case "add":
                title.value = "新增"
                getList()
                break;
            case "edit":
                title.value = "编辑"
                handlenormListDetail()
                break;
            case "detail":
                title.value = "详情"
                handlenormListDetail()
                break;
            case "change":
                title.value = "变更"
                handlenormListDetail()
                break;
            default:
                return null;
        }
    } else {
        proxy.$refs.elForm && proxy.$refs.elForm.resetFields()
        tableData.value = []
    }
})
const rules = ref({
    year: [{ required: true, message: '请选择年度', trigger: ['blur', 'change'] }],
})
const defaultSearchForm = {
    sysCode: '02',
    enableStatus: '1',
    unitStatus: '1',
};

const queryParams = ref({
    pageNum: 1,
    pageSize: 30,
    sysCode: '02',
    enableStatus: '1',
    unitStatus: '1',

})
const handlenormListDetail = async () => {
    const { data } = await normListDetail(props.rowData.id)
    formData.value = data
    tableData.value = data.inventoryManageDtDTOList
}
// 声明触发的事件（可选，增强类型校验）
const emit = defineEmits(['createSuccess']);
const getList = (val) => {
    loading.value = true
    normLgetUnitListWithout().then(({ data }) => {
        tableData.value = data?.map((item) => {
            return {
                ...item,
                railwayName: item.unitName,
                railwayCode: item.unitCode,
                amount: 0
            }
        })
    }).finally(() => {
        loading.value = false
    })
}
const onSearch = (params, pageConfig) => {
    queryParams.value = { ...params, ...pageConfig }
    getList()
}
const handleChangePicker = (val) => {
    formData.value.year = val
    // if(props.rowType === 'add'){
    //     tableData.value = []
    //     getList(val)
    // }

}
const saveBtn = () => {
    proxy.$refs.elForm.validate(valid => {
        if (!valid) {
            return
        } else {
            switch (props.rowType) {
                case "add":
                    handleAdd()
                    break;
                case "edit":
                    handleEdit()
                    break;
                case "change":
                    handleChange()
                    break;
                default:
                    return null;
            }
        }
    })
}
const handleAdd = () => {
    proxy.$modal.loading()
    let params = {
        ...formData.value,
        dtSaveParamList: proTableRef.value?.getCurrentData(),
    }
    normListCreateModify(params).then(({ message }) => {
        proxy.$modal.msgSuccess(message)
        visible.value = false
        emit('createSuccess')
    }).finally(() => {
        proxy.$modal.closeLoading()
    })
}
const handleEdit = () => {
    proxy.$modal.loading()
    let params = {
        ...formData.value,
        dtModifyParamList: proTableRef.value?.getCurrentData(),
    }
    normListEditModify(params).then(({ message }) => {
        proxy.$modal.msgSuccess(message)
        visible.value = false
        emit('createSuccess')
    }).finally(() => {
        proxy.$modal.closeLoading()
    })
}
const handleChange = () => {
    proxy.$modal.loading()
    let params = {
        ...formData.value,
        dtModifyParamList: proTableRef.value?.getCurrentData(),
    }
    normListEditChange(params).then(({ message }) => {
        proxy.$modal.msgSuccess(message)
        visible.value = false
        emit('createSuccess')
    }).finally(() => {
        proxy.$modal.closeLoading()
    })
}
</script>
<style lang="scss" scoped>
.form-data {
    margin-top: 10px;
}
</style>