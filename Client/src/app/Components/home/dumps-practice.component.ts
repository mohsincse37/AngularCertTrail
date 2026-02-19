import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CertificationService } from '../../Services/certification.service';
import { CertificationTopic, Question } from '../../Models/certification';
import { FooterComponent } from '../footer/footer.component';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-dumps-practice',
    standalone: true,
    imports: [CommonModule, FooterComponent, FormsModule],
    template: `
    <div class="dumps-page py-5">
      <div class="container">
        <div class="card border-0 shadow-lg rounded-4 overflow-hidden mb-5">
          <div class="card-header bg-primary text-white p-4">
            <h3 class="mb-0 fw-bold"><i class="bi bi-journal-text me-2"></i> Dumps Practice</h3>
          </div>
          <div class="card-body p-4 bg-light">
            <div class="row align-items-center g-3">
              <div class="col-md-3 text-md-end">
                <label class="fw-bold text-dark">Select Certification Topic:</label>
              </div>
              <div class="col-md-6">
                <select 
                  class="form-select border-primary border-2 rounded-pill px-4" 
                  [(ngModel)]="selectedTopicId" 
                  (change)="onTopicChange()"
                >
                  <option value="0">--- Choose a Topic ---</option>
                  @for (topic of topics(); track topic.topicID) {
                    <option [value]="topic.topicID">{{ topic.topicTitle }}</option>
                  }
                </select>
              </div>
            </div>
          </div>
        </div>

        @if (isLoading()) {
          <div class="text-center py-5">
            <div class="spinner-border text-primary" role="status"></div>
            <p class="mt-3 text-muted">Fetching quality content...</p>
          </div>
        } @else if (questions().length > 0) {
          <div class="questions-list animate__animated animate__fadeIn">
            @for (q of questions(); track q.questionID; let idx = $index) {
              <div class="question-card card border-0 shadow-sm mb-4 rounded-4 overflow-hidden">
                <div class="card-body p-4">
                  <h5 class="fw-bold mb-4 text-primary">
                    <span class="badge bg-primary rounded-pill me-2">Q{{ idx + 1 }}</span>
                    {{ q.questionTitle }}
                  </h5>
                  
                  @if (q.questionImgPath) {
                    <div class="mb-4 text-center">
                      <img [src]="'http://localhost:5241/' + q.questionImgPath" class="img-fluid rounded-3 border shadow-sm max-h-400" alt="Question Image">
                    </div>
                  }

                  <div class="options-grid row g-3 mb-4">
                    @for (opt of q.qOption; track opt.id) {
                      <div class="col-12 col-md-6">
                        <div 
                          class="option-item p-3 border rounded-3 transition-all cursor-pointer"
                          [class.selected]="isOptionSelected(q.questionID, opt.id)"
                          [class.correct]="isShowingAnswer(q.questionID) && isCorrectOption(q, opt.id)"
                          [class.incorrect]="isShowingAnswer(q.questionID) && isOptionSelected(q.questionID, opt.id) && !isCorrectOption(q, opt.id)"
                          (click)="selectOption(q, opt.id)"
                        >
                          <div class="d-flex align-items-center">
                            <div class="option-marker me-3">{{ getOptionLabel($index) }}</div>
                            <div class="flex-grow-1">
                              {{ opt.optionTitle }}
                              @if (opt.optionImgPath) {
                                <div class="mt-2">
                                  <img [src]="'http://localhost:5241/' + opt.optionImgPath" class="img-fluid rounded small-img" alt="Option Image">
                                </div>
                              }
                            </div>
                            @if (isShowingAnswer(q.questionID)) {
                              <i class="bi fs-4 ms-2" [class.bi-check-circle-fill]="isCorrectOption(q, opt.id)" [class.text-success]="isCorrectOption(q, opt.id)" 
                                 [class.bi-x-circle-fill]="isOptionSelected(q.questionID, opt.id) && !isCorrectOption(q, opt.id)" [class.text-danger]="isOptionSelected(q.questionID, opt.id) && !isCorrectOption(q, opt.id)">
                              </i>
                            }
                          </div>
                        </div>
                      </div>
                    }
                  </div>

                  <div class="d-flex justify-content-between align-items-center">
                    <button 
                      class="btn btn-dark rounded-pill px-4 fw-bold shadow-sm transition-all"
                      (click)="toggleAnswer(q.questionID)"
                    >
                      {{ isShowingAnswer(q.questionID) ? 'Hide Answer' : 'Show Answer' }}
                    </button>
                  </div>

                  @if (isShowingAnswer(q.questionID)) {
                    <div class="answer-box mt-4 p-4 rounded-4 bg-light-success animate__animated animate__fadeInUp">
                      <h6 class="fw-bold text-success mb-2"><i class="bi bi-lightbulb-fill me-2"></i> Explanation:</h6>
                      <p class="mb-0">{{ q.ansDescription || 'No detailed explanation provided for this question.' }}</p>
                    </div>
                  }
                </div>
              </div>
            }
          </div>
        } @else if (selectedTopicId !== 0) {
          <div class="text-center py-5 animate__animated animate__fadeIn">
            <i class="bi bi-clipboard-x display-1 text-muted"></i>
            <h4 class="mt-3 text-muted">No questions found for this topic.</h4>
          </div>
        } @else {
          <div class="text-center py-5 animate__animated animate__fadeIn">
             <i class="bi bi-arrow-up-circle display-1 text-primary opacity-25"></i>
             <h4 class="mt-3 text-muted">Please select a topic to start practicing.</h4>
          </div>
        }
      </div>
    </div>
    <app-footer></app-footer>
  `,
    styles: [`
    .dumps-page { background-color: #f8f9fa; min-height: 100vh; }
    .option-item { border: 2px solid #e9ecef; background: white; height: 100%; transition: all 0.2s ease; }
    .option-item:hover { border-color: #0d6efd; background: #f0f7ff; transform: translateY(-2px); }
    .option-item.selected { border-color: #0d6efd; background: #e7f1ff; box-shadow: 0 4px 8px rgba(13, 110, 253, 0.1); }
    .option-item.correct { border-color: #198754; background: #e6f4ea; }
    .option-item.incorrect { border-color: #dc3545; background: #fdf2f2; }
    .option-marker { width: 30px; height: 30px; background: #f8f9fa; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 0.8rem; border: 1px solid #dee2e6; }
    .option-item.selected .option-marker { background: #0d6efd; color: white; border-color: #0d6efd; }
    .bg-light-success { background-color: #f0faf4; border-left: 4px solid #198754; }
    .max-h-400 { max-height: 400px; }
    .small-img { max-height: 100px; }
    .cursor-pointer { cursor: pointer; }
    .transition-all { transition: all 0.3s ease; }
  `]
})
export class DumpsPracticeComponent implements OnInit {
    private certService = inject(CertificationService);

    topics = signal<CertificationTopic[]>([]);
    questions = signal<Question[]>([]);
    isLoading = signal(false);

    selectedTopicId = 0;
    userSelections: Record<number, number[]> = {};
    showingAnswers: Set<number> = new Set();

    ngOnInit() {
        this.certService.getTopicsByUserId().subscribe(data => this.topics.set(data));
    }

    onTopicChange() {
        if (this.selectedTopicId == 0) {
            this.questions.set([]);
            return;
        }

        this.isLoading.set(true);
        this.questions.set([]);
        this.userSelections = {};
        this.showingAnswers.clear();

        this.certService.getQuestionsByTopicId(Number(this.selectedTopicId)).subscribe({
            next: (data) => {
                this.questions.set(data);
                this.isLoading.set(false);
            },
            error: () => this.isLoading.set(false)
        });
    }

    getOptionLabel(index: number): string {
        return String.fromCharCode(65 + index); // A, B, C, D...
    }

    selectOption(q: Question, optionId: number) {
        if (this.showingAnswers.has(q.questionID)) return;

        if (q.optionType === 1) { // Radio
            this.userSelections[q.questionID] = [optionId];
        } else { // Checkbox
            const current = this.userSelections[q.questionID] || [];
            const idx = current.indexOf(optionId);
            if (idx > -1) {
                current.splice(idx, 1);
            } else {
                current.push(optionId);
            }
            this.userSelections[q.questionID] = [...current];
        }
    }

    isOptionSelected(questionId: number, optionId: number): boolean {
        return this.userSelections[questionId]?.includes(optionId) || false;
    }

    toggleAnswer(questionId: number) {
        if (this.showingAnswers.has(questionId)) {
            this.showingAnswers.delete(questionId);
        } else {
            this.showingAnswers.add(questionId);
        }
    }

    isShowingAnswer(questionId: number): boolean {
        return this.showingAnswers.has(questionId);
    }

    isCorrectOption(q: Question, optionId: number): boolean {
        // Backend returns correctOptionID as a string (comma separated for multiple choice)
        const correctIds = q.correctOptionID.split(',').map(id => id.trim());
        return correctIds.includes(optionId.toString());
    }
}
