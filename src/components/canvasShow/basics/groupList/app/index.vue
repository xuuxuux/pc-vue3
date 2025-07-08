<script setup>
import { ref, onMounted, watch } from 'vue'
import { sendReq, jumpProductDetail, jumpDiscount } from '../../../config/mixin'
import api from '../../../config/api'
import Cookies from 'js-cookie'
defineOptions({
  name: 'imageTextList',
})
const productData = ref([])
const props = defineProps({
  terminal: {
    type: Number,
    default: 4
  },
  typeId: {
    type: Number,
    default: 1
  },
  shopId: {
    type: Number,
    default: 0
  },
  componentContent: {
    type: Object
  }
})
onMounted(() => {
  console.log(props.componentContent)
})
watch(props.componentContent, () => {
  getData()
}, {
  deep: true
})

const getData = () => {
  if (props.typeId === 1) {
    // 平台端
    sendReq({
      url: `${api.getProducts}?page=1&pageSize=99&type=1&ids=${props.componentContent.productData.productIdList}`,
      method: 'GET'
    }, (proRes) => {
      productData.value = proRes.data.list
    })
  } else if (props.typeId === 3) {
    // 商家端
    if (props.componentContent.shopGroupWorkId) {
      const params = {
        method: 'GET',
        url: `${api.getGroupWorks}?shopId=${Cookies.get('cereShopId')}&ids=${props.componentContent.shopGroupWorkId}`,
      }
      sendReq(params, (res) => {
        productData.value = res.data[0].products
      })
    } else {
      productData.value = []
    }
  }
}
</script>


<template>
  <div class="hom-pro-list">
    <div class="title">
      <label>{{ props.componentContent.title }}</label>
      <a class="btn-all a-link"
        @click="jumpDiscount({ shopId: props.shopId, id: props.componentContent.shopDiscountId })">查看全部<i
          class="iconfont icon-arrow-right"></i></a>
    </div>
    <div class="pro-box">
      <div class="pro-item" v-for="(item, index) in productData" :key="index" @click="jumpProductDetail(item)">
        <div class="pro-item-img">
          <img v-show="item.image" class="img" :src="item.image">
        </div>
        <div class="pro-item-info">
          <label class="name">{{ item.productName }}</label>
          <div class="price">
            <label class="unit">¥ </label>
            <label class="val"> {{ item.price }}</label>
          </div>
          <label class="buyCount" v-if="item.total && item.stockNumber">{{ item.total - item.stockNumber }}人已拼</label>
        </div>
      </div>
    </div>
  </div>
</template>


<style lang="scss" scoped>
.hom-pro-list {
  padding: 20px 0;

  .title {
    display: flex;
    align-items: center;
    position: relative;
    margin: 0 30px 20px;

    label {
      font-size: 30px;
      font-weight: bold;
    }

    .btn-all {
      position: absolute;
      right: 0;
      top: 10px;
      line-height: 22px;
      padding-right: 20px;
      font-size: 24px;
      color: #999;

      .iconfont {
        content: '';
        position: absolute;
        right: 0;
        top: 0;
      }
    }
  }

  .pro-box {
    padding-left: 15px;

    .pro-item {
      width: 220px;
      height: 330px;
      background: #FFFFFF;
      box-shadow: 0px 2px 9px 0px rgba(51, 51, 51, 0.1);
      border-radius: 10px;
      margin: 0 0 15px 15px;
      display: inline-block;

      .pro-item-img {
        .img {
          width: 220px;
          height: 220px;
          border-radius: 10px 10px 0px 0px
        }
      }

      .pro-item-info {
        text-align: center;

        .name {
          font-size: 24px;
          font-weight: normal;
          line-height: 36px;
        }

        .price {
          color: #FF7800;
          margin-bottom: 5px;

          .unit {
            font-size: 22px;
          }

          .val {
            font-size: 26px;
          }
        }

        .buyCount {
          font-size: 20px;
          color: #999;
          font-weight: normal;
        }
      }
    }
  }
}
</style>
