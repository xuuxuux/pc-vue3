<script setup>
import api from '@/api'
import { sendReq } from '@/config/mixin'
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
defineOptions({
  name: 'RechargePage'
})
const activeName = ref('recharge')
const rechargeList = ref([])

onMounted(() => {
  getRecharge()
})

// 充值方案列表
const getRecharge = () => {
  // const rLoading = openLoading()
  let params = {
    url: api.getRecharge,
    method: 'GET'
  }
  sendReq(params, (res) => {
    if (res.status === 200) {
      rechargeList.value = res.data.rechargePriceWays
      // rLoading.close()
    } else {
      ElMessage.warning(res.msg)
    }
  })
}
// 充值
const userecharge = (id) => {
  // const rLoading = this.openLoading()
  let params = {
    url: api.setRecharge,
    method: 'POST',
    data: {
      rechar_id: id
    }
  }
  sendReq(params, (res) => {
    if (res.status === 200) {
      ElMessage.success('充值成功')
      // rLoading.close()
    } else {
      ElMessage.warning(res.msg)
    }
  })
}
</script>
<template>
  <div class="recharge">
    <el-tabs v-model="activeName">
      <el-tab-pane label="充值方案" name="recharge">
        <div class="rechargeList" v-if="rechargeList.length > 0">
          <div class="clearfix sub-main">
            <div class="rechargeItem active" v-for="(item, index) in rechargeList" :key="index">
              <div class="rechargeItemTop">
                <img src="../../../assets/images/indexLogo.png" alt="">
                <span><i>￥</i>{{ item.value.give_price }}</span>
                <span>使用条件：充值￥{{ item.value.price }} 赠送￥{{ item.value.give_price }}</span>
                <div class="rechargeType">充值</div>
              </div>
              <div class="rechargeItemBot" @click="userecharge(item.id)">
                立即使用
              </div>
            </div>
          </div>
        </div>
        <div class="nothing sub-main" v-else>
          <img src="../../../../static/image/noorder@2x.png" alt="">
          <p class="fs20 font-color-999">没有充值方案～</p>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>


<style lang="scss" scoped>
.recharge {
  border: 1px solid #E5E5E5;
  min-height: 500px;

  :deep(.el-tabs__nav-scroll) {
    padding-left: 30px;

    .el-tabs__item {
      height: 52px;
      line-height: 52px;
    }
  }

  :deep(.el-tabs__content) {
    padding: 0 30px;
  }

  .rechargeList {
    margin-bottom: 30px;
    padding: 20px;

    .rechargeItem {
      width: 245px;
      border: 1px solid #EEEEEE;
      border-radius: 18px;
      overflow: hidden;
      margin: 0 100px 50px 0;
      float: left;

      &:nth-child(3n) {
        margin-right: 0;
      }

      .rechargeItemTop {
        background: #d7d7d7;
        color: #ffffff;
        padding: 20px;
        box-sizing: border-box;
        position: relative;

        img {
          opacity: 0.2;
          position: absolute;
          top: 40%;
        }

        .rechargeType {
          position: absolute;
          top: 1px;
          right: -33px;
          width: 100px;
          transform: rotate(45deg);
          background: #FFFFFF;
          color: #999999;
          text-align: center;
          height: 40px;
          line-height: 50px;
        }

        span {
          font-size: 14px;
          display: block;
          margin-bottom: 18px;
          cursor: pointer;

          i {
            margin-right: 5px;
            font-style: normal;
            font-size: 16px;
          }
        }

        span:nth-child(2) {
          font-size: 28px;
        }

        span:nth-child(4) {
          margin-bottom: 0;
        }
      }

      .rechargeItemBot {
        height: 40px;
        line-height: 40px;
        color: #999999;
        position: relative;
        text-align: center;
        background: #FFFFFF;
        cursor: pointer;
      }
    }

    .active {
      .rechargeItemTop {
        background: #fd5b5b;
        color: #ffffff;

        .rechargeType {
          background: #FFFFFF;
          color: #fd5b5b;
        }
      }

      .rechargeItemBot {
        background: #f3f3f3;
        color: #333333;
      }
    }
  }
}

.sub-main {
  min-height: 400px;
}

.nothing {
  width: 100%;
  text-align: center;
  min-height: 400px;

  p {
    margin-bottom: 20px;
  }

  .el-button {
    background-color: #FF7800;
    color: #FFFFFF;
    font-weight: normal;
    border-radius: 0;
  }
}
</style>
