<script setup>
import { computed, watch, defineExpose, onUnmounted } from 'vue'
import { useComponentsStore } from '../config/mixin/store'
import { ElLoading } from 'element-plus'

defineOptions({
  name: 'LoadingToast'
})

const ComponentsStore = useComponentsStore()
const loadNum = computed(() => ComponentsStore.loadNum)

// 创建加载实例
let loadingInstance = null

watch(loadNum, (newVal) => {
  if (newVal === 0) {
    // 关闭加载
    if (loadingInstance) {
      loadingInstance.close()
      loadingInstance = null
    }
  } else if (!loadingInstance) {
    // 显示加载
    loadingInstance = ElLoading.service({
      fullscreen: true,
      lock: true,
      text: '加载中',
      background: 'rgba(255, 255, 255, 0.9)'
    })
  }
})

// 组件卸载时关闭加载
onUnmounted(() => {
  if (loadingInstance) {
    loadingInstance.close()
    loadingInstance = null
  }
})

// 对外暴露加载控制方法
const setCanvasLoading = (status) => {
  if (status && !loadingInstance) {
    loadingInstance = ElLoading.service({
      fullscreen: true,
      lock: true,
      text: '加载中',
      background: 'rgba(255, 255, 255, 1)'
    })
  } else if (!status && loadingInstance) {
    loadingInstance.close()
    loadingInstance = null
  }
}

defineExpose({
  setCanvasLoading
})
</script>


<template>
  <div></div>
</template>



<style lang="scss" scoped>
/* 不需要额外样式，由 Element Plus 加载组件提供 */
</style>
