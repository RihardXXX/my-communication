<template>
    <base-template-page title="создание комнаты">
        <template #body>
            <ion-item>
                <ion-input
                    ref="inputRef"
                    placeholder="введите текст"
                    :maxlength="lengthNameRoom"
                    :value="roomCreate.roomName"
                    @ion-input="setRoomName"
                ></ion-input>
                <ion-button fill="outline" @click="createRoom"
                    >создать</ion-button
                >
            </ion-item>
            <ion-item>
                <ion-badge>{{ roomCreate.roomName.length }}</ion-badge>

                <ion-segment value="публичная">
                    <ion-segment-button
                        v-for="publicOrPrivateItem in publicOrPrivate"
                        :key="publicOrPrivateItem.id"
                        :value="publicOrPrivateItem.label"
                        @click="() => changeTypeRoom(publicOrPrivateItem)"
                    >
                        <ion-label>{{ publicOrPrivateItem.label }}</ion-label>
                    </ion-segment-button>
                </ion-segment>
            </ion-item>
            <br />
            <pre>
                {{ roomCreate }}
            </pre>
            <ion-text color="tertiary" v-show="user?.roomCount !== 0">
                <h3>вы можете создать не более {{ user?.roomCount }} комнат</h3>
            </ion-text>
            <ion-list v-show="myRooms.length">
                <room-item
                    v-for="roomItem in myRooms"
                    :key="roomItem._id"
                    :room-name="roomItem.name"
                    :total="roomItem.users.length"
                    is-remove
                    class="roomItem"
                    @click="() => nextRoom(roomItem)"
                    @deleteRoom="() => deleteRoom(roomItem)"
                />
            </ion-list>
        </template>
    </base-template-page>
</template>

<script lang="ts" setup>
import { useRoomsStore } from '@/store/rooms';
import BaseTemplatePage from '@/template/BaseTemplatePage.vue';
import {
    IonInput,
    alertController,
    IonButton,
    IonItem,
    IonBadge,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonList,
    IonText,
} from '@ionic/vue';
import { ref, watch, toRefs } from 'vue';
import { useSocketIO } from '@/api/socketio/socket-io-client';
import { socketEventsServer } from '@/types/socket/socketEvents';
import { useAuthorizationStore } from '@/store/authorization';
import { User } from '@/types/store/authorizationTypes';
import RoomItem from '@/components/RoomItem.vue';
import { Room } from '@/types/store/room';

const roomStore = useRoomsStore();
const { rooms, myRooms } = toRefs(roomStore);

const { user } = toRefs(useAuthorizationStore());

// тип комнаты приватный или общий
interface PrivateOrPublic {
    id: number;
    label: string;
    value: boolean;
}

// кнопки переключатели
const publicOrPrivate = ref<Array<PrivateOrPublic>>([
    {
        id: 0,
        label: 'публичная',
        value: false,
    },
    {
        id: 1,
        label: 'приватная',
        value: true,
    },
]);

const changeTypeRoom = (publicOrPrivateItem: PrivateOrPublic): void => {
    console.log(publicOrPrivateItem);
    roomCreate.value.private = publicOrPrivateItem.value;
};

// интерфейс комнаты
interface RoomCreate {
    roomName: string;
    private: boolean;
}

const lengthNameRoom = ref<number>(20);
// сама комната
const roomCreate = ref<RoomCreate>({ roomName: '', private: false });

const presentAlert = async (text: string) => {
    const alert = await alertController.create({
        message: text,
        buttons: ['OK'],
    });
    await alert.present();
};

const setRoomName = (event): void => {
    roomCreate.value.roomName = event.target.value.trim();
};

watch(
    (): string | '' => roomCreate.value.roomName,
    (newValue: string | ''): void => {
        if (newValue.length === lengthNameRoom.value) {
            presentAlert(
                `имя комнаты не должно превышать ${lengthNameRoom.value} символов`
            );
            roomCreate.value.roomName = roomCreate.value.roomName.slice(
                0,
                lengthNameRoom.value
            );
        }
    }
);

// объект сокета для получения данных от сервера
const { socket } = useSocketIO();

const createRoom = (): void => {
    console.log('create room');
    // проверка на пустоту комнаты
    if (!roomCreate.value.roomName) {
        presentAlert('заполните пожалуйста имя комнаты');
        return;
    }

    // проверка, чтобы не было одинаковых имен комнат
    const isRepeatRoomName = rooms.value.some(
        (room) =>
            room.name.toLocaleLowerCase() ===
            roomCreate.value.roomName.toLocaleLowerCase()
    );

    if (isRepeatRoomName) {
        presentAlert(
            'комната с таким именем существует, изменит е пожалуйста имя'
        );
        return;
    }

    // создаём комнату
    socket.emit(socketEventsServer.createNewRoom, {
        room: roomCreate.value,
        user: user.value,
    } as {
        room: RoomCreate;
        user: User;
    });

    // сбрасываем поля
    roomCreate.value.roomName = '';
    roomCreate.value.private = false;
};

const nextRoom = (roomItem: Room) => {
    console.log('next romm', roomItem);
};

const deleteRoom = (roomItem: Room) => {
    console.log('delete room: ', roomItem);
};
</script>

<style scoped>
.roomItem {
    margin-bottom: 10px;
}

.roomItem:last-child {
    margin-bottom: 0;
}

h3 {
    text-align: center;
}
</style>
