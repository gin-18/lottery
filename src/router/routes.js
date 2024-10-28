export const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
  },
  {
    path: '/results',
    name: 'Results',
    component: () => import('@/views/Results.vue'),
  },
  {
    path: '/analyze',
    name: 'Analyze',
    component: () => import('@/views/Analyze.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/404.vue'),
  },
]
