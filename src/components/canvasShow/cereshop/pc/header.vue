<script setup>
import { jumpLink, sendReq } from '../../config/mixin'
import api from '@/api'
import { onMounted, ref, onUnmounted, computed } from 'vue'
import router from '@/router'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores'
import { ElMessage } from 'element-plus'
const route = useRoute()
const userStore = useUserStore()
defineOptions({
  name: 'cereHeader',
})
const props = defineProps({
  componentContent: {
    type: Object
  }
})
const keyword = ref('')
computed(() => userStore.getCollectData)
onUnmounted(() => {
  window.removeEventListener('popstate', goBack, false)
})
onMounted(() => {
  if (window.history && window.history.pushState) {
    // 向历史记录中插入了当前页
    history.pushState(null, null, document.URL)
    window.addEventListener('popstate', goBack, false)
  }
})
userStore.setSearchObj('SET_COLLECTDATA')
userStore.setCollectData('SET_SEARCHOBJ')

const toStore = () => {
  console.log(userStore.getCollectData.shopId, 'shopId')
  router.push({
    path: '/store',
    query: {
      shopId: userStore.getCollectData.shopId
    }
  })
}
const collect = () => {
  if (userStore.getCollectData.ifCollect === 0) {
    let params = {
      url: api.collect,
      method: 'POST',
      data: {
        shopId: userStore.getCollectData.shopId
      }
    }
    sendReq(params, res => {
      if (res.code === '200') {
        let data = {
          shopName: userStore.getCollectData.shopName,
          shopAdress: userStore.getCollectData.shopAdress,
          collectId: userStore.getCollectData.collectId,
          ifCollect: 1,
          classifyNumber: res.data.classifyNumber,
          number: res.data.number,
          shopLogo: res.data.shopLogo
        }
        userStore.setCollectData(data)
        ElMessage.success('收藏成功')
      }
    })
  } else {
    let params = {
      url: api.unfavorite,
      method: 'PUT',
      data: {
        ids: [userStore.getCollectData.collectId]
      }
    }
    sendReq(params, res => {
      if (res.code === '200') {
        let data = {
          shopName: userStore.getCollectData.shopName,
          shopAdress: userStore.getCollectData.shopAdress,
          collectId: userStore.getCollectData.collectId,
          ifCollect: 0,
          classifyNumber: res.data.classifyNumber,
          number: res.data.number,
          shopLogo: res.data.shopLogo
        }
        userStore.setCollectData(data)
        ElMessage.success('取消成功')
      }
    })
  }
}
// const searchCommand = (command) => {
//   this.searchVal = command
// }
const searchPro = () => {
  userStore.setSearchObj({
    keyword: keyword.value
  })
  if (route.name !== 'search') {
    router.push({
      path: '/search'
    })
  }
}
const goBack = () => {
  keyword.value = ''
}

</script>

<template>
  <div class="header-warp">
    <div class="pc-header">
      <div class="header">
        <div class="warp">
          <div class="header-flex-box">
            <div class="topLeftBox">
              <div class="logo">
                <router-link to="/">
                  <img src='@/assets/images/cereshop/home/eshop.png'>
                  <span>{{ route.meta.logoText }}</span>
                </router-link>
              </div>
            </div>
            <div class="menu" v-if="props.componentContent && props.componentContent.tabShow">
              <ul>
                <li v-for="(item, index) in props.componentContent.labelList" :key="index">
                  <a @click="jumpLink(item.linkObj)">{{ item.name }}</a>
                </li>
              </ul>
            </div>
            <div class="search" v-if="route.meta.searchVisible">
              <div class="searchRight">
                <i class="icon el-icon-search"></i>
                <input type="text" v-model="keyword" @keyup.enter="searchPro" placeholder="请输入搜索商品">
              </div>
              <span class="btn cur-poi" @click="searchPro">搜索</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>



<style lang="scss" scoped>
.site-nav {
  height: 42px;
  background-color: #F1F2F7;
  line-height: 42px;

  .left {
    float: left;

    span {
      color: $mainColor;
      cursor: pointer;
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
    z-index: 9;
    border-radius: 0px 0px 4px 4px;
    box-shadow: 0px 0px 24px 0px rgba(0, 0, 0, 0.06);

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
        cursor: pointer;
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
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          p {
            color: #999;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          span {
            color: $mainColor;
            position: absolute;
            top: 0;
            right: 0;
          }

          .btn-del {
            color: #333;
            position: absolute;
            top: 20px;
            right: 0;
          }
        }
      }

      .btn-view-all {
        display: inline-block;
        float: right;
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

.header {
  background-color: #fff;
  height: 98px;

  .header-flex-box {
    display: flex;
    width: 100%;
    justify-content: space-between;

    .topLeftBox {
      display: flex;
      align-items: center;

      .shopInfo {
        display: flex;
        padding-left: 20px;
        border-left: 1px solid #F0F0F0;

        .avatarClass {
          width: 50px;
          height: 50px;
          margin-right: 13px;

          img {
            width: 100%;
            height: 100%;
          }
        }

        .shopData {
          .shopName {
            font-size: 18px;
            color: #333333;
            margin-bottom: 13px;
          }

          .shopType {
            font-size: 14px;
            color: #999999;
            margin-right: 14px;

            span {
              margin-right: 13px;
            }
          }
        }

        .favoritesBox {
          margin-left: 20px;
          width: 40px;
          height: 40px;
          border: 1px solid #D7D7D7;
          border-radius: 3px;
          text-align: center;

          .star {
            color: #fec200;
            font-size: 16px;
            margin: 2px auto;
          }

          .text {
            color: #999999;
            font-size: 12px;
          }
        }
      }

      .logo {
        margin: 32px 15px 32px -60px;
        display: flex;

        span {
          padding-left: 10px;
        }
      }
    }

    .menu {
      padding: 35px 0;

      li {
        display: inline-block;
        line-height: 28px;
        margin: 0 10px;

        a {
          display: block;
          cursor: pointer;

          &:hover {
            color: $mainColor;
          }
        }
      }
    }

    .search {
      width: 472px;
      max-width: 100%;
      border: 1px solid $mainColor;
      border-radius: 4px;
      height: 46px;
      overflow: hidden;
      margin: 25px 0;
      position: relative;
      display: flex;

      .searchSelect {
        margin: 12px 10px 12px 0;
        height: 22px;
        line-height: 22px;
        padding: 0 12px;
        border-right: 1px solid #E5E5E5;

        :deep(.el-dropdown-link) {
          font-size: 16px;
          color: #666;
        }
      }

      .searchRight {
        flex: 1;
        position: relative;
        height: 46px;

        .icon {
          position: absolute;
          left: 11px;
          top: 50%;
          margin-top: -8px;
          color: #666;
          font-size: 16px;
        }

        input {
          padding: 0 60px 0 35px;
          width: 100%;
          height: 46px;
          font-size: 14px;
          box-sizing: border-box;
        }
      }

      .btn {
        width: 80px;
        height: 46px;
        background-color: $mainColor;
        color: #fff;
        line-height: 46px;
        text-align: center;
        cursor: pointer;
      }
    }
  }
}

@media screen and (max-width: 1200px) {
  .header {
    display: block;
    // position: relative;
    height: auto;

    .header-flex-box {
      .logo {
        position: relative;
        left: 1%;
      }

      .menu {
        margin-top: 90px;
        padding: 0 0 20px 0;
        width: 100%;
        display: flex;
        justify-content: center;
      }

      .search {
        position: relative;
        right: 1%;
      }

      .shopInfo {
        margin-right: 20px;

        .favoritesBox {
          width: auto;
          height: auto;

        }
      }
    }
  }
}

@media screen and (max-width: 768px) {
  .pc-header {
    display: none;
  }

  .phone-header {
    display: flex;
    justify-content: space-between;
  }
}

.device-xiaochengxu,
.device-h5,
.device-phone {
  .pc-header {
    display: none;
  }

  .phone-header {
    display: flex;
    justify-content: space-between;
  }
}
</style>
