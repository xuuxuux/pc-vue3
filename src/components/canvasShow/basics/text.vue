<script setup>
// 组件名称
defineOptions({
  name: 'textComponent',
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
  <div class="text warp"
    :class="['text-' + props.componentContent.textPos, { 'show-more': props.componentContent.showMore }, 'terminal' + props.terminal]"
    :style="{ backgroundColor: props.componentContent.bgColor }">
    <div class="line-warp" :class="{ 'borderBot': props.componentContent.showLine }">
      <h3 class="h3"
        :style="{ fontSize: props.componentContent.fontSizeNum + 'px', fontWeight: props.componentContent.textFontW, color: props.componentContent.titColor }">
        {{ props.componentContent.title }}</h3>
      <p class="p"
        :style="{ fontSize: props.componentContent.describeSizeNum + 'px', fontWeight: props.componentContent.describeFontW, color: props.componentContent.describeColor }">
        {{ props.componentContent.describe }}</p>
      <div class="btn-more" v-show="props.componentContent.showMore"
        :class="'style' + props.componentContent.styleValue">
        <span>查看更多</span><i class="iconfont icon-arrow-right"></i>
      </div>
    </div>
  </div>
</template>


<style lang="scss" scoped>
.text {
  padding: 0px 20px;
  position: relative;

  .line-warp {
    padding: 10px 0;
  }

  .borderBot {
    border-bottom: 1px solid #cccc;
  }

  .h3 {
    line-height: 1.5;
  }

  .p {
    line-height: 1.5;
    margin-top: 5px;
  }

  .style1 {}

  .style2 {
    .iconfont {
      display: none;
    }
  }

  .style3 {
    span {
      display: none;
    }
  }

  &.text-left {
    text-align: left;

    &.show-more {
      position: relative;
      padding-right: 20px;

      .btn-more {
        position: absolute;
        right: 0;
        top: 10px;
      }
    }
  }

  &.text-center {
    text-align: center;
  }

  &.text-right {
    text-align: right;
  }
}
</style>
