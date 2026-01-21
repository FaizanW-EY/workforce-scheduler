import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ShiftsRoutingModule } from './shifts-routing-module';

import { ShiftTemplatesComponent } from './shift-templates/shift-templates';
import { ShiftInstancesComponent } from './shift-instances/shift-instances';
import { ShiftPatternsComponent } from './shift-patterns/shift-patterns';

@NgModule({
  declarations: [
    ShiftTemplatesComponent,
    ShiftInstancesComponent,
    ShiftPatternsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ShiftsRoutingModule
  ]
})
export class ShiftsModule { }


