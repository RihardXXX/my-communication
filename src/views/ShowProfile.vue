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

                <ion-card-content>
                    <ion-card-title class="ion-padding"
                        >Моя анкета</ion-card-title
                    >
                    <ion-item v-show="gender">
                        <ion-label slot="start">пол:</ion-label>
                        <ion-label slot="start">{{ gender }}</ion-label>
                        <ion-icon
                            :icon="transgenderOutline"
                            slot="end"
                        ></ion-icon>
                    </ion-item>
                    <ion-item v-show="roomCount">
                        <ion-label
                            >комнат можно создать: {{ roomCount }}</ion-label
                        >
                        <ion-icon
                            :icon="chatboxEllipsesOutline"
                            slot="end"
                        ></ion-icon>
                    </ion-item>
                    <ion-item v-show="invitedRooms">
                        <ion-label
                            >приглашений: {{ invitedRooms?.length }}</ion-label
                        >
                        <ion-icon :icon="checkboxOutline" slot="end"></ion-icon>
                    </ion-item>
                    <ion-card-subtitle v-show="bio" class="ion-padding"
                        >биография</ion-card-subtitle
                    >
                    <ion-item v-show="bio">
                        <p>{{ bio }}</p>
                    </ion-item>

                    <ion-card-subtitle class="ion-padding"
                        >социальные сети</ion-card-subtitle
                    >
                    <ion-item>
                        <ion-icon
                            :icon="transgenderOutline"
                            slot="start"
                        ></ion-icon>
                        <ion-router-link color="secondary" href="#"
                            >Secondary</ion-router-link
                        >
                    </ion-item>
                </ion-card-content>
            </ion-card>
        </template>
    </detail-template-page>
</template>

<script lang="ts" setup>
import {
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonAvatar,
    IonChip,
    IonLabel,
    IonItem,
    IonIcon,
} from '@ionic/vue';
import {
    informationCircle,
    star,
    transgenderOutline,
    chatboxEllipsesOutline,
    checkboxOutline,
    logoYoutube,
    logoFacebook,
    logoTwitter,
    logoInstagram,
    logoTiktok,
    logoVk,
} from 'ionicons/icons';
import DetailTemplatePage from '@/template/DetailTemplatePage.vue';
import { toRefs, onMounted, computed } from 'vue';
import { useAuthorizationStore } from '@/store/authorization';
import { Room } from '@/types/store/room';

const authorizationStore = useAuthorizationStore();

// на всякий случай обновляем состояние данных пользователя если при редактировании
// не обновили состояния
onMounted(() => {
    authorizationStore.authUser();
});

// распаковываем данные для просмотра нашего профиля
const { user } = toRefs(authorizationStore);

const username = computed<string | undefined>(() => user.value?.username);
const gender = computed<string | undefined>(() => user.value?.gender);
const roomCount = computed<number | undefined>(() => user.value?.roomCount);
const invitedRooms = computed<Array<Room> | undefined>(
    () => user.value?.invitedRooms
);
const img = computed<string | undefined>(() => user.value?.img);
const bio = computed<string | undefined>(() => user.value?.bio);
const socialNetwork = computed<Array<any> | undefined>(
    () => user.value?.socialNetwork
);

interface SocialTypes {
    youtube: string;
    facebook: string;
    twitter: string;
    instagram: string;
    vk: string;
    tiktok: string;
}

const socialTypes: SocialTypes = {
    youtube: logoYoutube,
    facebook: logoFacebook,
    twitter: logoTwitter,
    instagram: logoInstagram,
    vk: logoVk,
    tiktok: logoTiktok,
};

// const changeIcon = (typeIcon: string): string => {
//     const isIcon = Object.keys(socialNetwork)
// }

const test = [
    {
        path: '',
        label: '',
        type: '',
    },
    {
        path: '',
        label: '',
        type: '',
    },
    {
        path: '',
        label: '',
        type: '',
    },
    {
        path: '',
        label: '',
        type: '',
    },
];
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
</style>
