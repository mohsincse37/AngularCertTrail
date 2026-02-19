import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../Services/user.service';
import { CertificationService } from '../../Services/certification.service';
import { CertificationTopic } from '../../Models/certification';
import { FooterComponent } from '../footer/footer.component';

@Component({
    selector: 'app-subscription-report',
    standalone: true,
    imports: [CommonModule, FormsModule, FooterComponent],
    template: `
    <div class="management-page py-5">
      <div class="container">
        <div class="card border-0 shadow-lg rounded-4 overflow-hidden mb-5">
          <div class="card-header bg-primary text-white p-4">
            <h3 class="mb-0 fw-bold"><i class="bi bi-file-earmark-bar-graph me-2"></i> User Subscription Report</h3>
          </div>
          
          <div class="card-body p-4 bg-light">
            <div class="row align-items-center g-4 mb-4">
              <div class="col-md-3 text-md-end">
                <label class="fw-bold text-dark">Filter by Topic:</label>
              </div>
              <div class="col-md-6">
                <select 
                  class="form-select border-primary border-2 rounded-pill px-4" 
                  [(ngModel)]="selectedTopicId" 
                  (change)="loadReport()"
                >
                  <option value="0">--- Select a Topic to Generate Report ---</option>
                  @for (topic of topics(); track topic.topicID) {
                    <option [value]="topic.topicID">{{ topic.topicTitle }}</option>
                  }
                </select>
              </div>
              <div class="col-md-3">
                @if (isLoading()) {
                  <div class="spinner-border text-primary spinner-border-sm" role="status"></div>
                  <span class="ms-2 text-muted small">Generating...</span>
                }
              </div>
            </div>

            <div class="table-responsive rounded-3 border bg-white mb-4">
              <table class="table table-hover align-middle mb-0">
                <thead class="table-light">
                  <tr>
                    <th class="ps-4">SL</th>
                    <th>User ID</th>
                    <th>Topic</th>
                    <th>From Date</th>
                    <th>To Date</th>
                    <th class="text-end pe-4">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  @for (row of reportData(); track $index; let idx = $index) {
                    <tr>
                      <td class="ps-4 fw-bold text-muted">{{ idx + 1 }}</td>
                      <td><span class="badge bg-light text-dark border">UID-{{ row.userID }}</span></td>
                      <td><span class="fw-bold text-primary">{{ row.topicTitle }}</span></td>
                      <td><i class="bi bi-calendar-event me-2 text-muted"></i>{{ row.fromDate | date:'mediumDate' }}</td>
                      <td><i class="bi bi-calendar-check me-2 text-success"></i>{{ row.toDate | date:'mediumDate' }}</td>
                      <td class="text-end pe-4 fw-bold text-success">{{ row.amount }} USD</td>
                    </tr>
                  } @empty {
                    <tr>
                      <td colspan="6" class="text-center py-5">
                        <i class="bi bi-search display-1 text-muted opacity-25"></i>
                        <p class="mt-3 text-muted">Select a topic above to view subscription data.</p>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>

            @if (reportData().length > 0) {
              <div class="d-flex justify-content-end">
                <div class="p-3 bg-white border rounded-4 shadow-sm">
                  <span class="text-muted me-3">Total Subscriptions:</span>
                  <span class="fw-bold fs-4 text-primary">{{ reportData().length }}</span>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
    <app-footer></app-footer>
  `,
    styles: [`
    .management-page { background: #f0f4f8; min-height: 100vh; }
    .bg-light { background-color: #f8fafc !important; }
  `]
})
export class SubscriptionReportComponent implements OnInit {
    private userService = inject(UserService);
    private certService = inject(CertificationService);

    topics = signal<CertificationTopic[]>([]);
    reportData = signal<any[]>([]);
    selectedTopicId = 0;
    isLoading = signal(false);

    ngOnInit() {
        this.certService.getTopics().subscribe(data => this.topics.set(data));
    }

    loadReport() {
        if (this.selectedTopicId === 0) {
            this.reportData.set([]);
            return;
        }

        this.isLoading.set(true);
        this.userService.getSubscriptionReport(Number(this.selectedTopicId)).subscribe({
            next: (data) => {
                this.reportData.set(data);
                this.isLoading.set(false);
            },
            error: (err) => {
                console.error('Error loading report:', err);
                this.isLoading.set(false);
            }
        });
    }
}
