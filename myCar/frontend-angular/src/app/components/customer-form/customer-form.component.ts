import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RecordService } from '../../services/record.service';
import { Record } from '../../models/record';

@Component({
  selector: 'app-customer-form',
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.scss'],
  standalone:false
})
export class CustomerFormComponent implements OnInit {
  customerForm: FormGroup;
  customerId: number | null = null;
  loading: boolean = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private recordService: RecordService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.customerForm = this.fb.group({
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      address: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      zipcode: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.initializeForm();
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.customerId = +params['id'];
        this.loadCustomerData(this.customerId);
      }
    });
  }

  private initializeForm() {
    this.customerForm = this.fb.group({
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      address: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      zipcode: ['', [Validators.required]]
    });
  }

  loadCustomerData(id: number) {
    this.loading = true;
    this.recordService.get(id).subscribe({
      next: (customer: Record) => {
        this.customerForm.patchValue(customer);
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error loading customer data';
        this.loading = false;
      }
    });
  }

  onSubmit() {
    if (this.customerForm.invalid) {
      return;
    }

    const customerData: Record = this.customerForm.value;
    this.loading = true;
    if (this.customerId) {
      this.recordService.update(this.customerId, customerData).subscribe({
        next: () => {
          this.router.navigate(['/customers']);
        },
        error: (err) => {
          this.error = 'Error updating customer';
          this.loading = false;
        }
      });
    } else {
      this.recordService.create(customerData).subscribe({
        next: () => {
          this.router.navigate(['/customers']);
        },
        error: (err) => {
          this.error = 'Error creating customer';
          this.loading = false;
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/customers']); 
  }
}
