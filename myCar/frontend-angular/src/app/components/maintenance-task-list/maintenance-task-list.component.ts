// src/app/components/maintenance-task-list/maintenance-task-list.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MaintenanceTaskService } from '../../services/maintenance-task.service';
import { MaintenanceTask } from '../../models/maintenancetask';

@Component({
  standalone:false,
  selector: 'app-maintenance-task-list',
  templateUrl: './maintenance-task-list.component.html',
  styleUrls: ['./maintenance-task-list.component.scss']
})
export class MaintenanceTaskListComponent implements OnInit {
  tasks: MaintenanceTask[] = [];

  constructor(
    private svc: MaintenanceTaskService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.svc.list().subscribe(data => this.tasks = data);
  }

  addNew(): void {
    this.router.navigate(['/tasks/new']);
  }

  edit(id: number): void {
    this.router.navigate(['/tasks', id, 'edit']);
  }

  delete(id: number): void {
    if (!confirm('Delete this task?')) {
      return;
    }
    this.svc.delete(id).subscribe(() => this.load());
  }
}
