import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  showLearnMoreModal = false;
  showScheduleTourModal = false;
  
  // Testimonial carousel properties
  currentTestimonial = 0;
  testimonialInterval: any;
  
  testimonials = [
    {
      text: "HHCC has been a blessing for our family. The staff treats our children like their own, and we have complete peace of mind knowing they're in such caring hands.",
      authorName: "Sarah & Michael Johnson",
      authorDetail: "Parents of 2, Members since 2020"
    },
    {
      text: "My mother loves coming to HHCC every day. The elder care program has given her new friends and activities she enjoys. I'm so grateful for their compassionate staff.",
      authorName: "David Chen",
      authorDetail: "Son of Mary Chen, Member since 2019"
    },
    {
      text: "The after-school program has been amazing for Emma. She's learning so much and always comes home excited about her day. The homework help is invaluable!",
      authorName: "Lisa Rodriguez",
      authorDetail: "Mother of Emma, Member since 2021"
    },
    {
      text: "Finding quality care for my son with special needs was challenging until we discovered HHCC. Their specialized staff and individualized approach is exceptional.",
      authorName: "Robert & Angela Williams",
      authorDetail: "Parents of Alex, Member since 2018"
    },
    {
      text: "Our dog Max absolutely loves his days at HHCC! The pet care team is professional and loving. It's wonderful to have a place we can trust with our furry family member.",
      authorName: "Jennifer & Mark Thompson",
      authorDetail: "Pet owners, Members since 2022"
    }
  ];
  
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
    // Start testimonial carousel
    this.startTestimonialCarousel();
  }

  ngOnDestroy() {
    // Clear interval when component is destroyed
    if (this.testimonialInterval) {
      clearInterval(this.testimonialInterval);
    }
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
    // Auto-rotate testimonials every 4 seconds
    this.testimonialInterval = setInterval(() => {
      this.nextTestimonial();
    }, 4000);
  }

  nextTestimonial() {
    this.currentTestimonial = (this.currentTestimonial + 1) % this.testimonials.length;
  }

  previousTestimonial() {
    this.currentTestimonial = this.currentTestimonial === 0 
      ? this.testimonials.length - 1 
      : this.currentTestimonial - 1;
  }

  goToTestimonial(index: number) {
    this.currentTestimonial = index;
  }

  isActiveTestimonial(index: number): boolean {
    return this.currentTestimonial === index;
  }
}
