/*
 * 用于组件复用
 * 参考链接 https://cn.vuejs.org/v2/guide/mixins.html#全局混合
 * 混合 (mixins) 是一种分发 Vue 组件中可复用功能的非常灵活的方式。混合对象可以包含任意组件选项。以组件使用混合对象时，所有混合对象的选项将被混入该组件本身的选项。
 */
import { useTool } from './funMixin.js'
import { useRequest } from './sendReqMixin.js'

// 导出请求相关函数
const { sendReq, loading } = useRequest()
export { sendReq, loading }

// 创建导航函数的包装器
export const jumpLink = (...args) => {
  const tools = useTool()
  return tools.jumpLink(...args)
}

export const jumpCategory = (...args) => {
  const tools = useTool()
  return tools.jumpCategory(...args)
}

export const jumpStore = (...args) => {
  const tools = useTool()
  return tools.jumpStore(...args)
}

export const jumpProductDetail = (...args) => {
  const tools = useTool()
  return tools.jumpProductDetail(...args)
}

export const jumpSeckills = (...args) => {
  const tools = useTool()
  return tools.jumpSeckills(...args)
}

export const jumpGroupWorks = (...args) => {
  const tools = useTool()
  return tools.jumpGroupWorks(...args)
}

export const jumpDiscount = (...args) => {
  const tools = useTool()
  return tools.jumpDiscount(...args)
}

export const searchPro = (...args) => {
  const tools = useTool()
  return tools.searchPro(...args)
}

