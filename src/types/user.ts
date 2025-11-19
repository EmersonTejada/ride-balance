export interface User {
    id: string;
    username?: string;
    email: string;
} 

export interface NewUser {
    email: string;
    password: string;
}

export interface LoginUser {
    email: string
    password: string
}