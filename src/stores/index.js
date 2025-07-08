import { createPinia } from 'pinia'
import persist from 'pinia-plugin-persistedstate'

// 创建pinia实例
const pinia = createPinia()
// 持久化
pinia.use(persist)

export default pinia

// 导出所有store
export * from './modules/useUserStore'
