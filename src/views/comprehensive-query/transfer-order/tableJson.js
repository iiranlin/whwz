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
            field: 'orderDate',
            title: '下单日期',
            type: 'date',
            hideInTable: true,
            searchable: true,
            searchType: 'dateRange',
            searchSort: 1
        },
        {
            field: 'outsaleCode',
            title: '单据编号',
            type: 'link',
            searchable: true,
            searchType: 'input',
            minWidth: 160,
            searchSort: 2
        },
        {
            field: 'flag',
            title: '单据状态',
            type: 'dict',
            searchable: true,
            searchType: 'select',
            searchProps: {
                options: [
                    { label: '未登卡', value: '0' },
                    { label: '已登卡', value: '1' },
                ],
            },
            searchSort: 3
        },
        {
            field: "rluName",
            title: "收料单位",
            showOverflowTooltip: true,
            align: 'center',
            searchSort: 7,
             minWidth: 160,
        },
        // {
        //     field: "depotName",
        //     title: "调拨地区",
        //     showOverflowTooltip: true,
        //     align: 'center',
        // },
        // {
        //     field: "partitionName",
        //     title: "调拨仓库",
        //     showOverflowTooltip: true,
        //     align: 'center',
        // },
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
            searchSort: 4,
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
                if (!plantCodeObj) return
                try {
                    const res = await warehouseDict({ plantId: plantCodeObj.id })
                    whArr = (res.data || []).map(r => {
                        return { ...r, label: r.whName, value: r.whCode }
                    })
                    setFieldProps('depotCode', { options: whArr })
                } catch (e) {
                    console.warn('warehouseDict 接口调用失败:', e)
                }
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
                if (!whCodeObj) return
                try {
                    const res = await warehouseplantDictList({ whId: whCodeObj.id })
                    const options = (res.data || []).map(r => {
                        return { ...r, label: r.partitionName, value: r.partitionCode }
                    })
                    setFieldProps('partitionCode', { options })
                } catch (e) {
                    console.warn('warehouseplantDictList 接口调用失败:', e)
                }
            },
            searchSort: 6
        },
        // {
        //     field: 'matlName',
        //     title: '调拨人员',
        //     searchable: true,
        //     searchType: 'input',
        //     searchSort: 8
        // },
        // {
        //     field: 'subDate',
        //     title: '调拨日期',
        //     type: 'date',
        // },
        // {
        //     field: 'noteDate',
        //     title: '登卡人',
        //     type: 'date',
        // },
        {
            field: 'matlCode',
            title: '物资编码',
            searchable: true,
            searchType: 'input',
            searchSort: 9,
             minWidth: 160,
        },
        {
            field: 'matlName',
            title: '物资名称',
            searchable: true,
            searchType: 'input',
            searchSort: 10,
             minWidth: 160,
        },
        {
            field: 'matlType',
            title: '规格型号',
            searchable: true,
            searchType: 'input',
            searchSort: 11,
             minWidth: 160,
        },

        {
            field: 'matlUnit',
            title: '计量单位',
          
        },
        {
            field: 'outsaleNum',
            title: '调拨数量',
        },
        {
            field: 'cardPrice',
            title: '库存单价',
        },
        {
            field: 'profitAmount',
            title: '成本金额',
        },
        {
            field: 'outsaleTotalAmount',
            title: '调拨金额',
        },

        // {
        //     field: 'matlUnit',
        //     title: '料差',
        // },
        {
            field: 'fee',
            title: '运杂费',
        },
        {
            field: 'comments',
            title: '备注',
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
        //     searchSort: 12
        // },
        // {
        //     field: 'validityPeriodUnit',
        //     title: '报账信息',
        // },
    ]
}

export const toolbarConfig = {
  buttons: [
    // {code: 'print', name: '打印',type: 'primary', showInTop: true,},
    { code: 'export', name: '导出', type: 'primary', showInTop: true, },
  ]
}





