import { InjectionKey } from 'vue';
import { AuthorizationUrlTypes } from '@/types/urls/authorizationUrlTypes';

export const urlAuthorization: AuthorizationUrlTypes = {
    registration: '/authorization/registration',
    login: '/authorization/logIn',
    logout: '/authorization/logOut',
    auth: '/authorization/auth',
    allUsers: '/authorization/allUsers',
    addInvite: '/authorization/addInvite',
    deleteInvite: '/authorization/deleteInvite',
};

export const urlAuth = Symbol() as InjectionKey<AuthorizationUrlTypes>;
