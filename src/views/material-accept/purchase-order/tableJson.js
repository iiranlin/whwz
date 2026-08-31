
import { getUnitList, selectListWithoutLogin } from '@/api/materialAccept/purchaseOrder'
import { getCookie } from '@/utils/auth'
const getUnitListData = async () => {
    let { data } = await getUnitList()
    return data.map(item => {
        return {
            label: item.unitName,
            value: item.unitCode,
            ...item
        }
    })
}
const selectListWithout = async (val) => {
    let { data } = await selectListWithoutLogin({
        unitCode: val
    })
    return data.map(item => {
        return {
            label: item.plantName,
            value: item.plantCode,
            ...item
        }
    })
}
async function createRichColumns() {
    const plantArr = await getUnitListData()
    return [
        {
            field: 'spdCode',
            title: '采购订单号',
            showOverflowTooltip: true,
            searchable: true,
            searchType: 'input',
        },
        {
            field: 'spdSeq',
            title: '明细号',
            showOverflowTooltip: true,
            searchable: false,
            searchType: 'input',
        },
        {
            field: 'suName',
            title: '供应商',
            showOverflowTooltip: true,
            searchable: true,
            searchType: 'input',
        },
        {
            field: 'apunitCode',
            title: '申请单位',
            showOverflowTooltip: true,
            hideInTable: getCookie('unitLevel') === '3' && getCookie('sysCode') !== '08' ? true : false,
            searchable: getCookie('unitLevel') === '3' && getCookie('sysCode') !== '08' ? false : true,
            searchType: 'select',
            searchProps: {
                options: plantArr,
                clearable: true,
            },
        },
        {
            field: 'plantCode',
            title: '用料地区',
            showOverflowTooltip: true,
            searchable: getCookie('unitLevel') === '3' && getCookie('sysCode') !== '08' ? false : true,
            hideInTable: getCookie('unitLevel') === '3' && getCookie('sysCode') !== '08' ? true : false,
            searchType: 'select',
            searchProps: { options: [], clearable: true },
            dependsOn: ['apunitCode'],
            async onDependencyChange({
                form,
                changedField,
                setFieldValue,
                setFieldProps,
            }) {
                if (changedField !== 'apunitCode') return
                setFieldValue('plantCode', undefined)
                const options = await selectListWithout(form.apunitCode)
                setFieldProps('plantCode', { options })
            },
        },
        {
            field: 'plantCode',
            title: '用料地区',
            showOverflowTooltip: true,
            hideInTable: getCookie('unitLevel') === '3' && getCookie('sysCode') !== '08' ? false : true,
            searchable: getCookie('unitLevel') === '3' && getCookie('sysCode') !== '08' ? true : false,
            searchType: 'select',
            requestOptions: () => selectListWithout(getCookie('unitCode')),
        },
        {
            field: 'purPlantName',
            title: '供应地区',
            showOverflowTooltip: true,
            searchable: false,
            searchType: 'input',
        },
        {
            field: 'purcTypeName',
            title: '采购方式',
            showOverflowTooltip: true,
            searchable: false,
            searchType: 'input',
        },
        {
            field: 'matlCode',
            title: '物资编码',
            showOverflowTooltip: true,
            searchable: true,
            searchType: 'input',
        },
        {
            field: 'matlName',
            title: '物资名称',
            showOverflowTooltip: true,
            searchable: true,
            searchType: 'input',
        },
        {
            field: 'matlType',
            title: '规格型号',
            showOverflowTooltip: true,
            searchable: true,
            searchType: 'input',
        },
        {
            field: 'matlRaw',
            title: '材质',
            showOverflowTooltip: true,
            searchable: false,
            searchType: 'input',
        },

        {
            field: 'maltpCode',
            title: '图号',
            showOverflowTooltip: true,
            searchable: false,
            searchType: 'input',
        }, {
            field: 'matlUnit',
            title: '计量单位',
            showOverflowTooltip: true,
            searchable: false,
            searchType: 'input',
        },
        {
            field: 'madeBrand',
            title: '产地/品牌',
            showOverflowTooltip: true,
            searchable: false,
            searchType: 'input',
        },

        {
            field: 'contPrice',
            title: '单价',
            showOverflowTooltip: true,
            searchable: false,
            searchType: 'input',
        },
        {
            field: 'purNum',
            title: '数量',
            showOverflowTooltip: true,
            searchable: false,
            searchType: 'input',
        },
        {
            field: 'signinNum',
            title: '验收通过数量',
            showOverflowTooltip: true,
            searchable: false,
            searchType: 'input',
        },
        {
            field: 'sumAmount',
            title: '采购金额',
            showOverflowTooltip: true,
            searchable: false,
            searchType: 'input',
        },
        {
            field: 'bmName',
            title: '制单人',
            showOverflowTooltip: true,
            searchable: false,
            searchType: 'input',
        },
        {
            field: 'credCode',
            title: '技证号',
            showOverflowTooltip: true,
            searchable: false,
            searchType: 'input',
        },
        {
            field: 'makeDate',
            title: '制定日期',
            type: 'date',
            dateFormat: 'YYYY-MM-DD',
            searchable: true,
            searchType: 'dateRange',
        },
    ]
}
// 懒导出：模块顶层不执行请求，进入页面调用 columns() 时才发请求（避免打包后未登录即触发 401）
export const columns = createRichColumns

//查看验收历史
export const acceptanceColumns = [
    {
        field: 'userName',
        title: '操作人',
        showOverflowTooltip: true,
        searchable: false,
        searchType: 'input',
    },
    {
        field: 'batchNo',
        title: '发货批次号',
        showOverflowTooltip: true,
        searchable: false,
        searchType: 'input',
    },
    {
        field: 'deliverNum',
        title: '发货数量',
        showOverflowTooltip: true,
        searchable: false,
        searchType: 'input',
    },
    {
        field: 'acceptanceNum',
        title: '验收通过数量',
        showOverflowTooltip: true,
        searchable: false,
        searchType: 'input',
    },
    {
        field: 'createTime',
        title: '发货日期',
        showOverflowTooltip: true,
        searchable: false,
        searchType: 'input',
        type: 'date',
        dateFormat: 'YYYY-MM-DD',
    },
    {
        field: 'acceptanceFlag',
        title: '验收状态',
        showOverflowTooltip: true,
        searchable: false,
        searchType: 'select',
        options: [
            { label: '未验收', value: '0' },
            { label: '验收中', value: '1' },
            { label: '终验通过', value: '2' },
            { label: '重验', value: '3' },
            { label: '验收终止', value: '4' },
            { label: '退货', value: '5' },
            { label: 'PC端签认', value: '6' },
            { label: '换货', value: '7' },
        ],
    },

    {
        field: 'arrivalFlag',
        title: '到货状态',
        showOverflowTooltip: true,
        searchable: false,
        searchType: 'select',
        options: [
            { label: '未到货', value: '0' },
            { label: '已到货', value: '1' },
        ],
    },
]



