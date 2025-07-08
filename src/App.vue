<script setup>
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import { ref, provide, nextTick } from 'vue'

const isRouterAlive = ref(true)
const reload = () => {
  isRouterAlive.value = false
  nextTick(() => {
    isRouterAlive.value = true
  })
}

provide('reload', reload)
</script>

<template>
  <el-config-provider :locale="zhCn">
    <router-view v-if="isRouterAlive"></router-view>
  </el-config-provider>
</template>
<style scoped></style>
