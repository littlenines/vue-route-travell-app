import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import sourceData from "@/data.json";

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/protected',
    name: 'protected',
    component: () => import('@/views/ProtectedView.vue'),
    meta: { requiresAuth: true, }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue')
  },
  {
    path: '/invoices',
    name: 'invoices',
    component: () => import('@/views/InvoicesView.vue'),
    meta: { requiresAuth: true, }
  },
  {
    path: '/destination/:id/:slug',
    name: 'destination.show',
    component: () => import(/* webpackChunkName: "destination" */ '../views/DestinationShowView.vue'),
    props: route => ({ ...route.params, id: parseInt(route.params.id) }),
    beforeEnter(to, from) {
      const exists = sourceData.destinations.find(destination => destination.id === parseInt(to.params.id))
      if (!exists) return {
        name: 'NotFound',
        // allows keeping the URL while rendering a different page
        params: { pathMatch: to.path.split('/').slice(1) },
        query: to.query,
        hash: to.hash,
      }
    },
    children: [{
      path: ':experienceSlug',
      name: 'experience.show',
      component: () => import(/* webpackChunkName: "experience" */ '../views/ExperienceShowView.vue'),
      props: route => ({ ...route.params, id: parseInt(route.params.id) })
    }]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import(/* webpackChunkName: "notfound" */ '../views/NotFoundView.vue')
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || new Promise(resolve => { setTimeout(() => resolve({ top: 0, behavior: 'smooth' }), 300) })
  }
})

router.beforeEach((to, from) => {
  if (to.meta.requiresAuth && !window.user) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
})

export default router
