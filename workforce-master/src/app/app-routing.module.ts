import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { Admindashboard } from './admin/admindashboard/admindashboard';
import { Employeedashboard } from './employee/employeedashboard/employeedashboard';
import { Managerdashboard } from './manager/managerdashboard/managerdashboard';
import { CreateUser } from './admin/createuser/createuser';
import { Profile } from './employee/profile/profile';
import { Availability } from './employee/availability/availability';


const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },

  { path: 'admin', component: Admindashboard, children: [
      { path: 'create-user', component: CreateUser }
  ]},

  { path: 'employee', component: Employeedashboard },
  { path: 'employee/profile', component: Profile },
  { path: 'employee/availability', component: Availability },

  {
    path: 'manager',
    component: Managerdashboard,
    children: [
      {
        path: 'shifts',
        loadChildren: () =>
          import('./manager/shifts/shifts-module').then(m => m.ShiftsModule)
      },
      { path: '', redirectTo: 'shifts', pathMatch: 'full' }
    ]
  }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
