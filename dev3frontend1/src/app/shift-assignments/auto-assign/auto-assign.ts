import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ReviewAssignmentsService } from '../review-assignments-service';

@Component({
  selector: 'app-auto-assign',
  templateUrl: './auto-assign.html',
  standalone: false,
  styleUrls: ['./auto-assign.css']
})
export class AutoAssign {
  startDate!: string;
  endDate!: string;
  loading = false;

  constructor(
    private svc: ReviewAssignmentsService,
    private router: Router
  ) {}

  run() {
    this.loading = true;

    const payload = {
      fromDate: this.startDate + 'T00:00:00',
      toDate: this.endDate + 'T23:59:59'
    };

    this.svc.autoAssign(payload).subscribe(
      () => {
        this.loading = false;
        this.router.navigate(['/manager/review']);
      },
      () => {
        this.loading = false;
      }
    );
  }
}
