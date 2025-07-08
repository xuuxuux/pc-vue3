<script setup>
import { sendReq } from '@/config/mixin'
import { useUserStore } from '@/stores/modules/useUserStore'
import api from '@/api'
import { onMounted, computed } from 'vue'
import axios from 'axios'

// const userStore = useUserStore()
const test = async () => {
  axios.get("http://localhost:8080/list").then(res => {
    console.log(res.data);
  })
}
// test()
// const getTrolleyList = async () => {
//   const params = {
//     url: api.getTrolleyList,
//     method: 'GET'
//   }
//   sendReq(params, res => {
//     const d = res.data.valid
//     console.log(d);
//     userStore.setShoppingCart(d)
//     userStore.setCartNumber(d.length)
//   })
// }

// const userInfo = computed(() => userStore.getUserInfo)
// // 设置用户信息
// userStore.setUserInfo('SET_USERINFO')

onMounted(() => {
  // console.log(userInfo);
  // getTrolleyList()
  test()
})
</script>

<template>
  <div>

  </div>
</template>
