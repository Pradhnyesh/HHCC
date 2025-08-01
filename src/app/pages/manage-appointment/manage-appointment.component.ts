import { Component, OnInit } from '@angular/core';

interface AppointmentPhoto {
  id: number;
  url: string;
  description: string;
  uploadedAt: string;
  uploadedBy: string;
}

interface CheckInOutLog {
  id: number;
  action: 'check-in' | 'check-out';
  timestamp: string;
  staffMember: string;
  notes?: string;
}

interface AppointmentManagement {
  id: number;
  memberName: string;
  service: string;
  date: string;
  time: string;
  status: 'scheduled' | 'checked-in' | 'in-progress' | 'checked-out' | 'completed' | 'cancelled';
  checkInTime?: string;
  checkOutTime?: string;
  photos: AppointmentPhoto[];
  checkInOutLogs: CheckInOutLog[];
  notes: string;
}

@Component({
  selector: 'app-manage-appointment',
  templateUrl: './manage-appointment.component.html',
  styleUrls: ['./manage-appointment.component.css']
})
export class ManageAppointmentComponent implements OnInit {

  appointments: AppointmentManagement[] = [];
  filteredAppointments: AppointmentManagement[] = [];
  selectedAppointment: AppointmentManagement | null = null;
  
  // Modal states
  showManageModal = false;
  showPhotoUploadModal = false;
  showPhotoViewModal = false;
  selectedPhoto: AppointmentPhoto | null = null;
  
  // Filters
  statusFilter = 'all';
  dateFilter = '';
  searchQuery = '';
  
  // Photo upload
  selectedFiles: File[] = [];
  photoDescription = '';
  uploadProgress = 0;
  isUploading = false;
  
  // Check-in/out
  checkInOutNotes = '';
  appointmentNotes = ''; // For general appointment notes
  currentStaffMember = 'Admin User'; // This would come from auth service

  constructor() { }

  ngOnInit(): void {
    this.loadAppointments();
    this.applyFilters();
  }

  loadAppointments(): void {
    // Sample data - in real app, this would come from a service
    this.appointments = [
      {
        id: 1,
        memberName: 'Emma Johnson',
        service: 'Child Day Care',
        date: '2025-08-01',
        time: '8:00 AM',
        status: 'scheduled',
        photos: [],
        checkInOutLogs: [],
        notes: ''
      },
      {
        id: 2,
        memberName: 'Max (Dog)',
        service: 'Pet Day Care',
        date: '2025-08-01',
        time: '9:00 AM',
        status: 'checked-in',
        checkInTime: '8:55 AM',
        photos: [
          {
            id: 1,
            url: '/assets/sample-photo.jpg',
            description: 'Arrival photo',
            uploadedAt: '2025-08-01 09:00:00',
            uploadedBy: 'Staff Member'
          }
        ],
        checkInOutLogs: [
          {
            id: 1,
            action: 'check-in',
            timestamp: '2025-08-01 08:55:00',
            staffMember: 'Sarah Johnson',
            notes: 'On time arrival, happy and ready'
          }
        ],
        notes: 'Needs medication at 12 PM'
      },
      {
        id: 3,
        memberName: 'Robert Wilson',
        service: 'Elder Day Care',
        date: '2025-08-01',
        time: '10:00 AM',
        status: 'in-progress',
        checkInTime: '9:45 AM',
        photos: [],
        checkInOutLogs: [
          {
            id: 1,
            action: 'check-in',
            timestamp: '2025-08-01 09:45:00',
            staffMember: 'Mike Davis',
            notes: 'Early arrival, good mood'
          }
        ],
        notes: 'Participating in art therapy session'
      }
    ];
  }

  applyFilters(): void {
    this.filteredAppointments = this.appointments.filter(appointment => {
      const matchesStatus = this.statusFilter === 'all' || appointment.status === this.statusFilter;
      const matchesDate = !this.dateFilter || appointment.date === this.dateFilter;
      const matchesSearch = !this.searchQuery || 
        appointment.memberName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        appointment.service.toLowerCase().includes(this.searchQuery.toLowerCase());
      
      return matchesStatus && matchesDate && matchesSearch;
    });
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  openManageModal(appointment: AppointmentManagement): void {
    this.selectedAppointment = appointment;
    this.appointmentNotes = appointment.notes || ''; // Load existing notes
    this.showManageModal = true;
  }

  closeManageModal(): void {
    this.showManageModal = false;
    this.selectedAppointment = null;
    this.checkInOutNotes = '';
    this.appointmentNotes = '';
  }

  saveAppointmentNotes(appointment: AppointmentManagement): void {
    if (!appointment) return;
    
    appointment.notes = this.appointmentNotes;
    
    // Update the appointment in the main array as well
    const mainAppointmentIndex = this.appointments.findIndex(app => app.id === appointment.id);
    if (mainAppointmentIndex !== -1) {
      this.appointments[mainAppointmentIndex].notes = this.appointmentNotes;
    }
    
    alert('Notes saved successfully!');
  }

  checkIn(appointment: AppointmentManagement): void {
    if (appointment.status === 'scheduled') {
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });

      appointment.status = 'checked-in';
      appointment.checkInTime = timeString;
      
      // Add to logs
      appointment.checkInOutLogs.push({
        id: appointment.checkInOutLogs.length + 1,
        action: 'check-in',
        timestamp: now.toISOString(),
        staffMember: this.currentStaffMember,
        notes: this.checkInOutNotes
      });

      this.checkInOutNotes = '';
      alert(`${appointment.memberName} checked in successfully at ${timeString}`);
    }
  }

  checkOut(appointment: AppointmentManagement): void {
    if (appointment.status === 'checked-in' || appointment.status === 'in-progress') {
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });

      appointment.status = 'checked-out';
      appointment.checkOutTime = timeString;
      
      // Add to logs
      appointment.checkInOutLogs.push({
        id: appointment.checkInOutLogs.length + 1,
        action: 'check-out',
        timestamp: now.toISOString(),
        staffMember: this.currentStaffMember,
        notes: this.checkInOutNotes
      });

      this.checkInOutNotes = '';
      alert(`${appointment.memberName} checked out successfully at ${timeString}`);
    }
  }

  updateStatus(appointment: AppointmentManagement, newStatus: string): void {
    const oldStatus = appointment.status;
    appointment.status = newStatus as any;
    
    // Update the appointment in the main array as well
    const mainAppointmentIndex = this.appointments.findIndex(app => app.id === appointment.id);
    if (mainAppointmentIndex !== -1) {
      this.appointments[mainAppointmentIndex].status = newStatus as any;
    }
    
    console.log(`Status updated from ${oldStatus} to ${newStatus} for appointment ${appointment.id}`);
    alert(`Status successfully updated from "${oldStatus}" to "${newStatus}"`);
  }

  openPhotoUpload(appointment: AppointmentManagement): void {
    this.selectedAppointment = appointment;
    this.showPhotoUploadModal = true;
  }

  closePhotoUpload(): void {
    this.showPhotoUploadModal = false;
    this.selectedFiles = [];
    this.photoDescription = '';
    this.uploadProgress = 0;
  }

  onFileSelected(event: any): void {
    const files = event.target.files;
    this.selectedFiles = Array.from(files);
  }

  removeFile(index: number): void {
    this.selectedFiles.splice(index, 1);
  }

  uploadPhotos(): void {
    if (!this.selectedAppointment || this.selectedFiles.length === 0) return;

    this.isUploading = true;
    this.uploadProgress = 0;

    // Simulate upload progress
    const interval = setInterval(() => {
      this.uploadProgress += 10;
      if (this.uploadProgress >= 100) {
        clearInterval(interval);
        
        // Add photos to appointment
        this.selectedFiles.forEach((file, index) => {
          const photo: AppointmentPhoto = {
            id: this.selectedAppointment!.photos.length + index + 1,
            url: URL.createObjectURL(file), // In real app, this would be the server URL
            description: this.photoDescription,
            uploadedAt: new Date().toISOString(),
            uploadedBy: this.currentStaffMember
          };
          this.selectedAppointment!.photos.push(photo);
        });

        this.isUploading = false;
        alert(`${this.selectedFiles.length} photo(s) uploaded successfully!`);
        this.closePhotoUpload();
      }
    }, 200);
  }

  viewPhoto(photo: AppointmentPhoto): void {
    this.selectedPhoto = photo;
    this.showPhotoViewModal = true;
  }

  closePhotoView(): void {
    this.showPhotoViewModal = false;
    this.selectedPhoto = null;
  }

  deletePhoto(appointment: AppointmentManagement, photoId: number): void {
    if (confirm('Are you sure you want to delete this photo?')) {
      appointment.photos = appointment.photos.filter(photo => photo.id !== photoId);
      alert('Photo deleted successfully');
    }
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'scheduled': return 'badge-scheduled';
      case 'checked-in': return 'badge-checked-in';
      case 'in-progress': return 'badge-in-progress';
      case 'checked-out': return 'badge-checked-out';
      case 'completed': return 'badge-completed';
      case 'cancelled': return 'badge-cancelled';
      default: return '';
    }
  }

  formatTime(timestamp: string): string {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  }

  formatDate(timestamp: string): string {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }

  getTodayDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }
}
