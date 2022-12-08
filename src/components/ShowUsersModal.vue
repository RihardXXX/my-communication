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
                @ionChange="searchUserFromRoom($event)"
            ></ion-searchbar>

            <ion-accordion-group v-show="filteredUsers.length" class="ion-margin">
                <ion-accordion
                    v-for="userItem in filteredUsers"
                    :key="userItem._id"
                    :value="userItem._id"
                >
                    <ion-item slot="header" color="light">
                        <ion-label>{{ userItem.username }}</ion-label>
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
} from '@ionic/vue';
import { User } from '@/types/store/user';
import {
    withDefaults,
    defineProps,
    toRefs,
    defineEmits,
    ref,
    computed,
} from 'vue';
import BioCard from '@/components/BioCard.vue';

interface Props {
    isShowUsersModal?: boolean;
    users?: Array<User> | [] | undefined;
}

const props = withDefaults(defineProps<Props>(), {
    isShowUsersModal: false,
    users: () => [],
});

const { users, isShowUsersModal } = toRefs(props);

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
