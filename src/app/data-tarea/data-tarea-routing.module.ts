import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DataTareaPage } from './data-tarea.page';

const routes: Routes = [
  {
    path: '',
    component: DataTareaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DataTareaPageRoutingModule {}
