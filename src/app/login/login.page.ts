import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, ToastController } from '@ionic/angular';
import { ModalRecoverComponent } from '../components/modal-recover/modal-recover.component';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  user: any={ };
  // currentRole = 'tutor';
  // tutorView: boolean = true;
  // maestroView: boolean;
  constructor(
    private authSvc:AuthService,
    private router: Router,
    private toastController: ToastController,
    private modalController: ModalController,
  ) { }

  ngOnInit() {
  }

  // handleChange(ev: Event) {
  //   this.currentRole = (ev as CustomEvent).detail.value;
  //   console.log(this.currentRole);
  //   if(this.currentRole === 'tutor'){
  //     this.tutorView = true;
  //     this.maestroView = false;
  //   }
  //   if(this.currentRole === 'maestro'){
  //     this.tutorView = false;
  //     this.maestroView = true;
  //   }
  // }

  async goModal(){
    const modal = await this.modalController.create({
      component: ModalRecoverComponent
    });
    return await modal.present();
  }


  goToWelcome(){
    this.router.navigate(['welcome']);
  }

  async onLogin(){
    try {
      const user = await this.authSvc.login(this.user.email, this.user.password);
      if(user){
      //Verificar el mail
        const isVerified = this.authSvc.isEmailVerified(user);
        this.redirectUser(isVerified);
        this.user.email = '';
        this.user.password = '';
      }
      else{
        this.presentToast('Verifique el usuario o contraseña');
      }
    } catch (error) {
      this.presentToast('Ha ocurrido un error');
      console.log('Error', error);
    }
  }

  private redirectUser(isVerified: boolean){
    if(isVerified){
       this.presentToast('Bienvenido a Aprende+');
        this.router.navigate(['tabs/asignaciones']);
    } else{
       this.presentToast('Revisa tu email para verificar la cuenta');
    }
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 1000
    });
    toast.present();
  }

}
