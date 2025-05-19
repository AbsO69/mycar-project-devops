// src/app/models/car.ts
export interface Car {
    id: number;
    make: string;
    model: string;
    year: number;
    vin: string;
    color: string;
    license_plate: string;
    mileage: number;
    fuel_type: 'gas' | 'diesel' | 'electric' | 'hybrid';
    image_data?: string | null; // Base64-encoded image data
    // ...created_at, image_data omitted for now
  }
  