import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

@Injectable({

  providedIn: 'root'

})

export class AttendanceApiservice {

  private baseUrl = 'https://localhost:7164/api/attendance';

  constructor(private http: HttpClient) {}

  // 🔹 Get assignments for employee

  getMyAssignments(empId: number) {

    return this.http.get<any[]>(

      `${this.baseUrl}/employee/${empId}`

    );

  }

  // 🔹 Check-in

  checkIn(assignmentId: string, payload: any) {

    return this.http.post(

      `${this.baseUrl}/checkin/${assignmentId}`,

      payload,

      // { headers: { 'Content-Type': 'application/json' } }
      {responseType: 'text' }

    );

  }

  // 🔹 Check-out

  checkOut(assignmentId: string, payload: any) {

    return this.http.post(

      `${this.baseUrl}/checkout/${assignmentId}`,

      payload,

      // { headers: { 'Content-Type': 'application/json' } }
      {responseType: 'text' }

    );

  }

  // 🔹 Mark absent

  // markAbsent() {

  //   return this.http.post(

  //     `${this.baseUrl}/mark-absent`,

  //     {}

  //   );

  // }
markAbsent(assignmentId: string) {
 return this.http.post(
   `${this.baseUrl}/mark-absent/${assignmentId}`,
   {},
   { responseType: 'text' }   // ⭐ REQUIRED
 );
}
  // 🔹 Generate utilization

  // generateUtilization(from: string, to: string) {

  //   return this.http.post(

  //     `${this.baseUrl}/generate-utilization?from=${from}&to=${to}`,

  //     {}

  //   );
// generateUtilization(from: string, to: string) {
//  return this.http.post(
//    `${this.baseUrl}/generate-utilization?from=${from}&to=${to}`,
//    {},
//    { responseType: 'text' }   // IMPORTANT
//  );

//   }
getUtilization(from: string, to: string) {
 return this.http.get<any[]>(
   `${this.baseUrl}/utilization?from=${from}&to=${to}`
 );
}
}

 