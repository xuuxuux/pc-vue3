import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/el-loading.css'
import App from '@/App.vue'
import router from '@/router'
import pinia from '@/stores'
import '@/styles/index.scss' // 导入全局样式
import '@/assets/font_icon/iconfont.css' // 导入图标字体
import './../theme/index.css'
import 'normalize.css' // 重置样式表
import qs from 'qs'
import api from '@/api'

const app = createApp(App)

// 添加全局路由后置钩子
router.afterEach(() => window.scrollTo(0, 0))

app.use(ElementPlus)
app.use(pinia) // 初始化 Pinia
app.use(router) // 确保路由在应用挂载之前被正确初始化

// 注册全局属性
app.config.globalProperties.$qs = qs
app.config.globalProperties.$api = api

// 注册全局指令
app.directive('throttle', {
  mounted(el, binding) {
    el.addEventListener('click', () => {
      el.style.pointerEvents = 'none'
      if (!el.disabled) {
        setTimeout(() => {
          el.style.pointerEvents = 'auto'
        }, binding.value || 2000)
      }
    })
  }
})

// 注册全局方法
app.config.globalProperties.$openLoading = function () {
  const loading = this.$loading({
    lock: true,
    target: '.sub-main',
    background: '#ffffff',
    customClass: 'mask'
  })
  setTimeout(() => loading.close(), 5000)
  return loading
}

app.mount('#app')
