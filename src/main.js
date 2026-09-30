import {createApp} from 'vue'

import Cookies from 'js-cookie'

import ElementPlus from 'element-plus'
// import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/src/index.scss'
// import 'element-plus/theme-chalk/dark/css-vars.css'
import locale from 'element-plus/es/locale/lang/zh-cn'

import '@/assets/styles/index.scss' // global css
import '@/styles/table-summary-footer.scss' // pro-table footer 汇总合并行样式
import App from './App'
import store from './store'
import router from './router'
import directive from './directive' // directive
// 注册指令
import plugins from './plugins' // plugins
import {download} from '@/utils/request'

// svg图标
import 'virtual:svg-icons-register'
import SvgIcon from '@/components/SvgIcon'
import elementIcons from '@/components/SvgIcon/svgicon'

import './permission' // permission control
// import {addDateRange, handleTree, parseTime, resetForm, selectDictLabel, selectDictLabels} from '@/utils/generalMethod'
import {addDateRange, handleTree, parseTime, resetForm, selectDictLabel} from '@/utils/generalMethod'

// 分页组件
import Pagination from '@/components/Pagination'
// 富文本组件
import Editor from '@/components/Editor'
// 文件上传组件
import FileUpload from '@/components/FileUpload'
// 图片上传组件
import ImageUpload from '@/components/ImageUpload'
// 图片预览组件
import ImagePreview from '@/components/ImagePreview'

// 自定义表格工具组件
import RightToolbar from '@/components/RightToolbar'

// 弹框
import EpDialog from '@/components/epDialog'

// 打印
import Print from 'vue3-print-nb'

import WDialog from "@/components/common/WDialog";
import Ellipsis from "@/components/common/Ellipsis";

import FormData from '@/components/PublicListingPage/FormData'
import TableIndex from '@/components/PublicListingPage/TableIndex'
import ButtonTop from "@/components/PublicListingPage/ButtonTop"
import ElProTable from '@/components/ElProTable/index.vue'
import actions from '@/actions.js'

import {qiankunWindow, renderWithQiankun} from 'vite-plugin-qiankun/dist/helper'

let app = null

// 全局错误兜底（安全网）：渲染类错误逃逸到此处，说明错误边界未拦截到、组件树可能已损坏，
// 此时自动刷新页面恢复，避免"菜单点不动"（带防循环保护：2 分钟内不重复自动刷新）
let lastAutoReloadTs = 0

// 封装渲染函数（兼容独立运行/微应用运行）
function render(props = {}) {
  actions.setActions(props)
  const {container, parentStore} = props
  // 微应用模式：挂载到主应用指定的容器；独立模式：挂载到#app
  const mountDom = container ? container.querySelector('#app') :'#app'

  app = createApp(App)

  app.config.errorHandler = (err) => {
    const now = Date.now()
    if (now - lastAutoReloadTs > 120000) {
      lastAutoReloadTs = now
      window.location.reload()
    }
  }


  // 全局方法挂载
  app.config.globalProperties.download = download
  app.config.globalProperties.parseTime = parseTime
  app.config.globalProperties.resetForm = resetForm
  app.config.globalProperties.handleTree = handleTree
  app.config.globalProperties.addDateRange = addDateRange
  app.config.globalProperties.selectDictLabel = selectDictLabel
  // app.config.globalProperties.selectDictLabels = selectDictLabels

// 全局组件挂载
  app.component('Pagination', Pagination)
  app.component('FileUpload', FileUpload)
  app.component('ImageUpload', ImageUpload)
  app.component('ImagePreview', ImagePreview)
  app.component('Editor', Editor)
  app.component('RightToolbar', RightToolbar)
  app.component('EpDialog', EpDialog)
  app.component('WDialog', WDialog)
  app.component('Ellipsis', Ellipsis)
  app.use(Print)
  app.use(store)
  app.use(router)
  app.use(plugins)
  app.use(elementIcons)
  app.component('svg-icon', SvgIcon)

//公共列表和查询组件
  app.component('FormData', FormData)
  app.component('TableIndex', TableIndex)
  app.component('ButtonTop', ButtonTop)
  app.component('ElProTable', ElProTable)

  directive(app)

// 使用element-plus 并且设置全局的大小
  app.use(ElementPlus, {
    namespace: 'ep',
    locale: locale,
    // 支持 large、default、small
    size: Cookies.get('size') || 'default'
  })

  app.provide('parentStore', parentStore) // 注入父级store
    .mount(mountDom)
}

// 独立运行时直接渲染
if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
  console.log('独立运行模式')
  render()
}

// 暴露qiankun要求的生命周期钩子（由vite-plugin-qiankun辅助实现）
renderWithQiankun({
  // 微应用激活时触发
  mount(props) {
    // console.log('vue3-vite子应用挂载', props)
    render(props)
  },
  // 微应用更新时触发（可选）
  update(props) {
    // console.log('vue3-vite子应用更新', props)
  },
  // 微应用卸载时触发
  unmount(props) {
    // console.log('vue3-vite子应用卸载', props)
    app.unmount()
    app = null
  },
  // 微应用首次加载前触发（可选）
  bootstrap() {
    console.log('vue3-vite子应用初始化')
  }
})