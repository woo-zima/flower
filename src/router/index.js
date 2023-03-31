import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'main',
    component: () => import('@/views/Main.vue'),
  },
  {
    path: '/upload',
    name: 'upload',
    component: () => import('@/views/Upload.vue'),
  },
  {
    path: '/map',
    name: 'map',
    component: () => import('@/components/Map.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  let token = localStorage.getItem('userInfo');
  if (to.meta.Auth) {
    if (token) {
      next();
    } else {
      next({
        path: '/',
      });
      ElMessage({
        showClose: true,
        message: '你未登录!',
        type: 'error',
      });
    }
  } else {
    next();
  }
});

export default router;
