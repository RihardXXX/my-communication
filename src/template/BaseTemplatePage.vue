<template>
    <ion-page>
        <ion-header>
            <ion-toolbar color="primary">
                <ion-title>{{ title }}</ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-content :fullscreen="true" class="ion-padding">
            <slot name="body"></slot>
        </ion-content>
    </ion-page>
</template>

<script lang="ts" setup>
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
} from '@ionic/vue';
import { withDefaults, toRefs, defineProps } from 'vue';

interface Props {
    title?: string;
}

const props = withDefaults(defineProps<Props>(), {
    title: '',
});

const { title } = toRefs(props);
</script>

<style lang="scss" scoped></style>
