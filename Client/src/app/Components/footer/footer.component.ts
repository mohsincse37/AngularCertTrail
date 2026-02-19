import { Component } from '@angular/core';

@Component({
    selector: 'app-footer',
    standalone: true,
    template: `
    <footer class="bg-dark text-white py-4 mt-auto">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-md-6 mb-3 mb-md-0 text-center text-md-start">
            <p class="mb-0 text-light opacity-75">
              &copy; {{ currentYear }} CertificateDumps. All rights reserved.
            </p>
          </div>
          <div class="col-md-6 text-center text-md-end">
            <div class="social-links">
              <a href="https://facebook.com" class="text-white mx-2 opacity-75 hover-opacity-100 transition-all" aria-label="Facebook">
                <i class="bi bi-facebook fs-5"></i>
              </a>
              <a href="https://twitter.com" class="text-white mx-2 opacity-75 hover-opacity-100 transition-all" aria-label="Twitter">
                <i class="bi bi-twitter-x fs-5"></i>
              </a>
              <a href="https://linkedin.com" class="text-white mx-2 opacity-75 hover-opacity-100 transition-all" aria-label="LinkedIn">
                <i class="bi bi-linkedin fs-5"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  `,
    styles: [`
    .transition-all { transition: all 0.3s ease; }
    .hover-opacity-100:hover { opacity: 1 !important; transform: translateY(-2px); display: inline-block; }
  `]
})
export class FooterComponent {
    currentYear = new Date().getFullYear();
}
