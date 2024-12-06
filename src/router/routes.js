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
    path: '/number',
    name: 'Number',
    component: () => import('@/views/NumberAnalyze.vue'),
  },
  {
    path: '/interval',
    name: 'Interval',
    component: () => import('@/views/IntervalAnalyze.vue'),
  },
  {
    path: '/repeat',
    name: 'Repeat',
    component: () => import('@/views/RepeatAnalyze.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/404.vue'),
  },
]
