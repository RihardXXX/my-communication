<template>
    <base-template-page title="все приглашения">
        <template #body>
            <!-- <pre>
                {{ filteredInvitedRooms }}
            </pre> -->
            <ion-badge
                v-show="!filteredInvitedRooms.length"
                color="primary"
                class="ion-margin"
            >
                приглашения отсутствуют
            </ion-badge>
            <ion-list
                v-show="filteredInvitedRooms.length"
                class="invitedSection"
            >
                <invited-item
                    v-for="item in filteredInvitedRooms"
                    :key="item._id"
                    :id="item._id"
                    :room-name="item.name"
                    :current-room="item"
                    :author="item.inviteUser"
                    class="ion-margin-bottom"
                    @apply="applyInvite"
                    @cancel="cancelInvite"
                />
            </ion-list>
        </template>
    </base-template-page>
</template>

<script lang="ts" setup>
import { IonBadge, IonList } from '@ionic/vue';
import { useAuthorizationStore } from '@/store/authorization';
import BaseTemplatePage from '@/template/BaseTemplatePage.vue';
import InvitedItem from '@/components/InvitedItem.vue';
import { ref, toRefs, inject, onMounted, watch, computed } from 'vue';
import { Room } from '@/types/store/room';
import { AuthorizationUrlTypes } from '@/types/urls/authorizationUrlTypes';
import { User } from '@/types/store/user';
import { urlAuth } from '@/api/urls/urlAuthorization';
import { AxiosResponse } from 'axios';
import { useRoute } from 'vue-router';

const authorizationStore = useAuthorizationStore();
const { invitedRooms, user } = toRefs(authorizationStore);
const { authUser, setCurrentUser } = authorizationStore;
const route = useRoute();

onMounted(() => {
    console.log('onMounted the-invitations');
    // для обновления приглашений после перехода к странице
    authUser();
    initialFilteredRooms();
});

//  Внимание это костыль)) так как рендер страниц идет через шаблон слоты хук
//  onMounted   вызывается один раз
watch(
    (): string => route.path,
    async (path: string): Promise<any> => {
        if (path === '/header/the-invitations') {
            console.log('watch the-invitations');
            authUser();
            initialFilteredRooms();
        }
    }
);

// обновление состояние приглашений сразу после добавлеения приглашения
watch(
    (): number => invitedRooms.value.length,
    (): void => {
        initialFilteredRooms();
    }
);

const urls = inject<AuthorizationUrlTypes>(urlAuth);
const axios = inject<any>('axios');

// принять или отклонить приглашение
const applyInvite = (currentRoom: Room): void => {
    console.log('apply invite currentRoom: ', currentRoom);
    // тут сделаем переход в комнату
};

const cancelInvite = (currentRoom: Room): void => {
    console.log('cancel invite currentRoom: ', currentRoom);
    // а тут отклоним приглашение
    const url = urls?.deleteInvite;

    axios
        .post(url, {
            data: {
                currentUser: user.value,
                invitedRoom: currentRoom,
            } as {
                currentUser: User;
                invitedRoom: Room;
            },
        })
        .then((response: AxiosResponse) => {
            console.log('ok', response.data.user);
            // обновляем состояние приглашений а именно состояние данных пользователя
            setCurrentUser(response.data.user);
            // а также состояние комнат
            initialFilteredRooms();
        })
        .catch((err) => console.log('err: ', err));
};

interface FilteredInvitedRooms extends Room {
    inviteUser: string | any;
}
const filteredInvitedRooms = ref<Array<FilteredInvitedRooms> | []>([]);

// по айди автора комнаты делаем запросы чтобы получить имя автора комнаты кто приглашал нас
const initialFilteredRooms = async () => {
    //  имя того кто приглашал добавляем
    let ids: Array<string> = [];

    ids = invitedRooms.value.map((room: Room): string => room.author);

    const responses = await Promise.all(
        ids.map((id) => {
            const url = urls?.getUserByid(id);
            return axios.get(url);
        })
    );

    const result = invitedRooms.value.map(
        (room: Room, index: number): FilteredInvitedRooms => {
            return {
                ...room,
                inviteUser: responses[index].data.user.username,
            } as FilteredInvitedRooms;
        }
    );

    filteredInvitedRooms.value = result;
};
</script>

<style scoped>
.invitedSection {
    height: 90%;
}
</style>
