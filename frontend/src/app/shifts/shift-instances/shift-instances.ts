import { Component, OnInit } from '@angular/core';
import {
  ShiftService,
  ShiftTemplate,
  ShiftInstance,
  ShiftInstanceCreateDto
} from '../shift';

@Component({
  selector: 'app-shift-instances',
  templateUrl: './shift-instances.html',
  standalone: false,
  styleUrls: ['./shift-instances.css']
})
export class ShiftInstancesComponent implements OnInit {

  shiftTemplates: ShiftTemplate[] = [];
  shiftInstances: ShiftInstance[] = [];

  newInstance: ShiftInstanceCreateDto = {
    shiftTemplateId: 0,
    shiftDate: '',
    requiredHeadcountOverride: null
  };

  constructor(private shiftService: ShiftService) {}

  ngOnInit(): void {
    this.loadShiftTemplates();
    this.loadShiftInstances();
  }

  // ---------- LOAD DATA ----------

  loadShiftTemplates(): void {
    this.shiftService.getShiftTemplates().subscribe({
      next: data => this.shiftTemplates = data,
      error: err => console.error('Failed to load templates', err)
    });
  }

  loadShiftInstances(): void {
    this.shiftService.getShiftInstances().subscribe({
      next: data => this.shiftInstances = data,
      error: err => console.error('Failed to load instances', err)
    });
  }

  // ---------- CREATE ----------

  addShiftInstance(): void {
    if (!this.newInstance.shiftTemplateId || !this.newInstance.shiftDate) {
      alert('Please select a template and date');
      return;
    }

    this.shiftService.createShiftInstance(this.newInstance).subscribe({
      next: () => {
        this.loadShiftInstances();
        this.resetForm();
      },
      error: err => console.error('Failed to create instance', err)
    });
  }

  // ---------- DELETE ----------

  deleteShiftInstance(id: number): void {
    if (!confirm('Delete this shift instance?')) return;

    this.shiftService.deleteShiftInstance(id).subscribe({
      next: () => this.loadShiftInstances(),
      error: err => console.error('Failed to delete instance', err)
    });
  }

  // ---------- HELPERS ----------

  resetForm(): void {
    this.newInstance = {
      shiftTemplateId: 0,
      shiftDate: '',
      requiredHeadcountOverride: null
    };
  }

  getTemplateName(templateId: number): string {
    const template = this.shiftTemplates.find(t => t.id === templateId);
    return template ? template.name : '—';
  }
}

