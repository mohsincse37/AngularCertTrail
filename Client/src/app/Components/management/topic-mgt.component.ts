import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CertificationService } from '../../Services/certification.service';
import { CertificationTopic } from '../../Models/certification';
import { FooterComponent } from '../footer/footer.component';

@Component({
    selector: 'app-topic-mgt',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, FooterComponent],
    template: `
    <div class="management-page py-5">
      <div class="container">
        <div class="card border-0 shadow-lg rounded-4 overflow-hidden mb-5">
          <div class="card-header bg-success text-white p-4 d-flex justify-content-between align-items-center">
            <h3 class="mb-0 fw-bold"><i class="bi bi-tags-fill me-2"></i> Certification Topic Management</h3>
            <button class="btn btn-light rounded-pill fw-bold shadow-sm" (click)="openModal()">
              <i class="bi bi-plus-lg me-1"></i> Add Topic
            </button>
          </div>
          
          <div class="card-body p-4">
            <div class="mb-4">
              <div class="input-group overflow-hidden rounded-pill border-success">
                <span class="input-group-text bg-white border-0 ps-4">
                  <i class="bi bi-search text-success"></i>
                </span>
                <input 
                  type="text" 
                  class="form-control border-0 py-3 shadow-none" 
                  placeholder="Search topics by title or detail..." 
                  [(ngModel)]="searchTerm"
                >
              </div>
            </div>

            <div class="table-responsive rounded-3 border">
              <table class="table table-hover align-middle mb-0">
                <thead class="table-light">
                  <tr>
                    <th class="ps-4">SL</th>
                    <th>Image</th>
                    <th>Topic Title</th>
                    <th>Detail</th>
                    <th>Status</th>
                    <th>Access</th>
                    <th class="text-end pe-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  @for (topic of filteredTopics(); track topic.topicID; let idx = $index) {
                    <tr>
                      <td class="ps-4 fw-bold text-muted">{{ idx + 1 }}</td>
                      <td>
                        <img 
                          [src]="topic.topicImgPath ? 'http://localhost:5241/' + topic.topicImgPath : 'assets/placeholder.jpg'" 
                          class="rounded-3 border shadow-sm"
                          style="width: 50px; height: 50px; object-fit: cover;"
                          alt="Topic"
                        >
                      </td>
                      <td><span class="fw-bold">{{ topic.topicTitle }}</span></td>
                      <td><div class="text-truncate" style="max-width: 250px;">{{ topic.topicDetail }}</div></td>
                      <td>
                        <span class="badge rounded-pill" [class.bg-success]="topic.accessType !== 0" [class.bg-secondary]="topic.accessType === 0">
                          {{ topic.accessType !== 0 ? 'Active' : 'Inactive' }}
                        </span>
                      </td>
                      <td>
                        <span class="badge rounded-pill" [class.bg-info]="topic.amount === 0" [class.bg-warning]="topic.amount !== 0">
                          {{ topic.amount === 0 ? 'Free' : 'Paid' }}
                        </span>
                      </td>
                      <td class="text-end pe-4">
                        <div class="btn-group shadow-sm rounded-pill overflow-hidden">
                          <button class="btn btn-outline-primary border-0 py-2 px-3" (click)="openModal(topic)">
                            <i class="bi bi-pencil-square"></i>
                          </button>
                          <button class="btn btn-outline-danger border-0 py-2 px-3" (click)="deleteTopic(topic.topicID)">
                            <i class="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  } @empty {
                    <tr>
                      <td colspan="7" class="text-center py-5">
                        <i class="bi bi-inbox display-1 text-muted opacity-25"></i>
                        <p class="mt-3 text-muted">No topics found. Add your first certification topic!</p>
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
            <div class="modal-header bg-success text-white p-4">
              <h5 class="modal-title fw-bold">
                {{ isEditMode() ? 'Update Certification Topic' : 'Add New Topic' }}
              </h5>
              <button type="button" class="btn-close btn-close-white shadow-none" (click)="closeModal()"></button>
            </div>
            <div class="modal-body p-4 bg-light">
              <form [formGroup]="topicForm">
                <div class="row g-4">
                  <div class="col-md-12">
                    <label class="form-label fw-bold">Topic Title</label>
                    <input type="text" class="form-control rounded-3 py-2 border-2 shadow-none border-success-subtle" formControlName="topicTitle" placeholder="e.g. AWS Certified Solutions Architect">
                  </div>
                  <div class="col-md-12">
                    <label class="form-label fw-bold">Detail</label>
                    <textarea class="form-control rounded-3 border-2 shadow-none border-success-subtle" rows="3" formControlName="topicDetail" placeholder="Describe this certification topic..."></textarea>
                  </div>
                  <div class="col-md-6 border-end border-success-subtle">
                    <label class="form-label d-block fw-bold mb-3">Settings</label>
                    <div class="form-check form-switch mb-2">
                      <input class="form-check-input shadow-none cursor-pointer" type="checkbox" formControlName="isActive" id="isActive">
                      <label class="form-check-label ms-2 cursor-pointer" for="isActive">Active Status</label>
                    </div>
                    <div class="form-check form-switch">
                      <input class="form-check-input shadow-none cursor-pointer" type="checkbox" formControlName="isFree" id="isFree">
                      <label class="form-check-label ms-2 cursor-pointer" for="isFree">Mark as Free Topic</label>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label fw-bold">Topic Image</label>
                    <div class="upload-box p-3 border-2 border-dashed rounded-3 bg-white text-center cursor-pointer hover-bg-light transition-all position-relative" (click)="fileInput.click()">
                      <input type="file" #fileInput class="d-none" (change)="onFileSelected($event)">
                      @if (previewUrl()) {
                        <img [src]="previewUrl()" class="img-fluid rounded shadow-sm max-h-100" alt="Preview">
                        <div class="small mt-2 text-muted">Click to change</div>
                      } @else {
                        <i class="bi bi-cloud-arrow-up display-6 text-success opacity-50"></i>
                        <div class="small mt-2 text-muted">Upload PNG, JPG or SVG</div>
                      }
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div class="modal-footer p-4 border-top-0 d-flex justify-content-between">
              <button type="button" class="btn btn-outline-secondary rounded-pill px-4" (click)="closeModal()">Cancel</button>
              <button type="button" class="btn btn-success rounded-pill px-5 fw-bold shadow-sm" (click)="saveTopic()">
                {{ isEditMode() ? 'Update Changes' : 'Save Topic' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    }

    <app-footer></app-footer>
  `,
    styles: [`
    .management-page { background: #f0f7f3; min-height: 100vh; }
    .border-dashed { border-style: dashed !important; border-color: #198754 !important; }
    .max-h-100 { max-height: 100px; }
    .cursor-pointer { cursor: pointer; }
    .transition-all { transition: all 0.3s ease; }
    .hover-bg-light:hover { background-color: #f8f9fa !important; }
    .border-success-subtle { border-color: #d1e7dd !important; }
    .hover-elevate:hover { transform: translateY(-5px); }
  `]
})
export class TopicMgtComponent implements OnInit {
    private certService = inject(CertificationService);
    private fb = inject(FormBuilder);

    topics = signal<CertificationTopic[]>([]);
    searchTerm = '';
    showModal = signal(false);
    isEditMode = signal(false);
    previewUrl = signal<string | null>(null);
    selectedFile: File | null = null;
    editingId: number | null = null;

    topicForm: FormGroup = this.fb.group({
        topicTitle: ['', Validators.required],
        topicDetail: [''],
        isActive: [true],
        isFree: [false]
    });

    ngOnInit() {
        this.loadTopics();
    }

    loadTopics() {
        this.certService.getTopics().subscribe(data => this.topics.set(data));
    }

    filteredTopics() {
        if (!this.searchTerm) return this.topics();
        const term = this.searchTerm.toLowerCase();
        return this.topics().filter(t =>
            t.topicTitle.toLowerCase().includes(term) ||
            t.topicDetail.toLowerCase().includes(term)
        );
    }

    openModal(topic?: CertificationTopic) {
        if (topic) {
            this.isEditMode.set(true);
            this.editingId = topic.topicID;
            this.topicForm.patchValue({
                topicTitle: topic.topicTitle,
                topicDetail: topic.topicDetail,
                isActive: topic.accessType !== 0,
                isFree: topic.amount === 0
            });
            this.previewUrl.set(topic.topicImgPath ? 'http://localhost:5241/' + topic.topicImgPath : null);
        } else {
            this.isEditMode.set(false);
            this.editingId = null;
            this.topicForm.reset({ isActive: true, isFree: false });
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

    saveTopic() {
        if (this.topicForm.invalid) {
            alert('Please fill mandatory fields');
            return;
        }

        const formData = new FormData();
        formData.append('topicTitle', this.topicForm.value.topicTitle);
        formData.append('detail', this.topicForm.value.topicDetail);
        formData.append('isActive', this.topicForm.value.isActive ? '1' : '0');
        formData.append('isPublicTopic', this.topicForm.value.isFree ? '1' : '0');
        if (this.selectedFile) {
            formData.append('file', this.selectedFile);
        }

        if (this.isEditMode() && this.editingId) {
            formData.append('id', this.editingId.toString());
            this.certService.updateTopic(this.editingId, formData).subscribe({
                next: () => {
                    this.loadTopics();
                    this.closeModal();
                },
                error: (err) => console.error('Error updating topic:', err)
            });
        } else {
            this.certService.addTopic(formData).subscribe({
                next: () => {
                    this.loadTopics();
                    this.closeModal();
                },
                error: (err) => console.error('Error adding topic:', err)
            });
        }
    }

    deleteTopic(id: number) {
        if (confirm('Are you sure you want to delete this topic?')) {
            this.certService.deleteTopic(id).subscribe({
                next: () => this.loadTopics(),
                error: (err) => console.error('Error deleting topic:', err)
            });
        }
    }
}
