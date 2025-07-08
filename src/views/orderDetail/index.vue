<script setup>
import StatusOne from '@/components/status/statusOne.vue'
import StatusTwo from '@/components/status/statusTwo.vue'
import StatusThree from '@/components/status/statusThree.vue'
import StatusFour from '@/components/status/statusFour.vue'
import api from '@/api'
import { sendReq } from '@/config/mixin'
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores'
defineOptions({
  name: 'OrderDetailIndex'
})
const route = useRoute()
const router = useRouter()
const orderDetail = ref({})
const orderId = ref('')
const closeOrderDialog = ref(false)
// const text = ref('')
// const endTime = ref('')
// const setTime = ref(null)
// const chatTimer = ref(null)
const userStore = useUserStore()
userStore.setUserInfo('SET_USERINFO')

onMounted(() => {
  orderId.value = route.query.orderId
  // getOrderDetail()
})
//未實現方法
// 获取用户信息
// const getUserInfo = () => {
//   let params = {
//     url: api.getUser,
//     method: 'GET'
//   }
//   sendReq(params, (res) => {
//     if (res.status === 200) {
//       userStore.setUserInfo(res.data)
//     } else {
//       ElMessage.warning(res.msg)
//     }
//   })
// }
// 获取订单详情
// const getOrderDetail = () => {
//   const rLoading = openLoading()
//   let params = {
//     url: api.getOrderDetail + orderId.value,
//     method: 'GET',
//     data: {
//     }
//   }
//   sendReq(params, (res) => {
//     if (res.status === 200) {
//       orderDetail.value = res.data
//       getUserInfo()
//       rLoading.close()
//     } else {
//       ElMessage.warning(res.msg)
//     }
//   })
// }
// 取消订单
const cancelOrder = () => {
  let params = {
    url: api.cancelOrder,
    method: 'POST',
    data: {
      id: orderDetail.value.orderId
    }
  }
  sendReq(params, (res) => {
    if (res.status === 200) {
      closeOrderDialog.value = false
      router.push({ path: '/myOrder' })
    } else {
      ElMessage.warning(res.msg)
    }
  })
}
// 取消订单
const closeOrder = () => {
  closeOrderDialog.value = true
}
const closeOrderBtn = () => {
  closeOrderDialog.value = false
}
// 付款
const getUrl = () => {
  let params = {
    url: api.payOrder,
    method: 'POST',
    data: {
      from: 'h5',
      paytype: 'yue',
      uni: orderDetail.value.orderId
    }
  }
  sendReq(params, (res) => {
    if (res.status === 200) {
      // getOrderDetail()
      ElMessage.success(res.msg)
    } else {
      ElMessage.error(res.msg)
    }
  })
}
</script>

<template>
  <div class="orderDetail">
    <div class="banxin">
      <div class="head">
        <router-link to="/myOrder">
          <div class="mar-right-10">我的订单</div>
        </router-link>
        <div class='arrow'></div>
        <div class="mar-right-10">订单详情</div>
      </div>
      <div class="status">
        <div class="left">
          <p class="fs16 fw-blod mar-top-20 mar-bot-60">订单号：{{ orderDetail.orderId }}</p>
          <div class="box" v-if="orderDetail.statusDto && orderDetail.statusDto.type == 0">
            <p class="fs24 fw-blod mar-bot-10 font-color-71B">等待付款</p>
            <el-button plain size="small" @click="closeOrder" class="cancel mar-bot-10">取消订单</el-button>
            <el-button plain size="small" @click="getUrl" class="pay mar-bot-10">付款</el-button>
          </div>
          <div class="box mar-top-40" v-if="orderDetail.statusDto && orderDetail.statusDto.type == 1">
            <p class="fs24 fw-blod font-color-FF7">待发货</p>
          </div>
          <div class="box mar-top-40" v-if="orderDetail.statusDto && orderDetail.statusDto.type == 2">
            <p class="fs24 fw-blod mar-bot-10 font-color-FF7">待收货</p>
          </div>
          <div class="box mar-top-40" v-if="orderDetail.statusDto && orderDetail.statusDto.type == 3">
            <p class="fs24 fw-blod mar-bot-10 font-color-71B">待评价</p>
          </div>
          <div class="box mar-top-40" v-if="orderDetail.statusDto && orderDetail.statusDto.type == 4">
            <p class="fs24 fw-blod mar-bot-10 font-color-71B">已完成</p>
          </div>
        </div>
        <div class="right">
          <StatusOne :createTime="orderDetail.createTime"
            v-if="orderDetail.statusDto && orderDetail.statusDto.type == 0">
          </StatusOne>
          <StatusTwo :createTime="orderDetail.createTime"
            v-if="orderDetail.statusDto && orderDetail.statusDto.type == 1">
          </StatusTwo>
          <StatusThree :createTime="orderDetail.createTime"
            v-if="orderDetail.statusDto && orderDetail.statusDto.type == 2"></StatusThree>
          <StatusFour :createTime="orderDetail.createTime"
            v-if="orderDetail.statusDto && orderDetail.statusDto.type > 2"></StatusFour>
        </div>
      </div>
      <div class="desc">
        <div class="receivingInfo">
          <p class="title">收货信息</p>
          <div class="info">
            <p>收货地址：{{ orderDetail.userAddress }}</p>
            <p>收货人：{{ orderDetail.realName }}</p>
            <p>收货电话：{{ orderDetail.userPhone }}</p>
          </div>
        </div>
        <div class="orderInfo">
          <p class="title">订单信息</p>
          <div class="info">
            <p>订单号：{{ orderDetail.orderId }}</p>
            <p>创建时间：{{ orderDetail.createTime }}</p>
            <p>备注：{{ orderDetail.remark }}</p>
          </div>
        </div>
        <div class="productInfo">
          <div class="top">
            <span class="big">宝贝</span>
            <span>宝贝属性</span>
            <span>状态</span>
            <span>数量</span>
            <span>单价</span>
          </div>
          <div class="bottom" v-for="(pro, idx) in orderDetail.cartInfo" :key="idx">
            <div class="big">
              <img :src="$api.BASEURL + pro.productInfo.image" alt="">
              <p>{{ pro.productInfo.storeName }}</p>
            </div>
            <div style="flex-direction: column;">
              <p>{{ pro.productInfo.attrInfo.sku }}</p>
            </div>
            <div v-if="orderDetail.statusDto && orderDetail.statusDto.type == 0">待付款</div>
            <div v-if="orderDetail.statusDto && orderDetail.statusDto.type == 1">待发货</div>
            <div v-if="orderDetail.statusDto && orderDetail.statusDto.type == 2">待收货</div>
            <div v-if="orderDetail.statusDto && orderDetail.statusDto.type == 3">已完成</div>
            <div>{{ pro.cartNum }}</div>
            <div class="font-color-FF7 fs-bold">¥{{ pro.productInfo.attrInfo.price }}</div>
          </div>
        </div>
        <div class="settlement">
          <div class="box">
            <div class="left">
              <p>商品总价：<span class="right" style="color:#FF7800;">¥{{ orderDetail.totalPrice }}</span></p>
              <p>运费：<span class="right">￥{{ orderDetail.payPostage }}</span></p>
              <p v-if="orderDetail.statusDto && orderDetail.statusDto.type == 0" class="mar-top-20">需付款：<span
                  class="right" style="color:#FF7800;">¥{{ orderDetail.payPrice }}</span></p>
              <p v-if="orderDetail.statusDto && orderDetail.statusDto.type != 0" class="mar-top-20">实付款：<span
                  class="right" style="color:#FF7800;">¥{{ orderDetail.payPrice }}</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog title="提示" v-model:visible="closeOrderDialog" width="30%" :before-close="closeOrderBtn">
      <span>是否取消该订单?</span>
      <template v-slot:footer>
        <span class="dialog-footer">
          <el-button @click="closeOrderDialog = false">取 消</el-button>
          <el-button type="primary" @click="cancelOrder">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.orderDetail {
  width: 100%;

  .banxin {
    width: 1252px;
    margin: 0 auto;

    .head {
      width: 100%;
      height: 50px;
      line-height: 50px;
      font-size: 16px;
      display: flex;
      align-items: center;

      .arrow {
        background-image: url('../../../static/image/xiangyou@2x.png');
        width: 5px;
        height: 10px;
        margin-right: 10px;
      }
    }

    .status {
      width: 100%;
      height: 325px;
      border: 1px solid #E5E5E5;
      box-sizing: border-box;
      padding: 15px;
      display: flex;
      margin-bottom: 20px;

      .left {
        flex: 1;
        border-right: 1px solid #E5E5E5;
        display: flex;
        align-items: center;
        flex-direction: column;

        .cancel {
          width: 100px;
          margin-left: 0;
        }

        .invite {
          width: 100px;
          border: 1px solid #FF7800;
          color: #FF7800;
        }

        .pay {
          width: 100px;
          border-color: #FF7800;
          color: #FF7800;
          margin-left: 0;
        }

        .pay:hover {
          background-color: rgba($color: #FF7800, $alpha: 0.3);
        }

        .box {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .groupShopping {
          .groupShopTit {
            font-size: 24px;
            font-weight: bold;
            color: $mainColor;
            margin-bottom: 18px;
          }

          span {
            width: 100px;
            height: 30px;
            line-height: 30px;
            border: 1px solid #FF7800;
            border-radius: 4px;
            color: $mainColor;
            font-size: 14px;
            display: block;
            text-align: center;
            margin-bottom: 12px;
            cursor: pointer;
          }

          .closeOrder {
            font-size: 14px;
            color: #999999;
            border: 1px solid #999999;
          }
        }
      }

      .right {
        flex: 3;
        padding: 20px;
        box-sizing: border-box;
      }
    }

    .logistics {
      padding: 25px;
      width: 100%;
      box-sizing: border-box;
      margin-bottom: 20px;
      border: 1px solid #E5E5E5;

      .content {
        display: flex;

        .left {
          padding: 20px 0;
          flex: 2;
          display: flex;
          align-items: center;
          box-sizing: border-box;
          border-right: 2px solid #E5E5E5;

          img {
            width: 200px;
            height: 200px;
            margin-right: 40px;
          }

          div {
            p {
              font-size: 14px;
              color: #666666;
              margin-bottom: 20px;
            }
          }
        }

        .right {
          flex: 3;
          padding: 20px;
          box-sizing: border-box;
          display: flex;

          .dilevery {
            height: 280px;
            width: 600px;
            overflow-x: auto;
            padding: 20px;
            box-sizing: border-box;
            // div{
            //     padding-left: 25px;
            //     margin-bottom: 25px;
            //     position: relative;
            //     box-sizing: border-box;
            //     white-space: nowrap;
            //     .dot{
            //         // display: inline-block;
            //         width: 6px;
            //         height: 6px;
            //         border-radius: 3px;
            //         background-color: #D9D9D9;
            //         margin-right: 10px;
            //         position: absolute;
            //         left: 0;
            //         top: 50%;
            //         transform: translate(50%,0);
            //         .line{
            //             position: absolute;
            //             left: 50%;
            //             top: 12px;
            //             transform: translate(-50%,0);
            //             width: 2px;
            //             height: 25px;
            //             background-color: #F1F1F1;
            //         }
            //     }
            // .line{
            //     width: 100%;
            //     border-left: 2px solid #F1F1F1;
            //     height: 25px;
            //     margin-left: -21px;
            // }
            // }
            // div:last-child{
            //     margin-bottom: 0;
            //     .line{
            //         display: none;
            //     }
            // }
            // .active{
            //     .dot{
            //         background-color: #FF7800;
            //     }
            // }
          }
        }
      }
    }

    .desc {
      width: 100%;
      border: 1px solid #E5E5E5;
      margin-bottom: 140px;

      .receivingInfo,
      .storeInfo,
      .orderInfo {
        padding: 25px;
        border-bottom: 1px solid #E5E5E5;

        .title {
          font-size: 16px;
          margin-bottom: 25px;
        }

        .info {
          display: flex;
          margin-left: 75px;
          flex-wrap: wrap;

          p {
            line-height: 30px;
            width: 50%;
            font-size: 14px;
          }
        }
      }

      .orderInfo,
      .receivingInfo {
        .info {
          p {
            width: 33.33%;
          }
        }
      }

      .productInfo {
        width: 100%;

        .top {
          height: 40px;
          width: 100%;
          background-color: #EDEDED;
          display: flex;
          align-items: center;
          text-align: center;

          span {
            flex: 1;
            font-size: 12px;
          }

          .big {
            flex: 2;
          }
        }

        .bottom {
          width: 100%;
          padding: 20px 0;
          box-sizing: border-box;
          text-align: center;
          display: flex;
          border-bottom: 1px solid #E5E5E5;

          div {
            flex: 1;
            font-size: 14px;
            display: flex;
            align-items: center;
            justify-content: center;

            p {
              font-size: 14px;
              line-height: 20px;
            }
          }

          .big {
            text-align: left;
            flex: 2;
            display: flex;
            box-sizing: border-box;
            justify-content: flex-start;
            align-items: center;

            img {
              width: 80px;
              height: 80px;
              margin: 0 20px;
            }

            p {
              width: 50%;
            }
          }
        }
      }

      .settlement {
        width: 100%;
        display: flex;
        padding: 25px;
        box-sizing: border-box;
        justify-content: flex-end;

        .box {
          display: flex;

          .left {
            text-align: right;

            p {
              width: 250px;
              display: flex;
              justify-content: space-between;
              font-size: 20px;
              color: #666666;
              line-height: 30px;
            }

            .right {
              text-align: right;
              margin-left: 40px;
            }
          }
        }
      }
    }
  }

  .groupBuying {
    border: 1px solid #E5E5E5;
    height: 325px;
    padding: 20px;
    margin-bottom: 20px;

    .groupBuyTit {
      font-size: 16px;
      color: #333333;
      font-weight: bold;
    }

    .groupBuyBox {
      text-align: center;
      margin-top: 30px;

      .result {
        font-size: 18px;
        margin-bottom: 20px;
      }

      .result0 {
        color: #EC4B42;
      }

      p {
        font-size: 14px;
        color: #333333;
        margin-bottom: 20px;

        span {
          color: #FF7800;
          font-size: 14px;
          font-weight: normal;
        }
      }

      .surplusTime {
        margin-bottom: 30px;
        font-size: 16px;
        color: #666666;
        display: flex;
        justify-content: center;
        align-items: center;

        .day {
          margin-left: 10px;
        }

        .time {
          color: #FF7800;
        }

        span {
          border: 1px solid #E5E5E5;
          border-radius: 2px;
          display: block;
          width: 24px;
          height: 24px;
          text-align: center;
          line-height: 20px;
          margin: 0 8px;
        }
      }

      .userList {
        display: flex;
        justify-content: center;
        align-items: center;

        span {
          display: block;
          width: 76px;
          height: 76px;
          position: relative;
          margin: 0 13px;
          border-radius: 50%;
          box-sizing: border-box;

          img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
          }

          i {
            position: absolute;
            left: 8px;
            bottom: -10px;
            width: 60px;
            height: 24px;
            background: $mainColor;
            border-radius: 12px;
            font-style: normal;
            text-align: center;
            line-height: 24px;
            color: #FFFFFF;
            font-size: 14px;
          }
        }

        .noPeople {
          border: 1px dashed #E5E5E5;
          color: #DBDBDB;
          font-size: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        span:first-child {
          border: 1px solid $mainColor;
        }
      }
    }
  }

  .inviteDialog {
    text-align: center;

    .inviteTit {
      font-size: 22px;
      color: #444444;
    }

    .imgCode {
      width: 200px;
      height: 200px;
      margin: 0 auto;

      img {
        width: 100%;
        height: 100%;
      }
    }

    p {
      margin: 25px 0;
    }

    .linkBox {
      display: flex;
      justify-content: center;

      .linkAddress {
        height: 40px;
        line-height: 40px;
        padding: 0 20px;
        display: block;
        width: 220px;
        text-align: left;
        border: 1px solid #E5E5E5;
      }

      .copyBtn {
        width: 100px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        background: #FFFFFF;
        border: 1px solid $mainColor;
        color: $mainColor;
        margin-left: 20px;
        cursor: pointer;
      }
    }
  }

  .weChatBox {
    display: flex;

    img {
      width: 100%;
    }

    .qCode {
      width: 50%;
      text-align: center;

      img {
        width: 80%;
      }
    }

    .weChatInfo {
      width: 50%;
    }
  }

  .weChat {
    :deep(.el-dialog__body) {
      background: #FFFFFF;
    }
  }
}
</style>
