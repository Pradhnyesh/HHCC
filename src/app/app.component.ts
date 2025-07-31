import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'HHCC';
  private testimonialInterval: any;
  private currentTestimonial = 0;
  private totalTestimonials = 5;

  ngOnInit() {
    this.startTestimonialRotation();
    this.setupIndicatorClickHandlers();
  }

  ngOnDestroy() {
    if (this.testimonialInterval) {
      clearInterval(this.testimonialInterval);
    }
  }

  private startTestimonialRotation() {
    this.testimonialInterval = setInterval(() => {
      this.rotateTestimonial();
    }, 3000); // Change every 3 seconds
  }

  private setupIndicatorClickHandlers() {
    // Wait for the DOM to be ready
    setTimeout(() => {
      const indicators = document.querySelectorAll('.indicator');
      indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
          this.goToTestimonial(index);
        });
      });
    }, 100);
  }

  private goToTestimonial(index: number) {
    if (index === this.currentTestimonial) return;
    
    // Clear the interval and restart it to reset the timer
    if (this.testimonialInterval) {
      clearInterval(this.testimonialInterval);
    }
    
    const testimonials = document.querySelectorAll('.testimonial-content');
    const indicators = document.querySelectorAll('.indicator');
    
    if (testimonials.length > 0) {
      // Fade out current testimonial
      const currentTestimonial = testimonials[this.currentTestimonial];
      const currentIndicator = indicators[this.currentTestimonial];
      
      currentTestimonial.classList.add('fade-out');
      currentIndicator.classList.remove('active');
      
      setTimeout(() => {
        // Remove classes from current
        currentTestimonial.classList.remove('active', 'fade-out');
        
        // Update to new testimonial
        this.currentTestimonial = index;
        
        // Add active class to new testimonial and indicator
        const nextTestimonial = testimonials[this.currentTestimonial];
        const nextIndicator = indicators[this.currentTestimonial];
        
        nextTestimonial.classList.add('active');
        nextIndicator.classList.add('active');
      }, 400);
    }
    
    // Restart the rotation
    this.startTestimonialRotation();
  }

  private rotateTestimonial() {
    const testimonials = document.querySelectorAll('.testimonial-content');
    const indicators = document.querySelectorAll('.indicator');
    
    if (testimonials.length > 0) {
      const currentTestimonial = testimonials[this.currentTestimonial];
      const currentIndicator = indicators[this.currentTestimonial];
      
      // Add fade-out class to current testimonial
      currentTestimonial.classList.add('fade-out');
      currentIndicator.classList.remove('active');
      
      // Wait for fade-out animation to complete, then switch
      setTimeout(() => {
        // Remove active and fade-out classes from current
        currentTestimonial.classList.remove('active', 'fade-out');
        
        // Move to next testimonial
        this.currentTestimonial = (this.currentTestimonial + 1) % this.totalTestimonials;
        
        // Add active class to new testimonial and indicator
        const nextTestimonial = testimonials[this.currentTestimonial];
        const nextIndicator = indicators[this.currentTestimonial];
        
        nextTestimonial.classList.add('active');
        nextIndicator.classList.add('active');
      }, 400); // Half of the transition duration for smooth crossfade
    }
  }
}
