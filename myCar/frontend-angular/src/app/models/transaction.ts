export interface Car {
    id: number;
    make: string;
    model: string;
    year: number;
    vin: string;
    color: string;
    license_plate: string;
    mileage: number;
    fuel_type: string;
  }
  
  export interface Record {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipcode: string;
  }
  
  export interface Transaction {
    id: number;
    car: Car;  // Nested object for car details
    customer: Record;  // Nested object for customer details
    rental_start_date: string;  // Date in ISO format
    rental_end_date: string;    // Date in ISO format
    rental_price: number;
    status: string;
    payment_status: string;
    created_at: string;  // Date in ISO format
    updated_at: string;  // Date in ISO format
  }