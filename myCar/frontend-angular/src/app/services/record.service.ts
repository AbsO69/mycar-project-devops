import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Record } from '../models/record';  
@Injectable({
  providedIn: 'root'
})
export class RecordService {
  private apiUrl = '/api/customers/';  
  constructor(private http: HttpClient) {}

  list(): Observable<Record[]> {
    return this.http.get<Record[]>(this.apiUrl);
  }

  // Fetch all records
  getAll(): Observable<Record[]> {
    return this.http.get<Record[]>(this.apiUrl);
  }

  // Fetch a single record
  get(id: number): Observable<Record> {
    return this.http.get<Record>(`${this.apiUrl}${id}/`);
  }

  // Create a new record
  create(record: Record): Observable<Record> {
    return this.http.post<Record>(this.apiUrl, record);
  }

  // Update a record
  update(id: number, record: Partial<Record>): Observable<Record> {
    return this.http.put<Record>(`${this.apiUrl}${id}/`, record);
  }

  // Delete a record
  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}${id}/`);
  }
}
