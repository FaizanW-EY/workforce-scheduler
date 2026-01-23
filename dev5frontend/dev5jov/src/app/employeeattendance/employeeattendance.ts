import { Component, OnInit } from '@angular/core';

import { AttendanceApiservice } from '../attendanceservice';

@Component({

  selector: 'app-employee-attendance',

  templateUrl: './employeeattendance.html',

  styleUrls: ['./employeeattendance.css'],

  standalone: false

})

export class EmployeeAttendance implements OnInit {

  employeeId: number = 0;        // entered by user

  list: any[] = [];              // shift assignments

  message: string = '';

  constructor(private service: AttendanceApiservice) {}

  ngOnInit() {}

  // 🔹 Load assignments for employee

  loadAssignments() {

    if (!this.employeeId) {

      this.message = 'Please enter Employee ID';

      return;

    }

    this.service.getMyAssignments(this.employeeId).subscribe({

      next: (res: any[]) => {

        // add UI flags

        this.list = res.map(x => ({

          ...x,

          checkedIn: false,

          checkedOut: false

        }));

        this.message = '';

      },

      error: () => {

        this.message = 'Failed to load assignments';

      }

    });

  }

  // 🔹 CHECK IN

  checkIn(a: any, time: string) {

    if (!time) {

      this.message = 'Select check-in time';

      return;

    }

    const date = new Date(a.shiftDate).toISOString().split('T')[0];

    const payload = {

      checkInTime: `${date}T${time}:00`

    };

    this.service.checkIn(a.assignmentId, payload).subscribe({

      next: () => {

        this.message = 'Check-in saved';

        a.checkedIn = true;

        a.checkedOut = false;

      },

      error: (err) => {

        console.error(err);

        this.message = err?.error?.title ?? 'Check-in failed';

      }

    });

  }

  // 🔹 CHECK OUT

  checkOut(a: any, time: string) {

    if (!time) {

      this.message = 'Select check-out time';

      return;

    }

    const date = new Date(a.shiftDate).toISOString().split('T')[0];

    const payload = {

      checkOutTime: `${date}T${time}:00`

    };

    this.service.checkOut(a.assignmentId, payload).subscribe({

      next: () => {

        this.message = 'Check-out saved';

        a.checkedOut = true;

      },

      error: (err) => {

        console.error(err);

        this.message = err?.error?.title ?? 'Check-out failed';

      }

    });

  }

  // 🔹 MARK ABSENT (single shift)

  // markAbsent(a: any) {

  //   this.service.markAbsent().subscribe({

  //     next: () => {

  //       this.message = 'Absent marked';

  //       a.checkedIn = false;

  //       a.checkedOut = false;

  //     },

  //     error: () => {

  //       this.message = 'Failed to mark absent';

  //     }

  //   });

  // }
  markAbsent(a: any) {
 this.service.markAbsent(a.assignmentId).subscribe({
   next: () => {
     this.message = 'Absent marked';
     this.loadAssignments(); // reload shifts so it disappears
   },
   error: (err) => {
     console.error(err);
     this.message = 'Failed to mark absent';
   }
 });
}

  // 🔹 GENERATE UTILIZATION

  // generateUtilization() {

  //   this.service.generateUtilization('2026-02-01', '2026-02-28').subscribe({

  //     next: () => {

  //       this.message = 'Utilization generated';

  //     },

  //     error: () => {

  //       this.message = 'Failed to generate utilization';

  //     }

  //   });

  }


 