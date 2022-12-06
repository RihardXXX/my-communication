<template>
    <ion-page :style="fixedHeader ? { overflow: 'initial' } : ''">
        <ion-header>
            <ion-toolbar color="primary">
                <ion-buttons>
                    <ion-back-button text="назад"></ion-back-button>
                </ion-buttons>
                <ion-title slot="end">{{ title }}</ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-content :fullscreen="true" class="ion-padding">
            <slot name="body"></slot>
        </ion-content>
    </ion-page>
</template>

<script lang="ts" setup>
import { IonToolbar, IonTitle, IonButtons, IonBackButton } from '@ionic/vue';
import { withDefaults, toRefs, defineProps } from 'vue';

interface Props {
    title?: string;
    fixedHeader?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    title: '',
    fixedHeader: false,
});

const { title } = toRefs(props);
</script>

<style scode></style>
