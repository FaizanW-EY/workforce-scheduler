import { Component, OnInit } from '@angular/core';
import { ShiftService } from '../shift';

@Component({
  selector: 'app-shift-templates',
  templateUrl: './shift-templates.html',
  standalone: false,
  styleUrls: ['./shift-templates.css'],
})
export class ShiftTemplatesComponent implements OnInit {

  templates: any[] = [];
  newTemplate = {
    name: '',
    startTime: '',
    endTime: '',
    breakMinutes: 0,
    requiredHeadcount: 1
  };

  constructor(private shiftService: ShiftService) {}

  ngOnInit(): void {
    this.loadTemplates();
  }

  loadTemplates() {
    this.shiftService.getShiftTemplates().subscribe(data => {
      this.templates = data;
    });
  }

  addTemplate() {
    this.shiftService.createShiftTemplate(this.newTemplate).subscribe(() => {
      this.loadTemplates();
      this.newTemplate = {
        name: '',
        startTime: '',
        endTime: '',
        breakMinutes: 0,
        requiredHeadcount: 1
      };
    });
  }

  deleteTemplate(id: number) {
    this.shiftService.deleteShiftTemplate(id).subscribe(() => {
      this.loadTemplates();
    });
  }
}
