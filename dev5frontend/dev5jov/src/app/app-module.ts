import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
 
import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { EmployeeAttendance } from './employeeattendance/employeeattendance';
import { Utilization } from './utilization/utilization';
import { CommonModule } from '@angular/common';
 
@NgModule({
  declarations: [
    App,
    EmployeeAttendance,
    Utilization
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,FormsModule,
    CommonModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners()
  ],
  bootstrap: [App]
})
export class AppModule { }
 
 