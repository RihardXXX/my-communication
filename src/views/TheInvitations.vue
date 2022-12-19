<template>
    <base-template-page title="все приглашения">
        <template #body>
            <ion-badge
                v-show="!invitedRooms.length"
                color="primary"
                class="ion-margin"
            >
                приглашения отсутствуют
            </ion-badge>
            <ion-list v-show="invitedRooms.length" class="invitedSection">
                <invited-item
                    v-for="item in invitedRooms"
                    :key="item._id"
                    :id="item._id"
                    :room-name="item.name"
                    :current-room="item"
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
    // для обновления приглашений после перехода к странице
    authUser();
});

//  Внимание это костыль)) так как рендер страниц идет через шаблон слоты хук
//  onMounted   вызывается один раз
watch(
    () => route.path,
    (path: string): void => {
        if (path === '/header/the-invitations') {
            authUser();
        }
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
        })
        .catch((err) => console.log('err: ', err));
};

interface FilteredInvitedRooms extends Room {
    author: string,
}

// список приглашений с авторами комнат
// const filteredInvitedRooms = computed<Array<FilteredInvitedRooms>>(async () => {
//     return invitedRooms.map(async (room) => {

//     })
// });
</script>

<style scoped>
.invitedSection {
    height: 90%;
}
</style>
