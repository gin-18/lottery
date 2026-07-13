export const routes = [
  {
    path: '/',
    name: 'Home',
    meta: { title: '快乐8研究所 - 福彩快乐8开奖数据分析与奖金计算' },
    component: () => import('@/views/home/Home.vue'),
  },
  {
    path: '/results',
    name: 'Results',
    meta: { title: '开奖结果' },
    component: () => import('@/views/result/Results.vue'),
  },
  {
    path: '/number',
    name: 'Number',
    meta: { title: '号码分析' },
    component: () => import('@/views/number-statistics/NumberStatistics.vue'),
  },
  {
    path: '/interval',
    name: 'Interval',
    meta: { title: '区间分析' },
    component: () =>
      import('@/views/interval-statistics/IntervalStatistics.vue'),
  },
  {
    path: '/tail',
    name: 'Tail',
    meta: { title: '尾数分析' },
    component: () => import('@/views/tail-statistics/TailStatistics.vue'),
  },
  {
    path: '/tools',
    name: 'Tools',
    meta: { title: '计算器' },
    component: () => import('@/views/tool-box/ToolBox.vue'),
  },
  {
    path: '/betting',
    name: 'BettingLedger',
    meta: { title: '投注记录' },
    component: () => import('@/views/betting-ledger/BettingLedger.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    meta: { title: '快乐8研究所' },
    component: () => import('@/views/404.vue'),
  },
]
