// Интерфейс и объект для вызова событий от клиента серверу
interface SocketEventsServer {
    updateAllRooms: string;
    updateMyRooms: string;
    initialRooms: string;
    createNewMessage: string;
    joinedRooms: string;
    exitRoom: string;
    createNewRoom: string;
    deleteMyRoom: string;
}

interface SocketEventsClient {
    initialRoomsClient: string;
    getMyRooms: string;
    setError: string;
    updateCurrentRoom: string;
    updateUserClient: string;
}

const socketEventsServer: SocketEventsServer = {
    updateAllRooms: 'updateAllRooms',
    updateMyRooms: 'updateMyRooms',
    initialRooms: 'initialRooms',
    createNewMessage: 'createNewMessage',
    joinedRooms: 'joinedRooms',
    exitRoom: 'exitRoom',
    createNewRoom: 'createNewRoom',
    deleteMyRoom: 'deleteMyRoom',
};

const socketEventsClient: SocketEventsClient = {
    initialRoomsClient: 'initialRoomsClient',
    getMyRooms: 'getMyRooms',
    setError: 'setError',
    updateCurrentRoom: 'updateCurrentRoom',
    updateUserClient: 'updateUserClient',
};

export { socketEventsServer, socketEventsClient };
