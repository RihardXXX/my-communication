<template>
    <detail-template-page :title="roomName" fixed-header>
        <template #body>
            <room-item
                room-name="пользователей"
                :total="usersCurrentRoom?.length"
                class="ion-margin-top"
                @click="showUsers"
            />

            <ion-list class="ion-margin-top">
                <ion-item
                    v-for="messageItem in messagesCurrentRoom"
                    :ref="(el) => (messageRef[messageItem._id] = el)"
                    :key="messageItem._id"
                    @click="setName(messageItem)"
                >
                    <ion-chip
                        :slot="
                            messageItem.user._id === user?._id ? 'end' : 'start'
                        "
                    >
                        <ion-label>{{ messageItem.user.username }}</ion-label>
                    </ion-chip>
                    <ion-label class="ion-text-wrap">
                        {{ messageItem.message_body }}
                    </ion-label>
                </ion-item>
            </ion-list>

            <ion-item class="ion-margin-top">
                <form @submit.prevent="sendMessage">
                    <ion-input
                        ref="inputRef"
                        placeholder="введите текст"
                        :maxlength="60"
                        :value="textMessage"
                        @ion-input="setTextMessage"
                    ></ion-input>
                    <ion-button fill="outline" type="form"
                        >отправить</ion-button
                    >
                </form>
            </ion-item>

            <div class="footerPage">
                <ion-badge>{{ textMessage.length }}</ion-badge>

                <ion-button @click="upOrDownList">
                    <ion-icon
                        slot="icon-only"
                        :icon="chevronDownCircleOutline"
                        :class="{ upDown: upDownIcon }"
                    ></ion-icon>
                </ion-button>
            </div>

            <show-users-modal
                :is-show-users-modal="isShowUsersModal"
                :users="usersCurrentRoomNotMe"
                @set-is-show-users-modal="
                    (status) => (isShowUsersModal = status)
                "
            />
        </template>
    </detail-template-page>
</template>

<script lang="ts" setup>
import DetailTemplatePage from '@/template/DetailTemplatePage.vue';
import RoomItem from '@/components/RoomItem.vue';
import ShowUsersModal from '@/components/ShowUsersModal.vue';
import {
    toastController,
    IonList,
    IonItem,
    IonLabel,
    IonChip,
    IonInput,
    IonButton,
    alertController,
    // IonicSafeString,
    IonBadge,
    IonIcon,
} from '@ionic/vue';
import { chevronDownCircleOutline } from 'ionicons/icons';
import { useAuthorizationStore } from '@/store/authorization';
import { useRoomsStore } from '@/store/rooms';
import { onMounted, toRefs, ref, onUnmounted, watch, computed } from 'vue';
import { Room } from '@/types/store/room';
import { socketEventsServer } from '@/types/socket/socketEvents';
import { User } from '@/types/store/user';
import { Message } from '@/types/store/message';

const roomName = computed<string | undefined>(() => currentRoom.value?.name);

// глобальное состояние пользователя и комнат
const { user } = toRefs(useAuthorizationStore());
const { currentRoom, messagesCurrentRoom, usersCurrentRoom, errors } = toRefs(
    useRoomsStore()
);

// текущие пользователи в комнате без меня
const usersCurrentRoomNotMe = computed<Array<User> | undefined>(() => {
    return usersCurrentRoom.value?.filter(
        (userItem) => userItem._id !== user.value?._id
    );
});

// объект сокета должен быть один чтобы по айди цеплялись события
// реактивность не требуется
const { socket, setCurrentRoom } = useRoomsStore();

onMounted(async () => {
    socket.emit(socketEventsServer.joinedRooms, {
        user: user.value,
        room: currentRoom.value,
    });
    // приветствие о том что вошли в комнату
    await welcomeRoom('bottom');
});

onUnmounted(() => {
    // выходим из текущей комнаты
    // когда пользователь выходит сообщаем остальным что пользователь вышел
    socket.emit(socketEventsServer.exitRoom, {
        user: user.value,
        room: currentRoom.value,
        changeRoom: false,
    } as {
        user: User;
        room: Room;
        changeRoom: boolean;
    });
    // при выходе очищаем комнату
    setCurrentRoom(null);
});

// всплывающее уведомление о том, что вошел в комнату
const welcomeRoom = async (
    position: 'top' | 'middle' | 'bottom'
): Promise<any> => {
    const toast = await toastController.create({
        message: `вы вошли в комнату ${roomName.value}`,
        duration: 2500,
        position: position,
    });
    await toast.present();
};

const presentAlert = async (text: string) => {
    const alert = await alertController.create({
        message: text,
        buttons: ['OK'],
    });

    await alert.present();
};

// текст сообщения
const textMessage = ref<string>('');

// установка текста сообщения
const setTextMessage = (event): void => {
    textMessage.value = event.target.value.trim();
};

// элемент инпут
const inputRef = ref(null);

watch(
    (): string | '' => textMessage.value,
    (newValue: string | ''): void => {
        if (newValue.length === 60) {
            presentAlert('сообщение не больше 60 символос');
            textMessage.value = textMessage.value.slice(0, 60);
        }
    }
);

// отправить сообщение
const sendMessage = () => {
    if (!textMessage.value) {
        presentAlert('заполните поле для отправки сообщения');
        return;
    }

    const currentUser = user.value;

    socket.emit(socketEventsServer.createNewMessage, {
        text: textMessage.value,
        room: currentRoom.value,
        user: currentUser,
    });

    textMessage.value = '';
};

// обратится к конкретному пользователю
const setName = (message: Message): void => {
    // тут делаем сторожевую вышку
    // чтобы пользователь сам себе не могу устанавливать имя
    if (message.user._id === user.value?._id) {
        return;
    }
    const text = `@${message.user.username}: `;
    textMessage.value = text;
    inputRef.value?.$el.setFocus();
};

// Реализация плавного скрола к последнему сообщению а также инверсия в обратном порядеке
// переменная которая меняет позиционирования кнопки
const upDownIcon = ref<boolean>(false);
// ссылки на рефы сообщений
const messageRef = ref([]);

// функция которая скроллит автоматически к определенному элементу
const nextMessageScroll = (
    _id: string,
    duration: number,
    divs: object
): void => {
    setTimeout(() => {
        const element: HTMLElement = divs[_id].$el;
        element?.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }, duration);
};

// поднимаемся по сообщениям и спускаемся плавно
// если спустились то включаем авто спуск для новых сообщений
const upOrDownList = (): void => {
    // перемещаем стрелку, отключаем автоскролл вниз
    upDownIcon.value = !upDownIcon.value;
    // скроллим плавно к верхнем элементу если включен режим вверх
    if (messagesCurrentRoom.value.length && upDownIcon.value) {
        // скроллим к первому верхнему элементу
        const _id = messagesCurrentRoom.value[0]._id;
        nextMessageScroll(_id, 1000, messageRef.value);
    } else {
        // включаем режим авто скролла и скроллим к последнему элементу
        const _id =
            messagesCurrentRoom.value[messagesCurrentRoom.value.length - 1]._id;
        nextMessageScroll(_id, 1000, messageRef.value);
    }
};

// тут следим за списком и у определенного списка докручиваем скролл
watch(
    () => messagesCurrentRoom.value,
    (messages) => {
        // console.log(messages, messages);

        if (messages.length && !upDownIcon.value) {
            // тут будем делать скрол как получим ответ от сервера
            const _id = messages[messages.length - 1]._id;
            nextMessageScroll(_id, 1500, messageRef.value);
        }
    }
);

// показ модалки с пользователями
const isShowUsersModal = ref<boolean>(false);

const showUsers = () => {
    isShowUsersModal.value = !isShowUsersModal.value;
};
</script>

<style scoped>
form {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
/* ion-label {
    max-width: 70%;
} */

/* ion-content {
    --offset-top: 0;
    --offset-bottom: 0;
} */

ion-list {
    height: 75%;
    overflow: auto;
}

.footerPage {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

ion-icon {
    transition: all 1s;
}

.upDown {
    transform: rotate(180deg);
}
</style>
