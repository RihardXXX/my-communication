<template>
    <base-template-page title="авторизация">
        <template #body>
            <ion-grid :fixed="true">
                <ion-row
                    class="ion-align-items-center ion-justify-content-center"
                >
                    <ion-col>
                        <h3>Введите логин и пароль</h3>
                        <form @submit.prevent="setLogin">
                            <ion-list>
                                <ion-item>
                                    <ion-label position="stacked"
                                        >ваша почта указанная при
                                        регистрации</ion-label
                                    >
                                    <ion-input
                                        :clear-input="true"
                                        type="email"
                                        placeholder="почта"
                                        :value="email"
                                        @input="setEmail"
                                    >
                                    </ion-input>
                                </ion-item>

                                <ion-item>
                                    <ion-label position="stacked"
                                        >ваш пароль указанный при
                                        регистрации</ion-label
                                    >
                                    <ion-input
                                        :clear-input="true"
                                        type="password"
                                        placeholder="пароль"
                                        :value="password"
                                        @input="setPassword"
                                    ></ion-input>
                                </ion-item>
                            </ion-list>
                            <ion-button
                                type="submit"
                                class="ion-margin"
                                color="success"
                                expand="block"
                                >войти</ion-button
                            >
                        </form>
                        <VkSocialAuth />
                    </ion-col>
                </ion-row>
            </ion-grid>
        </template>
    </base-template-page>
</template>

<script lang="ts" setup>
import BaseTemplatePage from '@/template/BaseTemplatePage.vue';
import VkSocialAuth from '@/components/VkSocialAuth.vue';
import {
    IonCol,
    IonGrid,
    IonRow,
    IonList,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    alertController,
} from '@ionic/vue';

import { useAuthorizationStore } from '@/store/authorization';
import { useRouter } from 'vue-router';
import { inject, ref } from 'vue';
import { AuthorizationUrlTypes } from '@/types/urls/authorizationUrlTypes';
import { urlAuth } from '@/api/urls/urlAuthorization';
import { LoginUserSend } from '@/types/registration/loginUserSend';
import { User } from '@/types/store/user';
import { AxiosResponse } from 'axios';

// получение сторы для добавления пользователя
const authorizationStore = useAuthorizationStore();
const router = useRouter();

const urls = inject<AuthorizationUrlTypes>(urlAuth);
const axios = inject<any>('axios');

// инициализация состояний
const email = ref<string>('');
const password = ref<string>('');

const setEmail = (e: string): string => (email.value = e.target.value.trim());
const setPassword = (e: string): string =>
    (password.value = e.target.value.trim());
const errors = ref<Array<string>>([]);

// модалка с ошибкой
const presentErrors = async () => {
    const alert = await alertController.create({
        header: 'внимание',
        // subHeader: 'Important message',
        message: errors.value,
        buttons: ['OK'],
    });

    await alert.present();
};

const setLogin = (): void => {
    console.log('setLogin');
    errors.value = [];

    if (!email.value) {
        errors.value.push('заполните пожалуйста поле почты');
        presentErrors();
        return;
    }

    if (!password.value) {
        errors.value.push('заполните пожалуйста поле пароля');
        presentErrors();
        return;
    }

    const url = urls?.login;

    axios
        .post(url, {
            user: {
                email: email.value,
                password: password.value,
            } as LoginUserSend,
        })
        .then((res: AxiosResponse): void => {
            console.log('res: ', res);
            const user: User = res.data.user;
            authorizationStore.login(user);
            router.push({ name: 'all-rooms' });
        })
        .catch((err: any) => {
            errors.value = err.response.data.message as Array<string>;
            presentErrors();
        });
};
</script>

<style scoped>
ion-grid {
    height: 100%;
}

ion-row {
    height: 100%;
}

ion-col {
    text-align: center;
    background: var(--ion-color-medium);
    border-radius: 5px;
}

ion-list {
    border-radius: 5px;
}
</style>
