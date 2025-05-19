import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarMaintenanceFormComponent } from './car-maintenance-form.component';

describe('CarMaintenanceFormComponent', () => {
  let component: CarMaintenanceFormComponent;
  let fixture: ComponentFixture<CarMaintenanceFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CarMaintenanceFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarMaintenanceFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
