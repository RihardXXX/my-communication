<template>
    <ion-app>
        <ion-router-outlet v-if="step === 2" />
    </ion-app>
</template>

<script lang="ts" setup>
import { IonApp, IonRouterOutlet, loadingController } from '@ionic/vue';
import { onMounted, watch, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthorizationStore } from '@/store/authorization';

// подключаемся к сторе и получаем состояние авторизации
const authorizationStore = useAuthorizationStore();
const router = useRouter();

const showLoading = async (miliSecond: number) => {
    const loading = await loadingController.create({
        message: 'загрузка',
        duration: miliSecond,
        spinner: 'circles',
    });

    loading.present();
};

const step = ref<number>(1);

// отслеживаем статус авторизации в приложения
watch(
    (): boolean => authorizationStore.isLoggedIn,
    (status): void => {
        // console.log('status old: ', statusOld)
        // console.log('status: ', status)
        if (status) {
            router.push({ name: 'all-rooms' });
            step.value = 2;
        }
    }
);

onMounted(async () => {
    // запускаем спиннер загрузки
    showLoading(1000);
    // запускаем проверку авторизации пользователя при запуске приложения
    await authorizationStore.authUser();
});
</script>
