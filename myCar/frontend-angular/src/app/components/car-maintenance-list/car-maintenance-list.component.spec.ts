import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarMaintenanceListComponent } from './car-maintenance-list.component';

describe('CarMaintenanceListComponent', () => {
  let component: CarMaintenanceListComponent;
  let fixture: ComponentFixture<CarMaintenanceListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CarMaintenanceListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarMaintenanceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
