<template>
    <ion-page>
        <ion-tabs>
            <ion-router-outlet></ion-router-outlet>
            <ion-tab-bar slot="bottom">
                <ion-tab-button tab="tab1" href="/start/registration">
                    <ion-icon :icon="create" />
                    <ion-label>регистрация</ion-label>
                </ion-tab-button>

                <ion-tab-button tab="tab2" href="/start/login">
                    <ion-icon :icon="logIn" />
                    <ion-label>войти</ion-label>
                </ion-tab-button>
            </ion-tab-bar>
        </ion-tabs>
    </ion-page>
</template>

<script lang="ts" setup>
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
</script>
