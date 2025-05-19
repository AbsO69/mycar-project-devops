// src/app/services/transaction.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Transaction } from '../models/transaction';  // Import the model

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private apiUrl = '/api/transactions/';  // Adjust this to your API endpoint

  constructor(private http: HttpClient) {}

  // Get a list of all transactions
  list(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(this.apiUrl);
  }

  // Get a single transaction by ID
  get(id: number): Observable<Transaction> {
    return this.http.get<Transaction>(`${this.apiUrl}${id}/`);
  }

  // Create a new transaction
create(transaction: FormData): Observable<Transaction> {
  return this.http.post<Transaction>(this.apiUrl, transaction);
}

// Update an existing transaction
update(id: number, transaction: FormData): Observable<Transaction> {
  return this.http.put<Transaction>(`${this.apiUrl}${id}/`, transaction);
}


  // Delete a transaction
  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}${id}/`);
  }

}
