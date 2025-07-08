<script setup>
import { ElInputNumber } from 'element-plus/es'
import 'element-plus/es/components/base/style/css'
import 'element-plus/es/components/input-number/style/css'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import likeList from './likeList.vue'
import evaluation from './evaluation.vue'
// import 'swiper/dist/css/swiper.css'
// import detailData from './detailData'
// import CereHeader from '@/components/canvasShow/cereshop/pc/header'
import api from '@/api'
import { sendReq } from '@/config/mixin'
import { useUserStore } from '@/stores'
import Cookie from 'js-cookie'
import { ref, onMounted, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
defineOptions({
  name: 'ProductDetail'
})
const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const currentComp = ref('detailData')
const swiperTop = ref(null)
const swiperThumbs = ref(null)
const productDetailData = ref({})
const specList = ref([])// 规格列表
const skuList = ref([])// sku列表
const skuInfo = ref({})// sku信息
const specSelected = ref([])// 选中的规格
const favorite = ref(false)// 是否收藏
const similarProducts = ref([])// 猜你喜欢
// const activeName = ref('Detail')// 当前选中的tab
// const currentProductData = ref({})// 当前商品数据
const replyCount = ref(0)// 回复数量
const productNumber = ref(1)// 商品数量
const swiperOptions = {
  modules: [Navigation, Pagination],
  slidesPerView: 1,
  spaceBetween: 0,
  loop: true,
  navigation: true,
  pagination: {
    clickable: true
  }
}
const currentPro = ref(JSON.parse(route.query.proData))
// const reload = inject('reload')

onMounted(() => {
  if (!Cookie.get('token')) {
    userStore.setCartNumber('SET_CARTNUMBER')
    userStore.setShoppingCart('SET_SHOPPINGCART')
    userStore.setCollectData('SET_COLLECTDATA')
  }
  getProductInfo()
  getLikeProduct()
  nextTick(() => {
    swiperTop.value = swiperTop.value.swiper
    swiperThumbs.value = swiperThumbs.value.swiper
    swiperTop.value.controller.control = swiperThumbs.value
    swiperThumbs.value.controller.control = swiperTop.value
  })
})
watch(specSelected, (e) => {
  // 监听规格参数变化
  let sku = ''
  e.forEach((item) => {
    sku += item.attr + ','
  })
  sku = sku.substring(0, sku.length - 1)
  let s = skuList.value
  skuInfo.value = s[sku]
})

// 获取商品详情
const getProductInfo = () => {
  // const rLoading = this.openLoading()
  let params = {
    url: api.getProDetail + currentPro.value.productId,
    method: 'GET'
  }
  sendReq(params, (res) => {
    if (res.status === 200) {
      productDetailData.value = res.data.storeInfo
      specList.value = res.data.productAttr
      favorite.value = productDetailData.value.userCollect
      skuList.value = res.data.productValue
      replyCount.value = res.data.replyCount
      // 规格 默认选中第一条
      specList.value.forEach((item) => {
        item.attrValue[0].check = true
        specSelected.value.push(item.attrValue[0])
      })
      window.scrollTo(0, 0)
      // rLoading.close()
    } else {
      ElMessage.warning(res.msg)
    }
  })
}
// 获取猜你喜欢
const getLikeProduct = () => {
  let params = {
    url: api.getIndexLike,
    method: 'GET'
  }
  sendReq(params, (res) => {
    if (res.status === 200) {
      similarProducts.value = res.data.splice(0, 4)
    } else {
      ElMessage.warning(res.msg)
    }
  })
}
const reloadDetail = () => {
  router.go(0)
  // this.reload()
}

// 加入购物车
const clickAddCart = () => {
  if (skuInfo.value.stock > 0) {
    let params = {
      url: api.addCart,
      method: 'POST',
      data: {
        cartNum: productNumber.value,
        uniqueId: skuInfo.value.unique,
        productId: productDetailData.value.id,
        new: 0
      }
    }
    sendReq(params, (res) => {
      if (res.status === 200) {
        ElMessage.success('添加成功')
        getTrolleyList()
      } else {
        ElMessage.warning(res.msg)
      }
    })
  } else {
    ElMessage.warning('商品库存不足')
  }
}
// 购物车列表
const getTrolleyList = () => {
  const params = {
    url: api.getTrolleyList,
    method: 'GET'
  }
  sendReq(params, res => {
    const d = res.data.valid
    userStore.setShoppingCart(d)
    userStore.setCartNumber(d.length)
  })
}
// 切换tab
const clickSwitchTab = (type) => {
  currentComp.value = type
}
// 购买
const buyGood = () => {
  if (skuInfo.value.stock > 0) {
    if (!Cookie.get('token')) {
      ElMessage.warning('请先登录')
      userStore.resetStore()
      router.push({ path: '/login' })
    } else {
      let params = {
        url: api.addCart,
        method: 'POST',
        data: {
          cartNum: productNumber.value,
          uniqueId: skuInfo.value.unique,
          productId: productDetailData.value.id,
          new: 1
        }
      }
      sendReq(params, (res) => {
        if (res.status === 200) {
          let cartId = res.data.cartId
          router.push({
            path: '/placeOrder',
            query: {
              cartId: cartId
            }
          })
        } else {
          ElMessage.warning(res.msg)
        }
      })
    }
  } else {
    ElMessage.warning('商品库存不足')
  }
}
// 选择规格sku
const selectSku = (index, cindex) => {
  specSelected.value = []
  specList.value.forEach((item, sindex) => {
    if (index === sindex) {
      for (let i = 0; i < item.attrValue.length; i++) {
        if (i === cindex) {
          item.attrValue[i].check = true
        } else {
          item.attrValue[i].check = false
        }
      }
    }
  })

  specList.value.forEach((item) => {
    for (let i = 0; i < item.attrValue.length; i++) {
      if (item.attrValue[i].check) {
        specSelected.value.push(item.attrValue[i])
      }
    }
  })
}
// 轮播图
const thumbsClick = (index) => {
  swiperThumbs.value.slideTo(index, 300, false)
  swiperTop.value.slideTo(index, 300, false)
}
// 收藏
const collect = () => {
  if (favorite.value === false) {
    let params = {
      url: api.collect,
      method: 'POST',
      data: {
        category: 'collect',
        id: productDetailData.value.id
      }
    }
    sendReq(params, (res) => {
      if (res.status === 200) {
        ElMessage.success('收藏成功')
        favorite.value = true
      }
    })
  } else {
    let params = {
      url: api.unfavorite,
      method: 'POST',
      data: {
        category: 'collect',
        id: productDetailData.value.id
      }
    }
    sendReq(params, (res) => {
      if (res.status === 200) {
        ElMessage.success('取消成功')
        favorite.value = false
      }
    })
  }
}
// 替换图片src
const replaceImgSrc = (basePrefix, questionContent) => {
  if (questionContent) {
    questionContent = questionContent.replace(new RegExp(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi), function (match, capture) {
      match = match.replace(new RegExp(capture, 'g'), basePrefix + capture)
      return match
    })
    return questionContent
  }
}

</script>

<template>
  <div>
    <div class="productBox warp">
      <div class="productConcise clearfix">
        <div class="swiper-box" style="height: 560px">
          <!-- swiper1 -->
          <swiper v-bind="swiperOptions">
            <swiper-slide v-for="(item, index) in productDetailData.sliderImageArr" :key="index">
              <img :src="$api.BASEURL + item" class="product-image">
            </swiper-slide>
          </swiper>
          <!-- swiper2 Thumbs -->
          <div class="swiperThumbsLeft">
            <div class="thumbsBox">
              <swiper :options="swiperOptions" class="gallery-thumbs" ref="swiperThumbs">
                <swiper-slide v-for="(item, index) in productDetailData.sliderImageArr" :key="index"
                  :style="{ backgroundImage: 'url(' + $api.BASEURL + item + ')' }">
                  <div style="width: 100%; height: 100%;" @click="thumbsClick(index)"></div>
                </swiper-slide>
                <div class="swiper-button-prev swiper-button-white iconfont">&#xe660;</div>
                <div class="swiper-button-next swiper-button-white iconfont">&#xe695;</div>
              </swiper>
            </div>
          </div>
        </div>
        <div class="proDuctInfo">
          <h3 class="productTit">{{ productDetailData.storeName }}</h3>
          <p class="introduction">{{ productDetailData.storeInfo }}</p>
          <div class="priceDataInfo">
            <div class="promotionInfo">
              <span>价格:</span>
              <span>￥{{ skuInfo.price }}</span>
              <span>￥{{ skuInfo.otPrice }}</span>
            </div>
          </div>
          <div class='sku-box'>
            <ul v-for='(item, index) in specList' :key='index'>
              <li>
                <p class="proDescribeTit">{{ item.attrName }}</p>
                <p>
                  <span @click='selectSku(index, sindex)' v-for='(spec, sindex) in item.attrValue' :key='sindex'
                    :class="[{ 'selected-item': spec.check }]">
                    {{ spec.attr }}
                  </span>
                </p>
              </li>

            </ul>
          </div>
          <div class="productNumber">
            <div class="proDescribeTit">数量：</div>
            <div class="proNumberList">
              <el-input-number v-model="productNumber" :min="1" :max="skuInfo.stock" label="库存"></el-input-number>
              <span>库存<b>{{ skuInfo.stock }}</b>件</span>
            </div>
          </div>
          <div class="btnBox">
            <div class="buyBox" v-if="skuInfo.stock !== 0">
              <span @click="clickAddCart">加入购物车</span>
              <span @click='buyGood'>购买</span>
            </div>
            <div class="noStock" v-if="skuInfo.stock === 0">
              <span>已售空</span>
            </div>
            <div class="favoritesBtn" @click="collect">
              <img style="width:18px;height:18px;margin-top:3px;" v-if="favorite === false"
                src="../../../static/image/sc0.png" alt="">
              <img style="width:18px;height:18px;margin-top:3px;" v-else src="../../../static/image/sc1.png" alt="">
              <span>收藏</span>
            </div>
          </div>
        </div>
        <div class="clearfix"></div>
      </div>
      <div class="productDetail">
        <div class="detailTabs">
          <span :class="{ compActive: currentComp === 'detailData' }"
            @click="clickSwitchTab(type = 'detailData')">宝贝详情</span>
          <span :class="{ compActive: currentComp === 'evaluation' }"
            @click="clickSwitchTab(type = 'evaluation')">商品评论</span>
        </div>
        <div class="detailBox clearfix">
          <div class="detailInfoBox">
            <div v-show="currentComp === 'detailData'">
              <div class="detailBox">
                <div class="detailCont" v-html="replaceImgSrc($api.BASEURL, productDetailData.description)"></div>
              </div>
            </div>
            <div v-show="currentComp === 'evaluation'">
              <evaluation v-if="replyCount > 0" :evaluateParam="productDetailData"></evaluation>
            </div>
          </div>
          <div class="likeProductBox">
            <like-list @reloadDetail="reloadDetail" :similarProducts="similarProducts"></like-list>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>



<style lang="scss" scoped>
.productBox {
  margin-top: 50px;

  .productConcise {
    margin-bottom: 60px;

    .swiper-box {
      width: 580px;
      position: relative;
      margin-right: 50px;
      float: left;

      .swiper-slide {
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;

        &.slide-1 {
          background-image: url('../../../static/image/tu1@2x.png');
        }

        &.slide-2 {
          background-image: url('../../../static/image/tu3@2x.png');
        }

        &.slide-3 {
          background-image: url('../../../static/image/tup2@2x.png');
        }

        &.slide-4 {
          background-image: url('../../../static/image/likeProduct1.png');
        }

        &.slide-5 {
          background-image: url('../../../static/image/poornetwork@2x.png');
        }
      }

      .gallery-top {
        height: 100% !important;
        width: 440px;
        position: absolute;
        right: 0;
      }

      .swiperThumbsLeft {
        width: 120px;
        position: absolute;
        left: 0;
        top: 10%;
        box-sizing: border-box;
        padding: 10px 0;
        height: 80%;

        .thumbsBox {
          width: 100%;
          height: 100%;
          position: relative;

          .swiper-button-prev,
          .swiper-button-next {
            position: absolute;
            left: 45px;
            background: none;
            width: 32px;
            height: 32px;
            line-height: 32px;
            text-align: center;
            background: #999999;
            color: #FFFFFF;
          }

          .swiper-button-prev {
            position: absolute;
            top: -30px;
          }

          .swiper-button-next {
            position: absolute;
            top: initial;
            bottom: -50px;
          }
        }
      }

      .gallery-thumbs {
        position: relative;
        width: 100%;
        height: 100%;
      }

      .gallery-thumbs .swiper-slide {
        width: 100%;
        opacity: 0.7;
      }

      .gallery-thumbs .swiper-slide-active {
        opacity: 1;
        border: 1px solid $mainColor;
        box-sizing: border-box;
      }
    }

    .proDuctInfo {
      width: 578px;
      float: left;

      .productTit {
        font-size: 22px;
        color: #333333;
      }

      .introduction {
        color: #999999;
        font-size: 14px;
        line-height: 30px;
        margin: 10px 0;
      }

      .priceDataInfo {
        background: #FFF8F2;
        height: auto;

        .groupBuyInfo {
          display: flex;
          justify-content: space-between;
          background: #FF6B63;
          height: 32px;
          align-items: center;
          padding: 0 16px;

          .groupLeft {
            display: flex;
            color: #FFFFFF;
            align-items: center;

            i {
              font-size: 22px;
              margin-right: 5px;
            }

            span {
              font-family: YouSheBiaoTiHei;
              font-style: italic;
              font-weight: bold;
            }
          }

          .groupRight {
            color: #FFFFFF;
          }

          .countdown {
            display: flex;
            font-size: 14px;
            color: #FFFFFF;

            .countdownTit {
              line-height: 20px;
              margin-right: 5px;
            }

            .timeDown {
              span {
                display: inline-block;
                text-align: center;
                height: 20px;
                line-height: 20px;
              }

              .time {
                min-width: 20px;
                background-color: #fff;
                color: #FF6B63;
              }
            }
          }
        }

        .priceSpike {
          display: flex;
          margin-top: 15px;
          padding: 0 15px;
          justify-content: space-between;

          .priceSpikeLeft {
            display: flex;
            color: #EC4B42;
            align-items: center;
            font-size: 16px;

            b {
              color: $mainColor;
              font-size: 22px;
              margin-right: 10px;
            }

            span {
              font-size: 16px;
              font-weight: 400;
              text-decoration: line-through;
              color: #666666;
            }
          }

          .priceSpikeRight {
            display: flex;
            align-items: center;

            span {
              margin-right: 15px;
              color: #999999;
              font-size: 14px;
            }

            :deep(.el-progress) {
              box-sizing: border-box;
              width: 100px;
              height: 10px;
              border-radius: 0;
              border: 1px solid #FF736C;
              background: #F5F5F5;

              .el-progress-bar {
                display: block;
                height: 100%;

                .el-progress-bar__inner {
                  border-radius: 0;
                  height: 100%;
                }

                .el-progress-bar__outer {
                  border-radius: 0;
                  height: 100% !important;
                }

                .el-progress-bar__innerText {
                  display: none;
                }
              }
            }
          }
        }

        .promotionInfo {
          padding: 16px 16px 20px 16px;

          span:nth-child(1) {
            font-size: 16px;
            color: #999999;
          }

          span:nth-child(2) {
            font-size: 22px;
            color: $mainColor;
          }

          span:nth-child(3) {
            font-size: 16px;
            color: #666666;
            text-decoration: line-through;
          }
        }

        .proDiscount {
          padding: 2px 0 16px;
          max-height: 112px;
          overflow-y: auto;
          box-sizing: border-box;

          .discountInfo {
            span:nth-child(1) {
              font-size: 16px;
              color: #999999;
            }

            span:nth-child(2) {
              font-size: 14px;
              color: $mainColor;
              border: 1px solid $mainColor;
              padding: 0 2px;
              border-radius: 4px;
            }

            span:nth-child(3) {
              font-size: 14px;
              color: #666666;
            }
          }

          .activityLabel {
            padding-left: 20px;
            margin-bottom: 20px;

            span:nth-child(1) {
              font-size: 14px;
              color: $mainColor;
              border: 1px solid $mainColor;
              padding: 1px 2px;
              border-radius: 4px;
            }

            span:nth-child(2) {
              font-size: 14px;
              color: #666666;
            }

            span:nth-child(3) {
              font-size: 14px;
              color: $mainColor;
              text-decoration: underline;
              cursor: pointer;
            }
          }

          .activityLabel:last-child {
            margin-bottom: 0;
          }
        }
      }

      .proDescribeTit {
        color: #000000;
        font-size: 16px;
        margin: 18px 0;
      }

      .productColor {
        .proColorList {
          display: flex;

          div {
            border: 1px solid #FFFFFF;
            padding: 4px;
            margin-right: 15px;
            cursor: pointer;

            span {
              display: block;
              height: 37px;
              width: 37px;
              border: 1px solid #EEEEEE;

              img {
                width: 100%;
              }
            }
          }

          // div.colorActive {
          // }
        }
      }

      .sku-box {
        ul {
          li {
            p {
              &:nth-child(2) {
                span {
                  display: inline-block;
                  padding: 0 10px;
                  height: 32px;
                  line-height: 32px;
                  text-align: center;
                  color: #666666;
                  font-size: 18px;
                  background: #EFEFEF;
                  margin-right: 20px;
                  margin-bottom: 15px;
                  cursor: pointer;
                }

                .selected-item {
                  background: $mainColor;
                  color: #FFFFFF;
                }
              }
            }
          }
        }
      }

      .productSize {
        .proSizeList {
          display: flex;

          span {
            padding: 0 10px;
            height: 32px;
            line-height: 32px;
            text-align: center;
            color: #666666;
            font-size: 18px;
            background: #EFEFEF;
            margin-right: 20px;
            cursor: pointer;
          }

          span.sizeActive {
            background: $mainColor;
            color: #FFFFFF;
          }
        }
      }

      .proNumberList {
        .el-input-number {
          width: 140px;
          margin-right: 25px;
        }

        b {
          font-size: 16px;
          font-weight: 500;
          color: $mainColor;
          padding: 0 5px;
        }
      }

      .btnBox {
        display: flex;
        align-items: center;
        margin-top: 30px;

        .buyBox {
          display: flex;

          span {
            width: 135px;
            height: 40px;
            line-height: 40px;
            text-align: center;
            font-size: 16px;
            color: $mainColor;
            border: 1px solid $mainColor;
            margin-right: 10px;

            &:hover {
              cursor: pointer;
            }
          }

          span:nth-child(2) {
            background: $mainColor;
            color: #FFFFFF;
          }
        }

        .favorites {
          display: flex;

          .StartGroup {
            width: 135px;
            height: 40px;
            background: #FF7800;
            display: block;
            color: #FFFFFF;
            text-align: center;
            line-height: 40px;
            cursor: pointer;
          }

          .oddBuy {
            width: 135px;
            height: 40px;
            display: block;
            box-sizing: border-box;
            color: $mainColor;
            border: 1px solid $mainColor;
            margin-right: 10px;
            text-align: center;
            line-height: 40px;
            cursor: pointer;
          }
        }

        .noStock {
          display: flex;

          span {
            width: 135px;
            height: 40px;
            background: #999999;
            display: block;
            color: #FFFFFF;
            text-align: center;
            line-height: 40px;
          }
        }

        .favoritesBtn {
          width: 40px;
          height: 38px;
          background: #FFFFFF;
          border: 1px solid #CCCCCC;
          text-align: center;
          margin-left: 10px;
          cursor: pointer;

          i {
            color: #666666;
            display: block;
            margin-top: 2px;
          }

          span {
            display: block;
            font-size: 12px;
            color: #999999;
          }
        }
      }
    }
  }

  :deep(.el-tabs--border-card) {
    box-shadow: none;
    border: none;
  }

  .productDetail {
    .detailTabs {
      margin-bottom: 30px;
      height: 46px;
      line-height: 46px;
      border: 1px solid #E5E5E5;
      background: #F6F6F6;
      display: flex;

      span {
        padding: 0 30px;
        border-right: 1px solid #E5E5E5;
        cursor: pointer;
        color: #333333;
        font-size: 16px;
      }

      .compActive {
        background: #FFFFFF;
      }
    }

    .detailBox {
      margin-bottom: 100px;

      .detailInfoBox {
        width: 890px;
        float: left;
        min-height: 1200px;
        border-right: 1px solid #CACACA;
      }

      .detailCont:deep(img) {
        // 修改v-html渲染的样式
        max-width: 100%;
        height: auto;
      }

      .detailCont:deep(ul) {
        // 修改v-html渲染的样式
        list-style-type: none;
      }

      .likeProductBox {
        width: 280px;
        float: left;
        padding-left: 44px;
      }
    }
  }
}

.pinListBox::-webkit-scrollbar {
  width: 4px;
  height: 16px;
  background-color: #F5F5F5;
}

/*定义滚动条轨道 内阴影+圆角*/
.pinListBox::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.2);
  border-radius: 0px;
  background-color: #FFFFFF;
}

/*定义滑块 内阴影+圆角*/
.pinListBox::-webkit-scrollbar-thumb {
  border-radius: 0px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, .1);
  background-color: #e3e3e3;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.swiper-box {
  position: relative;
  width: 100%;
  height: 100%;
}

.gallery-thumbs {
  height: 100%;
  box-sizing: border-box;
  padding: 10px 0;
}

.gallery-thumbs .swiper-slide {
  width: 25%;
  height: 100%;
  opacity: 0.4;
}

.gallery-thumbs .swiper-slide-thumb-active {
  opacity: 1;
}

:deep(.swiper-button-next),
:deep(.swiper-button-prev) {
  color: #333;
}

:deep(.swiper-pagination-bullet-active) {
  background: #333;
}
</style>
