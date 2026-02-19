import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CertificationService } from '../../Services/certification.service';
import { CertificationScheme, CertificationTopic } from '../../Models/certification';
import { FooterComponent } from '../footer/footer.component';

@Component({
    selector: 'app-scheme-mgt',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, FooterComponent],
    template: `
    <div class="management-page py-5">
      <div class="container">
        <div class="card border-0 shadow-lg rounded-4 overflow-hidden mb-5">
          <div class="card-header bg-indigo text-white p-4 d-flex justify-content-between align-items-center">
            <h3 class="mb-0 fw-bold"><i class="bi bi-wallet2 me-2"></i> Certification Scheme Management</h3>
            <button class="btn btn-light rounded-pill fw-bold shadow-sm" (click)="openModal()">
              <i class="bi bi-plus-lg me-1"></i> Add Scheme
            </button>
          </div>
          
          <div class="card-body p-4">
            <div class="mb-4 d-flex gap-3">
              <div class="input-group overflow-hidden rounded-pill border-indigo flex-grow-1">
                <span class="input-group-text bg-white border-0 ps-4">
                  <i class="bi bi-search text-indigo"></i>
                </span>
                <input 
                  type="text" 
                  class="form-control border-0 py-3 shadow-none" 
                  placeholder="Search by topic title..." 
                  [(ngModel)]="searchTerm"
                >
              </div>
            </div>

            <div class="table-responsive rounded-3 border">
              <table class="table table-hover align-middle mb-0">
                <thead class="table-light">
                  <tr>
                    <th class="ps-4">SL</th>
                    <th>Topic Title</th>
                    <th>Access Type</th>
                    <th>Duration</th>
                    <th>Amount</th>
                    <th class="text-end pe-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  @for (scheme of filteredSchemes(); track scheme.id; let idx = $index) {
                    <tr>
                      <td class="ps-4 fw-bold text-muted">{{ idx + 1 }}</td>
                      <td><span class="fw-bold">{{ scheme.topicTitle }}</span></td>
                      <td>
                        <span class="badge rounded-pill bg-indigo-subtle text-indigo">
                          {{ scheme.accessTypeText }}
                        </span>
                      </td>
                      <td>{{ scheme.accessDuration }} {{ scheme.durationUnitText }}</td>
                      <td>
                        <span class="fw-bold text-success">{{ scheme.amount }} {{ scheme.amountUnit }}</span>
                      </td>
                      <td class="text-end pe-4">
                        <div class="btn-group shadow-sm rounded-pill overflow-hidden">
                          <button class="btn btn-outline-indigo border-0 py-2 px-3" (click)="openModal(scheme)">
                            <i class="bi bi-pencil-square"></i>
                          </button>
                          <button class="btn btn-outline-danger border-0 py-2 px-3" (click)="deleteScheme(scheme.id)">
                            <i class="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  } @empty {
                    <tr>
                      <td colspan="6" class="text-center py-5">
                        <i class="bi bi-cash-stack display-1 text-muted opacity-25"></i>
                        <p class="mt-3 text-muted">No schemes found. Define pricing for your topics!</p>
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

    <!-- Modal -->
    @if (showModal()) {
      <div class="modal fade show d-block" style="background: rgba(0,0,0,0.5); backdrop-filter: blur(5px);">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content border-0 shadow-lg rounded-4">
            <div class="modal-header bg-indigo text-white p-4">
              <h5 class="modal-title fw-bold">
                {{ isEditMode() ? 'Update Certification Scheme' : 'Add New Scheme' }}
              </h5>
              <button type="button" class="btn-close btn-close-white shadow-none" (click)="closeModal()"></button>
            </div>
            <div class="modal-body p-4 bg-light">
              <form [formGroup]="schemeForm">
                <div class="mb-3">
                  <label class="form-label fw-bold">Select Topic</label>
                  <select class="form-select rounded-3 border-2 border-indigo-subtle shadow-none" formControlName="topicID">
                    <option value="">--- Choose a Topic ---</option>
                    @for (topic of topics(); track topic.topicID) {
                      <option [value]="topic.topicID">{{ topic.topicTitle }}</option>
                    }
                  </select>
                </div>
                
                <div class="mb-3">
                  <label class="form-label fw-bold">Access Type</label>
                  <select class="form-select rounded-3 border-2 border-indigo-subtle shadow-none" formControlName="accessType">
                    <option value="">--- Choose Access Type ---</option>
                    @for (type of accessTypes; track type.id) {
                      <option [value]="type.id">{{ type.label }}</option>
                    }
                  </select>
                </div>

                <div class="row g-3">
                  <div class="col-md-6">
                    <label class="form-label fw-bold">Duration</label>
                    <select class="form-select rounded-3 border-2 border-indigo-subtle shadow-none" formControlName="accessDuration">
                      <option value="">--- Duration ---</option>
                      <option value="3">3</option>
                      <option value="6">6</option>
                      <option value="12">12</option>
                    </select>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label fw-bold">Unit</label>
                    <select class="form-select rounded-3 border-2 border-indigo-subtle shadow-none" formControlName="durationUnit">
                      <option value="1">Months</option>
                    </select>
                  </div>
                </div>

                <div class="row g-3 mt-1">
                  <div class="col-md-6">
                    <label class="form-label fw-bold">Amount</label>
                    <input type="number" class="form-control rounded-3 border-2 border-indigo-subtle shadow-none" formControlName="amount" placeholder="0.00">
                  </div>
                  <div class="col-md-6">
                    <label class="form-label fw-bold">Currency</label>
                    <input type="text" class="form-control rounded-3 border-2 border-indigo-subtle shadow-none" formControlName="amountUnit" placeholder="USD">
                  </div>
                </div>
              </form>
            </div>
            <div class="modal-footer p-4 border-top-0 d-flex justify-content-between">
              <button type="button" class="btn btn-outline-secondary rounded-pill px-4" (click)="closeModal()">Cancel</button>
              <button type="button" class="btn btn-indigo rounded-pill px-5 fw-bold shadow-sm" (click)="saveScheme()">
                {{ isEditMode() ? 'Update Scheme' : 'Save Scheme' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    }

    <app-footer></app-footer>
  `,
    styles: [`
    .management-page { background: #f4f3ff; min-height: 100vh; }
    .bg-indigo { background-color: #6610f2; }
    .text-indigo { color: #6610f2; }
    .border-indigo { border-color: #6610f2; }
    .border-indigo-subtle { border-color: #e0d0ff !important; }
    .bg-indigo-subtle { background-color: #e0d0ff; }
    .btn-indigo { background-color: #6610f2; color: white; transition: all 0.3s ease; }
    .btn-indigo:hover { background-color: #520dc2; color: white; transform: translateY(-2px); }
    .btn-outline-indigo { color: #6610f2; border-color: #6610f2; }
    .btn-outline-indigo:hover { background-color: #6610f2; color: white; }
  `]
})
export class SchemeMgtComponent implements OnInit {
    private certService = inject(CertificationService);
    private fb = inject(FormBuilder);

    schemes = signal<CertificationScheme[]>([]);
    topics = signal<CertificationTopic[]>([]);
    searchTerm = '';
    showModal = signal(false);
    isEditMode = signal(false);
    editingId: number | null = null;

    accessTypes = [
        { id: 1, label: 'Online practice + Download pdf' },
        { id: 2, label: 'Online practice only' }
    ];

    schemeForm: FormGroup = this.fb.group({
        topicID: ['', Validators.required],
        accessType: ['', Validators.required],
        accessDuration: ['', Validators.required],
        durationUnit: [1, Validators.required],
        amount: ['', [Validators.required, Validators.min(0)]],
        amountUnit: ['USD', Validators.required]
    });

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        this.certService.getSchemes().subscribe(data => this.schemes.set(data));
        this.certService.getTopics().subscribe(data => this.topics.set(data));
    }

    filteredSchemes() {
        if (!this.searchTerm) return this.schemes();
        const term = this.searchTerm.toLowerCase();
        return this.schemes().filter(s =>
            s.topicTitle?.toLowerCase().includes(term)
        );
    }

    openModal(scheme?: CertificationScheme) {
        if (scheme) {
            this.isEditMode.set(true);
            this.editingId = scheme.id;
            this.schemeForm.patchValue({
                topicID: scheme.topicID,
                accessType: scheme.accessType,
                accessDuration: scheme.accessDuration,
                durationUnit: scheme.durationUnit,
                amount: scheme.amount,
                amountUnit: scheme.amountUnit
            });
        } else {
            this.isEditMode.set(false);
            this.editingId = null;
            this.schemeForm.reset({ durationUnit: 1, amountUnit: 'USD' });
        }
        this.showModal.set(true);
    }

    closeModal() {
        this.showModal.set(false);
    }

    saveScheme() {
        if (this.schemeForm.invalid) {
            alert('Please fill all required fields correctly');
            return;
        }

        const val = this.schemeForm.value;
        const schemeData = {
            ...val,
            topicID: Number(val.topicID),
            accessType: Number(val.accessType),
            accessDuration: Number(val.accessDuration),
            durationUnit: Number(val.durationUnit)
        };

        if (this.isEditMode() && this.editingId) {
            schemeData.id = this.editingId;
            this.certService.updateScheme(this.editingId, schemeData).subscribe({
                next: () => {
                    this.loadData();
                    this.closeModal();
                },
                error: (err) => console.error('Error updating scheme:', err)
            });
        } else {
            this.certService.addScheme(schemeData).subscribe({
                next: () => {
                    this.loadData();
                    this.closeModal();
                },
                error: (err) => console.error('Error adding scheme:', err)
            });
        }
    }

    deleteScheme(id: number) {
        if (confirm('Are you sure you want to delete this scheme?')) {
            this.certService.deleteScheme(id).subscribe({
                next: () => this.loadData(),
                error: (err) => console.error('Error deleting scheme:', err)
            });
        }
    }
}
