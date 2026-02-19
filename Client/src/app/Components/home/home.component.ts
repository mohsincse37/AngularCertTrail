import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CertificationService } from '../../Services/certification.service';
import { CartService } from '../../Services/cart.service';
import { CertificationTopic, CertificationScheme } from '../../Models/certification';
import { HeroComponent } from './hero.component';
import { FooterComponent } from '../footer/footer.component';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HeroComponent, FooterComponent, RouterLink, FormsModule],
  template: `
    <app-hero></app-hero>

    <div class="container py-5">
      <div class="section-title text-center mb-5">
        <h2 class="display-5 fw-bold text-gradient">Certification Topics</h2>
        <p class="text-muted">Explore our wide range of certification preparation materials</p>
      </div>

      <div class="row g-4">
        @for (topic of topics(); track topic.topicID) {
          <div class="col-12 col-md-6 col-lg-4">
            <div class="card h-100 certification-card border-0 shadow-sm hover-elevate transition-all">
              <div class="position-relative overflow-hidden">
                <img 
                  [src]="topic.topicImgPath ? 'http://localhost:5241/' + topic.topicImgPath : 'assets/placeholder.jpg'" 
                  class="card-img-top certification-img" 
                  [alt]="topic.topicTitle"
                >
                <div class="price-tag">{{ topic.amount }}{{ topic.amountUnit }}</div>
              </div>
              <div class="card-body p-4 d-flex flex-column">
                <h5 class="card-title fw-bold mb-2">{{ topic.topicTitle }}</h5>
                <p class="card-text text-muted small mb-4 flex-grow-1">{{ topic.topicDetail }}</p>
                
                <div class="details-grid mb-4">
                  <div class="detail-item">
                    <i class="bi bi-shield-check text-primary me-2"></i>
                    <span>{{ topic.accessTypeText }}</span>
                  </div>
                  <div class="detail-item mt-2">
                    <i class="bi bi-clock text-primary me-2"></i>
                    <span>{{ topic.accessDuration }} {{ topic.durationUnitText }}</span>
                  </div>
                </div>

                <div class="d-flex gap-2">
                  <button class="btn btn-outline-primary rounded-pill flex-grow-1 fw-bold py-2" (click)="openOtherScheme(topic)">
                    Other Scheme
                  </button>
                  <button 
                    class="btn rounded-pill flex-grow-1 fw-bold py-2 shadow-sm"
                    [class.btn-primary]="!cartService.isInCart(topic.id!)"
                    [class.btn-success]="cartService.isInCart(topic.id!)"
                    (click)="addToCart(topic)"
                  >
                    <i class="bi" [class.bi-cart-plus]="!cartService.isInCart(topic.id!)" [class.bi-check-lg]="cartService.isInCart(topic.id!)"></i>
                    {{ cartService.isInCart(topic.id!) ? 'In Cart' : 'Add to Cart' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        } @empty {
          <div class="col-12 text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-3 text-muted">Loading available topics...</p>
          </div>
        }
      </div>
    </div>

    <!-- Modal for Other Scheme -->
    @if (showSchemeModal()) {
      <div class="modal fade show d-block" style="background: rgba(0,0,0,0.5); backdrop-filter: blur(5px);">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
            <div class="modal-header bg-primary text-white p-4">
              <h5 class="modal-title fw-bold">Customize Subscription</h5>
              <button type="button" class="btn-close btn-close-white" (click)="closeModal()"></button>
            </div>
            <div class="modal-body p-4 bg-light">
              <div class="mb-4 text-center">
                <h6 class="text-muted mb-2">Selected Topic</h6>
                <h5 class="fw-bold">{{ activeTopic()?.topicTitle }}</h5>
              </div>

              <div class="mb-3">
                <label class="form-label fw-bold">Access Type</label>
                <select class="form-select rounded-3 border-2 border-primary-subtle" [(ngModel)]="selectedAccessType" (change)="updateModalAmount()">
                  @for (type of accessTypes(); track type.id) {
                    <option [value]="type.accessType">{{ type.accessTypeText }}</option>
                  }
                </select>
              </div>

              <div class="mb-4">
                <label class="form-label fw-bold">Duration</label>
                <select class="form-select rounded-3 border-2 border-primary-subtle" [(ngModel)]="selectedDuration" (change)="updateModalAmount()">
                  @for (dur of durationTypes(); track dur.id) {
                    <option [value]="dur.accessDuration">{{ dur.accessDuration }}{{ dur.durationUnitText }}</option>
                  }
                </select>
              </div>

              <div class="amount-display p-3 bg-white rounded-3 border border-primary-subtle text-center">
                <span class="text-muted d-block small">Subscription Cost</span>
                <h3 class="fw-bold text-primary mb-0">{{ currentAmount() }}</h3>
              </div>
            </div>
            <div class="modal-footer p-4 border-top-0 d-flex justify-content-between">
              <button type="button" class="btn btn-outline-secondary rounded-pill px-4" (click)="closeModal()">Cancel</button>
              <button type="button" class="btn btn-primary rounded-pill px-5 fw-bold shadow-sm" (click)="applyScheme()">
                Confirm Scheme
              </button>
            </div>
          </div>
        </div>
      </div>
    }

    <app-footer></app-footer>
  `,
  styles: [`
    .text-gradient {
      background: linear-gradient(45deg, #0d6efd, #0dcaf0);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .certification-card {
      border-radius: 20px;
      overflow: hidden;
    }
    .certification-img {
      height: 220px;
      object-fit: cover;
      transition: transform 0.5s ease;
    }
    .certification-card:hover .certification-img {
      transform: scale(1.1);
    }
    .price-tag {
      position: absolute;
      top: 20px;
      right: 20px;
      background: rgba(13, 110, 253, 0.9);
      color: white;
      padding: 5px 15px;
      border-radius: 50px;
      font-weight: bold;
      backdrop-filter: blur(5px);
      box-shadow: 0 4px 10px rgba(0,0,0,0.2);
    }
    .hover-elevate:hover {
      transform: translateY(-10px);
      box-shadow: 0 15px 30px rgba(0,0,0,0.1) !important;
    }
    .transition-all { transition: all 0.3s ease; }
    .detail-item { font-size: 0.9rem; }
    .bg-primary-subtle-border { border-color: #cfe2ff !important; }
  `]
})
export class HomeComponent implements OnInit {
  private certService = inject(CertificationService);
  public cartService = inject(CartService);

  topics = signal<CertificationTopic[]>([]);

  // Modal state
  showSchemeModal = signal(false);
  activeTopic = signal<CertificationTopic | null>(null);
  accessTypes = signal<any[]>([]);
  durationTypes = signal<any[]>([]);

  selectedAccessType = 1;
  selectedDuration = 3;
  currentAmount = signal('0.00 USD');
  currentSchemeId = 0;

  ngOnInit() {
    this.loadTopics();
  }

  loadTopics() {
    this.certService.getTopicsWithSchemes().subscribe({
      next: (data) => {
        this.topics.set(data);
      },
      error: (err) => console.error('Error fetching topics:', err)
    });
  }

  addToCart(topic: CertificationTopic) {
    // Construct a CertificationScheme object from the topic's current scheme data
    const scheme: CertificationScheme = {
      id: topic.id!,
      topicID: topic.topicID,
      accessType: topic.accessType || 1,
      accessDuration: topic.accessDuration || 3,
      durationUnit: 1, // Defaulting to months as per React data
      amount: topic.amount || 0,
      amountUnit: topic.amountUnit || 'USD',
      topicTitle: topic.topicTitle,
      accessTypeText: topic.accessTypeText,
      durationUnitText: topic.durationUnitText
    };

    if (this.cartService.addToCart(scheme)) {
      // Optional: Show toast
    }
  }

  openOtherScheme(topic: CertificationTopic) {
    this.activeTopic.set(topic);
    this.selectedAccessType = topic.accessType || 1;
    this.selectedDuration = topic.accessDuration || 3;
    this.currentSchemeId = topic.id || 0;

    // Fetch dynamic access types and durations from backend
    this.certService.getAccessTypes(topic.topicID).subscribe(data => {
      this.accessTypes.set(data);
    });

    this.certService.getDurationTypes(topic.topicID).subscribe(data => {
      this.durationTypes.set(data);
    });

    this.updateModalAmount();
    this.showSchemeModal.set(true);
  }

  updateModalAmount() {
    const topic = this.activeTopic();
    if (!topic) return;

    this.certService.getSchemeAmount(topic.topicID, this.selectedAccessType, this.selectedDuration).subscribe(data => {
      if (data && data.length > 0) {
        this.currentAmount.set(data[0].amounText);
        this.currentSchemeId = data[0].id;
      }
    });
  }

  closeModal() {
    this.showSchemeModal.set(false);
  }

  applyScheme() {
    const topic = this.activeTopic();
    if (topic) {
      const accessTypeText = this.accessTypes().find(t => t.accessType == this.selectedAccessType)?.accessTypeText;
      const durationUnitText = this.durationTypes().find(d => d.accessDuration == this.selectedDuration)?.durationUnitText;
      const amountStr = this.currentAmount().split(' ')[0];
      const amountUnit = this.currentAmount().split(' ')[1];

      // Update only the specific topic in the signal list
      const updatedTopics = this.topics().map(t => {
        if (t.topicID === topic.topicID) {
          return {
            ...t,
            id: this.currentSchemeId,
            accessType: this.selectedAccessType,
            accessTypeText: accessTypeText,
            accessDuration: this.selectedDuration,
            durationUnitText: durationUnitText,
            amount: parseFloat(amountStr),
            amountUnit: amountUnit
          };
        }
        return t;
      });

      this.topics.set(updatedTopics);
      this.closeModal();
    }
  }
}
