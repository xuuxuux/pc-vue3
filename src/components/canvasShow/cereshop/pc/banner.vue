<script setup>
import { computed } from 'vue'
import { jumpLink } from '../../config/mixin'
defineOptions({
  name: 'cereBanner',
})
const props = defineProps({
  componentContent: {
    type: Object
  }
})
const bannerList = computed(() => {
  return props.componentContent.bannerData.filter(function (item) {
    return item.bannerUrl
  })
})

</script>

<template>
  <div class="banner" :class="[{ 'on': props.componentContent.categoryShow }]">
    <el-carousel>
      <el-carousel-item v-for="(item, index) in bannerList" :key="index"
        :style="{ backgroundImage: 'url(' + item.bannerUrl + ')' }">
        <a class="a-link" @click="jumpLink(item.linkObj)"><img class="img" :src="item.bannerUrl"
            v-show="item.bannerUrl"></a>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>



<style lang="scss" scoped>
.banner {
  width: 0;
  flex: 1;

  .el-carousel {
    :deep(.el-carousel__container) {
      height: 470px;

      .el-carousel__item {
        background-color: #fff;
        background-repeat: no-repeat;
        background-position: center;

        .a-link {
          display: block;
          width: 100%;
          height: 100%;
        }

        .img {
          display: none;
          width: 100%;
        }
      }
    }
  }
}

@media screen and (max-width: 768px) {
  .banner {
    width: 100%;

    .el-carousel {
      :deep(.el-carousel__container) {
        height: 170px;

        .el-carousel__item {
          background-position: -9999px;

          .img {
            display: block;
          }
        }
      }
    }
  }
}

.device-xiaochengxu,
.device-h5,
.device-phone {
  &.banner {
    width: 100%;

    .el-carousel {
      :deep(.el-carousel__container) {
        height: 170px;

        .el-carousel__item {
          background-position: -9999px;

          .img {
            display: block;
          }
        }
      }
    }
  }
}
</style>
