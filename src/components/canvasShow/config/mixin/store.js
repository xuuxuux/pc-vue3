import { defineStore } from 'pinia'

export const useComponentsStore = defineStore('eshop-components', {
  state: () => ({
    loadNum: 0, // 要请求的画布组伯数量
  }),
  actions: {
    loadNumAdd: (state) => state.loadNum++,
    loadNumReduce: (state) => state.loadNum--
  }
})



