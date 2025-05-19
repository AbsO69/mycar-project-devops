import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Car } from '../models/car';

@Injectable({ providedIn: 'root' })
export class CarService {
  private apiUrl = '/api/cars/';

  constructor(private http: HttpClient) {}

  list(): Observable<Car[]> {
    return this.http.get<Car[]>(this.apiUrl);
  }

  get(id: number): Observable<Car> {
    const url = `${this.apiUrl}/cars/${id}/`;
  console.log('GET request to:', url);
    return this.http.get<Car>(`${this.apiUrl}${id}/`);
  }

  create(car: Partial<Car>): Observable<Car> {
    return this.http.post<Car>(this.apiUrl, car);
  }

  update(id: number, car: Partial<Car>): Observable<Car> {
    return this.http.put<Car>(`${this.apiUrl}${id}/`, car);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}${id}/`);
  }
}
