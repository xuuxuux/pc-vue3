<script setup>
import api from '@/api'
import { sendReq } from '@/config/mixin'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
defineOptions({
  name: 'browseRecords'
})

// const recordChecked = ref(0)
// const ids = ref([])
// const times = ref([])
const edit = ref(false)
const selectAll = ref(0)
const recordList = ref([])
const flag = ref(true)
const loading = ref(false)
const router = useRouter()
onMounted(() => {
  getFootprint()
})
// 我的足迹
const getFootprint = () => {
  loading.value = true
  const params = {
    url: api.getAllProduct,
    method: 'GET',
    payload: {
      type: 'foot'
    }
  }
  sendReq(params, res => {
    if (res.status === 200) {
      const data = res.data
      const list = data.map(item => {
        item.selected = 0
        return item
      })
      recordList.value = list
      if (data.length) {
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
// 保存
const saveList = () => {
  edit.value = false
}
// 选择
const select = (index) => {
  if (recordList.value[index].selected === 1) {
    recordList.value[index].selected = 0
  } else {
    recordList.value[index].selected = 1
  }
  selectAll.value = 1
  recordList.value.map(i => {
    if (i.selected === 0) {
      selectAll.value = 0
    }
  })
}
// 全选
const changeChecked = () => {
  recordList.value.forEach(i => {
    i.selected = selectAll.value
  })
}
// 编辑
const showEdit = () => {
  if (recordList.value.length === 0) {
    return
  }
  edit.value = true
}
// 商品详情
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
// 删除浏览记录请求
const delFootprint = (item) => {
  let params = {
    url: api.unfavorite,
    method: 'POST',
    data: {
      id: item.pid,
      category: 'foot'
    }
  }
  sendReq(params, res => {
    if (res.status === 200) {
      ElMessage.success('取消成功')
      edit.value = false
      getFootprint()
    } else {
      ElMessage.warning('取消失败')
    }
  })
}
// 删除选中浏览记录
const deleteFun = () => {
  let flag = false
  let ids = []
  recordList.value.forEach(item => {
    if (item.selected === 1) {
      flag = true
      ids.push(item.pid)
    }
  })
  ids = ids.join(',')
  if (flag === false) {
    return ElMessage.warning('请先选中需要删除的记录')
  }
  confirm('此操作将删除选中的记录, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    let params = {
      url: api.unfavorites + ids,
      method: 'POST',
      data: {
        category: 'foot'
      }
    }
    sendReq(params, res => {
      if (res.status === 200) {
        ElMessage.success('取消成功')
        edit.value = false
        getFootprint()
      } else {
        ElMessage.warning('取消失败')
      }
    })
  }).catch(() => {
  })
}
</script>

<template>
  <div class="records">
    <div class="recordsTit">
      <span>浏览足迹</span>
      <span v-if="!edit" class="batch" @click="showEdit">批量删除</span>
      <div v-else class="saveList">
        <el-checkbox v-model="selectAll" @change="changeChecked" :true-label='1' :false-label='0'>全选</el-checkbox>
        <span class="delete" @click="deleteFun">删除</span>
        <span class="save" @click="saveList">保存</span>
      </div>
    </div>
    <div class="list sub-main" v-if="flag" v-loading="loading">
      <div class="recordsList">
        <div class="listBox">
          <div class="recordsItem" v-for="(item, index) of recordList" :key="index"
            :class="{ selected: item.selected === 1, edit: edit }" @click="select(index)">
            <div class="mc" v-if="edit"></div>
            <div class="imgBox">
              <img :src="$api.BASEURL + item.image" alt="">
            </div>
            <div class="info">
              <h3 class="overflow">{{ item.storeName }}</h3>
              <span class="price">¥{{ item.price }}</span>
            </div>
            <div class="btnBox">
              <span @click="delFootprint(item)">删除足迹</span>
              <span @click="toProductDetail(item)">查看详情</span>
            </div>
          </div>
          <div class="clearfix"></div>
        </div>
      </div>
    </div>
    <div class="nothing sub-main" v-else>
      <img src="../../../../static/image/nothing@2x.png" alt="">
      <p class="fs20 font-color-999">你还没有浏览记录～</p>
      <router-link to="/">
        <el-button>去首页看看</el-button>
      </router-link>
    </div>
  </div>
</template>



<style lang="scss" scoped>
.records {
  border: 1px solid #E5E5E5;

  .recordsTit {
    display: flex;
    padding: 0 25px;
    border-bottom: 1px solid #F5F5F5;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;

    span {
      display: block;
      height: 60px;
      line-height: 60px;
    }

    span:first-child {
      color: $mainColor;
      font-size: 14px;
      border-bottom: 2px solid $mainColor;
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

    .saveList {
      display: flex;
      align-items: center;

      span {
        margin-left: 50px;
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
  }

  .list {
    padding: 0 20px 20px 20px;

    .recordsList {
      margin-top: 20px;

      .topTime {
        color: #333333;
        font-size: 22px;
        margin-bottom: 30px;
        font-weight: bold;
      }

      .listBox {
        .recordsItem {
          width: 186px;
          float: left;
          margin: 0 18px 20px 0;
          position: relative;

          .imgBox {
            width: 186px;
            height: 186px;
            border: 1px solid #E5E5E5;
            box-sizing: border-box;

            img {
              width: 100%;
              height: 186px;
            }
          }

          .info {
            border: 1px solid #E5E5E5;
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
        }

        .recordsItem:nth-child(5n) {
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
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0;
  }
}
</style>
