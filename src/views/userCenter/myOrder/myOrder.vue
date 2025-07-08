<script setup>
import api from '@/api'
import { sendReq } from '@/config/mixin'
import OrderList from '@/components/base/orderList.vue'
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores'
import { ElMessage } from 'element-plus'
import Cookie from 'js-cookie'

defineOptions({
  name: 'myOrderPage'
})

// const checked = ref(false)
const orderList = ref([])
const page = ref(1)
const activeName = ref('first')
const state = ref('')
const cancelOrderShow = ref(false)
const cancelId = ref(null)
const deleteOrderShow = ref(false)
const deleteId = ref(null)
const confirmShow = ref(false)
const confirmId = ref(null)
const total = ref(0)
const flag = ref(true)
const loading = ref(false)

onMounted(() => {
  if (!Cookie.get('token')) {
    userStore.setCartNumber('SET_CARTNUMBER')
    userStore.setShoppingCart('SET_SHOPPINGCART')
  }
  getOrderList()
  getTrolleyList()
})

const userStore = useUserStore()

// 获取订单列表
const getOrderList = () => {
  loading.value = true
  let params = {
    url: api.getOrderList + `?type=${state.value}&page=${page.value}&limit=5`,
    method: 'GET',
    data: {
    }
  }
  sendReq(params, (res) => {
    if (res.status === 200) {
      orderList.value = res.data.content
      total.value = res.data.totalElements
      if (orderList.value.length) {
        flag.value = true
      } else {
        flag.value = false
      }
      loading.value = false
    } else {
      ElMessage({
        message: res.msg,
        type: 'warning'
      })
    }
  })
}
// 支付订单
const payOrder = (id) => {
  let params = {
    url: api.payOrder,
    method: 'POST',
    data: {
      from: 'h5',
      paytype: 'yue',
      uni: id
    }
  }
  sendReq(params, (res) => {
    if (res.status === 200) {
      getOrderList()
      ElMessage.success(res.msg)
    } else {
      ElMessage.error(res.msg)
    }
  })
}
// 取消订单
const cancelOrder = () => {
  let params = {
    url: api.cancelOrder,
    method: 'POST',
    data: {
      id: cancelId.value
    }
  }
  sendReq(params, (res) => {
    if (res.status === 200) {
      ElMessage.success('订单取消成功')
      cancelOrderShow.value = false
      getOrderList()
    } else {
      ElMessage.warning(res.msg)
    }
  })
}
const deleteOrder = () => {
  let params = {
    url: api.deleteOrder,
    method: 'POST',
    data: {
      uni: deleteId.value
    }
  }
  sendReq(params, (res) => {
    if (res.status === 200) {
      ElMessage.success('订单删除成功')
      deleteOrderShow.value = false
      getOrderList()
    } else {
      ElMessage.warning(res.msg)
    }
  })
}
// 确认收货
const confirm = () => {
  let params = {
    url: api.confirm,
    method: 'POST',
    data: {
      uni: confirmId.value
    }
  }
  sendReq(params, (res) => {
    if (res.status === 200) {
      ElMessage.success('确认收货成功')
      confirmShow.value = false
      getOrderList()
    } else {
      ElMessage.warning(res.msg)
    }
  })
}
// 打开确认收货弹窗
const isConfirm = (id) => {
  confirmId.value = id
  confirmShow.value = true
}
// 切换订单列表
const handleClick = (event) => {
  state.value = event.index
  page.value = 1
  getOrderList()
}
// 打开取消订单弹窗
const isCancel = (id) => {
  cancelOrderShow.value = true
  cancelId.value = id
}
// 关闭取消订单弹窗
const handleClose1 = () => {
  cancelOrderShow.value = false
  cancelId.value = null
}
// 打开删除订单弹窗
const isDelete = (id) => {
  deleteOrderShow.value = true
  deleteId.value = id
}
// 关闭删除订单弹窗
const handleClose3 = () => {
  deleteOrderShow.value = false
  deleteId.value = null
}
// 关闭确认收货弹窗
const handleClose2 = () => {
  confirmShow.value = false
  confirmId.value = null
}
// 分页器跳转
const handleCurrentChange = (val) => {
  page.value = val
  getOrderList()
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
</script>
<template>
  <div class="myOrder">
    <div class="top">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="待付款" name="first">
          <div class="sub-main" v-loading="loading">
            <OrderList :flag="flag" :orderList="orderList" :total="total" :page="page" @isCancel="isCancel"
              @isConfirm="isConfirm" @handleCurrentChange="handleCurrentChange" @payOrder="payOrder"></OrderList>
          </div>
        </el-tab-pane>
        <el-tab-pane label="待发货" name="second">
          <div class="sub-main" v-loading="loading">
            <OrderList :flag="flag" :orderList="orderList" :total="total" :page="page" @isCancel="isCancel"
              @isConfirm="isConfirm" @handleCurrentChange="handleCurrentChange"></OrderList>
          </div>
        </el-tab-pane>
        <el-tab-pane label="待收货" name="third">
          <div class="sub-main" v-loading="loading">
            <OrderList :flag="flag" :orderList="orderList" :total="total" :page="page" @isCancel="isCancel"
              @isConfirm="isConfirm" @handleCurrentChange="handleCurrentChange"></OrderList>
          </div>
        </el-tab-pane>
        <el-tab-pane label="待评价" name="fourth">
          <div class="sub-main" v-loading="loading">
            <OrderList :flag="flag" :orderList="orderList" :total="total" :page="page" @isCancel="isCancel"
              @isConfirm="isConfirm" @handleCurrentChange="handleCurrentChange"></OrderList>
          </div>
        </el-tab-pane>
        <el-tab-pane label="已完成" name="fiveth">
          <div class="sub-main" v-loading="loading">
            <OrderList :flag="flag" :orderList="orderList" :total="total" :page="page" @isCancel="isCancel"
              @isConfirm="isConfirm" @handleCurrentChange="handleCurrentChange" @isDelete="isDelete"></OrderList>
          </div>
        </el-tab-pane>
      </el-tabs>
      <el-dialog class="cancelOrder" v-model:visible="cancelOrderShow" close-on-click-modal :before-close="handleClose1"
        width="50%" title="是否取消该订单" center>
        <div>
          <p>您确定要取消该订单吗？取消订单后，不能恢复。</p>
        </div>
        <template v-slot:footer>
          <span class="dialog-footer">
            <el-button class="leftBtn" @click="cancelOrder" v-throttle>确定</el-button>
            <el-button class="rightBtn" @click="handleClose1">取消</el-button>
          </span>
        </template>
      </el-dialog>
      <el-dialog class="cancelOrder" v-model:visible="deleteOrderShow" close-on-click-modal :before-close="handleClose3"
        width="50%" title="是否删除该订单" center>
        <div>
          <p>您确定要删除该订单吗？删除订单后，不能恢复。</p>
        </div>
        <template v-slot:footer>
          <span class="dialog-footer">
            <el-button class="leftBtn" @click="deleteOrder" v-throttle>确定</el-button>
            <el-button class="rightBtn" @click="handleClose3">取消</el-button>
          </span>
        </template>
      </el-dialog>
      <el-dialog class="confirm" v-model:visible="confirmShow" close-on-click-modal :before-close="handleClose2"
        width="50%" title="是否确认收货" center>
        <div>
          <p>为了保证您的售后权益，请收到商品检查无误后再确认收货</p>
        </div>
        <template v-slot:footer>
          <span class="dialog-footer">
            <el-button class="leftBtn" @click="confirm" v-throttle>确定</el-button>
            <el-button class="rightBtn" @click="handleClose2">取消</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.myOrder {
  width: 100%;

  .top {
    width: 100%;
    font-size: 14px;
    box-sizing: border-box;
    position: relative;

    :deep(.el-tabs) {
      .el-tabs__header {
        border: 1px solid #E5E5E5;
        margin-bottom: 30px;
        height: 56px;
      }

      .el-tabs__nav {
        margin-left: 20px;
        height: 56px;
      }

      .el-tabs__item {
        height: 56px;
        line-height: 56px;
      }

      .el-tabs__nav-wrap::after {
        height: 0;
      }
    }

    :deep(.search) {
      font-size: 12px;
      margin-right: 20px;
      display: flex;
      position: absolute;
      height: 56px;
      display: flex;
      align-items: center;
      top: 0;
      right: 0;

      .el-input {
        flex: 3;
        border-radius: 0;

        .el-input__inner {
          border-radius: 0;
        }

        .el-input-group__append {
          border-radius: 0;
          border-left: 0;

          .el-button {
            border-left: 0;
          }
        }
      }

      .el-select {
        flex: 1;
        border-radius: 0;
        height: 40px;
      }
    }
  }

  :deep(.cancelOrder),
  .confirm {
    .el-dialog__body {
      display: flex;
      justify-content: center;

      div {
        text-align: center;

        p {
          font-size: 16px;
        }
      }
    }

    .el-dialog__footer {
      .leftBtn {
        background-color: #FF7800;
        border: 1px solid #FF7800;
        color: #FFFFFF;
        border-radius: 0;
      }

      .rightBtn {
        color: #FF7800;
        border: 1px solid #FF7800;
        background-color: #FFFFFF;
        box-sizing: border-box;
        border-radius: 0;
      }
    }
  }

  :deep(.refund) {
    .el-dialog__body {
      display: flex;
      justify-content: center;
      background-color: #F8F8F8;
      padding: 20px 75px;
      box-sizing: border-box;

      .box {
        display: flex;
        flex-wrap: wrap;
        overflow-x: auto;
        height: 350px;
        width: 100%;
        text-align: center;
      }

      .el-checkbox {
        display: flex;
        align-items: center;
      }

      .el-checkbox__input {
        line-height: 18px;
      }

      .el-checkbox__label {
        font-size: 18px;
      }

      .back {
        width: 208px;
        padding: 10px 20px;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        text-align: center;
        flex-direction: column;
        background-color: #FFFFFF;
        margin: 0 20px 20px 0;
        border: 1px solid transparent;
        position: relative;

        img {
          width: 171px;
          height: 171px;
        }

        .choice {
          width: 30px;
          height: 30px;
          position: absolute;
          bottom: 0;
          right: 0;
          display: none;
        }
      }

      .back:nth-of-type(3n) {
        margin-right: 0;
      }

      .backActive {
        border: 1px solid #FF7800;

        .choice {
          display: block;
        }
      }
    }

    .el-dialog__footer {
      .leftBtn {
        background-color: #FF7800;
        border: 1px solid #FF7800;
        color: #FFFFFF;
        border-radius: 0;
      }

      .rightBtn {
        color: #FF7800;
        border: 1px solid #FF7800;
        background-color: #FFFFFF;
        box-sizing: border-box;
        border-radius: 0;
      }
    }
  }
}

.sub-main {
  min-height: 400px;
}
</style>
