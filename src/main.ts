import { createApp } from 'vue';
import App from '@/App.vue';
import router from '@/router';
import { createPinia } from 'pinia';
import VueAxios from 'vue-axios';
import axiosApp from '@/api/axios/axios';

import { urlAuthorization, urlAuth } from '@/api/urls/urlAuthorization';

import { IonicVue, IonPage, IonHeader, IonContent } from '@ionic/vue';

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';

/* Theme variables */
import '@/theme/variables.css';

// инициализируем ананас
const pinia = createPinia();

// создаём приложение
const app = createApp(App);

// подключаем айоник
app.use(IonicVue);
// подключаем ананас
app.use(pinia);

// подключаем роутер
app.use(router);
// подключаем axios
app.use(VueAxios, axiosApp);

// провайдим axios через всё приложение
app.provide('axios', app.config.globalProperties.axios);
// внедряем url пути для авторизации
app.provide(urlAuth, urlAuthorization);

// глобально регистрация компонентов
app.component('ion-page', IonPage);
app.component('ion-header', IonHeader);
app.component('ion-content', IonContent);

router.isReady().then(() => {
    app.mount('#app');
});
