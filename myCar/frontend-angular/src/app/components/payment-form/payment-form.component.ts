// src/app/components/payment-form/payment-form.component.ts

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TransactionService } from '../../services/transaction.service';
import { Transaction } from '../../models/transaction';
import { PaymentService } from '../../services/payment.service';
import { Payment } from '../../models/payment';  
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';



@Component({
  selector: 'app-payment-form',
  templateUrl: './payment-form.component.html',
  styleUrls: ['./payment-form.component.scss'],
  standalone: false
})
export class PaymentFormComponent implements OnInit {
  form!: FormGroup;
  transaction: Transaction | null = null;
  error: string = '';
  loading: boolean = true;
  apiError: any = null;
  constructor(
    private route: ActivatedRoute,
    private transactionService: TransactionService,
    private paymentService: PaymentService,
    private fb: FormBuilder,
    private router: Router,
    
  ) {}

  ngOnInit(): void {
    const transactionId = this.route.snapshot.paramMap.get('id');
    if (transactionId) {
      const id = Number(transactionId);
      if (!isNaN(id)) {
        this.transactionService.get(id).subscribe({
          next: (tx) => {
            this.transaction = tx;
            this.loading = false;
            this.initForm();
          },
          error: (err) => {
            this.error = 'Error loading transaction details';
            this.loading = false;
          }
        });
      } else {
        this.error = 'Invalid transaction ID';
        this.loading = false;
      }
    }
  }

  private initForm(): void {
    if (this.transaction) {
      this.form = this.fb.group({
        payment_amount: [null, [Validators.required, Validators.min(0)]],
        payment_method: ['credit_card', Validators.required],
        payment_status: ['pending', Validators.required],
        receipt_pdf: [null],
        transaction: [this.transaction.id]
      });
    }
  }

  // onSubmit(): void {
  //   if (this.form.invalid) return;
  //   console.log(this.form.value);
  //   this.paymentService.create(this.form.value).subscribe({
  //     next: (payment) => {
  //       alert('✅ Payment successful!');
  //       this.router.navigate(['/transactions']);
  //     },
  //     error: (err) => {
  //       console.error('API error response:', err);
  //       // err.error usually contains the parsed JSON response body
  //       this.apiError = err.error ?? err.message;
  //     }
  //   });
  // }


//   onSubmit(): void {
//   if (this.form.invalid || !this.transaction) return;

//   const formData = new FormData();
//   formData.append('payment_amount', this.form.value.payment_amount);
//   formData.append('payment_method', this.form.value.payment_method);
//   formData.append('payment_status', this.form.value.payment_status);
//   formData.append('transaction', this.transaction.id.toString());

//   const file = this.form.value.receipt_pdf;
//   if (file) {
//     formData.append('receipt_pdf', file, file.name);
//   }

//   this.paymentService.create(formData).subscribe({
//     next: () => {
//       alert('✅ Payment successful!');
//       this.router.navigate(['/transactions']);
//     },
//     error: (err) => {
//       console.error('API error response:', err);
//       this.apiError = err.error ?? err.message;
//     }
//   });
// }

onSubmit(): void {
  if (this.form.invalid || !this.transaction) return;

  const formData = new FormData();
  formData.append('payment_amount', this.form.value.payment_amount);
  formData.append('payment_method', this.form.value.payment_method);
  formData.append('payment_status', this.form.value.payment_status);
  formData.append('transaction', this.transaction.id.toString());

  const file = this.form.value.receipt_pdf;
  if (file instanceof File) {
    formData.append('receipt_pdf', file, file.name);
  }

  this.paymentService.create(formData).subscribe({
    next: () => {
      alert('✅ Payment successful!');
      this.router.navigate(['/transactions']);
    },
    error: (err) => {
      console.error('API error response:', err);
      this.apiError = err.error ?? err.message;
      }
    });
  } 

  onFileChange(event: any) {
    const file = event.target.files[0];
      if (file) {
        this.form.patchValue({ receipt_pdf: file });
      }
  }

}
