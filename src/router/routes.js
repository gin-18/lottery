export const routes = [
  {
    path: '/',
    name: 'Home',
    meta: { title: '快乐8研究所' },
    component: () => import('@/views/Home.vue'),
  },
  {
    path: '/results',
    name: 'Results',
    meta: { title: '开奖结果' },
    component: () => import('@/views/Results.vue'),
  },
  {
    path: '/number',
    name: 'Number',
    meta: { title: '号码分析' },
    component: () => import('@/views/NumberAnalyze.vue'),
  },
  {
    path: '/interval',
    name: 'Interval',
    meta: { title: '区间分析' },
    component: () => import('@/views/IntervalAnalyze.vue'),
  },
  {
    path: '/tail',
    name: 'tail',
    meta: { title: '尾数分析' },
    component: () => import('@/views/TailAnalyze.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    meta: { title: '快乐8研究所' },
    component: () => import('@/views/404.vue'),
  },
]
