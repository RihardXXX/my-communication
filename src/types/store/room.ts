import { User } from '@/types/store/user';

export interface Room {
    __v: number;
    _id: string;
    author: string;
    messages: Array<any>;
    name: string;
    private: boolean;
    topic: string;
    updated_at: string;
    users: Array<User>;
}
