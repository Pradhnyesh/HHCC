import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from '../../../services/admin.service';

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

interface Notification {
  id: number;
  message: string;
  senderName?: string;
  senderEmail?: string;
  timestamp: string;
  isRead: boolean;
  type: 'message' | 'inquiry' | 'contact';
}

interface TourRequest {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  serviceInterest: string;
  preferredDate: string;
  preferredTime: string;
  numberOfPeople: number;
  specialRequests?: string;
  contactMethod: 'email' | 'phone';
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  submittedAt: string;
  confirmedDate?: string;
  confirmedTime?: string;
  assignedStaff?: string;
  cancellationReason?: string;
  notes?: string;
}

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit, OnDestroy {
  appointments: Appointment[] = [];
  filteredAppointments: Appointment[] = [];
  
  // Filter options
  selectedStatus: string = 'all';
  selectedService: string = 'all';
  selectedDate: string = '';
  searchQuery: string = '';
  selectedTimePeriod: string = 'today'; // New time period filter
  
  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;
  
  // Modal states
  showAppointmentDetailsModal = false;
  selectedAppointment: Appointment | null = null;
  
  // Notification states
  notifications: Notification[] = [];
  showNotifications = false;
  unreadNotificationCount = 0;
  hasUnreadNotifications = false;
  
  // Tour Request states
  tourRequests: TourRequest[] = [];
  filteredTourRequests: TourRequest[] = [];
  selectedTourStatus: string = 'all';
  showTourDetailsModal = false;
  showConfirmTourModal = false;
  showCancelTourModal = false;
  selectedTourRequest: TourRequest | null = null;
  
  // Tour management form data
  tourConfirmation = {
    confirmedDate: '',
    confirmedTime: '',
    assignedStaff: '',
    notes: ''
  };
  
  tourCancellation = {
    reason: '',
    notes: ''
  };
  
  // Statistics
  stats = {
    total: 0,
    scheduled: 0,
    completed: 0,
    cancelled: 0,
    today: 0
  };
  
  tourStats = {
    pending: 0,
    confirmed: 0,
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

  timePeriods = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'Current Week' },
    { value: 'month', label: 'Current Month' },
    { value: 'quarter', label: 'Current Quarter' },
    { value: 'halfyear', label: 'Current Half Year' },
    { value: 'year', label: 'Current Year' }
  ];

  availableStaff = [
    'Sarah Johnson - Director',
    'Michael Chen - Child Care Supervisor',
    'Emily Davis - Elder Care Coordinator',
    'David Rodriguez - Special Needs Specialist',
    'Lisa Thompson - Operations Manager',
    'Robert Wilson - Pet Care Supervisor'
  ];

  availableTimeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', 
    '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
  ];

  constructor(private router: Router, private adminService: AdminService) {
    this.loadSampleData();
    this.applyFilters();
    this.calculateStats();
  }

  loadSampleData() {
    // Sample appointments data for admin view with various dates for testing time periods
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
        date: '2025-08-01', // Today
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
        date: '2025-08-01', // Today
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
      },
      {
        id: 7,
        type: 'family',
        memberId: 6,
        memberName: 'Tom Brown',
        service: 'Special Needs Care',
        date: '2025-06-15', // Previous quarter
        time: '11:00',
        pickupDrop: true,
        address: '789 Pine St, City, State',
        status: 'completed',
        userInfo: {
          userName: 'Lisa Brown',
          userEmail: 'lisa.brown@example.com',
          userPhone: '+1 (555) 654-3210'
        },
        feedback: {
          rating: 5,
          comment: 'Outstanding care and support.',
          givenAt: '2025-06-15T16:00:00Z'
        }
      },
      {
        id: 8,
        type: 'pet',
        memberId: 2,
        memberName: 'Whiskers',
        service: 'Pet Day Care',
        date: '2024-12-20', // Previous year
        time: '09:30',
        pickupDrop: false,
        status: 'completed',
        userInfo: {
          userName: 'Sarah Green',
          userEmail: 'sarah.green@example.com',
          userPhone: '+1 (555) 111-2222'
        },
        feedback: {
          rating: 4,
          comment: 'Cat was well taken care of.',
          givenAt: '2024-12-20T17:00:00Z'
        }
      },
      {
        id: 9,
        type: 'family',
        memberId: 7,
        memberName: 'Grace Taylor',
        service: 'Health Checkup',
        date: '2025-08-05', // This week
        time: '10:00',
        pickupDrop: false,
        status: 'scheduled',
        userInfo: {
          userName: 'Mark Taylor',
          userEmail: 'mark.taylor@example.com',
          userPhone: '+1 (555) 333-4444'
        }
      },
      {
        id: 10,
        type: 'family',
        memberId: 8,
        memberName: 'Oliver Davis',
        service: 'Mental Health Support',
        date: '2025-02-10', // Earlier this year but different quarter
        time: '13:00',
        pickupDrop: true,
        address: '321 Cedar Ave, City, State',
        status: 'completed',
        userInfo: {
          userName: 'Amanda Davis',
          userEmail: 'amanda.davis@example.com',
          userPhone: '+1 (555) 555-6666'
        },
        feedback: {
          rating: 5,
          comment: 'Very professional and caring service.',
          givenAt: '2025-02-10T15:00:00Z'
        }
      }
    ];
  }

  applyFilters() {
    this.filteredAppointments = this.appointments.filter(appointment => {
      // Time period filter
      const dateRange = this.getDateRangeForTimePeriod();
      if (dateRange) {
        const appointmentDate = new Date(appointment.date);
        if (appointmentDate < dateRange.start || appointmentDate > dateRange.end) {
          return false;
        }
      }

      // Status filter
      if (this.selectedStatus !== 'all' && appointment.status !== this.selectedStatus) {
        return false;
      }
      
      // Service filter
      if (this.selectedService !== 'all' && appointment.service !== this.selectedService) {
        return false;
      }
      
      // Date filter (specific date)
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
    // Use filtered appointments for statistics based on time period
    const appointmentsForStats = this.getAppointmentsForTimePeriod();
    
    this.stats.total = appointmentsForStats.length;
    this.stats.scheduled = appointmentsForStats.filter(a => a.status === 'scheduled').length;
    this.stats.completed = appointmentsForStats.filter(a => a.status === 'completed').length;
    this.stats.cancelled = appointmentsForStats.filter(a => a.status === 'cancelled').length;
    
    const today = new Date().toISOString().split('T')[0];
    this.stats.today = appointmentsForStats.filter(a => a.date === today).length;
  }

  getAppointmentsForTimePeriod(): Appointment[] {
    const dateRange = this.getDateRangeForTimePeriod();
    if (!dateRange) {
      return this.appointments; // Return all appointments if no time filter
    }

    return this.appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.date);
      return appointmentDate >= dateRange.start && appointmentDate <= dateRange.end;
    });
  }

  getPaginatedAppointments() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredAppointments.slice(startIndex, endIndex);
  }

  onFilterChange() {
    this.currentPage = 1;
    this.applyFilters();
    this.calculateStats(); // Recalculate stats when filters change
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

  navigateToManageAppointments() {
    this.router.navigate(['/manage-appointments']);
  }

  getTodaysDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  getDateRangeForTimePeriod(): { start: Date; end: Date } | null {
    if (this.selectedTimePeriod === 'all') {
      return null; // No date filtering
    }

    const now = new Date();
    const start = new Date();
    const end = new Date();

    switch (this.selectedTimePeriod) {
      case 'today':
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        break;
      
      case 'week':
        // Current week (Monday to Sunday)
        const day = now.getDay();
        const diff = now.getDate() - day + (day === 0 ? -6 : 1);
        start.setDate(diff);
        start.setHours(0, 0, 0, 0);
        end.setDate(diff + 6);
        end.setHours(23, 59, 59, 999);
        break;
      
      case 'month':
        // Current month
        start.setDate(1);
        start.setHours(0, 0, 0, 0);
        end.setMonth(end.getMonth() + 1);
        end.setDate(0);
        end.setHours(23, 59, 59, 999);
        break;
      
      case 'quarter':
        // Current quarter
        const quarter = Math.floor(now.getMonth() / 3);
        start.setMonth(quarter * 3);
        start.setDate(1);
        start.setHours(0, 0, 0, 0);
        end.setMonth(quarter * 3 + 3);
        end.setDate(0);
        end.setHours(23, 59, 59, 999);
        break;
      
      case 'halfyear':
        // Current half year
        const halfYear = Math.floor(now.getMonth() / 6);
        start.setMonth(halfYear * 6);
        start.setDate(1);
        start.setHours(0, 0, 0, 0);
        end.setMonth(halfYear * 6 + 6);
        end.setDate(0);
        end.setHours(23, 59, 59, 999);
        break;
      
      case 'year':
        // Current year
        start.setMonth(0);
        start.setDate(1);
        start.setHours(0, 0, 0, 0);
        end.setMonth(11);
        end.setDate(31);
        end.setHours(23, 59, 59, 999);
        break;
      
      default:
        return null;
    }

    return { start, end };
  }

  getSelectedTimePeriodLabel(): string {
    const period = this.timePeriods.find(p => p.value === this.selectedTimePeriod);
    return period ? period.label : 'All Time';
  }

  // Notification Methods
  ngOnInit() {
    this.loadSampleData();
    this.loadTourRequests();
    this.applyFilters();
    this.calculateStats();
    this.loadNotifications();
    this.setupClickOutsideListener();
  }

  ngOnDestroy() {
    document.removeEventListener('click', this.handleClickOutside.bind(this));
  }

  setupClickOutsideListener() {
    document.addEventListener('click', this.handleClickOutside.bind(this));
  }

  handleClickOutside(event: Event) {
    const target = event.target as HTMLElement;
    const notificationContainer = target.closest('.notification-container');
    if (!notificationContainer && this.showNotifications) {
      this.showNotifications = false;
    }
  }

  loadNotifications() {
    // Sample notifications - replace with actual API call
    this.notifications = [
      {
        id: 1,
        message: "I'm interested in your elder care services. Could you please provide more information about pricing and availability?",
        senderName: "Sarah Johnson",
        senderEmail: "sarah.j@email.com",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        isRead: false,
        type: 'inquiry'
      },
      {
        id: 2,
        message: "Hi, I would like to know about your after school programs for my 8-year-old daughter. What activities do you offer?",
        senderName: "Mike Chen",
        senderEmail: "mike.chen@email.com",
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
        isRead: false,
        type: 'inquiry'
      },
      {
        id: 3,
        message: "Thank you for the excellent pet care service last week. My dog was very happy and well taken care of!",
        senderName: "Emily Davis",
        senderEmail: "emily.d@email.com",
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        isRead: true,
        type: 'message'
      }
    ];
    
    this.updateNotificationCounts();
  }

  updateNotificationCounts() {
    this.unreadNotificationCount = this.notifications.filter(n => !n.isRead).length;
    this.hasUnreadNotifications = this.unreadNotificationCount > 0;
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
  }

  markAsRead(notificationId: number) {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification && !notification.isRead) {
      notification.isRead = true;
      this.updateNotificationCounts();
      // Here you would typically make an API call to mark as read in the database
    }
  }

  markAllAsRead() {
    this.notifications.forEach(notification => {
      notification.isRead = true;
    });
    this.updateNotificationCounts();
    // Here you would typically make an API call to mark all as read in the database
  }

  formatNotificationTime(timestamp: string): string {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInMs = now.getTime() - notificationTime.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInDays < 7) {
      return `${diffInDays}d ago`;
    } else {
      return notificationTime.toLocaleDateString();
    }
  }

  viewAllNotifications() {
    this.showNotifications = false;
    // Here you could navigate to a dedicated notifications page
    // or open a more detailed notifications modal
    console.log('Navigate to all notifications page');
  }

  // Method to add new notification (call this when new message comes from DB)
  addNotification(notification: Omit<Notification, 'id'>) {
    const newNotification: Notification = {
      ...notification,
      id: Date.now() // Simple ID generation
    };
    this.notifications.unshift(newNotification);
    this.updateNotificationCounts();
  }

  // Tour Request Management Methods
  loadTourRequests() {
    // Call admin service to get all tours (which returns tour request data)
    this.adminService.getAllTours().subscribe({
      next: (tourData: any[]) => {
        // Transform API response to match TourRequest interface
        this.tourRequests = tourData.map((tour, index) => {
          // Map API status to tour request status
          let tourStatus: 'pending' | 'confirmed' | 'cancelled' | 'completed';
          switch (tour.status?.toLowerCase()) {
            case 'scheduled':
              tourStatus = 'confirmed';
              break;
            case 'completed':
              tourStatus = 'completed';
              break;
            case 'cancelled':
              tourStatus = 'cancelled';
              break;
            default:
              tourStatus = 'pending';
          }

          return {
            id: index + 1, // Generate ID since it's not provided in response
            firstName: tour.firstName || 'Unknown',
            lastName: tour.lastName || 'Unknown',
            email: tour.email || 'unknown@email.com',
            phone: tour.phoneNumber || 'N/A',
            serviceInterest: tour.serviceName || 'Not specified',
            preferredDate: tour.preferredDate || '', // Keep original date format from API
            preferredTime: tour.preferredTime || '',
            numberOfPeople: parseInt(tour.people) || 1,
            specialRequests: '', // Not provided in API response
            contactMethod: 'email' as const, // Default to email
            status: tourStatus,
            submittedAt: tour.submittedTime || 'Recently', // Use the provided submittedTime
            confirmedDate: tour.status?.toLowerCase() === 'scheduled' ? tour.preferredDate : undefined, // Keep original format
            confirmedTime: tour.status?.toLowerCase() === 'scheduled' ? tour.preferredTime : undefined,
            assignedStaff: undefined, // Not available in API response
            cancellationReason: tour.status?.toLowerCase() === 'cancelled' ? 'Tour cancelled' : undefined,
            notes: '' // Not provided in API response
          };
        });
        
        this.applyTourFilters();
        this.calculateTourStats();
      },
      error: (error) => {
        console.error('Error loading tour requests:', error);
        // Fallback to empty array on error
        this.tourRequests = [];
        this.applyTourFilters();
        this.calculateTourStats();
      }
    });
  }

  applyTourFilters() {
    this.filteredTourRequests = this.tourRequests.filter(request => {
      if (this.selectedTourStatus === 'all') return true;
      return request.status === this.selectedTourStatus;
    });
  }

  calculateTourStats() {
    this.tourStats = {
      pending: this.tourRequests.filter(r => r.status === 'pending').length,
      confirmed: this.tourRequests.filter(r => r.status === 'confirmed').length,
      completed: this.tourRequests.filter(r => r.status === 'completed').length,
      cancelled: this.tourRequests.filter(r => r.status === 'cancelled').length,
      today: this.tourRequests.filter(r => {
        const requestDate = new Date(r.preferredDate);
        const today = new Date();
        return requestDate.toDateString() === today.toDateString() && r.status === 'confirmed';
      }).length
    };
  }

  onTourFilterChange() {
    this.applyTourFilters();
  }

  // Tour Details Modal
  openTourDetailsModal(tourRequest: TourRequest) {
    this.selectedTourRequest = tourRequest;
    this.showTourDetailsModal = true;
    document.body.style.overflow = 'hidden';
  }

  closeTourDetailsModal() {
    this.showTourDetailsModal = false;
    this.selectedTourRequest = null;
    document.body.style.overflow = 'auto';
  }

  // Tour Confirmation Modal
  openConfirmTourModal(tourRequest: TourRequest) {
    this.selectedTourRequest = tourRequest;
    this.tourConfirmation = {
      confirmedDate: tourRequest.preferredDate,
      confirmedTime: tourRequest.preferredTime,
      assignedStaff: '',
      notes: ''
    };
    this.showConfirmTourModal = true;
    document.body.style.overflow = 'hidden';
  }

  closeConfirmTourModal() {
    this.showConfirmTourModal = false;
    this.selectedTourRequest = null;
    this.resetTourConfirmation();
    document.body.style.overflow = 'auto';
  }

  confirmTourRequest() {
    if (!this.selectedTourRequest) return;

    if (!this.tourConfirmation.confirmedDate || !this.tourConfirmation.confirmedTime || !this.tourConfirmation.assignedStaff) {
      alert('Please fill in all required fields.');
      return;
    }

    // Update the tour request
    this.selectedTourRequest.status = 'confirmed';
    this.selectedTourRequest.confirmedDate = this.tourConfirmation.confirmedDate;
    this.selectedTourRequest.confirmedTime = this.tourConfirmation.confirmedTime;
    this.selectedTourRequest.assignedStaff = this.tourConfirmation.assignedStaff;
    this.selectedTourRequest.notes = this.tourConfirmation.notes;

    // Here you would typically make an API call to update the database
    console.log('Tour confirmed:', this.selectedTourRequest);

    // Refresh data
    this.applyTourFilters();
    this.calculateTourStats();

    // Show success message
    alert(`Tour confirmed for ${this.selectedTourRequest.firstName} ${this.selectedTourRequest.lastName}`);

    this.closeConfirmTourModal();
  }

  // Tour Cancellation Modal
  openCancelTourModal(tourRequest: TourRequest) {
    this.selectedTourRequest = tourRequest;
    this.tourCancellation = {
      reason: '',
      notes: ''
    };
    this.showCancelTourModal = true;
    document.body.style.overflow = 'hidden';
  }

  closeCancelTourModal() {
    this.showCancelTourModal = false;
    this.selectedTourRequest = null;
    this.resetTourCancellation();
    document.body.style.overflow = 'auto';
  }

  cancelTourRequest() {
    if (!this.selectedTourRequest) return;

    if (!this.tourCancellation.reason) {
      alert('Please provide a reason for cancellation.');
      return;
    }

    // Update the tour request
    this.selectedTourRequest.status = 'cancelled';
    this.selectedTourRequest.cancellationReason = this.tourCancellation.reason;
    if (this.tourCancellation.notes) {
      this.selectedTourRequest.notes = this.tourCancellation.notes;
    }

    // Here you would typically make an API call to update the database
    console.log('Tour cancelled:', this.selectedTourRequest);

    // Refresh data
    this.applyTourFilters();
    this.calculateTourStats();

    // Show success message
    alert(`Tour cancelled for ${this.selectedTourRequest.firstName} ${this.selectedTourRequest.lastName}`);

    this.closeCancelTourModal();
  }

  resetTourConfirmation() {
    this.tourConfirmation = {
      confirmedDate: '',
      confirmedTime: '',
      assignedStaff: '',
      notes: ''
    };
  }

  resetTourCancellation() {
    this.tourCancellation = {
      reason: '',
      notes: ''
    };
  }

  formatTourDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getTourStatusBadgeClass(status: string): string {
    switch (status) {
      case 'pending': return 'status-pending';
      case 'confirmed': return 'status-confirmed';
      case 'completed': return 'status-completed';
      case 'cancelled': return 'status-cancelled';
      default: return '';
    }
  }

  // Update tour status
  updateTourStatus(tourId: number, newStatus: string): void {
    const tourIndex = this.tourRequests.findIndex(tour => tour.id === tourId);
    if (tourIndex !== -1) {
      this.tourRequests[tourIndex].status = newStatus as 'pending' | 'confirmed' | 'cancelled' | 'completed';
      
      // Update statistics
      this.calculateTourStats();
      
      // Apply current filters
      this.onTourFilterChange();
      
      console.log(`Tour ${tourId} status updated to ${newStatus}`);
    }
  }

  // Get minimum date (today) for tour confirmation
  getTourMinDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }
}
