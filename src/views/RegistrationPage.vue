<template>
    <base-template-page title="регистрация">
        <template #body>
            <ion-grid :fixed="true">
                <ion-row
                    class="ion-align-items-center ion-justify-content-center"
                    color="light"
                >
                    <ion-col>
                        <h3>Введите логин и пароль</h3>
                        <form @submit.prevent="setRegistration">
                            <ion-list>
                                <ion-item>
                                    <ion-label position="stacked"
                                        >имя</ion-label
                                    >
                                    <ion-input
                                        :clear-input="true"
                                        placeholder="почта"
                                        :value="username"
                                        @input="setUsername"
                                    >
                                    </ion-input>
                                </ion-item>
                                <ion-item>
                                    <ion-label position="stacked"
                                        >электронная почта</ion-label
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
                                        >пароль</ion-label
                                    >
                                    <ion-input
                                        :clear-input="true"
                                        type="password"
                                        placeholder="пароль"
                                        :value="password"
                                        @input="setPassword"
                                    ></ion-input>
                                </ion-item>

                                <h2>укажите пол:</h2>
                                <ion-radio-group
                                    :value="gender"
                                    v-model="gender"
                                >
                                    <ion-item>
                                        <ion-label>
                                            <code>муж</code>
                                        </ion-label>
                                        <ion-radio value="муж"></ion-radio>
                                    </ion-item>
                                    <ion-item>
                                        <ion-label>
                                            <code>жен</code>
                                        </ion-label>
                                        <ion-radio value="жен"></ion-radio>
                                    </ion-item>
                                </ion-radio-group>
                            </ion-list>
                            <ion-button
                                type="submit"
                                class="ion-margin"
                                color="success"
                                expand="block"
                                >регистрация</ion-button
                            >
                        </form>
                    </ion-col>
                </ion-row>
            </ion-grid>
        </template>
    </base-template-page>
</template>

<script lang="ts" setup>
import BaseTemplatePage from '@/template/BaseTemplatePage.vue';
import {
    IonGrid,
    IonRow,
    IonCol,
    IonInput,
    IonButton,
    IonList,
    IonItem,
    IonLabel,
    alertController,
    IonRadioGroup,
    IonRadio,
} from '@ionic/vue';
import { ref, inject } from 'vue';
import { urlAuth } from '@/api/urls/urlAuthorization';
import { AuthorizationUrlTypes } from '@/types/urls/authorizationUrlTypes';
import { RegisterUserSend } from '@/types/registration/registerUserSend';
import { AxiosResponse } from 'axios';
import { User } from '@/types/store/user';
import { useAuthorizationStore } from '@/store/authorization';

const urls = inject<AuthorizationUrlTypes>(urlAuth);
const axios = inject<any>('axios');
const authorizationStore = useAuthorizationStore();

const username = ref<string>('');
const email = ref<string>('');
const gender = ref<string>('муж');
const password = ref<string>('');
const errors = ref<Array<string>>([]);

const setUsername = (e: InputEvent): void => {
    username.value = e.target.value.trim();
};
const setEmail = (e: InputEvent): void => {
    email.value = e.target.value.trim();
};
const setPassword = (e: InputEvent): void => {
    password.value = e.target.value.trim();
};

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

const setRegistration = () => {
    console.log('setRegister');

    errors.value = [];

    if (!username.value) {
        errors.value.push('заполните пожалуйста поле имени пользователя');
        presentErrors();
        return;
    }

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

    if (!gender.value) {
        errors.value.push('укажите пожалуйста ваш пол');
        presentErrors();
        return;
    }

    const url = urls?.registration;

    axios
        .post(url, {
            user: {
                username: username.value,
                email: email.value,
                password: password.value,
                gender: gender.value,
            } as RegisterUserSend,
        })
        .then((res: AxiosResponse) => {
            const user: User = res.data.user;
            console.log('user: ', user);
            authorizationStore.registerUser(user);
        })
        .catch((err: any) => {
            errors.value = err.response.data.message as Array<string>;
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
    /* background-color: aquamarine; */
}
</style>
