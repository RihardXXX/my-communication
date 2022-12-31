<template>
    <ion-button
        type="submit"
        class="ion-margin"
        color="success"
        expand="block"
        @click="authVk"
        ><ion-icon slot="start" :icon="logoVk"></ion-icon> войти через
        вк</ion-button
    >
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import { IonButton, IonIcon } from '@ionic/vue';
import { logoVk } from 'ionicons/icons';
import { VKAuth } from 'capacitor-plugin-vk-auth';

onMounted((): void => {
    VKAuth.addListener('vkAuthFinished', (info) => {
        console.log('vkAuthFinished was fired', info);
    });
});

const authVk = (): void => {
    console.log('authVk');
    console.log('env', process.env.VUE_APP_ID_APPLICATION_VK);
    VKAuth.initWithId({ id: process.env.VUE_APP_ID_APPLICATION_VK });
    VKAuth.auth({ scope: ['offline'] });
};
</script>
