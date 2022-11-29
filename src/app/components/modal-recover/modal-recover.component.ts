import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-modal-recover',
  templateUrl: './modal-recover.component.html',
  styleUrls: ['./modal-recover.component.scss'],
})
export class ModalRecoverComponent implements OnInit {

  constructor(
    private modalController: ModalController,
    private toastController: ToastController,
    private autsvc: AuthService) { }

  dismissModal() {
    this.modalController.dismiss();
  }
  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 1000
    });
    toast.present();
  }
  ngOnInit() {}
  async forgotPass(email){
    try {
      await this.autsvc.resetPassword(email.value);
      console.log('Email ->', email.value);
      this.modalController.dismiss();
      this.presentToast('Correo enviado, verifique en su bandeja de correos no deseados');
      email.value = '';
    } catch (error) {
      console.log('Error -> ', error);
    }
  }
}
