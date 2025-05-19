// src/app/app-routing.module.ts

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CarListComponent }        from './components/car-list/car-list.component';
import { CarFormComponent }        from './components/car-form/car-form.component';
import { TransactionListComponent} from './components/transaction-list/transaction-list.component';
import { TransactionFormComponent} from './components/transaction-form/transaction-form.component';
import { LoginComponent }          from './components/login/login.component';
import { RegistrationComponent }   from './components/registration/registration.component';
import { CustomerListComponent } from './components/customer-list/customer-list.component';
import { AuthGuard } from './guards/auth.guard';
import {CustomerFormComponent} from './components/customer-form/customer-form.component';
import {PaymentFormComponent} from './components/payment-form/payment-form.component';
import { PaymentListComponent } from './components/payment-list/payment-list.component';
import { MaintenanceTaskListComponent } from './components/maintenance-task-list/maintenance-task-list.component';
import { MaintenanceTaskFormComponent } from './components/maintenance-task-form/maintenance-task-form.component';
import { CarMaintenanceFormComponent } from './components/car-maintenance-form/car-maintenance-form.component';
import { CarMaintenanceListComponent } from './components/car-maintenance-list/car-maintenance-list.component';
import { CarDetailsComponent } from './components/car-details/car-details.component';

const routes: Routes = [
  // Public
  { path: 'login',    component: LoginComponent },
  { path: 'register', component: RegistrationComponent },

  // Redirect root to login
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  { path: 'customers', component: CustomerListComponent, canActivate: [AuthGuard] },
  { path: 'customers/new', component: CustomerFormComponent, canActivate: [AuthGuard] },
  { path: 'customers/:id/edit', component: CustomerFormComponent, canActivate: [AuthGuard] },

  // Cars (all guarded)
  { path: 'cars',           component: CarListComponent,   canActivate: [AuthGuard] },
  { path: 'cars/new',       component: CarFormComponent,   canActivate: [AuthGuard] },
  { path: 'cars/:id/edit',  component: CarFormComponent,   canActivate: [AuthGuard] },
  { path: 'cars/:id/details', component: CarDetailsComponent,canActivate: [AuthGuard] },
  
  // Transactions (all guarded)
  { path: 'transactions',           component: TransactionListComponent, canActivate: [AuthGuard] },
  { path: 'transactions/:id/edit',  component: TransactionFormComponent, canActivate: [AuthGuard] },
  { path: 'transactions/new', component: TransactionFormComponent, canActivate: [AuthGuard] },

  // Add payment route for transaction
  { path: 'transactions/:id/add-payment', component: PaymentFormComponent, canActivate: [AuthGuard] },
  { path: 'payments', component: PaymentListComponent, canActivate: [AuthGuard] },


  // Tasks  
  { path: 'tasks',       component: MaintenanceTaskListComponent,canActivate: [AuthGuard] },
  { path: 'tasks/new',   component: MaintenanceTaskFormComponent,canActivate: [AuthGuard] },
  { path: 'tasks/:id/edit', component: MaintenanceTaskFormComponent,canActivate: [AuthGuard] },


  { path: 'car-maintenance',         component: CarMaintenanceListComponent,canActivate: [AuthGuard] },
  { path: 'car-maintenance/new',     component: CarMaintenanceFormComponent,canActivate: [AuthGuard] },
  { path: 'car-maintenance/:id/edit', component: CarMaintenanceFormComponent ,canActivate: [AuthGuard]},

  // Catch-all — redirect unknown paths back to cars
  { path: '**', redirectTo: '/cars' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
