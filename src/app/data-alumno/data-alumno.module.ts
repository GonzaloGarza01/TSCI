import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DataAlumnoPageRoutingModule } from './data-alumno-routing.module';

import { DataAlumnoPage } from './data-alumno.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DataAlumnoPageRoutingModule
  ],
  declarations: [DataAlumnoPage]
})
export class DataAlumnoPageModule {}
