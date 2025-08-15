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
  memberId: number;
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
  serviceName: string;
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
    
    // Load appointments from API
    this.loadAppointments();
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
          const maxId = Math.max(...this.pets.map(p => p.memberId || 0));
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

  // Load appointments from backend API
  loadAppointments() {
    this.userService.getBookedAppointments().subscribe({
      next: (response) => {
        console.log('Appointments loaded:', response);
        console.log('Number of appointments received:', response ? response.length : 0);
        this.appointments = response || [];
        
        // Log appointment details for debugging
        if (this.appointments.length > 0) {
          console.log('Appointment statuses:', this.appointments.map(a => a.status));
          console.log('First appointment:', this.appointments[0]);
        }
        
        // Update the next ID counter based on existing appointments
        if (this.appointments.length > 0) {
          const maxId = Math.max(...this.appointments.map(a => a.id || 0));
          this.nextAppointmentId = maxId + 1;
        }
      },
      error: (error) => {
        console.error('Error loading appointments:', error);
        // Keep empty array on error
        this.appointments = [];
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
      // Update existing member - call backend API
      const memberData = {
        memberId: this.editingFamilyMember.memberId,
        name: this.familyMemberForm.name || '',
        relation: this.familyMemberForm.relation || '',
        age: this.familyMemberForm.age || 0,
        medicalCondition: this.familyMemberForm.medicalCondition || ''
      };

      this.userService.updateFamilyMember(memberData).subscribe({
        next: (response) => {
          console.log('Family member updated successfully:', response);
          
          // Reload family members from API to get updated list
          this.loadFamilyMembers();
          
          this.closeFamilyModal();
          alert('Family member updated successfully!');
        },
        error: (error) => {
          console.error('Error updating family member:', error);
          alert('Failed to update family member. Please try again.');
        }
      });
    } else {
      // Add new member - call backend API
      const memberData = {
        name: this.familyMemberForm.name || '',
        relation: this.familyMemberForm.relation || '',
        age: this.familyMemberForm.age || 0,
        medicalCondition: this.familyMemberForm.medicalCondition || '',
        userEmail: sessionStorage.getItem('user') || ''
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
      // Update existing pet - call backend API
      const petData = {
        memberId: this.editingPet.memberId,
        name: this.petForm.name || '',
        type: this.petForm.type || '',
        breed: this.petForm.breed || '',
        age: this.petForm.age || 0,
        specialCareNote: this.petForm.specialCareNote || ''
      };

      this.userService.updatePet(petData).subscribe({
        next: (response) => {
          console.log('Pet updated successfully:', response);
          
          // Reload pet members from API to get updated list
          this.loadPetMembers();
          
          this.closePetModal();
          alert('Pet updated successfully!');
        },
        error: (error) => {
          console.error('Error updating pet:', error);
          alert('Failed to update pet. Please try again.');
        }
      });
    } else {
      // Add new pet - call backend API
      const petData = {
        name: this.petForm.name || '',
        type: this.petForm.type || '',
        breed: this.petForm.breed || '',
        age: this.petForm.age || 0,
        specialCareNote: this.petForm.specialCareNote || '',
        userEmail: sessionStorage.getItem('user') || ''
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
    console.log('Deleting pet with ID:', id);
    if (confirm('Are you sure you want to delete this pet?')) {
      // Call backend API to delete the pet
      this.userService.removePet(id).subscribe({
        next: (response) => {
          console.log('Pet deleted successfully:', response);
          
          // Reload pet members from API to get updated list
          this.loadPetMembers();
          
          alert('Pet deleted successfully!');
        },
        error: (error) => {
          console.error('Error deleting pet:', error);
          alert('Failed to delete pet. Please try again.');
        }
      });
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
      serviceName: '',
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
    if (this.appointmentForm.serviceName && this.appointmentForm.date && this.appointmentForm.time) {
      // Prepare appointment data for backend API
      const appointmentData = {
        appointmentType: this.appointmentForm.type!,
        memberId: this.appointmentForm.type === 'family' ? this.appointmentForm.memberId! : null,
        petId: this.appointmentForm.type === 'pet' ? this.appointmentForm.memberId! : null,
        memberName: this.appointmentForm.memberName!,
        appointmentService: this.appointmentForm.serviceName!,
        appointmentDate: this.appointmentForm.date!,
        appointmentTime: this.appointmentForm.time!,
        pickupDrop: this.appointmentForm.pickupDrop ? 'Y' : 'N',
        pickupDropAddress: this.appointmentForm.address || '',
        userNote: this.appointmentForm.notes || '',
        status: 'scheduled'
      };

      // Call backend API to book appointment
      this.userService.bookAppointment(appointmentData).subscribe({
        next: (response) => {
          console.log('Appointment booked successfully:', response);
          
          // Reload appointments from API to get updated list
          this.loadAppointments();
          
          this.closeAppointmentModal();
          alert('Appointment scheduled successfully!');
        },
        error: (error) => {
          console.error('Error booking appointment:', error);
          alert('Failed to schedule appointment. Please try again.');
        }
      });
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
    console.log('Total appointments:', this.appointments.length);
    console.log('All appointments:', this.appointments);
    
    // Filter appointments that are not completed or cancelled
    const upcomingAppointments = this.appointments.filter(a => 
      a.status !== 'completed' && 
      a.status !== 'cancelled'
    );
    
    console.log('Upcoming appointments after filter:', upcomingAppointments.length);
    console.log('Filtered appointments:', upcomingAppointments);
    
    return upcomingAppointments;
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

    // Remove sample appointments - will be loaded from API
    this.appointments = [];
  }
}
