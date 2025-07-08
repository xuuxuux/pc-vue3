<script setup>
import { ref, onMounted } from 'vue'
import componentMap from './componentMap'
import api from './config/api'
import { sendReq } from './config/mixin'
// import Cookies from 'js-cookie'
import { useComponentsStore } from './config/mixin/store'
import LoadingToast from './components/LoadingToast.vue'
//组件名称
defineOptions({
  name: 'canvasPage'
})
// 获取 store
const ComponentsStore = useComponentsStore()
// terminal: 4, // 画布设备 1 小程序，2 H5，3 App 4 电脑
// typeId: 3, // 画布类型 1 平台画布，2 自定义页面，3 商家店铺装修
// shopId: 0, // 店铺id
//属性
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
  canvasId: {
    type: Number,
    default: 0
  }
})
const componentsData = ref([])
const loadingToast = ref(null)
onMounted(() => {
  canvasGet()
})

// 读取画布
const canvasGet = () => {
  loadingToast.value.setCanvasLoading(true)
  var apiUrl = api.getCanvas + '?terminal=' + props.terminal + '&type=' + props.typeId
  if (props.shopId) {
    apiUrl += '&shopId=' + props.shopId
  }
  if (props.canvasId) {
    apiUrl += '&canvasId=' + props.canvasId
  }
  let params = {
    url: apiUrl,
    method: 'GET'
  }
  sendReq(params, (res) => {
    loadingToast.value.setCanvasLoading(false)
    if (JSON.stringify(res.data) !== '{}') {
      // props.canvasId = res.data.canvasId
      var componentsData = JSON.parse(res.data.json)
      for (let i = 0; i < componentsData.length; i++) {
        // 商品列表
        if (componentsData[i].type === 'productList') {
          loadingToast.value.setCanvasLoading(true)
          ComponentsStore.loadNumAdd()
          if (componentsData[i].componentContent.productData.sourceType === '1') {
            sendReq({
              url: `${api.getProducts}?page=1&pageSize=99&ids=${componentsData[i].componentContent.productData.productIdList}`,
              method: 'GET'
            }, (proRes) => {
              ComponentsStore.loadNumReduce()
              componentsData[i].componentContent.productData.imgTextData = proRes.data.list
            })
          } else if (componentsData[i].componentContent.productData.sourceType === '2') {
            sendReq({
              url: `${api.getProducts}?page=1&pageSize=99&classifyId=${componentsData[i].componentContent.productData.categoryId}`,
              method: 'GET'
            }, (proRes) => {
              ComponentsStore.loadNumReduce()
              componentsData[i].componentContent.productData.imgTextData = proRes.data.list
            })
          }
        } else if (componentsData[i].type === 'coupon' || componentsData[i].type ===
          'groupList' || componentsData[i].type === 'spikeList' || componentsData[i].type ===
          'discountList') {
          loadingToast.value.setCanvasLoading(true)
          ComponentsStore.loadNumAdd()
        } else if (componentsData[i].type === 'shopHeader' && props.terminal === 4) {
          if (componentsData[i].componentContent.category && componentsData[i].componentContent.category.length !== 0) {
            var categoryArr = componentsData[i].componentContent.category
            sendReq({
              url: `${api.getClassify}`,
              method: 'GET'
            }, (proRes) => {
              componentsData[i].componentContent.category = proRes.data.filter((item) => {
                for (let i = 0; i < categoryArr.length; i++) {
                  if (categoryArr[i].id === item.id) {
                    return true
                  }
                }
              })
            })
          }
        }
      }
      //componentsData = componentsData.slice(0,24)
      componentsData.value = componentsData
      //_this.componentsData = _this.componentsData.slice(0,14)
    } else {
      // _this.canvasId = ''
    }
  })
}
</script>

<template>
  <div class="layout">
    <div class="list-group-item" v-for="(item, index) in componentsData" :key="index">
      <component :is="componentMap[terminal - 1].get(item.type)" :componentContent="item.componentContent"
        :terminal="terminal" :typeId="typeId" :shopId="shopId"></component>
    </div>
    <LoadingToast ref="loadingToast" />
  </div>
</template>


<style lang="scss" scoped>
.hom-layout {
  background-color: #f5f5f5;
}
</style>

<style lang="scss">
.warp {
  width: 690px;
  margin: 0 auto;
  max-width: 100%;

  &.terminal4 {
    width: 1250px;
    max-width: 96%;
  }
}

.flex-box {
  display: flex;
}
</style>
