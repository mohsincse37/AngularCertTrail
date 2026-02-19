import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../Services/user.service';
import { AuthService } from '../../Services/auth.service';
import { FooterComponent } from '../footer/footer.component';
import { Router } from '@angular/router';

@Component({
    selector: 'app-change-password',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, FooterComponent],
    template: `
    <div class="settings-page py-5">
      <div class="container d-flex justify-content-center">
        <div class="col-lg-6">
          <div class="card border-0 shadow-lg rounded-4 overflow-hidden">
            <div class="card-header bg-dark-glass text-white p-4 text-center glass-effect">
              <i class="bi bi-shield-lock display-5 text-primary mb-2 d-block"></i>
              <h3 class="fw-bold mb-0">Security Settings</h3>
              <p class="text-muted small mb-0">Change your account password</p>
            </div>
            
            <div class="card-body p-4 p-md-5 bg-white">
              <form [formGroup]="pwForm" (ngSubmit)="onSubmit()">
                <div class="mb-4">
                  <label class="form-label fw-bold x-small text-uppercase tracking-wider">Email Address</label>
                  <div class="input-group">
                    <span class="input-group-text bg-light border-end-0 rounded-start-3"><i class="bi bi-envelope text-muted"></i></span>
                    <input type="email" class="form-control bg-light border-start-0 rounded-end-3" formControlName="email" readonly>
                  </div>
                </div>

                <div class="mb-4">
                  <label class="form-label fw-bold x-small text-uppercase tracking-wider">Current Password</label>
                  <div class="input-group">
                    <span class="input-group-text bg-white border-end-0 rounded-start-3"><i class="bi bi-key text-primary"></i></span>
                    <input type="password" class="form-control border-start-0 rounded-end-3 shadow-none" formControlName="oldPassword" placeholder="••••••••">
                  </div>
                </div>

                <hr class="my-4 opacity-50">

                <div class="mb-4">
                  <label class="form-label fw-bold x-small text-uppercase tracking-wider">New Password</label>
                  <div class="input-group">
                    <span class="input-group-text bg-white border-end-0 rounded-start-3"><i class="bi bi-lock-fill text-muted"></i></span>
                    <input type="password" class="form-control border-start-0 rounded-end-3 shadow-none" formControlName="newPassword" placeholder="Minimum 8 characters">
                  </div>
                </div>

                <div class="mb-5">
                  <label class="form-label fw-bold x-small text-uppercase tracking-wider">Confirm New Password</label>
                  <div class="input-group">
                    <span class="input-group-text bg-white border-end-0 rounded-start-3"><i class="bi bi-shield-check text-muted"></i></span>
                    <input type="password" class="form-control border-start-0 rounded-end-3 shadow-none" formControlName="confirmPassword" placeholder="Repeat new password">
                  </div>
                </div>

                <button type="submit" class="btn btn-primary w-100 rounded-pill py-3 fw-bold shadow-lg transition-all" [disabled]="isLoading() || pwForm.invalid">
                  @if (isLoading()) {
                    <span class="spinner-border spinner-border-sm me-2"></span> Updating...
                  } @else {
                    Update Security Details
                  }
                </button>
              </form>
            </div>
          </div>
          
          <div class="text-center mt-4">
            <a href="javascript:history.back()" class="text-muted text-decoration-none small">
              <i class="bi bi-arrow-left me-1"></i> Return to Profile
            </a>
          </div>
        </div>
      </div>
    </div>
    <app-footer></app-footer>
  `,
    styles: [`
    .settings-page { background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); min-height: 100vh; }
    .bg-dark-glass { background-color: #212529 !important; }
    .glass-effect { backdrop-filter: blur(10px); }
    .x-small { font-size: 0.75rem; color: #6c757d; }
    .tracking-wider { letter-spacing: 0.05em; }
    .transition-all { transition: all 0.3s ease; }
    .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(13, 110, 253, 0.3); }
  `]
})
export class ChangePasswordComponent {
    private userService = inject(UserService);
    private authService = inject(AuthService);
    private fb = inject(FormBuilder);
    private router = inject(Router);

    isLoading = signal(false);

    pwForm: FormGroup = this.fb.group({
        email: [{ value: this.authService.currentUser() || '', disabled: false }, [Validators.required, Validators.email]],
        oldPassword: ['', [Validators.required]],
        newPassword: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });

    passwordMatchValidator(g: FormGroup) {
        return g.get('newPassword')?.value === g.get('confirmPassword')?.value
            ? null : { mismatch: true };
    }

    onSubmit() {
        if (this.pwForm.invalid) return;

        this.isLoading.set(true);
        const val = this.pwForm.getRawValue();

        // In a real scenarios, the ID would be extracted from the token or existing user state
        // For the migration, we use the payload structure the backend expects
        this.userService.changePassword(val).subscribe({
            next: (res) => {
                if (res === 1) {
                    alert('Incorrect original password');
                } else {
                    alert('Password successfully updated!');
                    this.router.navigate(['/user']);
                }
                this.isLoading.set(false);
            },
            error: (err) => {
                console.error('Error updating password:', err);
                alert('Failed to update password. Please try again later.');
                this.isLoading.set(false);
            }
        });
    }
}
