<template>
    <base-template-page title="Список комнат">
        <template #body>
            <ion-grid :fixed="true">
                <ion-row>
                    <ion-col>
                        <ion-segment value="all">
                            <ion-segment-button
                                v-for="button in buttons"
                                :key="button.id"
                                :value="button.value"
                                @click="() => changeCategory(button)"
                            >
                                <ion-label>{{ button.label }}</ion-label>
                            </ion-segment-button>
                        </ion-segment>
                        <br />
                        {{ selectedCategory }}
                    </ion-col>
                </ion-row>
            </ion-grid>
        </template>
    </base-template-page>
</template>

<script lang="ts" setup>
import BaseTemplatePage from '@/template/BaseTemplatePage.vue';
import {
    IonCol,
    IonGrid,
    IonRow,
    IonLabel,
    IonSegment,
    IonSegmentButton,
} from '@ionic/vue';
import { ref } from 'vue';

interface Buttons {
    id: number;
    label: string;
    value: string;
}

// кнопки переключатели
const buttons = ref<Array<Buttons>>([
    {
        id: 0,
        label: 'все комнаты',
        value: 'all',
    },
    {
        id: 1,
        label: 'мои комнаты',
        value: 'my',
    },
]);

// выбранная категория комнат
const selectedCategory = ref<string>('all');

const changeCategory = (button: Buttons): void => {
    selectedCategory.value = button.value;
};
</script>

<style scoped>
ion-grid {
    height: 100%;
}

ion-row {
    height: 100%;
}

/* ion-col {
    background-color: var(--ion-color-primary);
    border: solid 1px var(--ion-color-primary-contrast);
    color: var(--ion-color-primary-contrast);
    text-align: center;
} */
</style>
