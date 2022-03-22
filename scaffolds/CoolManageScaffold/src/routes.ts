import BasicLayout from '@/layouts/BasicLayout';
import Home from '@/pages/Home';
import NotFound from '@/pages/NotFound';
import Record from './layouts/Record';

const routerConfig = [
  {
    path: '/',
    component: BasicLayout,
    children: [
      {
        path: '/record',
        component: Record,
        children: [
          {
            path: '/:id',
            component: Home,
          },
        ],
      },
      {
        path: '/',
        redirect: '/record',
      },
      {
        component: NotFound,
      },
    ],
  },
];

export default routerConfig;
