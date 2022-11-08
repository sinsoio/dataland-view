import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const routes = [
  {
    path: '/',
    name: 'layout',
    redirect: '/dashboard',
    component: () => import('@/layout'),
    children: [
      {
        path: '/dashboard',
        name: 'Dashboard',
        meta: {
          title: 'dashboard',
          icon: 'home',
          index: 'dashboard'
        },
        component: () => import('@/views/dashboard')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login.vue')
  },
  {
    path: '/404',
    component: () => import('@/views/404.vue')
  },
  {
    path: '*',
    redirect: '/404'
  }
]

export default new Router({
  mode: 'history',
  base: '/',
  scrollBehavior: () => ({
    y: 0
  }),
  routes
})
