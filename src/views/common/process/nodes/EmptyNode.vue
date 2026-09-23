<template>
  <node :show="false" @insertNode="type => $emit('insertNode', type)"/>
</template>

<script setup name="EmptyNode">
import Node from './Node'

defineEmits(['insertNode'])
</script>

<style scoped>

</style>
