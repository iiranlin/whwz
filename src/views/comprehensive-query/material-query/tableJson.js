import { plantDictList, warehouseDict, warehouseplantDictList, } from '@/api/rmstor/price-adjustment'
const plantData = async () => {
    try {
        const res = await plantDictList()
        return (res.data || []).map(item => {
            return { ...item, label: item.plantName, value: item.plantCode }
        })
    } catch (e) {
        console.warn('plantDictList 接口调用失败:', e)
        return []
    }
}
export const columns = async () => {
    const plantArr = await plantData()
    let whArr = []
    return [
        {
            field: 'deptCode',
            title: '车间班组',
            hideInTable: true,
            searchable: true,
            searchType: 'input',
            searchSort: 1
        },
        {
            field: 'orderDate',
            title: '下单日期',
            type: 'date',
            hideInTable: true,
            searchable: true,
            searchType: 'dateRange',
            searchSort: 3
        },
        // {
        //     field: 'orderDate',
        //     title: '审核日期',
        //     type: 'date',
        //     hideInTable: true,
        //     searchable: true,
        //     searchType: 'dateRange',
        //     searchSort: 7
        // },

        {
            field: "plantName",
            title: "用料地区",
            showOverflowTooltip: true,
            align: 'center',
        },
        {
            field: "depotName",
            title: "仓库",
            showOverflowTooltip: true,
            align: 'center',
        },
        {
            field: "partitionName",
            title: "仓库分区",
            showOverflowTooltip: true,
            align: 'center',
        },
        {
            field: "plantCode",
            title: "用料地区",
            searchable: true,
            hideInTable: true,
            searchType: 'select',
            searchProps: {
                options: plantArr,
                clearable: true,
            },
            searchSort: 4
        },
        {
            field: "depotCode",
            title: "仓库",
            searchable: true,
            hideInTable: true,
            searchType: 'select',
            searchProps: { options: [], clearable: true },
            dependsOn: ['plantCode'],
            async onDependencyChange({ form, changedField, setFieldValue, setFieldProps }) {
                if (changedField !== 'plantCode') return
                setFieldValue('depotCode', undefined)
                setFieldProps('depotCode', { options: [] })
                if (!form.plantCode) return
                const plantCodeObj = plantArr.find(a => a.plantCode === form.plantCode)
                const res = await warehouseDict({ plantId: plantCodeObj.id })
                whArr = res.data.map(r => {
                    return { ...r, label: r.whName, value: r.whCode }
                })
                setFieldProps('depotCode', { options: whArr })
            },
            searchSort: 5
        },
        {
            field: "partitionCode",
            title: "仓库分区",
            searchable: true,
            hideInTable: true,
            searchType: 'select',
            searchProps: { options: [], clearable: true },
            dependsOn: ['plantCode', 'depotCode'],
            async onDependencyChange({ form, changedField, setFieldValue, setFieldProps }) {
                if (changedField !== 'depotCode' && changedField !== 'plantCode') return
                setFieldValue('partitionCode', undefined)
                setFieldProps('partitionCode', { options: [] })
                if (!form.depotCode) return
                const whCodeObj = whArr.find(a => a.whCode === form.depotCode)
                const res = await warehouseplantDictList({ whId: whCodeObj.id })
                const options = res.data.map(r => {
                    return { ...r, label: r.partitionName, value: r.partitionCode }
                })
                setFieldProps('partitionCode', { options })
            },
            searchSort: 6
        },
        {
            field: 'deptName',
            title: '车间',
            minWidth: 160,
        },
        // {
        //     field: 'partitionName',
        //     title: '支出班组',
        // },
        {
            field: 'matlClassName',
            title: '材料分类',
            minWidth: 160,
        },
        // {
        //     field: 'partitionName',
        //     title: '支出项目',
        // },
        // {
        //     field: 'partitionName',
        //     title: '科目',
        // },
        {
            field: 'makerName',
            title: '下单人',
            minWidth: 160,
        },
        {
            field: 'noteName',
            title: '登卡人',
            minWidth: 160,
        },
        {
            field: 'noteDate',
            title: '登卡日期',
            type:'date'
        },
        // {
        //     field: 'partitionName',
        //     title: '审核人',
        //     type: 'dict',
        //     hideInTable: true,
        //     searchable: true,
        //     searchType: 'select',
        //     searchProps: {
        //         options: [
        //             { label: '未提交', value: '0' },
        //             { label: '未登卡', value: '1' },
        //             { label: '已登卡', value: '2' },
        //         ],
        //     },
        //     searchSort: 8
        // },
        // {
        //     field: 'partitionName',
        //     title: '审核日期',
        // },
        {
            field: 'returnCode',
            title: '退料单号',
            searchable: true,
            searchType: 'input',
            searchSort: 10,
            type:'link',
            minWidth: 160,
        },
        {
            field: 'flag',
            title: '登卡状态',
            type: 'dict',
            hideInTable: true,
            searchable: true,
            searchType: 'select',
            searchProps: {
                options: [
                    { label: '未登卡', value: '0' },
                    { label: '已登卡', value: '1' },
                    { label: '已审核', value: '3' },
                    { label: '已制证', value: '4' },
                ],
            },
            searchSort: 2
        },
        {
            field: 'matlCode',
            title: '物资编码',
            searchable: true,
            searchType: 'input',
            searchSort: 11,
            minWidth: 160,
        },
        {
            field: 'matlName',
            title: '物资名称',
            searchable: true,
            searchType: 'input',
            searchSort: 12,
            minWidth: 160,
        },
        {
            field: 'matlType',
            title: '规格型号',
            searchable: true,
            searchType: 'input',
            searchSort: 13,
            minWidth: 160,
        },
        {
            field: 'matlUnit',
            title: '计量单位',
            align:'center'
        },
        {
            field: 'rmNum',
            title: '数量',
              align:'center'
        },
        {
            field: 'rmAmount',
            title: '金额',
              align:'right'
        },
        // {
        //     field: 'isPush',
        //     title: '报账状态',
        //     type: 'dict',
        //     searchable: true,
        //     searchType: 'select',
        //     searchProps: {
        //         options: [
        //             { label: '未报账', value: '0' },
        //             { label: '已报账', value: '1' },
        //         ],
        //     },
        //     searchSort: 9
        // },
        // {
        //     field: 'validityPeriodUnit',
        //     title: '报账信息',
        // },
    ]
}

export const toolbarConfig = {
    buttons: [
        // { code: 'print', name: '打印', type: 'primary', showInTop: true, },
        { code: 'export', name: '导出', type: 'primary', showInTop: true, },
    ]
}





