import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenanceTaskListComponent } from './maintenance-task-list.component';

describe('MaintenanceTaskListComponent', () => {
  let component: MaintenanceTaskListComponent;
  let fixture: ComponentFixture<MaintenanceTaskListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MaintenanceTaskListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaintenanceTaskListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
