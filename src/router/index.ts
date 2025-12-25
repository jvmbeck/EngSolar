import { defineRouter } from '#q-app/wrappers';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';
import routes from './routes';
import { useUserStore } from 'src/stores/user-store';

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default defineRouter(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  Router.beforeEach((to, from, next) => {
    const userStore = useUserStore();

    // Wait for auth to finish checking
    if (!userStore.authReady) {
      next();
      return;
    }

    const isAuthenticated = userStore.isAuthenticated;
    const requiresAuth = to.meta.requiresAuth;

    // User is authenticated
    if (isAuthenticated) {
      // Redirect from login/register to index
      if (to.path === '/login' || to.path === '/register') {
        next('/');
      } else {
        next();
      }
    } else {
      // User is not authenticated
      if (requiresAuth) {
        // Redirect to login if trying to access protected route
        next('/login');
      } else {
        next();
      }
    }
  });

  return Router;
});
