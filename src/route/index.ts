export default {
  routes: [
    {
      exact: true,
      path: '/',
      component: '../view/index-page',
      icon: 'github',
      menu: { name: '首页' },
    },
    { exact: true, path: '/detail', component: '../view/detail-page' },
    { exact: true, path: '/index', component: '@/pages/index' },
  ],
};
