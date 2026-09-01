<template>
	<div class="integrated-manage-tree-divs">
		<h1 class="supplier-region-dict-h1" v-if="title">{{ title }}</h1>
		<div class="head-container-input" v-if="checkboxFilterShow">
			<el-checkbox-group v-model="checkboxValue" @change="checkboxChange">
				<p class="checkbox-span">显示：</p>
				<el-checkbox border v-for="item in checkboxFilterData"  :label="item.label" :value="item.value" :key="item.value"></el-checkbox>
			</el-checkbox-group>
		</div>
		<div class="head-container-input" v-if="filterShow">
			<el-input v-model="filterText" suffix-icon="Search" :placeholder="placeholder" />
		</div>
		<el-scrollbar class="head-container-tree">
			<el-tree class="drawer-tree" ref="elTree" :indent="0" :data="data" :props="propsObj"
				:expand-on-click-node="false" :filter-node-method="filterNode" :node-key="propsObj.value"
				highlight-current default-expand-all @node-click="handleNodeClick">
				<template #default="{ node, data }">
					<span class="custom-tree-node">
						<span v-if="data[code] && isShow" :title="`[${data[code]}]${node.label}`">
							<template v-if="typeClear">
								[{{ data[code] }}]{{ node.label }}<span class="tree-divs-span">{{ userList[data[code]] &&
			userList[data[code]].checkFlagList.length || 0 }}/{{ userList[data[code]] &&
			userList[data[code]].list.length || 0 }}</span><span v-if="data.children && data.children.length > 0"
									class="el-aside-h-span-icon"></span>
							</template>
							<template v-else>
								<svg-icon v-if="!data.children || (data.children && !data.children.length)" icon-class="Icon-Department"/>
								[{{ data[code] }}]{{ node.label }}
								<span v-if="data.children && data.children.length > 0" class="el-aside-h-span-icon"></span>
							</template>
						</span>
						<span v-else-if="isShowFile">
							{{ node.label }}<span class="el-aside-h-span-icon"> ({{ data.fileNum }})</span>
						</span>
						<slot v-else-if="isSolt" :node="node" :data="data"></slot>
						<span v-else>
							{{ node.label }}<span v-if="data.children && data.children.length > 0"
								class="el-aside-h-span-icon"></span>
						</span>
						<el-button v-if="isButtonModify" class="custom-tree-node-click" icon="el-icon-edit" circle
							@click="modifyNodeClick(data)"></el-button>
					</span>
				</template>
			</el-tree>
		</el-scrollbar>
	</div>
</template>

<script setup>
// 接收参数并指定类型（可选）
const props = defineProps({
	title:{
		type: String,
		default: '供应用料地区'
	},
	propsObj: {
		type: Object,
		default: () => {
			return {
				value: 'id',             // ID字段名
				label: 'unitName',      // 显示名称
				children: 'children'    // 子级字段名
			}
		}
	},
	code: {
		type: String,
		default: 'unitCode'
	},
	heightY: {
		type: String,
		default: '40'
	},
	//树状数据
	data: {
		type: Array,
		default: []
	},
	isShow: {
		type: Boolean,
		default: true
	},
	isShowFile: {
		type: Boolean,
		default: false
	},
	//显示选中数量值
	userList: {
		type: Object,
		default: null
	},
	//是否显示选中数量或是否二次点击清空
	typeClear: {
		type: Boolean,
		default: false
	},
	//默认全部展开
	defaultExpandAll: {
		type: Boolean,
		default: false
	},
	//过滤是否显示
	filterShow: {
		type: Boolean,
		default: false
	},
	//过滤是否显示
	checkboxFilterShow: {
		type: Boolean,
		default: false
	},
	//默认选中
	val: {
		type: String,
		default: ''
	},
	isButtonModify: {
		type: Boolean,
		default: false
	},
	isSolt: {
		type: Boolean,
		default: false
	},
	checkboxFilterData: {
		type: Array,
		default: []
	},
	placeholder: {
		type: String,
		default: ''
	},
	filterData: {
		type: Function,
		default: null
	}
})
const { proxy } = getCurrentInstance()
const value = ref(null)
const filterText = ref('')
const checkboxValue = ref([])

// 声明触发的事件（可选，增强类型校验）
const emit = defineEmits(['handleNodeClick', 'modifyNodeClick', 'checkboxChange'])

watch(filterText, (filterText) => {
	proxy.$refs.elTree.filter(filterText)
})
watch(value, (value) => {
	proxy.$nextTick(() => {
		proxy.$refs.elTree.setCurrentKey(value)
	})
})

const handleNodeClick = (data) => {
	if (!props.typeClear.value) {
		if (value.value instanceof Object && data[props.propsObj.value || 'id'] === value.value[props.propsObj.value || 'id']) {
			value.value = null
			proxy.$refs.elTree.setCurrentKey(null)
		} else {
			value.value = data
		}
	} else {
		value.value = data
	}
	emit('handleNodeClick', value.value)
}

const filterNode = (val, data) => {
	const label = props.propsObj.label
	const code = props.code
	if(!val) return true
	if(data[label]){
		return data[label].indexOf(val) !== -1 || data[code].indexOf(val) !== -1 
	}
	if(props.filterData){
		return props.filterData(val, data)
	}
	return data['deptName'].indexOf(val) !== -1 || data['deptCode'].indexOf(val) !== -1 
}
const modifyNodeClick = (data) => {
	emit('modifyNodeClick', data)
}

const checkboxChange = () => {
	emit('checkboxChange', checkboxValue.value)
}

</script>
<style lang="scss" scoped>
.supplier-region-dict-h1{
  font-size: 16px;
  padding-left: 8px;
  font-weight: 600;
  color: #3d424d;
  .svg-icon{
    margin-right: 2px;
  }
}
.drawer-tree{
	:deep(.ep-tree-node__expand-icon.is-leaf){
		padding: 0;
	}
}
.checkbox-span{
	display: inline-block;
	font-size: 12px;
	color: #000;
	line-height: 32px;
	float: left;
	margin: 0 0 0 8px;
}
.ep-checkbox.is-bordered{
	background: #dee2ec;
	margin-right: 10px;
	:deep(.ep-checkbox__label){
		font-size: 12px;
	}
}
.ep-checkbox.is-bordered.is-checked{
	background: #fff;
	:deep(.ep-checkbox__label){
		color: #606266;
	}
}
</style>
