<script setup>
import { sendReq } from '@/config/mixin'
import Cookies from 'js-cookie'
import api from '@/api'
import { computed, ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/modules/useUserStore'
// import { Encrypt } from '@/util/secret'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
const router = useRouter()
const userStore = useUserStore()
defineOptions({
  name: 'siteNav'
})
defineProps({
  componentContent: {
    type: Object
  }
})
if (!Cookies.get('token')) {
  // 设置用户信息
  userStore.setUserInfo('SET_USERINFO')
  // 设置购物车数量
  userStore.setCartNumber('SET_CARTNUMBER')
  // 设置购物车列表
  userStore.setShoppingCart('SET_SHOPPINGCART')
  // 设置新地址
  userStore.setNewAddress('SET_NEWADDRESS')
  // 设置地区代码
  userStore.setAreaCode('SET_AREACODE')
  // 设置通知ID
  userStore.setNoticeId('SET_NOTICEID')
}
// 用户信息
const userInfo = computed(() => userStore.getUserInfo)
// console.log(userInfo)
// 购物车列表
const shoppingCart = computed(() => userStore.getShoppingCart)
// 购物车数量
const cartNumber = computed(() => userStore.getCartNumber)
// 购物车列表
const isShowOut = ref(false)
// const menuOpen = ref(false)
// 是否登录
const isLogin = ref(true)
// 退出登录弹窗
const outLoginDialog = ref(false)
const isShowNum = ref(false)
// const deleteOpt = ref({
// visiable: false
// })
// const proList = ref([])
// const noticeList = ref([])
onMounted(() => {
  if (Cookies.get('token')) {
    isShowNum.value = true
    getTrolleyList()
  }
})
// 购物车列表
const getTrolleyList = async () => {
  const params = {
    url: api.getTrolleyList,
    method: 'GET'
  }
  sendReq(params, res => {
    const d = res.data?.valid || []
    userStore.setShoppingCart(d)
    userStore.setCartNumber(d.length)
  })
}
// 删除单个商品
const deleteCartItem = async (item) => {
  let ids = []
  ids.push(item.id)
  let params
  params = {
    url: api.deleteGoods,
    method: 'POST',
    data: {
      ids: ids
    }
  }
  sendReq(params, res => {
    if (res.status === 200) {
      getTrolleyList()
      ElMessage.success('删除成功')
    } else {
      ElMessage.warning(res.msg)
    }
  })
}
// 退出登录
const outLogin = () => {
  outLoginDialog.value = false
  Cookies.remove('token')
  userStore.setUserInfo({})
  userStore.setCartNumber('')
  userStore.setShoppingCart({})
  userStore.setNewAddress({})
  userStore.setAreaCode([])
  router.replace({ path: '/login', query: { type: 2 } })
}
// 跳转用户信息
const goToUserInfo = () => {
  router.replace('/userInfo')
}
// 跳转用户订单
const goToUserOrder = () => {
  router.replace('/myOrder')
}
// 跳转登录
const loginBtn = (type) => {
  router.replace({ path: '/login', query: { type: type } })
}
// 跳转用户地址
const goToUserAddress = () => {
  router.replace('/userAddress')
}
// 跳转用户充值
const gotoUserRecharge = () => {
  router.replace('/userRecharge')
}
// 跳转购物车
const goToShopCart = () => {
  router.replace('/shopping-trolley')
}
// 鼠标悬停
// const hover = () => {
//   isShowOut.value = true
// }
</script>

<template>
  <div class="header-warp">
    <div class="pc-header">
      <div class="site-nav">
        <div class="warp clearfix">
          <div class="left" v-if="userInfo.nickname">
            <div class="welcome" @mouseover="isShowOut = true" @mouseleave="isShowOut = false">
              欢迎你 {{ userInfo.nickname }}
              <span class="iconfont hoverShowOut">&#xe695;</span>
              <div class="outLogin" v-show="isShowOut" @click="outLogin">退出登录</div>
            </div>
          </div>
          <div class="left" v-else>
            你好 请先 <span @click="loginBtn(2)">登录</span> 或 <span @click="loginBtn(1)">注册</span>
          </div>
          <div class="right">
            <div class="item">
              <a class="hover-item" @click="goToUserOrder">我的订单</a>
            </div>
            <div class="item item-select">
              <span class="hover-item" @click="goToShopCart"><i class="iconfont icon-shoppingCart"></i>购物车<span
                  v-if="isShowNum">(<b v-text="cartNumber === 0 ? '0' : cartNumber"></b>)</span><i
                  class="ico-arrow el-icon-arrow-down"></i></span>
              <div v-if="!isLogin" class="cart-box cart-no-login">
                <a class="btn" @click="loginBtn">登录</a>
                <p class="p">登录后查看商品</p>
              </div>
              <div v-else-if="shoppingCart.length === 0" class="cart-box cart-no-data">
                <p class="p">购物车还没有商品，赶紧选购吧！</p>
              </div>
              <div v-else class="cart-box cart-list">
                <div>
                  <dl v-for="(item, index) in shoppingCart" :key="index" v-show="index < 5">
                    <dt>
                      <div class="cartImgBox" style="width: 42px;height: 42px;background: #F5F5F5;"
                        @click="goToShopCart">
                        <img :src="$api.BASEURL + (item?.productInfo?.image || '@/images/banner.png')" alt="">
                      </div>
                    </dt>
                    <dd>
                      <h4 class="h4" @click="goToShopCart">{{ item?.productInfo?.storeName || '商品名称' }}</h4>
                      <p>{{ item?.productInfo?.attrInfo?.sku || '规格信息' }}</p>
                      <span>￥{{ item?.productInfo?.attrInfo?.price || '0.00' }}</span>
                      <a class="btn-del" @click="deleteCartItem(item)">删除</a>
                    </dd>
                  </dl>
                </div>
                <a class="btn-view-all" @click="goToShopCart" v-if="cartNumber > 5">查看全部</a>
              </div>
            </div>
            <div class="item item-select">
              <span class="hover-item"><i class="iconfont icon-user"></i>我的<i
                  class="ico-arrow el-icon-arrow-down"></i></span>
              <div class="cart-box user-box">
                <ul>
                  <li @click="goToUserInfo">个人信息</li>
                  <li @click="goToUserOrder">我的订单</li>
                  <li @click="goToUserAddress">收货地址</li>
                  <li @click="gotoUserRecharge">钱包充值</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog title="提示" v-model:visible="outLoginDialog" width="30%">
      <span>确定退出登录吗？</span>
      <template v-slot:footer>
        <span class="dialog-footer">
          <el-button @click="outLoginDialog = false">取 消</el-button>
          <el-button type="primary" @click="outLogin">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>



<style lang="scss" scoped>
.site-nav {
  height: 42px;
  background-color: #F1F2F7;
  line-height: 42px;
  font-size: 14px;

  .welcome {
    position: relative;

    .outLogin {
      position: absolute;
      width: 100%;
      z-index: 999;
      background: #FFFFFF;
      text-align: center;
      cursor: pointer;
      box-shadow: 0 0 20px #cccccc;
    }
  }

  .left {
    float: left;

    span {
      color: $mainColor;
      cursor: pointer;
    }
  }

  .notice {
    float: left;
    width: 280px;
    margin-left: 30px;

    .noticeBox {
      display: flex;
      width: 100%;

      .noticeTitle {
        display: flex;
        align-items: center;

        img {
          width: 22px;
          height: 22px;
          margin-right: 3px;
        }
      }

      .el-carousel {
        flex: 1;
        margin-left: 10px;
      }
    }
  }

  .right {
    float: right;

    .item {
      padding: 0 15px;
      display: inline-block;

      span {
        cursor: pointer;

        b {
          color: $mainColor;
          padding: 0 2px;
        }
      }

      .iconfont {
        margin-right: 5px;
      }

      .icon-user {
        font-size: 14px;
      }

      &.item-select {
        padding-right: 33px;
        position: relative;

        .ico-arrow {
          position: absolute;
          right: 15px;
          top: 0;
          margin-right: 0;
          line-height: 43px;
        }
      }

      &:hover {
        background-color: #fff;

        .cart-no-data,
        .cart-no-login {
          display: flex;
        }

        .cart-list,
        .user-box {
          display: block;
        }

        .hover-item {
          color: $mainColor;
        }
      }
    }
  }

  .cart-box {
    position: absolute;
    top: 100%;
    background-color: #fff;
    z-index: 999;
    border-radius: 0px 0px 4px 4px;
    box-shadow: 0px 0px 24px 0px rgba(0, 0, 0, 0.06);

    .cartImgBox {
      img {
        width: 100%;
      }
    }

    &.cart-no-login {
      width: 100%;
      left: 0;
      height: 160px;
      display: none;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      .btn {
        display: inline-block;
        padding: 0 15px;
        height: 26px;
        line-height: 26px;
        text-align: center;
        color: #fff;
        background-color: $mainColor;
        border-radius: 4px;
        margin-bottom: 40px;
      }

      .p {
        color: #666666;
        line-height: 1em;
      }
    }

    &.cart-no-data {
      width: 264px;
      height: 110px;
      left: 50%;
      margin-left: -132px;
      display: none;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      color: #666;
    }

    &.cart-list {
      width: 348px;
      left: 50%;
      margin-left: -174px;
      display: none;
      padding: 10px;

      dl {
        margin-bottom: 10px;

        dt {
          float: left;
          cursor: pointer;
        }

        dd {
          margin-left: 54px;
          position: relative;
          padding-right: 60px;
          min-height: 42px;
          line-height: 21px;

          h4 {
            color: #333;
            cursor: pointer;
            font-size: 14px;
            @include ellipsis;
          }

          p {
            color: #999;
            font-size: 14px;
            @include ellipsis;
          }

          span {
            color: $mainColor;
            position: absolute;
            top: 0;
            right: 0;
            font-size: 14px;
          }

          .btn-del {
            color: #333;
            position: absolute;
            top: 20px;
            right: 0;
            font-size: 14px;
          }
        }
      }

      .btn-view-all {
        display: inline-block;
        // float: right;
        padding: 0 15px;
        height: 26px;
        line-height: 26px;
        text-align: center;
        color: #fff;
        background-color: $mainColor;
        border-radius: 4px;
        margin-top: 10px;
        cursor: pointer;
      }
    }

    &.user-box {
      width: 100%;
      left: 0;
      padding: 18px 0;
      display: none;

      li {
        font-size: 14px;
        display: block;
        cursor: pointer;
        color: #666;
        text-align: center;

        &:hover {
          background-color: #FFEEE3;
        }
      }
    }
  }
}
</style>
