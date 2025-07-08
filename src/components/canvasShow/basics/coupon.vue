<script setup>
import api from '../config/api'
import Cookies from 'js-cookie'
import { sendReq, jumpStore } from '../config/mixin'
import router from '@/router'
import { useComponentsStore } from '../config/mixin/store'
import { ref, watch, onCreated } from 'vue'
import { ElMessage } from 'element-plus'
const ComponentsStore = useComponentsStore()
// 组件名称
defineOptions({
  name: 'textComponent',
})
const couponsData = ref([])
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
const emit = defineEmits(['update:componentContent'])
watch(props.componentContent, () => {
  getData()
}, {
  deep: true
})
onCreated(() => {
  getData()
})
const getData = () => {
  if (props.componentContent.selectedCoupon) {
    let _url = ''
    if (props.typeId === 1) {
      _url = `${api.getCoupons}?page=1&pageSize=99&ids=${props.componentContent.selectedCoupon}`
    } else if (props.typeId === 3) {
      _url = `${api.getShopCoupons}?page=1&pageSize=99&shopId=${props.shopId}&ids=${props.componentContent.selectedCoupon}`
    }
    const params = {
      method: 'GET',
      url: _url,
    }
    sendReq(params, (res) => {
      ComponentsStore.loadNumReduce();
      couponsData.value = res.data.list
      if (JSON.stringify(props.componentContent.couponList) !== JSON.stringify(couponsData.value)) {
        emit('update:componentContent', {
          ...props.componentContent,
          couponList: couponsData.value
        })
      }
    })
  } else {
    couponsData.value = []
    ComponentsStore.loadNumReduce();
  }
}
// 领取优惠券
const receiveCoupon = (item) => {
  const key = Cookies.get('token')
  if (key) {
    const paramsData = {}
    if (props.typeId === 1) {
      paramsData.couponId = item.couponId
    } else if (props.typeId === 3) {
      paramsData.shopCouponId = item.shopCouponId
      paramsData.shopId = props.shopId
    }
    let params = {
      url: api.takeCoupon,
      method: 'POST',
      data: paramsData
    }
    sendReq(params, (res) => {
      if (res.code === '200') {
        ElMessage.success('领取成功！')
        getData()
      }
    })
  } else {
    ElMessage.warning('请先登录')
    ComponentsStore.resetVuex()
    router.push({ path: '/login' })
  }
}
</script>
<template>
  <div>
    <div class="couponBox warp" v-if="terminal === 4"
      :class="['terminal' + terminal, 'arrange' + (props.componentContent.arrangeActiveIndex + 1), 'color' + (props.componentContent.colorActiveIndex + 1)]">
      <div class="couponListBox" v-if="props.componentContent.selectedCoupon">
        <div class="listItemBox" v-for="(item, index) in couponsData" :key="index"
          :class="item.state !== 3 && 'isReceive'">
          <div class="listItemBoxInner">
            <div class="itemInfo" v-if="typeId !== 1">
              <div class="amount">
                <b>￥</b><span>{{ item.couponContent }}<i v-if="item.couponType === 1">满减卷</i><i
                    v-if="item.couponType === 2">折扣券</i></span>
              </div>
              <div class="couponInfo">
                <p>{{ item.content }}</p>
              </div>
            </div>
            <div class="itemInfo" v-else>
              <div class="amount">
                <b>￥</b><span>{{ item.reduceMoney }}<i>满减卷</i></span>
              </div>
              <div class="couponInfo">
                <p>{{ item.content }}</p>
              </div>
            </div>
            <div v-if="item.state === 0" class="receiveBtn">
              <span>己领取</span>
            </div>
            <div v-else-if="item.state === 1" class="receiveBtn">
              <span>已使用</span>
            </div>
            <div v-else-if="item.state === 2" class="receiveBtn">
              <span>已过期</span>
            </div>
            <div v-else class="receiveBtn" @click="receiveCoupon(item)">
              <span>立即领取</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="mobileStyle warp" v-if="props.terminal === 1 || props.terminal === 2 || props.terminal === 3">
      <div class="mCouponList">
        <div class="mItem" v-for="(item, index) in couponsData" :key="index">
          <div class="leftBox" v-if="typeId !== 1">
            <div class="couponType"><i v-if="item.couponType === 1">满减卷</i><i v-if="item.couponType === 2">折扣券</i></div>
            <div class="couponInfo">
              <div class="couponPrice"><b>￥</b>{{ item.couponContent }}</div>
              <div class="couponDetail">
                <div class="couponTit">{{ item.content }}</div>
                <div class="couponDate">{{ item.effectiveStart.split(' ')[0] }} - {{ item.effectiveEnd.split(' ')[0] }}
                </div>
              </div>
            </div>
          </div>
          <div class="leftBox" v-else>
            <div class="couponType">满减卷</div>
            <div class="couponInfo">
              <div class="couponPrice"><b>￥</b>{{ item.reduceMoney }}</div>
              <div class="couponDetail">
                <div class="couponTit">{{ item.content }}</div>
                <div class="couponDate">{{ item.activityStartTime.split(' ')[0] }} - {{
                  item.activityEndTime.split('')[0] }}</div>
              </div>
            </div>
          </div>
          <div v-if="item.state === 0" class="rightBtn" @click="jumpStore(item)">
            <button>立即使用</button>
          </div>
          <div v-else-if="item.state === 1" class="rightBtn">
            <button>已使用</button>
          </div>
          <div v-else-if="item.state === 2" class="rightBtn">
            <button>已过期</button>
          </div>
          <div v-else class="rightBtn" @click="receiveCoupon(item)">
            <button>立即领取</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>



<style lang="scss" scoped>
.couponBox {
  margin: 0 auto;
  padding: 20px 0 10px;

  .couponListBox {
    flex-wrap: wrap;

    /**默认**/
    .listItemBox {
      width: 268px;
      height: 122px;
      border-radius: 10px;
      overflow: hidden;
      background-image: url('../static/images/coupon/border_L1.png'), url('../static/images/coupon/border_R1.png');
      background-repeat: no-repeat, no-repeat;
      background-position: left top, right top;
      box-sizing: border-box;

      .listItemBoxInner {
        height: 122px;
        border-top: 1px solid #EC4B42;
        border-bottom: 1px solid #EC4B42;
        display: flex;
        background: none !important;
        width: 268px;
        align-items: center;
        justify-content: space-between;

        .itemInfo {
          width: 223px;
        }

        .amount {
          max-width: 90%;
          margin: 0 auto;
          display: flex;
          align-items: baseline;
          justify-content: center;
          border-bottom: 1px solid #EC4B42;

          b {
            font-size: 25px;
          }

          span {
            font-size: 52px;
            font-weight: bold;
          }

          i {
            font-style: normal;
            font-size: 18px;
            margin-left: 5px;
          }
        }

        .couponInfo {
          p {
            text-align: center;
            font-size: 13px;
            color: #EC4B42;
            margin-top: 10px;
          }
        }
      }

      .receiveBtn {
        width: 40px;
        margin-right: 5px;
        background: #EC4B42;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;

        span {
          color: #FFFFFF !important;
          writing-mode: vertical-lr;
          font-size: 19px;
        }
      }

      &.isReceive {
        background-image: url('../static/images/coupon/border_L4.png'), url('../static/images/coupon/border_R4.png');

        .listItemBoxInner {
          border-top: 1px solid #808080;
          border-bottom: 1px solid #808080;

          .itemInfo {
            color: #808080;

            .amount {
              border-bottom: 1px solid #808080;
            }

            .couponInfo {
              p {
                color: #808080;
              }
            }
          }

          .receiveBtn {
            cursor: auto;
            background: #808080;
          }
        }
      }
    }
  }

  @mixin cardColor($bgColor: #FF3737, $fontColor: #fff) {
    .couponListBox {
      .listItemBox {
        .listItemBoxInner {
          background: $bgColor;
        }

        .itemInfo {
          .amount {
            b {
              color: #EC4B42;
            }

            span {
              color: #EC4B42;

              i {
                color: #EC4B42;
              }
            }
          }

          .couponInfo {
            color: #EC4B42;
          }
        }

        .receiveBtn {
          span {
            color: #EC4B42;
          }
        }

        &.cardStyle3 {
          .itemInfo {
            .amount {
              span {
                color: $bgColor;

                i {
                  color: $bgColor;
                }
              }
            }

            .couponInfo {
              color: $bgColor;
            }
          }
        }

        &.cardStyle4 {
          border: 2px solid $bgColor;
          padding: 5px;

          .listItemBoxInner {
            padding: 20px 15px;
            height: 85px;
            border: 1px solid $bgColor;
          }

          .itemInfo {
            .amount {
              span {
                color: $bgColor;

                i {
                  color: $bgColor;
                }
              }
            }

            .couponInfo {
              color: $bgColor;
            }
          }

          .receiveBtn {
            border-left: 1px $bgColor dashed;

            span {
              color: $bgColor;
            }
          }
        }
      }
    }
  }

  &.arrange2 {
    max-width: 96%;

    .couponListBox {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;

      .listItemBox {
        width: 48%;
      }
    }
  }

  &.arrange3 {
    max-width: 96%;

    .couponListBox {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;

      .listItemBox {
        width: 32%;
      }
    }
  }

  &.arrange4 {
    max-width: 96%;

    .couponListBox {
      display: flex;
      overflow: hidden;

      .listItemBox {
        width: 268px;
        flex: 0 0 268px;
        margin: 0 25px 25px 0;

        &:nth-child(4n) {
          margin-right: 0;
        }
      }
    }
  }

  &.color1 {
    .listItemBox {
      background-image: url('../static/images/coupon/border_L1.png'), url('../static/images/coupon/border_R1.png');

      .listItemBoxInner {
        border-top: 1px solid #EC4B42;
        border-bottom: 1px solid #EC4B42;

        .itemInfo {
          color: #EC4B42;

          .amount {
            border-bottom: 1px solid #EC4B42;
          }

          .couponInfo {
            p {
              color: #EC4B42;
            }
          }
        }

        .receiveBtn {
          background: #EC4B42;
        }
      }
    }
  }

  &.color2 {
    .listItemBox {
      background-image: url('../static/images/coupon/border_L2.png'), url('../static/images/coupon/border_R2.png');

      .listItemBoxInner {
        border-top: 1px solid #FF7800;
        border-bottom: 1px solid #FF7800;

        .itemInfo {
          color: #FF7800;

          .amount {
            border-bottom: 1px solid #FF7800;
          }

          .couponInfo {
            p {
              color: #FF7800;
            }
          }
        }

        .receiveBtn {
          background: #FF7800;
        }
      }
    }
  }

  &.color3 {
    .listItemBox {
      background-image: url('../static/images/coupon/border_L3.png'), url('../static/images/coupon/border_R3.png');

      .listItemBoxInner {
        border-top: 1px solid #86A7FF;
        border-bottom: 1px solid #86A7FF;

        .itemInfo {
          color: #86A7FF;

          .amount {
            border-bottom: 1px solid #86A7FF;
          }

          .couponInfo {
            p {
              color: #86A7FF;
            }
          }
        }

        .receiveBtn {
          background: #86A7FF;
        }
      }
    }
  }
}

.mobileStyle {
  .mCouponList {
    .mItem {
      display: flex;
      position: relative;
      width: 100%;
      height: 140px;
      background: #FFE9D8;
      border-radius: 10px;
      align-items: center;
      margin-bottom: 20px;

      .couponType {
        width: 108px;
        height: 32px;
        line-height: 32px;
        background: #FFD5B5;
        border-radius: 10px 0 10px 0;
        position: absolute;
        left: 0;
        top: 0;
        text-align: center;
        color: $mainColor;
        font-size: 20px;
      }

      .leftBox {
        width: 70%;

        .couponInfo {
          display: flex;
          padding-left: 30px;
          align-items: center;

          .couponPrice {
            font-size: 40px;
            color: $mainColor;

            b {
              font-weight: 500;
              font-size: 28px;
            }

            margin-right: 35px;
          }

          .couponDetail {
            color: $mainColor;

            .couponTit {
              font-size: 24px;
              margin-bottom: 15px;
            }

            .couponDate {
              font-size: 22px;
              color: $mainColor;
            }
          }
        }
      }

      .rightBtn {
        display: flex;
        align-items: center;
        justify-content: center;
        flex: 1;
        border-left: 2px dashed #ffa759;
        padding: 20px 0;
        position: relative;

        &:before {
          content: '';
          width: 30px;
          height: 30px;
          position: absolute;
          left: -15px;
          bottom: -38px;
          background: #FFFFFF;
          display: block;
          border-radius: 50%;
        }

        &:after {
          content: '';
          width: 30px;
          height: 30px;
          position: absolute;
          left: -15px;
          top: -38px;
          background: #FFFFFF;
          display: block;
          border-radius: 50%;
        }

        button {
          width: 140px;
          height: 56px;
          line-height: 56px;
          text-align: center;
          color: #FFFFFF;
          background: $mainColor;
          border-radius: 25px;
          font-size: 20px;
        }
      }
    }
  }

  //&.couponBox .couponListBox .listItemBox {
  //  width: 100%;
  //  flex: 0 0 100%;
  //  margin:0 0 20px 0;
  //  .itemInfo{
  //    padding-right: 15px;
  //  }
  //  .receiveBtn{
  //    width: 50px;
  //  }
  //}
  //&.arrange3{
  //  .itemInfo{
  //    flex-direction: column;
  //    align-items: center;
  //    justify-content: center;
  //    .couponInfo{
  //      span{
  //        display: none;
  //      }
  //    }
  //  }
  //  .receiveBtn{
  //    width: 50px;
  //  }
  //}
}
</style>
