<script setup>
import api from '@/api'
import { sendReq } from '@/config/mixin'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

defineOptions({
  name: 'FavoritesPage'
})

const router = useRouter()
// const keyword = ref('')
// const attentiondChecked = ref(0)
// const shopList = ref([])
// const flag1 = ref(true)
const edit = ref(false)
const selectAll = ref(0)
const activeName = ref('commodity')
const attentiondList = ref([])
const flag = ref(true)
const loading = ref(false)

onMounted(() => {
  getAllProduct()
})
// 收藏商品查询
const getAllProduct = () => {
  loading.value = true
  let params = {
    url: api.getAllProduct,
    method: 'GET',
    payload: {
      type: 'collect'
    }
  }
  sendReq(params, res => {
    if (res.status === 200) {
      let data = res.data
      let list = data.map(item => {
        item.selected = 0
        return item
      })
      attentiondList.value = list
      if (res.data.length) {
        flag.value = true
      } else {
        flag.value = false
      }
      loading.value = false
    } else {
      ElMessage.warning(res.msg)
    }
  })
}
// 跳转到商品详情
const toProductDetail = (item) => {
  let data = {
    productId: item.pid
  }
  router.push({
    path: '/productDetail',
    query: {
      proData: JSON.stringify(data)
    }
  })
}
// 商品单个选中
const selectPro = (index, selected) => {
  if (selected === 1) {
    attentiondList.value[index].selected = 0
  } else {
    attentiondList.value[index].selected = 1
  }
  selectAll.value = 1
  attentiondList.value.map(item => {
    if (item.selected === 0) {
      selectAll.value = 0
    }
  })
}
// 全选
const changeChecked = () => {
  attentiondList.value.forEach(i => {
    i.selected = selectAll.value
  })
}
// 批量管理
const showEdit = () => {
  if (attentiondList.value.length === 0) {
    return
  }
  edit.value = true
}
// 保存
const saveList = () => {
  attentiondList.value.forEach(i => { i.selected = 0 })
  selectAll.value = 0
  edit.value = false
}
// 取消收藏请求
const unfavorite = (item) => {
  let params = {
    url: api.unfavorite,
    method: 'POST',
    data: {
      id: item.pid,
      category: 'collect'
    }
  }
  sendReq(params, res => {
    if (res.status === 200) {
      ElMessage.success('取消成功')
      edit.value = false
      getAllProduct()
    } else {
      ElMessage.warning('取消失败')
    }
  })
}
// 取消选中收藏
const cancelFun = () => {
  let flag2 = false
  let ids = []
  attentiondList.value.forEach(item => {
    if (item.selected === 1) {
      flag2 = true
      ids.push(item.pid)
    }
  })
  ids = ids.join(',')
  if (flag2 === false) {
    return ElMessage.warning('请先选择需要取消的收藏')
  }
  confirm('此操作将取消选中的收藏, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    let params = {
      url: api.unfavorites + ids,
      method: 'POST',
      data: {
        category: 'collect'
      }
    }
    sendReq(params, res => {
      if (res.status === 200) {
        ElMessage.success('取消成功')
        edit.value = false
        getAllProduct()
      } else {
        ElMessage.warning('取消失败')
      }
    })
  }).catch(() => {
  })
}
</script>

<template>
  <div class="attentionds">
    <div class="attentiondsTit">
      <div class="attentionBox">
        <div class="">
          <div class="searchRight">
            <span v-if="!edit" class="batch" @click="showEdit">批量管理</span>
            <div v-else class="saveList">
              <el-checkbox v-model="selectAll" @change="changeChecked" :true-label='1' :false-label='0'>全选</el-checkbox>
              <span class="delete" @click="cancelFun">取消收藏</span>
              <span class="save" @click="saveList">保存</span>
            </div>
          </div>
        </div>
      </div>
      <el-tabs v-model="activeName">
        <el-tab-pane label="收藏的商品" name="commodity">
          <div class="list sub-main" v-if="flag" v-loading="loading">
            <div class="attentiondsList">
              <div class="listBox">
                <div class="attentiondsItem" v-for="(item, index) of attentiondList" :key="index"
                  :class="{ selected: item.selected === 1, edit: edit }" @click="selectPro(index, item.selected)">
                  <div class="mc" v-if="edit"></div>
                  <div class="imgBox" :class="{ offShelf: item.isShow === 0 }">
                    <div class="tipText" v-if="item.isShow === 0">
                      <span>已下架</span>
                    </div>
                    <img :src="$api.BASEURL + item.image" alt="">
                  </div>
                  <div class="info">
                    <h3 class="overflow">{{ item.storeName }}</h3>
                    <span class="price">¥{{ item.price }}</span>
                  </div>
                  <div class="btnBox">
                    <span @click="unfavorite(item)">取消收藏</span>
                    <span @click="toProductDetail(item)">查看详情</span>
                  </div>
                </div>
                <div class="clearfix"></div>
              </div>
            </div>
          </div>
          <div class="nothing sub-main" v-else>
            <img src="../../../../static/image/nothing@2x.png" alt="">
            <p class="fs20 font-color-999">你还没有收藏的商品～</p>
            <router-link to="/">
              <el-button>去首页看看</el-button>
            </router-link>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>


<style lang="scss" scoped>
.attentionds {
  border: 1px solid #E5E5E5;

  .attentiondsTit {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    position: relative;

    :deep(.el-tabs__nav-wrap)::after {
      height: 1px;
    }

    :deep(.el-tabs--top) {
      width: 100%;
    }

    .attentionBox {
      position: absolute;
      top: 5px;
      right: 20px;
      z-index: 99;

      .searchRight {
        display: flex;

        input {
          margin-left: 16px;
          border: 1px solid #E5E5E5;
          padding-left: 10px;
          font-size: 14px;
          width: 175px;
        }

        span {
          display: block;
          height: 30px;
          line-height: 30px;
        }

        .batch {
          color: #FFFFFF;
          font-size: 12px;
          width: 78px;
          text-align: center;
          height: 28px;
          line-height: 28px;
          background: $mainColor;
          cursor: pointer;
        }

        .searchBtn {
          width: 64px;
          height: 28px;
          line-height: 28px;
          background: #FF7800;
          color: #FFFFFF;
          font-size: 14px;
          text-align: center;
          cursor: pointer;
        }
      }
    }

    span {
      display: block;
      height: 30px;
      line-height: 30px;
    }

    .saveList {
      display: flex;
      align-items: center;

      span {
        margin-left: 36px;
        cursor: pointer;
        color: #333333;
        font-size: 14px;
      }

      span.save {
        width: 78px;
        height: 28px;
        background: #FF7800;
        color: #FFFFFF;
        text-align: center;
        line-height: 28px;
      }
    }

    :deep(.el-tabs__nav-scroll) {
      padding: 0 25px;
      // height: 60px;
      line-height: 60px;
    }
  }

  .list {
    padding: 10px 20px 20px 20px;

    .attentiondsList {
      .topTime {
        color: #333333;
        font-size: 18px;
        margin-bottom: 30px;
      }

      .listBox {
        .attentiondsItem {
          width: 186px;
          float: left;
          margin: 0 18px 20px 0;
          position: relative;

          .imgBox {
            width: 186px;
            height: 186px;
            border: 1px solid #E5E5E5;
            border-bottom: 0;
            box-sizing: border-box;

            img {
              width: 100%;
              height: 100%;
            }
          }

          .info {
            border: 1px solid #E5E5E5;
            box-sizing: border-box;
            text-align: center;
            padding: 0 15px 15px;

            h3 {
              font-size: 14px;
              color: #333333;
              height: 30px;
              line-height: 30px;
              margin-top: 10px;
            }

            span {
              color: $mainColor;
              font-size: 14px;
            }
          }

          .btnBox {
            border: 1px solid #E5E5E5;
            display: flex;
            border-top: none;

            span {
              width: 50%;
              display: block;
              text-align: center;
              font-size: 14px;
              color: #333333;
              height: 30px;
              line-height: 30px;
              cursor: pointer;
            }

            span:first-child {
              border-right: 1px solid #E5E5E5;
              box-sizing: border-box;
            }
          }

          .offShelf {
            position: relative;
            z-index: 99;

            .tipText {
              top: 0;
              position: absolute;
              left: 0;
              right: 0;
              bottom: 0;
              display: flex;
              align-items: center;
              justify-content: center;
              background: rgba(28, 28, 28, 0.5);
              color: #fff;
            }
          }
        }

        .attentiondsItem:nth-child(5n) {
          margin-right: 0;
        }

        .edit:before {
          content: "";
          background: url("./../../../assets/images/noEdit.png");
          width: 58px;
          height: 58px;
          position: absolute;
          right: 0;
          top: 0;
          display: block;
          background-size: contain;
          z-index: 999;
        }

        .selected:before {
          background: url("./../../../assets/images/edit.png");
          background-size: contain;
        }
      }
    }

    :deep(.el-pagination) {
      margin: 30px 0 20px 0;
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

  .mc {
    width: 100%;
    height: 100%;
    position: absolute;
    opacity: 0;
  }
}
</style>
