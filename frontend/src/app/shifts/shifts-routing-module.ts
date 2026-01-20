import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ShiftTemplatesComponent } from './shift-templates/shift-templates';
import { ShiftInstancesComponent } from './shift-instances/shift-instances';
import { ShiftPatternsComponent } from './shift-patterns/shift-patterns';

const routes: Routes = [
  { path: 'templates', component: ShiftTemplatesComponent },
  { path: 'instances', component: ShiftInstancesComponent },
  { path: 'patterns', component: ShiftPatternsComponent },
  { path: '', redirectTo: 'templates', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShiftsRoutingModule { }


