import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    alias: '/welcome',
    name: 'welcome',
    component: () => import(/* webpackChunkName: "about" */ '../views/WelcomeView.vue')
  },
  {
    path: '/order',
    name: 'order',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/history',
    name: 'history',
    component: () => import(/* webpackChunkName: "about" */ '../views/HistoryView.vue')
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import(/* webpackChunkName: "about" */ '../views/SettingsView.vue')
  },
  {
    path: '/donate',
    name: 'donate',
    component: () => import(/* webpackChunkName: "about" */ '../views/DonateView.vue')
  },
  {
    path: '/promote',
    name: 'promote',
    component: () => import(/* webpackChunkName: "about" */ '../views/PromoteView.vue')
  },
  {
    path: '/rules',
    name: 'rules',
    component: () => import(/* webpackChunkName: "about" */ '../views/RulesView.vue')
  },
  {
    path: '/repeat',
    name: 'repeatOrder',
    component: () => import(/* webpackChunkName: "about" */ '../views/RepeatView.vue')
  },
  {
    path: '/test-order',
    name: 'testOrder',
    component: () => import(/* webpackChunkName: "about" */ '../views/TestView.vue')
  },
  {
    path: '/ios',
    name: 'apps',
    component: () => import(/* webpackChunkName: "about" */ '../views/AppsView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
