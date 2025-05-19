import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CarListComponent } from './components/car-list/car-list.component';
import { CarFormComponent } from './components/car-form/car-form.component';
import { LoginComponent } from './components/login/login.component'; // Import LoginComponent
import { FormsModule } from '@angular/forms';  // Import FormsModule
import { HttpClientModule } from '@angular/common/http';
import { RegistrationComponent } from './components/registration/registration.component';
import { TransactionListComponent } from './components/transaction-list/transaction-list.component';
import { TransactionFormComponent } from './components/transaction-form/transaction-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CustomerListComponent } from './components/customer-list/customer-list.component';
import { CustomerFormComponent } from './components/customer-form/customer-form.component';
import { PaymentFormComponent } from './components/payment-form/payment-form.component';
import { PaymentListComponent } from './components/payment-list/payment-list.component';
import { MaintenanceTaskListComponent } from './components/maintenance-task-list/maintenance-task-list.component';
import { MaintenanceTaskFormComponent } from './components/maintenance-task-form/maintenance-task-form.component';
import { CarMaintenanceFormComponent } from './components/car-maintenance-form/car-maintenance-form.component';
import { CarMaintenanceListComponent } from './components/car-maintenance-list/car-maintenance-list.component';
import { CarDetailsComponent } from './components/car-details/car-details.component';
import { MatTabsModule } from '@angular/material/tabs';


@NgModule({
  declarations: [
    AppComponent,
    CarListComponent,
    CarFormComponent,
    LoginComponent,
    RegistrationComponent,
    TransactionListComponent,
    TransactionFormComponent,
    CustomerListComponent,
    CustomerFormComponent,
    PaymentFormComponent,
    PaymentListComponent,
    MaintenanceTaskListComponent,
    MaintenanceTaskFormComponent,
    CarMaintenanceFormComponent,
    CarMaintenanceListComponent  
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatTabsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
