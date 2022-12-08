<template>
    <detail-template-page title="просмотр профиля">
        <template #body>
            <ion-card color="medium">
                <ion-card-header>
                    <ion-chip>
                        <ion-avatar>
                            <img
                                alt="Silhouette of a person's head"
                                :src="
                                    img
                                        ? img
                                        : 'https://ionicframework.com/docs/img/demos/avatar.svg'
                                "
                            />
                        </ion-avatar>
                        <ion-label>{{ username }}</ion-label>
                    </ion-chip>
                </ion-card-header>

                <bio-card
                    :id="idUser"
                    :email="email"
                    :gender="gender"
                    :roomCount="roomCount"
                    :invitedRooms="invitedRooms"
                    :bio="bio"
                    :socialNetwork="socialNetwork"
                />
            </ion-card>
        </template>
    </detail-template-page>
</template>

<script lang="ts" setup>
import DetailTemplatePage from '@/template/DetailTemplatePage.vue';
import {
    IonCard,
    IonCardHeader,
    IonAvatar,
    IonChip,
    IonLabel,
} from '@ionic/vue';
import { toRefs, onMounted, computed } from 'vue';
import { useAuthorizationStore } from '@/store/authorization';
import { Room } from '@/types/store/room';
import BioCard from '@/components/BioCard.vue';

const authorizationStore = useAuthorizationStore();

// на всякий случай обновляем состояние данных пользователя если при редактировании
// не обновили состояния
onMounted(() => {
    authorizationStore.authUser();
});

// распаковываем данные для просмотра нашего профиля
const { user } = toRefs(authorizationStore);

const idUser = computed<string | undefined>(() => user.value?._id);
const username = computed<string | undefined>(() => user.value?.username);
const gender = computed<string | undefined>(() => user.value?.gender);
const email = computed<string | undefined>(() => user.value?.email);
const roomCount = computed<number | undefined>(() => user.value?.roomCount);
const invitedRooms = computed<Array<Room> | undefined>(
    () => user.value?.invitedRooms
);
const img = computed<string | undefined>(() => user.value?.img);
const bio = computed<string | undefined>(() => user.value?.bio);
const socialNetwork = computed<Array<any> | undefined>(() =>
    user.value?.socialNetwork?.filter((social) => social)
);
</script>

<style scode>
ion-card {
    height: 100%;
}
/* iOS places the subtitle above the title */
ion-card-header.ios {
    display: flex;
    flex-flow: column-reverse;
}

ion-item {
    border-radius: 0.5rem;
    margin-bottom: 0.2rem;
}

ion-item:last-child {
    margin-bottom: 0;
}

a {
    color: var(--ion-color-medium);
    text-decoration: none;
}

ion-label {
    margin: 0;
}
</style>
