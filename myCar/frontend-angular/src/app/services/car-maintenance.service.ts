import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CarMaintenance } from '../models/car-maintenance';
import { Car } from '../models/car';
import { MaintenanceTask } from '../models/maintenancetask';

export interface CarMaintenancePayload {
  car_id: number;
  task_id: number;
  performed_at: string;  // ISO date
  notes?: string;
}

@Injectable({ providedIn: 'root' })
export class CarMaintenanceService {
  private baseUrl = '/api/car-maintenance/';

  constructor(private http: HttpClient) {}

  list(): Observable<CarMaintenance[]> {
    return this.http.get<CarMaintenance[]>(this.baseUrl);
  }

  get(id: number): Observable<CarMaintenance> {
    return this.http.get<CarMaintenance>(`${this.baseUrl}${id}/`);
  }

  create(data: CarMaintenancePayload): Observable<CarMaintenance> {
    return this.http.post<CarMaintenance>(this.baseUrl, data);
  }

  update(id: number, data: CarMaintenancePayload): Observable<CarMaintenance> {
    return this.http.put<CarMaintenance>(`${this.baseUrl}${id}/`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}${id}/`);
  }
}
