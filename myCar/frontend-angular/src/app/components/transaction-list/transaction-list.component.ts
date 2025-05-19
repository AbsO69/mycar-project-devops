import { Component, OnInit } from '@angular/core';
import { TransactionService } from '../../services/transaction.service';
import { Transaction } from '../../models/transaction';
import { Router } from '@angular/router';

@Component({
  selector: 'app-transaction-list',
  standalone: false,
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.scss']
})
export class TransactionListComponent implements OnInit {
  transactions: Transaction[] = [];
  filteredTransactions: Transaction[] = [];
  loading = true;
  error = '';
  filterText: string = ''; // For search input
  paymentSortDirection: 'asc' | 'desc' = 'asc';
  currentPage: number = 1;
  itemsPerPage: number = 10;

  constructor(
    private txSvc: TransactionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.txSvc.list().subscribe({
      next: data => {
        this.transactions = data;
        this.filteredTransactions = this.filterTransactions(); // Apply filter on load
        this.loading = false;
      },
      error: err => {
        this.error = err.message;
        this.loading = false;
      }
    });
  }

  // Function to update page when search input changes
  filterTransactions(): Transaction[] {
    if (!this.filterText.trim()) {
      return this.transactions; // If no filter, return all transactions
    }

    const search = this.filterText.toLowerCase();
    return this.transactions.filter(tx => tx.id.toString().includes(search));
  }

  // Update filtered transactions when page changes
  onPageChange(page: number) {
    this.currentPage = page;
    this.filteredTransactions = this.paginateTransactions(this.filterTransactions()); // Paginate the filtered transactions
  }

  // Pagination logic
  paginateTransactions(data: Transaction[]) {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return data.slice(startIndex, endIndex);
  }

  // Reset to page 1 when filter changes
  onFilterChange() {
    this.currentPage = 1;
    this.filteredTransactions = this.paginateTransactions(this.filterTransactions()); // Reapply filter and paginate
  }

  // Sorting by payment status
  sortByPaymentStatus() {
    if (this.paymentSortDirection === 'asc') {
      this.transactions.sort((a, b) => a.payment_status.localeCompare(b.payment_status));
      this.paymentSortDirection = 'desc';
    } else {
      this.transactions.sort((a, b) => b.payment_status.localeCompare(a.payment_status));
      this.paymentSortDirection = 'asc';
    }
    this.filteredTransactions = this.paginateTransactions(this.filterTransactions());
  }

  editTransaction(id: number) {
    this.router.navigate(['/transactions', id, 'edit']);
  }

  deleteTransaction(id: number) {
    if (!confirm('Delete this transaction?')) return;
    this.txSvc.delete(id).subscribe(() => {
      this.transactions = this.transactions.filter(t => t.id !== id);
      this.filteredTransactions = this.filterTransactions(); // Reapply filter after delete
    });
  }

  createTransaction() {
    this.router.navigate(['/transactions/new']);
  }

  addPayment(transaction: Transaction) {
    this.router.navigate([`/transactions/${transaction.id}/edit`]);
  }
}
