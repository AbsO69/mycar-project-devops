import { Component, OnInit } from '@angular/core';
import { RecordService  } from '../../services/record.service';
import { Record } from '../../models/record';
import { Router } from '@angular/router';



@Component({
  selector: 'app-customer-list',
  standalone: false,
  templateUrl: './customer-list.component.html',
  styleUrl: './customer-list.component.scss'
})
export class CustomerListComponent implements OnInit {
  customers: Record[] = [];
  loading = true;
  error = '';
  currentPage: number = 1;
  itemsPerPage: number = 10;
  filterText: string = '';

  constructor(private recordService: RecordService, public router: Router) {}

  ngOnInit(): void {
    this.loadCustomers();
  }

  // Load customers from the service
  loadCustomers(): void {
    this.recordService.list().subscribe({
      next: (data) => {
        this.customers = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message;
        this.loading = false;
      }
    });
  }

  // Delete a customer
  deleteCustomer(id: number): void {
    if (confirm('Are you sure you want to delete this customer?')) {
      this.recordService.delete(id).subscribe(() => {
        this.customers = this.customers.filter(customer => customer.id !== id);
      });
    }
  }

  // Navigate to the create customer page
  createCustomer(): void {
    this.router.navigate(['/customers/new']);
  }

  // Filter customers based on the search text
  filterCustomers(): Record[] {
    if (!this.filterText.trim()) {
      return this.customers;  // No filter, return all customers
    }

    const search = this.filterText.toLowerCase();
    return this.customers.filter(customer =>
      customer.first_name.toLowerCase().includes(search) || customer.id.toString().includes(search)
    );
  }

  // Paginate customers for the current page
  paginateCustomers(customers: Record[]): Record[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return customers.slice(startIndex, endIndex);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
  }
}
