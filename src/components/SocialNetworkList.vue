<template>
    <ion-card-subtitle class="ion-padding">социальные сети</ion-card-subtitle>
    <template v-if="socialNetwork?.length">
        <social-item
            v-for="social in socialNetwork"
            :key="social.path"
            :id="social?.id"
            :type="social.type"
            :label="social.label"
            :path="social.path"
            :is-delete="isDelete"
        />
    </template>
    <ion-item v-else>
        <p>социальные сети отсутствуют</p>
    </ion-item>
</template>

<script lang="ts" setup>
import { IonCardSubtitle, IonItem } from '@ionic/vue';
import SocialItem from '@/components/SocialItem.vue';
import { withDefaults, toRefs, defineProps } from 'vue';

interface Props {
    socialNetwork?: Array<any>;
    isDelete?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    socialNetwork: () => [],
    isDelete: false,
});

const { socialNetwork, isDelete } = toRefs(props);
</script>
