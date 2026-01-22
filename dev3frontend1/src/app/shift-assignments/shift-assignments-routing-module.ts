import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AutoAssign } from './auto-assign/auto-assign';
import { ReviewAssignments } from './review-assignments/review-assignments';

const routes: Routes = [
  { path: 'auto', component: AutoAssign },
  { path: 'review', component: ReviewAssignments }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule
  ],
  exports: [RouterModule]
})
export class ShiftAssignmentsRoutingModule { }
