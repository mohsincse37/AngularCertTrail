import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CertificationService } from '../../Services/certification.service';
import { CertificationTopic } from '../../Models/certification';
import { FooterComponent } from '../footer/footer.component';

@Component({
    selector: 'app-correct-option',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, FooterComponent],
    template: `
    <div class="management-page py-5">
      <div class="container d-flex justify-content-center">
        <div class="col-lg-8">
          <div class="card border-0 shadow-lg rounded-4 overflow-hidden">
            <div class="card-header bg-amber text-dark p-4">
              <h3 class="mb-0 fw-bold"><i class="bi bi-check-all me-2"></i> Correct Option Settings</h3>
              <p class="mb-0 small opacity-75">Assign correct answers and explanations to your questions</p>
            </div>
            
            <div class="card-body p-4 bg-light">
              <form [formGroup]="correctForm">
                <div class="row g-4">
                  <div class="col-md-6">
                    <label class="form-label fw-bold">1. Select Topic</label>
                    <select class="form-select rounded-3 border-2 border-amber-subtle shadow-none" formControlName="topicID" (change)="onTopicChange()">
                      <option value="">--- Choose Topic ---</option>
                      @for (t of topics(); track t.topicID) {
                        <option [value]="t.topicID">{{ t.topicTitle }}</option>
                      }
                    </select>
                  </div>
                  
                  <div class="col-md-6">
                    <label class="form-label fw-bold">2. Select Question</label>
                    <select class="form-select rounded-3 border-2 border-amber-subtle shadow-none" formControlName="questionID" (change)="onQuestionChange()">
                      <option value="">--- Choose Question ---</option>
                      @for (q of questions(); track q.id) {
                        <option [value]="q.id">{{ q.questionTitle }}</option>
                      }
                    </select>
                  </div>

                  <div class="col-12">
                    <label class="form-label fw-bold">3. Select Correct Answer(s)</label>
                    <div class="bg-white rounded-4 border-2 border-amber-subtle p-3" style="min-height: 100px;">
                      @if (options().length > 0) {
                        <div class="row row-cols-1 row-cols-md-2 g-2">
                          @for (opt of options(); track opt.id) {
                            <div class="col">
                              <div class="form-check p-2 border rounded-3 hover-bg-amber transition-all cursor-pointer">
                                <input class="form-check-input ms-0 me-2" type="checkbox" 
                                       [value]="opt.id" 
                                       [checked]="isSelected(opt.id)"
                                       (change)="toggleOption(opt.id)"
                                       id="opt-{{opt.id}}">
                                <label class="form-check-label w-100 cursor-pointer" for="opt-{{opt.id}}">
                                  {{ opt.optionTitle }}
                                </label>
                              </div>
                            </div>
                          }
                        </div>
                      } @else {
                        <div class="text-center py-4 text-muted">
                          <i class="bi bi-info-circle me-2"></i> Select a question to load its options
                        </div>
                      }
                    </div>
                  </div>

                  <div class="col-12">
                    <label class="form-label fw-bold">4. Answer Explanation / Description</label>
                    <textarea class="form-control rounded-4 border-2 border-amber-subtle shadow-none" rows="4" 
                              formControlName="ansDescription" placeholder="Explain why these answers are correct..."></textarea>
                  </div>
                </div>
              </form>
            </div>
            
            <div class="card-footer p-4 bg-white border-0 d-flex justify-content-between align-items-center">
              <button class="btn btn-outline-secondary rounded-pill px-4" (click)="resetForm()">Reset</button>
              <button class="btn btn-amber rounded-pill px-5 fw-bold shadow-sm" (click)="saveCorrectOptions()">
                Save Configuration
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <app-footer></app-footer>
  `,
    styles: [`
    .management-page { background: #fdfaf0; min-height: 100vh; }
    .bg-amber { background-color: #ffbf00; }
    .border-amber-subtle { border-color: #ffecb3 !important; }
    .btn-amber { background-color: #ffbf00; color: #332200; border: none; transition: all 0.3s ease; }
    .btn-amber:hover { background-color: #e6ac00; transform: translateY(-2px); }
    .hover-bg-amber:hover { background-color: #fff8e1; border-color: #ffbf00; }
    .transition-all { transition: all 0.2s ease; }
    .cursor-pointer { cursor: pointer; }
  `]
})
export class CorrectOptionComponent implements OnInit {
    private certService = inject(CertificationService);
    private fb = inject(FormBuilder);

    topics = signal<CertificationTopic[]>([]);
    questions = signal<any[]>([]);
    options = signal<any[]>([]);
    selectedOptionIds = signal<number[]>([]);

    correctForm: FormGroup = this.fb.group({
        topicID: [''],
        questionID: ['', Validators.required],
        ansDescription: ['', Validators.required]
    });

    ngOnInit() {
        this.certService.getTopics().subscribe(data => this.topics.set(data));
    }

    onTopicChange() {
        const topicId = this.correctForm.get('topicID')?.value;
        if (topicId) {
            this.certService.getQuestionsByTopic(topicId).subscribe(data => {
                this.questions.set(data);
                this.options.set([]);
                this.selectedOptionIds.set([]);
                this.correctForm.patchValue({ questionID: '' });
            });
        }
    }

    onQuestionChange() {
        const qId = this.correctForm.get('questionID')?.value;
        if (qId) {
            this.certService.getOptionsByQuestion(qId).subscribe(data => {
                this.options.set(data);
                this.selectedOptionIds.set([]);
            });
        }
    }

    isSelected(id: number): boolean {
        return this.selectedOptionIds().includes(id);
    }

    toggleOption(id: number) {
        const current = this.selectedOptionIds();
        if (current.includes(id)) {
            this.selectedOptionIds.set(current.filter(i => i !== id));
        } else {
            this.selectedOptionIds.set([...current, id]);
        }
    }

    resetForm() {
        this.correctForm.reset();
        this.questions.set([]);
        this.options.set([]);
        this.selectedOptionIds.set([]);
    }

    saveCorrectOptions() {
        if (this.correctForm.invalid || this.selectedOptionIds().length === 0) {
            alert('Please fill all fields and select at least one correct option');
            return;
        }

        const val = this.correctForm.value;
        const data = {
            questionID: Number(val.questionID),
            ansDescription: val.ansDescription,
            correctOptionID: this.selectedOptionIds().join(',')
        };

        this.certService.setCorrectOption(data).subscribe({
            next: () => {
                alert('Correct options set successfully!');
                this.resetForm();
            },
            error: (err) => console.error('Error setting correct options:', err)
        });
    }
}
