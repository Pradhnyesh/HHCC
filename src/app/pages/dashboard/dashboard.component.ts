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

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  // Data arrays
  familyMembers: FamilyMember[] = [];
  pets: Pet[] = [];
  
  // Modal states
  showFamilyModal = false;
  showPetModal = false;
  
  // Editing states
  editingFamilyMember: FamilyMember | null = null;
  editingPet: Pet | null = null;
  
  // Form objects
  familyMemberForm: Partial<FamilyMember> = {};
  petForm: Partial<Pet> = {};
  
  // ID counters
  private nextFamilyId = 1;
  private nextPetId = 1;

  constructor() {
    // Add some sample data for demonstration
    this.addSampleData();
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
      const index = this.familyMembers.findIndex(m => m.id === this.editingFamilyMember!.id);
      if (index !== -1) {
        this.familyMembers[index] = { ...this.familyMemberForm } as FamilyMember;
      }
    } else {
      // Add new member
      const newMember: FamilyMember = {
        id: this.nextFamilyId++,
        name: this.familyMemberForm.name || '',
        relation: this.familyMemberForm.relation || '',
        age: this.familyMemberForm.age || 0,
        medicalConditions: this.familyMemberForm.medicalConditions
      };
      this.familyMembers.push(newMember);
    }
    this.closeFamilyModal();
  }

  deleteFamilyMember(id: number) {
    if (confirm('Are you sure you want to delete this family member?')) {
      this.familyMembers = this.familyMembers.filter(m => m.id !== id);
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
    } else {
      // Add new pet
      const newPet: Pet = {
        id: this.nextPetId++,
        name: this.petForm.name || '',
        type: this.petForm.type || '',
        breed: this.petForm.breed || '',
        age: this.petForm.age || 0,
        specialCare: this.petForm.specialCare
      };
      this.pets.push(newPet);
    }
    this.closePetModal();
  }

  deletePet(id: number) {
    if (confirm('Are you sure you want to delete this pet?')) {
      this.pets = this.pets.filter(p => p.id !== id);
    }
  }

  // Helper method to add sample data
  private addSampleData() {
    this.familyMembers = [
      {
        id: this.nextFamilyId++,
        name: 'Sarah Doe',
        relation: 'Spouse',
        age: 35,
        medicalConditions: 'None'
      },
      {
        id: this.nextFamilyId++,
        name: 'Emma Doe',
        relation: 'Child',
        age: 8,
        medicalConditions: 'Allergic to peanuts'
      }
    ];

    this.pets = [
      {
        id: this.nextPetId++,
        name: 'Buddy',
        type: 'Dog',
        breed: 'Golden Retriever',
        age: 3,
        specialCare: 'Needs daily exercise'
      }
    ];
  }
}
