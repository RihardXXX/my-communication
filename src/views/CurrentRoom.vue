<template>
    <detail-template-page :title="roomName">
        <template #body>
            <room-item
                room-name="пользователей"
                :total="2"
                class="ion-margin-top"
                @click="showUsers"
            />
        </template>
    </detail-template-page>
</template>

<script lang="ts" setup>
import DetailTemplatePage from '@/template/DetailTemplatePage.vue';
import RoomItem from '@/components/RoomItem.vue';
import { toastController } from '@ionic/vue';
import { useRoomsStore } from '@/store/rooms';
import { computed, toRefs, onMounted } from 'vue';
import { Room } from '@/types/store/room';

const { currentRoom } = toRefs(useRoomsStore());

const roomName = computed<string | undefined>(() => currentRoom.value?.name);

onMounted(async () => {
    // приветствие о том что вошли в комнату
    await welcomeRoom('bottom')
});

// всплывающее уведомление о том, что вошел в комнату
const welcomeRoom = async (position: 'top' | 'middle' | 'bottom' ): Promise<any> => {
    const toast = await toastController.create({
          message: `вы вошли в комнату ${roomName.value}`,
          duration: 2500,
          position: position
        });
        await toast.present();
}

const showUsers = () => {
    console.log('showUsers');
}

</script>

<style scoped></style>
