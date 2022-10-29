<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-buttons>
                    <ion-back-button text="назад"></ion-back-button>
                </ion-buttons>
                <ion-title>Просмотр</ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-content :fullscreen="true" class="ion-padding">
            show profile
        </ion-content>
    </ion-page>
</template>

<script lang="ts" setup>
import { IonToolbar, IonTitle, IonButtons, IonBackButton } from '@ionic/vue';
</script>

<style scode></style>
