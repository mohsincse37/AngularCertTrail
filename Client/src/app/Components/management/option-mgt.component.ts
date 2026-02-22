import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CertificationService } from '../../Services/certification.service';
import { CertificationTopic } from '../../Models/certification';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-option-mgt',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, FooterComponent],
  template: `
    <div class="management-page py-5">
      <div class="container">
        <div class="card border-0 shadow-lg rounded-4 overflow-hidden mb-5">
          <div class="card-header bg-teal text-white p-4 d-flex justify-content-between align-items-center">
            <h3 class="mb-0 fw-bold"><i class="bi bi-list-check me-2"></i> Question Option Management</h3>
            <button class="btn btn-light rounded-pill fw-bold shadow-sm" (click)="openModal()">
              <i class="bi bi-plus-lg me-1"></i> Add Option
            </button>
          </div>
          
          <div class="card-body p-4">
            <div class="mb-4">
              <div class="input-group overflow-hidden rounded-pill border-teal">
                <span class="input-group-text bg-white border-0 ps-4">
                  <i class="bi bi-search text-teal"></i>
                </span>
                <input 
                  type="text" 
                  class="form-control border-0 py-3 shadow-none" 
                  placeholder="Search options..." 
                  [(ngModel)]="searchTerm"
                >
              </div>
            </div>

            <div class="table-responsive rounded-3 border">
              <table class="table table-hover align-middle mb-0">
                <thead class="table-light">
                  <tr>
                    <th class="ps-4">SL</th>
                    <th>Question</th>
                    <th>Option Title</th>
                    <th>Order No</th>
                    <th>Image</th>
                    <th class="text-end pe-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  @for (opt of filteredOptions(); track opt.id; let idx = $index) {
                    <tr>
                      <td class="ps-4 fw-bold text-muted">{{ idx + 1 }}</td>
                      <td><div class="text-truncate" style="max-width: 250px;">{{ opt.questionTitle }}</div></td>
                      <td><span class="fw-bold">{{ opt.optionTitle }}</span></td>
                      <td><span class="badge bg-secondary">{{ opt.orderNo }}</span></td>
                      <td>
                        @if (opt.optionImgPath) {
                          <img [src]="'https://localhost:7009' + opt.optionImgPath" class="rounded border shadow-sm" style="width: 40px; height: 40px; object-fit: cover;">
                        } @else {
                          <span class="text-muted small italic">No image</span>
                        }
                      </td>
                      <td class="text-end pe-4">
                        <div class="btn-group shadow-sm rounded-pill overflow-hidden">
                          <button class="btn btn-outline-teal border-0 py-2 px-3" (click)="openModal(opt)">
                            <i class="bi bi-pencil-square"></i>
                          </button>
                          <button class="btn btn-outline-danger border-0 py-2 px-3" (click)="deleteOption(opt.id)">
                            <i class="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  } @empty {
                    <tr>
                      <td colspan="6" class="text-center py-5">
                        <i class="bi bi-ui-checks display-1 text-muted opacity-25"></i>
                        <p class="mt-3 text-muted">No options found. Add choices for your questions!</p>
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
        <div class="modal-dialog modal-dialog-centered modal-lg">
          <div class="modal-content border-0 shadow-lg rounded-4">
            <div class="modal-header bg-teal text-white p-4">
              <h5 class="modal-title fw-bold">
                {{ isEditMode() ? 'Update Option' : 'Add New Option' }}
              </h5>
              <button type="button" class="btn-close btn-close-white shadow-none" (click)="closeModal()"></button>
            </div>
            <div class="modal-body p-4 bg-light">
              <form [formGroup]="optForm">
                <div class="row g-4">
                  <div class="col-md-6">
                    <label class="form-label fw-bold">Select Topic</label>
                    <select class="form-select rounded-3 border-2 border-teal-subtle shadow-none" formControlName="topicID" (change)="onTopicChange()">
                      <option value="">--- Choose Topic ---</option>
                      @for (t of topics(); track t.topicID) {
                        <option [value]="t.topicID">{{ t.topicTitle }}</option>
                      }
                    </select>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label fw-bold">Select Question</label>
                    <select class="form-select rounded-3 border-2 border-teal-subtle shadow-none" formControlName="questionID">
                      <option value="">--- Choose Question ---</option>
                      @for (q of questions(); track q.id) {
                        <option [value]="q.id">{{ q.questionTitle }}</option>
                      }
                    </select>
                  </div>
                  <div class="col-md-8">
                    <label class="form-label fw-bold">Option Title / Content</label>
                    <input type="text" class="form-control rounded-3 border-2 border-teal-subtle shadow-none" formControlName="optionTitle" placeholder="Enter option text...">
                  </div>
                  <div class="col-md-4">
                    <label class="form-label fw-bold">Order No</label>
                    <input type="number" class="form-control rounded-3 border-2 border-teal-subtle shadow-none" formControlName="orderNo" placeholder="1, 2, 3...">
                  </div>
                  <div class="col-md-12">
                    <label class="form-label fw-bold">Option Image (Optional)</label>
                    <div class="upload-box p-3 border-2 border-dashed border-teal rounded-3 bg-white text-center cursor-pointer position-relative" (click)="fileInput.click()">
                      <input type="file" #fileInput class="d-none" (change)="onFileSelected($event)">
                      @if (previewUrl()) {
                        <img [src]="previewUrl()" class="img-fluid rounded shadow-sm" style="max-height: 120px;" alt="Preview">
                        <div class="mt-2 small text-muted">Click to change</div>
                      } @else {
                        <i class="bi bi-images display-6 text-teal opacity-50"></i>
                        <div class="mt-2 small text-muted">Upload an image if the option is visual</div>
                      }
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div class="modal-footer p-4 border-top-0 d-flex justify-content-between">
              <button type="button" class="btn btn-outline-secondary rounded-pill px-4" (click)="closeModal()">Cancel</button>
              <button type="button" class="btn btn-teal rounded-pill px-5 fw-bold shadow-sm text-white" (click)="saveOption()">
                {{ isEditMode() ? 'Update Option' : 'Save Option' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    }

    <app-footer></app-footer>
  `,
  styles: [`
    .management-page { background: #f0f8f7; min-height: 100vh; }
    .bg-teal { background-color: #20c997; }
    .text-teal { color: #20c997; }
    .border-teal { border-color: #20c997; }
    .border-teal-subtle { border-color: #d1f2eb !important; }
    .btn-outline-teal { color: #20c997; border-color: #20c997; }
    .btn-outline-teal:hover { background-color: #20c997; color: white; }
    .border-dashed { border-style: dashed !important; }
    .cursor-pointer { cursor: pointer; }
  `]
})
export class OptionMgtComponent implements OnInit {
  private certService = inject(CertificationService);
  private fb = inject(FormBuilder);

  options = signal<any[]>([]);
  topics = signal<CertificationTopic[]>([]);
  questions = signal<any[]>([]);
  searchTerm = '';
  showModal = signal(false);
  isEditMode = signal(false);
  previewUrl = signal<string | null>(null);
  selectedFile: File | null = null;
  editingId: number | null = null;

  optForm: FormGroup = this.fb.group({
    topicID: [''],
    questionID: ['', Validators.required],
    optionTitle: ['', Validators.required],
    orderNo: ['', Validators.required]
  });

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.certService.getOptions().subscribe(data => this.options.set(data));
    this.certService.getTopics().subscribe(data => this.topics.set(data));
  }

  onTopicChange() {
    const topicId = this.optForm.get('topicID')?.value;
    if (topicId) {
      this.certService.getQuestionsByTopic(topicId).subscribe(data => this.questions.set(data));
    } else {
      this.questions.set([]);
    }
  }

  filteredOptions() {
    if (!this.searchTerm) return this.options();
    const term = this.searchTerm.toLowerCase();
    return this.options().filter(o =>
      o.optionTitle.toLowerCase().includes(term) ||
      o.questionTitle?.toLowerCase().includes(term)
    );
  }

  openModal(opt?: any) {
    if (opt) {
      this.isEditMode.set(true);
      this.editingId = opt.id;
      // Note: We might not have topicID in the opt record directly depending on backend mapping
      // But we can trigger question loading if we had it.
      this.optForm.patchValue({
        questionID: opt.questionID,
        optionTitle: opt.optionTitle,
        orderNo: opt.orderNo
      });
      // Optionally fetch questions by questionID if we could find the topic
      this.previewUrl.set(opt.optionImgPath ? 'https://localhost:7009' + opt.optionImgPath : null);
    } else {
      this.isEditMode.set(false);
      this.editingId = null;
      this.optForm.reset();
      this.previewUrl.set(null);
    }
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
    this.selectedFile = null;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => this.previewUrl.set(e.target.result);
      reader.readAsDataURL(file);
    }
  }

  saveOption() {
    if (this.optForm.invalid) {
      alert('Please fill mandatory fields');
      return;
    }

    const formData = new FormData();
    const val = this.optForm.value;
    formData.append('questionID', val.questionID);
    formData.append('optionTitle', val.optionTitle);
    formData.append('orderNo', val.orderNo);
    formData.append('fileName', val.optionTitle);

    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }

    if (this.isEditMode() && this.editingId) {
      formData.append('id', this.editingId.toString());
      this.certService.updateOption(this.editingId, formData).subscribe({
        next: () => {
          this.loadData();
          this.closeModal();
        },
        error: (err) => console.error('Error updating option:', err)
      });
    } else {
      this.certService.addOption(formData).subscribe({
        next: () => {
          this.loadData();
          this.closeModal();
        },
        error: (err) => console.error('Error adding option:', err)
      });
    }
  }

  deleteOption(id: number) {
    if (confirm('Are you sure you want to delete this option?')) {
      this.certService.deleteOption(id).subscribe({
        next: () => this.loadData(),
        error: (err) => console.error('Error deleting option:', err)
      });
    }
  }
}
