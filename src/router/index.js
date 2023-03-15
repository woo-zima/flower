import { createRouter, createWebHistory } from 'vue-router';

const routes = [];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// router.beforeEach(async (to, from, next) => {
//   let token = localStorage.getItem('userInfo');
//   if (to.meta.Auth) {
//     if (token) {
//       next();
//     } else {
//       next({
//         path: '/',
//       });
//       ElMessage({
//         showClose: true,
//         message: '你未登录!',
//         type: 'error',
//       });
//     }
//   } else {
//     next();
//   }
// });

export default router;
