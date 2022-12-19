<template>
    <ion-modal :is-open="isShowUsersModal">
        <ion-header>
            <ion-toolbar>
                <ion-title>пользователи</ion-title>
                <ion-buttons slot="end">
                    <ion-button @click="showHiddenModal">закрыть</ion-button>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>

        <ion-content class="ion-padding">
            <ion-searchbar
                placeholder="поиск пользователя в комнате"
                :debounce="1500"
                :disabled="!users.length"
                @ionChange="searchUserFromRoom($event)"
            ></ion-searchbar>

            <ion-accordion-group
                v-show="filteredUsers.length"
                class="ion-margin"
            >
                <ion-accordion
                    v-for="userItem in filteredUsers"
                    :key="userItem._id"
                    :value="userItem._id"
                >
                    <ion-item slot="header" color="light">
                        <ion-label>{{ userItem.username }}</ion-label>
                    </ion-item>

                    <ion-item
                        slot="content"
                        v-show="isInvitedMode"
                        class="ion-margin-bottom"
                    >
                        <ion-label>{{
                            isChecked(userItem) ? 'приглашен' : 'пригласить'
                        }}</ion-label>

                        <ion-toggle
                            color="tertiary"
                            :checked="isChecked(userItem)"
                            @ionChange.stop="() => changeInvited(userItem)"
                        ></ion-toggle>
                    </ion-item>

                    <bio-card
                        slot="content"
                        :id="userItem._id"
                        :email="userItem.email"
                        :gender="userItem.gender"
                        :roomCount="userItem.roomCount"
                        :invitedRooms="userItem.invitedRooms"
                        :bio="userItem.bio"
                        :socialNetwork="userItem.socialNetwork"
                        class-container="noPadding"
                    />
                </ion-accordion>
            </ion-accordion-group>
        </ion-content>
    </ion-modal>
</template>

<script lang="ts" setup>
import {
    IonButton,
    IonModal,
    IonHeader,
    IonToolbar,
    IonContent,
    IonTitle,
    IonButtons,
    IonSearchbar,
    IonAccordion,
    IonAccordionGroup,
    IonItem,
    IonLabel,
    IonToggle,
} from '@ionic/vue';
import { User } from '@/types/store/user';
import {
    withDefaults,
    defineProps,
    toRefs,
    defineEmits,
    ref,
    computed,
    inject,
    onMounted,
} from 'vue';
import BioCard from '@/components/BioCard.vue';
import { Room } from '@/types/store/room';
import { useAuthorizationStore } from '@/store/authorization';
import { urlAuthorization } from '@/api/urls/urlAuthorization';
import { AxiosResponse } from 'axios';
import { AuthorizationUrlTypes } from '@/types/urls/authorizationUrlTypes';
import { urlAuth } from '@/api/urls/urlAuthorization';

const urls = inject<AuthorizationUrlTypes>(urlAuth);
const axios = inject<any>('axios');

const authorizationStore = useAuthorizationStore();
const { getAllUsers } = authorizationStore;

//  необходимо обновлять состояние всех пользователей при открытии окна
// так как после внесение изменений они должны быть актуальными
onMounted((): void => {
    getAllUsers();
});

interface Props {
    isShowUsersModal?: boolean;
    users?: Array<User> | [] | undefined;
    isInvitedMode?: boolean;
    invitedRoom?: Room | null;
}

const props = withDefaults(defineProps<Props>(), {
    isShowUsersModal: false,
    users: () => [],
    isInvitedMode: false,
    invitedRoom: null,
});

const { users, isShowUsersModal, invitedRoom } = toRefs(props);

const emit = defineEmits<{
    (e: 'setIsShowUsersModal', statusModal: boolean): void;
}>();

const showHiddenModal = (): void => {
    emit('setIsShowUsersModal', !isShowUsersModal.value);
};

// поисковая строка поиска юзера
const queryUser = ref<string>('');

// установка поиска юзера в текущей комнате
const searchUserFromRoom = (event: any): void => {
    const userSearch = event.target.value.toLowerCase();
    queryUser.value = userSearch;
};

// фильтрация пользователей по поиску
const filteredUsers = computed<Array<User>>(() => {
    const usersData = [...users.value];

    if (queryUser.value) {
        return usersData.filter(
            (user: User) =>
                user.username.toLocaleLowerCase().indexOf(queryUser.value) > -1
        );
    }
    return usersData;
});

// секция приглашение в комнату приватную
const isChecked = (userItem: User): boolean => {
    return userItem.invitedRooms.some(
        (room: Room) => room._id === invitedRoom.value?._id
    );
};

const changeInvited = (userItem: User): void => {
    const url = urls?.addInvite;

    axios
        .post(url, {
            data: {
                invitedUser: userItem,
                invitedRoom: invitedRoom.value,
            } as {
                invitedUser: User;
                invitedRoom: Room | null;
            },
        })
        .then(() => {
            console.log('ok');
            // после добавления приглашения обновлояем состояние комнат
            getAllUsers();
        })
        .catch((err) => {
            console.log('err: ', err);
        });
};
</script>

<style scoped>
ion-accordion {
    margin-bottom: 3px;
    border-radius: 5px;
}

ion-accordion:last-child {
    margin-bottom: 0;
}

.noPadding {
    padding: 0;
    margin-bottom: 10px;
}
</style>
