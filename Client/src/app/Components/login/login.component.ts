import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../Services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  template: `
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <h2>Welcome Back</h2>
          <p>Login to manage certifications</p>
        </div>
        
        <form [formGroup]="loginForm" (ngSubmit)="onLogin()">
          <div class="form-group">
            <label class="form-label ms-1 small text-muted">Email Address</label>
            <input type="email" formControlName="email" class="form-control" placeholder="name@example.com">
          </div>
          
          <div class="form-group">
            <label class="form-label ms-1 small text-muted">Password</label>
            <input type="password" formControlName="password" class="form-control" placeholder="••••••••">
          </div>
          
          <button type="submit" [disabled]="loginForm.invalid || isLoading" class="btn-login">
            <span *ngIf="!isLoading">Login</span>
            <span *ngIf="isLoading" class="spinner-border spinner-border-sm me-2"></span>
            <span *ngIf="isLoading">Logging in...</span>
          </button>
          
          <div *ngIf="errorMessage" class="error-message">
            <i class="bi bi-exclamation-triangle-fill me-2"></i>
            {{ errorMessage }}
          </div>

          <div class="text-center mt-4">
            <p class="small text-muted">Don't have an account? <a routerLink="/register" class="text-primary text-decoration-none fw-bold">Register</a></p>
          </div>
        </form>
      </div>
    </div>
  `,
  styleUrl: './login.css'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  errorMessage: string | null = null;
  isLoading = false;

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  onLogin() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = null;

      this.authService.login(this.loginForm.value as any).subscribe({
        next: (res) => {
          this.isLoading = false;
          if (res.success) {
            this.router.navigate(['/user']);
          } else {
            this.errorMessage = res.errors?.join(', ') || 'Invalid credentials';
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
