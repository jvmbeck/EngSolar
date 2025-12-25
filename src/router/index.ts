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
    const userRole = userStore.user?.role;
    const requiresAuth = to.meta.requiresAuth;
    const requiredRole = to.meta.requiredRole as string | undefined;

    // If route requires authentication
    if (requiresAuth) {
      if (!isAuthenticated) {
        // Not authenticated, redirect to login
        next('/auth/login');
        return;
      }

      // Check role-based access
      if (requiredRole && userRole !== requiredRole) {
        // User doesn't have the required role, redirect to their dashboard
        const defaultPath = userRole === 'admin' ? '/admin' : '/client';
        next(defaultPath);
        return;
      }
    }

    // If user is authenticated and tries to access auth pages, redirect to dashboard
    if (isAuthenticated && (to.path === '/auth/login' || to.path === '/auth/register')) {
      const defaultPath = userRole === 'admin' ? '/admin' : '/client';
      next(defaultPath);
      return;
    }

    // If user is not authenticated and tries to access root, redirect to login
    if (!isAuthenticated && to.path === '/') {
      next('/auth/login');
      return;
    }

    next();
  });

  return Router;
});
