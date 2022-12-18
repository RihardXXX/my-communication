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
import { ref, toRefs, inject } from 'vue';
import { Room } from '@/types/store/room';
import { AuthorizationUrlTypes } from '@/types/urls/authorizationUrlTypes';
import { urlAuth } from '@/api/urls/urlAuthorization';
import { AxiosResponse } from 'axios';

const authorizationStore = useAuthorizationStore();
const { invitedRooms } = toRefs(authorizationStore);

const urls = inject<AuthorizationUrlTypes>(urlAuth);
const axios = inject<any>('axios');

// принять или отклонить приглашение
const applyInvite = (currentRoom: Room): void => {
    console.log('apply invite currentRoom: ', currentRoom);
    // тут сделаем переход в комнату
}

const cancelInvite = (currentRoom: Room): void => {
    console.log('cancel invite currentRoom: ',currentRoom);
    // а тут отклоним приглашение
    const url = urls?.deleteInvite;

    axios
        .post(url, {
            // data: {
            //     invitedUser: userItem,
            //     invitedRoom: invitedRoom.value,
            // } as {
            //     invitedUser: User;
            //     invitedRoom: Room | null;
            // },
        })
        .then(() => {
            console.log('ok');
            // после добавления приглашения обновлояем состояние комнат
            // getAllUsers();
        })
        .catch((err) => {
            // console.log('err: ', err);
        });
}
</script>

<style scoped>
.invitedSection {
    height: 90%;
}
</style>
