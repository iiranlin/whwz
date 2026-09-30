<template>
  <div>
    <el-form label-position="top" label-width="90px">
      <el-form-item label="选择触发的动作" prop="text" class="user-type">
        <el-radio-group v-model="config.type">
          <el-radio label="WEBHOOK">发送网络请求</el-radio>
          <el-radio label="EMAIL">发送邮件</el-radio>
        </el-radio-group>
      </el-form-item>
      <div v-if="config.type === 'WEBHOOK'">
        <el-form-item label="请求地址" prop="text">
          <el-input placeholder="请输入" size="medium" v-model="config.http.url" >
            <el-select v-model="config.http.method" style="width: 85px;" #prepend placeholder="URL">
              <el-option label="GET" value="GET"></el-option>
              <el-option label="POST" value="POST"></el-option>
              <el-option label="PUT" value="PUT"></el-option>
              <el-option label="DELETE" value="DELETE"></el-option>
            </el-select>
          </el-input>
        </el-form-item>
        <el-form-item label="Header请求头" prop="text">
          <template #label>
            <span style="margin-right: 10px">Header请求头</span>
            <el-button type="text" @click="addItem(config.http.headers)"> + 添加</el-button>
          </template>
          <div v-for="(header, index) in config.http.headers" :key="header.name">
            - <el-input placeholder="参数名" size="small" style="width: 100px;" v-model="header.name" />
            <el-radio-group size="small" style="margin: 0 5px;" v-model="header.isField">
              <el-radio-button :label="true">表单</el-radio-button>
              <el-radio-button :label="false">固定</el-radio-button>
            </el-radio-group>
            <el-select v-if="header.isField" style="width: 180px;" v-model="header.value" size="small" placeholder="请选择表单字段">
              <el-option v-for="form in forms" :key="form.id" :label="form.title" :value="form.title"></el-option>
            </el-select>
            <el-input v-else placeholder="请设置字段值" size="small" v-model="header.value" style="width: 180px;"/>
            <el-icon class="Delete" @click="delItem(config.http.headers, index)" style="margin-left: 5px; color: #c75450; cursor: pointer"/>
          </div>
        </el-form-item>
        <el-form-item label="Header请求参数" prop="text">
          <template #label>
            <span style="margin-right: 10px">Header请求参数   </span>
            <el-button style="margin-right: 20px" type="text" @click="addItem(config.http.params)">  + 添加</el-button>
            <span>参数类型 - </span>
            <el-radio-group size="mini" style="margin: 0 5px;" v-model="config.http.contentType">
              <el-radio-button label="JSON">json</el-radio-button>
              <el-radio-button label="FORM">form</el-radio-button>
            </el-radio-group>
          </template>
          <div v-for="(param, index) in config.http.params" :key="param.name">
            - <el-input placeholder="参数名" size="small" style="width: 100px;" v-model="param.name" />
            <el-radio-group size="small" style="margin: 0 5px;" v-model="param.isField">
              <el-radio-button :label="true">表单</el-radio-button>
              <el-radio-button :label="false">固定</el-radio-button>
            </el-radio-group>
            <el-select v-if="param.isField" style="width: 180px;" v-model="param.value" size="small" placeholder="请选择表单字段">
              <el-option v-for="form in forms" :key="form.id" :label="form.title" :value="form.title"></el-option>
            </el-select>
            <el-input v-else placeholder="请设置字段值" size="small" v-model="param.value" style="width: 180px;"/>
            <el-icon class="Delete" @click="delItem(config.http.params, index)" style="margin-left: 5px; color: #c75450; cursor: pointer"/>
          </div>
          <div>

          </div>
        </el-form-item>
        <el-form-item label="请求结果处理" prop="text">
          <template #label>
            <span>请求结果处理</span>
            <span style="margin-left: 20px">自定义脚本: </span>
            <el-switch v-model="config.http.handlerByScript"></el-switch>
          </template>
          <span class="item-desc" v-if="config.http.handlerByScript">
          👉 返回值为 ture 则流程通过，为 false 则流程将被驳回
          <div>支持函数
            <span style="color: dodgerblue">setFormByName(
              <span style="color: #939494">'表单字段名', '表单字段值'</span>
              )</span>
            可改表单数据
          </div>
        </span>
          <span class="item-desc" v-else>👉 无论请求结果如何，均通过</span>
          <div v-if="config.http.handlerByScript">
            <div>
              <span>请求成功😀：</span>
              <el-input type="textarea" v-model="config.http.success" :rows="3"></el-input>
            </div>
            <div>
              <span>请求失败😥：</span>
              <el-input type="textarea" v-model="config.http.fail" :rows="3"></el-input>
            </div>
          </div>
        </el-form-item>
      </div>
      <div v-else-if="config.type === 'EMAIL'">
        <el-form-item label="邮件主题" prop="text">
          <el-input placeholder="请输入" size="medium" v-model="config.email.subject" />
        </el-form-item>
        <el-form-item label="收件方" prop="text">
          <el-select size="small" style="width: 100%;" v-model="config.email.to" filterable multiple allow-create default-first-option placeholder="请输入">
            <el-option v-for="item in config.email.to" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="邮件正文" prop="text">
          <el-input type="textarea" v-model="config.email.content" :rows="4" placeholder="邮件内容，支持变量提取表单数据 ${表单字段名} "></el-input>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script setup name="TriggerNodeConfig">
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { useProcessStore } from '@/store/modules/process'

const props = defineProps({
  config: {
    type: Object,
    default: () => ({})
  }
})

const processStore = useProcessStore()

const forms = computed(() => processStore.design.formItems || [])

const cmOptions = ref({
  tabSize: 4,
  indentUnit: 4,
  styleActiveLine: true,
  lineNumbers: true,
  styleSelectedText: true,
  line: true,
  foldGutter: true,
  gutters: ['CodeMirror-linenumbers', 'lock', 'warn'],
  highlightSelectionMatches: { showToken: /w/, annotateScrollbar: true },
  mode: 'javascript',
  hintOptions: {
    completeSingle: false
  },
  keyMap: 'sublime',
  matchBrackets: true,
  showCursorWhenSelecting: false,
  theme: 'material',
  extraKeys: { 'Ctrl': 'autocomplete' },
  lastLineBefore: 0
})

function addItem(items) {
  if (items.length > 0 && (items[items.length - 1].name.trim() === ''
      || items[items.length - 1].value.trim() === '')) {
    ElMessage.warning('请完善之前项后在添加')
    return
  }
  items.push({ name: '', value: '', isField: true })
}

function delItem(items, index) {
  items.splice(index, 1)
}

function onCmCodeChange() {
}

function onCmReady() {
}
</script>

<style lang="scss" scoped>
.item-desc{
  color: #939494;
}
</style>
