import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ShiftAssignmentsRoutingModule } from './shift-assignments-routing-module';
import { AutoAssign } from './auto-assign/auto-assign';
import { ReviewAssignments } from './review-assignments/review-assignments';

@NgModule({
  declarations: [
    AutoAssign,
    ReviewAssignments
  ],
  imports: [
    CommonModule,
    FormsModule,
    ShiftAssignmentsRoutingModule
  ]
})
export class ShiftAssignmentsModule {}
