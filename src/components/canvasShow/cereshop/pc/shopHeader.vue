<script setup>
import CereClassification from './classification'
import CereBanner from './banner'
import CereHeader from './header'

defineOptions({
  name: 'shopHeader',
})
const props = defineProps({
  componentContent: {
    type: Object
  }
})
</script>

<template>
  <div>
    <cere-header :componentContent="props.componentContent"></cere-header>
    <div class="flex-box hom-content-top pc-warp">
      <cere-classification :componentContent="props.componentContent"></cere-classification>
      <cere-banner :componentContent="props.componentContent"></cere-banner>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.hom-content-top {
  padding-bottom: 20px;
}

.pc-warp {
  width: 1250px;
  margin: 0 auto;
  max-width: 96%;
}
</style>
