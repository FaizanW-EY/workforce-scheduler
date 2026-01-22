import { Component, OnInit } from '@angular/core';
import { ReviewAssignmentsService } from '../review-assignments-service';

@Component({
  selector: 'app-review-assignments',
  standalone: false,
  templateUrl: './review-assignments.html',
  styleUrl: './review-assignments.css',
})
export class ReviewAssignments implements OnInit {
  items: any[] = [];
  approvedItems: any[] = [];
  reason: string = 'default reason';
  showApproved = false;

  constructor(private svc: ReviewAssignmentsService) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.svc.getPending().subscribe(d => this.items = d);
  }

  approve(id: string) {
    this.svc.approve(id).subscribe(() => this.load());
  }

  reject(id: string) {
    this.svc.reject(id).subscribe(() => this.load());
  }

  override(id: string, employeeId: number) {
    this.svc
      .overrideAssignment(id, employeeId, this.reason)
      .subscribe(() => this.load());
  }

  publish() {
  this.svc.getAllAssignments().subscribe(all => {
    // Show only Approved AND not overridden
    this.approvedItems = all.filter(
      a => a.status === 1 && !a.overrideUsed
    );
    this.showApproved = true;
  });
}

}
