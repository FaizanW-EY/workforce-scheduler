import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ReviewAssignmentsService {
  private baseUrl = 'https://localhost:7164/api/project';

  constructor(private http: HttpClient) {}

  autoAssign(payload: any) {
    return this.http.post(`${this.baseUrl}/auto`, payload);
  }

  getPending() {
    return this.http.get<any[]>(`${this.baseUrl}/pending`);
  }

  approve(id: string) {
    return this.http.post(
      `${this.baseUrl}/approve/${id}`,
      {},
      { responseType: 'text' }
    );
  }

  reject(id: string) {
    return this.http.post(
      `${this.baseUrl}/reject/${id}`,
      {},
      { responseType: 'text' }
    );
  }

  overrideAssignment(id: string, employeeId: number, reason: string) {
    return this.http.post(
      `${this.baseUrl}/override/${id}`,
      {
        newEmployeeId: employeeId,
        reason: reason,
      },
      { responseType: 'text' }
    );
  }

  getAllAssignments() {
    return this.http.get<any[]>(`${this.baseUrl}/manager/all`);
  }
}
