import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  // Auth routes (login, register)
  {
    path: '/auth',
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      {
        path: 'login',
        component: () => import('pages/auth/LogInUser.vue'),
        meta: { requiresAuth: false },
      },
      {
        path: 'register',
        component: () => import('pages/auth/RegisterUser.vue'),
        meta: { requiresAuth: false },
      },
    ],
  },

  // Client routes
  {
    path: '/client',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: true, requiredRole: 'client' },
    children: [
      {
        path: '',
        component: () => import('pages/IndexPage.vue'),
        meta: { requiresAuth: true, requiredRole: 'client' },
      },
      // Add more client-only pages here
    ],
  },

  // Admin routes
  {
    path: '/admin',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: true, requiredRole: 'admin' },
    children: [
      {
        path: '',
        component: () => import('pages/IndexPage.vue'),
        meta: { requiresAuth: true, requiredRole: 'admin' },
      },
      // Add more admin-only pages here
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
