import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';

interface FamilyMember {
  memberId: number;
  name: string;
  relation: string;
  age: number;
  medicalCondition?: string;
}

interface Pet {
  id: number;
  name: string;
  type: string;
  breed: string;
  age: number;
  specialCareNote?: string;
}

interface Appointment {
  id: number;
  type: 'family' | 'pet';
  memberId: number;
  memberName: string;
  service: string;
  date: string;
  time: string;
  pickupDrop: boolean;
  address?: string;
  notes?: string;
  status: 'scheduled' | 'checked-in' | 'in-progress' | 'checked-out' | 'completed' | 'cancelled';
  checkInTime?: string;
  checkOutTime?: string;
  adminNotes?: string;
  photos?: {
    id: number;
    url: string;
    description: string;
    uploadedAt: string;
    uploadedBy: string;
  }[];
  feedback?: {
    rating: number;
    comment: string;
    givenAt: string;
  };
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  // Data arrays
  familyMembers: FamilyMember[] = [];
  pets: Pet[] = [];
  appointments: Appointment[] = [];
  
  // Modal states
  showFamilyModal = false;
  showPetModal = false;
  showAppointmentModal = false;
  showAppointmentHistoryModal = false;
  showFeedbackModal = false;
  showContactModal = false;
  showViewAppointmentModal = false;
  
  // Editing states
  editingFamilyMember: FamilyMember | null = null;
  editingPet: Pet | null = null;
  selectedAppointmentForFeedback: Appointment | null = null;
  selectedAppointmentForView: Appointment | null = null;
  
  // Form objects
  familyMemberForm: Partial<FamilyMember> = {};
  petForm: Partial<Pet> = {};
  appointmentForm: Partial<Appointment> = {};
  feedbackForm = {
    rating: 0,
    comment: ''
  };
  contactForm = {
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    priority: 'normal'
  };
  
  // ID counters
  private nextFamilyId = 1;
  private nextPetId = 1;
  private nextAppointmentId = 1;

  // User data
  public userName: string = '';
  public userEmail: string = '';

  // Available services
  services = [
    'Child Day Care',
    'Elder Day Care',
    'Pet Day Care',
    'Special Needs Care',
    'After School Program',
    'Respite Care'
  ];

  // Get filtered services based on appointment type
  getFilteredServices(): string[] {
    if (this.appointmentForm.type === 'pet') {
      return this.services.filter(service => 
        service === 'Pet Day Care' || 
        service === 'Special Needs Care' || 
        service === 'Respite Care'
      );
    } else {
      // For family appointments, show all services except Pet Day Care
      return this.services.filter(service => service !== 'Pet Day Care');
    }
  }

  constructor(private userService: UserService) {
    // Add some sample data for demonstration
    this.addSampleData();
  }
  ngOnInit(): void {
    //@ts-ignore
    this.userName = sessionStorage.getItem('user_Name');
    //@ts-ignore
    this.userEmail = sessionStorage.getItem('user');
    
    // Load family members from API
    this.loadFamilyMembers();
    
    // Load pet members from API
    this.loadPetMembers();
  }

  // Load family members from backend API
  loadFamilyMembers() {
    this.userService.getFamilyMembers().subscribe({
      next: (response) => {
        console.log('Family members loaded:', response);
        this.familyMembers = response || [];
        
        // Update the next ID counter based on existing members
        if (this.familyMembers.length > 0) {
          const maxId = Math.max(...this.familyMembers.map(m => m.memberId || 0));
          this.nextFamilyId = maxId + 1;
        }
      },
      error: (error) => {
        console.error('Error loading family members:', error);
        // Keep empty array on error
        this.familyMembers = [];
      }
    });
  }

  // Load pet members from backend API
  loadPetMembers() {
    this.userService.getPetMembers().subscribe({
      next: (response) => {
        console.log('Pet members loaded:', response);
        this.pets = response || [];
        
        // Update the next ID counter based on existing pets
        if (this.pets.length > 0) {
          const maxId = Math.max(...this.pets.map(p => p.id || 0));
          this.nextPetId = maxId + 1;
        }
      },
      error: (error) => {
        console.error('Error loading pet members:', error);
        // Keep empty array on error
        this.pets = [];
      }
    });
  }

  // Family Member Methods
  showAddFamilyModal() {
    this.editingFamilyMember = null;
    this.familyMemberForm = {};
    this.showFamilyModal = true;
  }

  editFamilyMember(member: FamilyMember) {
    this.editingFamilyMember = member;
    this.familyMemberForm = { ...member };
    this.showFamilyModal = true;
  }

  closeFamilyModal() {
    this.showFamilyModal = false;
    this.editingFamilyMember = null;
    this.familyMemberForm = {};
  }

  saveFamilyMember() {
    if (this.editingFamilyMember) {
      // Update existing member
      const index = this.familyMembers.findIndex(m => m.memberId === this.editingFamilyMember!.memberId);
      if (index !== -1) {
        this.familyMembers[index] = { ...this.familyMemberForm } as FamilyMember;
      }
      this.closeFamilyModal();
    } else {
      // Add new member - call backend API
      const memberData = {
        name: this.familyMemberForm.name || '',
        relation: this.familyMemberForm.relation || '',
        age: this.familyMemberForm.age || 0,
        medicalCondition: this.familyMemberForm.medicalCondition || ''
      };

      this.userService.addFamilyMember(memberData).subscribe({
        next: (response) => {
          console.log('Family member added successfully:', response);
          
          // Reload family members from API to get updated list
          this.loadFamilyMembers();
          
          this.closeFamilyModal();
          alert('Family member added successfully!');
        },
        error: (error) => {
          console.error('Error adding family member:', error);
          alert('Failed to add family member. Please try again.');
        }
      });
    }
  }

  deleteFamilyMember(id: number) {
    console.log('Deleting family member with ID:', id);
    if (confirm('Are you sure you want to delete this family member?')) {
      // Call backend API to delete the family member
      this.userService.removeMember(id).subscribe({
        next: (response) => {
          console.log('Family member deleted successfully:', response);
          
          // Reload family members from API to get updated list
          this.loadFamilyMembers();
          
          alert('Family member deleted successfully!');
        },
        error: (error) => {
          console.error('Error deleting family member:', error);
          alert('Failed to delete family member. Please try again.');
        }
      });
    }
  }

  // Pet Methods
  showAddPetModal() {
    this.editingPet = null;
    this.petForm = {};
    this.showPetModal = true;
  }

  editPet(pet: Pet) {
    this.editingPet = pet;
    this.petForm = { ...pet };
    this.showPetModal = true;
  }

  closePetModal() {
    this.showPetModal = false;
    this.editingPet = null;
    this.petForm = {};
  }

  savePet() {
    if (this.editingPet) {
      // Update existing pet
      const index = this.pets.findIndex(p => p.id === this.editingPet!.id);
      if (index !== -1) {
        this.pets[index] = { ...this.petForm } as Pet;
      }
      this.closePetModal();
    } else {
      // Add new pet - call backend API
      const petData = {
        name: this.petForm.name || '',
        type: this.petForm.type || '',
        breed: this.petForm.breed || '',
        age: this.petForm.age || 0,
        specialCareNote: this.petForm.specialCareNote || ''
      };

      this.userService.addPet(petData).subscribe({
        next: (response) => {
          console.log('Pet added successfully:', response);
          
          // Reload pet members from API to get updated list
          this.loadPetMembers();
          
          this.closePetModal();
          alert('Pet added successfully!');
        },
        error: (error) => {
          console.error('Error adding pet:', error);
          alert('Failed to add pet. Please try again.');
        }
      });
    }
  }

  deletePet(id: number) {
    if (confirm('Are you sure you want to delete this pet?')) {
      this.pets = this.pets.filter(p => p.id !== id);
    }
  }

  // Appointment Management Methods
  scheduleAppointment(type: 'family' | 'pet', memberId: number, memberName: string) {
    this.appointmentForm = {
      type: type,
      memberId: memberId,
      memberName: memberName,
      date: '',
      time: '',
      service: '',
      pickupDrop: false,
      address: '',
      notes: '',
      status: 'scheduled'
    };
    this.showAppointmentModal = true;
  }

  closeAppointmentModal() {
    this.showAppointmentModal = false;
    this.appointmentForm = {};
  }

  saveAppointment() {
    if (this.appointmentForm.service && this.appointmentForm.date && this.appointmentForm.time) {
      const newAppointment: Appointment = {
        id: this.nextAppointmentId++,
        type: this.appointmentForm.type!,
        memberId: this.appointmentForm.memberId!,
        memberName: this.appointmentForm.memberName!,
        service: this.appointmentForm.service!,
        date: this.appointmentForm.date!,
        time: this.appointmentForm.time!,
        pickupDrop: this.appointmentForm.pickupDrop || false,
        address: this.appointmentForm.address || '',
        notes: this.appointmentForm.notes || '',
        status: 'scheduled'
      };
      this.appointments.push(newAppointment);
      this.closeAppointmentModal();
      alert('Appointment scheduled successfully!');
    } else {
      alert('Please fill in all required fields');
    }
  }

  cancelAppointment(id: number) {
    if (confirm('Are you sure you want to cancel this appointment?')) {
      const appointment = this.appointments.find(a => a.id === id);
      if (appointment) {
        appointment.status = 'cancelled';
      }
    }
  }

  deleteAppointment(id: number) {
    if (confirm('Are you sure you want to delete this appointment?')) {
      this.appointments = this.appointments.filter(a => a.id !== id);
    }
  }

  getUpcomingAppointments() {
    return this.appointments.filter(a => a.status === 'scheduled' || a.status === 'checked-in' || a.status === 'in-progress').slice(0, 5);
  }

  getCurrentDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  // Appointment History and Feedback Methods
  showAppointmentHistory() {
    this.showAppointmentHistoryModal = true;
  }

  closeAppointmentHistory() {
    this.showAppointmentHistoryModal = false;
  }

  getAllAppointments() {
    return this.appointments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  getPastAppointments() {
    const today = new Date().toISOString().split('T')[0];
    return this.appointments.filter(a => a.date < today || a.status === 'completed').slice(0, 10);
  }

  openFeedbackModal(appointment: Appointment) {
    this.selectedAppointmentForFeedback = appointment;
    this.feedbackForm = {
      rating: appointment.feedback?.rating || 0,
      comment: appointment.feedback?.comment || ''
    };
    this.showFeedbackModal = true;
  }

  closeFeedbackModal() {
    this.showFeedbackModal = false;
    this.selectedAppointmentForFeedback = null;
    this.feedbackForm = { rating: 0, comment: '' };
  }

  setRating(rating: number) {
    this.feedbackForm.rating = rating;
  }

  saveFeedback() {
    if (this.selectedAppointmentForFeedback && this.feedbackForm.rating > 0) {
      this.selectedAppointmentForFeedback.feedback = {
        rating: this.feedbackForm.rating,
        comment: this.feedbackForm.comment,
        givenAt: new Date().toISOString()
      };
      this.selectedAppointmentForFeedback.status = 'completed';
      this.closeFeedbackModal();
      alert('Thank you for your feedback!');
    } else {
      alert('Please provide a rating before submitting feedback');
    }
  }

  markAsCompleted(appointmentId: number) {
    const appointment = this.appointments.find(a => a.id === appointmentId);
    if (appointment) {
      appointment.status = 'completed';
    }
  }

  // Contact Us Methods
  showContactUs() {
    this.contactForm = {
      name: 'John Doe', // Pre-fill with user name
      email: 'john.doe@example.com', // Pre-fill with user email
      phone: '',
      subject: '',
      message: '',
      priority: 'normal'
    };
    this.showContactModal = true;
  }

  closeContactModal() {
    this.showContactModal = false;
    this.contactForm = {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
      priority: 'normal'
    };
  }

  submitContactForm() {
    if (this.contactForm.name && this.contactForm.email && this.contactForm.subject && this.contactForm.message) {
      // Send the message to the server using user service
      this.userService.contactUs(this.contactForm).subscribe({
        next: (response) => {
          console.log('Contact form submitted successfully:', response);
          this.closeContactModal();
          alert('Your message has been sent successfully! Our admin team will contact you within 24 hours.');
        },
        error: (error) => {
          console.error('Error submitting contact form:', error);
          alert('There was an error sending your message. Please try again later.');
        }
      });
    } else {
      alert('Please fill in all required fields');
    }
  }

  viewAppointmentDetails(appointment: Appointment) {
    this.selectedAppointmentForView = appointment;
    this.showViewAppointmentModal = true;
  }

  closeViewAppointmentModal() {
    this.showViewAppointmentModal = false;
    this.selectedAppointmentForView = null;
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'scheduled': return 'badge-scheduled';
      case 'checked-in': return 'badge-checked-in';
      case 'in-progress': return 'badge-in-progress';
      case 'checked-out': return 'badge-checked-out';
      case 'completed': return 'badge-completed';
      case 'cancelled': return 'badge-cancelled';
      default: return 'badge-scheduled';
    }
  }

  formatDateTime(timestamp: string): string {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }

  // Helper method to add sample data
  private addSampleData() {
    // Remove sample family members - will be loaded from API
    this.familyMembers = [];

    // Remove sample pets - will be loaded from API
    this.pets = [];

    // Add some sample appointments for demonstration
    this.appointments = [
      {
        id: this.nextAppointmentId++,
        type: 'family',
        memberId: 1,
        memberName: 'Sarah Doe',
        service: 'Elder Day Care',
        date: '2025-07-25',
        time: '09:00',
        pickupDrop: true,
        address: '123 Main St',
        status: 'completed',
        checkInTime: '8:55 AM',
        checkOutTime: '5:10 PM',
        adminNotes: 'Had a wonderful day participating in art therapy and social activities. Very cooperative and engaged with other participants.',
        photos: [
          {
            id: 1,
            url: '/assets/sample-care-photo1.jpg',
            description: 'Participating in art therapy session',
            uploadedAt: '2025-07-25T10:30:00Z',
            uploadedBy: 'Care Staff - Maria'
          },
          {
            id: 2,
            url: '/assets/sample-care-photo2.jpg',
            description: 'Lunch time with friends',
            uploadedAt: '2025-07-25T12:15:00Z',
            uploadedBy: 'Care Staff - John'
          }
        ],
        feedback: {
          rating: 5,
          comment: 'Excellent service! Very caring staff.',
          givenAt: '2025-07-25T18:00:00Z'
        }
      },
      {
        id: this.nextAppointmentId++,
        type: 'family',
        memberId: 2,
        memberName: 'Emma Doe',
        service: 'After School Care',
        date: '2025-07-28',
        time: '15:30',
        pickupDrop: false,
        status: 'completed',
        checkInTime: '3:25 PM',
        checkOutTime: '6:00 PM',
        adminNotes: 'Completed homework on time. Enjoyed recreational activities and made new friends during playtime.',
        photos: [
          {
            id: 3,
            url: '/assets/sample-school-photo.jpg',
            description: 'Homework completion session',
            uploadedAt: '2025-07-28T16:00:00Z',
            uploadedBy: 'Care Staff - Sarah'
          }
        ]
      },
      {
        id: this.nextAppointmentId++,
        type: 'pet',
        memberId: 1,
        memberName: 'Buddy',
        service: 'Pet Day Care',
        date: '2025-08-02',
        time: '08:00',
        pickupDrop: true,
        address: '123 Main St',
        status: 'in-progress',
        checkInTime: '7:55 AM',
        adminNotes: 'Very energetic today! Currently enjoying outdoor play time with other dogs. Had a healthy breakfast.',
        photos: [
          {
            id: 4,
            url: '/assets/sample-pet-photo.jpg',
            description: 'Morning playtime in the yard',
            uploadedAt: '2025-08-02T09:30:00Z',
            uploadedBy: 'Pet Care Staff - Mike'
          }
        ]
      }
    ];
  }
}
