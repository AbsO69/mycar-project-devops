// src/app/components/car-form/car-form.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CarService } from '../../services/car.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Car } from '../../models/car';

@Component({
  standalone: false,
  selector: 'app-car-form',
  templateUrl: './car-form.component.html',
  styleUrls: ['./car-form.component.scss'],
})
export class CarFormComponent implements OnInit {
  carForm: FormGroup;
  isEditMode = false;
  carId: number | null = null;
  loading = false;
  error = '';
  imagePreview: string | null = null;  // To store the image preview
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private carSvc: CarService,
    private route: ActivatedRoute,
    public router: Router
  ) {
    this.carForm = this.fb.group({
      year: ['', Validators.required],
      make: ['', Validators.required],
      model: ['', Validators.required],
      vin: ['', Validators.required],
      color: ['', Validators.required],
      license_plate: ['', Validators.required],
      mileage: ['', Validators.required],
      fuel_type: ['', Validators.required],
      image_data: [null],  // Optional for storing base64 image data
    });
  }

  ngOnInit() {
    this.carId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.carId) {
      this.isEditMode = true;
      this.loadCar();
    }
  }

  loadCar() {
    this.loading = true;
    this.carSvc.get(this.carId!).subscribe({
      next: car => {
        this.carForm.patchValue(car);
        this.loading = false;
        // If there's an existing image, show the preview
        if (car.image_data) {
          // this.imagePreview = car.image_data;
          this.imagePreview = `data:image/*;base64,${car.image_data}`;

        }
      },
      error: err => {
        this.error = err.message;
        this.loading = false;
      }
    });
  }


onFileChange(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    const file = input.files[0];
    this.selectedFile = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
      this.carForm.patchValue({ image_data: this.imagePreview.split(',')[1] }); // Base64 only
    };
    reader.readAsDataURL(file);
  }
}

onDeleteImage(): void {
  this.imagePreview = null;
  this.selectedFile = null;
  this.carForm.patchValue({ image_data: null }); // Or '' if your backend prefers that
}


  // onFileChange(event: any) {
  //   const file = event.target.files[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.readAsDataURL(file);
  //     reader.onload = () => {
  //       const base64Image = reader.result as string;
  //       this.carForm.patchValue({ image_data: base64Image.split(',')[1] });  // Strip the 'data:image/png;base64,' part
  //     };
  //   }
  // }
  
  // onSubmit() {
  //   if (this.carForm.invalid) return;

  //   const carData = this.carForm.value;
  //   this.loading = true;

  //   if (this.isEditMode) {
  //     this.carSvc.update(this.carId!, carData).subscribe({
  //       next: () => this.router.navigate(['/cars']),
  //       error: err => { this.error = err.message; this.loading = false; }
  //     });
  //   } else {
  //     this.carSvc.create(carData).subscribe({
  //       next: () => this.router.navigate(['/cars']),
  //       error: err => { this.error = err.message; this.loading = false; }
  //     });
  //   }
  // }

  onSubmit() {
  if (this.carForm.invalid) return;

  const carData = this.carForm.value;
  this.loading = true;
  this.error = ''; // reset any general error message

  const request = this.isEditMode
    ? this.carSvc.update(this.carId!, carData)
    : this.carSvc.create(carData);

  request.subscribe({
    next: () => this.router.navigate(['/cars']),
    error: err => {
      this.loading = false;

      if (err.error && typeof err.error === 'object') {
        // Loop through backend validation errors
        for (const field in err.error) {
          if (this.carForm.get(field)) {
            this.carForm.get(field)?.setErrors({ serverError: err.error[field][0] });
          }
        }
      } else {
        // Generic error fallback
        this.error = err.message || 'Something went wrong.';
      }
    }
  });
}


}
