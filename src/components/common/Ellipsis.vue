<template>
  <div :class="{'line': row === 1, 'lines': row > 1}"
       :title="hoverTip ? content: null"
       :style="{'--row':row}">
    <slot name="pre" />
    {{content}}
  </div>
</template>

<script setup name="Ellipsis">
//超出指定行数自动隐藏文字
defineProps({
  row: {
    type: Number,
    default: 1
  },
  hoverTip: {
    type: Boolean,
    default: false
  },
  content: {
    type: String,
    default: ''
  }
})
</script>

<style lang="scss" scoped>

.line{
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.lines{
  display: -webkit-box;
  word-break: break-all;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: var(--row);
  -webkit-box-orient: vertical;
}
</style>
