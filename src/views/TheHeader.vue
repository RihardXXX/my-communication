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
import { ref, watch } from 'vue';
import {
    IonTabBar,
    IonTabButton,
    IonTabs,
    IonLabel,
    IonIcon,
    IonPage,
    IonRouterOutlet,
} from '@ionic/vue';
import { person, logoWechat, addCircle, megaphone } from 'ionicons/icons';
import { useAuthorizationStore } from '@/store/authorization';

const authorizationStore = useAuthorizationStore();

let idX = 0;

interface Header {
    id: number;
    tab: string;
    href: string;
    icon: string;
    label: string;
}

// при изменении имени пользователя меняем и содержимое меню
watch(
    () => authorizationStore.username,
    (newName: string) => {
        console.log('newName: ', newName);
        // изменеяем имя пользователя в меню
        const newNavigationMenu: Array<Header> = navigation.value.map(
            (item: Header) => {
                if (item.tab === 'tab1') {
                    item.label = newName;
                    return item;
                }
                return item;
            }
        );

        navigation.value = newNavigationMenu;
    }
);

const navigation = ref<Array<Header>>([
    {
        id: idX++,
        tab: 'tab1',
        href: '/header/my-profile',
        icon: person,
        label: authorizationStore.username,
    },
    {
        id: idX++,
        tab: 'tab2',
        href: '/header/all-rooms',
        icon: logoWechat,
        label: 'комнаты',
    },
    {
        id: idX++,
        tab: 'tab3',
        href: '/header/create-room',
        icon: addCircle,
        label: 'создать комнату',
    },
    {
        id: idX++,
        tab: 'tab4',
        href: '/header/the-invitations',
        icon: megaphone,
        label: 'приглашения',
    },
]);
</script>
