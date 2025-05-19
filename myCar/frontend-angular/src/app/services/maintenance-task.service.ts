// src/app/services/maintenance-task.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MaintenanceTask } from '../models/maintenancetask';

@Injectable({
  providedIn: 'root'
})
export class MaintenanceTaskService {
  private baseUrl = '/api/maintenance-tasks/';

  constructor(private http: HttpClient) {}

  /** Fetch all maintenance tasks */
  list(): Observable<MaintenanceTask[]> {
    return this.http.get<MaintenanceTask[]>(this.baseUrl);
  }

  /** Fetch a single task by ID */
  get(id: number): Observable<MaintenanceTask> {
    return this.http.get<MaintenanceTask>(`${this.baseUrl}${id}/`);
  }

  /** Create a new maintenance task */
  create(payload: Partial<MaintenanceTask>): Observable<MaintenanceTask> {
    return this.http.post<MaintenanceTask>(this.baseUrl, payload);
  }

  /** Update an existing task */
  update(id: number, payload: Partial<MaintenanceTask>): Observable<MaintenanceTask> {
    return this.http.put<MaintenanceTask>(`${this.baseUrl}${id}/`, payload);
  }

  /** Delete a task */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}${id}/`);
  }
}
