import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { App } from './app';
import { Login } from './auth/login/login';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { Admindashboard } from './admin/admindashboard/admindashboard';
import { Employeedashboard } from './employee/employeedashboard/employeedashboard';
import { Managerdashboard } from './manager/managerdashboard/managerdashboard';
import { Sidebar } from './shared/sidebar/sidebar';
import { CreateUser } from './admin/createuser/createuser';
import { Profile } from './employee/profile/profile';
import { Availability } from './employee/availability/availability';

@NgModule({
  declarations: [
    App,
    Login,
    Admindashboard,
    Employeedashboard,
    Managerdashboard,
    Sidebar,
    CreateUser,
    Profile,
    Availability
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners()
  ],
  bootstrap: [App]
})
export class AppModule { }
