import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { LoginRequest, LoginResponse, RegistrationRequest } from '../Models/auth';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private http = inject(HttpClient);
    private router = inject(Router);
    private apiUrl = environment.apiBaseUrl + '/Auth/';

    // Signals for state management
    currentUser = signal<string | null>(localStorage.getItem('userEmail'));
    isAuthenticated = signal<boolean>(!!localStorage.getItem('token'));

    login(data: LoginRequest): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(this.apiUrl + 'login', data).pipe(
            tap((res) => {
                if (res.success) {
                    this.setSession(res);
                }
            })
        );
    }

    register(data: RegistrationRequest): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(this.apiUrl + 'register', data).pipe(
            tap((res) => {
                if (res.success) {
                    this.setSession(res);
                }
            })
        );
    }

    private setSession(authResult: LoginResponse) {
        localStorage.setItem('token', authResult.token);
        localStorage.setItem('refreshToken', authResult.refreshToken);
        if (authResult.email) {
            localStorage.setItem('userEmail', authResult.email);
            this.currentUser.set(authResult.email);
        }
        this.isAuthenticated.set(true);
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userEmail');
        this.isAuthenticated.set(false);
        this.currentUser.set(null);
        this.router.navigate(['/login']);
    }

    getToken() {
        return localStorage.getItem('token');
    }

    getRefreshToken() {
        return localStorage.getItem('refreshToken');
    }

    refreshToken(token: string, refreshToken: string): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(this.apiUrl + 'refresh', { token, refreshToken });
    }
}
