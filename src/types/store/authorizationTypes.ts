export interface User {
    _id: string;
    username: string;
    email: string;
    is_active: boolean;
    roomCount: number;
    gender: string;
    invitedRooms: Array<object>;
    createdAt: string;
    updatedAt: string;
    __v: number | 0;
    token: string;
}
