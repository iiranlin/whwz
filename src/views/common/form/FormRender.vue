<template>
  <!--渲染表单-->
  <el-form ref="formRef" class="process-form" label-position="top" :rules="rules" :model="_value">
    <el-form-item v-if="item.name !== 'SpanLayout' && item.name !== 'Description'" :prop="item.id" :label="item.title" v-for="(item, index) in forms" :key="item.name + index">
      <form-design-render :ref="(el) => { if (el) subItemRefs[item.id] = el }" v-model="_value[item.id]" mode="PC" :config="item"/>
    </el-form-item>
    <form-design-render ref="span-layout" v-else v-model="_value" mode="PC" :config="item"/>
  </el-form>
</template>

<script setup name="FormRender">
import { ref, computed, reactive } from 'vue'
import FormDesignRender from '@/views/admin/layout/form/FormDesignRender'

const props = defineProps({
  forms: {
    type: Array,
    default: () => {
      return []
    }
  },
  modelValue: {
    type: Object,
    default: () => {
      return {}
    }
  }
})
const emit = defineEmits(['update:modelValue'])

const formRef = ref(null)
const rules = reactive({})
const subItemRefs = reactive({})

const _value = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

function validate(call) {
  let success = true
  formRef.value.validate(valid => {
    success = valid
    if (valid) {
      //校验成功再校验内部
      for (let i = 0; i < props.forms.length; i++) {
        if (props.forms[i].name === 'TableList') {
          let formItem = subItemRefs[props.forms[i].id]
          if (formItem && Array.isArray(formItem) && formItem.length > 0) {
            formItem[0].validate(subValid => {
              success = subValid
            })
            if (!success) {
              break
            }
          }
        }
      }
    }
    call(success)
  });
}

function loadFormConfig(forms) {
  forms.forEach(item => {
    if (item.name === 'SpanLayout') {
      loadFormConfig(item.props.items)
    } else {
      _value.value[item.id] = props.modelValue[item.id]
      if (item.props.required) {
        rules[item.id] = [{
          type: item.valueType === 'Array' ? 'array' : undefined,
          required: true,
          message: `请填写${item.title}`, trigger: 'blur'
        }]
      }
    }
  })
}

// created 等价：setup 顶层直接执行
loadFormConfig(props.forms)
</script>

<style lang="scss" scoped>
.process-form {
  :deep(.el-form-item__label) {
    padding: 0 0;
  }
}
</style>
