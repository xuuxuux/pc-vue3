<script setup>
import addAddress from '@/components/orderInfo/addAddress.vue'
import shopOrder from '@/components/orderInfo/shopOrder.vue'
import api from '@/api'
import { sendReq } from '@/config/mixin'
import { useUserStore } from '@/stores'
import { ref, onMounted, computed, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import Cookies from 'js-cookie'
defineOptions({
  name: 'placeOrder',
})

const cartId = ref('')
const addressData = ref([])
const orderInfo = ref([])
const page = ref(1)
const newAddress = ref({})
const showMoreAddress = ref(false)
const newAddressDialog = ref(false)
const currentAddressId = ref('') // 选中地址id
const remarksInfo = ref('') // 备注
const orderComputedInfo = ref({}) // 订单金额
const chatTimer = ref('')
const state = ref(0)
const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const shopOrderRef = ref(null)

onMounted(() => {
  if (route.query.cartId) {
    cartId.value = route.query.cartId
  }
  if (!Cookies.get('token')) {
    userStore.setNewAddress('SET_NEWADDRESS') // 新增修改收货地址
    userStore.setAreaCode('SET_AREACODE') // 新增修改收货地址
    userStore.setCartNumber('SET_CARTNUMBER') // 购物车数量
    userStore.setShoppingCart('SET_SHOPPINGCART') // 购物车
  }
  getAddressList()
  getOrderInfo()
})
computed(() => userStore.newAddress)

onUnmounted(() => {
  clearInterval(chatTimer.value)
})


// 获取收货地址
const getAddressList = () => {
  let params = {
    url: api.addressList,
    method: 'GET',
    payload: {
      page: 1,
      limit: 100
    }
  }
  sendReq(params, (res) => {
    if (res.status === 200) {
      addressData.value = res.data
    } else {
      ElMessage.warning(res.msg)
    }
  })
}
// 获取订单信息
const getOrderInfo = () => {
  let params = {
    url: api.orderConfirm,
    method: 'POST',
    data: {
      cartId: cartId.value
    }
  }
  sendReq(params, (res) => {
    if (res.status === 200) {
      orderInfo.value = res?.data

      if (orderInfo.value.addressInfo) {
        currentAddressId.value = orderInfo.value.addressInfo.id
      }
      orderComputed()
    } else {
      ElMessage.warning(res.msg)
    }
  })
}
// 计算订单金额
const orderComputed = () => {
  let params = {
    url: api.orderComputed + orderInfo.value.orderKey,
    method: 'POST',
    data: {
      addressId: currentAddressId.value,
      payType: 'yue',
      shipping_type: 1
    }
  }
  sendReq(params, (res) => {
    if (res.status === 200) {
      orderComputedInfo.value = res.data.result
    } else {
      ElMessage.warning(res.msg)
    }
  })
}
// 新增地址
const hideAddDialog = () => {
  newAddressDialog.value = false
  console.log(newAddress.value);

  let address = newAddress.value.receiveAdress.split('-')
  let params = {
    url: api.editAddress,
    method: 'POST',
    data: {
      real_name: newAddress.value.receiveName,
      phone: newAddress.value.receivePhone,
      detail: newAddress.value.address,
      address: {
        province: address[0],
        city: address[1],
        district: address[2]
      },
      is_default: newAddress.value.defult.toString()
    }
  }
  sendReq(params, (res) => {
    if (res.status === 200) {
      ElMessage.success('地址添加成功')
      page.value = 1
      addressData.value = []
      userStore.setAreaCode([])
      getAddressList()
    } else {
      ElMessage.error(res.msg)
    }
  })
}
// 取消新增地址
const closeAdd = () => {
  newAddressDialog.value = false
}
// 选择地址
const selectAddress = (item) => {
  currentAddressId.value = item.id
}
// 新增地址
const newAddressFn = () => {
  let obj = {
    receiveName: '',
    receivePhone: '',
    receiveAdress: '',
    address: '',
    label: '',
    defult: false
  }
  userStore.setAreaCode([])
  userStore.setNewAddress(obj)
  newAddressDialog.value = true
}
// 展开更多地址
const openMoreAdd = () => {
  showMoreAddress.value = !showMoreAddress.value
}
// 提交订单
const orderSubmit = () => {
  let subData = {
    addressId: currentAddressId.value,
    couponId: 0,
    from: 'h5',
    mark: remarksInfo.value,
    payType: 'yue',
    shippingType: 1,
    pinkId: 0
  }
  let params = {
    url: api.orderSubmit + orderInfo.value.orderKey,
    method: 'POST',
    data: subData
  }
  clearInterval(chatTimer.value)
  sendReq(params, (res) => {
    if (res.status === 200) {
      ElMessage.success(res.msg)
      getTrolleyList()
      chatTimer.value = setInterval(() => {
        router.push({ path: '/myOrder' })
      }, 2000)
    } else if (res.msg === '余额不足') {
      ElMessage.warning(res.msg)
      chatTimer.value = setInterval(() => {
        router.push({ path: '/myOrder' })
      }, 2000)
    } else {
      ElMessage.warning(res.msg)
    }
  })
}
// 获取购物车列表
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


watch(currentAddressId, () => {
  orderComputed()
})
</script>


<template>
  <div class="placeOrder warp">
    <div class="poAddressBox">
      <div class="poTitle">请选择收货地址</div>
      <div class="noAddress" v-if="addressData.length === 0" @click="newAddressFn">
        <div class="noAddressBox">
          <span class="iconfont">&#xe6d4;</span>
          <span>新增收货地址</span>
        </div>
      </div>
      <div class="poAddressList" v-if="addressData.length !== 0">
        <div class="poAddListTit">
          <span>收件人信息</span>
          <span @click="newAddressFn">新增地址</span>
        </div>
        <div class="poAddListBox">
          <div class="showMoreBox" :class="{ showMoreAdd: showMoreAddress }">
            <div class="addressItem" :class="{ addressActive: currentAddressId === item.id }"
              @click="selectAddress(item)" v-for="(item, index) of addressData" :key="index">
              <span class="userName">{{ item.realName }}<i v-if="currentAddressId === item.id"
                  class="iconfont">&#xe612;</i></span>
              <span class="addressInfo">{{ item.province + item.city + item.district }} {{ item.detail }}</span>
              <span class="phone">{{ item.phone }}</span>
            </div>
          </div>
          <div class="openMore iconfont" @click="openMoreAdd"
            v-html="showMoreAddress ? '收起地址&#xe660;' : '展开更多&#xe695;'"></div>
        </div>
      </div>
      <div class="poTitle">请确认订单信息</div>
      <div class="orderList">
        <div class="orderInfoTit">
          <span>商品</span>
          <span>商品属性</span>
          <span>单价</span>
          <span>数量</span>
          <span>小计</span>
        </div>
      </div>
      <shop-order ref="shopOrderRef" :type="state" :shopsData="orderInfo.cartInfo"></shop-order>
    </div>
    <div class="remarksBox">
      <div class="remarksInfo">
        <el-input type="textarea" :rows="2" resize="none" placeholder="如有其他要求，请备注。" v-model="remarksInfo">
        </el-input>
      </div>
    </div>
    <div class="couponList">
      <div class="payTit">选择支付方式</div>
      <div class="payList">
        <span class="payActive">
          <i class="iconfont">&#xe616;</i>
          <b class="iconfont">&#xe612;</b>
          钱包支付
        </span>
      </div>
    </div>
    <div class="placeOrderBtn">
      <span>运费：{{ orderComputedInfo.payPostage > 0 ? '+¥' + orderComputedInfo.payPostage : '免邮费' }}</span>
      <span>需付款：<b>￥{{ orderComputedInfo.payPrice ? orderComputedInfo.payPrice : 0 }}</b></span>
      <el-button @click="orderSubmit" type="primary" v-throttle>提交订单</el-button>
    </div>
    <el-dialog title="新建收货地址" v-model="newAddressDialog" width="630px">
      <add-address @hideAddDialog="hideAddDialog" @cancelAdd="closeAdd"></add-address>
    </el-dialog>
  </div>
</template>


<style lang="scss" scoped>
.placeOrder {
  margin: 20px auto;

  .poTitle {
    font-size: 16px;
    font-weight: bold;
    color: #333333;
    margin-bottom: 20px;
  }

  .poAddressList {
    width: 100%;
    border: 1px solid #F5F5F5;
    padding: 20px;
    margin-bottom: 30px;
    box-sizing: border-box;

    .poAddListTit {
      display: flex;
      justify-content: space-between;

      span:nth-child(1) {
        color: #333333;
        font-size: 16px;
      }

      span:nth-child(2) {
        color: #2D51B3;
        font-size: 14px;
        cursor: pointer;
      }
    }

    .poAddListBox {
      width: 100%;
      margin: 20px 50px 0 50px;

      .showMoreBox {
        height: 45px;
        overflow: hidden;
      }

      .showMoreAdd {
        height: auto;
      }

      .addressItem {
        display: flex;
        align-items: center;
        margin-bottom: 14px;

        span {
          color: #666666;
          font-size: 14px;
        }

        span:nth-child(1) {
          width: 147px;
          height: 31px;
          line-height: 31px;
          text-align: center;
          border: 1px solid #CCCCCC;
          border-radius: 2px;
          margin-right: 15px;
          cursor: pointer;
          position: relative;

          i {
            font-size: 16px;
            height: 16px;
            line-height: 16px;
            position: absolute;
            right: -1px;
            bottom: 0;
            color: $mainColor;
          }
        }

        span:nth-child(2) {
          margin-right: 20px;
        }
      }

      .openMore {
        font-size: 12px;
        color: #666666;
        cursor: pointer;
      }

      .currentAddress {
        span:nth-child(1) {
          border-color: $mainColor;
        }
      }

      .addressActive {
        span:nth-child(1) {
          border-color: $mainColor;
        }
      }

      .showMoreAdd {
        height: auto;
      }
    }
  }

  :deep(.el-dialog) {
    .el-dialog__body {
      background: #F8F8F8;
    }

    .el-dialog__header {
      text-align: center;
    }

    .el-dialog__footer {
      text-align: center;

      .dialog-footer {
        text-align: center;

        button {
          height: 45px;
          width: 160px;
        }
      }
    }
  }

  .poAddressBox {
    .noAddress {
      width: 300px;
      height: 166px;
      display: flex;
      align-items: center;
      text-align: center;
      border: 2px solid #DDDDDD;
      border-radius: 4px;
      margin-top: 40px;
      justify-content: center;
      cursor: pointer;
      margin-bottom: 70px;

      span {
        font-size: 16px;
        color: #666666;
        display: block;
      }

      span:nth-child(1) {
        font-size: 26px;
        margin-bottom: 18px;
      }
    }
  }

  .orderList {
    background: #FCFCFC;
    border: 1px solid #E5E5E5;
    margin-bottom: 25px;

    .orderInfoTit {
      width: 100%;
      display: flex;
      height: 44px;
      line-height: 44px;
      color: #333333;
      font-size: 14px;
      font-weight: 400;
    }

    span {
      text-align: center;
    }

    span:nth-child(1) {
      width: 40%;
      text-align: left;
      padding-left: 125px;
      box-sizing: border-box;
    }

    span:nth-child(2) {
      width: 20%;
      text-align: center;
    }

    span:nth-child(3) {
      width: 15%;
    }

    span:nth-child(4) {
      width: 15%;
    }

    span:nth-child(5) {
      width: 10%;
    }

    span:nth-child(6) {
      width: 10%;
    }
  }

  .placeOrderBtn {
    margin-top: 50px;
    width: 100%;
    background: #F7F7F7;
    padding: 30px;
    box-sizing: border-box;
    text-align: right;

    span {
      display: block;
      margin-bottom: 20px;
      font-size: 14px;
      color: #333333;
    }

    span:nth-child(3) {
      font-size: 18px;

      b {
        color: $mainColor;
      }
    }

    .el-button {
      display: inline-flex;
    }
  }

  .payList {
    display: flex;
    margin: 20px 0 0 50px;

    span {
      color: #666666;
      font-size: 16px;
      font-weight: 400;
      display: flex;
      align-items: center;
      cursor: pointer;
      position: relative;

      i {
        font-size: 26px;
        margin-right: 5px;
      }

      b {
        color: $mainColor;
        position: absolute;
        right: -1px;
        bottom: -1px;
        display: none;
      }
    }

    .payActive {
      border: 1px solid $mainColor;

      b {
        display: block;
      }
    }

    span {
      border: 1px solid #E5E5E5;
      padding: 5px 10px;
      margin-right: 15px;
    }

    span:nth-child(1) {
      i:nth-child(1) {
        color: #40ba49;
        cursor: pointer;
      }
    }

    span:nth-child(2) {
      i {
        color: #40ba49;
      }
    }
  }

  .remarksBox {
    display: flex;
    background: #F7F7F7;
    padding: 25px;
    border-radius: 8px;
    margin-bottom: 30px;

    .remarksInfo {
      width: 100%;

      :deep(.el-textarea__inner) {
        width: 100%;
        height: 84px;
        box-shadow: none;
      }
    }

    .selectBox {
      margin-left: 70px;

      label {
        color: #666666;
        font-size: 16px;
        font-weight: normal;
      }
    }

    .shopTotal {
      color: $mainColor;
      flex: 1;
      text-align: right;
    }
  }
}
</style>
