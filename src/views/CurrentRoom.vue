<template>
    <detail-template-page :title="roomName">
        <template #body>
            <room-item
                room-name="пользователей"
                :total="usersCurrentRoom?.length"
                class="ion-margin-top"
                @click="showUsers"
            />

            <ion-list class="ion-margin-top">
                <ion-item>
                    <ion-chip slot="start">
                        <ion-label>участник</ion-label>
                    </ion-chip>
                    <ion-label class="ion-text-wrap">
                        Multi-line text that should wrap when it is too long to
                        fit on one line. Lorem ipsum dolor sit amet
                    </ion-label>
                </ion-item>
                <ion-item>
                    <ion-chip slot="end">
                        <ion-label>я</ion-label>
                    </ion-chip>
                    <ion-label class="ion-text-wrap">
                        Multi-line text that should wrap when it is too long to
                        fit on one line. Lorem ipsum dolor sit amet, consectetur
                        adipiscing elit.
                    </ion-label>
                </ion-item>
            </ion-list>

            <ion-item class="ion-margin-top">
                <ion-input
                    placeholder="введите текст"
                    :maxlength="60"
                    :value="textMessage"
                    @ion-input="setTextMessage"
                ></ion-input>
                <ion-button fill="outline" @click="sendMessage">отправить</ion-button>
            </ion-item>
            <br />
            <ion-badge>{{ textMessage.length }}</ion-badge>
        </template>
    </detail-template-page>
</template>

<script lang="ts" setup>
import DetailTemplatePage from '@/template/DetailTemplatePage.vue';
import RoomItem from '@/components/RoomItem.vue';
import {
    toastController,
    IonList,
    IonItem,
    IonLabel,
    IonChip,
    IonInput,
    IonButton,
    alertController,
    IonicSafeString,
    IonBadge,
} from '@ionic/vue';
import { useAuthorizationStore } from '@/store/authorization';
import { useRoomsStore } from '@/store/rooms';
import { onMounted, toRefs, ref, onUnmounted, watch, computed } from 'vue';
import { Room } from '@/types/store/room';
import { socketEventsServer } from '@/types/socket/socketEvents';
import { User } from '@/types/store/user';
import { person } from 'ionicons/icons';

const roomName = computed<string | undefined>(() => currentRoom.value?.name);

// глобальное состояние пользователя и комнат
const { user } = toRefs(useAuthorizationStore());
const { currentRoom, messagesCurrentRoom, usersCurrentRoom, errors } = toRefs(
    useRoomsStore()
);
// объект сокета должен быть один чтобы по айди цеплялись события
// реактивность не требуется
const { socket, deleteError, addError, setCurrentRoom } = useRoomsStore();

onMounted(async () => {
    socket.emit(socketEventsServer.joinedRooms, {
        user: user.value,
        room: currentRoom.value,
    });
    deleteError();
    // приветствие о том что вошли в комнату
    await welcomeRoom('bottom');
});

onUnmounted(() => {
    // выходим из текущей комнаты
    // когда пользователь выходит сообщаем остальным что пользователь вышел
    socket.emit(socketEventsServer.exitRoom, {
        user: user.value,
        room: currentRoom.value,
        changeRoom: false,
    } as {
        user: User;
        room: Room;
        changeRoom: boolean;
    });
    // при выходе очищаем комнату
    setCurrentRoom(null);
});

// всплывающее уведомление о том, что вошел в комнату
const welcomeRoom = async (
    position: 'top' | 'middle' | 'bottom'
): Promise<any> => {
    const toast = await toastController.create({
        message: `вы вошли в комнату ${roomName.value}`,
        duration: 2500,
        position: position,
    });
    await toast.present();
};

const showUsers = () => {
    console.log('showUsers');
};

const presentAlert = async (text: string) => {
    const alert = await alertController.create({
        message: text,
        buttons: ['OK'],
    });

    await alert.present();
};

const textMessage = ref<string>('');

const setTextMessage = (event): void => {
    textMessage.value = event.target.value.trim();
};

watch((): string | '' => textMessage.value, (newValue: string | ''): void => {
    if (newValue.length === 60) {
        presentAlert('сообщение не больше 60 символос');
        textMessage.value = textMessage.value.slice(0, 60);
    }
})


const sendMessage = () => {
    if(!textMessage.value) {
        presentAlert('заполните поле для отправки сообщения');
        return
    }

    console.log('send');
    textMessage.value = '';
}
</script>

<style scoped>
/* ion-label {
    max-width: 70%;
} */

ion-list {
    height: 75%;
}
</style>
