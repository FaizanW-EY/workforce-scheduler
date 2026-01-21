import { Component, OnInit } from '@angular/core';
import { ShiftService } from '../shift';

@Component({
  selector: 'app-shift-templates',
  templateUrl: './shift-templates.html',
  standalone: false,
  styleUrls: ['./shift-templates.css'],
})
export class ShiftTemplatesComponent implements OnInit {

  rule: any = null;
  validationError = '';
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
  this.loadRule();
}

  loadTemplates() {
    this.shiftService.getShiftTemplates().subscribe(data => {
      this.templates = data;
    });
  }

  loadRule() {
    this.shiftService.getSchedulingRule().subscribe({
      next: (r) => this.rule = r,
      error: (err) => console.error('Failed to load scheduling rules', err)
    });
  }

  addTemplate() {
  this.validationError = '';

  // Frontend rule validation (Dev-2 scope)
  if (this.rule) {
    const netMinutes = this.netShiftMinutes(
      this.newTemplate.startTime,
      this.newTemplate.endTime,
      Number(this.newTemplate.breakMinutes)
    );

    if (netMinutes <= 0) {
      this.validationError = 'Shift duration after break must be greater than 0.';
      return;
    }

    const maxAllowedMinutes = Number(this.rule.maxDailyHours) * 60;
    if (netMinutes > maxAllowedMinutes) {
      this.validationError =
        `This shift violates MaxDailyHours (${this.rule.maxDailyHours}h). ` +
        `Net duration is ${(netMinutes / 60).toFixed(2)}h after break.`;
      return;
    }
  }

  this.shiftService.createShiftTemplate(this.newTemplate).subscribe({
    next: () => {
      this.loadTemplates();
      this.newTemplate = {
        name: '',
        startTime: '',
        endTime: '',
        breakMinutes: 0,
        requiredHeadcount: 1
      };
    },
    error: (err) => {
      console.error(err);
      this.validationError = err?.error?.message ?? 'Failed to create shift template.';
    }
  });
}


  deleteTemplate(id: number) {
    this.shiftService.deleteShiftTemplate(id).subscribe(() => {
      this.loadTemplates();
    });
  }

  private timeToMinutes(t: string): number {
  // supports "HH:mm" or "HH:mm:ss"
  const parts = (t || '').split(':').map(Number);
  const hh = parts[0] ?? 0;
  const mm = parts[1] ?? 0;
  return hh * 60 + mm;
  }

private netShiftMinutes(start: string, end: string, breakMinutes: number): number {
  const s = this.timeToMinutes(start);
  const e = this.timeToMinutes(end);

  let duration = e - s;

  // If someone enters an overnight shift by mistake, this avoids negative duration.
  // (You can remove this if you don't want to support overnight.)
  if (duration < 0) duration += 24 * 60;

  return duration - breakMinutes;
  }
}