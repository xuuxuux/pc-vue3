<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
const props = defineProps({
  productList: Array
})
const toProductDetail = (item) => {
  let data = {
    productId: item.id
  }
  router.push({
    path: '/productDetail',
    query: {
      proData: JSON.stringify(data)
    }
  })
}
</script>
<template>
  <div class="product">
    <div class="productBox" v-for="(item, index) in props.productList" :key="index">
      <img class="cur-poi" :src="$api.BASEURL + item.image" alt="" @click="toProductDetail(item)" />
      <p class="productName">{{ item.storeName }}</p>
      <div class="price">
        <span class="presentPrice">¥{{ item.price }}</span>
        <span class="originalPrice">¥{{ item.otPrice }}</span>
      </div>
      <div class="line"></div>
      <p class="productDesc">{{ item.storeInfo }}</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.product {
  width: 100%;
  display: flex;
  flex-flow: wrap;
  margin-bottom: 30px;

  .productBox {
    width: 282px;
    margin-bottom: 50px;
    margin-right: 11px;
    transition: all 0.3s linear;
    text-align: center;

    img {
      width: 282px;
      height: 282px;
      margin-bottom: 27px;
    }

    .productName {
      font-weight: bold;
      margin-bottom: 12px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .price {
      margin-bottom: 12px;

      .presentPrice {
        font-size: 18px;
        font-weight: bold;
        color: #ff7800;
      }

      .originalPrice {
        font-size: 16px;
        text-decoration: line-through;
        margin-left: 10px;
      }
    }

    .line {
      width: 160px;
      height: 2px;
      background-color: #f0f0f0;
      margin: 0 auto;
    }

    .productDesc,
    .shopName {
      margin-top: 20px;
      color: #999999;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 30px;

      span {
        width: 16px;
        height: 14px;
        margin-right: 5px;
        background-image: url('../../../static/image/dainpu@2x.png');
      }
    }

    .shopName {
      cursor: pointer;
    }
  }

  .productBox:nth-of-type(4n) {
    margin-right: 0;
  }

  .productBox:hover {
    box-shadow: 0 0 20px #cccccc;
  }
}
</style>
