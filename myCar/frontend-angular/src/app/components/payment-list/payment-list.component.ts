import { Component, OnInit } from '@angular/core';
import { PaymentService } from '../../services/payment.service';
import { Payment } from '../../models/payment';

@Component({
  standalone:false,
  selector: 'app-payment-list',
  templateUrl: './payment-list.component.html',
  styleUrls: ['./payment-list.component.scss']
})
export class PaymentListComponent implements OnInit {
  payments: Payment[] = [];
  loading = true;
  error = '';

  constructor(private paymentService: PaymentService) {}

  ngOnInit(): void {
    this.loadPayments();
  }

  loadPayments() {
    this.loading = true;
    this.paymentService.list().subscribe({
      next: data => {
        this.payments = data;
        this.loading = false;
      },
      error: err => {
        this.error = err.message;
        this.loading = false;
      }
    });
  }

  // 🆕 Add this:
  deletePayment(payment: Payment) {
    if (confirm(`Are you sure you want to delete payment #${payment.id}?`)) {
      this.paymentService.delete(payment.id).subscribe({
        next: () => {
          this.loadPayments(); // reload after delete
        },
        error: err => {
          this.error = 'Failed to delete payment.';
        }
      });
    }
  }

  getReceiptUrl(path: string): string {
    // If the path already starts with 'http', assume it's a full URL
    if (path.startsWith('http')) {
      return path;
    }
    return `http://127.0.0.1:8000/media/${path}`;
  }


}
