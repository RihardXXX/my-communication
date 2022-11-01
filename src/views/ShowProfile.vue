<template>
    <detail-template-page title="просмотр профиля">
        <template #body>
            <ion-card color="medium">
                <ion-card-header>
                    <ion-chip>
                        <ion-avatar>
                            <img
                                alt="Silhouette of a person's head"
                                src="https://ionicframework.com/docs/img/demos/avatar.svg"
                            />
                        </ion-avatar>
                        <ion-label>Chip Avatar</ion-label>
                    </ion-chip>
                </ion-card-header>

                <ion-card-content>
                    <ion-card-title>Card Title</ion-card-title>
                    <ion-card-subtitle>Card Subtitle</ion-card-subtitle>
                    content
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
} from '@ionic/vue';
import DetailTemplatePage from '@/template/DetailTemplatePage.vue';
import { toRefs, onMounted, computed } from 'vue';
import { useAuthorizationStore } from '@/store/authorization';

const authorizationStore = useAuthorizationStore();

// на всякий случай обновляем состояние данных пользователя если при редактировании
// не обновили состояния
onMounted(() => {
    authorizationStore.authUser();
});

// распаковываем данные для просмотра нашего профиля
const { user } = toRefs(authorizationStore);

const gender = computed<string | undefined>(() => user.value?.gender);
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
</style>
