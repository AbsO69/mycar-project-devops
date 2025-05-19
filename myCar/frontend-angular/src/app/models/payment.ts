import { Transaction } from './transaction';

export interface Payment {
  id: number; 
  transaction: Transaction; 
  payment_amount: number;
  payment_method: string;
  payment_status: string;
  payment_date?: string; 
  created_at?: string;   
  receipt_pdf?: string;   
  binary_receipt_pdf?: string;  
}
