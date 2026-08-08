import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/HomePage.vue'
import PostDetailPage from '@/pages/PostDetailPage.vue'
import AboutPage from '@/pages/AboutPage.vue'

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior() {
    return { top: 0, behavior: 'smooth' }
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
      meta: { title: '首页' }
    },
    {
      path: '/post/:id',
      name: 'post',
      component: PostDetailPage,
      meta: { title: '文章' }
    },
    {
      path: '/about',
      name: 'about',
      component: AboutPage,
      meta: { title: '关于我' }
    }
  ]
})

router.afterEach((to) => {
  document.title = to.name === 'home' ? '雪&snow · 个人博客' : `${to.meta.title} · 雪&snow`
})

export default router
