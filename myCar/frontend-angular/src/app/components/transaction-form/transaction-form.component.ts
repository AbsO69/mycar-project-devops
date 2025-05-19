import { CarService } from '../../services/car.service';
import { RecordService } from '../../services/record.service'; 
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TransactionService } from '../../services/transaction.service';
import { Transaction } from '../../models/transaction';  
import { forkJoin, of } from 'rxjs'; // <== important: import `of`
import { PaymentService } from '../../services/payment.service';

@Component({
  selector: 'app-transaction-form',
  standalone: false,
  templateUrl: './transaction-form.component.html',
  styleUrl: './transaction-form.component.scss'
})
export class TransactionFormComponent implements OnInit {
  form!: FormGroup;
  transaction: Transaction | null = null;

  cars: any[] = [];
  customers: any[] = [];
  loading = true;
  error = '';

  constructor(
    private paymentService: PaymentService,
    private fb: FormBuilder,
    private txSvc: TransactionService,
    private carSvc: CarService,
    private customerSvc: RecordService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? +idParam : null; // <-- safer

    const carRequest = this.carSvc.list();
    const customerRequest = this.customerSvc.list();
    const txRequest = id ? this.txSvc.get(id) : of(null); // if no id, return empty observable

    forkJoin({
      cars: carRequest,
      customers: customerRequest,
      tx: txRequest
    }).subscribe({
      next: ({ cars, customers, tx }) => {
        this.cars        = cars;
        this.customers   = customers;
        this.transaction = tx;
        this.initForm(tx);
        this.loading     = false;
      },
      error: err => {
        this.error       = err.message;
        this.loading     = false;
      }
    });
  }

  private initForm(tx: Transaction | null) {
  this.form = this.fb.group({
    car: [tx?.car.id || '', Validators.required],
    customer: [tx?.customer.id || '', Validators.required],
    rental_start_date: [tx ? this.formatDateForInput(tx.rental_start_date) : '', Validators.required],
    rental_end_date: [tx ? this.formatDateForInput(tx.rental_end_date) : '', Validators.required],
    rental_price: [tx?.rental_price ?? 0, [Validators.required, Validators.min(0)]], //Use ?? when 0 is a valid value you want to preserve (unlike ||, which treats 0 as falsy)
    status: [tx?.status || 'ongoing', Validators.required],
    payment_status: [tx?.payment_status || 'unpaid', Validators.required], // use || when you want a default for any falsy value, like null, undefined, '', false, 0.
  }, { validators: rentalDateValidator }); // apply custom validator here
}


  // private initForm(tx: Transaction | null) {
  //   if (!tx) {
  //     // If no transaction, initialize empty form
  //     this.form = this.fb.group({
  //       car: ['', Validators.required],
  //       customer: ['', Validators.required],
  //       rental_start_date: ['', Validators.required],
  //       rental_end_date: ['', Validators.required],
  //       rental_price: [0, [Validators.required, Validators.min(0)]],
  //       status: ['ongoing', Validators.required],
  //       payment_status: ['unpaid', Validators.required],
  //     });
  //   } else {
  //     // If transaction exists, populate form
  //     this.form = this.fb.group({
  //       car: [tx.car.id, Validators.required], 
  //       customer: [tx.customer.id, Validators.required], 
  //       rental_start_date: [this.formatDateForInput(tx.rental_start_date), Validators.required],
  //       rental_end_date: [this.formatDateForInput(tx.rental_end_date), Validators.required],
  //       rental_price: [tx.rental_price, [Validators.required, Validators.min(0)]],
  //       status: [tx.status, Validators.required],
  //       payment_status: [tx.payment_status, Validators.required],
  //     });
  //   }
  // }
  

  onSubmit(): void {
    if (this.form.invalid) return;
  
    const formData = new FormData();
    formData.append('car_id', this.form.value.car);
formData.append('customer_id', this.form.value.customer);
    formData.append('rental_start_date', this.form.value.rental_start_date);
    formData.append('rental_end_date', this.form.value.rental_end_date);
    formData.append('rental_price', this.form.value.rental_price);
    formData.append('status', this.form.value.status);
    formData.append('payment_status', this.form.value.payment_status);
  
    // If there's a receipt PDF uploaded
    const file: File = this.form.value.receipt_pdf;
    if (file) {
      formData.append('receipt_pdf', file, file.name);
    }
  
    console.group('📤 Transaction FormData Payload');
    formData.forEach((value, key) => {
      console.log(`${key}:`, value);
    });
    console.groupEnd();
  
    if (this.transaction?.id) {
      // Update transaction
      this.txSvc.update(this.transaction.id, formData).subscribe({
        next: (res) => {
          console.log('✅ Transaction updated', res);
          this.router.navigate(['/transactions']); // optional
        },
        error: (err) => {
          this.error = 'Failed to update transaction';
          console.error(err);
        }
      });
    } else {
      // Create new transaction
      this.txSvc.create(formData).subscribe({
        next: (res) => {
          console.log('✅ Transaction created', res);
          this.router.navigate(['/transactions']); // optional
        },
        error: (err) => {
          this.error = 'Failed to create transaction';
          console.error(err);
        }
      });
    }
  }
  
  

  addPayment() {
    if (!this.transaction?.id) return;
    this.router.navigate(['/transactions', this.transaction.id, 'add-payment']);
  }



  private formatDateForInput(dateStr: string): string {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  onCancel(): void {
    this.router.navigate(['/transactions']); 
  }
  
}


import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const rentalDateValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
  const start = group.get('rental_start_date')?.value;
  const end = group.get('rental_end_date')?.value;

  if (start && end && new Date(start) > new Date(end)) {
    return { dateRangeInvalid: true };
  }

  return null;
};