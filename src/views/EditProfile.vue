<template>
    <detail-template-page title="редактирование">
        <template #body>
            <ion-item>
                <ion-label position="stacked">введите новое имя</ion-label>
                <ion-input
                    :value="currentUsername"
                    @input="changeUsername"
                ></ion-input>
            </ion-item>
            <ion-button
                class="ion-margin"
                color="primary"
                expand="block"
                @click="postNewUsername"
            >
                сохранить
                <ion-icon slot="end" :icon="newspaperOutline"></ion-icon>
            </ion-button>
            <br />
            <h2 class="ion-margin">сменить пол:</h2>
            <ion-radio-group :value="gender" v-model="gender">
                <ion-item>
                    <ion-label>
                        <code>муж</code>
                    </ion-label>
                    <ion-radio value="муж"></ion-radio>
                </ion-item>
                <ion-item>
                    <ion-label>
                        <code>жен</code>
                    </ion-label>
                    <ion-radio value="жен"></ion-radio>
                </ion-item>
            </ion-radio-group>
        </template>
    </detail-template-page>
</template>

<script lang="ts" setup>
import DetailTemplatePage from '@/template/DetailTemplatePage.vue';
import {
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonIcon,
    alertController,
    IonRadioGroup,
    IonRadio,
} from '@ionic/vue';
import { newspaperOutline } from 'ionicons/icons';
import { ref, onMounted, watchEffect } from 'vue';
import { useAuthorizationStore } from '@/store/authorization';

// подключаемся к сторе и получаем состояние авторизации
const authorizationStore = useAuthorizationStore();
const currentUsername = ref<string>('');
const gender = ref<string | undefined>('');
const errors = ref<Array<string>>([]);

// модалка с ошибкой
const presentErrors = async () => {
    const alert = await alertController.create({
        header: 'внимание',
        // subHeader: 'Important message',
        message: errors.value,
        buttons: ['OK'],
    });

    await alert.present();
};

onMounted(async () => {
    // делаем запрос на обновления состояния пользователя
    await authorizationStore.authUser();
    // устанавливаем из сторы имя пользователя в инпут
    currentUsername.value = authorizationStore.username;
    // устанавливаем пол пользователя после прогрузки данных
    gender.value = authorizationStore.user?.gender;
});

// при смене пола на клиенте запускаем метод для смены его сервере
// watchEffect(() => gender.value, (newGender: string) => {
//     console.log(newGender)
// })

// тут меняем на фронте имя пользователя
const changeUsername = (e: InputEvent): void => {
    if (e) {
        currentUsername.value = e.target.value.trim();
    }
};
// тут делаем запрос на изменение имени пользователя
const postNewUsername = async (): Promise<any> => {
    errors.value = [];

    if (!currentUsername.value) {
        errors.value.push('поле имени не может быть пустым');
        presentErrors();
        return;
    }

    if (currentUsername.value.length > 20) {
        errors.value.push('поле имени не может содержать больше 20 символов');
        presentErrors();
        return;
    }

    authorizationStore
        .changeFieldUser(currentUsername.value, 'username')
        .catch(() => {
            const errorMessage: any = authorizationStore.errors;
            if (typeof errorMessage === 'string') {
                const result: string = errorMessage.split(':')[2];
                // console.log(result);
                errors.value = [result];
            }
            presentErrors();
        });
};

// меняем пол пользовтеля
const postNewGender = () => {
    console.log('postNewGender');
};
</script>
>
