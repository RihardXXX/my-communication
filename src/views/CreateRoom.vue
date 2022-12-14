<template>
    <base-template-page title="создание комнаты">
        <template #body>
            <ion-item>
                <ion-input
                    ref="inputRef"
                    placeholder="введите текст"
                    :maxlength="lengthNameRoom"
                    :value="roomCreate.roomName"
                    :disabled="isFull"
                    @ion-input="setRoomName"
                ></ion-input>
                <ion-button
                    fill="outline"
                    :disabled="isFull"
                    @click="createRoom"
                    >создать</ion-button
                >
            </ion-item>
            <ion-item>
                <ion-badge>{{ roomCreate.roomName.length }}</ion-badge>

                <ion-segment value="публичная" :disabled="isFull">
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

            <ion-text color="tertiary" v-show="user?.roomCount !== 0">
                <h3>вы можете создать не более {{ user?.roomCount }} комнат</h3>
            </ion-text>
            <ion-text color="tertiary" v-show="isFull">
                <h3>вы создали лимит в 5 комнат</h3>
            </ion-text>

            <ion-list v-show="myRooms.length">
                <room-item
                    v-for="roomItem in myRooms"
                    :key="roomItem._id"
                    :room-name="roomItem.name"
                    :total="roomItem.users.length"
                    is-remove
                    :is-private="roomItem.private"
                    class="roomItem"
                    @click="() => nextRoom(roomItem)"
                    @deleteRoom="() => deleteRoom(roomItem)"
                    @inviteUsers="() => inviteUsers(roomItem)"
                />
            </ion-list>

            <show-users-modal
                :is-show-users-modal="isShowUsersModal"
                :users="allUsers"
                @set-is-show-users-modal="
                    (status) => (isShowUsersModal = status)
                "
                :is-invited-mode="true"
                :invitedRoom="invitedRoom"
            />
        </template>
    </base-template-page>
</template>

<script lang="ts" setup>
import { useRoomsStore } from '@/store/rooms';
import BaseTemplatePage from '@/template/BaseTemplatePage.vue';
import ShowUsersModal from '@/components/ShowUsersModal.vue';

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
    actionSheetController,
} from '@ionic/vue';
import { ref, watch, toRefs, computed, onMounted } from 'vue';
import { useSocketIO } from '@/api/socketio/socket-io-client';
import { socketEventsServer } from '@/types/socket/socketEvents';
import { useAuthorizationStore } from '@/store/authorization';
import { User } from '@/types/store/authorizationTypes';
import RoomItem from '@/components/RoomItem.vue';
import { Room } from '@/types/store/room';
import { useRoute } from 'vue-router';

const roomStore = useRoomsStore();
const { rooms, myRooms } = toRefs(roomStore);

const { getAllUsers } = useAuthorizationStore();
const { user, allUsers } = toRefs(useAuthorizationStore());

const route = useRoute();

onMounted(() => {
    console.log('onMounted CreateRoom');
    // получаем всех пользователей
    getAllUsers();
});

//  Внимание это костыль)) так как рендер страниц идет через шаблон слоты хук
//  onMounted   вызывается один раз
watch(
    () => route.path,
    (path: string): void => {
        if (path === '/header/create-room') {
            getAllUsers();
        }
    }
);

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

// сосотояние что количество комнат достигло максимума
const isFull = computed<boolean>(() => {
    return myRooms.value.length === 5;
});

const createRoom = (): void => {
    console.log('create room');

    // проверка на количество комнат
    if (isFull.value) {
        presentAlert('количество созданных комнат не может быть больше 5');
        return;
    }

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

const deleteRoom = async (roomItem: Room) => {
    const actionSheet = await actionSheetController.create({
        header: 'вы действительно хотите удалить эту комнату',
        buttons: [
            {
                text: 'да удалить',
                role: 'destructive',
                data: {
                    action: 'delete',
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

    if (action !== 'delete') {
        console.log('отмена');
        return;
    }

    console.log('удаление');
    socket.emit(socketEventsServer.deleteMyRoom, {
        room: roomItem,
        user: user.value,
    } as {
        room: Room;
        user: User;
    });
};

// показ модалки со всеми пользователями для приглашения
const isShowUsersModal = ref<boolean>(false);
// выбранная комната для приглашения
const invitedRoom = ref<Room | null>(null);

const inviteUsers = (roomItem: Room): void => {
    isShowUsersModal.value = !isShowUsersModal.value;
    invitedRoom.value = roomItem;
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
