<script setup>
import api from '../../api'
import { sendReq } from '../../config/mixin'
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
defineOptions({
  name: 'ProductEvaluation'
})
const props = defineProps({
  evaluateParam: Object
})
// const evaluateTotal = ref(0)
// const currentWord = ref('全部')
const evaluateList = ref([])
const evaluateData = ref({})
const currentType = ref(0)
const listPage = ref(1)
const pageTotal = ref(0)

onMounted(() => {
  getEvaluateData()
  getEvaluateList()
})

// 获取商品评价数据
const getEvaluateData = () => {
  let params = {
    url: api.getEvaluateData + props.evaluateParam.id,
    method: 'GET'
  }
  sendReq(params, (res) => {
    if (res.status === 200) {
      evaluateData.value = res.data
    } else {
      ElMessage.warning(res.msg)
    }
  })
}
// 获取商品评价列表
const getEvaluateList = () => {
  let params = {
    url: api.getEvaluateList + props.evaluateParam.id,
    method: 'GET',
    payload: {
      page: listPage.value,
      limit: 5,
      type: currentType.value
    }
  }
  sendReq(params, (res) => {
    if (res.status === 200) {
      evaluateList.value = res.data
    } else {
      ElMessage.warning(res.msg)
    }
  })
}
// 切换评价类型
const changeEvaType = (item, index) => {
  listPage.value = 1
  currentType.value = index
  switch (index) {
    case 0:
      pageTotal.value = evaluateData.value.sumCount
      break
    case 1:
      pageTotal.value = evaluateData.value.goodCount
      break
    case 2:
      pageTotal.value = evaluateData.value.inCount
      break
    case 3:
      pageTotal.value = evaluateData.value.poorCount
      break
  }
  getEvaluateList()
}
// 翻页
const handleCurrentChange = (val) => {
  listPage.value = val
  getEvaluateList()
}
</script>

<template>
  <div class="evaluationBox">
    <div class="evaluateType">
      <span :class="{ typeActive: currentType === 0 }" @click="changeEvaType('全部', 0)">全部（{{ evaluateData.sumCount
        }}）</span>
      <span :class="{ typeActive: currentType === 1 }" @click="changeEvaType('好评', 1)">好评（{{ evaluateData.goodCount
        }}）</span>
      <span :class="{ typeActive: currentType === 2 }" @click="changeEvaType('中评', 2)">中评（{{ evaluateData.inCount
        }}）</span>
      <span :class="{ typeActive: currentType === 3 }" @click="changeEvaType('差评', 3)">差评（{{ evaluateData.poorCount
        }}）</span>
    </div>
    <div class="evaluateList">
      <div class="evaluateItem" v-for="(item, index) of evaluateList" :key="index">
        <div class="leftAvatarBox">
          <img src="../../assets/images/avatar.png" alt="">
          <span>{{ item.nickname }}</span>
        </div>
        <div class="evaluateInfo">
          <p>{{ item.comment }}</p>
          <div class="evaluateImgList">
            <div class="imgItemBox" v-for="(imgItem, index) of item.picturesArr" :key="index">
              <el-image style="width: 100px; height: 100px" :src="$api.BASEURL + imgItem"
                :preview-src-list="[$api.BASEURL + imgItem]">
              </el-image>
            </div>
          </div>
          <div class="evaluateTime">{{ item.createTime }}</div>
        </div>
      </div>
      <el-pagination v-if="evaluateList.length > 0" class="evaluationPage" background layout="prev, pager, next, jumper"
        :page-size="5" :current-page="listPage" @current-change="handleCurrentChange" :total="pageTotal">
      </el-pagination>
    </div>
  </div>
</template>



<style lang="scss" scoped>
.evaluationBox {
  .evaluateType {
    display: flex;

    span {
      height: 36px;
      line-height: 36px;
      width: 120px;
      border-radius: 18px;
      border: 1px solid #999999;
      text-align: center;
      font-size: 14px;
      color: #333333;
      font-weight: 400;
      margin-right: 20px;
      cursor: pointer;
    }

    .typeActive {
      border: 1px solid $mainColor;
      color: $mainColor;
    }
  }

  .evaluateList {
    margin-top: 25px;
    border-top: 1px solid #E5E5E5;
    margin-right: 8px;

    .evaluateItem {
      padding: 20px;
      margin-bottom: 15px;
      display: flex;
      border-bottom: 1px solid #E5E5E5;

      .leftAvatarBox {
        width: 100px;
        float: left;
        text-align: center;
        margin-right: 20px;

        img {
          width: 64px;
          height: 64px;
        }

        span {
          margin-top: 10px;
          color: #333333;
          font-size: 16px;
          display: block;
        }
      }

      .evaluateInfo {
        flex: 1;

        p {
          line-height: 25px;
          font-size: 16px;
          color: #333333;
          margin-bottom: 15px;
        }

        .evaluateTime {
          color: #999999;
          font-size: 16px;
          margin-bottom: 20px;
        }

        .addToEvaInfo {
          padding-top: 20px;
          border-top: 1px solid #E5E5E5;
          display: flex;
          margin-bottom: 15px;

          span {
            color: #999999;
            font-size: 16px;
            line-height: 25px;
          }

          span:nth-child(1) {
            margin-right: 15px;
          }

          span:nth-child(2) {
            flex: 1;
            color: #333333;
          }
        }

        .receiptTime {
          color: #999999;
          font-size: 16px;
        }
      }

      .evaluateImgList {
        display: flex;
        margin-bottom: 20px;

        .imgItemBox {
          width: 100px;
          height: 100px;
          background: #EEEEEE;
          display: flex;
          align-items: center;
          margin-right: 20px;
          overflow: hidden;

          img {
            width: 100%;
          }
        }
      }
    }
  }

  .evaluationPage {
    margin-top: 30px;
  }
}
</style>
