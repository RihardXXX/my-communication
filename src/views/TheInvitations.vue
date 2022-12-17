<template>
    <base-template-page title="все приглашения">
        <template #body>
            <ion-badge
                v-show="!invitedRooms.length"
                color="primary"
                class="ion-margin"
            >
                приглашения отсутствуют
            </ion-badge>
            <ion-list v-show="invitedRooms.length" class="invitedSection">
                <invited-item
                    v-for="item in invitedRooms"
                    :key="item._id"
                    :id="item._id"
                    :room-name="item.name"
                    class="ion-margin-bottom"
                />
            </ion-list>
        </template>
    </base-template-page>
</template>

<script lang="ts" setup>
import { IonBadge, IonList } from '@ionic/vue';
import { useAuthorizationStore } from '@/store/authorization';
import BaseTemplatePage from '@/template/BaseTemplatePage.vue';
import InvitedItem from '@/components/InvitedItem.vue';
import { ref, toRefs } from 'vue';

const authorizationStore = useAuthorizationStore();
const { invitedRooms } = toRefs(authorizationStore);
</script>

<style scoped>
.invitedSection {
    height: 90%;
}
</style>
