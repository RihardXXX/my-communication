<template>
    <base-template-page title="профиль">
        <template #body>
            <ion-grid :fixed="true">
                <ion-row
                    class="ion-align-items-center ion-justify-content-center"
                >
                    <ion-col>
                        <ion-button
                            expand="block"
                            class="ion-margin"
                            color="tertiary"
                            @click="() => changeRoute('show-profile')"
                        >
                            <ion-icon
                                slot="start"
                                :icon="glassesOutline"
                            ></ion-icon>
                            просмотр профиля
                        </ion-button>

                        <ion-button
                            expand="block"
                            class="ion-margin"
                            color="warning"
                            @click="() => changeRoute('edit-profile')"
                        >
                            <ion-icon
                                slot="start"
                                :icon="createOutline"
                            ></ion-icon>
                            редактирование профиля
                        </ion-button>
                        <ion-button
                            expand="block"
                            class="ion-margin"
                            color="danger"
                            @click="exitAccount"
                        >
                            <ion-icon
                                slot="start"
                                :icon="exitOutline"
                            ></ion-icon>
                            выйти
                        </ion-button>
                    </ion-col>
                </ion-row>
            </ion-grid>
        </template>
    </base-template-page>
</template>

<script lang="ts" setup>
import BaseTemplatePage from '@/template/BaseTemplatePage.vue';
import { IonGrid, IonRow, IonCol, IonButton, IonIcon } from '@ionic/vue';
import { useRouter } from 'vue-router';
import { useAuthorizationStore } from '@/store/authorization';
import { glassesOutline, createOutline, exitOutline } from 'ionicons/icons';

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
