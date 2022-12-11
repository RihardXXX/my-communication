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
        <ion-buttons v-show="isPrivate" slot="primary">
            <ion-button fill="outline" @click.stop="showStatusRoom">
                <ion-icon :icon="lockClosedOutline"></ion-icon>
            </ion-button>
        </ion-buttons>
        <ion-buttons v-show="isPrivate" slot="primary">
            <ion-button fill="outline" @click.stop="sendInvite">
                <ion-icon :icon="sendOutline"></ion-icon>
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
    actionSheetController,
    alertController,
} from '@ionic/vue';

import { trash, people, lockClosedOutline, sendOutline } from 'ionicons/icons';
import { withDefaults, defineProps, toRefs, defineEmits } from 'vue';

interface Props {
    roomName: string;
    total?: number;
    isRemove?: boolean;
    icon?: any;
    isPrivate?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    total: 0,
    isRemove: false,
    icon: undefined,
    isPrivate: false,
});

const { roomName, total, isRemove } = toRefs(props);

interface Emit {
    (e: 'deleteRoom'): void;
    (e: 'inviteUsers'): void;
}

const emit = defineEmits<Emit>();

// отправка приглашений пользователям в приватную комнату
const sendInvite = async (): Promise<any> => {
    console.log('send invite');
    const actionSheet = await actionSheetController.create({
        header: 'вы действительно хотите пригласить пользователей в эту комнату',
        buttons: [
            {
                text: 'да пригласить',
                role: 'destructive',
                data: {
                    action: 'yes',
                },
            },
            {
                text: 'отмена',
                role: 'cancel',
                data: {
                    action: 'cancel',
                },
            },
        ],
    });

    await actionSheet.present();

    const {
        data: { action },
    } = await actionSheet.onDidDismiss();

    if (action !== 'yes') {
        console.log('отмена');
        return;
    }

    console.log('открыть модалку для приглашения пользователей');
    emit('inviteUsers');
};

//  показать статус комнаты
const showStatusRoom = async (): Promise<any> => {
    const alert = await alertController.create({
        message:
            'эта комната приватная и вы можете пригласить сюда пользователей',
        buttons: ['OK'],
    });

    await alert.present();
};
</script>

<style scoped>
ion-toolbar {
    border: 1px solid var(--ion-color-primary);
    border-radius: 5px;
}
</style>
