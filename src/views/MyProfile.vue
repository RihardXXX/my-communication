<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-title>Профиль</ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-content :fullscreen="true" class="ion-padding">
            <ion-grid :fixed="true">
                <ion-row
                    class="ion-align-items-center ion-justify-content-center"
                >
                    <ion-col>
                        <ion-button
                            expand="block"
                            class="ion-margin"
                            color="secondary"
                            @click="() => changeRoute('show-profile')"
                            >просмотр профиля</ion-button
                        >

                        <ion-button
                            expand="block"
                            class="ion-margin"
                            color="secondary"
                            @click="() => changeRoute('edit-profile')"
                            >редактирование профиля</ion-button
                        >
                        <ion-button
                            expand="block"
                            class="ion-margin"
                            color="danger"
                            @click="exitAccount"
                            >выйти</ion-button
                        >
                    </ion-col>
                </ion-row>
            </ion-grid>
        </ion-content>
    </ion-page>
</template>

<script lang="ts" setup>
import {
    IonToolbar,
    IonTitle,
    IonGrid,
    IonRow,
    IonCol,
    IonButton,
} from '@ionic/vue';
import { useRouter } from 'vue-router';
import { useAuthorizationStore } from '@/store/authorization';

const router = useRouter();
const authorizationStore = useAuthorizationStore();

const changeRoute = (path: string): Promise<any> => router.push({ name: path });
const exitAccount = async (): Promise<any> => {
    // console.log('exit account');
    await authorizationStore.logout();
    router.push({ name: 'login' });
};
</script>

<style scode>
ion-grid {
    height: 100%;
}

ion-row {
    height: 100%;
}
</style>
