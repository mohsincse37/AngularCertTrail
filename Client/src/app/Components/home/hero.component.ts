import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-hero',
    standalone: true,
    imports: [RouterLink],
    template: `
    <section 
      class="hero-section position-relative d-flex align-items-center justify-content-center"
      style="background-image: url('https://images.unsplash.com/photo-1516321497487-e288fb19713f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80'); background-size: cover; background-position: center; height: 50vh;"
    >
      <!-- Shadow overlay with gradient -->
      <div 
        class="position-absolute top-0 start-0 w-100 h-100"
        style="background: linear-gradient(to bottom, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7));"
      ></div>

      <!-- Content -->
      <div class="position-relative z-index-10 text-center text-white px-3 animate__animated animate__fadeIn">
        <h1 
          class="display-4 fw-bold mb-4 text-uppercase tracking-wider"
          style="text-shadow: 2px 4px 8px rgba(0, 0, 0, 0.6);"
        >
          Subscription Certification Topic
        </h1>
        <div class="d-flex justify-content-center gap-3">
          <a 
            routerLink="/home" 
            class="btn btn-primary btn-lg text-white px-5 py-3 rounded-pill fw-bold shadow-lg hover-scale transition-all"
          >
            Free Dumps Practice
          </a>
        </div>
      </div>
    </section>
  `,
    styles: [`
    .z-index-10 { z-index: 10; }
    .tracking-wider { letter-spacing: 0.1rem; }
    .hover-scale { transition: transform 0.3s ease, box-shadow 0.3s ease; }
    .hover-scale:hover { transform: scale(1.05); box-shadow: 0 10px 20px rgba(0,0,0,0.3) !important; }
    .transition-all { transition: all 0.3s ease; }
  `]
})
export class HeroComponent { }
