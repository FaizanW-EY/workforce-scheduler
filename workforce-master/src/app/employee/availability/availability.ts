import { Component } from '@angular/core';

import { HttpClient } from '@angular/common/http';

@Component({

  selector: 'app-availability',

  templateUrl: './availability.html',

  styleUrls: ['./availability.css'],

  standalone: false

})

export class Availability {

  days = [

    { name: 'Sunday', value: 0 },

    { name: 'Monday', value: 1 },

    { name: 'Tuesday', value: 2 },

    { name: 'Wednesday', value: 3 },

    { name: 'Thursday', value: 4 },

    { name: 'Friday', value: 5 },

    { name: 'Saturday', value: 6 }

  ];

  availability: any[] = [];

  mode: 'none' | 'view' | 'edit' = 'none';

  success = '';

  constructor(private http: HttpClient) {}

  viewAvailability() {

    this.loadAvailability(() => this.mode = 'view');

  }

  editAvailability() {

    this.loadAvailability(() => this.mode = 'edit');

  }

  loadAvailability(callback?: () => void) {

    this.http.get<any[]>(

      'https://localhost:7088/api/availability',

      {

        headers: {

          Authorization: 'Bearer ' + localStorage.getItem('token')

        }

      }

    ).subscribe(res => {

      const result: any[] = [];

      this.days.forEach(d => {

        const found = res?.find(x =>

          x.day === d.value || x.day === d.name

        );

        if (found) {

          result.push({

            day: d.value,

            startTime: found.startTime?.substring(0,5),

            endTime: found.endTime?.substring(0,5),

            isAvailable: found.isAvailable

          });

        } else {

          result.push({

            day: d.value,

            startTime: '09:00',

            endTime: '18:00',

            isAvailable: false

          });

        }

      });

      this.availability = result;

      if (callback) callback();

    });

  }

  save() {

    const payload = this.availability.map(a => ({

      day: a.day,

      startTime: a.startTime + ':00',

      endTime: a.endTime + ':00',

      isAvailable: a.isAvailable

    }));

    this.http.post(

      'https://localhost:7088/api/availability',

      payload,

      {

        headers: {

          Authorization: 'Bearer ' + localStorage.getItem('token')

        },

        responseType: 'text'

      }

    ).subscribe(res => {

      this.success = res || 'Availability saved successfully';

      this.mode = 'view';

    });

  }

  getDayName(value: number) {

    return this.days.find(d => d.value === value)?.name;

  }

}
 