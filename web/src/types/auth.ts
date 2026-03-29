export type RegisterRequest = {
    firstname: string;
    lastname: string;
    middlename: string;
    email: string;
    password: string;
}

export type LoginRequest = {
    email: string;
    password: string;
}

export type AuthResponse = {
    accessToken: string;
    tokenType: string;
}

export type ApiResponse = {
    success: boolean;
    message: string;
}