<template>
    <detail-template-page :title="roomName">
        <template #body>
            {{ roomName }}
        </template>
    </detail-template-page>
</template>

<script lang="ts" setup>
import DetailTemplatePage from '@/template/DetailTemplatePage.vue';
import { useRoomsStore } from '@/store/rooms';
import { computed, toRefs } from 'vue';
import { Room } from '@/types/store/room';

const { currentRoom } = toRefs(useRoomsStore());

const roomName = computed<string | undefined>(() => currentRoom.value?.name);
</script>

<style scoped></style>
