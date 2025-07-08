<script setup>
// 组件名称
defineOptions({
  name: 'videoBox',
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
  <div class="videoBox warp" :class="'terminal' + props.terminal">
    <div class="videoLeftBox">
      <h3>{{ props.componentContent.title }}</h3>
      <div v-html="props.componentContent.mainBody"></div>
    </div>
    <div class="videoRightBox">
      <video class="myVideo" id="myVideo" :src="props.componentContent.videoUrl" enable-danmu danmu-btn
        controls></video>
    </div>
    <div class="clear"></div>
  </div>
</template>

<style lang="scss" scoped>
.videoBox {
  padding: 20px 0;
  display: flex;
  justify-content: flex-start;
  align-items: center;

  .videoLeftBox {
    width: 50%;
    padding-right: 10%;

    h3 {
      font-size: 28px;
      color: #333333;
      margin-bottom: 30px;
    }

    p {
      color: #333333;
      font-size: 14px;
      line-height: 30px;
    }
  }

  .videoRightBox {
    width: 50%;

    video {
      width: 100%;
    }
  }

  .clear {
    clear: both;
  }
}

.terminal1,
.terminal2,
.terminal3 {
  &.videoBox {
    display: block;

    .videoLeftBox {
      width: 100%;
      text-align: center;
      margin-bottom: 20px;
    }

    .videoRightBox {
      width: 100%;
    }
  }
}
</style>
