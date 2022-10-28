import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DataTareaPageRoutingModule } from './data-tarea-routing.module';

import { DataTareaPage } from './data-tarea.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DataTareaPageRoutingModule
  ],
  declarations: [DataTareaPage]
})
export class DataTareaPageModule {}
