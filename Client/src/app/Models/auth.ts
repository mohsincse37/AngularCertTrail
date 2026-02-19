export interface LoginResponse {
    token: string;
    refreshToken: string;
    email: string;
    success: boolean;
    errors: string[] | null;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegistrationRequest {
    email: string;
    password: string;
    userName: string;
}
