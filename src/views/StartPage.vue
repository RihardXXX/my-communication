<template>
    <ion-page>
        <ion-tabs>
            <ion-router-outlet></ion-router-outlet>
            <ion-tab-bar v-if="navigation.length" slot="bottom" color="primary">
                <ion-tab-button
                    v-for="item in navigation"
                    :key="item.id"
                    :tab="item.tab"
                    :href="item.href"
                >
                    <ion-icon :icon="item.icon" />
                    <ion-label>{{ item.label }}</ion-label>
                </ion-tab-button>
            </ion-tab-bar>
        </ion-tabs>
    </ion-page>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import {
    IonTabBar,
    IonTabButton,
    IonTabs,
    IonLabel,
    IonIcon,
    IonPage,
    IonRouterOutlet,
} from '@ionic/vue';
import { create, logIn } from 'ionicons/icons';

let idX = 0;

interface Header {
    id: number;
    tab: string;
    href: string;
    icon: string;
    label: string;
}

const navigation = reactive<Array<Header>>([
    {
        id: idX++,
        tab: 'tab1',
        href: '/start/registration',
        icon: create,
        label: 'регистрация',
    },
    {
        id: idX++,
        tab: 'tab2',
        href: '/start/login',
        icon: logIn,
        label: 'войти',
    },
]);
</script>
