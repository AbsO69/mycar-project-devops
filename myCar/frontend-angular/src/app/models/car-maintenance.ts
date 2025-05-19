// car-maintenance.ts
import { Car } from './car';
import { MaintenanceTask } from './maintenancetask';

export interface CarMaintenance {
  car_id: number;
  id: number;
  car_make: string;
  car_model: string;
  license_plate: string;
  task: MaintenanceTask;
  performed_at: string;
  notes: string;
}
