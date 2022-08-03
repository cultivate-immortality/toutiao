import Vue from 'vue'
import VueRouter from 'vue-router'
import { getToken } from '@/utils/token'
Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/layout' },
  // 登录页缓不缓存都一样
  {
    path: '/login',
    component: () => import('@/views/login')
    /*
    // 路由独享守卫
    beforeEnter: (to, from, next) => {
      if (getToken()?.length > 0) {
        next('/layout/home')
      } else {
        next()
      }
    }
    */
  },
  // layout可以缓存
  {
    path: '/layout',
    component: () => import('@/views/layout'),
    redirect: '/layout/home',
    children: [
      {
        path: 'home',
        component: () => import('@/views/home'),
        // 保存首页离开时,滚动条位置
        meta: { scrorllT: 0 }
      },
      { path: 'user', component: () => import('@/views/user') }
    ]
  },
  // search页不需要缓存
  { path: '/search', component: () => import('@/views/search') },
  // 搜索结果页不需要缓存
  {
    path: '/serach-result/:kw',
    name: 'SearchResult',
    component: () => import('@/views/search/search-result')
  },
  // 文章详情页不需要缓存
  {
    path: '/article-detail/:id',
    name: 'ArticleDetail',
    component: () => import('@/views/article-detail')
  },

  // 用户编辑页不需要缓存
  { path: '/user-edit', component: () => import('@/views/user/user-edit') },

  // 小思机器人可以不缓存
  { path: '/chat', component: () => import('@/views/chat') }
]

const router = new VueRouter({ routes })

router.beforeEach((to, from, next) => {
  // 需求: 如果已经登录了,不要让用户切换到登录页面,让用户跳到首页
  if (to.path === '/login' && getToken()?.length > 0) {
    // 这里给一个明确的地址,防止一些小错误
    next('/layout/home')
    // next(false) 有一些小问题,看vue文档
  } else {
    next()
  }
})

export default router
