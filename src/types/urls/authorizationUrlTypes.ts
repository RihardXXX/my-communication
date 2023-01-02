export interface AuthorizationUrlTypes {
    registration: string;
    login: string;
    logout: string;
    auth: string;
    authVk: string;
    allUsers: string;
    addInvite: string;
    deleteInvite: string;
    editUser: string;
    socialNetwork: string;
    getUserByid: (a: string) => string;
}
