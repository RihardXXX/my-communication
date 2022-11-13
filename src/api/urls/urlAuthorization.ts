import { InjectionKey } from 'vue';
import { AuthorizationUrlTypes } from '@/types/urls/authorizationUrlTypes';

export const urlAuthorization: AuthorizationUrlTypes = {
    registration: '/authorization/registration',
    login: '/authorization/logIn',
    logout: '/authorization/logOut',
    auth: '/authorization/auth',
    allUsers: '/profile/allUsers',
    addInvite: '/profile/addInvite',
    deleteInvite: '/profile/deleteInvite',
    editUser: '/profile/editUser',
    socialNetwork: 'profile/socialNetwork',
};

export const urlAuth = Symbol() as InjectionKey<AuthorizationUrlTypes>;
