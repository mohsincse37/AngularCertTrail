import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../Services/cart.service';
import { AuthService } from '../../Services/auth.service';
import { FooterComponent } from '../footer/footer.component';
import { Router, RouterLink } from '@angular/router';

@Component({
    selector: 'app-cart',
    standalone: true,
    imports: [CommonModule, FooterComponent, RouterLink],
    template: `
    <div class="cart-page py-5">
      <div class="container">
        <div class="row g-4">
          <!-- Cart Items -->
          <div class="col-lg-8">
            <div class="card border-0 shadow-lg rounded-4 overflow-hidden">
              <div class="card-header bg-success text-white p-4">
                <h3 class="mb-0 fw-bold"><i class="bi bi-cart-check-fill me-2"></i> Certification Cart</h3>
              </div>
              <div class="card-body p-4 bg-light">
                <div class="table-responsive">
                  <table class="table table-hover align-middle mb-0">
                    <thead class="table-light">
                      <tr>
                        <th class="ps-4">Topic</th>
                        <th>Access</th>
                        <th>Duration</th>
                        <th>Amount</th>
                        <th class="text-end pe-4">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      @for (item of cartService.cartItems(); track item.id) {
                        <tr>
                          <td class="ps-4">
                            <div class="d-flex align-items-center">
                              <img src="http://localhost:5241/{{ item.topicTitle === 'Certification' ? '' : 'images/' }}{{ item.id }}.jpg" 
                                   class="rounded-3 border shadow-sm me-3" style="width: 50px; height: 50px; object-fit: cover;"
                                   onerror="this.src='assets/placeholder.jpg'">
                              <span class="fw-bold">{{ item.topicTitle }}</span>
                            </div>
                          </td>
                          <td><span class="badge bg-success-subtle text-success">{{ item.accessTypeText }}</span></td>
                          <td>{{ item.accessDuration }}{{ item.durationUnitText }}</td>
                          <td><span class="fw-bold">{{ item.amount }} {{ item.amountUnit }}</span></td>
                          <td class="text-end pe-4">
                            <button class="btn btn-outline-danger border-0 rounded-circle py-2" (click)="cartService.removeFromCart(item.id)">
                              <i class="bi bi-trash3"></i>
                            </button>
                          </td>
                        </tr>
                      } @empty {
                        <tr>
                          <td colspan="5" class="text-center py-5">
                            <i class="bi bi-cart-x display-1 text-muted opacity-25"></i>
                            <h4 class="mt-3 text-muted">Your cart is empty</h4>
                            <a routerLink="/home" class="btn btn-primary rounded-pill mt-3 px-4 fw-bold">Browse Certifications</a>
                          </td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              </div>
              @if (cartService.cartCount() > 0) {
                <div class="card-footer bg-white p-4 border-top-0 d-flex justify-content-between align-items-center">
                  <h4 class="mb-0 fw-bold">Total Amount:</h4>
                  <h3 class="mb-0 fw-bold text-success">{{ cartService.cartTotal().toFixed(2) }} USD</h3>
                </div>
              }
            </div>
          </div>

          <!-- Summary & User Info -->
          @if (cartService.cartCount() > 0) {
            <div class="col-lg-4">
              <div class="card border-0 shadow-lg rounded-4 overflow-hidden mb-4">
                <div class="card-header bg-dark text-white p-4">
                  <h5 class="mb-0 fw-bold">User Information</h5>
                </div>
                <div class="card-body p-4 bg-light">
                  <div class="user-info-item mb-3">
                    <label class="text-muted small d-block">Full Name</label>
                    <span class="fw-bold">{{ authService.currentUser() }}</span>
                  </div>
                  <div class="user-info-item mb-3">
                    <label class="text-muted small d-block">Account Level</label>
                    <span class="badge bg-primary">Standard Member</span>
                  </div>
                  <div class="alert alert-info border-0 rounded-4 mt-4 small">
                    <i class="bi bi-info-circle-fill me-2"></i>
                    Your access will be activated immediately after successful payment.
                  </div>
                </div>
              </div>

              <div class="card border-0 shadow-lg rounded-4 overflow-hidden">
                <div class="card-body p-4">
                  <button class="btn btn-primary w-100 rounded-pill py-3 fw-bold shadow mb-3" (click)="onCheckout()">
                    <i class="bi bi-paypal me-2"></i> Proceed to Checkout
                  </button>
                  <p class="text-center text-muted x-small mb-0">Secure SSL Encrypted Payment</p>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
    <app-footer></app-footer>
  `,
    styles: [`
    .cart-page { background-color: #f0f7f4; min-height: 100vh; }
    .bg-success-subtle { background-color: #e6f4ea; }
    .x-small { font-size: 0.75rem; }
  `]
})
export class CartComponent {
    public cartService = inject(CartService);
    public authService = inject(AuthService);
    private router = inject(Router);

    onCheckout() {
        if (!this.authService.isAuthenticated()) {
            this.router.navigate(['/login']);
            return;
        }

        // In a real application, this would trigger the PayPal SDK interaction.
        // For the migration demo, we will simulate a successful payment.
        if (confirm('Simulate PayPal Payment success?')) {
            alert('Payment Successful! Your subscription is now active.');
            this.cartService.clearCart();
            this.router.navigate(['/user']);
        }
    }
}
