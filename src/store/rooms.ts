import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { socketEventsClient } from '@/types/socket/socketEvents';
import { useSocketIO } from '@/api/socketio/socket-io-client';
import { Room } from '@/types/store/room';
import { Message } from '@/types/store/message';
import { User } from '@/types/store/user';

export const useRoomsStore = defineStore('rooms', () => {
    // объект работы с сокетами
    const { socket } = useSocketIO();

    // комнаты
    const rooms = ref<Array<Room>>([]);
    // текущая комната
    const currentRoom = ref<Room | null>(null);
    // массив ошибок
    const errors = ref<Array<string>>([]);
    // комнаты созданные мною
    const myRooms = ref<Array<Room>>([]);

    // инициализация комнат
    (function initialRoomsClient(): void {
        socket.on(
            socketEventsClient.initialRoomsClient,
            (allRooms: Array<Room>): void => {
                rooms.value = allRooms;
            }
        );
    })();

    // инициализация только моих комнат
    (function getMyRooms(): void {
        socket.on(
            socketEventsClient.getMyRooms,
            (resMyRooms: Array<Room>): void => {
                myRooms.value = resMyRooms;
            }
        );
    })();

    // обновляем на клиенте текущую комнату
    (function updateCurrentRoom(): void {
        socket.on(
            socketEventsClient.updateCurrentRoom,
            (updateCurrentRoom: Room): void => {
                // console.log('updateCurrentRoom: ', updateCurrentRoom);
                currentRoom.value = updateCurrentRoom;
            }
        );
    })();

    // инициализация ошибок с сервера при работе с комнатами
    (function setError(): void {
        socket.on(socketEventsClient.setError, (arr: Array<string>): void => {
            errors.value = arr;
        });
    })();

    // добавление ошибок с компонента
    function addError(message: string): void {
        errors.value.push(message);
    }
    // удаление ошибок всех интерфейс с компонента
    function deleteError() {
        errors.value = [];
    }

    // установка текущей комнаты
    function setCurrentRoom(room: Room): void {
        currentRoom.value = room;
    }

    // геттеры
    // const allRooms = computed<Array<Room>>(() => rooms.value);
    // const allMyRooms = computed<Array<Room>>(() => myRooms.value);
    const messagesCurrentRoom = computed<Array<Message> | []>(() => {
        return currentRoom.value?.messages || [];
    });
    const usersCurrentRoom = computed<Array<User> | undefined>(() => {
        return currentRoom.value?.users;
    });

    return {
        rooms,
        currentRoom,
        errors,
        myRooms,
        addError,
        deleteError,
        setCurrentRoom,
        messagesCurrentRoom,
        usersCurrentRoom,
        socket,
        // allRooms,
        // allMyRooms,
    };
});
