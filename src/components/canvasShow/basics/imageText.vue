<script setup>
import { jumpLink } from '../config/mixin'
// 组件名称
defineOptions({
  name: 'imageTextComponent',
})
// 组件参数
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
  <div class="imageText warp" :class="['terminal' + terminal, 'pos-' + props.componentContent.positionValue]">
    <div class="img img-left">
      <a @click="jumpLink(props.componentContent.linkObj)"><img :src="props.componentContent.imageUrl" alt=""></a>
    </div>
    <div class="text">
      <h3 class="h3">{{ props.componentContent.title }}</h3>
      <div v-html="props.componentContent.content"></div>
    </div>
    <div class="img img-right">
      <a @click="jumpLink(props.componentContent.linkObj)"><img :src="props.componentContent.imageUrl" alt=""></a>
    </div>
  </div>
</template>


<style lang="scss" scoped>
.imageText {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;

  .img {
    width: 50%;
    padding-bottom: 30%;
    background-color: #cacaca;
    position: relative;

    img {
      max-width: 100%;
      height: 100%;
      max-height: 100%;
      position: absolute;
      margin: auto;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
    }
  }

  .text {
    width: 40%;

    .h3 {
      font-size: 30px;
      margin-bottom: 24px;
    }

    .p {
      font-size: 16px;
    }
  }

  &.pos-top {
    display: block;
    text-align: center;

    .img {
      width: 100%;
    }

    .text {
      width: 100%;
      margin-top: 30px;
    }

    .img-right {
      display: none;
    }
  }

  &.pos-bottom {
    display: block;
    text-align: center;

    .img {
      width: 100%;
    }

    .text {
      width: 100%;
      margin-bottom: 30px;
    }

    .img-left {
      display: none;
    }
  }

  &.pos-left {
    .img-right {
      display: none;
    }
  }

  &.pos-right {
    .text {
      padding-left: 20px;
    }

    .img-left {
      display: none;
    }
  }
}
</style>
