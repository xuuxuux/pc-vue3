import { defineStore } from 'pinia'

/**
 * 用户Store
 */
export const useUserStore = defineStore('eshop-user', {
  // 状态
  state: () => ({
    searchObj: {}, // 查询对象
    newAddress: {}, // 新增修改收货地址
    areaCode: [], // 当前区域编号
    currentPro: {}, // 当前商品
    userInfo: {
      headImage: ''
    }, // 当前用户信息
    shoppingCart: {}, // 购物车列表
    cartNumber: '', // 购物车数量
    evaluateOrders: {}, // 评价订单
    noticeId: {}, // 公告id
    collectData: {} // 店铺数据
  }),

  //  getters 计算属性
  getters: {
    getSearchObj: (state) => state.searchObj,
    getNewAddress: (state) => state.newAddress,
    getAreaCode: (state) => state.areaCode,
    getUserInfo: (state) => state.userInfo,
    getCurrentPro: (state) => state.currentPro,
    getShoppingCart: (state) => state.shoppingCart,
    getCartNumber: (state) => state.cartNumber,
    getNoticeId: (state) => state.noticeId,
    getCollectData: (state) => state.collectData
  },

  // actions 方法
  actions: {
    // 设置查询对象
    setSearchObj(searchObj) {
      this.searchObj = searchObj
    },

    // 设置新地址
    setNewAddress(obj) {
      this.newAddress = obj
    },

    // 设置区域编码
    setAreaCode(arr) {
      this.areaCode = arr
    },

    // 设置用户信息
    setUserInfo(obj) {
      this.userInfo = obj
    },

    // 设置头像
    setAvatar(img) {
      this.userInfo.headImage = img
    },

    // 设置当前商品
    setCurrentPro(obj) {
      this.currentPro = obj
    },

    // 设置购物车
    setShoppingCart(obj) {
      this.shoppingCart = obj
    },

    // 设置购物车数量
    setCartNumber(num) {
      this.cartNumber = num
    },

    // 设置通知ID
    setNoticeId(num) {
      this.noticeId = num
    },

    // 设置收藏数据
    setCollectData(obj) {
      this.collectData = obj
    },

    // 重置store
    resetStore() {
      this.searchObj = {}
      this.newAddress = {}
      this.areaCode = []
      this.currentPro = {}
      this.userInfo = {
        headImage: ''
      }
      this.shoppingCart = {}
      this.cartNumber = ''
      this.evaluateOrders = {}
      this.noticeId = {}
      this.collectData = {}
    }
  },

  // 持久化配置
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'user-store',
        storage: localStorage
      }
    ]
  }
})
