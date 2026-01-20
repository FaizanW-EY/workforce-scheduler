import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'shifts',
    loadChildren: () =>
      import('./shifts/shifts-module').then(m => m.ShiftsModule)
  },
  { path: '', redirectTo: 'shifts', pathMatch: 'full' },
  { path: '**', redirectTo: 'shifts' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

