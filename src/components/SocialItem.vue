<template>
    <ion-item>
        <ion-icon :icon="changeIcon(type)" slot="start"></ion-icon>
        <a :href="path" target="_blank">{{ label }}</a>
        <ion-button v-if="isDelete" slot="end" @click="removeSocial">
            <ion-icon :icon="trashOutline"></ion-icon>
        </ion-button>
    </ion-item>
</template>

<script lang="ts" setup>
import { IonItem, IonIcon, IonButton } from '@ionic/vue';
import { useAuthorizationStore } from '@/store/authorization';

import {
    logoYoutube,
    logoFacebook,
    logoTwitter,
    logoInstagram,
    logoTiktok,
    logoVk,
    trashOutline,
} from 'ionicons/icons';
import { withDefaults, toRefs, defineProps } from 'vue';

const authorizationStore = useAuthorizationStore();

interface Props {
    id?: string;
    type?: string;
    path: string;
    isDelete?: boolean;
    label: string;
}

const props = withDefaults(defineProps<Props>(), {
    type: '',
    isDelete: false,
    id: '',
});

const { type, path, isDelete, id } = toRefs(props);

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

// фунукция которая возврвщает иконку в зависмости от типа отправленных данных
const changeIcon = (typeIcon: string): string => {
    const isIcon = Object.keys(socialTypes).includes(typeIcon);

    // console.log('isIcon: ', isIcon);
    // если с бэка не приходит тип иконки
    if (!typeIcon) {
        return '';
        // если тип иконки имеется в шаблоне то возвращаем его
    } else if (isIcon) {
        return socialTypes[typeIcon];
    } else {
        // если тип иконки есть но в шаблоне его нет
        return '';
    }
};

// удалить указанную соц сеть
const removeSocial = () => {
    if (!id) {
        console.log('отсутствует айди');
        return;
    }

    authorizationStore.removeNewSocialNetWork(id.value);
};
</script>
