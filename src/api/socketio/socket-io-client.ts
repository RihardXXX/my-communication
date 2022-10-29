import { io } from 'socket.io-client';

export const useSocketIO = () => {
    const socket = io('http://192.168.0.101:3000');
    return {
        socket,
    };
};
