import { defineAsyncComponent } from "vue";
//#region Patched field-registry: add date-type-date-range custom component
const SEARCH_TYPE_TO_FIELD = {
	input: "el-input",
	number: "el-input-number",
	numberRange: "el-input-number-range",
	select: "el-select",
	date: "el-date-picker",
	dateTime: "el-date-picker",
	dateRange: "el-date-picker",
	time: "el-time-picker",
	timeRange: "el-time-picker",
	radio: "el-radio-group",
	checkbox: "el-checkbox-group",
	cascader: "el-cascader",
	treeSelect: "el-tree-select",
	slider: "el-slider",
	rate: "el-rate",
	upload: "el-upload",
	tableSelect: "el-table-select",
	preview: "el-preview"
};
const asyncLoaders = {
	"el-input": () => import("element-plus/es/components/input/index.mjs").then((m) => m.ElInput),
	"el-input-number": () => import("element-plus/es/components/input-number/index.mjs").then((m) => m.ElInputNumber),
	"el-input-number-range": () => import("element-plus/es/components/input-number-range/index.mjs").then((m) => m.ElInputNumberRange),
	"input-number-range": () => import("element-plus/es/components/input-number-range/index.mjs").then((m) => m.ElInputNumberRange),
	"el-select": () => import("element-plus/es/components/select/index.mjs").then((m) => m.ElSelect),
	"el-date-picker": () => import("element-plus/es/components/date-picker/index.mjs").then((m) => m.ElDatePicker),
	"el-time-picker": () => import("element-plus/es/components/time-picker/index.mjs").then((m) => m.ElTimePicker),
	"el-time-select": () => import("element-plus/es/components/time-select/index.mjs").then((m) => m.ElTimeSelect),
	"el-switch": () => import("element-plus/es/components/switch/index.mjs").then((m) => m.ElSwitch),
	"el-radio": () => import("element-plus/es/components/radio/index.mjs").then((m) => m.ElRadio),
	"el-radio-group": () => import("element-plus/es/components/radio/index.mjs").then((m) => m.ElRadioGroup),
	"el-checkbox": () => import("element-plus/es/components/checkbox/index.mjs").then((m) => m.ElCheckbox),
	"el-checkbox-group": () => import("element-plus/es/components/checkbox/index.mjs").then((m) => m.ElCheckboxGroup),
	"el-cascader": () => import("element-plus/es/components/cascader/index.mjs").then((m) => m.ElCascader),
	"el-tree-select": () => import("element-plus/es/components/tree-select/index.mjs").then((m) => m.ElTreeSelect),
	"tree-select": () => import("element-plus/es/components/tree-select/index.mjs").then((m) => m.ElTreeSelect),
	"el-slider": () => import("element-plus/es/components/slider/index.mjs").then((m) => m.ElSlider),
	"el-rate": () => import("element-plus/es/components/rate/index.mjs").then((m) => m.ElRate),
	"el-upload": () => import("element-plus/es/components/upload/index.mjs").then((m) => m.ElUpload),
	"el-table-select": () => import("element-plus/es/components/table-select/index.mjs").then((m) => m.ElTableSelect),
	"el-preview": () => import("element-plus/es/components/preview/index.mjs").then((m) => m.ElPreview),
	// ✨ 自定义：日期类型下拉 + 日期范围选择器组合
	"date-type-date-range": () => import("@/views/comprehensive-query/components/DateTypeDateRange.vue").then((m) => m.default || m.DateTypeDateRange || m)
};
const componentCache = /* @__PURE__ */ new Map();
function resolveFieldComponent(name) {
	const key = name || "el-input";
	const cached = componentCache.get(key);
	if (cached) return cached;
	const loader = asyncLoaders[key] || asyncLoaders["el-input"];
	const comp = defineAsyncComponent(loader);
	componentCache.set(key, comp);
	return comp;
}
const SUPPORTED_EDIT_FIELD_NAMES = Object.keys(asyncLoaders);
const SUPPORTED_SEARCH_TYPES = Object.keys(SEARCH_TYPE_TO_FIELD);
//#endregion
export { SEARCH_TYPE_TO_FIELD, SUPPORTED_EDIT_FIELD_NAMES, SUPPORTED_SEARCH_TYPES, resolveFieldComponent };
