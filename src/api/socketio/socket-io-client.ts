import { io } from 'socket.io-client';

export const useSocketIO = () => {
    const socket = io('https://my-communication-ru.onrender.com/');
    return {
        socket,
    };
};
