import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  showLearnMoreModal = false;
  showScheduleTourModal = false;
  
  // Schedule Tour Form Data
  tourForm = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    serviceInterest: '',
    preferredDate: '',
    preferredTime: '',
    numberOfPeople: 1,
    specialRequests: '',
    contactMethod: 'email'
  };

  availableTimeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', 
    '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
  ];

  services = [
    'Child Day Care',
    'Elder Day Care',
    'Pet Day Care',
    'Special Needs Care',
    'After School Programs',
    'Respite Care',
    'General Tour'
  ];

  constructor(private router: Router) {}

  ngOnInit() {
    // Initialize testimonial carousel
    this.startTestimonialCarousel();
  }

  openLearnMoreModal() {
    this.showLearnMoreModal = true;
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  }

  closeLearnMoreModal() {
    this.showLearnMoreModal = false;
    document.body.style.overflow = 'auto'; // Restore scrolling
  }

  getStarted() {
    this.closeLearnMoreModal();
    this.router.navigate(['/login']);
  }

  // Schedule Tour Modal Methods
  openScheduleTourModal() {
    this.showScheduleTourModal = true;
    document.body.style.overflow = 'hidden';
  }

  closeScheduleTourModal() {
    this.showScheduleTourModal = false;
    document.body.style.overflow = 'auto';
    this.resetTourForm();
  }

  resetTourForm() {
    this.tourForm = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      serviceInterest: '',
      preferredDate: '',
      preferredTime: '',
      numberOfPeople: 1,
      specialRequests: '',
      contactMethod: 'email'
    };
  }

  submitTourRequest() {
    // Validate form
    if (!this.isFormValid()) {
      alert('Please fill in all required fields.');
      return;
    }

    // Here you would typically send the data to your backend API
    console.log('Tour request submitted:', this.tourForm);
    
    // Show success message
    alert('Thank you! Your tour request has been submitted. We will contact you within 24 hours to confirm your appointment.');
    
    // Close modal and reset form
    this.closeScheduleTourModal();
  }

  isFormValid(): boolean {
    return !!(
      this.tourForm.firstName &&
      this.tourForm.lastName &&
      this.tourForm.email &&
      this.tourForm.phone &&
      this.tourForm.preferredDate &&
      this.tourForm.preferredTime
    );
  }

  // Get minimum date (today)
  getMinDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  // Get maximum date (3 months from now)
  getMaxDate(): string {
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);
    return maxDate.toISOString().split('T')[0];
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
