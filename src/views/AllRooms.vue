<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-title>Список комнат</ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-content :fullscreen="true" class="ion-padding">
            <ion-grid :fixed="true">
                <ion-row>
                    <ion-col :size="6">all rooms</ion-col>
                    <ion-col :size="6">my rooms</ion-col>
                </ion-row>
            </ion-grid>
        </ion-content>
    </ion-page>
</template>

<script lang="ts" setup>
import { IonToolbar, IonTitle, IonCol, IonGrid, IonRow } from '@ionic/vue';
</script>

<style scoped>
ion-grid {
    height: 100%;
}

ion-row {
    height: 100%;
}

ion-col {
    background-color: var(--ion-color-primary);
    border: solid 1px var(--ion-color-primary-contrast);
    color: var(--ion-color-primary-contrast);
    text-align: center;
}
</style>
