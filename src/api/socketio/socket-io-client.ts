import { io } from 'socket.io-client';

export const useSocketIO = () => {
    const socket = io('http://192.168.0.103:3000');
    return {
        socket,
    };
};
