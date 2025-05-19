import { Component, OnInit } from '@angular/core';
import { CarService } from '../../services/car.service';
import { Car } from '../../models/carForm';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  standalone: false,
  selector: 'app-car-list',
  templateUrl: './car-list.component.html',
  styleUrls: ['./car-list.component.scss'],
})
export class CarListComponent implements OnInit {
  cars: Car[] = [];
  loading = true;
  error = '';
  searchForm: FormGroup;
  sortField: keyof Car = 'year';  // Restricting sortField to keys of Car
  sortOrder: boolean = true;  // true for ascending, false for descending
  currentPage: number = 1;
  itemsPerPage: number = 10;

  constructor(
    private carSvc: CarService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.searchForm = this.fb.group({
      searchText: [''],  // For searching by model
    });
  }

  ngOnInit() {
    this.loadCars();
    // Subscribe to form changes to trigger search/filter on changes
    this.searchForm.valueChanges.subscribe(() => this.loadCars());
  }

  loadCars() {
    this.loading = true;
    const { searchText } = this.searchForm.value;
    
    // Fetch all cars without any filters
    this.carSvc.list().subscribe({
      next: (data) => {
        // Filter by searchText (model), making sure the model is not null
        let filteredData = data.filter((car) => {
          const model = car.model || '';  // Default to empty string if null
          return model.toLowerCase().includes(searchText.toLowerCase());
        });

        // Sort the filtered data based on the selected field and order
        filteredData = filteredData.sort((a, b) => {
          const aValue = a[this.sortField];
          const bValue = b[this.sortField];

          if (typeof aValue === 'string' && typeof bValue === 'string') {
            return this.sortOrder ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
          } else if (typeof aValue === 'number' && typeof bValue === 'number') {
            return this.sortOrder ? aValue - bValue : bValue - aValue;
          }
          return 0;  // If types are mixed or not comparable, treat as equal
        });

        // Paginate: Slice the data for the current page and items per page
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        this.cars = filteredData.slice(startIndex, endIndex);
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message;
        this.loading = false;
      },
    });
  }

  onSortChange() {
    // Toggle sort order when clicking on the Year header
    this.sortOrder = !this.sortOrder;
    this.loadCars(); // Reload cars after sorting
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadCars(); // Reload cars on page change
  }

  addCar() {
    this.router.navigate(['/cars/new']);
  }

  editCar(car: Car) {
    this.router.navigate(['/cars', car.id, 'edit']);
  }

  deleteCar(id: number) {
    if (confirm('Are you sure you want to delete this car?')) {
      this.carSvc.delete(id).subscribe({
        next: () => {
          this.loadCars(); // Refresh the list after deletion
        },
        error: (err) => {
          this.error = err.message;
        },
      });
    }
  }

  viewCarDetails(id: number) {
    console.log('Navigating to car:', id);
    this.router.navigate(['/cars', id, 'details']);
  }
}
