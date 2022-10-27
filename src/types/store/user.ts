export interface User {
    username: string;
    email: string;
    is_active: boolean;
    roomCount: number;
    gender: string;
    invitedRooms: Array<any> | [];
    _id: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
    token: string;
}
