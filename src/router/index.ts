import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import TheHeader from '@/views/TheHeader.vue';
import StartPage from '@/views/StartPage.vue';
import { useAuthorizationStore } from '@/store/authorization';

const routes: Array<RouteRecordRaw> = [
    {
        path: '',
        name: '',
        redirect: () => {
            const authorizationStore = useAuthorizationStore();
            if (authorizationStore.isLoggedIn) {
                return '/header/all-rooms';
            } else {
                return '/start/registration';
            }
        },
    },
    {
        path: '/header/',
        name: 'header',
        component: TheHeader,
        beforeEnter: () => {
            const authorizationStore = useAuthorizationStore();
            // если не авторизован, то бросать на страницу авторизации
            if (!authorizationStore.isLoggedIn) {
                return '/start/login';
            }
        },
        children: [
            {
                path: '',
                name: 'header-all-rooms',
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
    {
        path: '/start/',
        name: 'start',
        component: StartPage,
        beforeEnter: () => {
            const authorizationStore = useAuthorizationStore();
            // если не авторизован, то бросать на страницу авторизации
            if (authorizationStore.isLoggedIn) {
                return '/header/all-rooms';
            }
        },
        children: [
            {
                path: '',
                name: 'start-registration',
                redirect: '/start/registration',
            },
            {
                path: 'registration',
                name: 'registration',
                component: () => import('@/views/RegistrationPage.vue'),
            },
            {
                path: 'login',
                name: 'login',
                component: () => import('@/views/LoginPage.vue'),
            },
        ],
    },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

export default router;
