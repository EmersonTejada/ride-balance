export interface User {
    userId: string;
    name?: string;
    email: string;
}

export interface NewUser {
    email: string;
    password: string;
    name: string;
}

export interface LoginUser {
    email: string
    password: string
}