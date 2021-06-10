export default {
  routes: [
    {
      exact: true,
      path: '/',
      component: '../view/index-page',
      icon: 'github',
      menu: { name: '首页' },
      // access: 'canReadPageA', // 权限定义返回值的某个 key
    },
    { exact: true, path: '/detail', component: '../view/detail-page' },
    { exact: true, path: '/index', component: '@/pages/index' },
  ],
};
