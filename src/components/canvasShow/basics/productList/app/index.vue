<script setup>
import { computed, onMounted } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import { jumpProductDetail } from '../../../config/mixin'

defineOptions({
  name: 'ProductListApp'
})

const props = defineProps({
  shopId: {
    type: Number,
    default: 0
  },
  componentContent: {
    type: Object,
    default: () => ({})
  }
})

const swiperOptions = {
  modules: [Autoplay, Pagination],
  slidesPerView: 2,
  spaceBetween: 10,
  loop: true,
  autoplay: {
    delay: 3000,
    disableOnInteraction: false
  },
  pagination: {
    clickable: true
  }
}

const productData = computed(() => props.componentContent.productData || [])

onMounted(() => {
  console.log(props.componentContent)
})
</script>

<template>
  <div class="hom-pro-list">
    <div class="title">
      <label>{{ componentContent.title }}</label>
      <a class="btn-all a-link" @click="jumpDiscount({ shopId: props.shopId, id: componentContent.shopDiscountId })">
        查看全部<i class="iconfont icon-arrow-right"></i>
      </a>
    </div>
    <div class="pro-box">
      <swiper v-bind="swiperOptions">
        <swiper-slide v-for="(item, index) in productData" :key="index">
          <div class="pro-item" @click="jumpProductDetail(item)">
            <div class="pro-item-img">
              <img v-show="item.image" class="img" :src="item.image">
            </div>
            <div class="pro-item-info">
              <label class="name">{{ item.productName }}</label>
              <div class="price">
                <label class="unit">¥ </label>
                <label class="val"> {{ item.price }}</label>
              </div>
              <label class="buyCount" v-if="item.total && item.stockNumber">{{ item.total - item.stockNumber
                }}人已拼</label>
            </div>
          </div>
        </swiper-slide>
      </swiper>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.hom-pro-list {
  padding: 30px 0 42px;

  .title {
    margin-left: 30px;
    display: flex;
    align-items: center;

    label {
      font-size: 36px;
      font-weight: bold;
      margin-left: 20px;
    }
  }

  .weekStore-swiper {
    padding: 30px;

    .store-box {
      width: 620px;
      height: 570px;
      // border:1px solid #ccc;
      box-shadow: 0px 0px 15px 0px rgba(52, 52, 52, 0.15);
      border-radius: 10px;
      overflow: hidden;

      .store-backImg {
        width: 620px;
        height: 414px;
        background-repeat: no-repeat;
        position: relative;
        background-color: #f5f5f5;

        .img {
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

      .store-namebox {
        display: inline-block;
        padding: 0 50px 0 10px;
        height: 40px;
        line-height: 40px;
        background-color: #FFFFFF;
        border-radius: 0 20px 20px 0;
        position: relative;
        z-index: 2;

        .store-name {
          padding: 0px;
        }

        .store-logo {
          width: 38px;
          height: 38px;
        }
      }

      .storeDetail-box {
        background-color: #FFFFFF;

        .discountsPrice {
          text-decoration: line-through;
        }

        .price-box {
          padding: 20px 24px;
        }

        .inStoreshop {
          position: absolute;
          right: 50px;
          color: #FFFFFF;
          background-color: #FF7700;
          border-radius: 24px;
          font-size: 24px;
          padding: 12px 24px;
        }

        .shop-title {
          overflow: hidden;
          text-overflow: ellipsis;
          -ms-text-overflow: ellipsis;
          display: flex;
          line-clamp: 1;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
        }
      }
    }

  }
}

.swiper-pagination {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 30px 0;
  bottom: 0;

  :deep(.swiper-pagination-bullet) {
    width: 10px;
    height: 10px;
    background: #333333;
    opacity: 0.3;
    border-radius: 5px;
    margin: 0 5px;
  }

  :deep(.swiper-pagination-bullet-active) {
    width: 20px;
    height: 10px;
    opacity: 1;
  }
}

/****/
.goodRecommend {
  .goos-box {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
  }

  .goodRecommend-titleImg {
    width: 44px;
    height: 44px;
  }

  .goodsImg-box {
    width: 336px;
    height: 336px;
    background-color: #f5f5f5;
    border-radius: 10px 10px 0 0;

    .img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }

  .storeArrow-icon {
    width: 20px;
    height: 20px;
  }

  .recommendGoods-title {
    width: 295px;
    display: block;
    word-break: keep-all;
    /* 不换行 */
    white-space: nowrap;
    /* 不换行 */
    overflow: hidden;
    /* 内容超出宽度时隐藏超出部分的内容 */
  }

  .goodRecommend-box {
    width: 336px;

    .goodRecommendDetail-box {
      background-color: #FFFFFF;
      box-shadow: 0px 0px 15px 0px rgba(52, 52, 52, 0.15);
      border-radius: 0 0 10px 10px;
      padding: 20px;

      label {
        font-weight: normal;
      }

      .productName {
        font-size: 28px;
        color: #333;
        display: block;
        margin-bottom: 18px;
      }

      .buyCount {
        color: #999;
        font-size: 24px;
        margin-bottom: 10px;
        display: block;
      }

      .priceBox {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        margin-bottom: 10px;

        .price {
          color: #FF7800;

          .unit {
            font-size: 24px;
          }

          .val {
            font-size: 36px;
          }
        }

        .originalPrice {
          font-size: 24px;
          color: #999;
          text-decoration: line-through;
        }
      }

      .shopName {
        display: flex;
        justify-content: space-between;
        font-size: 22px;
        color: #999;

        label {
          color: #999;
        }
      }
    }

    .recommendGoodsDes {
      width: 295px;
    }
  }
}

.pad-top-20 {
  padding-top: 20px;
}

.pad-top-30 {
  padding-top: 30px;
}

.mar-left-10 {
  margin-left: 10px;
}

.mar-left-20 {
  margin-left: 20px;
}

.mar-top-30 {
  margin-top: 30px;
}

.fs22 {
  font-size: 22px;
}

.fs24 {
  font-size: 24px;
}

.fs28 {
  font-size: 28px;
}

.fs30 {
  font-size: 30px;
}

.font-color-999 {
  color: #999999;
}

.font-color-FF7800 {
  color: #FF7800;
}

.flex-items-plus {
  display: flex;
  justify-content: center;
  align-items: center;
}

.flex-start {
  display: flex;
  justify-content: flex-start;
}

.flex-row {
  flex-direction: row
}

.align-end {
  display: flex;
  align-items: flex-end;
}
</style>
