import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  ngOnInit() {
    // Initialize testimonial carousel
    this.startTestimonialCarousel();
  }

  private startTestimonialCarousel() {
    let currentTestimonial = 0;
    const testimonials = document.querySelectorAll('.testimonial-content');
    const indicators = document.querySelectorAll('.indicator');
    
    if (testimonials.length === 0) return;

    const showTestimonial = (index: number) => {
      testimonials.forEach((testimonial, i) => {
        testimonial.classList.remove('active', 'fade-out');
        if (i === index) {
          testimonial.classList.add('active');
        }
      });
      
      indicators.forEach((indicator, i) => {
        indicator.classList.toggle('active', i === index);
      });
    };

    // Auto-rotate testimonials
    setInterval(() => {
      const nextTestimonial = (currentTestimonial + 1) % testimonials.length;
      
      // Add fade-out class to current testimonial
      testimonials[currentTestimonial].classList.add('fade-out');
      
      setTimeout(() => {
        showTestimonial(nextTestimonial);
        currentTestimonial = nextTestimonial;
      }, 400);
    }, 4000);

    // Initialize first testimonial
    showTestimonial(0);

    // Add click handlers for indicators
    indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => {
        testimonials[currentTestimonial].classList.add('fade-out');
        setTimeout(() => {
          showTestimonial(index);
          currentTestimonial = index;
        }, 400);
      });
    });
  }
}
