<script setup>
import { ref, onMounted } from 'vue'
import ProductList from '@/components/base/ProductList.vue'
import LoadingToast from '@/components/canvasShow/components/LoadingToast.vue'
import { sendReq } from '@/config/mixin'
import api from '@/api'
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
//组件名称
defineOptions({
  name: 'HomeIndex',
})
//路由
const router = useRouter();
//数据
const categoryList = ref([])
const indexBanner = ref([])
const BastList = ref([])
const LikeList = ref([])
//获取组件
const LoadingToastRef = ref(null)
//组件挂载完成后
onMounted(() => {
  getCategory()
  getIndexBanner()
  getIndexBast()
  getIndexLike()
})
// 获取分类
const getCategory = () => {
  LoadingToastRef.value.setCanvasLoading(true)
  let params = {
    url: api.getCategory,
    method: 'GET'
  }
  sendReq(params, (res) => {
    if (res.status === 200) {
      LoadingToastRef.value.setCanvasLoading(false)
      categoryList.value = res.data
    } else {
      ElMessage({
        message: res.msg,
        type: 'warning'
      })
    }
  })

}
// 获取首页轮播图
const getIndexBanner = () => {
  let params = {
    url: api.getIndexBanner,
    method: 'GET'
  }
  sendReq(params, (res) => {
    if (res.status === 200) {
      indexBanner.value = res.data
      console.log(indexBanner.value);
    } else {
      ElMessage({
        message: res.msg,
        type: 'warning'
      })
    }
  })
}
// 获取首页精品推荐
const getIndexBast = () => {
  let params = {
    url: api.getIndexBast,
    method: 'GET'
  }
  sendReq(params, (res) => {
    if (res.status === 200) {
      BastList.value = res.data.splice(0, 4)
    } else {
      ElMessage({
        message: res.msg,
        type: 'warning'
      })
    }
  })
}
// 获取首页猜你喜欢
const getIndexLike = () => {
  let params = {
    url: api.getIndexLike,
    method: 'GET'
  }
  sendReq(params, (res) => {
    if (res.status === 200) {
      LikeList.value = res.data.splice(0, 4)
    } else {
      ElMessage({
        message: res.msg,
        type: 'warning'
      })
    }
  })
}
// 跳转分类
const jumpCategory = (item) => {
  router.replace({ name: 'CategoryIndex', query: { classifyData: JSON.stringify(item) } })
}
</script>



<template>
  <div class="home">
    <!-- 轮播图 -->
    <div class="block">
      <div class="product-category-menu">
        <ul>
          <li v-for="(item, index) in categoryList" :key="index">
            <a href="javascript:;">{{ item.cateName }}</a>
            <p>
              <a href="javascript:;" v-for="(i, iindex) in item.children" :key="iindex" @click="jumpCategory(i)">{{
                i.cateName }}</a>
            </p>
          </li>
        </ul>
      </div>
      <div class="banner">
        <el-carousel height="470px">
          <el-carousel-item>
            <img style="width: 1000px;height: 470px" src="@/assets/images/banner1.png" />
          </el-carousel-item>
          <el-carousel-item>
            <img style="width: 1000px;height: 470px" src="@/assets/images/banner2.png" />
          </el-carousel-item>
        </el-carousel>
      </div>
    </div>
    <!-- 轮播图END -->
    <div class="main-box">
      <div class="main">
        <div class="products">
          <div class="box-hd">
            <div class="title">精品推荐</div>
            <div class="more">
            </div>
          </div>
          <div class="box-bd">
            <div class="list">
              <ProductList :productList='BastList'></ProductList>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="main-box">
      <div class="main">
        <div class="products">
          <div class="box-hd">
            <div class="title">猜你喜欢</div>
            <div class="more">
            </div>
          </div>
          <div class="box-bd">
            <div class="list">
              <ProductList :productList='LikeList'></ProductList>
            </div>
          </div>
        </div>
      </div>
    </div>
    <loading-toast ref="LoadingToastRef"></loading-toast>
  </div>
</template>


<style scoped>
/*
 * @Description: 首页css样式
 */
.home {
  margin: 0 auto;
  width: 1250px;
}

/* 轮播图CSS */
.block {
  width: 100%;
  height: 470px;
  margin-bottom: 30px;
}

.banner {
  width: 1000px;
  flex: 1;
  float: right;
}

/* 轮播图CSS END */

.product-category-menu {
  width: 238px;
  height: 470px;
  background-color: #2d2d31;
  color: #fff;
  margin-right: 10px;
  float: left;
}

.product-category-menu ul {
  padding: 3px 5px;
  margin-top: 16px;
}

.product-category-menu ul li {
  padding: 0 30px;
  list-style: none;
}

.product-category-menu ul li a {
  line-height: 26px;
  color: #ffffff;
  font-size: 16px;
  transition: color 0.3s;
  text-decoration: none;
}

.product-category-menu ul li p {
  padding-left: 18px;
  margin: 16px 0;
}

.product-category-menu ul li p a {
  line-height: 20px;
  color: #bbbbbb;
  font-size: 14px;
  margin-right: 10px;
  white-space: nowrap;
  transition: color 0.3s;
  text-decoration: none;
}

.product-category-menu ul li p a:hover {
  color: #FF7800;
}


.box-hd {
  height: 58px;
  margin: 20px 0 0 0;
}

.box-hd .title {
  float: left;
  font-size: 30px;
  font-weight: 600;
  line-height: 58px;
  color: #333;
}

.box-hd .more {
  float: right;
}

.box-hd .more a {
  font-size: 16px;
  line-height: 58px;
  color: #424242;
}

.box-hd .more a:hover {
  color: #ff6700;
}

.box-bd {
  height: 500px;
}

.box-bd .list {
  min-height: 500px;
  padding: 20px 40px;
}
</style>
