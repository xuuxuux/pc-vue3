<script setup>
import api from '@/api'
import { sendReq } from '@/config/mixin'
import { onMounted } from 'vue'
defineOptions({
  name: 'DemoIndex'
})
onMounted(() => {
  getData()
})

//  ...mapMutations({
//    setMseId: 'SET_MSEID'
//  }),
// 获取左侧告警
const getData = () => {
  let params = {
    url: api.login,
    method: 'POST',
    data: {
      username: 'username',
      password: 'password',
      code: 'code'
    }
  }
  sendReq(params, (res) => {
    if (res.code === 0) {
      console.log(res)
    }
  })
}









// export default {

//   methods: {

//     // 获取左侧告警
//     getData() {
//       let params = {
//         url: api.login,
//         method: 'POST',
//         data: {
//           username: 'username',
//           password: 'password',
//           code: 'code'
//         }
//       }
//       this.sendReq(params, (res) => {
//         if (res.code === 0) {
//         }
//       })
//     }
//   },
//   beforeDestroy() {

//   },
//   computed: {
//     ...mapGetters([
//       'mseId'
//     ])
//   },
//   watch: {
//     mseId: function (newVal) {

//     }
//   }
// }
</script>

<template>
  <div class="demo">hello!<i class="iconfont icon-xuanzhongjiaobiao"></i></div>
</template>


<style lang="scss" scoped></style>
