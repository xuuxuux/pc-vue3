import layout from '@/views/layout.vue'
import search from '@/views/search/index.vue'
import category from '@/views/category/index.vue'
import index from '@/views/home/HomeIndex.vue'
import custom from '@/views/custom/index.vue'
import login from '@/views/login/LoginPage.vue'
import orderDetail from '@/views/orderDetail/index.vue'
import shoppingTrolley from '@/views/shopping-trolley/index.vue'
import productDetail from '@/views/product/productDetail.vue'
import placeOrder from '@/views/placeOrder/index.vue'
import evaluate from '@/views/evaluate/index.vue'
// 用户中心中心
import userCenter from '@/views/userCenter/userCenter.vue'
import recharge from '@/views/userCenter/recharge/recharge.vue'
import myOrder from '@/views/userCenter/myOrder/myOrder.vue'
import signingAddress from '@/views/userCenter/signingAddress/signingAddress.vue'
import userInfo from '@/views/userCenter/userInfo/userInfo.vue'
import browseRecords from '@/views/userCenter/browseRecords/browseRecords.vue'
import favorites from '@/views/userCenter/favorites/favorites.vue'
import Cookies from 'js-cookie'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'LayoutPage',
      component: layout,
      redirect: { name: 'HomeIndex' },
      children: [
        // 首页
        {
          path: '/index',
          name: 'HomeIndex',
          component: index,
          meta: {
            logoText: '',
            searchVisible: true
          }
        },
        // 自定义页面
        {
          path: '/custom',
          name: 'CustomIndex',
          component: custom,
          meta: {
            logoText: '',
            searchVisible: true
          }
        },
        // 用户中心
        {
          path: '/userCenter',
          name: 'userCenter',
          component: userCenter,
          meta: {
            logoText: '',
            searchVisible: false
          },
          children: [
            {
              path: '/recharge',
              name: 'RechargePage',
              component: recharge,
              meta: {
                logoText: '',
                searchVisible: false
              }
            },
            {
              path: '/myOrder',
              name: 'myOrderPage',
              component: myOrder,
              meta: {
                logoText: '',
                searchVisible: false
              }
            },
            {
              path: '/signingAddress',
              name: 'signingAddress',
              component: signingAddress,
              meta: {
                logoText: '',
                searchVisible: false
              }
            },
            {
              path: '/userInfo',
              name: 'userInfo',
              component: userInfo,
              meta: {
                logoText: '',
                searchVisible: false
              }
            },
            {
              path: '/browseRecords',
              name: 'browseRecords',
              component: browseRecords,
              meta: {
                logoText: '',
                searchVisible: false
              }
            },
            {
              path: '/favorites',
              name: 'FavoritesPage',
              component: favorites,
              meta: {
                logoText: '',
                searchVisible: false
              }
            }
          ]
        },
        // 搜索
        {
          path: '/search',
          name: 'SearchIndex',
          component: search,
          meta: {
            logoText: '',
            searchVisible: true
          }
        },
        // 分类页面
        {
          path: '/category',
          name: 'CategoryIndex',
          component: category,
          meta: {
            logoText: '',
            searchVisible: true
          }
        },
        // 购物车
        {
          path: '/shopping-trolley',
          name: 'shoppingTrolley',
          component: shoppingTrolley,
          meta: {
            logoText: '',
            searchVisible: true
          }

        },
        // 订单详情
        {
          path: '/orderDetail',
          name: 'OrderDetailIndex',
          component: orderDetail,
          meta: {
            logoText: '',
            searchVisible: true
          }

        },
        // 评价
        {
          path: '/evaluate',
          name: 'EvaluateIndex',
          component: evaluate,
          meta: {
            logoText: '',
            searchVisible: true
          }
        },
        // 商品详情
        {
          path: '/productDetail',
          name: 'ProductDetail',
          component: productDetail,
          meta: {
            logoText: '',
            searchVisible: true
          }
        },
        // 下单页面
        {
          path: '/placeOrder',
          name: 'placeOrder',
          component: placeOrder,
          meta: {
            logoText: '',
            searchVisible: true
          }
        }
      ]
    },
    // 登录
    {
      path: '/login',
      name: 'LoginPage',
      component: login
    },
    //测试
    {
      path: '/test',
      component: () => import('@/views/TestPage/TestPage.vue')
    }
  ]
})
router.beforeEach((to, from, next) => {
  // cookie没有值就跳到登陆页
  // const token = Cookies.get('token')
  // // 如果没有token且目标路由不是登录页，则重定向到登录页
  // if (!token && to.name !== 'LoginPage') {
  //   next({ name: 'LoginPage' })
  // } else {
  next()
  // }
})
export default router
