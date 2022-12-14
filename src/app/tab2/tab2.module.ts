import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab2Page } from './tab2.page';

import { Tab2PageRoutingModule } from './tab2-routing.module';
import { ModalAvisosComponent } from '../components/modal-avisos/modal-avisos.component';
import { DirectivesModule } from '../directives/directives.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    Tab2PageRoutingModule,
    DirectivesModule
  ],
  declarations: [Tab2Page, ModalAvisosComponent]
})
export class Tab2PageModule {}
