import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TapDirective } from './press/press.directive';



@NgModule({
  declarations: [
    TapDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    TapDirective
  ]
})
export class DirectivesModule { }
