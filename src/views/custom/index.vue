<script setup>
import { ref } from 'vue'
import canvasShowPage from '@/components/canvasShow/canvasShowPage.vue'
import { useRoute } from 'vue-router'
defineOptions({
  name: 'CustomIndex'
})

const route = useRoute()
const shopId = ref(route.query.shopId)
</script>

<template>
  <canvasShowPage :terminal="4" :typeId="2" :shopId="shopId" />
</template>
