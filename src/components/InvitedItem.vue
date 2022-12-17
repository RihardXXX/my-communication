<template>
    <ion-card>
        <ion-card-header>
            <ion-card-title>{{ author }}</ion-card-title>
            <ion-card-subtitle>имя комнаты: {{ roomName }}</ion-card-subtitle>
        </ion-card-header>

        <ion-button fill="clear" @click="emit('apply', id)">apply</ion-button>
        <ion-button fill="clear" @click="emit('cancel', id)">cancel</ion-button>
    </ion-card>
</template>

<script lang="ts" setup>
import {
    IonButton,
    IonCard,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
} from '@ionic/vue';
import { defineProps, withDefaults, toRefs, defineEmits } from 'vue';

interface Props {
    id: string;
    author?: string;
    roomName?: string;
}

const props = withDefaults(defineProps<Props>(), {
    author: '',
    roomName: '',
});

const { author, roomName } = toRefs(props);

const emit = defineEmits<{
    (e: 'cancel', id: string): void;
    (e: 'apply', id: string): void;
}>();
</script>

<style scoped>
ion-card-header.ios {
    display: flex;
    flex-flow: column-reverse;
}
</style>
