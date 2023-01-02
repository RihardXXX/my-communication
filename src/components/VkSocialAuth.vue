<template>
    <ion-button
        type="submit"
        class="ion-margin"
        color="success"
        expand="block"
        @click="authVk"
        ><ion-icon slot="start" :icon="logoVk"></ion-icon> войти через
        вк</ion-button
    >
</template>

<script lang="ts" setup>
import { onMounted, ref, inject } from 'vue';
import { IonButton, IonIcon } from '@ionic/vue';
import { logoVk } from 'ionicons/icons';
import { VKAuth } from 'capacitor-plugin-vk-auth';
import { urlAuth } from '@/api/urls/urlAuthorization';
import { AuthorizationUrlTypes } from '@/types/urls/authorizationUrlTypes';
import { useAuthorizationStore } from '@/store/authorization';
import { AxiosResponse } from 'axios';
import { User } from '@/types/store/user';

const urls = inject<AuthorizationUrlTypes>(urlAuth);
const axios = inject<any>('axios');
const authorizationStore = useAuthorizationStore();

onMounted((): void => {
    VKAuth.addListener('vkAuthFinished', (info) => {
        console.log('vkAuthFinished was fired', info);
        test.value = info;
        // username, email, password, gender
        const username = info.userId;
        const email = `${info.userId}@vk.ru`;
        //  это токен вк который мы превращаем в пароль для юзера при авто через вк
        //  тут имеется уязвимость ))) по хуй
        const password = `password-${email}-password`;
        const gender = '';

        const user = {
            username,
            email,
            password,
            gender,
        };

        const url = urls?.authVk;

        axios
            .post(url, {
                user,
            })
            .then((res: AxiosResponse) => {
                const user: User = res.data.user;
                // console.log('user: ', user);
                authorizationStore.registerUser(user);
            })
            .catch((err: any) => {
                console.log('err: VKAuth.addListener', err);
                test.value = err.message.message;
            });
    });
});

const test = ref({});

const authVk = (): void => {
    console.log('authVk');
    console.log('env', process.env.VUE_APP_ID_APPLICATION_VK);
    VKAuth.initWithId({ id: process.env.VUE_APP_ID_APPLICATION_VK });
    VKAuth.auth({ scope: ['offline'] });
};
</script>
