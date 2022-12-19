<template>
    <base-template-page title="Список комнат">
        <template #body>
            <ion-grid :fixed="true">
                <ion-row>
                    <ion-col>
                        <ion-segment :value="selectedCategory">
                            <ion-segment-button
                                v-for="button in buttons"
                                :key="button.id"
                                :value="button.value"
                                @click="() => changeCategory(button)"
                            >
                                <ion-label>{{ button.label }}</ion-label>
                            </ion-segment-button>
                        </ion-segment>
                        <div
                            v-show="selectedCategory === 'all'"
                            class="ion-margin-top ion-text-center"
                        >
                            <ion-searchbar
                                placeholder="поиск комнаты"
                                :debounce="1500"
                                @ionChange="searchFromAllRooms($event)"
                            ></ion-searchbar>
                            <ion-list v-show="allRooms.length">
                                <room-item
                                    v-for="roomItem in allRooms"
                                    :key="roomItem._id"
                                    :room-name="roomItem.name"
                                    :total="roomItem.users.length"
                                    :is-private="roomItem.private"
                                    class="roomItem"
                                    @click="() => nextRoom(roomItem)"
                                />
                            </ion-list>

                            <ion-badge
                                v-show="!allRooms.length"
                                color="primary"
                                class="ion-margin"
                            >
                                комнаты отсутствуют
                            </ion-badge>
                        </div>
                        <div
                            v-show="selectedCategory === 'my'"
                            class="ion-margin-top ion-text-center"
                        >
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

                            <ion-badge
                                v-show="!myRooms.length"
                                color="primary"
                                class="ion-margin"
                            >
                                комнаты отсутствуют
                            </ion-badge>
                        </div>
                    </ion-col>
                </ion-row>
            </ion-grid>

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
import BaseTemplatePage from '@/template/BaseTemplatePage.vue';
import ShowUsersModal from '@/components/ShowUsersModal.vue';

import {
    IonCol,
    IonGrid,
    IonRow,
    IonLabel,
    IonSegment,
    IonSegmentButton,
    IonList,
    IonSearchbar,
    IonBadge,
    actionSheetController,
} from '@ionic/vue';
import { add } from 'ionicons/icons';
import RoomItem from '@/components/RoomItem.vue';
import { socketEventsServer } from '@/types/socket/socketEvents';
import { ref, toRefs, onMounted, computed, watch } from 'vue';
import { useRoomsStore } from '@/store/rooms';
import { useAuthorizationStore } from '@/store/authorization';
import { User } from '@/types/store/user';
import { Room } from '@/types/store/room';
import { useRouter, useRoute } from 'vue-router';

const { rooms, myRooms } = toRefs(useRoomsStore());
const { user: currentUser } = useAuthorizationStore();
const { socket, setCurrentRoom } = useRoomsStore();
const router = useRouter();
const route = useRoute();

const { user, allUsers } = toRefs(useAuthorizationStore());

// Инициализация всех комнат
onMounted(() => {
    socket.emit(socketEventsServer.initialRooms, { user: currentUser as User });
});

//  Внимание это костыль)) так как рендер страниц идет через шаблон слоты хук
//  onMounted   вызывается один раз
watch(
    () => route.path,
    (path: string): void => {
        if (path === '/header/all-rooms') {
            socket.emit(socketEventsServer.initialRooms, {
                user: currentUser as User,
            });
        }
    }
);

// Все комнаты только публичные
const allRooms = computed<Array<Room>>(() => {
    const publicRooms = rooms.value.filter((room: Room) => !room.private);

    // если введена поисковая строка то сортируем по ней
    // data.filter(d => d.toLowerCase().indexOf(query) > -1);
    if (searchQuery.value) {
        return publicRooms.filter(
            (room) =>
                room.name.toLocaleLowerCase().indexOf(searchQuery.value) > -1
        );
    }
    return publicRooms;
});

// поисковая строка для сортировки комнат
const searchQuery = ref<string>('');

// const allRooms = [];

interface Buttons {
    id: number;
    label: string;
    value: string;
}

// кнопки переключатели
const buttons = ref<Array<Buttons>>([
    {
        id: 0,
        label: 'все комнаты',
        value: 'all',
    },
    {
        id: 1,
        label: 'мои комнаты',
        value: 'my',
    },
]);

// выбранная категория комнат
const selectedCategory = ref<string>('all');

const changeCategory = (button: Buttons): void => {
    selectedCategory.value = button.value;
};

// поиск одной комнаты из всех комнат
const searchFromAllRooms = (event: any) => {
    const query = event.target.value.toLowerCase();
    searchQuery.value = query;
    // const data = ['Amsterdam', 'Buenos Aires', 'Cairo', 'Geneva', 'Hong Kong', 'Istanbul', 'London', 'Madrid', 'New York', 'Panama City'];
    // const results = ref(data);
    // this.results = this.data.filter(d => d.toLowerCase().indexOf(query) > -1);
};

// функции для перехода в конкретную комнату
const nextRoom = (room: Room): void => {
    // console.log(room);
    setCurrentRoom(room);
    router.push({ name: 'current-room' });
};

// удаление комнаты если я автор
const deleteRoom = async (room: RoomItem): Promise<any> => {
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
        room: room,
        user: currentUser,
    } as {
        room: Room;
        user: User;
    });

    //  баг надо вернуть переключатель на личное
    // так как происходит рирендер шаблона
    selectedCategory.value = 'my';
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
ion-grid {
    height: 100%;
}

ion-row {
    height: 100%;
}

/* ion-col {
    background-color: var(--ion-color-primary);
    border: solid 1px var(--ion-color-primary-contrast);
    color: var(--ion-color-primary-contrast);
    text-align: center;
} */

.roomItem {
    margin-bottom: 10px;
}

.roomItem:last-child {
    margin-bottom: 0;
}
</style>
