import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'main',
    component: () => import('@/views/Main.vue'),
  },
  {
    path: '/nearby',
    name: 'nearby',
    component: () => import('@/views/Nearby.vue'),
  },
  {
    path: '/upload',
    name: 'upload',
    meta: {
      Auth: true,
    },
    component: () => import('@/views/Upload.vue'),
  },
  {
    path: '/des/:fid',
    name: 'des',
    component: () => import('@/views/Des.vue'),
  },
  {
    path: '/info/:uid',
    name: 'info',
    component: () => import('@/views/Info.vue'),
  },
  {
    path: '/searchAll',
    name: 'search',
    component: () => import('@/views/SearchAll.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  // scrollBehavior(to, from, savedPosition) {
  //   console.log(to);
  //   // return 期望滚动到哪个的位置
  //   if (savedPosition) {
  //     return savedPosition;
  //   } else {
  //     return { top: 0 };
  //   }
  // },
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
