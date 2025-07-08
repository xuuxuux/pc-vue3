<script setup>
defineOptions({
  name: 'assistDiv',
})
const props = defineProps({
  terminal: {
    type: Number,
    default: 4
  },
  componentContent: {
    type: Object
  }
})
</script>

<template>
  <div class="div"
    :style="{ backgroundColor: props.componentContent.bgColor, height: props.componentContent.height + 'px' }"></div>
</template>

<style scoped>
.div {
  width: 100%;
}
</style>
