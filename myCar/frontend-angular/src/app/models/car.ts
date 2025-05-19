import { CarMaintenance } from './car-maintenance';

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
  maintenance_tasks: number[];           // array of task IDs
  maintenance_records: CarMaintenance[]; // full record objects Many2Many
  created_at: string;
  image_data?: string | null;
}
