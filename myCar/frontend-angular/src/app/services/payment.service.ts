import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Payment } from '../models/payment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  constructor(private http: HttpClient) {}

  create(payload: FormData): Observable<Payment> {
    return this.http.post<Payment>('/api/payments/', payload);
  }

  list(): Observable<Payment[]> {
    return this.http.get<Payment[]>('/api/payments/');
  }

  // 🆕 Add this:
  delete(id: number): Observable<any> {
    return this.http.delete(`/api/payments/${id}/`);
  }
}
