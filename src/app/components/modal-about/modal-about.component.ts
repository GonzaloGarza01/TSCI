import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
@Component({
  selector: 'app-modal-about',
  templateUrl: './modal-about.component.html',
  styleUrls: ['./modal-about.component.scss'],
})
export class ModalAboutComponent implements OnInit {
  name: string;
  constructor(
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {}

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    return this.modalCtrl.dismiss(this.name, 'confirm');
  }

}
