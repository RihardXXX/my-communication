import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import TheHeader from '../views/TheHeader.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/header/all-rooms',
  },
  {
    path: '/header/',
    component: TheHeader,
    children: [
      {
        path: '',
        redirect: '/header/all-rooms',
      },
      {
        path: 'my-profile',
        name: 'my-profile',
        component: () => import('@/views/MyProfile.vue'),
      },
      {
        path: 'all-rooms',
        name: 'all-rooms',
        component: () => import('@/views/AllRooms.vue'),
      },
      {
        path: 'create-room',
        name: 'create-room',
        component: () => import('@/views/CreateRoom.vue'),
      },
      {
        path: 'the-invitations',
        name: 'the-invitations',
        component: () => import('@/views/TheInvitations.vue'),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
