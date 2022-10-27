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
                        <ion-button expand="block" class="ion-margin"
                            >просмотр профиля</ion-button
                        >
                        <ion-button expand="block" class="ion-margin"
                            >редактирование профиля</ion-button
                        >
                        <ion-button expand="block" class="ion-margin"
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
</script>

<style scode>
ion-grid {
    height: 100%;
}

ion-row {
    height: 100%;
}
</style>
