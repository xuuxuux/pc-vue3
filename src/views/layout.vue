<script setup>
import Footer from '@/components/base/footer.vue'
import SiteNav from '@/components/base/siteNav.vue'
import CereHeader from '@/components/canvasShow/cereshop/pc/header.vue'

defineOptions({
  name: 'LayoutPage'
})
</script>

<template>
  <div class="layout">
    <site-nav></site-nav>
    <cere-header></cere-header>
    <div class="main">
      <router-view></router-view>
    </div>
    <Footer></Footer>
  </div>
</template>

<style scoped lang='scss'>
.layout {
  height: 100%;
  overflow: auto;
  display: flex;
  flex-direction: column;

  .main {
    flex: 1;
  }
}
</style>
