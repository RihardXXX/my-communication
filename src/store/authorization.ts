import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { User } from '@/types/store/user';
import { urlAuthorization } from '@/api/urls/urlAuthorization';
import axiosApp from '@/api/axios/axios';
import { AxiosResponse } from 'axios';
import { useSocketIO } from '@/api/socketio/socket-io-client';
import { socketEventsClient } from '@/types/socket/socketEvents';
import { Room } from '@/types/store/room';
import localStorage from '@/storage';
import { SocialItem } from '@/types/store/socialItem';

export const useAuthorizationStore = defineStore('authorization', () => {
    // пути для запросов и аксиос
    const urls = urlAuthorization;
    const axios = axiosApp;

    // console.log(1223, axios);

    // объект работы с сокетами
    const { socket } = useSocketIO();

    // ===== Это состояние =====
    // массив пользователей
    const userList = ref<Array<any>>([]);
    // текущий авторизованный пользователь
    const user = ref<User | null>(null);
    // токен
    const token = ref<string>('');
    // авторизован ли пользователь
    const isLoggedIn = ref<boolean>(false);
    // ошибки глобальные
    const errors = ref<Error | null | Array<string> | string>(null);
    // загружается ли страница
    const isLoading = ref<boolean>(false);
    // все пользователи
    const allUsers = ref<Array<User>>([]);

    // ===== Это функции экшены =====
    // регистрация пользователя
    async function registerUser(newUser: User): Promise<any> {
        user.value = newUser;
        token.value = newUser.token;
        isLoggedIn.value = true;
        const storage = await localStorage;
        await storage.set('token', newUser.token);
        // window.localStorage.setItem('token', newUser.token);
    }

    // авторизоваться в вручную по логину и паролю
    // избавится от дублирования и удалить эту шляпу
    async function login(userLogin: User): Promise<any> {
        user.value = userLogin;
        isLoggedIn.value = true;
        token.value = userLogin.token;
        const storage = await localStorage;
        await storage.set('token', userLogin.token);
        // window.localStorage.setItem('token', userLogin.token);
    }

    // автоматическая авторизация при запуске приложения
    async function authUser(): Promise<any> {
        const storage = await localStorage;
        const tokenFromLocalStorage: string | null = await storage.get('token');

        // const tokenFromLocalStorage: string | null =
        //     window?.localStorage.getItem('token');

        if (!tokenFromLocalStorage) {
            return;
        }

        const url: string | undefined = urls?.auth;

        // запрос на мой локальный бэк
        axios
            .get(url)
            .then((res: AxiosResponse): void => {
                user.value = res.data.user as User;
                isLoggedIn.value = true;
                token.value = tokenFromLocalStorage;
            })
            .catch((err: any) => console.log(err.response.data.message));
    }

    // выйти из состояния авторизации
    async function logout(): Promise<any> {
        const storage = await localStorage;
        await storage.remove('token');
        // window.localStorage.removeItem('token');
        user.value = null;
        isLoggedIn.value = false;
        token.value = '';
    }

    // автоматическое обновление состояния данных у текущего пользователя
    (function updateUserClient() {
        socket.on(
            socketEventsClient.updateUserClient,
            (updateUser: User): void => {
                user.value = updateUser;
            }
        );
    })();

    // получение всех пользователей в приложении
    function getAllUsers() {
        const url: string | undefined = urls?.allUsers;
        axios
            .get(url)
            .then((res: AxiosResponse): void => {
                allUsers.value = res.data.allUsers;
            })
            .catch((err: any) => console.log(err.response.data.message));
    }

    // установка текущего пользователя
    function setCurrentUser(currentUser: User) {
        user.value = currentUser;
    }

    // метод который меняет имя пользователя или другие параметры
    function changeFieldUser(newField: string, type: string): Promise<any> {
        console.log('changeFieldUser', newField);
        return new Promise((resolve, reject) => {
            const data = {};

            // сторожевая вышка
            if (!type) {
                return;
            }

            // формирование объекта полей
            // смена имени
            if (type === 'username') {
                data['username'] = newField;
            }

            // смена пола
            if (type === 'gender') {
                data['gender'] = newField;
            }

            // смена электронной почты
            if (type === 'email') {
                data['email'] = newField;
            }

            // смена биографии
            if (type === 'bio') {
                data['bio'] = newField;
            }

            const url: string | undefined = urls?.editUser;

            axios
                .post(url, {
                    data,
                })
                .then((res: AxiosResponse) => {
                    const resUser: User = res.data.user;
                    console.log('resUser: ', resUser);
                    user.value = resUser;
                    resolve('ok');
                })
                .catch((err: any) => {
                    console.log('err: ', err);
                    errors.value = err.response.data.message;
                    reject();
                });
        });
    }

    // добавление социальной сети
    function addNewSocialNetWork(social: SocialItem): void {
        const url: string | undefined = urls?.socialNetwork;

        console.log(url);
        console.log(social);

        axios
            .post(url, {
                social,
            })
            .then((res: AxiosResponse) => {
                const resUser: User = res.data.user;
                console.log('resUser: ', resUser);
                user.value = resUser;
            })
            .catch((err: any) => {
                console.log('err: ', err);
                errors.value = err.response.data.message;
            });
    }

    // удаление социальной сети
    function removeNewSocialNetWork(idSocial: string): void {
        const url: string | undefined = urls?.socialNetwork;

        axios
            .delete(`${url}/${idSocial}`)
            .then((res: AxiosResponse) => {
                const resUser: User = res.data.user;
                console.log('resUser: ', resUser);
                user.value = resUser;
            })
            .catch((err: any) => {
                console.log('err: ', err);
                errors.value = err.response.data.message;
            });
    }

    // ===== Это геттеры =====
    // статус авторизации
    const status = computed<boolean>(() => isLoggedIn.value);
    // имя текущего пользователя
    const username = computed<string>(() => user.value?.username || '');
    // имеются ли вообще комнаты в которых пригласили текущего пользователя
    const isInvited = computed<boolean>(() =>
        Boolean(user.value?.invitedRooms?.length)
    );
    // комнаты сами в которые пригласили текущего пользователя
    const invitedRooms = computed<Array<Room> | []>(() => {
        return user.value?.invitedRooms || [];
    });

    return {
        userList,
        user,
        token,
        isLoggedIn,
        errors,
        isLoading,
        allUsers,
        status,
        registerUser,
        login,
        logout,
        authUser,
        getAllUsers,
        setCurrentUser,
        changeFieldUser,
        addNewSocialNetWork,
        removeNewSocialNetWork,
        username,
        isInvited,
        invitedRooms,
    };
});
