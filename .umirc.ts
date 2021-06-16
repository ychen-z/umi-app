import route from './src/route';
import { defineConfig } from 'umi';
export const menus = [
  {
    path: '/',
    name: 'welcome',
    children: [
      {
        path: '/welcome',
        name: 'one',
        children: [
          {
            path: '/welcome/welcome',
            name: 'two',
            exact: true,
          },
        ],
      },
    ],
  },
  {
    path: '/demo',
    name: 'demo',
  },
];
const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

export default defineConfig({
  antd: {
    compact: true,
  },
  request: {
    dataField: 'data',
  },

  locale: {}, // 国际化
  layout: {
    // 支持任何不需要 dom 的
    // https://procomponents.ant.design/components/layout#prolayout
    name: 'umi-app',
    locale: true,
    contentStyle: { padding: '20px', height: '100vh' },
    layout: 'side',
  },

  nodeModulesTransform: {
    type: 'none',
  },
  dynamicImport: {},
  routes: route.routes,
  fastRefresh: {},
});
