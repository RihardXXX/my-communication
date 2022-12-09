<template>
    <ion-card-content :class="classContainer">
        <ion-card-title class="ion-padding">{{
            isMaster ? 'Моя анкета' : 'Анкета'
        }}</ion-card-title>
        <ion-item v-show="email && isMaster">
            <ion-label slot="start">почта:</ion-label>
            <ion-label slot="start">{{ email }}</ion-label>
            <ion-icon :icon="mailOutline" slot="end"></ion-icon>
        </ion-item>
        <ion-item v-show="gender">
            <ion-label slot="start">пол:</ion-label>
            <ion-label slot="start">{{ gender }}</ion-label>
            <ion-icon :icon="transgenderOutline" slot="end"></ion-icon>
        </ion-item>
        <ion-item v-show="roomCount && isMaster">
            <ion-label>можно создать: {{ roomCount }}</ion-label>
            <ion-icon :icon="chatboxEllipsesOutline" slot="end"></ion-icon>
        </ion-item>
        <ion-item v-show="invitedRooms && isMaster">
            <ion-label>приглашений: {{ invitedRooms?.length }}</ion-label>
            <ion-icon :icon="checkboxOutline" slot="end"></ion-icon>
        </ion-item>
        <ion-card-subtitle class="ion-padding">биография</ion-card-subtitle>
        <ion-item>
            <p class="ion-padding-vertical">
                {{ bio || 'биография отсутствует' }}
            </p>
        </ion-item>

        <social-network-list :socialNetwork="socialNetwork" />
    </ion-card-content>
</template>

<script lang="ts" setup>
import { Room } from '@/types/store/room';
import { withDefaults, defineProps, toRefs, computed } from 'vue';
import {
    IonCardContent,
    IonCardSubtitle,
    IonCardTitle,
    IonLabel,
    IonItem,
    IonIcon,
} from '@ionic/vue';
import {
    transgenderOutline,
    chatboxEllipsesOutline,
    checkboxOutline,
    mailOutline,
} from 'ionicons/icons';
import SocialNetworkList from '@/components/SocialNetworkList.vue';
import { useAuthorizationStore } from '@/store/authorization';

interface Props {
    id: string | undefined;
    email?: string | undefined;
    gender?: string | undefined;
    roomCount?: number | undefined;
    invitedRooms?: Array<Room> | undefined;
    bio?: string | undefined;
    socialNetwork?: Array<any> | undefined;
    classContainer?: Array<any> | string | undefined;
}

const props = withDefaults(defineProps<Props>(), {
    email: '',
    gender: '',
    roomCount: undefined,
    invitedRooms: () => [],
    bio: '',
    socialNetwork: () => [],
    classContainer: '',
});

const { email, gender, roomCount, invitedRooms, bio, socialNetwork, id } =
    toRefs(props);

// если не владелец что скрывать почту и другую ценную информацию
const authorizatonStore = useAuthorizationStore();

const { user } = authorizatonStore;

const isMaster = computed<boolean>(() => {
    return user?._id === id.value;
});
</script>

<style scoped>
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

ion-card {
    overflow: auto;
}

ion-label {
    margin: 0;
}
</style>
