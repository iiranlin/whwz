<template>
  <div>
    <div v-if="mode === 'DESIGN'">
      <el-date-picker size="medium" v-model="_value" disabled :type="type" :start-placeholder="placeholder[0]" :end-placeholder="placeholder[1]"/>
      <div v-if="showLength" class="length">
        <span>时长：</span>
        <span>{{timeLength}}</span>
      </div>
    </div>
    <div v-else>
      <template>
        <el-date-picker v-if="!readerMode" v-model="_value" size="medium" clearable :value-format="format" :type="type" :start-placeholder="placeholder[0]" :end-placeholder="placeholder[1]"/>
        <div v-else v-text="value[0] + ' ~ ' + value[1]"></div>
      </template>

      <div v-if="showLength" class="length">
        <span>时长：</span>
        <span>{{timeLength}}</span>
      </div>
    </div>
  </div>
</template>

<script setup name="DateTimeRange">
import { computed } from 'vue'

const props = defineProps({
  value: {
    type: Array,
    default: () => {
      return []
    }
  },
  format: {
    type: String,
    default: 'yyyy-MM-dd HH:mm'
  },
  placeholder: {
    type: Array,
    default: () => {
      return ['开始时间', '结束时间']
    }
  },
  showLength: {
    type: Boolean,
    default: false,
  },
  readerMode: {
    type: Boolean,
    default: false,
  },
  mode: {
    type: String,
    default: 'DESIGN'
  },
  required: {
    type: Boolean,
    default: false
  },
})
const emit = defineEmits(['input'])

const _value = computed({
  get() { return props.value },
  set(v) { emit('input', v) }
})

const type = computed(() => {
  switch (props.format) {
    case 'yyyy-MM-dd': return 'daterange';
    case 'yyyy-MM-dd HH:mm': return 'datetimerange';
    default: return 'daterange';
  }
})

const timeLength = computed(() => {
  //求时长算法（保持原注释代码不变）
  // if (Array.isArray(props.value)){
  //   let start = moment(props.value[0]).format(props.format.replaceAll('dd', 'DD'))
  //   let end = moment(props.value[1]).format(props.format.replaceAll('dd', 'DD'))
  //   if (start === end){
  //     return '0 （时长为0，请确认）'
  //   }
  //   let mstart = moment(start);
  //   let mend = moment(end)
  //   let years = mend.diff(start, 'years')
  //   let months = mend.diff(start, 'months')
  //   let days = mend.diff(start, 'days')
  //   let hours = mend.diff(start, 'hours')
  //   let minutes = mend.diff(start, 'minutes')
  //   minutes = minutes % 60
  //   hours = hours % 24
  //   months = months % 12
  //   if(mstart.date() < mend.date()){
  //     days = mend.date() - mstart.date()
  //     if (minutes > 0 || hours > 0){
  //       days --;
  //     }
  //   }
  //   if (days > 31 && mend.month() - mstart.month() >= 2){
  //     days = mend.diff(mstart.add(mend.month() - mstart.month() - 1, 'month'), 'days')
  //   }
  //   return `${years > 0 ? years + '年 ': ' '}${months > 0 ? months + '个月 ': ' '}
  //           ${days > 0 ? days + '天 ': ' '}${hours > 0 ? hours + '小时 ': ' '}
  //           ${minutes > 0 ? minutes + '分钟 ': ' '}`
  // } else {
  //   return '先选择时间哦'
  // }
})
</script>

<style scoped>
.length{
  margin-top: 5px;
}
.length:nth-child(2){
  color: #8c8c8c;
}
:deep(.el-date-editor--datetimerange.el-input__inner){
  width: 100%;
  max-width: 400px;
}
</style>
