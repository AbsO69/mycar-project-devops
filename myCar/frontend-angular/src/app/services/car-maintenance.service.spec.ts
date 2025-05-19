import { TestBed } from '@angular/core/testing';

import { CarMaintenanceService } from './car-maintenance.service';

describe('CarMaintenanceService', () => {
  let service: CarMaintenanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CarMaintenanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
