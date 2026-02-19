import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../Services/user.service';
import { User } from '../../Models/user';
import { FooterComponent } from '../footer/footer.component';

@Component({
    selector: 'app-user-mgt',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, FooterComponent],
    template: `
    <div class="management-page py-5">
      <div class="container">
        <div class="card border-0 shadow-lg rounded-4 overflow-hidden mb-5">
          <div class="card-header bg-dark text-white p-4 d-flex justify-content-between align-items-center">
            <h3 class="mb-0 fw-bold"><i class="bi bi-people-fill me-2 text-primary"></i> User Management</h3>
            <button class="btn btn-primary rounded-pill fw-bold shadow-sm" (click)="openModal()">
              <i class="bi bi-person-plus-fill me-1"></i> Add User
            </button>
          </div>
          
          <div class="card-body p-4">
            <div class="mb-4">
              <div class="input-group overflow-hidden rounded-pill border-dark shadow-sm">
                <span class="input-group-text bg-white border-0 ps-4">
                  <i class="bi bi-search text-primary"></i>
                </span>
                <input 
                  type="text" 
                  class="form-control border-0 py-3 shadow-none" 
                  placeholder="Search by name, email or mobile..." 
                  [(ngModel)]="searchTerm"
                >
              </div>
            </div>

            <div class="table-responsive rounded-3 border">
              <table class="table table-hover align-middle mb-0">
                <thead class="table-light">
                  <tr>
                    <th class="ps-4">SL</th>
                    <th>User Name</th>
                    <th>Email</th>
                    <th>Mobile</th>
                    <th>Status</th>
                    <th class="text-end pe-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  @for (user of filteredUsers(); track user.id; let idx = $index) {
                    <tr>
                      <td class="ps-4 fw-bold text-muted">{{ idx + 1 }}</td>
                      <td>
                        <div class="d-flex align-items-center">
                          <div class="avatar-circle me-3">{{ user.userName.charAt(0).toUpperCase() }}</div>
                          <span class="fw-bold">{{ user.userName }}</span>
                        </div>
                      </td>
                      <td>{{ user.email }}</td>
                      <td>{{ user.mobileNo }}</td>
                      <td>
                        <span class="badge rounded-pill" [class.bg-success]="user.hasPayment === 1" [class.bg-secondary]="user.hasPayment !== 1">
                          {{ user.hasPayment === 1 ? 'Premium' : 'Standard' }}
                        </span>
                      </td>
                      <td class="text-end pe-4">
                        <div class="btn-group shadow-sm rounded-pill overflow-hidden">
                          <button class="btn btn-outline-dark border-0 py-2 px-3" (click)="openModal(user)">
                            <i class="bi bi-pencil-square text-primary"></i>
                          </button>
                          <button class="btn btn-outline-dark border-0 py-2 px-3" (click)="deleteUser(user.id)">
                            <i class="bi bi-trash text-danger"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  } @empty {
                    <tr>
                      <td colspan="6" class="text-center py-5">
                        <i class="bi bi-person-x display-1 text-muted opacity-25"></i>
                        <p class="mt-3 text-muted">No users found. Start adding members to your platform!</p>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal for User Add/Edit -->
    @if (showModal()) {
      <div class="modal fade show d-block" style="background: rgba(0,0,0,0.5); backdrop-filter: blur(5px);">
        <div class="modal-dialog modal-dialog-centered modal-lg">
          <div class="modal-content border-0 shadow-lg rounded-4">
            <div class="modal-header bg-dark text-white p-4">
              <h5 class="modal-title fw-bold">
                {{ isEditMode() ? 'Modify User Profile' : 'Register New User' }}
              </h5>
              <button type="button" class="btn-close btn-close-white shadow-none" (click)="closeModal()"></button>
            </div>
            <div class="modal-body p-4 bg-light">
              <form [formGroup]="userForm">
                <div class="row g-4">
                  <div class="col-md-6">
                    <label class="form-label fw-bold">Full Name</label>
                    <input type="text" class="form-control rounded-3 border-dark-subtle shadow-none" formControlName="userName" placeholder="John Doe">
                  </div>
                  <div class="col-md-6">
                    <label class="form-label fw-bold">Email Address</label>
                    <input type="email" class="form-control rounded-3 border-dark-subtle shadow-none" formControlName="email" placeholder="john@example.com">
                  </div>
                  <div class="col-md-6">
                    <label class="form-label fw-bold">Mobile Number</label>
                    <input type="tel" class="form-control rounded-3 border-dark-subtle shadow-none" formControlName="mobileNo" placeholder="+1234567890">
                  </div>
                  <div class="col-md-6">
                    <label class="form-label fw-bold">Age</label>
                    <input type="number" class="form-control rounded-3 border-dark-subtle shadow-none" formControlName="age">
                  </div>
                  @if (!isEditMode()) {
                    <div class="col-md-12">
                      <label class="form-label fw-bold">Initial Password</label>
                      <input type="password" class="form-control rounded-3 border-dark-subtle shadow-none" formControlName="userPass" placeholder="Minimum 8 characters">
                    </div>
                  }
                  <div class="col-md-12">
                    <label class="form-label fw-bold">Residential Address</label>
                    <textarea class="form-control rounded-3 border-dark-subtle shadow-none" rows="3" formControlName="address" placeholder="123 Street, City..."></textarea>
                  </div>
                </div>
              </form>
            </div>
            <div class="modal-footer p-4 border-top-0 d-flex justify-content-between">
              <button type="button" class="btn btn-outline-secondary rounded-pill px-4" (click)="closeModal()">Cancel</button>
              <button type="button" class="btn btn-primary rounded-pill px-5 fw-bold shadow-sm" (click)="saveUser()">
                {{ isEditMode() ? 'Update User' : 'Save User' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    }

    <app-footer></app-footer>
  `,
    styles: [`
    .management-page { background: #f8f9fa; min-height: 100vh; }
    .avatar-circle {
      width: 40px;
      height: 40px;
      background: #0d6efd;
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
    }
  `]
})
export class UserMgtComponent implements OnInit {
    private userService = inject(UserService);
    private fb = inject(FormBuilder);

    users = signal<User[]>([]);
    searchTerm = '';
    showModal = signal(false);
    isEditMode = signal(false);
    editingId: number | null = null;

    userForm: FormGroup = this.fb.group({
        userName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        mobileNo: ['', Validators.required],
        age: ['', Validators.required],
        address: [''],
        userPass: ['']
    });

    ngOnInit() {
        this.loadUsers();
    }

    loadUsers() {
        this.userService.getUsers().subscribe(data => this.users.set(data));
    }

    filteredUsers() {
        if (!this.searchTerm) return this.users();
        const term = this.searchTerm.toLowerCase();
        return this.users().filter(u =>
            u.userName.toLowerCase().includes(term) ||
            u.email.toLowerCase().includes(term) ||
            u.mobileNo?.toLowerCase().includes(term)
        );
    }

    openModal(user?: User) {
        if (user) {
            this.isEditMode.set(true);
            this.editingId = user.id;
            this.userForm.patchValue({
                userName: user.userName,
                email: user.email,
                mobileNo: user.mobileNo,
                age: user.age,
                address: user.address,
                userPass: ''
            });
            this.userForm.get('userPass')?.clearValidators();
        } else {
            this.isEditMode.set(false);
            this.editingId = null;
            this.userForm.reset();
            this.userForm.get('userPass')?.setValidators([Validators.required, Validators.minLength(8)]);
        }
        this.userForm.get('userPass')?.updateValueAndValidity();
        this.showModal.set(true);
    }

    closeModal() {
        this.showModal.set(false);
    }

    saveUser() {
        if (this.userForm.invalid) {
            alert('Please fill all required fields correctly');
            return;
        }

        const userData = this.userForm.value;
        if (this.isEditMode() && this.editingId) {
            this.userService.updateUser(this.editingId, userData).subscribe({
                next: () => {
                    this.loadUsers();
                    this.closeModal();
                },
                error: (err) => console.error('Error updating user:', err)
            });
        } else {
            this.userService.addUser(userData).subscribe({
                next: () => {
                    this.loadUsers();
                    this.closeModal();
                },
                error: (err) => console.error('Error adding user:', err)
            });
        }
    }

    deleteUser(id: number) {
        if (confirm('Are you sure you want to delete this user?')) {
            this.userService.deleteUser(id).subscribe({
                next: () => this.loadUsers(),
                error: (err) => console.error('Error deleting user:', err)
            });
        }
    }
}
