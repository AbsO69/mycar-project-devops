import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CarMaintenanceService } from '../../services/car-maintenance.service';
import { CarMaintenance } from '../../models/car-maintenance';

@Component({
  standalone:false,
  selector: 'app-car-maintenance-list',
  templateUrl: './car-maintenance-list.component.html',
  styleUrls: ['./car-maintenance-list.component.scss']
})
export class CarMaintenanceListComponent implements OnInit {
  records: CarMaintenance[] = [];

  constructor(
    private svc: CarMaintenanceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.svc.list().subscribe(data => this.records = data);
  }

  addNew(): void {
    this.router.navigate(['/car-maintenance/new']);
  }

  // edit(id: number): void {
  //   this.router.navigate(['/car-maintenance', id, 'edit']);
  // }

  // delete(id: number): void {
  //   if (!confirm('Delete this record?')) return;
  //   this.svc.delete(id).subscribe(() => this.load());
  // }
}
