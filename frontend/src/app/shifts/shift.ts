import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments';

export interface ShiftTemplateDto {
  name: string;
  startTime: string;        // "09:00" or "09:00:00"
  endTime: string;          // "17:00" or "17:00:00"
  breakMinutes: number;
  requiredHeadcount: number;
}

export interface ShiftTemplate extends ShiftTemplateDto {
  id: number;
}

export interface ShiftInstanceCreateDto {
  shiftTemplateId: number;
  shiftDate: string; // "YYYY-MM-DD"
  requiredHeadcountOverride?: number | null;
}

export interface ShiftInstance {
  id: number;
  shiftTemplateId: number;
  shiftDate: string; // ISO string from API
  requiredHeadcountOverride?: number | null;
  shiftTemplate?: ShiftTemplate; // present if API includes navigation
}

@Injectable({
  providedIn: 'root'
})
export class ShiftService {
  private baseUrl = environment.apiBaseUrl; // e.g. "http://localhost:5139/api"

  constructor(private http: HttpClient) {}

  // ---------- SHIFT TEMPLATES ----------

  getShiftTemplates(): Observable<ShiftTemplate[]> {
    return this.http.get<ShiftTemplate[]>(`${this.baseUrl}/shifttemplates`);
  }

  createShiftTemplate(dto: ShiftTemplateDto): Observable<ShiftTemplate> {
    return this.http.post<ShiftTemplate>(`${this.baseUrl}/shifttemplates`, dto);
  }

  updateShiftTemplate(id: number, dto: ShiftTemplateDto): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/shifttemplates/${id}`, dto);
  }

  deleteShiftTemplate(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/shifttemplates/${id}`);
  }

  // ---------- SHIFT INSTANCES ----------

  // Optional date-range filter (works if your API supports ?from=&to=)
  getShiftInstances(from?: string, to?: string): Observable<ShiftInstance[]> {
    let params = new HttpParams();
    if (from) params = params.set('from', from);
    if (to) params = params.set('to', to);

    return this.http.get<ShiftInstance[]>(`${this.baseUrl}/shiftinstances`, { params });
  }

  createShiftInstance(dto: ShiftInstanceCreateDto): Observable<ShiftInstance> {
    return this.http.post<ShiftInstance>(`${this.baseUrl}/shiftinstances`, dto);
  }

  deleteShiftInstance(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/shiftinstances/${id}`);
  }
}


