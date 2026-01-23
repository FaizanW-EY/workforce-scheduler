import { Component } from '@angular/core';

import { AttendanceApiservice } from '../attendanceservice';

@Component({

  selector: 'app-utilization',

  templateUrl: './utilization.html',

  styleUrls: ['./utilization.css'],

  standalone: false

})

export class Utilization {

  fromDate = '';

  toDate = '';

  message = '';

  list: any[] = [];

  constructor(private service: AttendanceApiservice) {}

  generate() {

    if (!this.fromDate || !this.toDate) {

      this.message = 'Please select both dates';

      return;

    }

    // 1️⃣ Generate utilization

    this.service.getUtilization(this.fromDate, this.toDate)

      .subscribe({

        next: () => {

          this.message = 'Utilization generated successfully';

          // 2️⃣ Load table data

          this.loadUtilization();

        },

        error: () => {

          this.message = 'Failed to generate utilization';

        }

      });

  }

  loadUtilization() {

    this.service.getUtilization(this.fromDate, this.toDate)

      .subscribe({

        next: (data) => this.list = data,

        error: () => this.message = 'Failed to load utilization data'

      });

  }

}
 