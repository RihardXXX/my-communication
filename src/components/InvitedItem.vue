<template>
    <ion-card>
        <ion-card-header>
            <ion-card-title>{{ author }}</ion-card-title>
            <ion-card-subtitle>имя комнаты: {{ roomName }}</ion-card-subtitle>
        </ion-card-header>

        <ion-button fill="clear" @click="emit('apply', currentRoom)">принять</ion-button>
        <ion-button fill="clear" @click="emit('cancel', currentRoom)">отклонить</ion-button>
    </ion-card>
</template>

<script lang="ts" setup>
import { Room } from '@/types/store/room';
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
    currentRoom: Room,
}

const props = withDefaults(defineProps<Props>(), {
    author: '',
    roomName: '',
});

const { author, roomName } = toRefs(props);

const emit = defineEmits<{
    (e: 'cancel', currentRoom: Room): void;
    (e: 'apply', currentRoom: Room): void;
}>();
</script>

<style scoped>
ion-card-header.ios {
    display: flex;
    flex-flow: column-reverse;
}
</style>
