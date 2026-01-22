// test change
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'shift-assignments', loadChildren: () => import('./shift-assignments/shift-assignments-module').then(m => m.ShiftAssignmentsModule) }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
// temp change