import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  constructor(
    private authSvc:AuthService,
    private toastController: ToastController,
    private router: Router,
  ) {}

  logOut(){
    this.authSvc.logout();
    this.presentToast("Cerrando sesión...");
    this.redirectUser();
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 1000
    });
    toast.present();
  }

  redirectUser(){
    this.router.navigate(['register']);
  }

  
}
