import { io } from 'socket.io-client';

export const useSocketIO = () => {
    const socket = io('http://192.168.0.102:3000');
    return {
        socket,
    };
};
