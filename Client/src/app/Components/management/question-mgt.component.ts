import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CertificationService } from '../../Services/certification.service';
import { CertificationTopic } from '../../Models/certification';
import { FooterComponent } from '../footer/footer.component';

@Component({
    selector: 'app-question-mgt',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, FooterComponent],
    template: `
    <div class="management-page py-5">
      <div class="container">
        <div class="card border-0 shadow-lg rounded-4 overflow-hidden mb-5">
          <div class="card-header bg-primary text-white p-4 d-flex justify-content-between align-items-center">
            <h3 class="mb-0 fw-bold"><i class="bi bi-question-circle-fill me-2"></i> Certification Question Management</h3>
            <button class="btn btn-light rounded-pill fw-bold shadow-sm" (click)="openModal()">
              <i class="bi bi-plus-lg me-1"></i> Add Question
            </button>
          </div>
          
          <div class="card-body p-4">
            <div class="mb-4 d-flex gap-3">
              <div class="input-group overflow-hidden rounded-pill border-primary flex-grow-1">
                <span class="input-group-text bg-white border-0 ps-4">
                  <i class="bi bi-search text-primary"></i>
                </span>
                <input 
                  type="text" 
                  class="form-control border-0 py-3 shadow-none" 
                  placeholder="Search questions by text..." 
                  [(ngModel)]="searchTerm"
                >
              </div>
            </div>

            <div class="table-responsive rounded-3 border">
              <table class="table table-hover align-middle mb-0">
                <thead class="table-light">
                  <tr>
                    <th class="ps-4">SL</th>
                    <th>Topic</th>
                    <th>Q.No</th>
                    <th>Question Title</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th class="text-end pe-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  @for (q of filteredQuestions(); track q.id; let idx = $index) {
                    <tr>
                      <td class="ps-4 fw-bold text-muted">{{ idx + 1 }}</td>
                      <td><span class="badge bg-light text-dark border">{{ q.topicTitle }}</span></td>
                      <td class="fw-bold">#{{ q.questionNo }}</td>
                      <td><div class="text-truncate" style="max-width: 300px;">{{ q.questionTitle }}</div></td>
                      <td>
                        <span class="badge rounded-pill bg-info-subtle text-info border border-info-subtle">
                          {{ q.optionTypeText }}
                        </span>
                      </td>
                      <td>
                        <span class="badge rounded-pill" [class.bg-success]="q.isActive" [class.bg-secondary]="!q.isActive">
                          {{ q.isActive ? 'Active' : 'Inactive' }}
                        </span>
                      </td>
                      <td class="text-end pe-4">
                        <div class="btn-group shadow-sm rounded-pill overflow-hidden">
                          <button class="btn btn-outline-primary border-0 py-2 px-3" (click)="openModal(q)">
                            <i class="bi bi-pencil-square"></i>
                          </button>
                          <button class="btn btn-outline-danger border-0 py-2 px-3" (click)="deleteQuestion(q.id)">
                            <i class="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  } @empty {
                    <tr>
                      <td colspan="7" class="text-center py-5">
                        <i class="bi bi-journal-text display-1 text-muted opacity-25"></i>
                        <p class="mt-3 text-muted">No questions found. Start building your question bank!</p>
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
            <div class="modal-header bg-primary text-white p-4">
              <h5 class="modal-title fw-bold">
                {{ isEditMode() ? 'Update Question' : 'Add New Question' }}
              </h5>
              <button type="button" class="btn-close btn-close-white shadow-none" (click)="closeModal()"></button>
            </div>
            <div class="modal-body p-4 bg-light">
              <form [formGroup]="qForm">
                <div class="row g-4">
                  <div class="col-md-8">
                    <label class="form-label fw-bold">Topic</label>
                    <select class="form-select rounded-3 border-2 border-primary-subtle shadow-none" formControlName="topicID" (change)="onTopicChange()">
                      <option value="">--- Select Topic ---</option>
                      @for (topic of topics(); track topic.topicID) {
                        <option [value]="topic.topicID">{{ topic.topicTitle }}</option>
                      }
                    </select>
                  </div>
                  <div class="col-md-4">
                    <label class="form-label fw-bold">Question Number</label>
                    <input type="text" class="form-control rounded-3 border-2 border-primary-subtle shadow-none bg-white" formControlName="questionNo" readonly>
                  </div>
                  <div class="col-md-12">
                    <label class="form-label fw-bold">Question Title</label>
                    <textarea class="form-control rounded-3 border-2 border-primary-subtle shadow-none" rows="3" formControlName="questionTitle" placeholder="Enter the question text..."></textarea>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label fw-bold">Option Type</label>
                    <div class="d-flex gap-4 p-2 bg-white rounded-3 border border-primary-subtle">
                      <div class="form-check">
                        <input class="form-check-input" type="radio" [value]="1" formControlName="optionType" id="radioType">
                        <label class="form-check-label" for="radioType">Single Choice</label>
                      </div>
                      <div class="form-check">
                        <input class="form-check-input" type="radio" [value]="2" formControlName="optionType" id="checkType">
                        <label class="form-check-label" for="checkType">Multiple Choice</label>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label fw-bold">Status</label>
                    <div class="form-check form-switch p-2 ps-5 bg-white rounded-3 border border-primary-subtle">
                      <input class="form-check-input shadow-none cursor-pointer" type="checkbox" formControlName="isActive" id="qIsActive">
                      <label class="form-check-label ms-2 cursor-pointer" for="qIsActive">Active for Practice</label>
                    </div>
                  </div>
                  <div class="col-md-12">
                    <label class="form-label fw-bold">Question Image (Optional)</label>
                    <div class="upload-box p-3 border-2 border-dashed border-primary rounded-3 bg-white text-center cursor-pointer position-relative" (click)="fileInput.click()">
                      <input type="file" #fileInput class="d-none" (change)="onFileSelected($event)">
                      @if (previewUrl()) {
                        <img [src]="previewUrl()" class="img-fluid rounded shadow-sm" style="max-height: 150px;" alt="Preview">
                        <div class="mt-2 small text-muted">Click to change</div>
                      } @else {
                        <i class="bi bi-image display-6 text-primary opacity-50"></i>
                        <div class="mt-2 small text-muted">Upload an image for this question if needed</div>
                      }
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div class="modal-footer p-4 border-top-0 d-flex justify-content-between">
              <button type="button" class="btn btn-outline-secondary rounded-pill px-4" (click)="closeModal()">Cancel</button>
              <button type="button" class="btn btn-primary rounded-pill px-5 fw-bold shadow-sm" (click)="saveQuestion()">
                {{ isEditMode() ? 'Update Question' : 'Add Question' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    }

    <app-footer></app-footer>
  `,
    styles: [`
    .management-page { background: #f0f4f8; min-height: 100vh; }
    .border-dashed { border-style: dashed !important; }
    .cursor-pointer { cursor: pointer; }
    .border-primary-subtle { border-color: #cfe2ff !important; }
    .bg-indigo-subtle { background-color: #e0d0ff; }
  `]
})
export class QuestionMgtComponent implements OnInit {
    private certService = inject(CertificationService);
    private fb = inject(FormBuilder);

    questions = signal<any[]>([]);
    topics = signal<CertificationTopic[]>([]);
    searchTerm = '';
    showModal = signal(false);
    isEditMode = signal(false);
    previewUrl = signal<string | null>(null);
    selectedFile: File | null = null;
    editingId: number | null = null;

    qForm: FormGroup = this.fb.group({
        topicID: ['', Validators.required],
        questionNo: [{ value: '', disabled: false }, Validators.required],
        questionTitle: ['', Validators.required],
        optionType: [1, Validators.required],
        isActive: [true]
    });

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        this.certService.getQuestions().subscribe(data => this.questions.set(data));
        this.certService.getTopics().subscribe(data => this.topics.set(data));
    }

    onTopicChange() {
        const topicId = this.qForm.get('topicID')?.value;
        if (topicId && !this.isEditMode()) {
            this.certService.getQuestionNo(topicId).subscribe(res => {
                const nextNo = res.questionNo ? res.questionNo + 1 : 1;
                this.qForm.patchValue({ questionNo: nextNo });
            });
        }
    }

    filteredQuestions() {
        if (!this.searchTerm) return this.questions();
        const term = this.searchTerm.toLowerCase();
        return this.questions().filter(q =>
            q.questionTitle.toLowerCase().includes(term) ||
            q.topicTitle?.toLowerCase().includes(term)
        );
    }

    openModal(q?: any) {
        if (q) {
            this.isEditMode.set(true);
            this.editingId = q.id;
            this.qForm.patchValue({
                topicID: q.topicID,
                questionNo: q.questionNo,
                questionTitle: q.questionTitle,
                optionType: q.optionType,
                isActive: q.isActive === 1 || q.isActive === true
            });
            this.previewUrl.set(q.questionImgPath ? 'http://localhost:5241' + q.questionImgPath : null);
        } else {
            this.isEditMode.set(false);
            this.editingId = null;
            this.qForm.reset({ optionType: 1, isActive: true });
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

    saveQuestion() {
        if (this.qForm.invalid) {
            alert('Please fill mandatory fields');
            return;
        }

        const formData = new FormData();
        const val = this.qForm.getRawValue();
        formData.append('topicID', val.topicID);
        formData.append('questionNo', val.questionNo);
        formData.append('questionTitle', val.questionTitle);
        formData.append('optionType', val.optionType);
        formData.append('isActive', val.isActive ? '1' : '0');
        formData.append('fileName', val.questionTitle); // Backend requirement

        if (this.selectedFile) {
            formData.append('file', this.selectedFile);
        }

        if (this.isEditMode() && this.editingId) {
            formData.append('id', this.editingId.toString());
            this.certService.updateQuestion(this.editingId, formData).subscribe({
                next: () => {
                    this.loadData();
                    this.closeModal();
                },
                error: (err) => console.error('Error updating question:', err)
            });
        } else {
            this.certService.addQuestion(formData).subscribe({
                next: () => {
                    this.loadData();
                    this.closeModal();
                },
                error: (err) => console.error('Error adding question:', err)
            });
        }
    }

    deleteQuestion(id: number) {
        if (confirm('Are you sure you want to delete this question?')) {
            this.certService.deleteQuestion(id).subscribe({
                next: () => this.loadData(),
                error: (err) => console.error('Error deleting question:', err)
            });
        }
    }
}
