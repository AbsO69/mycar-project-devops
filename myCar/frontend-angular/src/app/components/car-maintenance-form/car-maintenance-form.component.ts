import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CarMaintenanceService, CarMaintenancePayload } from '../../services/car-maintenance.service';
import { CarService } from '../../services/car.service';
import { MaintenanceTaskService } from '../../services/maintenance-task.service';
import { Car } from '../../models/car';
import { MaintenanceTask } from '../../models/maintenancetask';

@Component({
  standalone:false,
  selector: 'app-car-maintenance-form',
  templateUrl: './car-maintenance-form.component.html',
  styleUrls: ['./car-maintenance-form.component.scss']
})
export class CarMaintenanceFormComponent implements OnInit {
  form: FormGroup;
  isEdit = false;
  recordId?: number;
  cars: Car[] = [];
  tasks: MaintenanceTask[] = [];

  constructor(
    fb: FormBuilder,
    private svc: CarMaintenanceService,
    private carSvc: CarService,
    private taskSvc: MaintenanceTaskService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = fb.group({
      car_id: [null, Validators.required],
      task_id: [null, Validators.required],
      performed_at: ['', Validators.required],
      notes: ['']
    });
  }

  ngOnInit(): void {
    this.carSvc.list().subscribe(c => this.cars = c);
    this.taskSvc.list().subscribe(t => this.tasks = t);

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.recordId = +id;
      this.svc.get(this.recordId).subscribe(rec => {
        this.form.patchValue({
          car_id: rec.car_id || null,
          task_id: rec.task.id,
          performed_at: rec.performed_at,
          notes: rec.notes
        });
      });
    }
  }

  save(): void {
    if (this.form.invalid) return;
    const payload: CarMaintenancePayload = this.form.value;
    const action = this.isEdit
      ? this.svc.update(this.recordId!, payload)
      : this.svc.create(payload);

    action.subscribe(() => this.router.navigate(['/car-maintenance']));
  }

  cancel(): void {
    this.router.navigate(['/car-maintenance']);
  }
}
