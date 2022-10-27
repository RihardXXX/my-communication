import { User } from '@/types/store/user';

export interface Message {
    room: string;
    user: User;
    message_body: string;
    message_status: boolean;
    created_at: string;
    _id: string;
}
