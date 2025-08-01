import { Component } from '@angular/core';

interface FamilyMember {
  id: number;
  name: string;
  relation: string;
  age: number;
  medicalConditions?: string;
}

interface Pet {
  id: number;
  name: string;
  type: string;
  breed: string;
  age: number;
  specialCare?: string;
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
  status: 'scheduled' | 'completed' | 'cancelled';
  feedback?: {
    rating: number;
    comment: string;
    givenAt: string;
  };
  userInfo?: {
    userName: string;
    userEmail: string;
    userPhone?: string;
  };
}

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  appointments: Appointment[] = [];
  filteredAppointments: Appointment[] = [];
  
  // Filter options
  selectedStatus: string = 'all';
  selectedService: string = 'all';
  selectedDate: string = '';
  searchQuery: string = '';
  
  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;
  
  // Modal states
  showAppointmentDetailsModal = false;
  selectedAppointment: Appointment | null = null;
  
  // Statistics
  stats = {
    total: 0,
    scheduled: 0,
    completed: 0,
    cancelled: 0,
    today: 0
  };

  services = [
    'Child Day Care',
    'Elder Day Care', 
    'Pet Day Care',
    'Special Needs Care',
    'After School Care',
    'Respite Care',
    'Medical Consultation',
    'Health Checkup',
    'Emergency Care',
    'Mental Health Support',
    'Nutrition Counseling',
    'Physiotherapy'
  ];

  constructor() {
    this.loadSampleData();
    this.applyFilters();
    this.calculateStats();
  }

  loadSampleData() {
    // Sample appointments data for admin view
    this.appointments = [
      {
        id: 1,
        type: 'family',
        memberId: 1,
        memberName: 'Sarah Doe',
        service: 'Elder Day Care',
        date: '2025-07-25',
        time: '09:00',
        pickupDrop: true,
        address: '123 Main St, City, State',
        status: 'completed',
        userInfo: {
          userName: 'John Doe',
          userEmail: 'john.doe@example.com',
          userPhone: '+1 (555) 123-4567'
        },
        feedback: {
          rating: 5,
          comment: 'Excellent service! Very caring staff.',
          givenAt: '2025-07-25T18:00:00Z'
        }
      },
      {
        id: 2,
        type: 'family',
        memberId: 2,
        memberName: 'Emma Doe',
        service: 'After School Care',
        date: '2025-08-01',
        time: '15:30',
        pickupDrop: false,
        status: 'scheduled',
        userInfo: {
          userName: 'John Doe',
          userEmail: 'john.doe@example.com',
          userPhone: '+1 (555) 123-4567'
        }
      },
      {
        id: 3,
        type: 'pet',
        memberId: 1,
        memberName: 'Buddy',
        service: 'Pet Day Care',
        date: '2025-08-02',
        time: '08:00',
        pickupDrop: true,
        address: '123 Main St, City, State',
        status: 'scheduled',
        notes: 'Friendly dog, loves treats',
        userInfo: {
          userName: 'John Doe',
          userEmail: 'john.doe@example.com',
          userPhone: '+1 (555) 123-4567'
        }
      },
      {
        id: 4,
        type: 'family',
        memberId: 3,
        memberName: 'Robert Smith',
        service: 'Medical Consultation',
        date: '2025-08-01',
        time: '14:00',
        pickupDrop: false,
        status: 'scheduled',
        userInfo: {
          userName: 'Alice Smith',
          userEmail: 'alice.smith@example.com',
          userPhone: '+1 (555) 987-6543'
        }
      },
      {
        id: 5,
        type: 'family',
        memberId: 4,
        memberName: 'Sophie Johnson',
        service: 'Child Day Care',
        date: '2025-07-30',
        time: '07:30',
        pickupDrop: true,
        address: '456 Oak Ave, City, State',
        status: 'completed',
        userInfo: {
          userName: 'Mike Johnson',
          userEmail: 'mike.johnson@example.com',
          userPhone: '+1 (555) 456-7890'
        },
        feedback: {
          rating: 4,
          comment: 'Good service, child was happy.',
          givenAt: '2025-07-30T17:00:00Z'
        }
      },
      {
        id: 6,
        type: 'family',
        memberId: 5,
        memberName: 'Mary Wilson',
        service: 'Respite Care',
        date: '2025-07-28',
        time: '10:00',
        pickupDrop: false,
        status: 'cancelled',
        userInfo: {
          userName: 'David Wilson',
          userEmail: 'david.wilson@example.com',
          userPhone: '+1 (555) 321-0987'
        }
      }
    ];
  }

  applyFilters() {
    this.filteredAppointments = this.appointments.filter(appointment => {
      // Status filter
      if (this.selectedStatus !== 'all' && appointment.status !== this.selectedStatus) {
        return false;
      }
      
      // Service filter
      if (this.selectedService !== 'all' && appointment.service !== this.selectedService) {
        return false;
      }
      
      // Date filter
      if (this.selectedDate && appointment.date !== this.selectedDate) {
        return false;
      }
      
      // Search query filter
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        return (
          appointment.memberName.toLowerCase().includes(query) ||
          appointment.service.toLowerCase().includes(query) ||
          appointment.userInfo?.userName.toLowerCase().includes(query) ||
          appointment.userInfo?.userEmail.toLowerCase().includes(query)
        );
      }
      
      return true;
    });
    
    // Calculate pagination
    this.totalPages = Math.ceil(this.filteredAppointments.length / this.itemsPerPage);
    if (this.currentPage > this.totalPages) {
      this.currentPage = 1;
    }
  }

  calculateStats() {
    this.stats.total = this.appointments.length;
    this.stats.scheduled = this.appointments.filter(a => a.status === 'scheduled').length;
    this.stats.completed = this.appointments.filter(a => a.status === 'completed').length;
    this.stats.cancelled = this.appointments.filter(a => a.status === 'cancelled').length;
    
    const today = new Date().toISOString().split('T')[0];
    this.stats.today = this.appointments.filter(a => a.date === today).length;
  }

  getPaginatedAppointments() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredAppointments.slice(startIndex, endIndex);
  }

  onFilterChange() {
    this.currentPage = 1;
    this.applyFilters();
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  showAppointmentDetails(appointment: Appointment) {
    this.selectedAppointment = appointment;
    this.showAppointmentDetailsModal = true;
  }

  closeAppointmentDetails() {
    this.showAppointmentDetailsModal = false;
    this.selectedAppointment = null;
  }

  updateAppointmentStatus(appointmentId: number, newStatus: 'scheduled' | 'completed' | 'cancelled') {
    const appointment = this.appointments.find(a => a.id === appointmentId);
    if (appointment) {
      appointment.status = newStatus;
      this.applyFilters();
      this.calculateStats();
      this.closeAppointmentDetails();
    }
  }

  exportAppointments() {
    // This would typically export to CSV or Excel
    console.log('Exporting appointments:', this.filteredAppointments);
    alert('Export functionality would be implemented here');
  }

  getTodaysDate(): string {
    return new Date().toISOString().split('T')[0];
  }
}
