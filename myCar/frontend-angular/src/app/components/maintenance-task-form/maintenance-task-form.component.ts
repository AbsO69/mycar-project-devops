// src/app/components/maintenance-task-form/maintenance-task-form.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MaintenanceTaskService } from '../../services/maintenance-task.service';
import { MaintenanceTask } from '../../models/maintenancetask';

@Component({
  standalone:false,
  selector: 'app-maintenance-task-form',
  templateUrl: './maintenance-task-form.component.html',
  styleUrls: ['./maintenance-task-form.component.scss']
})
export class MaintenanceTaskFormComponent implements OnInit {
  form: FormGroup;
  isEdit = false;
  taskId?: number;

  constructor(
    private fb: FormBuilder,
    private svc: MaintenanceTaskService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ['']
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEdit = true;
      this.taskId = +idParam;
      this.svc.get(this.taskId).subscribe(task => {
        this.form.patchValue(task);
      });
    }
  }

  save(): void {
    if (this.form.invalid) {
      return;
    }
    const payload: Partial<MaintenanceTask> = this.form.value;

    const request = this.isEdit
      ? this.svc.update(this.taskId!, payload)
      : this.svc.create(payload);

    request.subscribe(() => this.router.navigate(['/tasks']));
  }

  cancel(): void {
    this.router.navigate(['/tasks']);
  }
}
