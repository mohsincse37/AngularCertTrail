import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../Services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RegistrationRequest } from '../../Models/auth';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule, RouterLink],
    template: `
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <h2>Create Account</h2>
          <p>Join us to manage your certifications</p>
        </div>
        
        <form [formGroup]="registerForm" (ngSubmit)="onRegister()">
          <div class="form-group">
            <label class="form-label ms-1 small text-muted">User Name</label>
            <input type="text" formControlName="userName" class="form-control" placeholder="johndoe">
          </div>

          <div class="form-group">
            <label class="form-label ms-1 small text-muted">Email Address</label>
            <input type="email" formControlName="email" class="form-control" placeholder="name@example.com">
          </div>
          
          <div class="form-group">
            <label class="form-label ms-1 small text-muted">Password</label>
            <input type="password" formControlName="password" class="form-control" placeholder="••••••••">
          </div>
          
          <button type="submit" [disabled]="registerForm.invalid || isLoading" class="btn-login">
            <span *ngIf="!isLoading">Register</span>
            <span *ngIf="isLoading" class="spinner-border spinner-border-sm me-2"></span>
            <span *ngIf="isLoading">Creating account...</span>
          </button>
          
          <div *ngIf="errorMessage" class="error-message">
            <i class="bi bi-exclamation-triangle-fill me-2"></i>
            {{ errorMessage }}
          </div>

          <div class="text-center mt-4">
            <p class="small text-muted">Already have an account? <a routerLink="/login" class="text-primary text-decoration-none fw-bold">Login</a></p>
          </div>
        </form>
      </div>
    </div>
  `,
    styleUrl: '../login/login.css'
})
export class RegisterComponent {
    private fb = inject(FormBuilder);
    private authService = inject(AuthService);
    private router = inject(Router);

    errorMessage: string | null = null;
    isLoading = false;

    registerForm = this.fb.group({
        userName: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]]
    });

    onRegister() {
        if (this.registerForm.valid) {
            this.isLoading = true;
            this.errorMessage = null;

            this.authService.register(this.registerForm.value as RegistrationRequest).subscribe({
                next: (res) => {
                    this.isLoading = false;
                    if (res.success) {
                        this.router.navigate(['/user']);
                    } else {
                        this.errorMessage = res.errors?.join(', ') || 'Registration failed';
                    }
                },
                error: (err) => {
                    this.isLoading = false;
                    this.errorMessage = 'An error occurred. Please check your connection.';
                }
            });
        }
    }
}
