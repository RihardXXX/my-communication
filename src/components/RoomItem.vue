<template>
    <ion-toolbar>
        <ion-buttons slot="secondary">
            <ion-button fill="outline">
                <ion-icon slot="start" :icon="icon || people"></ion-icon>
                {{ total }}
            </ion-button>
        </ion-buttons>
        <ion-title>{{ roomName }}</ion-title>
        <ion-buttons v-show="isRemove" slot="primary">
            <ion-button fill="outline" @click.stop="emit('deleteRoom')">
                <ion-icon :icon="trash"></ion-icon>
            </ion-button>
        </ion-buttons>
    </ion-toolbar>
</template>

<script lang="ts" setup>
import {
    IonButton,
    IonButtons,
    IonIcon,
    IonTitle,
    IonToolbar,
} from '@ionic/vue';

import { trash, people } from 'ionicons/icons';
import { withDefaults, defineProps, toRefs, defineEmits } from 'vue';

interface Props {
    roomName: string;
    total?: number;
    isRemove?: boolean;
    icon?: any;
}

const props = withDefaults(defineProps<Props>(), {
    total: 0,
    isRemove: false,
    icon: undefined,
});

const { roomName, total, isRemove } = toRefs(props);

interface Emit {
    (e: 'deleteRoom'): void;
}

const emit = defineEmits<Emit>();
</script>

<style scoped>
ion-toolbar {
    border: 1px solid var(--ion-color-primary);
    border-radius: 5px;
}
</style>
