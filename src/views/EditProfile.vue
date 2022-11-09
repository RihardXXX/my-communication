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
            <ion-label class="ion-margin" position="stacked"
                >количество символов {{ currentUsername.length }}</ion-label
            >
            <ion-button
                class="ion-margin"
                color="primary"
                expand="block"
                @click="postNewUsername"
            >
                сохранить новое имя
                <ion-icon slot="end" :icon="newspaperOutline"></ion-icon>
            </ion-button>

            <br />
            <h3 class="ion-margin">сменить пол:</h3>
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

            <br />
            <h3 class="ion-margin">инфо о пользователе</h3>
            <ion-textarea
                :rows="3"
                class="bio"
                :value="bio"
                placeholder="заполните пожалуйста информацию о себе"
                @input="changeBio"
            ></ion-textarea>
            <ion-label class="ion-margin" position="stacked"
                >количество символов {{ bio?.length || '' }}</ion-label
            >
            <ion-button
                class="ion-margin"
                color="primary"
                expand="block"
                @click="postNewBio"
            >
                сохранить инфо
                <ion-icon slot="end" :icon="newspaperOutline"></ion-icon>
            </ion-button>
            <!-- <ion-item class="ion-margin-top">
                <ion-label position="stacked"
                    >сменить почту для входа</ion-label
                >
                <ion-input :value="email" @input="changeEmail"></ion-input>
            </ion-item>
            <ion-button
                class="ion-margin"
                color="primary"
                expand="block"
                @click="postNewEmail"
            >
                сохранить новую почту
                <ion-icon slot="end" :icon="newspaperOutline"></ion-icon>
            </ion-button> -->
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
    IonTextarea,
} from '@ionic/vue';
import { newspaperOutline } from 'ionicons/icons';
import { ref, onMounted, watch } from 'vue';
import { useAuthorizationStore } from '@/store/authorization';

// подключаемся к сторе и получаем состояние авторизации
const authorizationStore = useAuthorizationStore();
const currentUsername = ref<string>('');
const gender = ref<string | undefined>('');
// const email = ref<string | undefined>('');
const bio = ref<string>('');
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
    // устанавливаем почту
    // email.value = authorizationStore.user?.email;
    // устанавливаем биографию
    bio.value = authorizationStore.user?.bio || '';
});

// при смене пола на клиенте запускаем метод для смены его сервере
watch(gender, (newGender, oldGender) => {
    if (newGender && oldGender) {
        postNewGender(newGender);
    }
});

// тут меняем на фронте имя пользователя
const changeUsername = (e: InputEvent): void => {
    if (e) {
        currentUsername.value = e.target.value.trim();
    }
};

// тут меняем биография пользователя
const changeBio = (e: InputEvent): void => {
    if (e) {
        bio.value = e.target.value.trim();
    }
};

// тут меняем на фронте имя пользователя
// const changeEmail = (e: InputEvent): void => {
//     if (e) {
//         email.value = e.target.value.trim();
//     }
// };

// тут делаем запрос на изменение имени пользователя
const postNewUsername = async (): Promise<any> => {
    errors.value = [];

    if (!currentUsername.value) {
        errors.value.push('поле имени не может быть пустым');
        await presentErrors();
        currentUsername.value = authorizationStore.username;
        return;
    }

    if (currentUsername.value.length > 20) {
        errors.value.push('поле имени не может содержать больше 20 символов');
        await presentErrors();
        currentUsername.value = authorizationStore.username;
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
                currentUsername.value = authorizationStore.username;
            }
            presentErrors();
        });
};

// тут делаем запрос на изменение имени пользователя
// const postNewEmail = async (): Promise<any> => {
//     errors.value = [];

//     if (!email.value) {
//         errors.value.push('поле почты не может быть пустым');
//         await presentErrors();
//         email.value = authorizationStore.user?.email;
//         return;
//     }

//     authorizationStore.changeFieldUser(email.value, 'email').catch(() => {
//         const errorMessage: any = authorizationStore.errors;
//         if (typeof errorMessage === 'string') {
//             const result: string = errorMessage.split(':')[2];
//             console.log('errorMessage: ', errorMessage);
//             // console.log(result);
//             errors.value = [result];
//             email.value = authorizationStore.user?.email;
//         }
//         presentErrors();
//     });
// };

// меняем пол пользовтеля
const postNewGender = (newGender: string): void => {
    authorizationStore.changeFieldUser(newGender, 'gender');
};

// меняем биографию пользователя
const postNewBio = async (): Promise<any> => {
    errors.value = [];

    if (bio.value && bio?.value?.length > 200) {
        errors.value.push(
            'поле инфо о пользователе не может содержать больше 200 символов'
        );
        await presentErrors();
        // bio.value = authorizationStore.user?.bio || '';
        return;
    }

    authorizationStore.changeFieldUser(bio.value, 'bio').catch(() => {
        const errorMessage: any = authorizationStore.errors;
        if (typeof errorMessage === 'string') {
            const result: string = errorMessage.split(':')[2];
            // console.log(result);
            errors.value = [result];
            bio.value = authorizationStore.user?.bio || '';
        }
        presentErrors();
    });
};
</script>

<style scoped>
ion-textarea.bio {
    /* --background: var(--ion-color-medium-tint); */
    /* --color: #fff; */
    --padding-end: 10px;
    --padding-start: 10px;
    --placeholder-color: #ddd;
    --placeholder-opacity: 0.8;
    margin: 0 10px;
    border: 1px solid var(--ion-color-primary-shade);
    border-radius: 5px;
}
</style>
