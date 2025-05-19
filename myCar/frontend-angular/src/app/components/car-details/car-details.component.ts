// src/app/components/car-details/car-details.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';                    // ngIf, ngFor, date pipe
import { ActivatedRoute } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';            // <mat-tab-group>, <mat-tab>
import { CarService } from '../../services/car.service';
import { MaintenanceTaskService } from '../../services/maintenance-task.service';
import { Car } from '../../models/car';
import { MaintenanceTask } from '../../models/maintenancetask';

@Component({
  standalone: true,
  selector: 'app-car-details',
  templateUrl: './car-details.component.html',
  styleUrls: ['./car-details.component.scss'],
  imports: [
    CommonModule,
    MatTabsModule
  ]
})
export class CarDetailsComponent implements OnInit {
  car: Car | null = null;
  tasks: MaintenanceTask[] = [];
  loading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private carSvc: CarService,
    private taskSvc: MaintenanceTaskService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.carSvc.get(id).subscribe({
      next: data => {
        this.car = data;
        this.fetchMaintenanceTasks(data.maintenance_tasks || []);
        this.loading = false;
      },
      error: err => {
        this.error = err.message || 'Failed to load car details';
        this.loading = false;
      }
    });
  }

  private fetchMaintenanceTasks(taskIds: number[]): void {
    taskIds.forEach(tid =>
      this.taskSvc.get(tid).subscribe({
        next: t => this.tasks.push(t),
        error: e => console.error('Task fetch error', tid, e)
      })
    );
  }
}
